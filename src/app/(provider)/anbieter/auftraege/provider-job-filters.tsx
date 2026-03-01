"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
};

export function ProviderJobFilters({
  categories,
  currentCategoryId,
  currentCity,
}: {
  categories: Category[];
  currentCategoryId?: string;
  currentCity?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [city, setCity] = useState(currentCity ?? "");

  function updateFilters(newCategoryId?: string, newCity?: string) {
    const params = new URLSearchParams();
    if (newCategoryId) params.set("categoryId", newCategoryId);
    if (newCity) params.set("city", newCity);
    router.push(`/anbieter/auftraege?${params.toString()}`);
  }

  function handleCategoryChange(value: string) {
    const catId = value === "all" ? "all" : value;
    updateFilters(catId, city || undefined);
  }

  function handleCitySearch() {
    updateFilters(currentCategoryId, city || undefined);
  }

  function clearFilters() {
    setCity("");
    router.push("/anbieter/auftraege");
  }

  const hasFilters = currentCategoryId || currentCity;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Select
          value={currentCategoryId ?? "all"}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Alle Kategorien" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Kategorien</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-1 gap-2">
        <Input
          placeholder="Stadt suchen..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCitySearch();
          }}
        />
        <Button variant="outline" size="icon" onClick={handleCitySearch}>
          <Search className="h-4 w-4" />
        </Button>
      </div>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="mr-1 h-4 w-4" />
          Filter zuruecksetzen
        </Button>
      )}
    </div>
  );
}
