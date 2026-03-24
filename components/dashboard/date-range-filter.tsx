"use client";

import type { DateRangePreset } from "@/lib/types";
import { DATE_RANGE_LABELS } from "@/lib/date-range-labels";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OPTIONS: { value: DateRangePreset; label: string }[] = (
  ["7d", "30d", "3m", "6m", "ytd"] as const
).map((value) => ({ value, label: DATE_RANGE_LABELS[value] }));

export function DateRangeFilter({
  value,
  onChange,
}: {
  value: DateRangePreset;
  onChange: (next: DateRangePreset) => void;
}) {
  return (
    <Select
      value={value}
      onValueChange={(v) => {
        if (v) onChange(v as DateRangePreset);
      }}
    >
      <SelectTrigger size="sm" className="w-[160px] md:w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
