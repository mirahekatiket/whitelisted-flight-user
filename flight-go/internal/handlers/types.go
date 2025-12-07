package handlers

// Swagger type definitions for documentation

// LoginRequest represents the login request body
type LoginRequest struct {
	Email    string `json:"email" example:"admin@flight.com"`
	Password string `json:"password" example:"admin123"`
}

// RegisterRequest represents the registration request body
type RegisterRequest struct {
	Email    string `json:"email" example:"user@example.com"`
	Password string `json:"password" example:"password123"`
	Name     string `json:"name" example:"John Doe"`
	Phone    string `json:"phone" example:"+6281234567890"`
}

// TokenResponse represents the login response
type TokenResponse struct {
	Token     string `json:"token" example:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`
	ExpiresAt string `json:"expires_at" example:"2024-12-08T00:00:00Z"`
	User      User   `json:"user"`
}

// User represents a user object
type User struct {
	ID        string `json:"id" example:"550e8400-e29b-41d4-a716-446655440000"`
	Email     string `json:"email" example:"user@example.com"`
	Name      string `json:"name" example:"John Doe"`
	Phone     string `json:"phone" example:"+6281234567890"`
	Role      string `json:"role" example:"user"`
	CreatedAt string `json:"created_at" example:"2024-12-07T00:00:00Z"`
	UpdatedAt string `json:"updated_at" example:"2024-12-07T00:00:00Z"`
}

// Airline represents an airline object
type Airline struct {
	ID        string `json:"id" example:"ga"`
	Code      string `json:"code" example:"GA"`
	Name      string `json:"name" example:"Garuda Indonesia"`
	Logo      string `json:"logo" example:"https://example.com/logo.png"`
	IsActive  bool   `json:"is_active" example:"true"`
	CreatedAt string `json:"created_at" example:"2024-12-07T00:00:00Z"`
	UpdatedAt string `json:"updated_at" example:"2024-12-07T00:00:00Z"`
}

// CreateAirlineRequest represents the create airline request
type CreateAirlineRequest struct {
	Code     string `json:"code" example:"GA"`
	Name     string `json:"name" example:"Garuda Indonesia"`
	Logo     string `json:"logo" example:"https://example.com/logo.png"`
	IsActive *bool  `json:"is_active" example:"true"`
}

// UpdateAirlineRequest represents the update airline request
type UpdateAirlineRequest struct {
	Code     string `json:"code" example:"GA"`
	Name     string `json:"name" example:"Garuda Indonesia"`
	Logo     string `json:"logo" example:"https://example.com/logo.png"`
	IsActive *bool  `json:"is_active" example:"true"`
}

// Airport represents an airport object
type Airport struct {
	ID        string `json:"id" example:"cgk"`
	Code      string `json:"code" example:"CGK"`
	City      string `json:"city" example:"Jakarta"`
	Name      string `json:"name" example:"Soekarno-Hatta International Airport"`
	CreatedAt string `json:"created_at" example:"2024-12-07T00:00:00Z"`
	UpdatedAt string `json:"updated_at" example:"2024-12-07T00:00:00Z"`
}

// Schedule represents a flight schedule
type Schedule struct {
	ID                 string   `json:"id" example:"550e8400-e29b-41d4-a716-446655440000"`
	AirlineID          string   `json:"airline_id" example:"ga"`
	Airline            *Airline `json:"airline,omitempty"`
	FlightNumber       string   `json:"flight_number" example:"GA123"`
	DepartureAirportID string   `json:"departure_airport_id" example:"cgk"`
	DepartureAirport   *Airport `json:"departure_airport,omitempty"`
	DepartureTerminal  string   `json:"departure_terminal" example:"3"`
	DepartureTime      string   `json:"departure_time" example:"08:00"`
	ArrivalAirportID   string   `json:"arrival_airport_id" example:"dps"`
	ArrivalAirport     *Airport `json:"arrival_airport,omitempty"`
	ArrivalTerminal    string   `json:"arrival_terminal" example:"D"`
	ArrivalTime        string   `json:"arrival_time" example:"10:30"`
	Duration           int      `json:"duration" example:"150"`
	Aircraft           string   `json:"aircraft" example:"Boeing 737-800"`
	DaysOfWeek         string   `json:"days_of_week" example:"1,2,3,4,5,6,7"`
	EconomyPrice       float64  `json:"economy_price" example:"1500000"`
	BusinessPrice      float64  `json:"business_price" example:"4500000"`
	FirstClassPrice    float64  `json:"first_class_price" example:"8000000"`
	EconomySeats       int      `json:"economy_seats" example:"150"`
	BusinessSeats      int      `json:"business_seats" example:"30"`
	FirstClassSeats    int      `json:"first_class_seats" example:"10"`
	IsActive           bool     `json:"is_active" example:"true"`
	ValidFrom          string   `json:"valid_from" example:"2024-01-01"`
	ValidUntil         string   `json:"valid_until" example:"2024-12-31"`
}

// CreateScheduleRequest represents the create schedule request
type CreateScheduleRequest struct {
	AirlineID          string  `json:"airline_id" example:"ga"`
	FlightNumber       string  `json:"flight_number" example:"GA123"`
	DepartureAirportID string  `json:"departure_airport_id" example:"cgk"`
	DepartureTerminal  string  `json:"departure_terminal" example:"3"`
	DepartureTime      string  `json:"departure_time" example:"08:00"`
	ArrivalAirportID   string  `json:"arrival_airport_id" example:"dps"`
	ArrivalTerminal    string  `json:"arrival_terminal" example:"D"`
	ArrivalTime        string  `json:"arrival_time" example:"10:30"`
	Duration           int     `json:"duration" example:"150"`
	Aircraft           string  `json:"aircraft" example:"Boeing 737-800"`
	DaysOfWeek         string  `json:"days_of_week" example:"1,2,3,4,5,6,7"`
	EconomyPrice       float64 `json:"economy_price" example:"1500000"`
	BusinessPrice      float64 `json:"business_price" example:"4500000"`
	FirstClassPrice    float64 `json:"first_class_price" example:"8000000"`
	EconomySeats       int     `json:"economy_seats" example:"150"`
	BusinessSeats      int     `json:"business_seats" example:"30"`
	FirstClassSeats    int     `json:"first_class_seats" example:"10"`
	IsActive           *bool   `json:"is_active" example:"true"`
	ValidFrom          string  `json:"valid_from" example:"2024-01-01"`
	ValidUntil         string  `json:"valid_until" example:"2024-12-31"`
}

// Order represents an order object
type Order struct {
	ID             string      `json:"id" example:"550e8400-e29b-41d4-a716-446655440000"`
	UserID         string      `json:"user_id" example:"550e8400-e29b-41d4-a716-446655440000"`
	ScheduleID     string      `json:"schedule_id" example:"550e8400-e29b-41d4-a716-446655440000"`
	Schedule       *Schedule   `json:"schedule,omitempty"`
	FlightDate     string      `json:"flight_date" example:"2024-12-20"`
	CabinClass     string      `json:"cabin_class" example:"economy"`
	TotalPassenger int         `json:"total_passenger" example:"2"`
	TotalAmount    float64     `json:"total_amount" example:"3000000"`
	Status         string      `json:"status" example:"pending"`
	ContactName    string      `json:"contact_name" example:"John Doe"`
	ContactEmail   string      `json:"contact_email" example:"john@example.com"`
	ContactPhone   string      `json:"contact_phone" example:"+6281234567890"`
	Passengers     []Passenger `json:"passengers,omitempty"`
	CreatedAt      string      `json:"created_at" example:"2024-12-07T00:00:00Z"`
	UpdatedAt      string      `json:"updated_at" example:"2024-12-07T00:00:00Z"`
}

// Passenger represents a passenger
type Passenger struct {
	ID       string `json:"id" example:"550e8400-e29b-41d4-a716-446655440000"`
	OrderID  string `json:"order_id" example:"550e8400-e29b-41d4-a716-446655440000"`
	Title    string `json:"title" example:"Mr"`
	FullName string `json:"full_name" example:"John Doe"`
	Type     string `json:"type" example:"adult"`
}

// CreateOrderRequest represents the create order request
type CreateOrderRequest struct {
	ScheduleID   string             `json:"schedule_id" example:"550e8400-e29b-41d4-a716-446655440000"`
	FlightDate   string             `json:"flight_date" example:"2024-12-20"`
	CabinClass   string             `json:"cabin_class" example:"economy"`
	ContactName  string             `json:"contact_name" example:"John Doe"`
	ContactEmail string             `json:"contact_email" example:"john@example.com"`
	ContactPhone string             `json:"contact_phone" example:"+6281234567890"`
	Passengers   []PassengerRequest `json:"passengers"`
}

// PassengerRequest represents passenger in order request
type PassengerRequest struct {
	Title    string `json:"title" example:"Mr"`
	FullName string `json:"full_name" example:"John Doe"`
	Type     string `json:"type" example:"adult"`
}

// PaginatedResponse represents paginated response
type PaginatedResponse struct {
	Data       interface{} `json:"data"`
	Page       int         `json:"page" example:"1"`
	PageSize   int         `json:"page_size" example:"10"`
	TotalItems int64       `json:"total_items" example:"100"`
	TotalPages int         `json:"total_pages" example:"10"`
}

// SuccessMessageResponse represents success message
type SuccessMessageResponse struct {
	Success bool   `json:"success" example:"true"`
	Message string `json:"message" example:"Operation completed successfully"`
}

// ErrorMessageResponse represents error message
type ErrorMessageResponse struct {
	Success bool   `json:"success" example:"false"`
	Error   string `json:"error" example:"Error message"`
}

