import { getAllCategories } from "@/lib/actions/category.actions";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await getAllCategories();
  return NextResponse.json(categories);
}
