"use client";

import * as React from "react";
import { Code2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SearchCommand, SearchTriggerButton } from "@/components/search-command";

export function DashboardHeader({ title }: { title: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <>
      <header className="bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 backdrop-blur">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="mr-1 hidden h-6 md:block"
          />
          <h1 className="text-foreground text-sm font-semibold md:text-base">
            {title}
          </h1>
        </div>
        <div className="mx-auto hidden max-w-md flex-1 justify-center md:flex">
          <SearchTriggerButton onClick={() => setSearchOpen(true)} />
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <span className="sr-only">Search</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle theme"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun />
            ) : (
              <Moon />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            render={
              <a
                href="https://github.com/nublson/meridian-dashboard"
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            nativeButton={false}
            aria-label="View Meridian dashboard on GitHub"
          >
            <Code2 />
          </Button>
        </div>
      </header>
      <SearchCommand onOpenChange={setSearchOpen} open={searchOpen} />
    </>
  );
}
