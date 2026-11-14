import type { Metadata } from "next";
import { TextPage } from "@/components/TextPage";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description: `Contact the ${site.name} team with questions, feedback, bug reports or tool ideas.`,
  path: "/contact",
});

export default function Page() {
  return (
    <TextPage title="Contact Us">
      <p>We’d love to hear from you — questions, feedback, bug reports and ideas for new tools are all welcome.</p>
      <p>
        Email: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
      </p>
      <p>
        When reporting a problem, please tell us which tool you used, your device and browser (for example “iPhone 15,
        Safari”), and what happened. Please don’t send us private files — our tools work entirely in your browser, so we
        never need them.
      </p>
      <p>We usually reply within 2 business days.</p>
    </TextPage>
  );
}
