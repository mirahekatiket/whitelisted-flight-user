"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Flight, FareOption, SearchParams, Airport } from "@/types/flight";
import { getUserData, getAuthToken } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
}

interface BookingContextType {
  searchParams: SearchParams;
  setSearchParams: (params: SearchParams) => void;
  selectedFlight: Flight | null;
  setSelectedFlight: (flight: Flight | null) => void;
  selectedFare: FareOption | null;
  setSelectedFare: (fare: FareOption | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
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
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = getAuthToken();
    const userData = getUserData();
    if (token && userData) {
      setUser(userData);
    }
  }, []);

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
