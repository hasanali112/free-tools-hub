import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";
import { pageMetadata } from "@/lib/seo";
import { getCategory } from "@/tools/registry";

const category = getCategory("calculator");

export const metadata: Metadata = pageMetadata({ title: category.title, description: category.description, path: "/calculator" });

export default function Page() {
  return <CategoryPage slug="calculator" />;
}
