import { Flight } from "@/types/flight";

export const mockFlights: Flight[] = [
  {
    id: "fl-001",
    segments: [
      {
        id: "seg-001",
        airline: { code: "SJ", name: "Sriwijaya Air" },
        flightNumber: "SJ-267",
        departure: {
          airport: { code: "CGK", city: "Jakarta", name: "Soekarno-Hatta" },
          terminal: "Terminal 2",
          time: "18:00",
        },
        arrival: {
          airport: { code: "DPS", city: "Denpasar-Bali", name: "Ngurah Rai" },
          terminal: "Terminal 3F",
          time: "20:50",
        },
        duration: "1j 50m",
        stops: 0,
        aircraft: "Boeing 737-800",
      },
    ],
    fareOptions: [
      {
        id: "fare-001",
        name: "Ekonomi",
        price: 980460,
        originalPrice: 1078948,
        features: {
          cabinBaggage: "7 kg",
          checkedBaggage: "15 kg",
          meal: "1x Makan",
          refund: "Maks. uang kembali IDR 862.414",
          reschedule: "1x, Biaya IDR 108.241",
        },
      },
      {
        id: "fare-002",
        name: "Ekonomi + 100% Refund Downpay",
        price: 1156943,
        originalPrice: 1255431,
        features: {
          cabinBaggage: "7 kg",
          checkedBaggage: "15 kg",
          meal: "1x Makan",
          refund: "Refundable up to 1.058.897 of the ticket price",
          reschedule: "1x, Biaya IDR 108.241",
        },
        isExclusive: true,
      },
      {
        id: "fare-003",
        name: "Ekonomi + 100% Refund Reschedule",
        price: 1156943,
        originalPrice: 1255431,
        features: {
          cabinBaggage: "7 kg",
          checkedBaggage: "15 kg",
          meal: "1x Makan",
          refund: "Refundable up to 1.058.897 of the ticket price",
          reschedule: "1x, Bebas biaya",
        },
        isExclusive: true,
      },
    ],
    lowestPrice: 980460,
    tags: ["Bisa reschedule", "Bisa 100% Refund"],
  },
  {
    id: "fl-002",
    segments: [
      {
        id: "seg-002",
        airline: { code: "QZ", name: "AirAsia Indonesia" },
        flightNumber: "QZ-7521",
        departure: {
          airport: { code: "CGK", city: "Jakarta", name: "Soekarno-Hatta" },
          terminal: "Terminal 2",
          time: "06:20",
        },
        arrival: {
          airport: { code: "DPS", city: "Denpasar-Bali", name: "Ngurah Rai" },
          terminal: "Terminal 1",
          time: "09:10",
        },
        duration: "1j 50m",
        stops: 0,
        aircraft: "Airbus A320",
      },
    ],
    fareOptions: [
      {
        id: "fare-004",
        name: "Ekonomi",
        price: 1039001,
        originalPrice: 1137489,
        features: {
          cabinBaggage: "7 kg",
          checkedBaggage: "15 kg",
          meal: "1x Makan",
          refund: "Maks. uang kembali IDR 920.000",
          reschedule: "1x, Biaya IDR 115.000",
        },
      },
    ],
    lowestPrice: 1039001,
    tags: ["Bisa reschedule", "Bisa 100% Refund"],
  },
  {
    id: "fl-003",
    segments: [
      {
        id: "seg-003",
        airline: { code: "GA", name: "Garuda Indonesia" },
        flightNumber: "GA-418",
        departure: {
          airport: { code: "CGK", city: "Jakarta", name: "Soekarno-Hatta" },
          terminal: "Terminal 3",
          time: "07:30",
        },
        arrival: {
          airport: { code: "DPS", city: "Denpasar-Bali", name: "Ngurah Rai" },
          terminal: "Domestic",
          time: "10:20",
        },
        duration: "1j 50m",
        stops: 0,
        aircraft: "Boeing 737-800NG",
      },
    ],
    fareOptions: [
      {
        id: "fare-005",
        name: "Ekonomi Light",
        price: 1250000,
        features: {
          cabinBaggage: "7 kg",
          checkedBaggage: "0 kg",
          meal: "Tidak termasuk",
          refund: "Non-refundable",
          reschedule: "1x, Biaya IDR 250.000",
        },
      },
      {
        id: "fare-006",
        name: "Ekonomi Flex",
        price: 1580000,
        features: {
          cabinBaggage: "7 kg",
          checkedBaggage: "20 kg",
          meal: "1x Makan",
          refund: "Refundable 75%",
          reschedule: "Bebas biaya",
        },
      },
    ],
    lowestPrice: 1250000,
    tags: ["Fast Track", "Jaminan Harga Termurah"],
  },
  {
    id: "fl-004",
    segments: [
      {
        id: "seg-004",
        airline: { code: "JT", name: "Lion Air" },
        flightNumber: "JT-18",
        departure: {
          airport: { code: "CGK", city: "Jakarta", name: "Soekarno-Hatta" },
          terminal: "Terminal 1",
          time: "14:00",
        },
        arrival: {
          airport: { code: "DPS", city: "Denpasar-Bali", name: "Ngurah Rai" },
          terminal: "Domestic",
          time: "16:50",
        },
        duration: "1j 50m",
        stops: 0,
        aircraft: "Boeing 737 MAX 8",
      },
    ],
    fareOptions: [
      {
        id: "fare-007",
        name: "Ekonomi",
        price: 875000,
        originalPrice: 950000,
        features: {
          cabinBaggage: "7 kg",
          checkedBaggage: "20 kg",
          meal: "Tidak termasuk",
          refund: "Maks. 75%",
          reschedule: "1x, Biaya IDR 100.000",
        },
      },
    ],
    lowestPrice: 875000,
    tags: ["Harga Gledek", "Bisa reschedule"],
  },
  {
    id: "fl-005",
    segments: [
      {
        id: "seg-005",
        airline: { code: "QG", name: "Citilink" },
        flightNumber: "QG-812",
        departure: {
          airport: { code: "CGK", city: "Jakarta", name: "Soekarno-Hatta" },
          terminal: "Terminal 2",
          time: "21:15",
        },
        arrival: {
          airport: { code: "DPS", city: "Denpasar-Bali", name: "Ngurah Rai" },
          terminal: "Domestic",
          time: "00:05",
        },
        duration: "1j 50m",
        stops: 0,
        aircraft: "Airbus A320neo",
      },
    ],
    fareOptions: [
      {
        id: "fare-008",
        name: "Supergreen",
        price: 920000,
        features: {
          cabinBaggage: "7 kg",
          checkedBaggage: "20 kg",
          meal: "1x Snack",
          refund: "Refundable 80%",
          reschedule: "1x, Biaya IDR 85.000",
        },
      },
    ],
    lowestPrice: 920000,
    tags: ["Bisa reschedule", "Penerbangan Langsung"],
  },
];

export const dateOptions = [
  { date: "Jum, 05 Des 2025", price: 619360 },
  { date: "Sab, 06 Des 2025", price: 774200 },
  { date: "Min, 07 Des 2025", price: 881972, selected: true },
  { date: "Sen, 08 Des 2025", price: 937786 },
  { date: "Sel, 09 Des 2025", price: 872101 },
  { date: "Rab, 10 Des 2025", price: 1115920 },
  { date: "Kam, 11 Des 2025", price: 1052100 },
  { date: "Jum, 12 Des 2025", price: 1133100 },
  { date: "Sab, 13 Des 2025", price: 1003420 },
];

