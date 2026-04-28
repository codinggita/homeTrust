import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  Building2,
  ChevronDown,
  Home,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react";
import { Button } from "@/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/avatar";
import { useAuthStore, useNotificationStore } from "@/stores";
import NotificationPanel from "./NotificationPanel";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NAV_LINKS = [
  { to: "/report/search", label: "Reports" },
  { to: "/listings/browse", label: "Rentals" },
  { to: "/report/compare", label: "Locality Compare" },
  { to: "/listings/compare", label: "Property Compare" },

  { to: "/profile", label: "Profile" },
  { to: "/about", label: "About" },
];

export default function TopBar() {
  const navigate = useNavigate();
  const { isLoggedIn, name, role, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const [q, setQ] = useState("");

  const submitSearch = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/report/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-navy">
            <Home className="h-5 w-5 text-gold" />
          </div>
          <div className="hidden font-serif text-lg font-bold tracking-tight text-navy sm:block">
            Home<span className="text-gold">Trust</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground",
                  isActive && "bg-secondary text-foreground",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <form
          onSubmit={submitSearch}
          className="ml-auto hidden flex-1 max-w-md lg:flex"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search neighborhood, city, zip..."
              className="w-full rounded-md border border-border bg-secondary/40 py-2 pl-9 pr-3 text-sm outline-none focus:border-ring"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setNotifOpen(true)}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </Button>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 gap-2 pl-1 pr-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-navy text-xs text-gold">
                      {(name ?? "U").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium md:inline">
                    {name}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">{name}</span>
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      {role}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile & Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/report/saved")}>
                  <Building2 className="mr-2 h-4 w-4" />
                  Saved Reports
                </DropdownMenuItem>
                {role === "broker" && (
                  <DropdownMenuItem
                    onClick={() => navigate("/broker/dashboard")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Broker Dashboard
                  </DropdownMenuItem>
                )}
                {role === "admin" && (
                  <DropdownMenuItem
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  size="sm"
                  className="bg-navy text-primary-foreground hover:bg-navy/90"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </header>
  );
}
