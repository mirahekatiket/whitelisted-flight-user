package services

import (
	"errors"
	"strings"

	"github.com/mirahekatiket/flight-go/internal/models"
	"github.com/mirahekatiket/flight-go/internal/repository"
	"gorm.io/gorm"
)

type WhitelistService struct {
	repo *repository.WhitelistRepository
}

func NewWhitelistService(repo *repository.WhitelistRepository) *WhitelistService {
	return &WhitelistService{repo: repo}
}

type CreateWhitelistRequest struct {
	Email           string   `json:"email" binding:"required,email"`
	Name            string   `json:"name" binding:"required"`
	EnabledAirlines []string `json:"enabled_airlines"`
}

type UpdateWhitelistRequest struct {
	Name            string   `json:"name"`
	EnabledAirlines []string `json:"enabled_airlines"`
}

func (s *WhitelistService) Create(req CreateWhitelistRequest) (*models.WhitelistedUser, error) {
	// Check if email already exists
	existing, err := s.repo.FindByEmail(req.Email)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}
	if existing != nil {
		return nil, errors.New("email already whitelisted")
	}

	whitelistedUser := &models.WhitelistedUser{
		Email:           req.Email,
		Name:            req.Name,
		EnabledAirlines: strings.Join(req.EnabledAirlines, ","),
	}

	if err := s.repo.Create(whitelistedUser); err != nil {
		return nil, err
	}

	// Parse enabled airlines for response
	whitelistedUser.EnabledAirlineIDs = req.EnabledAirlines

	return whitelistedUser, nil
}

func (s *WhitelistService) GetByID(id string) (*models.WhitelistedUser, error) {
	return s.repo.FindByID(id)
}

func (s *WhitelistService) GetByEmail(email string) (*models.WhitelistedUser, error) {
	return s.repo.FindByEmail(email)
}

func (s *WhitelistService) List(page, pageSize int) ([]models.WhitelistedUser, int64, error) {
	if page <= 0 {
		page = 1
	}
	if pageSize <= 0 || pageSize > 100 {
		pageSize = 20
	}

	return s.repo.FindAll(page, pageSize)
}

func (s *WhitelistService) Update(id string, req UpdateWhitelistRequest) (*models.WhitelistedUser, error) {
	whitelistedUser, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	if req.Name != "" {
		whitelistedUser.Name = req.Name
	}

	if req.EnabledAirlines != nil {
		whitelistedUser.EnabledAirlines = strings.Join(req.EnabledAirlines, ",")
		whitelistedUser.EnabledAirlineIDs = req.EnabledAirlines
	}

	if err := s.repo.Update(whitelistedUser); err != nil {
		return nil, err
	}

	return whitelistedUser, nil
}

func (s *WhitelistService) Delete(id string) error {
	return s.repo.Delete(id)
}

func (s *WhitelistService) ToggleAirlineAccess(id string, airlineID string) (*models.WhitelistedUser, error) {
	whitelistedUser, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	enabledAirlines := []string{}
	if whitelistedUser.EnabledAirlines != "" {
		enabledAirlines = strings.Split(whitelistedUser.EnabledAirlines, ",")
	}

	// Check if airline is already enabled
	found := false
	newEnabledAirlines := []string{}
	for _, id := range enabledAirlines {
		if id == airlineID {
			found = true
			// Skip this airline (disable it)
		} else {
			newEnabledAirlines = append(newEnabledAirlines, id)
		}
	}

	// If not found, add it (enable it)
	if !found {
		newEnabledAirlines = append(newEnabledAirlines, airlineID)
	}

	whitelistedUser.EnabledAirlines = strings.Join(newEnabledAirlines, ",")
	whitelistedUser.EnabledAirlineIDs = newEnabledAirlines

	if err := s.repo.Update(whitelistedUser); err != nil {
		return nil, err
	}

	return whitelistedUser, nil
}

func (s *WhitelistService) IsEmailWhitelisted(email string) (bool, error) {
	return s.repo.IsEmailWhitelisted(email)
}

func (s *WhitelistService) HasAirlineAccess(email string, airlineID string) (bool, error) {
	return s.repo.HasAirlineAccess(email, airlineID)
}

