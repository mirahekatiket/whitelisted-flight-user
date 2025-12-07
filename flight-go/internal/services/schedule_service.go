package services

import (
	"errors"
	"time"

	"github.com/mirahekatiket/flight-go/internal/models"
	"github.com/mirahekatiket/flight-go/internal/repository"
)

var (
	ErrScheduleNotFound = errors.New("schedule not found")
)

type ScheduleService interface {
	Create(req CreateScheduleRequest) (*models.Schedule, error)
	GetByID(id string) (*models.Schedule, error)
	Update(id string, req UpdateScheduleRequest) (*models.Schedule, error)
	Delete(id string) error
	List(page, pageSize int) (*PaginatedResponse, error)
	ListByAirline(airlineID string, page, pageSize int) (*PaginatedResponse, error)
	Search(req SearchFlightRequest) (*PaginatedResponse, error)
}

type CreateScheduleRequest struct {
	AirlineID          string  `json:"airline_id" binding:"required"`
	FlightNumber       string  `json:"flight_number" binding:"required"`
	DepartureAirportID string  `json:"departure_airport_id" binding:"required"`
	DepartureTerminal  string  `json:"departure_terminal"`
	DepartureTime      string  `json:"departure_time" binding:"required"` // HH:MM format
	ArrivalAirportID   string  `json:"arrival_airport_id" binding:"required"`
	ArrivalTerminal    string  `json:"arrival_terminal"`
	ArrivalTime        string  `json:"arrival_time" binding:"required"` // HH:MM format
	Duration           int     `json:"duration"`                        // in minutes
	Aircraft           string  `json:"aircraft"`
	DaysOfWeek         string  `json:"days_of_week"` // e.g., "1,2,3,4,5" for Mon-Fri
	EconomyPrice       float64 `json:"economy_price"`
	BusinessPrice      float64 `json:"business_price"`
	FirstClassPrice    float64 `json:"first_class_price"`
	EconomySeats       int     `json:"economy_seats"`
	BusinessSeats      int     `json:"business_seats"`
	FirstClassSeats    int     `json:"first_class_seats"`
	IsActive           *bool   `json:"is_active"`
	ValidFrom          string  `json:"valid_from"` // YYYY-MM-DD format
	ValidUntil         string  `json:"valid_until"`
}

type UpdateScheduleRequest struct {
	AirlineID          string  `json:"airline_id"`
	FlightNumber       string  `json:"flight_number"`
	DepartureAirportID string  `json:"departure_airport_id"`
	DepartureTerminal  string  `json:"departure_terminal"`
	DepartureTime      string  `json:"departure_time"`
	ArrivalAirportID   string  `json:"arrival_airport_id"`
	ArrivalTerminal    string  `json:"arrival_terminal"`
	ArrivalTime        string  `json:"arrival_time"`
	Duration           int     `json:"duration"`
	Aircraft           string  `json:"aircraft"`
	DaysOfWeek         string  `json:"days_of_week"`
	EconomyPrice       float64 `json:"economy_price"`
	BusinessPrice      float64 `json:"business_price"`
	FirstClassPrice    float64 `json:"first_class_price"`
	EconomySeats       int     `json:"economy_seats"`
	BusinessSeats      int     `json:"business_seats"`
	FirstClassSeats    int     `json:"first_class_seats"`
	IsActive           *bool   `json:"is_active"`
	ValidFrom          string  `json:"valid_from"`
	ValidUntil         string  `json:"valid_until"`
}

type SearchFlightRequest struct {
	Origin        string   `form:"origin" binding:"required"`        // Airport code
	Destination   string   `form:"destination" binding:"required"`   // Airport code
	DepartureDate string   `form:"departure_date" binding:"required"` // YYYY-MM-DD format
	CabinClass    string   `form:"cabin_class"`                      // economy, business, first
	Airlines      []string `form:"airlines"`                         // Filter by airline IDs
	Page          int      `form:"page"`
	PageSize      int      `form:"page_size"`
}

type scheduleService struct {
	scheduleRepo repository.ScheduleRepository
}

func NewScheduleService(scheduleRepo repository.ScheduleRepository) ScheduleService {
	return &scheduleService{scheduleRepo: scheduleRepo}
}

func (s *scheduleService) Create(req CreateScheduleRequest) (*models.Schedule, error) {
	schedule := &models.Schedule{
		AirlineID:          req.AirlineID,
		FlightNumber:       req.FlightNumber,
		DepartureAirportID: req.DepartureAirportID,
		DepartureTerminal:  req.DepartureTerminal,
		DepartureTime:      req.DepartureTime,
		ArrivalAirportID:   req.ArrivalAirportID,
		ArrivalTerminal:    req.ArrivalTerminal,
		ArrivalTime:        req.ArrivalTime,
		Duration:           req.Duration,
		Aircraft:           req.Aircraft,
		DaysOfWeek:         req.DaysOfWeek,
		EconomyPrice:       req.EconomyPrice,
		BusinessPrice:      req.BusinessPrice,
		FirstClassPrice:    req.FirstClassPrice,
		EconomySeats:       req.EconomySeats,
		BusinessSeats:      req.BusinessSeats,
		FirstClassSeats:    req.FirstClassSeats,
		IsActive:           true,
	}

	if req.IsActive != nil {
		schedule.IsActive = *req.IsActive
	}

	if req.DaysOfWeek == "" {
		schedule.DaysOfWeek = "1,2,3,4,5,6,7"
	}

	if req.ValidFrom != "" {
		validFrom, _ := time.Parse("2006-01-02", req.ValidFrom)
		schedule.ValidFrom = validFrom
	} else {
		schedule.ValidFrom = time.Now()
	}

	if req.ValidUntil != "" {
		validUntil, _ := time.Parse("2006-01-02", req.ValidUntil)
		schedule.ValidUntil = validUntil
	} else {
		schedule.ValidUntil = time.Now().AddDate(1, 0, 0) // 1 year from now
	}

	if err := s.scheduleRepo.Create(schedule); err != nil {
		return nil, err
	}

	// Reload with relations
	return s.scheduleRepo.FindByID(schedule.ID)
}

func (s *scheduleService) GetByID(id string) (*models.Schedule, error) {
	schedule, err := s.scheduleRepo.FindByID(id)
	if err != nil {
		return nil, ErrScheduleNotFound
	}
	return schedule, nil
}

func (s *scheduleService) Update(id string, req UpdateScheduleRequest) (*models.Schedule, error) {
	schedule, err := s.scheduleRepo.FindByID(id)
	if err != nil {
		return nil, ErrScheduleNotFound
	}

	if req.AirlineID != "" {
		schedule.AirlineID = req.AirlineID
	}
	if req.FlightNumber != "" {
		schedule.FlightNumber = req.FlightNumber
	}
	if req.DepartureAirportID != "" {
		schedule.DepartureAirportID = req.DepartureAirportID
	}
	if req.DepartureTerminal != "" {
		schedule.DepartureTerminal = req.DepartureTerminal
	}
	if req.DepartureTime != "" {
		schedule.DepartureTime = req.DepartureTime
	}
	if req.ArrivalAirportID != "" {
		schedule.ArrivalAirportID = req.ArrivalAirportID
	}
	if req.ArrivalTerminal != "" {
		schedule.ArrivalTerminal = req.ArrivalTerminal
	}
	if req.ArrivalTime != "" {
		schedule.ArrivalTime = req.ArrivalTime
	}
	if req.Duration > 0 {
		schedule.Duration = req.Duration
	}
	if req.Aircraft != "" {
		schedule.Aircraft = req.Aircraft
	}
	if req.DaysOfWeek != "" {
		schedule.DaysOfWeek = req.DaysOfWeek
	}
	if req.EconomyPrice > 0 {
		schedule.EconomyPrice = req.EconomyPrice
	}
	if req.BusinessPrice > 0 {
		schedule.BusinessPrice = req.BusinessPrice
	}
	if req.FirstClassPrice > 0 {
		schedule.FirstClassPrice = req.FirstClassPrice
	}
	if req.EconomySeats > 0 {
		schedule.EconomySeats = req.EconomySeats
	}
	if req.BusinessSeats > 0 {
		schedule.BusinessSeats = req.BusinessSeats
	}
	if req.FirstClassSeats > 0 {
		schedule.FirstClassSeats = req.FirstClassSeats
	}
	if req.IsActive != nil {
		schedule.IsActive = *req.IsActive
	}
	if req.ValidFrom != "" {
		validFrom, _ := time.Parse("2006-01-02", req.ValidFrom)
		schedule.ValidFrom = validFrom
	}
	if req.ValidUntil != "" {
		validUntil, _ := time.Parse("2006-01-02", req.ValidUntil)
		schedule.ValidUntil = validUntil
	}

	if err := s.scheduleRepo.Update(schedule); err != nil {
		return nil, err
	}

	return s.scheduleRepo.FindByID(id)
}

func (s *scheduleService) Delete(id string) error {
	_, err := s.scheduleRepo.FindByID(id)
	if err != nil {
		return ErrScheduleNotFound
	}

	return s.scheduleRepo.Delete(id)
}

func (s *scheduleService) List(page, pageSize int) (*PaginatedResponse, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}

	schedules, total, err := s.scheduleRepo.List(page, pageSize)
	if err != nil {
		return nil, err
	}

	totalPages := int(total) / pageSize
	if int(total)%pageSize > 0 {
		totalPages++
	}

	return &PaginatedResponse{
		Data:       schedules,
		Page:       page,
		PageSize:   pageSize,
		TotalItems: total,
		TotalPages: totalPages,
	}, nil
}

func (s *scheduleService) ListByAirline(airlineID string, page, pageSize int) (*PaginatedResponse, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}

	schedules, total, err := s.scheduleRepo.ListByAirline(airlineID, page, pageSize)
	if err != nil {
		return nil, err
	}

	totalPages := int(total) / pageSize
	if int(total)%pageSize > 0 {
		totalPages++
	}

	return &PaginatedResponse{
		Data:       schedules,
		Page:       page,
		PageSize:   pageSize,
		TotalItems: total,
		TotalPages: totalPages,
	}, nil
}

func (s *scheduleService) Search(req SearchFlightRequest) (*PaginatedResponse, error) {
	if req.Page < 1 {
		req.Page = 1
	}
	if req.PageSize < 1 {
		req.PageSize = 10
	}

	departureDate, _ := time.Parse("2006-01-02", req.DepartureDate)

	params := repository.SearchParams{
		DepartureAirportCode: req.Origin,
		ArrivalAirportCode:   req.Destination,
		DepartureDate:        departureDate,
		CabinClass:           models.CabinClass(req.CabinClass),
		AirlineIDs:           req.Airlines,
		Page:                 req.Page,
		PageSize:             req.PageSize,
	}

	schedules, total, err := s.scheduleRepo.Search(params)
	if err != nil {
		return nil, err
	}

	totalPages := int(total) / req.PageSize
	if int(total)%req.PageSize > 0 {
		totalPages++
	}

	return &PaginatedResponse{
		Data:       schedules,
		Page:       req.Page,
		PageSize:   req.PageSize,
		TotalItems: total,
		TotalPages: totalPages,
	}, nil
}

