"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/b2c/Header";
import { useBooking } from "@/context/BookingContext";
import { flightService } from "@/services/flight.service";

export default function FlightsPage() {
  const router = useRouter();
  const { searchParams, setSelectedFlight } = useBooking();
  const [flights, setFlights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const origin = searchParams.origin || { code: "CGK", city: "Jakarta" };
  const destination = searchParams.destination || { code: "DPS", city: "Denpasar-Bali" };
  const departureDate = searchParams.departureDate || new Date().toISOString().split("T")[0];
  const passengers = searchParams.passengers || { adults: 1, children: 0, infants: 0 };

  useEffect(() => {
    const searchFlights = async () => {
      if (!searchParams.origin || !searchParams.destination) {
        router.push("/search");
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await flightService.searchFlights({
          origin: searchParams.origin.code,
          destination: searchParams.destination.code,
          departure_date: searchParams.departureDate,
          cabin_class: searchParams.cabinClass || "economy",
          page: 1,
          page_size: 20,
        });

        // Response is already the data array from the PaginatedResponse
        setFlights(response.data || response || []);
      } catch (err: any) {
        console.error("Flight search error:", err);
        setError(err.message || "Failed to search flights");
      } finally {
        setIsLoading(false);
      }
    };

    searchFlights();
  }, [searchParams, router]);

  const handleSelectFlight = (flight: any) => {
    // Transform API flight to the format expected by the booking context
    const transformedFlight = {
      id: flight.id,
      segments: [
        {
          id: flight.id,
          airline: {
            code: flight.airline?.code || "XX",
            name: flight.airline?.name || "Unknown Airline",
            logo: flight.airline?.logo,
          },
          flightNumber: flight.flight_number || "XXXX",
          departure: {
            airport: {
              code: flight.departure_airport?.code || origin.code,
              city: flight.departure_airport?.city || origin.city,
              name: flight.departure_airport?.name || "",
            },
            terminal: flight.departure_terminal || "",
            time: flight.departure_time || "00:00",
          },
          arrival: {
            airport: {
              code: flight.arrival_airport?.code || destination.code,
              city: flight.arrival_airport?.city || destination.city,
              name: flight.arrival_airport?.name || "",
            },
            terminal: flight.arrival_terminal || "",
            time: flight.arrival_time || "00:00",
          },
          duration: `${Math.floor((flight.duration || 0) / 60)}h ${(flight.duration || 0) % 60}m`,
          stops: 0,
          aircraft: flight.aircraft || "Unknown",
        },
      ],
      fareOptions: [
        {
          id: "economy",
          name: "Economy",
          price: flight.economy_price || 0,
          features: {
            cabinBaggage: "7 kg",
            checkedBaggage: "20 kg",
            meal: "Included",
            refund: "Non-refundable",
            reschedule: "Allowed with fee",
          },
        },
      ],
      lowestPrice: flight.economy_price || 0,
      tags: ["Available"],
    };

    setSelectedFlight(transformedFlight);
    router.push(`/flights/${flight.id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}j ${mins}m`;
  };

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  return (
    <div className="min-h-screen bg-[#E8F4FD]">
      <Header />

      {/* Search Summary Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="font-semibold text-gray-900">
                  {origin.city}, {origin.code}
                </span>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                <span className="font-semibold text-gray-900">
                  {destination.city}, {destination.code}
                </span>
              </div>
              <span className="text-gray-600">{departureDate}</span>
              <span className="text-gray-600">
                {totalPassengers} passenger{totalPassengers > 1 ? "s" : ""}, {searchParams.cabinClass || "Economy"}
              </span>
            </div>
            <button
              onClick={() => router.push("/search")}
              className="px-6 py-2 border-2 border-[#0194f3] text-[#0194f3] font-medium rounded-full hover:bg-blue-50 transition-colors"
            >
              Change Search
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0194f3]"></div>
            <p className="mt-4 text-gray-600">Searching for flights...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => router.push("/search")}
              className="mt-4 px-6 py-2 bg-[#0194f3] text-white rounded-full hover:bg-[#0180d6]"
            >
              Back to Search
            </button>
          </div>
        </div>
      )}

      {/* No Flights Found */}
      {!isLoading && !error && flights.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No flights found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or try different dates
            </p>
            <button
              onClick={() => router.push("/search")}
              className="px-6 py-2 bg-[#0194f3] text-white rounded-full hover:bg-[#0180d6]"
            >
              Search Again
            </button>
          </div>
        </div>
      )}

      {/* Flight List */}
      {!isLoading && !error && flights.length > 0 && (
        <>
          {/* Section Header */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Available Flights ({flights.length})
              </h2>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 pb-8">
            <div className="space-y-4">
              {flights.map((flight) => (
                <div
                  key={flight.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Flight Card */}
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      {/* Airline & Flight Info */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-lg font-bold text-white">
                            {flight.airline?.code || "XX"}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {flight.airline?.name || "Unknown Airline"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {flight.flight_number}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              {flight.aircraft || "Aircraft"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Time & Duration */}
                      <div className="flex items-center gap-6 text-center">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {flight.departure_time || "00:00"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {flight.departure_airport?.code || origin.code}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">
                            {formatDuration(flight.duration || 0)}
                          </p>
                          <div className="w-24 h-px bg-gray-300 my-1 relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                          </div>
                          <p className="text-xs text-gray-500">Direct</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {flight.arrival_time || "00:00"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {flight.arrival_airport?.code || destination.code}
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-500">
                          IDR {formatPrice(flight.economy_price || 0)}
                          <span className="text-sm font-normal text-gray-500">
                            /pax
                          </span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {flight.economy_seats || 0} seats available
                        </p>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Baggage included</span>
                        <span>•</span>
                        <span>Meal included</span>
                      </div>
                      <button
                        onClick={() => handleSelectFlight(flight)}
                        className="px-6 py-2 bg-[#0194f3] hover:bg-[#0180d6] text-white font-medium rounded-lg transition-colors"
                      >
                        Select Flight
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
