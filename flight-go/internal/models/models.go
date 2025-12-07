package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Base model with UUID
type BaseModel struct {
	ID        string         `json:"id" gorm:"primaryKey;type:varchar(36)"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

func (b *BaseModel) BeforeCreate(tx *gorm.DB) error {
	if b.ID == "" {
		b.ID = uuid.New().String()
	}
	return nil
}

// User roles
type Role string

const (
	RoleUser  Role = "user"
	RoleAdmin Role = "admin"
)

// User model
type User struct {
	BaseModel
	Email    string `json:"email" gorm:"uniqueIndex;not null"`
	Password string `json:"-" gorm:"not null"`
	Name     string `json:"name" gorm:"not null"`
	Phone    string `json:"phone"`
	Role     Role   `json:"role" gorm:"default:user"`
}

// Airline model
type Airline struct {
	BaseModel
	Code      string     `json:"code" gorm:"uniqueIndex;not null;type:varchar(3)"`
	Name      string     `json:"name" gorm:"not null"`
	Logo      string     `json:"logo"`
	IsActive  bool       `json:"is_active" gorm:"default:true"`
	Schedules []Schedule `json:"schedules,omitempty" gorm:"foreignKey:AirlineID"`
}

// Airport model
type Airport struct {
	BaseModel
	Code string `json:"code" gorm:"uniqueIndex;not null;type:varchar(3)"`
	Name string `json:"name" gorm:"not null"`
	City string `json:"city" gorm:"not null"`
}

// Schedule model (flight schedule)
type Schedule struct {
	BaseModel
	AirlineID           string    `json:"airline_id" gorm:"not null"`
	Airline             *Airline  `json:"airline,omitempty" gorm:"foreignKey:AirlineID"`
	FlightNumber        string    `json:"flight_number" gorm:"not null"`
	DepartureAirportID  string    `json:"departure_airport_id" gorm:"not null"`
	DepartureAirport    *Airport  `json:"departure_airport,omitempty" gorm:"foreignKey:DepartureAirportID"`
	DepartureTerminal   string    `json:"departure_terminal"`
	DepartureTime       string    `json:"departure_time" gorm:"not null"` // HH:MM format
	ArrivalAirportID    string    `json:"arrival_airport_id" gorm:"not null"`
	ArrivalAirport      *Airport  `json:"arrival_airport,omitempty" gorm:"foreignKey:ArrivalAirportID"`
	ArrivalTerminal     string    `json:"arrival_terminal"`
	ArrivalTime         string    `json:"arrival_time" gorm:"not null"` // HH:MM format
	Duration            int       `json:"duration"`                     // in minutes
	Aircraft            string    `json:"aircraft"`
	DaysOfWeek          string    `json:"days_of_week" gorm:"default:'1,2,3,4,5,6,7'"` // 1=Mon, 7=Sun
	EconomyPrice        float64   `json:"economy_price" gorm:"default:0"`
	BusinessPrice       float64   `json:"business_price" gorm:"default:0"`
	FirstClassPrice     float64   `json:"first_class_price" gorm:"default:0"`
	EconomySeats        int       `json:"economy_seats" gorm:"default:150"`
	BusinessSeats       int       `json:"business_seats" gorm:"default:30"`
	FirstClassSeats     int       `json:"first_class_seats" gorm:"default:10"`
	IsActive            bool      `json:"is_active" gorm:"default:true"`
}

// CabinClass type
type CabinClass string

const (
	CabinEconomy  CabinClass = "economy"
	CabinBusiness CabinClass = "business"
	CabinFirst    CabinClass = "first"
)

// OrderStatus type
type OrderStatus string

const (
	OrderPending   OrderStatus = "pending"
	OrderConfirmed OrderStatus = "confirmed"
	OrderCancelled OrderStatus = "cancelled"
	OrderCompleted OrderStatus = "completed"
)

// Order model
type Order struct {
	BaseModel
	UserID         string       `json:"user_id" gorm:"not null"`
	User           *User        `json:"user,omitempty" gorm:"foreignKey:UserID"`
	ScheduleID     string       `json:"schedule_id" gorm:"not null"`
	Schedule       *Schedule    `json:"schedule,omitempty" gorm:"foreignKey:ScheduleID"`
	FlightDate     time.Time    `json:"flight_date" gorm:"not null"`
	CabinClass     CabinClass   `json:"cabin_class" gorm:"not null"`
	TotalPassenger int          `json:"total_passenger" gorm:"not null"`
	TotalAmount    float64      `json:"total_amount" gorm:"not null"`
	Status         OrderStatus  `json:"status" gorm:"default:pending"`
	ContactName    string       `json:"contact_name" gorm:"not null"`
	ContactEmail   string       `json:"contact_email" gorm:"not null"`
	ContactPhone   string       `json:"contact_phone" gorm:"not null"`
	Passengers     []Passenger  `json:"passengers,omitempty" gorm:"foreignKey:OrderID"`
}

// PassengerType
type PassengerType string

const (
	PassengerAdult  PassengerType = "adult"
	PassengerChild  PassengerType = "child"
	PassengerInfant PassengerType = "infant"
)

// Passenger model
type Passenger struct {
	BaseModel
	OrderID  string        `json:"order_id" gorm:"not null"`
	Title    string        `json:"title" gorm:"not null"` // Mr, Mrs, Ms
	FullName string        `json:"full_name" gorm:"not null"`
	Type     PassengerType `json:"type" gorm:"not null"`
}

