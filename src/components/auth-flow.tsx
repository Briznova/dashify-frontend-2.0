"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardRoute } from "@/lib/dashboard-route";
import type { PasswordResetInput, SignInInput, SignUpInput } from "@/types/auth";
import { Icon } from "@/components/ui/icon";
import styles from "./auth-flow.module.css";

type AuthMode = "sign-in" | "sign-up" | "forgot-password" | "reset-password";

const authLinks = {
  "sign-in": { eyebrow: "AUTH & ACCOUNT / LOG IN", top: "Need help? Contact your school administrator." },
  "sign-up": { eyebrow: "AUTH & ACCOUNT / CREATE ACCOUNT", top: "Already have an account? Sign in" },
  "forgot-password": { eyebrow: "AUTH & ACCOUNT / RECOVER YOUR ACCOUNT", top: "Need help? Contact your school administrator." },
  "reset-password": { eyebrow: "AUTH & ACCOUNT / SECURE YOUR ACCOUNT", top: "Need help? Contact your school administrator." },
} satisfies Record<AuthMode, { eyebrow: string; top: string }>;

const previewAccounts = [
  { role: "Super admin", email: "superadmin@school.edu" },
  { role: "School admin", email: "admin@school.edu" },
  { role: "Principal", email: "principal@school.edu" },
  { role: "Teacher", email: "teacher@school.edu" },
  { role: "Accountant", email: "accountant@school.edu" },
  { role: "Parent", email: "parent@school.edu" },
  { role: "Student", email: "student@school.edu" },
];

function Brand() {
  return (
    <Link href="/" className={styles.brand} aria-label="Dashify home">
      <span className={styles.brandIcon} aria-hidden="true"><i /><i /><i /><i /></span>
      <span>DASHIFY</span>
    </Link>
  );
}

function AuthFrame({ mode, children }: { mode: AuthMode; children: ReactNode }) {
  const top = authLinks[mode].top;
  return (
    <main className={styles.authPage}>
      <div className={styles.pageGlow} />
      <header className={styles.header}>
        <Brand />
        {mode === "sign-up" ? (
          <span>{top.split("?")[0]}? <Link href="/auth/sign-in">Sign in</Link></span>
        ) : (
          <span>{top}</span>
        )}
      </header>
      <div className={styles.authLayout}>
        <aside className={styles.brandPanel} aria-label="Dashify school workspace">
          <div className={styles.storyEyebrow}><span /> A CLEARER WAY TO RUN YOUR SCHOOL</div>
          <div className={styles.storyCopy}>
            <h2>More focus on <span>what matters.</span></h2>
            <p>Bring your school community, daily work, and important insights together in one place.</p>
          </div>
          <div className={styles.workspacePreview}>
            <div className={styles.previewHeader}>
              <span className={styles.previewMark}><i /><i /><i /><i /></span>
              <span><strong>Your school workspace</strong><small>Everything in sync</small></span>
              <span className={styles.previewStatus}><i /> LIVE</span>
            </div>
            <div className={styles.previewDivider} />
            <div className={styles.previewItems}>
              <div><span className={styles.previewIcon}><Icon name="users" size={17} /></span><span><strong>Student records</strong><small>Profiles and enrollment</small></span><Icon name="arrowUpRight" size={15} /></div>
              <div><span className={styles.previewIcon}><Icon name="calendarCheck" size={17} /></span><span><strong>Attendance & learning</strong><small>Daily school activity</small></span><Icon name="arrowUpRight" size={15} /></div>
              <div><span className={styles.previewIcon}><Icon name="chart" size={17} /></span><span><strong>Clearer insights</strong><small>Reports for your team</small></span><Icon name="arrowUpRight" size={15} /></div>
            </div>
          </div>
          <div className={styles.storyFoot}><Icon name="check" size={16} /> One connected workspace for your school community</div>
        </aside>
        <div className={styles.authContent}>
          <div className={styles.eyebrow}>{authLinks[mode].eyebrow}</div>
          {children}
        </div>
      </div>
      <footer className={styles.footer}>
        <span>© 2026 Dashify</span>
        <nav aria-label="Legal links"><a href="#privacy">Privacy</a><a href="#terms">Terms</a><a href="mailto:support@dashify.app">Help center</a></nav>
      </footer>
    </main>
  );
}

function ErrorMessage({ children }: { children: ReactNode }) {
  return <p className={styles.errorMessage} role="alert">{children}</p>;
}

function SignInForm() {
  const router = useRouter();
  const { signIn, error, isPending } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input: SignInInput = { email: email.trim(), password, rememberMe };
    const session = await signIn(input);
    if (session) {
      router.push(getDashboardRoute(session.user.role));
      router.refresh();
    }
  }

  return (
    <AuthFrame mode="sign-in">
      <section className={styles.authCard}>
        <div className={styles.cardIcon}><Icon name="user" size={22} /></div>
        <h1>Welcome back</h1>
        <p className={styles.cardIntro}>Sign in to your school workspace.</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="sign-in-email">Work email</label>
          <input id="sign-in-email" name="email" type="email" autoComplete="email" placeholder="you@school.edu" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <div className={styles.labelRow}>
            <label htmlFor="sign-in-password">Password</label>
            <Link href="/auth/forgot-password">Forgot password?</Link>
          </div>
          <input id="sign-in-password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required />
          <label className={styles.checkboxLabel}><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} /> Remember this device</label>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <button className={styles.submitButton} type="submit" disabled={isPending}>{isPending ? "Signing in..." : "Sign in"} <Icon name="arrowRight" size={16} /></button>
        </form>
        <p className={styles.cardFoot}>You are not yet part of a school? <a href="mailto:hello@dashify.app">Contact your administrator</a></p>
        <div className={styles.demoNote}>
          <span><Icon name="sparkles" size={17} /></span>
          <div>
            <p><strong>Preview mode</strong> Choose a sample role to see its dashboard. All sample accounts use <code>Dashify123</code>.</p>
            <div className={styles.demoAccounts} aria-label="Sample role accounts">
              {previewAccounts.map((account) => (
                <button
                  type="button"
                  key={account.email}
                  aria-pressed={email.toLowerCase() === account.email}
                  onClick={() => {
                    setEmail(account.email);
                    setPassword("Dashify123");
                  }}
                >
                  {account.role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AuthFrame>
  );
}

function SignUpForm() {
  const router = useRouter();
  const { signUp, error, isPending } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Your passwords do not match.");
      return;
    }
    setPasswordError(null);
    const input: SignUpInput = { name: name.trim(), email: email.trim(), password, schoolName: schoolName.trim() };
    const session = await signUp(input);
    if (session) {
      router.push(getDashboardRoute(session.user.role));
      router.refresh();
    }
  }

  return (
    <AuthFrame mode="sign-up">
      <section className={`${styles.authCard} ${styles.authCardWide}`}>
        <div className={styles.cardIcon}><Icon name="building" size={22} /></div>
        <h1>Create your workspace</h1>
        <p className={styles.cardIntro}>Bring your school community together with Dashify.</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="sign-up-name">Your name</label>
          <input id="sign-up-name" name="name" autoComplete="name" placeholder="e.g. Jordan Davis" value={name} onChange={(event) => setName(event.target.value)} required />
          <label htmlFor="sign-up-school">School name</label>
          <input id="sign-up-school" name="schoolName" autoComplete="organization" placeholder="e.g. Northstar Academy" value={schoolName} onChange={(event) => setSchoolName(event.target.value)} required />
          <label htmlFor="sign-up-email">Work email</label>
          <input id="sign-up-email" name="email" type="email" autoComplete="email" placeholder="you@school.edu" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <div className={styles.formTwoColumn}>
            <div><label htmlFor="sign-up-password">Password</label><input id="sign-up-password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required /></div>
            <div><label htmlFor="sign-up-confirm">Confirm password</label><input id="sign-up-confirm" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Repeat password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} required /></div>
          </div>
          {(passwordError || error) && <ErrorMessage>{passwordError ?? error}</ErrorMessage>}
          <button className={styles.submitButton} type="submit" disabled={isPending}>{isPending ? "Creating workspace..." : "Create account"} <Icon name="arrowRight" size={16} /></button>
        </form>
        <p className={styles.termsCopy}>By continuing, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.</p>
      </section>
    </AuthFrame>
  );
}

function ForgotPasswordForm() {
  const { requestPasswordReset, error, isPending } = useAuth();
  const [email, setEmail] = useState("");
  const [requested, setRequested] = useState(false);
  const [previewToken, setPreviewToken] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await requestPasswordReset(email.trim());
    if (result) {
      setPreviewToken(result.previewToken ?? null);
      setRequested(true);
    }
  }

  return (
    <AuthFrame mode="forgot-password">
      <section className={styles.authCard}>
        {requested ? (
          <>
            <div className={`${styles.cardIcon} ${styles.mailIcon}`}><Icon name="mail" size={22} /></div>
            <h1>Check your inbox</h1>
            <p className={styles.cardIntro}>We&apos;ve received your password reset request.</p>
            <div className={styles.emailPreview}><span>Email address</span><strong>{email}</strong><span className={styles.lockIcon}><Icon name="lock" size={16} /></span></div>
            <div className={styles.infoNote}><span><Icon name="info" size={16} /></span><p>If an account exists, we&apos;ll email a reset link. For your privacy, we don&apos;t confirm whether an email is registered.</p></div>
            <p className={styles.resendCopy}>Haven&apos;t received an email? Check your spam folder or contact your school administrator.</p>
            {previewToken && <Link className={styles.previewResetLink} href={`/auth/reset-password?token=${encodeURIComponent(previewToken)}&email=${encodeURIComponent(email)}`}>Open preview reset screen →</Link>}
            <button className={styles.secondaryButton} type="button" onClick={() => setRequested(false)}>Request another link</button>
            <Link className={styles.backLink} href="/auth/sign-in">← Back to sign in</Link>
          </>
        ) : (
          <>
            <div className={`${styles.cardIcon} ${styles.mailIcon}`}><Icon name="mail" size={22} /></div>
            <h1>Forgot your password?</h1>
            <p className={styles.cardIntro}>Enter your school email and we&apos;ll send you a link to reset your password.</p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label htmlFor="reset-email">Work email</label>
              <input id="reset-email" name="email" type="email" autoComplete="email" placeholder="you@school.edu" value={email} onChange={(event) => setEmail(event.target.value)} required />
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <button className={styles.submitButton} type="submit" disabled={isPending}>{isPending ? "Sending request..." : "Send reset link"} <span aria-hidden="true">→</span></button>
            </form>
            <Link className={styles.backLink} href="/auth/sign-in">← Back to sign in</Link>
          </>
        )}
      </section>
    </AuthFrame>
  );
}

function ResetPasswordForm({ initialEmail, initialToken }: { initialEmail: string; initialToken: string }) {
  const router = useRouter();
  const { resetPassword, error, isPending } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [updated, setUpdated] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Your passwords do not match.");
      return;
    }
    if (!initialToken) {
      setPasswordError("This password reset link is invalid or has expired. Request a new link.");
      return;
    }
    setPasswordError(null);
    const input: PasswordResetInput = { token: initialToken, email: email.trim(), password };
    const succeeded = await resetPassword(input);
    if (succeeded) setUpdated(true);
  }

  return (
    <AuthFrame mode="reset-password">
      <section className={styles.authCard}>
        {updated ? (
          <>
            <div className={`${styles.cardIcon} ${styles.successIcon}`}><Icon name="check" size={22} /></div>
            <h1>Password updated</h1>
            <p className={styles.cardIntro}>Your new password is ready. Sign in to your school workspace.</p>
            <Link className={styles.submitButton} href="/auth/sign-in">Back to sign in <span aria-hidden="true">→</span></Link>
          </>
        ) : (
          <>
            <div className={`${styles.cardIcon} ${styles.mailIcon}`}><Icon name="lock" size={22} /></div>
            <h1>Set a new password</h1>
            <p className={styles.cardIntro}>Choose a strong password to keep your account secure.</p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label htmlFor="new-password-email">Work email</label>
              <input id="new-password-email" name="email" type="email" autoComplete="email" placeholder="you@school.edu" value={email} onChange={(event) => setEmail(event.target.value)} required />
              <label htmlFor="new-password">New password</label>
              <input id="new-password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required />
              <div className={styles.passwordStrength}><i /><i /><i /><i /></div>
              <ul className={styles.passwordRules}><li className={password.length >= 8 ? styles.ruleMet : ""}>At least 8 characters</li><li className={/[A-Z]/.test(password) ? styles.ruleMet : ""}>One uppercase letter</li><li className={/\d/.test(password) ? styles.ruleMet : ""}>One number</li></ul>
              <label htmlFor="confirm-new-password">Confirm password</label>
              <input id="confirm-new-password" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Re-enter your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} required />
              {(passwordError || error) && <ErrorMessage>{passwordError ?? error}</ErrorMessage>}
              <button className={styles.submitButton} type="submit" disabled={isPending}>{isPending ? "Updating password..." : "Reset password"} <span aria-hidden="true">→</span></button>
            </form>
            <button className={styles.backLinkButton} type="button" onClick={() => router.push("/auth/sign-in")}>← Back to sign in</button>
          </>
        )}
      </section>
    </AuthFrame>
  );
}

export function AuthFlow({
  mode,
  initialEmail = "",
  initialToken = "",
}: {
  mode: AuthMode;
  initialEmail?: string;
  initialToken?: string;
}) {
  switch (mode) {
    case "sign-in":
      return <SignInForm />;
    case "sign-up":
      return <SignUpForm />;
    case "forgot-password":
      return <ForgotPasswordForm />;
    case "reset-password":
      return <ResetPasswordForm initialEmail={initialEmail} initialToken={initialToken} />;
  }
}
