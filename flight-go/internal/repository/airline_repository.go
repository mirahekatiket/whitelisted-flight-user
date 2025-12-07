package repository

import (
	"github.com/mirahekatiket/flight-go/internal/models"
	"gorm.io/gorm"
)

type AirlineRepository interface {
	Create(airline *models.Airline) error
	FindByID(id string) (*models.Airline, error)
	FindByCode(code string) (*models.Airline, error)
	Update(airline *models.Airline) error
	Delete(id string) error
	List(page, pageSize int, activeOnly bool) ([]models.Airline, int64, error)
	ListAll() ([]models.Airline, error)
}

type airlineRepository struct {
	db *gorm.DB
}

func NewAirlineRepository(db *gorm.DB) AirlineRepository {
	return &airlineRepository{db: db}
}

func (r *airlineRepository) Create(airline *models.Airline) error {
	return r.db.Create(airline).Error
}

func (r *airlineRepository) FindByID(id string) (*models.Airline, error) {
	var airline models.Airline
	if err := r.db.First(&airline, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &airline, nil
}

func (r *airlineRepository) FindByCode(code string) (*models.Airline, error) {
	var airline models.Airline
	if err := r.db.First(&airline, "code = ?", code).Error; err != nil {
		return nil, err
	}
	return &airline, nil
}

func (r *airlineRepository) Update(airline *models.Airline) error {
	return r.db.Save(airline).Error
}

func (r *airlineRepository) Delete(id string) error {
	return r.db.Delete(&models.Airline{}, "id = ?", id).Error
}

func (r *airlineRepository) List(page, pageSize int, activeOnly bool) ([]models.Airline, int64, error) {
	var airlines []models.Airline
	var total int64

	query := r.db.Model(&models.Airline{})
	if activeOnly {
		query = query.Where("is_active = ?", true)
	}

	query.Count(&total)

	offset := (page - 1) * pageSize
	if err := query.Offset(offset).Limit(pageSize).Find(&airlines).Error; err != nil {
		return nil, 0, err
	}

	return airlines, total, nil
}

func (r *airlineRepository) ListAll() ([]models.Airline, error) {
	var airlines []models.Airline
	if err := r.db.Where("is_active = ?", true).Find(&airlines).Error; err != nil {
		return nil, err
	}
	return airlines, nil
}

