"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Flight, FareOption, SearchParams, Airport } from "@/types/flight";

interface BookingContextType {
  searchParams: SearchParams;
  setSearchParams: (params: SearchParams) => void;
  selectedFlight: Flight | null;
  setSelectedFlight: (flight: Flight | null) => void;
  selectedFare: FareOption | null;
  setSelectedFare: (fare: FareOption | null) => void;
  user: { email: string; name: string } | null;
  setUser: (user: { email: string; name: string } | null) => void;
  isLoggedIn: boolean;
}

const defaultSearchParams: SearchParams = {
  origin: null,
  destination: null,
  departureDate: "",
  passengers: { adults: 1, children: 0, infants: 0 },
  cabinClass: "economy",
  isRoundTrip: false,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useState<SearchParams>(defaultSearchParams);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedFare, setSelectedFare] = useState<FareOption | null>(null);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  return (
    <BookingContext.Provider
      value={{
        searchParams,
        setSearchParams,
        selectedFlight,
        setSelectedFlight,
        selectedFare,
        setSelectedFare,
        user,
        setUser,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}

