package services

import (
	"errors"

	"github.com/mirahekatiket/flight-go/internal/models"
	"github.com/mirahekatiket/flight-go/internal/repository"
)

var (
	ErrAirlineNotFound     = errors.New("airline not found")
	ErrAirlineCodeExists   = errors.New("airline code already exists")
)

type AirlineService interface {
	Create(req CreateAirlineRequest) (*models.Airline, error)
	GetByID(id string) (*models.Airline, error)
	Update(id string, req UpdateAirlineRequest) (*models.Airline, error)
	Delete(id string) error
	List(page, pageSize int, activeOnly bool) (*PaginatedResponse, error)
	ListAll() ([]models.Airline, error)
}

type CreateAirlineRequest struct {
	Code     string `json:"code" binding:"required,max=3"`
	Name     string `json:"name" binding:"required"`
	Logo     string `json:"logo"`
	IsActive *bool  `json:"is_active"`
}

type UpdateAirlineRequest struct {
	Code     string `json:"code"`
	Name     string `json:"name"`
	Logo     string `json:"logo"`
	IsActive *bool  `json:"is_active"`
}

type PaginatedResponse struct {
	Data       interface{} `json:"data"`
	Page       int         `json:"page"`
	PageSize   int         `json:"page_size"`
	TotalItems int64       `json:"total_items"`
	TotalPages int         `json:"total_pages"`
}

type airlineService struct {
	airlineRepo repository.AirlineRepository
}

func NewAirlineService(airlineRepo repository.AirlineRepository) AirlineService {
	return &airlineService{airlineRepo: airlineRepo}
}

func (s *airlineService) Create(req CreateAirlineRequest) (*models.Airline, error) {
	// Check if code already exists
	existing, _ := s.airlineRepo.FindByCode(req.Code)
	if existing != nil {
		return nil, ErrAirlineCodeExists
	}

	airline := &models.Airline{
		Code:     req.Code,
		Name:     req.Name,
		Logo:     req.Logo,
		IsActive: true,
	}

	if req.IsActive != nil {
		airline.IsActive = *req.IsActive
	}

	if err := s.airlineRepo.Create(airline); err != nil {
		return nil, err
	}

	return airline, nil
}

func (s *airlineService) GetByID(id string) (*models.Airline, error) {
	airline, err := s.airlineRepo.FindByID(id)
	if err != nil {
		return nil, ErrAirlineNotFound
	}
	return airline, nil
}

func (s *airlineService) Update(id string, req UpdateAirlineRequest) (*models.Airline, error) {
	airline, err := s.airlineRepo.FindByID(id)
	if err != nil {
		return nil, ErrAirlineNotFound
	}

	if req.Code != "" && req.Code != airline.Code {
		existing, _ := s.airlineRepo.FindByCode(req.Code)
		if existing != nil && existing.ID != id {
			return nil, ErrAirlineCodeExists
		}
		airline.Code = req.Code
	}

	if req.Name != "" {
		airline.Name = req.Name
	}

	if req.Logo != "" {
		airline.Logo = req.Logo
	}

	if req.IsActive != nil {
		airline.IsActive = *req.IsActive
	}

	if err := s.airlineRepo.Update(airline); err != nil {
		return nil, err
	}

	return airline, nil
}

func (s *airlineService) Delete(id string) error {
	_, err := s.airlineRepo.FindByID(id)
	if err != nil {
		return ErrAirlineNotFound
	}

	return s.airlineRepo.Delete(id)
}

func (s *airlineService) List(page, pageSize int, activeOnly bool) (*PaginatedResponse, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}

	airlines, total, err := s.airlineRepo.List(page, pageSize, activeOnly)
	if err != nil {
		return nil, err
	}

	totalPages := int(total) / pageSize
	if int(total)%pageSize > 0 {
		totalPages++
	}

	return &PaginatedResponse{
		Data:       airlines,
		Page:       page,
		PageSize:   pageSize,
		TotalItems: total,
		TotalPages: totalPages,
	}, nil
}

func (s *airlineService) ListAll() ([]models.Airline, error) {
	return s.airlineRepo.ListAll()
}

