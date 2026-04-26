import { Link } from "react-router-dom";
import { Button } from "@/components/button";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy">
        <Home className="h-7 w-7 text-gold" />
      </div>
      <h1 className="mt-6 font-serif text-5xl font-bold">404</h1>
      <p className="mt-2 text-base text-muted-foreground">
        This page seems to have moved out of the neighborhood.
      </p>
      <Link to="/" className="mt-6">
        <Button className="bg-navy text-primary-foreground hover:bg-navy/90">
          Back to home
        </Button>
      </Link>
    </div>
  );
}
