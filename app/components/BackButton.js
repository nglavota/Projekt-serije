"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
   <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 border border-white text-white hover:bg-purple-800 font-medium px-4 py-2 rounded-full transition"
    >
      <span>←</span>
      <span>Natrag</span>
    </button>
  );
}
