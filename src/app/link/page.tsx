"use client"
import LinkAccountButton from "@/components/LinkAccountButton";
import { Button } from "@/components/ui/button";
import { SignedIn, SignOutButton, useClerk } from "@clerk/nextjs";
import Link from "next/link";
export default function page() {
  const { signOut } = useClerk();
  return (
    <main
      suppressHydrationWarning
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white"
    >
      <Button>Hello World</Button>
      <SignedIn>
        <Link href={"/mail"}>Mail</Link>
      </SignedIn>

      <LinkAccountButton />
      <Button variant={"destructive"}>
        <SignOutButton />
      </Button>
      <Button onClick={() => signOut({ redirectUrl: "/sign-in" })}>
        Sign Out Function
      </Button>
    </main>
  );
}
