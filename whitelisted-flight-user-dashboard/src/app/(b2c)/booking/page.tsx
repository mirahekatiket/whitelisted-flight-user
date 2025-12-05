"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useBooking } from "@/context/BookingContext";

export default function BookingPage() {
  const router = useRouter();
  const { selectedFlight, selectedFare, searchParams, user } = useBooking();

  const [contactTitle, setContactTitle] = useState("Tuan");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [sameAsContact, setSameAsContact] = useState(false);
  const [passengerTitle, setPassengerTitle] = useState("Tuan");
  const [passengerName, setPassengerName] = useState("");

  if (!selectedFlight || !selectedFare) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No flight selected</p>
          <Link href="/search" className="text-[#0194f3] font-medium">
            Go back to search
          </Link>
        </div>
      </div>
    );
  }

  const segment = selectedFlight.segments[0];
  const origin = searchParams.origin || segment.departure.airport;
  const destination = searchParams.destination || segment.arrival.airport;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  const handleSameAsContact = () => {
    setSameAsContact(!sameAsContact);
    if (!sameAsContact) {
      setPassengerTitle(contactTitle);
      setPassengerName(contactName);
    }
  };

  const handleSubmit = () => {
    // In a real app, this would submit to an API
    router.push("/confirmation");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/search" className="flex items-center gap-1">
              <span className="text-2xl font-bold text-[#0194f3]">tiket</span>
              <span className="w-2 h-2 rounded-full bg-[#ffc107]"></span>
              <span className="text-2xl font-bold text-[#0194f3]">com</span>
            </Link>
            <button className="flex items-center gap-2 text-[#0194f3]">
              <span>🎫</span>
              <span className="font-medium">Promo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Route Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{origin.code}</span>
            <span>→</span>
            <span className="font-semibold text-gray-900">{destination.code}</span>
            <span>•</span>
            <span>1 Dewasa</span>
            <span>•</span>
            <span>Ekonomi</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Details */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Detail Pemesan
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Detail kontak ini akan digunakan untuk pengiriman e-tiket dan
                keperluan refund/reschedule.
              </p>

              {/* Title Selection */}
              <div className="flex items-center gap-6 mb-5">
                {["Tuan", "Nyonya", "Nona"].map((title) => (
                  <label key={title} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="contactTitle"
                      checked={contactTitle === title}
                      onChange={() => setContactTitle(title)}
                      className="w-5 h-5 text-[#0194f3] border-gray-300 focus:ring-[#0194f3]"
                    />
                    <span className="text-gray-700">{title}</span>
                  </label>
                ))}
              </div>

              {/* Name Input */}
              <div className="mb-4">
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Nama Lengkap sesuai KTP/Paspor/SIM"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0194f3]/20 focus:border-[#0194f3]"
                />
              </div>

              {/* Phone Input */}
              <div className="mb-4">
                <div className="flex">
                  <div className="flex items-center gap-2 px-4 py-3 border border-r-0 border-gray-300 rounded-l-xl bg-gray-50">
                    <span className="text-xl">🇮🇩</span>
                    <span className="text-gray-600">+62</span>
                  </div>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Nomor Ponsel"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0194f3]/20 focus:border-[#0194f3]"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Alamat Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0194f3]/20 focus:border-[#0194f3]"
                />
              </div>
            </div>

            {/* Passenger Details */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Detail Penumpang
              </h2>

              {/* Passenger Card */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">
                    Penumpang 1 (Dewasa)
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                      Sama dengan pemesan
                    </span>
                    <button
                      onClick={handleSameAsContact}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        sameAsContact ? "bg-[#0194f3]" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                          sameAsContact ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-medium text-gray-700 mb-4">
                    Info Penumpang
                  </h4>

                  {/* Name Input */}
                  <div className="mb-4">
                    <input
                      type="text"
                      value={sameAsContact ? contactName : passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      disabled={sameAsContact}
                      placeholder="Nama Lengkap sesuai KTP/Paspor/SIM"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0194f3]/20 focus:border-[#0194f3] disabled:bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Isi sesuai KTP/Paspor/SIM (tanpa tanda baca dan gelar)
                    </p>
                  </div>

                  {/* Title Selection */}
                  <div className="flex items-center gap-6">
                    {["Tuan", "Nyonya", "Nona"].map((title) => (
                      <label
                        key={title}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="passengerTitle"
                          checked={
                            sameAsContact
                              ? contactTitle === title
                              : passengerTitle === title
                          }
                          onChange={() => setPassengerTitle(title)}
                          disabled={sameAsContact}
                          className="w-5 h-5 text-[#0194f3] border-gray-300 focus:ring-[#0194f3]"
                        />
                        <span className="text-gray-700">{title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              {/* Route */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{origin.city}</h3>
                <span className="text-gray-400">→</span>
                <h3 className="text-xl font-bold text-gray-900">
                  {destination.city}
                </h3>
              </div>

              {/* Flight Info */}
              <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 bg-blue-50 text-[#0194f3] text-xs font-medium rounded">
                    Pergi
                  </span>
                  <span className="text-sm text-gray-600">Min, 07 Des 25</span>
                  <button className="text-[#0194f3] text-sm font-medium">
                    Detail
                  </button>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <span className="font-bold text-gray-600 text-sm">
                      {segment.airline.code}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">
                        {segment.departure.time}
                      </span>
                      <span className="text-xs text-gray-400">
                        {segment.duration}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {segment.arrival.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{segment.departure.airport.code}</span>
                      <span>Langsung</span>
                      <span>{segment.arrival.airport.code}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3 text-sm">
                  <span className="text-[#0194f3]">Bisa Refund</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-[#0194f3]">Bisa Reschedule</span>
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Total Pembayaran</span>
                </div>
                {selectedFare.originalPrice && (
                  <p className="text-sm text-gray-400 line-through">
                    IDR {formatPrice(selectedFare.originalPrice)}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-orange-500">
                    IDR {formatPrice(selectedFare.price)}
                  </p>
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
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Promo */}
              <div className="mt-4 p-3 bg-pink-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎁</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Lebih hemat pakai
                    </p>
                    <p className="text-sm text-gray-900">promo terbaik</p>
                  </div>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors">
                  Pakai
                </button>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleSubmit}
                disabled={!contactName || !contactEmail || (!sameAsContact && !passengerName)}
                className="w-full mt-6 py-3.5 bg-[#0194f3] hover:bg-[#0180d6] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
              >
                Lanjut ke Pembayaran
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

