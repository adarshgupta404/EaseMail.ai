"use client"
import { SignIn } from "@clerk/nextjs";
import React from "react";

export default function Page() {
  return (
    <div className="flex items-center h-dvh justify-center">
      <SignIn />
    </div>
  )
}
