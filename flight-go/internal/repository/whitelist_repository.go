package repository

import (
	"strings"

	"github.com/google/uuid"
	"github.com/mirahekatiket/flight-go/internal/models"
	"gorm.io/gorm"
)

type WhitelistRepository struct {
	db *gorm.DB
}

func NewWhitelistRepository(db *gorm.DB) *WhitelistRepository {
	return &WhitelistRepository{db: db}
}

func (r *WhitelistRepository) Create(whitelistedUser *models.WhitelistedUser) error {
	whitelistedUser.ID = uuid.New().String()
	return r.db.Create(whitelistedUser).Error
}

func (r *WhitelistRepository) FindByID(id string) (*models.WhitelistedUser, error) {
	var whitelistedUser models.WhitelistedUser
	err := r.db.Where("id = ?", id).First(&whitelistedUser).Error
	if err != nil {
		return nil, err
	}
	
	// Parse enabled airlines
	if whitelistedUser.EnabledAirlines != "" {
		whitelistedUser.EnabledAirlineIDs = strings.Split(whitelistedUser.EnabledAirlines, ",")
	} else {
		whitelistedUser.EnabledAirlineIDs = []string{}
	}
	
	return &whitelistedUser, nil
}

func (r *WhitelistRepository) FindByEmail(email string) (*models.WhitelistedUser, error) {
	var whitelistedUser models.WhitelistedUser
	err := r.db.Where("email = ?", email).First(&whitelistedUser).Error
	if err != nil {
		return nil, err
	}
	
	// Parse enabled airlines
	if whitelistedUser.EnabledAirlines != "" {
		whitelistedUser.EnabledAirlineIDs = strings.Split(whitelistedUser.EnabledAirlines, ",")
	} else {
		whitelistedUser.EnabledAirlineIDs = []string{}
	}
	
	return &whitelistedUser, nil
}

func (r *WhitelistRepository) FindAll(page, pageSize int) ([]models.WhitelistedUser, int64, error) {
	var whitelistedUsers []models.WhitelistedUser
	var total int64

	// Count total
	if err := r.db.Model(&models.WhitelistedUser{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results
	offset := (page - 1) * pageSize
	err := r.db.Offset(offset).Limit(pageSize).Order("created_at DESC").Find(&whitelistedUsers).Error
	if err != nil {
		return nil, 0, err
	}

	// Parse enabled airlines for each user
	for i := range whitelistedUsers {
		if whitelistedUsers[i].EnabledAirlines != "" {
			whitelistedUsers[i].EnabledAirlineIDs = strings.Split(whitelistedUsers[i].EnabledAirlines, ",")
		} else {
			whitelistedUsers[i].EnabledAirlineIDs = []string{}
		}
	}

	return whitelistedUsers, total, nil
}

func (r *WhitelistRepository) Update(whitelistedUser *models.WhitelistedUser) error {
	return r.db.Save(whitelistedUser).Error
}

func (r *WhitelistRepository) Delete(id string) error {
	return r.db.Delete(&models.WhitelistedUser{}, "id = ?", id).Error
}

func (r *WhitelistRepository) IsEmailWhitelisted(email string) (bool, error) {
	var count int64
	err := r.db.Model(&models.WhitelistedUser{}).Where("email = ?", email).Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *WhitelistRepository) HasAirlineAccess(email string, airlineID string) (bool, error) {
	var whitelistedUser models.WhitelistedUser
	err := r.db.Where("email = ?", email).First(&whitelistedUser).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return false, nil
		}
		return false, err
	}

	// Check if airline ID is in enabled airlines
	if whitelistedUser.EnabledAirlines == "" {
		return false, nil
	}

	enabledAirlines := strings.Split(whitelistedUser.EnabledAirlines, ",")
	for _, id := range enabledAirlines {
		if id == airlineID {
			return true, nil
		}
	}

	return false, nil
}

