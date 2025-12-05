import { BookingProvider } from "@/context/BookingContext";

export default function B2CLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BookingProvider>{children}</BookingProvider>;
}

