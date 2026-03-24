"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  CheckSquare,
  ChevronRight,
  Globe,
  HelpCircle,
  LayoutDashboard,
  Mail,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mainNav = [
  { title: "AI Assistant", href: "/dashboard", icon: Sparkles, accent: true },
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Leads", href: "/dashboard", icon: Users },
  { title: "Emails", href: "/dashboard", icon: Mail },
  { title: "Calendar", href: "/dashboard", icon: Calendar },
  { title: "Tasks", href: "/dashboard", icon: CheckSquare },
  { title: "Contacts", href: "/dashboard", icon: Users },
];

const folders = [
  { title: "TechCorp Upgrade", status: "bg-chart-1" },
  { title: "Fintra Expansion", status: "bg-chart-3" },
  { title: "Nova Redesign", status: "bg-chart-4" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-col gap-3 border-b border-sidebar-border p-3">
        <div className="flex items-center gap-2 px-1">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg text-sm font-bold">
            C
          </div>
          <span className="truncate text-base font-semibold tracking-tight">
            Cliento
          </span>
        </div>
        <div className="bg-sidebar-accent/40 flex flex-col gap-0.5 rounded-lg border border-sidebar-border p-3">
          <p className="text-sm font-medium">Synclead</p>
          <p className="text-muted-foreground text-xs">16 Members</p>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-1 px-2 py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-0.5">
              {mainNav.map((item) => {
                const active =
                  item.title === "Dashboard" && pathname.startsWith("/dashboard");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={active}
                      render={<Link href={item.href} />}
                      tooltip={item.title}
                      className={
                        item.accent
                          ? "text-primary data-active:text-primary"
                          : undefined
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <Collapsible className="group/collapsible" defaultOpen>
            <SidebarGroupLabel className="p-0">
              <CollapsibleTrigger className="text-sidebar-foreground/70 hover:text-sidebar-foreground flex h-8 w-full items-center gap-1 rounded-md px-2 text-xs font-medium ring-sidebar-ring outline-hidden focus-visible:ring-2">
                Folders
                <ChevronRight className="ml-auto size-4 transition-transform group-data-open/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu className="flex flex-col gap-0.5">
                  {folders.map((folder) => (
                    <SidebarMenuItem key={folder.title}>
                      <SidebarMenuButton render={<Link href="/dashboard" />}>
                        <span
                          className={`size-2 shrink-0 rounded-full ${folder.status}`}
                        />
                        <span className="truncate">{folder.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex flex-col gap-2 border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/dashboard" />}>
              <HelpCircle />
              <span>Help Center</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/dashboard" />}>
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="https://example.com" />}>
              <Globe />
              <span className="truncate">square.indev.me</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="bg-sidebar-accent/30 flex items-center gap-2 rounded-lg p-2">
          <Avatar className="size-9">
            <AvatarFallback>LN</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="truncate text-sm font-medium">John Doe</p>
            <p className="text-muted-foreground truncate text-xs">
              john@example.com
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
