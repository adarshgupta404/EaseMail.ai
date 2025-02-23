"use client";
import { SignUp } from "@clerk/nextjs";
import React from "react";

export default function Page() {
  return (
    <div className="flex h-dvh items-center justify-center">
      <SignUp />
    </div>
  );
}
