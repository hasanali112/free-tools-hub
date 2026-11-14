"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { formatBytes, sizeChange } from "@/lib/format";
import type { Combiner, ProcessResult, Processor } from "./types";

type Status = "pending" | "processing" | "done" | "error";

interface Output {
  result: ProcessResult;
  url: string;
}

interface Item {
  id: number;
  file: File;
  status: Status;
  progress: number;
  outputs: Output[];
  error?: string;
}

interface Combined {
  status: Status;
  progress: number;
  output?: Output;
  error?: string;
}

export interface FileToolProps {
  /** Tool slug, used for analytics. */
  tool: string;
  /** Value for the file input's `accept` attribute. */
  accept: string;
  /** Short list of accepted formats shown to the user, e.g. "HEIC, HEIF". */
  formatsLabel: string;
  /** Optional extra check for dropped files (drag & drop ignores `accept`). */
  isAccepted?: (file: File) => boolean;
  /** Button text, e.g. "Convert". */
  actionLabel: string;
  /** Options UI rendered above the action button. */
  options?: React.ReactNode;
  /** Change this value whenever options change, so finished results are marked as outdated. */
  optionsKey?: string;
  /** Per-file mode: each file is processed on its own (may produce several outputs). */
  process?: Processor;
  /**
   * Combine mode: all files, in the order the user arranged them, become one output.
   * When set, the file list can be reordered and `process` is ignored.
   */
  combine?: Combiner;
  /** Minimum number of files before the action button is enabled (combine mode). */
  minFiles?: number;
}

let nextId = 1;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const errorText = (e: unknown) =>
  e instanceof Error && e.message ? e.message : "Something went wrong with this file.";

/**
 * Shared UI for every "files in → files out" tool:
 * drag & drop, batch processing, progress, before/after sizes, single and ZIP downloads.
 */
export function FileTool({
  tool,
  accept,
  formatsLabel,
  isAccepted,
  actionLabel,
  options,
  optionsKey = "",
  process,
  combine,
  minFiles = 1,
}: FileToolProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [combined, setCombined] = useState<Combined | null>(null);
  const [running, setRunning] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [rejected, setRejected] = useState<string[]>([]);
  const [processedKey, setProcessedKey] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const usedRef = useRef(false);
  const urlsRef = useRef(new Set<string>());
  const combineMode = !!combine;

  // Free memory held by result URLs when leaving the page.
  useEffect(() => {
    const urls = urlsRef.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const makeOutput = (result: ProcessResult): Output => {
    const url = URL.createObjectURL(result.blob);
    urlsRef.current.add(url);
    return { result, url };
  };
  const revoke = (outs: (Output | undefined)[]) =>
    outs.forEach((o) => {
      if (!o) return;
      URL.revokeObjectURL(o.url);
      urlsRef.current.delete(o.url);
    });

  const patch = (id: number, p: Partial<Item>) =>
    setItems((list) => list.map((it) => (it.id === id ? { ...it, ...p } : it)));

  function resetCombined() {
    revoke([combined?.output]);
    setCombined(null);
  }

  function addFiles(list: FileList | File[]) {
    const files = Array.from(list);
    const ok = isAccepted ? files.filter(isAccepted) : files;
    setRejected(files.filter((f) => !ok.includes(f)).map((f) => f.name));
    if (!ok.length) return;
    if (!usedRef.current) {
      usedRef.current = true;
      track("tool_used", { tool_name: tool });
    }
    if (combineMode) resetCombined();
    setItems((prev) => [
      ...prev,
      ...ok.map((file) => ({ id: nextId++, file, status: "pending" as Status, progress: 0, outputs: [] })),
    ]);
  }

  async function runEach() {
    if (!process) return;
    for (const item of items) {
      revoke(item.outputs);
      patch(item.id, { status: "processing", progress: 0.02, outputs: [], error: undefined });
      // Let the browser paint the progress state before heavy work starts.
      await sleep(16);
      try {
        const res = await process(item.file, (p) => patch(item.id, { progress: Math.max(0.02, Math.min(1, p)) }));
        const outputs = (Array.isArray(res) ? res : [res]).map(makeOutput);
        patch(item.id, { status: "done", progress: 1, outputs });
        track("file_converted", { tool_name: tool, input_type: item.file.type || "unknown", output_count: outputs.length });
      } catch (e) {
        console.error(e);
        patch(item.id, { status: "error", progress: 0, error: errorText(e) });
      }
    }
  }

  async function runCombined() {
    if (!combine) return;
    revoke([combined?.output]);
    setCombined({ status: "processing", progress: 0.02 });
    await sleep(16);
    try {
      const result = await combine(
        items.map((it) => it.file),
        (p) => setCombined({ status: "processing", progress: Math.max(0.02, Math.min(1, p)) }),
      );
      setCombined({ status: "done", progress: 1, output: makeOutput(result) });
      track("file_converted", { tool_name: tool, input_type: "combined", input_count: items.length });
    } catch (e) {
      console.error(e);
      setCombined({ status: "error", progress: 0, error: errorText(e) });
    }
  }

  async function run() {
    if (running || items.length < minFiles) return;
    setRunning(true);
    const key = optionsKey;
    await (combineMode ? runCombined() : runEach());
    setProcessedKey(key);
    setRunning(false);
  }

  function remove(id: number) {
    revoke(items.find((it) => it.id === id)?.outputs ?? []);
    if (combineMode) resetCombined();
    setItems((list) => list.filter((it) => it.id !== id));
  }

  function move(id: number, delta: number) {
    resetCombined();
    setItems((list) => {
      const i = list.findIndex((it) => it.id === id);
      const j = i + delta;
      if (i < 0 || j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function sortByName() {
    resetCombined();
    setItems((list) =>
      [...list].sort((a, b) => a.file.name.localeCompare(b.file.name, undefined, { numeric: true, sensitivity: "base" })),
    );
  }

  function clearAll() {
    items.forEach((it) => revoke(it.outputs));
    resetCombined();
    setItems([]);
    setRejected([]);
    setProcessedKey(null);
  }

  const allOutputs = items.flatMap((it) => it.outputs);

  async function downloadZip() {
    if (!allOutputs.length) return;
    setZipping(true);
    try {
      const { zip } = await import("fflate");
      const used = new Set<string>();
      const entries: Record<string, [Uint8Array, { level: 0 }]> = {};
      for (const o of allOutputs) {
        entries[uniqueName(o.result.name, used)] = [new Uint8Array(await o.result.blob.arrayBuffer()), { level: 0 }];
      }
      const data = await new Promise<Uint8Array>((resolve, reject) =>
        zip(entries, (err, out) => (err ? reject(err) : resolve(out))),
      );
      const url = URL.createObjectURL(new Blob([data as BlobPart], { type: "application/zip" }));
      saveUrl(url, `${tool}-${allOutputs.length}-files.zip`);
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
      track("download_clicked", { tool_name: tool, download_type: "zip", file_count: allOutputs.length });
    } finally {
      setZipping(false);
    }
  }

  const total = items.length;
  const doneCount = items.filter((it) => it.status === "done").length;
  const overall = combineMode
    ? (combined?.progress ?? 0)
    : total
      ? items.reduce((s, it) => s + (it.status === "error" ? 1 : it.progress), 0) / total
      : 0;
  const hasResults = combineMode ? combined?.status === "done" : doneCount > 0;
  const outdated = processedKey !== null && processedKey !== optionsKey && !running && hasResults;
  const totalBefore = combineMode
    ? items.reduce((s, it) => s + it.file.size, 0)
    : items.reduce((s, it) => s + (it.outputs.length ? it.file.size : 0), 0);
  const totalAfter = combineMode
    ? (combined?.output?.result.blob.size ?? 0)
    : allOutputs.reduce((s, o) => s + o.result.blob.size, 0);
  const tooFew = total < minFiles;

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-xl shadow-brand-900/5 sm:p-6">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Choose files (${formatsLabel})`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), inputRef.current?.click())}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-12 text-center transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 ${
          dragging ? "border-brand-500 bg-brand-50" : "border-brand-200 bg-gradient-to-b from-brand-50/70 to-white hover:border-brand-400 hover:bg-brand-50"
        }`}
      >
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg shadow-brand-600/30">
          <svg aria-hidden className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0-4 4m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
        </span>
        <p className="text-base font-semibold text-slate-800">
          <span className="text-brand-700">Choose files</span> or drag them here
        </p>
        <p className="mt-1 text-sm text-slate-500">{formatsLabel} · Add as many as you like</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-brand-700">
        <svg aria-hidden className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 1 0-8 0v4m-2 0h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z" />
        </svg>
        Your files never leave your device — everything runs in your browser.
      </p>

      {rejected.length > 0 && (
        <p role="alert" className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Skipped {rejected.length} file{rejected.length > 1 ? "s" : ""} in an unsupported format: {rejected.slice(0, 3).join(", ")}
          {rejected.length > 3 ? "…" : ""}. Supported: {formatsLabel}.
        </p>
      )}

      {options && <div className="mt-5 space-y-4">{options}</div>}

      {total > 0 && (
        <>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={run}
              disabled={running || tooFew}
              className="btn-primary h-12 flex-1 text-base"
            >
              {running
                ? combineMode
                  ? `Working… ${Math.round(overall * 100)}%`
                  : `Working… ${doneCount}/${total}`
                : tooFew
                  ? `Add at least ${minFiles} files`
                  : `${actionLabel} ${total} file${total > 1 ? "s" : ""}`}
            </button>
            {!combineMode && allOutputs.length > 1 && (
              <button
                type="button"
                onClick={downloadZip}
                disabled={zipping || running}
                className="btn-secondary h-12 text-base"
              >
                {zipping ? "Preparing ZIP…" : `Download all (${allOutputs.length}) as ZIP`}
              </button>
            )}
            <button
              type="button"
              onClick={clearAll}
              disabled={running}
              className="btn-ghost h-12 text-sm"
            >
              Clear
            </button>
          </div>

          {(running || hasResults) && (
            <div className="mt-4">
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-slate-200"
                role="progressbar"
                aria-label="Overall progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(overall * 100)}
              >
                <div className="h-full rounded-full bg-brand-gradient transition-[width] duration-300" style={{ width: `${overall * 100}%` }} />
              </div>
              {hasResults && !running && !combineMode && (
                <p className="mt-2 text-sm text-slate-600">
                  {doneCount} of {total} done · {formatBytes(totalBefore)} → <strong>{formatBytes(totalAfter)}</strong> (
                  {sizeChange(totalBefore, totalAfter)})
                </p>
              )}
            </div>
          )}

          {outdated && (
            <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800">
              Settings changed — press “{actionLabel}” again to apply them.
            </p>
          )}

          {combineMode && combined?.status === "error" && (
            <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {combined.error}
            </p>
          )}

          {combineMode && combined?.output && (
            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{combined.output.result.name}</p>
                <p className="text-sm text-slate-600">
                  {total} file{total > 1 ? "s" : ""} · {formatBytes(totalBefore)} → <strong>{formatBytes(totalAfter)}</strong>
                  {combined.output.result.note && <> · {combined.output.result.note}</>}
                </p>
              </div>
              <DownloadLink output={combined.output} tool={tool} big />
            </div>
          )}

          {combineMode && total > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
              <span>Files are combined in this order. Use the arrows to reorder.</span>
              <button type="button" onClick={sortByName} disabled={running} className="font-medium text-brand-700 hover:underline disabled:opacity-50">
                Sort by name
              </button>
            </div>
          )}

          <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200">
            {items.map((it, i) => (
              <FileRow
                key={it.id}
                item={it}
                tool={tool}
                disabled={running}
                onRemove={() => remove(it.id)}
                reorder={
                  combineMode
                    ? { index: i, count: total, up: () => move(it.id, -1), down: () => move(it.id, 1) }
                    : undefined
                }
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function FileRow({
  item,
  tool,
  disabled,
  onRemove,
  reorder,
}: {
  item: Item;
  tool: string;
  disabled: boolean;
  onRemove: () => void;
  reorder?: { index: number; count: number; up: () => void; down: () => void };
}) {
  const { file, status, outputs, error, progress } = item;
  const single = outputs.length === 1 ? outputs[0] : undefined;
  const outSize = outputs.reduce((s, o) => s + o.result.blob.size, 0);
  const preview = single?.result.blob.type.startsWith("image/") ? single.url : undefined;

  return (
    <li className="p-3">
      <div className="flex items-center gap-3">
        {reorder && (
          <div className="flex flex-col">
            <ArrowButton dir="up" label={`Move ${file.name} up`} onClick={reorder.up} disabled={disabled || reorder.index === 0} />
            <ArrowButton
              dir="down"
              label={`Move ${file.name} down`}
              onClick={reorder.down}
              disabled={disabled || reorder.index === reorder.count - 1}
            />
          </div>
        )}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- local blob preview
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[10px] font-bold uppercase text-slate-400">{file.name.split(".").pop()?.slice(0, 4)}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-800" title={single?.result.name ?? file.name}>
            {single?.result.name ?? file.name}
          </p>
          <p className="text-xs text-slate-500">
            {status === "done" && outputs.length ? (
              <>
                {formatBytes(file.size)} → {outputs.length > 1 && <>{outputs.length} files · </>}
                <strong className="text-slate-700">{formatBytes(outSize)}</strong>{" "}
                {outputs.length === 1 && (
                  <span className={outSize < file.size ? "text-emerald-700" : "text-slate-500"}>
                    ({sizeChange(file.size, outSize)})
                  </span>
                )}
                {single?.result.note && <span className="text-slate-500"> · {single.result.note}</span>}
              </>
            ) : status === "error" ? (
              <span className="text-red-600">{error}</span>
            ) : status === "processing" ? (
              <>Processing… {Math.round(progress * 100)}%</>
            ) : (
              <>{formatBytes(file.size)}</>
            )}
          </p>
          {status === "processing" && (
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full bg-brand-500 transition-[width]" style={{ width: `${progress * 100}%` }} />
            </div>
          )}
        </div>
        {single && <DownloadLink output={single} tool={tool} />}
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          aria-label={`Remove ${file.name}`}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
        >
          <svg aria-hidden className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      {outputs.length > 1 && (
        <details className="mt-2 rounded-lg bg-slate-50 px-3 py-2" open={outputs.length <= 6}>
          <summary className="cursor-pointer text-sm font-medium text-slate-700">
            {outputs.length} files from {file.name}
          </summary>
          <ul className="mt-2 space-y-1.5">
            {outputs.map((o) => (
              <li key={o.url} className="flex items-center gap-2 text-sm">
                <span className="min-w-0 flex-1 truncate text-slate-700">{o.result.name}</span>
                <span className="text-xs text-slate-500">{formatBytes(o.result.blob.size)}</span>
                <DownloadLink output={o} tool={tool} small />
              </li>
            ))}
          </ul>
        </details>
      )}
    </li>
  );
}

function DownloadLink({ output, tool, small, big }: { output: Output; tool: string; small?: boolean; big?: boolean }) {
  return (
    <a
      href={output.url}
      download={output.result.name}
      onClick={() => track("download_clicked", { tool_name: tool, download_type: "single", file_count: 1 })}
      className={`inline-flex shrink-0 items-center justify-center rounded-lg bg-brand-gradient font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:brightness-110 ${
        small ? "h-8 px-2.5 text-xs" : big ? "h-12 px-6 text-base" : "h-10 px-3 text-sm"
      }`}
    >
      Download
    </a>
  );
}

function ArrowButton({ dir, label, onClick, disabled }: { dir: "up" | "down"; label: string; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex h-6 w-8 items-center justify-center rounded text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-25"
    >
      <svg aria-hidden className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d={dir === "up" ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
      </svg>
    </button>
  );
}

function uniqueName(name: string, used: Set<string>) {
  let candidate = name;
  let n = 1;
  while (used.has(candidate.toLowerCase())) {
    candidate = name.replace(/(\.[^.]+)?$/, (ext) => ` (${n})${ext}`);
    n++;
  }
  used.add(candidate.toLowerCase());
  return candidate;
}

function saveUrl(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
