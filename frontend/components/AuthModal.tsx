"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ToastProvider";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { showToast } = useToast();
  const [step, setStep] = useState<"email" | "name">("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      if (step === "email") {
        // Try logging in first
        try {
          const user = await api.login(email);
          finishAuth(user);
        } catch (err: any) {
          // If 404 (user not found), proceed to signup step
          if (err.message.includes("No account")) {
            setStep("name");
          } else {
            showToast(err.message || "Failed to log in", "error");
          }
        }
      } else {
        // Step is name, sign up
        if (!name) {
          showToast("Please enter your name", "error");
          setLoading(false);
          return;
        }
        const user = await api.signup(name, email);
        finishAuth(user);
      }
    } catch (err: any) {
      showToast(err.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  }

  function finishAuth(user: any) {
    localStorage.setItem("userId", String(user.id));
    showToast(`Welcome, ${user.name}!`, "success");
    if (onSuccess) onSuccess(user);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-[568px] overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex h-16 items-center justify-between border-b px-4">
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            <X className="h-4 w-4 text-gray-800" />
          </button>
          <h2 className="text-base font-bold text-gray-900">
            {step === "email" ? "Log in or sign up" : "Finish signing up"}
          </h2>
          <div className="w-8" />
        </div>

        <div className="p-6">
          <h3 className="mb-4 text-[22px] font-semibold text-gray-900">
            Welcome to Airbnb
          </h3>

          <form onSubmit={handleContinue} className="mb-4">
            <div className="overflow-hidden rounded-xl border border-gray-400 focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900">
              {step === "email" ? (
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="peer w-full px-4 pb-2 pt-6 outline-none transition-all placeholder-transparent"
                    placeholder="Email"
                    required
                  />
                  <label
                    htmlFor="email"
                    className="pointer-events-none absolute left-4 top-2 text-[11px] font-bold text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold"
                  >
                    Email
                  </label>
                </div>
              ) : (
                <>
                  <div className="relative border-b border-gray-400">
                    <input
                      type="text"
                      disabled
                      value={email}
                      className="w-full bg-gray-100 px-4 py-3 outline-none text-gray-500"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="peer w-full px-4 pb-2 pt-6 outline-none transition-all placeholder-transparent"
                      placeholder="First name"
                      required
                    />
                    <label
                      htmlFor="name"
                      className="pointer-events-none absolute left-4 top-2 text-[11px] font-bold text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold"
                    >
                      First name
                    </label>
                  </div>
                  <p className="px-4 py-2 text-[11px] text-gray-500">
                    Make sure it matches the name on your government ID.
                  </p>
                </>
              )}
            </div>
            
            <p className="mt-3 text-[11px] leading-4 text-gray-900">
              We’ll call or text you to confirm your number. Standard message and data rates apply. <span className="font-semibold underline cursor-pointer">Privacy Policy</span>
            </p>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-primary py-3.5 text-base font-bold text-white transition hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? "Please wait..." : "Continue"}
            </button>
          </form>

          {step === "email" && (
            <>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-300" />
                <span className="text-xs text-gray-500">or</span>
                <div className="h-px flex-1 bg-gray-300" />
              </div>

              <div className="space-y-3">
                <button type="button" className="relative flex w-full items-center rounded-xl border border-gray-900 p-3.5 hover:bg-gray-50 transition">
                  <div className="absolute left-4">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" focusable="false"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
                  </div>
                  <span className="flex-1 text-center text-[15px] font-semibold text-gray-900">Continue with Google</span>
                </button>
                <button type="button" className="relative flex w-full items-center rounded-xl border border-gray-900 p-3.5 hover:bg-gray-50 transition">
                  <div className="absolute left-4">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M13.63 2.14c1.17-.18 2.37.13 3.36.87a4.29 4.29 0 0 1 1.6 2.98c-.13 1.18-.75 2.25-1.74 2.97-.98.71-2.2.98-3.37.76a4.27 4.27 0 0 1-1.63-2.92c.11-1.2.7-2.3 1.78-2.66zm-5.4 7.64c.2-.01.39.02.58.07 1.48.42 2.75 1.5 3.5 2.92.74-1.43 2.03-2.52 3.52-2.95.2-.06.4-.08.6-.08.6 0 1.2.14 1.76.4 1.34.62 2.39 1.75 2.97 3.12-.9.55-1.57 1.37-1.93 2.33-.36.96-.36 2.02 0 2.97.37.95 1.05 1.76 1.96 2.3-.39 1.14-.97 2.2-1.7 3.12-.86 1.1-1.92 2.02-3.16 2.73-1.07.61-2.32.74-3.5.37-1.18.37-2.43.24-3.5-.37-1.25-.7-2.3-1.62-3.17-2.73-.77-.96-1.39-2.06-1.84-3.23-1-2.58-1-5.42 0-8 .44-1.17 1.06-2.26 1.84-3.23.86-1.1 1.9-2.02 3.16-2.74 1.05-.62 2.27-.8 3.42-.51z"></path></svg>
                  </div>
                  <span className="flex-1 text-center text-[15px] font-semibold text-gray-900">Continue with Apple</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
