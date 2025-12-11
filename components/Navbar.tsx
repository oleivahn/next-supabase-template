"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import { siteConfig } from "@/config/site";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ThemeToggle } from "./Theme-toggle";

import { Icons } from "@/components/icons";
import type { UserRole } from "@/lib/auth";

// - Nav item type with optional role requirement
type NavItem = {
  href: string;
  label: string;
  requiredRole?: UserRole;
};

export default function Navbar() {
  // - How to set colors for active links
  // https://stackoverflow.com/questions/68978743/tailwindcss-active-link-text-color-not-changing
  const pathname = usePathname();
  const { user } = useUser();

  // - Get user role from public metadata
  const userRole = (user?.publicMetadata?.role as UserRole) || "user";

  // - Role hierarchy for checking access
  const roleHierarchy: Record<UserRole, number> = {
    user: 1,
    moderator: 2,
    admin: 3,
  };

  // - Check if user has required role
  const hasAccess = (requiredRole?: UserRole) => {
    if (!requiredRole) return true;
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  };

  const LEFT_NAV_ITEMS: NavItem[] = [{ href: "/", label: "Home" }];

  const RIGHT_NAV_ITEMS: NavItem[] = [
    { href: "/admin", label: "Admin", requiredRole: "admin" },
    { href: "/database", label: "Database", requiredRole: "admin" },
    { href: "/contact-us", label: "Contact Us" },
  ];

  return (
    <div className="flex w-full flex-col border-b bg-primary dark:bg-background">
      <header className="container sticky top-0 flex h-20 items-center gap-4 px-4 md:px-6">
        {/* DRAWER */}
        {/* HOW TO CLOSE THE DRAWER AFTER CLICKING ON A LINK */}
        {/* https://github.com/saadeghi/daisyui/discussions/2444 */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 border-primary-foreground/50 dark:border-border md:hidden"
            >
              <Menu className="h-5 w-5 text-primary-foreground dark:text-foreground" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              {[...LEFT_NAV_ITEMS, ...RIGHT_NAV_ITEMS]
                .filter((item) => hasAccess(item.requiredRole))
                .map(({ href, label }, i) => {
                  const isActive = pathname === href;

                  return (
                    <Link
                      key={i}
                      href={href}
                      onClick={() => {
                        document.getElementById("close-drawer")?.click();
                      }}
                      className={`${
                        isActive ? "text-primary" : "text-muted-foreground"
                      } transition-colors hover:text-foreground text-nowrap`}
                    >
                      {label}
                    </Link>
                  );
                })}
            </nav>
          </SheetContent>
        </Sheet>
        {/* LOGO AND LEFT SIDE MENUS */}
        <nav className="ie md:text-md flex-col gap-6 text-lg md:flex md:flex-row md:items-center md:gap-5 lg:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6 text-primary-foreground dark:text-foreground" />
            <span className="inline-block text-nowrap text-xl font-bold text-primary-foreground dark:text-foreground md:text-3xl">
              {siteConfig.name}
            </span>
          </Link>
          {LEFT_NAV_ITEMS.filter((item) => hasAccess(item.requiredRole)).map(
            ({ href, label }, i) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={i}
                  href={href}
                  className={`${
                    isActive
                      ? "text-primary-foreground dark:text-primary"
                      : "text-primary-foreground/70 dark:text-muted-foreground"
                  } transition-colors hover:text-primary-foreground dark:hover:text-foreground text-nowrap hidden md:block font-semibold`}
                >
                  {label}
                </Link>
              );
            }
          )}
        </nav>

        {/* RIGHT SIDE MENUS */}
        <div className="ml-auto flex items-center gap-4 text-lg md:gap-2 lg:gap-10">
          {RIGHT_NAV_ITEMS.filter((item) => hasAccess(item.requiredRole)).map(
            ({ href, label }, i) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={i}
                  href={href}
                  className={`${
                    isActive
                      ? "text-primary-foreground dark:text-primary"
                      : "text-primary-foreground/70 dark:text-muted-foreground"
                  } transition-colors hover:text-primary-foreground dark:hover:text-foreground text-nowrap hidden md:block font-semibold`}
                >
                  {label}
                </Link>
              );
            }
          )}
          <ThemeToggle />
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-background">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
        {/* </div> */}
      </header>
    </div>
  );
}
