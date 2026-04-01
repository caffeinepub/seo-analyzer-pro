import { Button } from "@/components/ui/button";
import { Lock, TrendingUp } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LockScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-background"
      data-ocid="lock.panel"
    >
      <div className="flex flex-col items-center gap-6 max-w-sm w-full px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center">
          <TrendingUp className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            SEO Analyzer Pro
          </h1>
          <p className="text-muted-foreground text-sm">
            Advanced SEO analysis for your webshop
          </p>
        </div>
        <div className="w-full p-6 bg-card border border-border rounded-lg flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Lock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              Admin Access Required
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to access the SEO dashboard
            </p>
          </div>
          <Button
            data-ocid="lock.login.button"
            onClick={() => login()}
            disabled={isLoggingIn}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            {isLoggingIn ? "Signing in..." : "Sign In"}
          </Button>
        </div>
      </div>
    </div>
  );
}
