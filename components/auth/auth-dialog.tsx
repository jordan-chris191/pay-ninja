'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { createClient } from "@/lib/supabase/client";

interface AuthDialogProps {
  mode: "login" | "register" | null;
  onClose: () => void;
  onSwitchMode: (mode: "login" | "register") => void;
}

interface PasswordRule {
  label: string;
  test: (pw: string) => boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "One number", test: (pw) => /[0-9]/.test(pw) },
  { label: "One special character (!@#$%^&*)", test: (pw) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw) },
];

export function AuthDialog({ mode, onClose, onSwitchMode }: AuthDialogProps) {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLogin = mode === "login";

  const passwordStrength = PASSWORD_RULES.filter(r => r.test(password)).length;
  const allRulesMet = passwordStrength === PASSWORD_RULES.length;
  const strengthLabel = password.length === 0 ? "" : allRulesMet ? "Strong" : passwordStrength >= 3 ? "Medium" : "Weak";
  const strengthColor = password.length === 0 ? "bg-muted" : allRulesMet ? "bg-emerald-500" : passwordStrength >= 3 ? "bg-amber-500" : "bg-red-500";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Strict validation on register
    if (!isLogin && !allRulesMet) {
      setError("Please meet all password requirements");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });
        if (signUpError) throw signUpError;
      }

      router.push("/dashboard");
      router.refresh();
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    // On success the browser navigates away to Google immediately, so there's
    // nothing else to do here. We only reach this line if the redirect itself
    // failed to kick off (e.g. provider not enabled, network error).
    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  };

  return (
      <Dialog
          open={mode !== null}
          onOpenChange={(open) => {
            if (!open) {
              onClose();
            }
          }}
        >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isLogin ? "Welcome back" : "Create your account"}</DialogTitle>
          <DialogDescription>
            {isLogin
              ? "Sign in to your PayNinja account"
              : "Start invoicing for free - no credit card required"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <GoogleIcon className="h-4 w-4" />
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={isLogin ? 1 : 8}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password strength bar - only on register */}
            {!isLogin && password.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
                      style={{ width: `${(passwordStrength / PASSWORD_RULES.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium">{strengthLabel}</span>
                </div>

                <div className="space-y-1">
                  {PASSWORD_RULES.map((rule) => {
                    const passed = rule.test(password);
                    return (
                      <div key={rule.label} className="flex items-center gap-1.5">
                        <div className={`h-1 w-1 rounded-full ${passed ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                        <span className={`text-[11px] ${passed ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                          {rule.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading || (!isLogin && !allRulesMet && password.length > 0)}>
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            </span>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setPassword("");
                setShowPassword(false);
                onSwitchMode(isLogin ? "register" : "login");
              }}
              className="text-primary hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}