import LinkAccountButton from "@/components/LinkAccountButton";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <Button>Hello World</Button>
      <LinkAccountButton />
      <SignOutButton/>
    </main>
  );
}
