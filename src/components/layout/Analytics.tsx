import Script from "next/script";
import { site } from "@/config/site";

/** Google Analytics 4. Renders nothing unless NEXT_PUBLIC_GA_ID is set. */
export function Analytics() {
  if (!site.gaId) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${site.gaId}');`}
      </Script>
    </>
  );
}
