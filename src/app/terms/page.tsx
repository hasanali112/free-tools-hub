import type { Metadata } from "next";
import { TextPage } from "@/components/TextPage";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description: `The terms and conditions for using ${site.name}.`,
  path: "/terms",
});

export default function Page() {
  return (
    <TextPage title="Terms of Use">
      <p>Last updated: November 14, 2026</p>
      <p>
        By using {site.name} at {site.url} (the “Site”), you agree to these Terms of Use. If you do not agree, please do
        not use the Site.
      </p>

      <h2>Use of the tools</h2>
      <p>
        The tools are provided free of charge for personal and commercial use. You may not use the Site for anything
        unlawful, try to disrupt it, or copy it in bulk with automated tools.
      </p>

      <h2>Your files and content</h2>
      <p>
        Files are processed locally in your browser and are not uploaded to us. You are responsible for the files you
        process and must have the right to use them. You keep all rights to your content.
      </p>

      <h2>No warranty</h2>
      <p>
        The Site and tools are provided “as is” and “as available” without warranties of any kind. We do not guarantee
        that results will be error-free or meet any specific requirement — for example, a resized photo meeting every
        official passport or visa rule. Always check the requirements of the organization you submit files to, and keep a
        copy of your original files.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {site.name} is not liable for any indirect, incidental or consequential
        damages, or for any loss of data, arising from your use of the Site.
      </p>

      <h2>Third-party links and ads</h2>
      <p>
        The Site shows advertising and may link to other websites. We are not responsible for the content or practices of
        third-party sites or advertisers.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms at any time. Continued use of the Site means you accept the updated terms.</p>

      <h2>Contact</h2>
      <p>
        Questions? Email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>
    </TextPage>
  );
}
