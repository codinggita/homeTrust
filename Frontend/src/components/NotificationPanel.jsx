import { Bell, CheckCheck, X } from "lucide-react";
import { Button } from "@/components/button";
import { useNotificationStore } from "@/stores";
import { cn } from "@/lib/utils";

export default function NotificationPanel({ open, onClose }) {
  const { notifications, markAllRead, remove } = useNotificationStore();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/30 transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <aside
        aria-hidden={!open}
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full max-w-sm transform border-l border-border bg-background shadow-xl transition-transform",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={markAllRead}>
              <CheckCheck className="mr-1 h-4 w-4" /> Read all
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ul className="max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          {notifications.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-muted-foreground">
              You're all caught up.
            </li>
          )}
          {notifications.map((n) => (
            <li
              key={n.id}
              className={cn(
                "group border-b border-border px-4 py-3 text-sm",
                !n.read && "bg-secondary/40",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex h-2 w-2 rounded-full",
                        n.type === "alert" && "bg-destructive",
                        n.type === "info" && "bg-navy",
                        n.type === "success" && "bg-emerald-500",
                      )}
                    />

                    <span className="font-medium">{n.title}</span>
                  </div>
                  <p className="mt-1 text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    {n.time}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100"
                  onClick={() => remove(n.id)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
