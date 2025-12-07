package database

import (
	"log"

	"github.com/mirahekatiket/flight-go/internal/config"
	"github.com/mirahekatiket/flight-go/internal/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Connect(cfg *config.Config) (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open(cfg.DatabasePath), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, err
	}

	// Auto migrate models
	if err := db.AutoMigrate(
		&models.User{},
		&models.Airline{},
		&models.Airport{},
		&models.Schedule{},
		&models.Order{},
		&models.Passenger{},
	); err != nil {
		return nil, err
	}

	log.Println("Database connected and migrated successfully")
	return db, nil
}

// SeedDefaultData seeds initial data
func SeedDefaultData(db *gorm.DB, cfg *config.Config) error {
	// Seed default admin user
	var adminCount int64
	db.Model(&models.User{}).Where("role = ?", models.RoleAdmin).Count(&adminCount)
	if adminCount == 0 {
		admin := models.User{
			Email:    cfg.AdminEmail,
			Password: cfg.AdminPassword, // Will be hashed in service
			Name:     "Administrator",
			Role:     models.RoleAdmin,
		}
		// Note: Password should be hashed before saving - this will be done through the auth service
		log.Println("Admin user needs to be created via registration or direct insert with hashed password")
		_ = admin
	}

	// Seed default airports
	airports := []models.Airport{
		{BaseModel: models.BaseModel{ID: "cgk"}, Code: "CGK", City: "Jakarta", Name: "Soekarno-Hatta International Airport"},
		{BaseModel: models.BaseModel{ID: "dps"}, Code: "DPS", City: "Denpasar-Bali", Name: "Ngurah Rai International Airport"},
		{BaseModel: models.BaseModel{ID: "sub"}, Code: "SUB", City: "Surabaya", Name: "Juanda International Airport"},
		{BaseModel: models.BaseModel{ID: "jog"}, Code: "JOG", City: "Yogyakarta", Name: "Adisucipto International Airport"},
		{BaseModel: models.BaseModel{ID: "bdo"}, Code: "BDO", City: "Bandung", Name: "Husein Sastranegara International Airport"},
		{BaseModel: models.BaseModel{ID: "upg"}, Code: "UPG", City: "Makassar", Name: "Sultan Hasanuddin International Airport"},
		{BaseModel: models.BaseModel{ID: "mdc"}, Code: "MDC", City: "Manado", Name: "Sam Ratulangi International Airport"},
		{BaseModel: models.BaseModel{ID: "kno"}, Code: "KNO", City: "Medan", Name: "Kualanamu International Airport"},
		{BaseModel: models.BaseModel{ID: "pdg"}, Code: "PDG", City: "Padang", Name: "Minangkabau International Airport"},
		{BaseModel: models.BaseModel{ID: "plm"}, Code: "PLM", City: "Palembang", Name: "Sultan Mahmud Badaruddin II Airport"},
		{BaseModel: models.BaseModel{ID: "pku"}, Code: "PKU", City: "Pekanbaru", Name: "Sultan Syarif Kasim II Airport"},
		{BaseModel: models.BaseModel{ID: "bpn"}, Code: "BPN", City: "Balikpapan", Name: "Sultan Aji Muhammad Sulaiman Airport"},
		{BaseModel: models.BaseModel{ID: "srg"}, Code: "SRG", City: "Semarang", Name: "Ahmad Yani International Airport"},
		{BaseModel: models.BaseModel{ID: "soc"}, Code: "SOC", City: "Solo", Name: "Adisumarmo International Airport"},
		{BaseModel: models.BaseModel{ID: "lop"}, Code: "LOP", City: "Lombok", Name: "Lombok International Airport"},
	}

	for _, airport := range airports {
		db.FirstOrCreate(&airport, models.Airport{Code: airport.Code})
	}

	// Seed default airlines
	airlines := []models.Airline{
		{BaseModel: models.BaseModel{ID: "ga"}, Code: "GA", Name: "Garuda Indonesia", IsActive: true},
		{BaseModel: models.BaseModel{ID: "jt"}, Code: "JT", Name: "Lion Air", IsActive: true},
		{BaseModel: models.BaseModel{ID: "qg"}, Code: "QG", Name: "Citilink", IsActive: true},
		{BaseModel: models.BaseModel{ID: "id"}, Code: "ID", Name: "Batik Air", IsActive: true},
		{BaseModel: models.BaseModel{ID: "iu"}, Code: "IU", Name: "Super Air Jet", IsActive: true},
		{BaseModel: models.BaseModel{ID: "qz"}, Code: "QZ", Name: "AirAsia Indonesia", IsActive: true},
		{BaseModel: models.BaseModel{ID: "sj"}, Code: "SJ", Name: "Sriwijaya Air", IsActive: true},
		{BaseModel: models.BaseModel{ID: "in"}, Code: "IN", Name: "NAM Air", IsActive: true},
		{BaseModel: models.BaseModel{ID: "ip"}, Code: "IP", Name: "Pelita Air", IsActive: true},
		{BaseModel: models.BaseModel{ID: "8b"}, Code: "8B", Name: "TransNusa", IsActive: true},
	}

	for _, airline := range airlines {
		db.FirstOrCreate(&airline, models.Airline{Code: airline.Code})
	}

	log.Println("Default data seeded successfully")
	return nil
}
