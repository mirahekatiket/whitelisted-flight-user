export interface Airport {
  code: string;
  city: string;
  name: string;
}

export interface FlightSegment {
  id: string;
  airline: {
    code: string;
    name: string;
    logo?: string;
  };
  flightNumber: string;
  departure: {
    airport: Airport;
    terminal: string;
    time: string;
  };
  arrival: {
    airport: Airport;
    terminal: string;
    time: string;
  };
  duration: string;
  stops: number;
  aircraft: string;
}

export interface FareOption {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  features: {
    cabinBaggage: string;
    checkedBaggage: string;
    meal: string;
    refund: string;
    reschedule: string;
  };
  isExclusive?: boolean;
}

export interface Flight {
  id: string;
  segments: FlightSegment[];
  fareOptions: FareOption[];
  lowestPrice: number;
  tags: string[];
}

export interface SearchParams {
  origin: Airport | null;
  destination: Airport | null;
  departureDate: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  cabinClass: "economy" | "business" | "first";
  isRoundTrip: boolean;
  returnDate?: string;
}

export interface BookingData {
  flight: Flight;
  selectedFare: FareOption;
  searchParams: SearchParams;
  contactDetails: {
    title: string;
    fullName: string;
    phone: string;
    email: string;
  };
  passengers: {
    title: string;
    fullName: string;
    type: "adult" | "child" | "infant";
  }[];
}

