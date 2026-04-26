import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Shield,
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Globe,
  Moon,
  FileText,
  Bookmark,
} from "lucide-react";
import { Card, CardContent } from "@/components/card";
import { Button } from "@/components/button";
import { Avatar, AvatarFallback } from "@/components/avatar";
import { useAuth } from "@/stores";
import VerificationBadge from "@/components/VerificationBadge";
import TenantTrustScore from "@/components/TenantTrustScore";

export default function ProfilePage() {
  const { name, email, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                  {name?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">{name ?? "Guest User"}</h2>
                  <VerificationBadge tier="Gold" size="sm" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {email ?? "guest@hometrust.com"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  +91 98765 43210
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/profile/edit">Edit</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <TenantTrustScore />

        <Card>
          <CardContent className="p-2">
            <MenuItem
              icon={Bookmark}
              label="Saved reports"
              to="/saved-reports"
            />
            <MenuItem icon={FileText} label="My bookings" to="/bookings" />
            <MenuItem
              icon={User}
              label="Personal information"
              to="/profile/edit"
            />
            <MenuItem icon={Shield} label="Verification & security" to="#" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2">
            <MenuItem icon={Bell} label="Notifications" to="/notifications" />
            <MenuItem icon={Moon} label="Appearance" to="#" />
            <MenuItem
              icon={Globe}
              label="Language"
              to="#"
              rightText="English"
            />
            <MenuItem icon={CreditCard} label="Payment methods" to="#" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2">
            <MenuItem icon={HelpCircle} label="Help & support" to="#" />
            <MenuItem icon={FileText} label="Terms & privacy" to="#" />
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full bg-transparent text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Version 1.0.0
        </p>
      </div>
    </div>
  );
}

function MenuItem({ icon: Icon, label, to, rightText }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {rightText && (
          <span className="text-xs text-muted-foreground">{rightText}</span>
        )}
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </Link>
  );
}
