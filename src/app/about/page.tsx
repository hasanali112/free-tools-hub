import type { Metadata } from "next";
import Link from "next/link";
import { TextPage } from "@/components/TextPage";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description: `${site.name} offers free online tools for images, PDFs, video and everyday calculations — all running privately in your browser.`,
  path: "/about",
});

export default function Page() {
  return (
    <TextPage title={`About ${site.name}`}>
      <p>
        {site.name} is a collection of free, simple online tools for everyday tasks: converting iPhone photos, shrinking
        images for online forms, resizing pictures for passports and social media, and more.
      </p>
      <h2>Privacy by design</h2>
      <p>
        Most online converters upload your files to their servers. Ours don’t. Every tool on this site processes your
        files directly in your web browser using modern web technology, so your photos and documents never leave your
        device. That makes the tools faster and keeps your private files private.
      </p>
      <h2>Free to use</h2>
      <p>
        All tools are free, with no sign-up and no watermarks. The site is supported by advertising, which we keep away
        from the tools themselves so they stay easy to use.
      </p>
      <h2>Get in touch</h2>
      <p>
        Have an idea for a new tool or found a problem? <Link href="/contact">Contact us</Link> — we read every message.
      </p>
    </TextPage>
  );
}
