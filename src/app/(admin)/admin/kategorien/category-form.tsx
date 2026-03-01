"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createCategory } from "@/actions/admin";
import { Plus } from "lucide-react";

export function CategoryForm() {
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const icon = formData.get("icon") as string;

    if (!name?.trim() || !slug?.trim()) return;

    setPending(true);
    try {
      await createCategory(name.trim(), slug.trim(), icon?.trim() || "");
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex-1 space-y-2">
        <Label htmlFor="cat-name">Name</Label>
        <Input
          id="cat-name"
          name="name"
          placeholder="z.B. Malerarbeiten"
          required
        />
      </div>
      <div className="flex-1 space-y-2">
        <Label htmlFor="cat-slug">Slug</Label>
        <Input
          id="cat-slug"
          name="slug"
          placeholder="z.B. malerarbeiten"
          required
        />
      </div>
      <div className="w-full sm:w-40 space-y-2">
        <Label htmlFor="cat-icon">Icon</Label>
        <Input
          id="cat-icon"
          name="icon"
          placeholder="z.B. Paintbrush"
        />
      </div>
      <Button type="submit" disabled={pending} className="shrink-0">
        <Plus className="h-4 w-4 mr-1" />
        {pending ? "Erstelle..." : "Erstellen"}
      </Button>
    </form>
  );
}
