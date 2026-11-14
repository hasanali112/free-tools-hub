export interface ProcessResult {
  blob: Blob;
  name: string;
  /** Optional short note shown next to the result (e.g. "GPS location removed"). */
  note?: string;
}

export type ProgressFn = (fraction: number) => void;

/** One file in → one or more files out (e.g. convert, split a PDF into pages). */
export type Processor = (file: File, onProgress: ProgressFn) => Promise<ProcessResult | ProcessResult[]>;

/** Many files in (in the user's chosen order) → one file out (e.g. merge PDFs). */
export type Combiner = (files: File[], onProgress: ProgressFn) => Promise<ProcessResult>;
