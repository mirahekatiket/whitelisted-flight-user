package repository

import (
	"github.com/mirahekatiket/flight-go/internal/models"
	"gorm.io/gorm"
)

type OrderRepository interface {
	Create(order *models.Order) error
	FindByID(id string) (*models.Order, error)
	Update(order *models.Order) error
	Delete(id string) error
	List(page, pageSize int) ([]models.Order, int64, error)
	ListByUser(userID string, page, pageSize int) ([]models.Order, int64, error)
	AddPassenger(passenger *models.Passenger) error
}

type orderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) OrderRepository {
	return &orderRepository{db: db}
}

func (r *orderRepository) Create(order *models.Order) error {
	return r.db.Create(order).Error
}

func (r *orderRepository) FindByID(id string) (*models.Order, error) {
	var order models.Order
	if err := r.db.
		Preload("User").
		Preload("Schedule").
		Preload("Schedule.Airline").
		Preload("Schedule.DepartureAirport").
		Preload("Schedule.ArrivalAirport").
		Preload("Passengers").
		First(&order, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *orderRepository) Update(order *models.Order) error {
	return r.db.Save(order).Error
}

func (r *orderRepository) Delete(id string) error {
	return r.db.Delete(&models.Order{}, "id = ?", id).Error
}

func (r *orderRepository) List(page, pageSize int) ([]models.Order, int64, error) {
	var orders []models.Order
	var total int64

	r.db.Model(&models.Order{}).Count(&total)

	offset := (page - 1) * pageSize
	if err := r.db.
		Preload("User").
		Preload("Schedule").
		Preload("Schedule.Airline").
		Preload("Schedule.DepartureAirport").
		Preload("Schedule.ArrivalAirport").
		Preload("Passengers").
		Offset(offset).
		Limit(pageSize).
		Order("created_at DESC").
		Find(&orders).Error; err != nil {
		return nil, 0, err
	}

	return orders, total, nil
}

func (r *orderRepository) ListByUser(userID string, page, pageSize int) ([]models.Order, int64, error) {
	var orders []models.Order
	var total int64

	query := r.db.Model(&models.Order{}).Where("user_id = ?", userID)
	query.Count(&total)

	offset := (page - 1) * pageSize
	if err := query.
		Preload("Schedule").
		Preload("Schedule.Airline").
		Preload("Schedule.DepartureAirport").
		Preload("Schedule.ArrivalAirport").
		Preload("Passengers").
		Offset(offset).
		Limit(pageSize).
		Order("created_at DESC").
		Find(&orders).Error; err != nil {
		return nil, 0, err
	}

	return orders, total, nil
}

func (r *orderRepository) AddPassenger(passenger *models.Passenger) error {
	return r.db.Create(passenger).Error
}

