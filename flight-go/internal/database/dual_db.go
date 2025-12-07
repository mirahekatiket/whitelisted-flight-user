package database

import (
	"log"

	"github.com/mirahekatiket/flight-go/internal/config"
	"github.com/mirahekatiket/flight-go/internal/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DualDB manages both staging and production databases
type DualDB struct {
	Staging    *gorm.DB
	Production *gorm.DB
	Main       *gorm.DB // For non-schedule data (users, whitelists, orders, etc.)
}

// ConnectDual connects to both staging and production databases
func ConnectDual(cfg *config.Config) (*DualDB, error) {
	// Connect to staging database
	stagingDB, err := gorm.Open(sqlite.Open(cfg.StagingDatabasePath), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, err
	}

	// Run migrations on staging database
	if err := stagingDB.AutoMigrate(
		&models.User{},
		&models.Airline{},
		&models.Airport{},
		&models.Schedule{},
		&models.Order{},
		&models.Passenger{},
		&models.WhitelistedUser{},
	); err != nil {
		return nil, err
	}
	log.Println("Staging database migrated successfully")

	// Connect to production database
	productionDB, err := gorm.Open(sqlite.Open(cfg.ProductionDatabasePath), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, err
	}

	// Run migrations on production database
	if err := productionDB.AutoMigrate(
		&models.User{},
		&models.Airline{},
		&models.Airport{},
		&models.Schedule{},
		&models.Order{},
		&models.Passenger{},
		&models.WhitelistedUser{},
	); err != nil {
		return nil, err
	}
	log.Println("Production database migrated successfully")

	// Main database for users, whitelists, and orders
	// We'll use staging as the main database for these
	mainDB := stagingDB

	log.Println("Connected to staging database:", cfg.StagingDatabasePath)
	log.Println("Connected to production database:", cfg.ProductionDatabasePath)

	return &DualDB{
		Staging:    stagingDB,
		Production: productionDB,
		Main:       mainDB,
	}, nil
}

// GetScheduleDB returns the appropriate database based on whitelist status
func (d *DualDB) GetScheduleDB(email string, hasWhitelistedAirlines bool) *gorm.DB {
	if email != "" && hasWhitelistedAirlines {
		log.Printf("Using PRODUCTION database for whitelisted user: %s", email)
		return d.Production
	}
	log.Printf("Using STAGING database for user: %s (whitelisted airlines: %v)", email, hasWhitelistedAirlines)
	return d.Staging
}

// GetMainDB returns the main database for users, whitelists, orders
func (d *DualDB) GetMainDB() *gorm.DB {
	return d.Main
}

