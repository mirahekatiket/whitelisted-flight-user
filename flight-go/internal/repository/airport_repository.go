package repository

import (
	"github.com/mirahekatiket/flight-go/internal/models"
	"gorm.io/gorm"
)

type AirportRepository interface {
	Create(airport *models.Airport) error
	FindByID(id string) (*models.Airport, error)
	FindByCode(code string) (*models.Airport, error)
	Update(airport *models.Airport) error
	Delete(id string) error
	List(page, pageSize int) ([]models.Airport, int64, error)
	ListAll() ([]models.Airport, error)
	Search(query string) ([]models.Airport, error)
}

type airportRepository struct {
	db *gorm.DB
}

func NewAirportRepository(db *gorm.DB) AirportRepository {
	return &airportRepository{db: db}
}

func (r *airportRepository) Create(airport *models.Airport) error {
	return r.db.Create(airport).Error
}

func (r *airportRepository) FindByID(id string) (*models.Airport, error) {
	var airport models.Airport
	if err := r.db.First(&airport, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &airport, nil
}

func (r *airportRepository) FindByCode(code string) (*models.Airport, error) {
	var airport models.Airport
	if err := r.db.First(&airport, "code = ?", code).Error; err != nil {
		return nil, err
	}
	return &airport, nil
}

func (r *airportRepository) Update(airport *models.Airport) error {
	return r.db.Save(airport).Error
}

func (r *airportRepository) Delete(id string) error {
	return r.db.Delete(&models.Airport{}, "id = ?", id).Error
}

func (r *airportRepository) List(page, pageSize int) ([]models.Airport, int64, error) {
	var airports []models.Airport
	var total int64

	r.db.Model(&models.Airport{}).Count(&total)

	offset := (page - 1) * pageSize
	if err := r.db.Offset(offset).Limit(pageSize).Find(&airports).Error; err != nil {
		return nil, 0, err
	}

	return airports, total, nil
}

func (r *airportRepository) ListAll() ([]models.Airport, error) {
	var airports []models.Airport
	if err := r.db.Find(&airports).Error; err != nil {
		return nil, err
	}
	return airports, nil
}

func (r *airportRepository) Search(query string) ([]models.Airport, error) {
	var airports []models.Airport
	searchQuery := "%" + query + "%"
	if err := r.db.Where("code LIKE ? OR city LIKE ? OR name LIKE ?", searchQuery, searchQuery, searchQuery).Find(&airports).Error; err != nil {
		return nil, err
	}
	return airports, nil
}

