import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="container flex h-screen items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mb-64",
          },
        }}
      />
    </div>
  );
}
