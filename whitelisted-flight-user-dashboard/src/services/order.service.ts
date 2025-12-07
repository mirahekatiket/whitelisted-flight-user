import { api } from "@/lib/api";

export interface PassengerRequest {
  title: string;
  full_name: string;
  type: "adult" | "child" | "infant";
}

export interface CreateOrderRequest {
  schedule_id: string;
  flight_date: string; // YYYY-MM-DD
  cabin_class: "economy" | "business" | "first";
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  passengers: PassengerRequest[];
}

export interface Order {
  id: string;
  user_id: string;
  schedule_id: string;
  flight_date: string;
  cabin_class: string;
  total_passenger: number;
  total_amount: number;
  status: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  passengers: any[];
  schedule?: any;
  created_at: string;
  updated_at: string;
}

export const orderService = {
  // Create order
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    return api.post("/orders", data, true);
  },

  // Get my orders
  async getMyOrders(page = 1, pageSize = 10) {
    return api.get(`/orders?page=${page}&page_size=${pageSize}`, true);
  },

  // Get order by ID
  async getOrderById(id: string): Promise<Order> {
    return api.get(`/orders/${id}`, true);
  },

  // Cancel order
  async cancelOrder(id: string) {
    return api.post(`/orders/${id}/cancel`, undefined, true);
  },
};

