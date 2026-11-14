import type { Metadata } from "next";
import { TextPage } from "@/components/TextPage";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${site.name} handles your data. Files you process never leave your device.`,
  path: "/privacy",
});

export default function Page() {
  return (
    <TextPage title="Privacy Policy">
      <p>Last updated: November 14, 2026</p>
      <p>
        This Privacy Policy explains what information {site.name} (“we”, “us”) collects when you use {site.url} and how
        it is used.
      </p>

      <h2>Your files stay on your device</h2>
      <p>
        All file tools on this site (for example image converters and compressors) run entirely inside your web browser.
        The files you select are processed on your own device and are <strong>never uploaded</strong> to our servers or
        any third party. We cannot see, store or access your files.
      </p>

      <h2>Information collected automatically</h2>
      <p>Like most websites, we and our partners collect limited technical information when you visit, such as:</p>
      <ul>
        <li>Browser type, device type, operating system and screen size</li>
        <li>Pages visited, time spent and the website that referred you</li>
        <li>Approximate location (country/region) derived from your IP address</li>
        <li>Anonymous tool usage events (for example, that a conversion was completed — never the file itself)</li>
      </ul>

      <h2>Analytics</h2>
      <p>
        We use Google Analytics 4 to understand how visitors use the site so we can improve it and decide which tools to
        build next. Google Analytics uses cookies and similar technologies. Learn more at{" "}
        <a href="https://policies.google.com/technologies/partner-sites" rel="noopener noreferrer" target="_blank">
          How Google uses data from sites that use its services
        </a>
        . You can opt out with the{" "}
        <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener noreferrer" target="_blank">
          Google Analytics opt-out browser add-on
        </a>
        .
      </p>

      <h2>Advertising</h2>
      <p>
        We show ads to keep the tools free. Third-party ad networks (such as Adsterra and, in the future, Google AdSense)
        may use cookies, web beacons and similar technologies to serve ads and measure their performance, which may be
        based on your visits to this and other websites. Google’s use of advertising cookies enables it and its partners
        to serve ads based on your visits. You can opt out of personalized advertising at{" "}
        <a href="https://www.google.com/settings/ads" rel="noopener noreferrer" target="_blank">
          Google Ads Settings
        </a>{" "}
        or{" "}
        <a href="https://www.aboutads.info/choices/" rel="noopener noreferrer" target="_blank">
          aboutads.info
        </a>
        .
      </p>

      <h2>Cookies</h2>
      <p>
        You can block or delete cookies in your browser settings. The tools themselves keep working without cookies.
      </p>

      <h2>Your privacy rights (including California residents)</h2>
      <p>
        Depending on where you live, including under the California Consumer Privacy Act (CCPA/CPRA), you may have the
        right to know what personal information is collected, to request deletion, and to opt out of the “sale” or
        “sharing” of personal information for targeted advertising. We do not sell personal information for money. To
        exercise your rights, contact us at <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. You can also
        enable Global Privacy Control in your browser.
      </p>

      <h2>Children’s privacy</h2>
      <p>
        This site is not directed to children under 13, and we do not knowingly collect personal information from
        children.
      </p>

      <h2>Changes to this policy</h2>
      <p>We may update this policy from time to time. The “Last updated” date above shows when it last changed.</p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>
    </TextPage>
  );
}
