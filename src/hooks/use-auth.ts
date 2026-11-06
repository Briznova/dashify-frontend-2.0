"use client";

import { useCallback, useEffect, useState } from "react";
import { authService } from "@/services";
import type {
  AuthSession,
  PasswordResetInput,
  SignInInput,
  SignUpInput,
} from "@/types/auth";

export function useAuth() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async <T,>(
    action: () => Promise<T>,
  ): Promise<T | null> => {
    setIsPending(true);
    setError(null);
    try {
      return await action();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Something went wrong. Please try again.");
      return null;
    } finally {
      setIsPending(false);
    }
  }, []);

  const signIn = useCallback(
    (input: SignInInput): Promise<AuthSession | null> =>
      execute(() => authService.signIn(input)),
    [execute],
  );
  const signUp = useCallback(
    (input: SignUpInput): Promise<AuthSession | null> =>
      execute(() => authService.signUp(input)),
    [execute],
  );
  const requestPasswordReset = useCallback(
    (email: string): Promise<{ previewToken?: string } | null> =>
      execute(async () => (await authService.requestPasswordReset(email)) ?? {}),
    [execute],
  );
  const resetPassword = useCallback(
    (input: PasswordResetInput): Promise<boolean> =>
      execute(async () => {
        await authService.resetPassword(input);
        return true;
      }).then((result) => result === true),
    [execute],
  );
  const signOut = useCallback(
    (): Promise<boolean> =>
      execute(async () => {
        await authService.signOut();
        return true;
      }).then((result) => result === true),
    [execute],
  );

  return {
    isPending,
    error,
    clearError: () => setError(null),
    signIn,
    signUp,
    requestPasswordReset,
    resetPassword,
    signOut,
  };
}

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve()
      .then(() => authService.getSession())
      .then(
        (value) => {
          if (!controller.signal.aborted) {
            setSession(value);
            setError(null);
            setIsLoading(false);
          }
        },
        (reason: unknown) => {
          if (!controller.signal.aborted) {
            setError(reason instanceof Error ? reason.message : "Unable to verify your session.");
            setIsLoading(false);
          }
        },
      );
    return () => controller.abort();
  }, [version]);

  const refresh = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setVersion((current) => current + 1);
  }, []);

  return { session, isLoading, error, refresh };
}
