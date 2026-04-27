import { Outlet, useLocation } from "react-router-dom";
import TopBar from "./TopBar";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import AiChatWidget from "./AiChatWidget";

const NO_CHROME_ROUTES = ["/login", "/signup", "/forgot-password"];

export default function Layout() {
  const { pathname } = useLocation();
  const stripped = NO_CHROME_ROUTES.some((r) => pathname.startsWith(r));

  if (stripped) {
    return (
      <main className="min-h-screen bg-background">
        <Outlet />
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <AiChatWidget />
    </div>
  );
}
