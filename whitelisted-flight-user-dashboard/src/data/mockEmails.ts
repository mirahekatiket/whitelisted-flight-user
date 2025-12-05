import { WhitelistedEmail } from "@/types";

export const initialEmails: WhitelistedEmail[] = [
  {
    id: "1",
    email: "john.doe@company.com",
    name: "John Doe",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    enabledAirlines: ["ga", "jt", "qg"],
  },
  {
    id: "2",
    email: "jane.smith@enterprise.com",
    name: "Jane Smith",
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-03-10"),
    enabledAirlines: ["ga", "id", "qz"],
  },
  {
    id: "3",
    email: "bob.wilson@startup.io",
    name: "Bob Wilson",
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-05"),
    enabledAirlines: ["jt", "iu", "sj"],
  },
];

