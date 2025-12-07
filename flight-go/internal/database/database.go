package database

import (
	"log"

	"github.com/mirahekatiket/flight-go/internal/config"
	"github.com/mirahekatiket/flight-go/internal/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

const (
	productionEnvPostfix = " (PROD)"
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
		&models.WhitelistedUser{},
	); err != nil {
		return nil, err
	}

	log.Println("Database connected and migrated successfully")
	return db, nil
}

// SeedDefaultData seeds initial data
func SeedDefaultData(db *gorm.DB, cfg *config.Config, env string) error {
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
		{BaseModel: models.BaseModel{ID: "cgk"}, Code: "CGK", City: "Jakarta", Name: getName("Soekarno-Hatta International Airport", env)},
		{BaseModel: models.BaseModel{ID: "dps"}, Code: "DPS", City: "Denpasar-Bali", Name: getName("Ngurah Rai International Airport", env)},
		{BaseModel: models.BaseModel{ID: "sub"}, Code: "SUB", City: "Surabaya", Name: getName("Juanda International Airport", env)},
		{BaseModel: models.BaseModel{ID: "jog"}, Code: "JOG", City: "Yogyakarta", Name: getName("Adisucipto International Airport", env)},
		{BaseModel: models.BaseModel{ID: "bdo"}, Code: "BDO", City: "Bandung", Name: getName("Husein Sastranegara International Airport", env)},
		{BaseModel: models.BaseModel{ID: "upg"}, Code: "UPG", City: "Makassar", Name: getName("Sultan Hasanuddin International Airport", env)},
		{BaseModel: models.BaseModel{ID: "mdc"}, Code: "MDC", City: "Manado", Name: getName("Sam Ratulangi International Airport", env)},
		{BaseModel: models.BaseModel{ID: "kno"}, Code: "KNO", City: "Medan", Name: getName("Kualanamu International Airport", env)},
		{BaseModel: models.BaseModel{ID: "pdg"}, Code: "PDG", City: "Padang", Name: getName("Minangkabau International Airport", env)},
		{BaseModel: models.BaseModel{ID: "plm"}, Code: "PLM", City: "Palembang", Name: getName("Sultan Mahmud Badaruddin II Airport", env)},
		{BaseModel: models.BaseModel{ID: "pku"}, Code: "PKU", City: "Pekanbaru", Name: getName("Sultan Syarif Kasim II Airport", env)},
		{BaseModel: models.BaseModel{ID: "bpn"}, Code: "BPN", City: "Balikpapan", Name: getName("Sultan Aji Muhammad Sulaiman Airport", env)},
		{BaseModel: models.BaseModel{ID: "srg"}, Code: "SRG", City: "Semarang", Name: getName("Ahmad Yani International Airport", env)},
		{BaseModel: models.BaseModel{ID: "soc"}, Code: "SOC", City: "Solo", Name: getName("Adisumarmo International Airport", env)},
		{BaseModel: models.BaseModel{ID: "lop"}, Code: "LOP", City: "Lombok", Name: getName("Lombok International Airport", env)},
	}

	for _, airport := range airports {
		db.FirstOrCreate(&airport, models.Airport{Code: airport.Code})
	}

	// Seed default airlines
	airlines := []models.Airline{
		{BaseModel: models.BaseModel{ID: "ga"}, Code: "GA", Name: getName("Garuda Indonesia", env), IsActive: true},
		{BaseModel: models.BaseModel{ID: "jt"}, Code: "JT", Name: getName("Lion Air", env), IsActive: true},
		{BaseModel: models.BaseModel{ID: "qg"}, Code: "QG", Name: getName("Citilink", env), IsActive: true},
		{BaseModel: models.BaseModel{ID: "id"}, Code: "ID", Name: getName("Batik Air", env), IsActive: true},
		{BaseModel: models.BaseModel{ID: "iu"}, Code: "IU", Name: getName("Super Air Jet", env), IsActive: true},
		{BaseModel: models.BaseModel{ID: "qz"}, Code: "QZ", Name: getName("AirAsia Indonesia", env), IsActive: true},
		{BaseModel: models.BaseModel{ID: "sj"}, Code: "SJ", Name: getName("Sriwijaya Air", env), IsActive: true},
		{BaseModel: models.BaseModel{ID: "in"}, Code: "IN", Name: getName("NAM Air", env), IsActive: true},
		{BaseModel: models.BaseModel{ID: "ip"}, Code: "IP", Name: getName("Pelita Air", env), IsActive: true},
		{BaseModel: models.BaseModel{ID: "8b"}, Code: "8B", Name: getName("TransNusa", env), IsActive: true},
	}

	for _, airline := range airlines {
		var existing models.Airline
		result := db.Where("code = ?", airline.Code).First(&existing)
		if result.Error == gorm.ErrRecordNotFound {
			// Create new airline
			db.Create(&airline)
		} else {
			// Update existing airline to ensure it's active
			db.Model(&existing).Updates(map[string]interface{}{
				"name":      airline.Name,
				"is_active": true,
			})
		}
	}

	// Seed default schedules using helper function
	// This generates 2 flights per airline for each major route
	// Routes covered: CGK-DPS, DPS-CGK, CGK-SUB, SUB-CGK, CGK-JOG, JOG-CGK,
	//                 CGK-KNO, KNO-CGK, DPS-SUB, SUB-DPS, CGK-UPG, UPG-CGK
	// Airlines: GA, JT, QG, ID, IU, QZ (6 airlines)
	// Total schedules: 12 routes × 6 airlines × 2 flights = 144 flights
	schedules := generateSchedules(env)

	// Add some extra schedules for variety (keeping a few from old seed for compatibility)
	extraSchedules := []models.Schedule{
		{
			BaseModel:          models.BaseModel{ID: "schedule-cgk-dps-ga-premium"},
			AirlineID:          "ga",
			FlightNumber:       getName("GA401", env),
			DepartureAirportID: "cgk",
			DepartureTerminal:  "3",
			DepartureTime:      "10:30",
			ArrivalAirportID:   "dps",
			ArrivalTerminal:    "I",
			ArrivalTime:        "13:00",
			Duration:           150,
			Aircraft:           "Boeing 737-800",
			DaysOfWeek:         "1,2,3,4,5,6,7",
			EconomyPrice:       850000,
			BusinessPrice:      2700000,
			FirstClassPrice:    5500000,
			EconomySeats:       150,
			BusinessSeats:      30,
			FirstClassSeats:    10,
			IsActive:           true,
		},
	}

	// Combine generated and extra schedules
	schedules = append(schedules, extraSchedules...)

	// Seed the schedules into database
	for _, schedule := range schedules {
		var existing models.Schedule
		result := db.Where("flight_number = ? AND departure_airport_id = ? AND arrival_airport_id = ?",
			schedule.FlightNumber, schedule.DepartureAirportID, schedule.ArrivalAirportID).First(&existing)

		if result.Error == gorm.ErrRecordNotFound {
			if err := db.Create(&schedule).Error; err != nil {
				log.Printf("Failed to create schedule %s%s: %v", schedule.FlightNumber, getName("", env), err)
			}
		}
	}

	log.Println("Default data seeded successfully")
	return nil
}

func getName(name string, env string) string {
	if env == "production" {
		return name + productionEnvPostfix
	}
	return name
}
