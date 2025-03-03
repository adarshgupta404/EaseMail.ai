"use client";
import { SignUp, useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

export default function Page() {
  const { userId } = useAuth();
  if (userId) {
    redirect("/mail");
  }
  return (
    <div className="flex h-dvh items-center justify-center">
      <SignUp />
    </div>
  );
}
