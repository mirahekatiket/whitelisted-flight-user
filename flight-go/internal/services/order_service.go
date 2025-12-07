package services

import (
	"errors"
	"time"

	"github.com/mirahekatiket/flight-go/internal/models"
	"github.com/mirahekatiket/flight-go/internal/repository"
)

var (
	ErrOrderNotFound     = errors.New("order not found")
	ErrInvalidFlightDate = errors.New("invalid flight date")
)

type OrderService interface {
	Create(userID string, req CreateOrderRequest) (*models.Order, error)
	GetByID(id string) (*models.Order, error)
	Update(id string, req UpdateOrderRequest) (*models.Order, error)
	Cancel(id string) error
	List(page, pageSize int) (*PaginatedResponse, error)
	ListByUser(userID string, page, pageSize int) (*PaginatedResponse, error)
}

type CreateOrderRequest struct {
	ScheduleID   string             `json:"schedule_id" binding:"required"`
	FlightDate   string             `json:"flight_date" binding:"required"` // YYYY-MM-DD format
	CabinClass   string             `json:"cabin_class" binding:"required"` // economy, business, first
	ContactName  string             `json:"contact_name" binding:"required"`
	ContactEmail string             `json:"contact_email" binding:"required,email"`
	ContactPhone string             `json:"contact_phone" binding:"required"`
	Passengers   []PassengerRequest `json:"passengers" binding:"required,min=1"`
}

type PassengerRequest struct {
	Title    string `json:"title" binding:"required"`     // Mr, Mrs, Ms
	FullName string `json:"full_name" binding:"required"`
	Type     string `json:"type" binding:"required"` // adult, child, infant
}

type UpdateOrderRequest struct {
	Status       string `json:"status"` // pending, confirmed, cancelled, completed
	ContactName  string `json:"contact_name"`
	ContactEmail string `json:"contact_email"`
	ContactPhone string `json:"contact_phone"`
}

type orderService struct {
	orderRepo    repository.OrderRepository
	scheduleRepo repository.ScheduleRepository
}

func NewOrderService(orderRepo repository.OrderRepository, scheduleRepo repository.ScheduleRepository) OrderService {
	return &orderService{
		orderRepo:    orderRepo,
		scheduleRepo: scheduleRepo,
	}
}

func (s *orderService) Create(userID string, req CreateOrderRequest) (*models.Order, error) {
	// Get schedule to calculate price
	schedule, err := s.scheduleRepo.FindByID(req.ScheduleID)
	if err != nil {
		return nil, ErrScheduleNotFound
	}

	// Parse flight date
	flightDate, err := time.Parse("2006-01-02", req.FlightDate)
	if err != nil {
		return nil, ErrInvalidFlightDate
	}

	// Validate flight date is in the future
	if flightDate.Before(time.Now().Truncate(24 * time.Hour)) {
		return nil, ErrInvalidFlightDate
	}

	// Calculate total amount based on cabin class and passengers
	var pricePerPerson float64
	cabinClass := models.CabinClass(req.CabinClass)
	switch cabinClass {
	case models.CabinEconomy:
		pricePerPerson = schedule.EconomyPrice
	case models.CabinBusiness:
		pricePerPerson = schedule.BusinessPrice
	case models.CabinFirst:
		pricePerPerson = schedule.FirstClassPrice
	default:
		pricePerPerson = schedule.EconomyPrice
		cabinClass = models.CabinEconomy
	}

	// Calculate total (adults full price, children 75%, infants free)
	var totalAmount float64
	for _, p := range req.Passengers {
		switch models.PassengerType(p.Type) {
		case models.PassengerAdult:
			totalAmount += pricePerPerson
		case models.PassengerChild:
			totalAmount += pricePerPerson * 0.75
		case models.PassengerInfant:
			// Infants are free
		}
	}

	order := &models.Order{
		UserID:         userID,
		ScheduleID:     req.ScheduleID,
		FlightDate:     flightDate,
		CabinClass:     cabinClass,
		TotalPassenger: len(req.Passengers),
		TotalAmount:    totalAmount,
		Status:         models.OrderPending,
		ContactName:    req.ContactName,
		ContactEmail:   req.ContactEmail,
		ContactPhone:   req.ContactPhone,
	}

	if err := s.orderRepo.Create(order); err != nil {
		return nil, err
	}

	// Add passengers
	for _, p := range req.Passengers {
		passenger := &models.Passenger{
			OrderID:  order.ID,
			Title:    p.Title,
			FullName: p.FullName,
			Type:     models.PassengerType(p.Type),
		}
		if err := s.orderRepo.AddPassenger(passenger); err != nil {
			return nil, err
		}
	}

	// Reload with relations
	return s.orderRepo.FindByID(order.ID)
}

func (s *orderService) GetByID(id string) (*models.Order, error) {
	order, err := s.orderRepo.FindByID(id)
	if err != nil {
		return nil, ErrOrderNotFound
	}
	return order, nil
}

func (s *orderService) Update(id string, req UpdateOrderRequest) (*models.Order, error) {
	order, err := s.orderRepo.FindByID(id)
	if err != nil {
		return nil, ErrOrderNotFound
	}

	if req.Status != "" {
		order.Status = models.OrderStatus(req.Status)
	}
	if req.ContactName != "" {
		order.ContactName = req.ContactName
	}
	if req.ContactEmail != "" {
		order.ContactEmail = req.ContactEmail
	}
	if req.ContactPhone != "" {
		order.ContactPhone = req.ContactPhone
	}

	if err := s.orderRepo.Update(order); err != nil {
		return nil, err
	}

	return s.orderRepo.FindByID(id)
}

func (s *orderService) Cancel(id string) error {
	order, err := s.orderRepo.FindByID(id)
	if err != nil {
		return ErrOrderNotFound
	}

	order.Status = models.OrderCancelled
	return s.orderRepo.Update(order)
}

func (s *orderService) List(page, pageSize int) (*PaginatedResponse, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}

	orders, total, err := s.orderRepo.List(page, pageSize)
	if err != nil {
		return nil, err
	}

	totalPages := int(total) / pageSize
	if int(total)%pageSize > 0 {
		totalPages++
	}

	return &PaginatedResponse{
		Data:       orders,
		Page:       page,
		PageSize:   pageSize,
		TotalItems: total,
		TotalPages: totalPages,
	}, nil
}

func (s *orderService) ListByUser(userID string, page, pageSize int) (*PaginatedResponse, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}

	orders, total, err := s.orderRepo.ListByUser(userID, page, pageSize)
	if err != nil {
		return nil, err
	}

	totalPages := int(total) / pageSize
	if int(total)%pageSize > 0 {
		totalPages++
	}

	return &PaginatedResponse{
		Data:       orders,
		Page:       page,
		PageSize:   pageSize,
		TotalItems: total,
		TotalPages: totalPages,
	}, nil
}

