import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";
import { pageMetadata } from "@/lib/seo";
import { getCategory } from "@/tools/registry";

const category = getCategory("pdf");

export const metadata: Metadata = pageMetadata({ title: category.title, description: category.description, path: "/pdf" });

export default function Page() {
  return <CategoryPage slug="pdf" />;
}
