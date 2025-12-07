package services

import (
	"time"
	
	"github.com/mirahekatiket/flight-go/internal/models"
	"github.com/mirahekatiket/flight-go/internal/repository"
)

// DualScheduleService manages schedules across staging and production databases
type DualScheduleService struct {
	stagingRepo      repository.ScheduleRepository
	productionRepo   repository.ScheduleRepository
	whitelistService *WhitelistService
	airlineRepo      repository.AirlineRepository
}

func NewDualScheduleService(
	stagingRepo repository.ScheduleRepository,
	productionRepo repository.ScheduleRepository,
	whitelistService *WhitelistService,
	airlineRepo repository.AirlineRepository,
) *DualScheduleService {
	return &DualScheduleService{
		stagingRepo:      stagingRepo,
		productionRepo:   productionRepo,
		whitelistService: whitelistService,
		airlineRepo:      airlineRepo,
	}
}

// currentEmail stores the current request's email for database selection
var currentEmail string

// SetCurrentEmail sets the email for the current request
func (s *DualScheduleService) SetCurrentEmail(email string) {
	currentEmail = email
}

// getWhitelistedAirlineIDs returns the list of whitelisted airline IDs for the current user
func (s *DualScheduleService) getWhitelistedAirlineIDs() []string {
	email := currentEmail
	
	if email == "" {
		return []string{}
	}

	// Check if user is whitelisted
	whitelisted, err := s.whitelistService.IsEmailWhitelisted(email)
	if err != nil || !whitelisted {
		return []string{}
	}

	// Get whitelisted user to get enabled airlines
	whitelistedUser, err := s.whitelistService.GetByEmail(email)
	if err != nil {
		return []string{}
	}

	return whitelistedUser.EnabledAirlineIDs
}

// getRepo returns the appropriate repository based on email and whitelist status
func (s *DualScheduleService) getRepo() repository.ScheduleRepository {
	email := currentEmail
	
	if email == "" {
		return s.stagingRepo
	}

	// Check if user is whitelisted
	whitelisted, err := s.whitelistService.IsEmailWhitelisted(email)
	if err != nil || !whitelisted {
		return s.stagingRepo
	}

	// Get whitelisted user to check enabled airlines
	whitelistedUser, err := s.whitelistService.GetByEmail(email)
	if err != nil {
		return s.stagingRepo
	}

	// If user has whitelisted airlines, use production
	if len(whitelistedUser.EnabledAirlineIDs) > 0 {
		return s.productionRepo
	}

	return s.stagingRepo
}

// Search searches for flights based on criteria
// Iterates through all airlines and combines results from staging and production
func (s *DualScheduleService) Search(req SearchFlightRequest) (*PaginatedResponse, error) {
	// Parse departure date
	departureDate, err := time.Parse("2006-01-02", req.DepartureDate)
	if err != nil {
		return nil, err
	}
	
	// Convert cabin class string to CabinClass type
	var cabinClass models.CabinClass
	switch req.CabinClass {
	case "business":
		cabinClass = models.CabinBusiness
	case "first":
		cabinClass = models.CabinFirst
	default:
		cabinClass = models.CabinEconomy
	}
	
	// Get whitelisted airline IDs for the current user
	whitelistedAirlineIDs := s.getWhitelistedAirlineIDs()
	whitelistedMap := make(map[string]bool)
	for _, id := range whitelistedAirlineIDs {
		whitelistedMap[id] = true
	}
	
	// Get all airlines to iterate through
	var airlinesToQuery []string
	if len(req.Airlines) > 0 {
		// If specific airlines requested, use those
		airlinesToQuery = req.Airlines
	} else {
		// Get all active airlines from staging (they should be the same in both)
		allAirlines, err := s.airlineRepo.ListAll()
		if err != nil {
			return nil, err
		}
		for _, airline := range allAirlines {
			if airline.IsActive {
				airlinesToQuery = append(airlinesToQuery, airline.ID)
			}
		}
	}
	
	// Combine results from both databases
	var allSchedules []models.Schedule
	
	// Query each airline
	for _, airlineID := range airlinesToQuery {
		var repo repository.ScheduleRepository
		
		// Check if this airline is whitelisted for the user
		if whitelistedMap[airlineID] {
			// Use production database for whitelisted airlines
			repo = s.productionRepo
		} else {
			// Use staging database for non-whitelisted airlines
			repo = s.stagingRepo
		}
		
		// Create search params for this specific airline
		params := repository.SearchParams{
			DepartureAirportCode: req.Origin,
			ArrivalAirportCode:   req.Destination,
			DepartureDate:        departureDate,
			CabinClass:           cabinClass,
			AirlineIDs:           []string{airlineID},
			Page:                 1,
			PageSize:             1000, // Get all results for this airline
		}
		
		schedules, _, err := repo.Search(params)
		if err != nil {
			// Log error but continue with other airlines
			continue
		}
		
		allSchedules = append(allSchedules, schedules...)
	}
	
	// Calculate pagination
	total := int64(len(allSchedules))
	start := (req.Page - 1) * req.PageSize
	end := start + req.PageSize
	
	if start >= len(allSchedules) {
		allSchedules = []models.Schedule{}
	} else {
		if end > len(allSchedules) {
			end = len(allSchedules)
		}
		allSchedules = allSchedules[start:end]
	}
	
	totalPages := int(total) / req.PageSize
	if int(total)%req.PageSize != 0 {
		totalPages++
	}

	return &PaginatedResponse{
		Data:       allSchedules,
		Page:       req.Page,
		PageSize:   req.PageSize,
		TotalItems: total,
		TotalPages: totalPages,
	}, nil
}

// GetByID gets a schedule by ID
func (s *DualScheduleService) GetByID(id string) (*models.Schedule, error) {
	repo := s.getRepo()
	return repo.FindByID(id)
}

// List lists all schedules (admin operation - uses staging)
func (s *DualScheduleService) List(page, pageSize int) (*PaginatedResponse, error) {
	schedules, total, err := s.stagingRepo.List(page, pageSize)
	if err != nil {
		return nil, err
	}

	totalPages := int(total) / pageSize
	if int(total)%pageSize != 0 {
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

// ListByAirline lists schedules for a specific airline
func (s *DualScheduleService) ListByAirline(airlineID string, page, pageSize int) (*PaginatedResponse, error) {
	repo := s.getRepo()
	
	schedules, total, err := repo.ListByAirline(airlineID, page, pageSize)
	if err != nil {
		return nil, err
	}

	totalPages := int(total) / pageSize
	if int(total)%pageSize != 0 {
		totalPages++
	}

	return &PaginatedResponse{
		Data:       schedules,
		Page:       page,
		PageSize:   pageSize,
		TotalItems: total,
		TotalPages: int(totalPages),
	}, nil
}

// Create creates a new schedule (admin operation - creates in both databases)
func (s *DualScheduleService) Create(req CreateScheduleRequest) (*models.Schedule, error) {
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
	}

	// Handle IsActive
	if req.IsActive != nil {
		schedule.IsActive = *req.IsActive
	} else {
		schedule.IsActive = true // Default to active
	}

	// Create in staging first
	if err := s.stagingRepo.Create(schedule); err != nil {
		return nil, err
	}

	// Also create in production
	if err := s.productionRepo.Create(schedule); err != nil {
		// Log error but don't fail the request
		// Production DB might be out of sync
		// In production, you might want to use a message queue for this
	}

	return schedule, nil
}

// Update updates a schedule (admin operation - updates in both databases)
func (s *DualScheduleService) Update(id string, req UpdateScheduleRequest) (*models.Schedule, error) {
	// Find schedule in staging
	schedule, err := s.stagingRepo.FindByID(id)
	if err != nil {
		return nil, err
	}

	// Update fields
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
	if req.BusinessPrice >= 0 {
		schedule.BusinessPrice = req.BusinessPrice
	}
	if req.FirstClassPrice >= 0 {
		schedule.FirstClassPrice = req.FirstClassPrice
	}
	if req.EconomySeats > 0 {
		schedule.EconomySeats = req.EconomySeats
	}
	if req.BusinessSeats >= 0 {
		schedule.BusinessSeats = req.BusinessSeats
	}
	if req.FirstClassSeats >= 0 {
		schedule.FirstClassSeats = req.FirstClassSeats
	}
	if req.IsActive != nil {
		schedule.IsActive = *req.IsActive
	}

	// Update in staging
	if err := s.stagingRepo.Update(schedule); err != nil {
		return nil, err
	}

	// Also update in production
	s.productionRepo.Update(schedule)

	return schedule, nil
}

// Delete deletes a schedule (admin operation - deletes from both databases)
func (s *DualScheduleService) Delete(id string) error {
	// Delete from staging
	if err := s.stagingRepo.Delete(id); err != nil {
		return err
	}

	// Also delete from production
	s.productionRepo.Delete(id)

	return nil
}

