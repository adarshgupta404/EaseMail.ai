import LinkAccountButton from "@/components/LinkAccountButton";
import { Button } from "@/components/ui/button";
import { SignedIn, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
export default function page() {
  return (
    <main suppressHydrationWarning className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <Button>Hello World</Button>
      <SignedIn>
        <Button>
          <Link href={"/mail"}>Mail</Link>
        </Button>
      </SignedIn>

      <LinkAccountButton />
      <Button variant={"destructive"}>
        <SignOutButton />
      </Button>
    </main>
  );
}