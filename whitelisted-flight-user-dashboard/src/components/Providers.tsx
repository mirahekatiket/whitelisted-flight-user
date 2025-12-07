"use client";

import { BookingProvider } from "@/context/BookingContext";
import { ReactNode, useEffect } from "react";
import { cleanupCorruptedStorage } from "@/lib/storage-cleanup";

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Clean up any corrupted localStorage data on app initialization
    cleanupCorruptedStorage();
  }, []);

  return <BookingProvider>{children}</BookingProvider>;
}

