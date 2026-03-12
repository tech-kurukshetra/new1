"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Gamepad2, Calendar, Megaphone, Users, ClipboardList, MessageSquare } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/arenas", icon: Gamepad2, label: "Arenas" },
  { href: "/timeline", icon: Calendar, label: "Timeline" },
  { href: "/announcements", icon: Megaphone, label: "Announcements" },
  { href: "/team", icon: Users, label: "Team" },
  { href: "/contact", icon: MessageSquare, label: "Contact Us" },
  { href: "/register", icon: ClipboardList, label: "Participant Registration" },
];

export function FloatingNav() {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="glassmorphic rounded-full p-2 flex items-center gap-2">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={`${item.href}-${index}`} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    className={cn(
                      "group relative flex items-center justify-center h-12 w-12 rounded-full text-muted-foreground hover:text-foreground transition-colors duration-200",
                      isActive && "text-primary"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute inset-0 rounded-full transition-all duration-300",
                        isActive
                          ? "bg-primary/20 scale-100 shadow-[0_0_20px_hsl(var(--primary))]"
                          : "scale-0 group-hover:scale-100 group-hover:bg-muted"
                      )}
                    ></div>
                    
                    {isActive && <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary"></div>}
                    
                    <item.icon className="h-6 w-6 z-10" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="glassmorphic rounded-md border-white/10">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </nav>
    </TooltipProvider>
  );
}
