import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="container flex h-screen items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mb-64",
          },
        }}
      />
    </div>
  );
}
