package repository

import (
	"time"

	"github.com/mirahekatiket/flight-go/internal/models"
	"gorm.io/gorm"
)

type ScheduleRepository interface {
	Create(schedule *models.Schedule) error
	FindByID(id string) (*models.Schedule, error)
	Update(schedule *models.Schedule) error
	Delete(id string) error
	List(page, pageSize int) ([]models.Schedule, int64, error)
	ListByAirline(airlineID string, page, pageSize int) ([]models.Schedule, int64, error)
	Search(params SearchParams) ([]models.Schedule, int64, error)
}

type SearchParams struct {
	DepartureAirportCode string
	ArrivalAirportCode   string
	DepartureDate        time.Time
	CabinClass           models.CabinClass
	AirlineIDs           []string
	Page                 int
	PageSize             int
}

type scheduleRepository struct {
	db *gorm.DB
}

func NewScheduleRepository(db *gorm.DB) ScheduleRepository {
	return &scheduleRepository{db: db}
}

func (r *scheduleRepository) Create(schedule *models.Schedule) error {
	return r.db.Create(schedule).Error
}

func (r *scheduleRepository) FindByID(id string) (*models.Schedule, error) {
	var schedule models.Schedule
	if err := r.db.
		Preload("Airline").
		Preload("DepartureAirport").
		Preload("ArrivalAirport").
		First(&schedule, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &schedule, nil
}

func (r *scheduleRepository) Update(schedule *models.Schedule) error {
	return r.db.Save(schedule).Error
}

func (r *scheduleRepository) Delete(id string) error {
	return r.db.Delete(&models.Schedule{}, "id = ?", id).Error
}

func (r *scheduleRepository) List(page, pageSize int) ([]models.Schedule, int64, error) {
	var schedules []models.Schedule
	var total int64

	r.db.Model(&models.Schedule{}).Count(&total)

	offset := (page - 1) * pageSize
	if err := r.db.
		Preload("Airline").
		Preload("DepartureAirport").
		Preload("ArrivalAirport").
		Offset(offset).
		Limit(pageSize).
		Find(&schedules).Error; err != nil {
		return nil, 0, err
	}

	return schedules, total, nil
}

func (r *scheduleRepository) ListByAirline(airlineID string, page, pageSize int) ([]models.Schedule, int64, error) {
	var schedules []models.Schedule
	var total int64

	query := r.db.Model(&models.Schedule{}).Where("airline_id = ?", airlineID)
	query.Count(&total)

	offset := (page - 1) * pageSize
	if err := query.
		Preload("Airline").
		Preload("DepartureAirport").
		Preload("ArrivalAirport").
		Offset(offset).
		Limit(pageSize).
		Find(&schedules).Error; err != nil {
		return nil, 0, err
	}

	return schedules, total, nil
}

func (r *scheduleRepository) Search(params SearchParams) ([]models.Schedule, int64, error) {
	var schedules []models.Schedule
	var total int64

	query := r.db.Model(&models.Schedule{}).
		Joins("JOIN airports dep ON dep.id = schedules.departure_airport_id").
		Joins("JOIN airports arr ON arr.id = schedules.arrival_airport_id").
		Where("schedules.is_active = ?", true)

	// Filter by departure airport
	if params.DepartureAirportCode != "" {
		query = query.Where("dep.code = ?", params.DepartureAirportCode)
	}

	// Filter by arrival airport
	if params.ArrivalAirportCode != "" {
		query = query.Where("arr.code = ?", params.ArrivalAirportCode)
	}

	// Filter by departure date (check day of week)
	if !params.DepartureDate.IsZero() {
		dayOfWeek := int(params.DepartureDate.Weekday())
		if dayOfWeek == 0 {
			dayOfWeek = 7 // Convert Sunday from 0 to 7
		}
		query = query.Where("schedules.days_of_week LIKE ?", "%"+string(rune('0'+dayOfWeek))+"%")
	}

	// Filter by airlines
	if len(params.AirlineIDs) > 0 {
		query = query.Where("schedules.airline_id IN ?", params.AirlineIDs)
	}

	query.Count(&total)

	offset := (params.Page - 1) * params.PageSize
	if err := query.
		Preload("Airline").
		Preload("DepartureAirport").
		Preload("ArrivalAirport").
		Offset(offset).
		Limit(params.PageSize).
		Order("schedules.departure_time ASC").
		Find(&schedules).Error; err != nil {
		return nil, 0, err
	}

	return schedules, total, nil
}

