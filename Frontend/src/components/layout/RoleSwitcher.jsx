import { useNavigate } from "react-router-dom";
import { UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores";
import { toast } from "sonner";

const ROLES = [
  { role: "buyer", label: "Buyer / Renter", redirect: "/report/search" },
  { role: "broker", label: "Broker", redirect: "/broker/dashboard" },
  { role: "admin", label: "Admin", redirect: "/admin/dashboard" },
];

export default function RoleSwitcher() {
  const navigate = useNavigate();
  const { role, setRole, login, isLoggedIn } = useAuthStore();

  const pick = (r, redirect) => {
    if (!isLoggedIn) {
      login(`${r}@hometrust.demo`, r);
    } else {
      setRole(r);
    }
    toast.success(`Switched to ${r} demo mode`);
    navigate(redirect);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hidden gap-1.5 md:inline-flex"
        >
          <UserCog className="h-4 w-4" />
          <span className="text-xs uppercase tracking-wide">{role}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-xs">Demo role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ROLES.map((r) => (
          <DropdownMenuItem
            key={r.role}
            onClick={() => pick(r.role, r.redirect)}
          >
            {r.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
