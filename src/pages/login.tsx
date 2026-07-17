import Head from "next/head";
import React, { useState, type ReactElement } from "react";
import { useRouter } from "next/router";
import { type GetServerSideProps } from "next";
import HeaderLayout from "@/components/layouts/HeaderLayout";
import { type NextPageWithLayout } from "@/pages/_app";
import { Button } from "@/components/shad-ui/button";
import { isSupabaseAuth } from "@/utils/authProvider";
import { createSupabaseBrowserClient } from "@/utils/supabaseBrowser";
import { getServerAuth } from "@/server/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = await getServerAuth(ctx.req, ctx.res);
  if (userId) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: {} };
};

type OAuthProvider = "github" | "google";

const OAuthButtons = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const queryError =
    typeof router.query.error === "string" ? router.query.error : null;

  const signIn = async (provider: OAuthProvider) => {
    const supabase = createSupabaseBrowserClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Button size="lg" onClick={() => void signIn("github")}>
        Continue with GitHub →
      </Button>
      <Button size="lg" variant="outline" onClick={() => void signIn("google")}>
        Continue with Google →
      </Button>
      {(error ?? queryError) && (
        <p className="text-[13px] uppercase tracking-[0.05em] text-muted-foreground">
          Error — {error ?? queryError}
        </p>
      )}
    </div>
  );
};

const BasicLoginForm = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/basic/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      setError("Invalid credentials");
      return;
    }
    await router.push("/");
    router.reload();
  };

  const fieldClasses =
    "w-full border border-foreground/35 bg-transparent px-4 py-3 text-[13px] focus:border-foreground focus:outline-none";
  const labelClasses =
    "mb-2 block text-[11px] uppercase tracking-[0.08em] text-muted-foreground";

  return (
    <form onSubmit={(e) => void submit(e)} className="flex flex-col gap-5">
      <div>
        <label htmlFor="username" className={labelClasses}>
          Username
        </label>
        <input
          id="username"
          className={fieldClasses}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
        />
      </div>
      <div>
        <label htmlFor="password" className={labelClasses}>
          Password
        </label>
        <input
          id="password"
          type="password"
          className={fieldClasses}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button size="lg" type="submit">
        Sign in →
      </Button>
      {error && (
        <p className="text-[13px] uppercase tracking-[0.05em] text-muted-foreground">
          Error — {error}
        </p>
      )}
    </form>
  );
};

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex w-full max-w-md flex-col px-5 pb-16 pt-12 sm:px-8 sm:pt-20">
        <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
          Login
        </p>
        <h1 className="mb-3 mt-3 text-4xl font-bold leading-[1.1] tracking-[-0.01em]">
          Sign in
        </h1>
        <p className="mb-8 text-[13.5px] leading-relaxed text-muted-foreground">
          {isSupabaseAuth
            ? "Your games are saved to your account."
            : "Development mode — basic credentials (default dev / dev)."}
        </p>
        {isSupabaseAuth ? <OAuthButtons /> : <BasicLoginForm />}
      </main>
    </>
  );
};

Page.getLayout = (page: ReactElement) => <HeaderLayout>{page}</HeaderLayout>;

export default Page;
