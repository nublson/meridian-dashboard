"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  LayoutDashboard,
  Mail,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const routes = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Assistant", href: "/dashboard", icon: Sparkles },
  { label: "Leads", href: "/dashboard", icon: Users },
  { label: "Emails", href: "/dashboard", icon: Mail },
  { label: "Calendar", href: "/dashboard", icon: Calendar },
  { label: "Contacts", href: "/dashboard", icon: Users },
];

export function SearchCommand({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  return (
    <CommandDialog onOpenChange={onOpenChange} open={open}>
      <Command>
        <CommandInput placeholder="Search anything..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {routes.map((item) => (
              <CommandItem
                key={item.href + item.label}
                onSelect={() => {
                  router.push(item.href);
                  onOpenChange(false);
                }}
              >
                <item.icon />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

export function SearchTriggerButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-muted/50 text-muted-foreground hover:bg-muted flex h-9 w-full max-w-md min-w-[200px] items-center gap-2 rounded-lg border border-border px-3 text-sm"
    >
      <Search className="size-4 shrink-0 opacity-60" />
      <span className="flex-1 truncate text-left">Search anything...</span>
      <kbd className="bg-background pointer-events-none hidden h-5 items-center gap-0.5 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  );
}
