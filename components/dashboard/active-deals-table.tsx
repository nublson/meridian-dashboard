"use client";

import * as React from "react";
import { format } from "date-fns";
import { Filter, MoreHorizontal, Search, Upload } from "lucide-react";
import { useDeals } from "@/lib/hooks/use-deals";
import type { DateRangePreset, DealStage } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ALL_STAGES: DealStage[] = [
  "Negotiation",
  "Proposal Sent",
  "Qualified",
  "Discovery",
];

function stageBadgeClass(stage: DealStage) {
  switch (stage) {
    case "Negotiation":
      return "border-transparent bg-primary/15 text-primary";
    case "Proposal Sent":
      return "border-transparent bg-chart-2/20 text-foreground";
    case "Qualified":
      return "border-transparent bg-success/15 text-success";
    case "Discovery":
      return "border-transparent bg-muted text-muted-foreground";
    default:
      return "";
  }
}

export function ActiveDealsTable({
  dateRange,
  onExportContextChange,
}: {
  dateRange: DateRangePreset;
  onExportContextChange?: (ctx: { q: string; stages: DealStage[] }) => void;
}) {
  const [q, setQ] = React.useState("");
  const [debouncedQ, setDebouncedQ] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [stages, setStages] = React.useState<DealStage[]>([]);

  React.useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQ(q), 300);
    return () => window.clearTimeout(t);
  }, [q]);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedQ, stages, pageSize, dateRange]);

  React.useEffect(() => {
    onExportContextChange?.({ q: debouncedQ, stages });
  }, [debouncedQ, stages, onExportContextChange]);

  const { data, isPending, isError } = useDeals({
    dateRange,
    q: debouncedQ,
    stages: stages.length ? stages : undefined,
    page,
    pageSize,
  });

  function toggleStage(stage: DealStage, checked: boolean) {
    setStages((prev) =>
      checked ? [...prev, stage] : prev.filter((s) => s !== stage),
    );
  }

  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pageNumbers = React.useMemo(() => {
    const windowSize = 5;
    let startPg = Math.max(1, page - 2);
    const endPg = Math.min(totalPages, startPg + windowSize - 1);
    startPg = Math.max(1, endPg - windowSize + 1);
    const nums: number[] = [];
    for (let i = startPg; i <= endPg; i++) nums.push(i);
    return nums;
  }, [page, totalPages]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold tracking-tight">
          Active Deals{" "}
          <span className="text-muted-foreground font-normal">
            ({total.toLocaleString()})
          </span>
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search deals..."
              className="pl-9"
              aria-label="Search deals"
            />
          </div>
          <Popover>
            <PopoverTrigger
              render={
                <Button variant="outline" size="sm">
                  <Filter data-icon="inline-start" />
                  Filter
                  {stages.length > 0 ? (
                    <Badge variant="secondary" className="ml-1 rounded-sm px-1">
                      {stages.length}
                    </Badge>
                  ) : null}
                </Button>
              }
            />
            <PopoverContent className="w-56" align="end">
              <p className="mb-2 text-sm font-medium">Stages</p>
              <div className="flex flex-col gap-2">
                {ALL_STAGES.map((stage) => (
                  <label
                    key={stage}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={stages.includes(stage)}
                      onCheckedChange={(v) =>
                        toggleStage(stage, v === true)
                      }
                    />
                    {stage}
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm" type="button">
            <Upload data-icon="inline-start" />
            Import
          </Button>
        </div>
      </div>

      <div className="border-border overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Deal Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Expected Close</TableHead>
              <TableHead className="w-10 text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell colSpan={8} className="text-destructive h-24 text-center">
                  Failed to load deals.
                </TableCell>
              </TableRow>
            ) : isPending ? (
              <TableRow>
                <TableCell colSpan={8} className="text-muted-foreground h-24 text-center">
                  Loading deals…
                </TableCell>
              </TableRow>
            ) : !data?.deals.length ? (
              <TableRow>
                <TableCell colSpan={8} className="text-muted-foreground h-24 text-center">
                  No deals match your filters.
                </TableCell>
              </TableRow>
            ) : (
              data.deals.map((deal, idx) => (
                <TableRow key={deal.id}>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {(page - 1) * pageSize + idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">
                          {deal.dealInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{deal.dealName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{deal.client}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("font-normal", stageBadgeClass(deal.stage))}
                    >
                      {deal.stage}
                    </Badge>
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatCurrency(deal.value)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarFallback className="text-[10px]">
                          {deal.owner.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{deal.owner.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {format(new Date(deal.expectedClose), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            aria-label="Row actions"
                          />
                        }
                      >
                        <MoreHorizontal />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>View deal</DropdownMenuItem>
                          <DropdownMenuItem>Edit stage</DropdownMenuItem>
                          <DropdownMenuItem>Assign owner</DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground whitespace-nowrap">
            Rows per page
          </span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              if (v) setPageSize(Number(v));
            }}
          >
            <SelectTrigger size="sm" className="w-[72px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <span className="text-muted-foreground whitespace-nowrap">
            {start}-{end} of {total.toLocaleString()}
          </span>
        </div>

        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                className={cn(page <= 1 && "pointer-events-none opacity-40")}
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
              />
            </PaginationItem>
            {pageNumbers.map((num) => (
              <PaginationItem key={num}>
                <PaginationLink
                  href="#"
                  isActive={num === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(num);
                  }}
                >
                  {num}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                className={cn(
                  page >= totalPages && "pointer-events-none opacity-40",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
