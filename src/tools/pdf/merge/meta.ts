import type { ToolMeta } from "@/tools/types";

export const meta: ToolMeta = {
  slug: "merge-pdf",
  category: "pdf",
  path: "/pdf/merge",
  name: "Merge PDF",
  h1: "Merge PDF Files — Free, No Upload",
  title: "Merge PDF Files Online — Free, Combine PDFs, No Upload",
  description:
    "Combine multiple PDF files into one PDF for free. Choose the order, then merge in seconds. Your files never leave your device — no upload, no sign-up.",
  summary: "Combine several PDFs into one file, in the order you choose.",
  keywords: ["merge", "combine", "join", "pdf", "documents", "one file"],
  howTo: [
    "Drop two or more PDF files into the box, or tap to choose them.",
    "Arrange them in the order you want using the arrows.",
    "Press Merge and download your combined PDF.",
  ],
  faqs: [
    {
      q: "Are my PDFs uploaded to a server?",
      a: "No. Merging happens entirely in your browser, so your documents never leave your device. That makes it safe for contracts, tax forms and medical records.",
    },
    {
      q: "Is there a limit on files or pages?",
      a: "There is no fixed limit. Very large files use more memory, so on an older phone it's best to merge up to a few hundred pages at a time.",
    },
    {
      q: "Will the quality of my PDFs change?",
      a: "No. Pages are copied exactly as they are — text stays selectable and images are not re-compressed.",
    },
    {
      q: "Can I merge password-protected PDFs?",
      a: "Not directly. Open the PDF with its password and save a copy without protection first, then merge that copy.",
    },
    {
      q: "How do I change the order of the files?",
      a: "Use the up and down arrows next to each file, or press “Sort by name” to order them alphabetically.",
    },
  ],
  related: ["split-pdf", "compress-pdf", "jpg-to-pdf", "pdf-to-jpg"],
};
