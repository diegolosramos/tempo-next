"use client";

import { CloudSun, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WireframeNav } from "@/components/wireframe";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/sse",
    label: "SSE",
    icon: CloudSun,
  },
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
] as const;

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      <WireframeNav className="border-b" hideOn="mobile" position="top">
        <div className="mx-auto flex h-full w-full max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
            Tempo Examples
          </div>
          <nav className="hidden items-center gap-1 sm:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  className={cn(
                    "rounded-lg px-3 py-2 font-medium text-sm transition",
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </WireframeNav>

      <WireframeNav
        className="border-slate-200 border-t bg-white/95 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur sm:hidden"
        hideOn="desktop"
        position="bottom"
      >
        <nav className="mx-auto grid h-full w-full max-w-md grid-cols-3 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 rounded-md text-[11px] transition",
                  isActive
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-800",
                )}
                href={item.href}
                key={item.href}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </WireframeNav>
    </>
  );
}
