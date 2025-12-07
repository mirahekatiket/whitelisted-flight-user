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

	// Seed default schedules
	schedules := []models.Schedule{
		// Jakarta to Bali routes
		{
			BaseModel:          models.BaseModel{ID: "schedule-cgk-dps-ga-001"},
			AirlineID:          "ga",
			FlightNumber:       getName("GA401", env),
			DepartureAirportID: "cgk",
			DepartureTerminal:  "3",
			DepartureTime:      "06:00",
			ArrivalAirportID:   "dps",
			ArrivalTerminal:    "I",
			ArrivalTime:        "08:30",
			Duration:           150,
			Aircraft:           "Boeing 737-800",
			DaysOfWeek:         "1,2,3,4,5,6,7",
			EconomyPrice:       800000,
			BusinessPrice:      2500000,
			FirstClassPrice:    5000000,
			EconomySeats:       150,
			BusinessSeats:      30,
			FirstClassSeats:    10,
			IsActive:           true,
		},
		{
			BaseModel:          models.BaseModel{ID: "schedule-cgk-dps-jt-001"},
			AirlineID:          "jt",
			FlightNumber:       getName("JT701", env),
			DepartureAirportID: "cgk",
			DepartureTerminal:  "1B",
			DepartureTime:      "08:30",
			ArrivalAirportID:   "dps",
			ArrivalTerminal:    "D",
			ArrivalTime:        "11:00",
			Duration:           150,
			Aircraft:           "Boeing 737-900ER",
			DaysOfWeek:         "1,2,3,4,5,6,7",
			EconomyPrice:       650000,
			BusinessPrice:      1800000,
			FirstClassPrice:    0,
			EconomySeats:       180,
			BusinessSeats:      20,
			FirstClassSeats:    0,
			IsActive:           true,
		},
		{
			BaseModel:          models.BaseModel{ID: "schedule-cgk-dps-qg-001"},
			AirlineID:          "qg",
			FlightNumber:       getName("QG801", env),
			DepartureAirportID: "cgk",
			DepartureTerminal:  "2",
			DepartureTime:      "10:00",
			ArrivalAirportID:   "dps",
			ArrivalTerminal:    "D",
			ArrivalTime:        "12:30",
			Duration:           150,
			Aircraft:           "Airbus A320",
			DaysOfWeek:         "1,2,3,4,5,6,7",
			EconomyPrice:       550000,
			BusinessPrice:      0,
			FirstClassPrice:    0,
			EconomySeats:       180,
			BusinessSeats:      0,
			FirstClassSeats:    0,
			IsActive:           true,
		},
		// Jakarta to Surabaya routes
		{
			BaseModel:          models.BaseModel{ID: "schedule-cgk-sub-ga-001"},
			AirlineID:          "ga",
			FlightNumber:       getName("GA301", env),
			DepartureAirportID: "cgk",
			DepartureTerminal:  "3",
			DepartureTime:      "07:00",
			ArrivalAirportID:   "sub",
			ArrivalTerminal:    "1",
			ArrivalTime:        "08:30",
			Duration:           90,
			Aircraft:           "Boeing 737-800",
			DaysOfWeek:         "1,2,3,4,5,6,7",
			EconomyPrice:       600000,
			BusinessPrice:      1800000,
			FirstClassPrice:    3500000,
			EconomySeats:       150,
			BusinessSeats:      30,
			FirstClassSeats:    10,
			IsActive:           true,
		},
		{
			BaseModel:          models.BaseModel{ID: "schedule-cgk-sub-id-001"},
			AirlineID:          "id",
			FlightNumber:       getName("ID601", env),
			DepartureAirportID: "cgk",
			DepartureTerminal:  "1A",
			DepartureTime:      "09:15",
			ArrivalAirportID:   "sub",
			ArrivalTerminal:    "2",
			ArrivalTime:        "10:45",
			Duration:           90,
			Aircraft:           "Airbus A320",
			DaysOfWeek:         "1,2,3,4,5,6,7",
			EconomyPrice:       580000,
			BusinessPrice:      1600000,
			FirstClassPrice:    0,
			EconomySeats:       156,
			BusinessSeats:      24,
			FirstClassSeats:    0,
			IsActive:           true,
		},
		// Jakarta to Yogyakarta routes
		{
			BaseModel:          models.BaseModel{ID: "schedule-cgk-jog-qz-001"},
			AirlineID:          "qz",
			FlightNumber:       getName("QZ201", env),
			DepartureAirportID: "cgk",
			DepartureTerminal:  "2",
			DepartureTime:      "06:30",
			ArrivalAirportID:   "jog",
			ArrivalTerminal:    "",
			ArrivalTime:        "07:30",
			Duration:           60,
			Aircraft:           "Airbus A320",
			DaysOfWeek:         "1,2,3,4,5,6,7",
			EconomyPrice:       450000,
			BusinessPrice:      0,
			FirstClassPrice:    0,
			EconomySeats:       180,
			BusinessSeats:      0,
			FirstClassSeats:    0,
			IsActive:           true,
		},
		{
			BaseModel:          models.BaseModel{ID: "schedule-cgk-jog-iu-001"},
			AirlineID:          "iu",
			FlightNumber:       getName("IU501", env),
			DepartureAirportID: "cgk",
			DepartureTerminal:  "1B",
			DepartureTime:      "14:00",
			ArrivalAirportID:   "jog",
			ArrivalTerminal:    "",
			ArrivalTime:        "15:00",
			Duration:           60,
			Aircraft:           "Boeing 737-500",
			DaysOfWeek:         "1,2,3,4,5,6,7",
			EconomyPrice:       480000,
			BusinessPrice:      1200000,
			FirstClassPrice:    0,
			EconomySeats:       132,
			BusinessSeats:      12,
			FirstClassSeats:    0,
			IsActive:           true,
		},
		// Jakarta to Makassar routes
		{
			BaseModel:          models.BaseModel{ID: "schedule-cgk-upg-ga-001"},
			AirlineID:          "ga",
			FlightNumber:       getName("GA601", env),
			DepartureAirportID: "cgk",
			DepartureTerminal:  "3",
			DepartureTime:      "08:00",
			ArrivalAirportID:   "upg",
			ArrivalTerminal:    "",
			ArrivalTime:        "11:30",
			Duration:           210,
			Aircraft:           "Boeing 737-800",
			DaysOfWeek:         "1,2,3,4,5,6,7",
			EconomyPrice:       1200000,
			BusinessPrice:      3200000,
			FirstClassPrice:    6000000,
			EconomySeats:       150,
			BusinessSeats:      30,
			FirstClassSeats:    10,
			IsActive:           true,
		},
		{
			BaseModel:          models.BaseModel{ID: "schedule-cgk-upg-jt-001"},
			AirlineID:          "jt",
			FlightNumber:       getName("JT851", env),
			DepartureAirportID: "cgk",
			DepartureTerminal:  "1B",
			DepartureTime:      "13:30",
			ArrivalAirportID:   "upg",
			ArrivalTerminal:    "",
			ArrivalTime:        "17:00",
			Duration:           210,
			Aircraft:           "Boeing 737-900ER",
			DaysOfWeek:         "1,2,3,4,5,6,7",
			EconomyPrice:       950000,
			BusinessPrice:      2400000,
			FirstClassPrice:    0,
			EconomySeats:       180,
			BusinessSeats:      20,
			FirstClassSeats:    0,
			IsActive:           true,
		},
		// Jakarta to Medan routes
		{
			BaseModel:          models.BaseModel{ID: "schedule-cgk-kno-ga-001"},
			AirlineID:          "ga",
			FlightNumber:       getName("GA101", env),
			DepartureAirportID: "cgk",
			DepartureTerminal:  "3",
			DepartureTime:      "05:30",
			ArrivalAirportID:   "kno",
			ArrivalTerminal:    "",
			ArrivalTime:        "07:30",
			Duration:           120,
			Aircraft:           "Airbus A330-300",
			DaysOfWeek:         "1,2,3,4,5,6,7",
			EconomyPrice:       900000,
			BusinessPrice:      2800000,
			FirstClassPrice:    5500000,
			EconomySeats:       222,
			BusinessSeats:      36,
			FirstClassSeats:    12,
			IsActive:           true,
		},
		{
			BaseModel:          models.BaseModel{ID: "schedule-cgk-kno-qg-001"},
			AirlineID:          "qg",
			FlightNumber:       getName("QG151", env),
			DepartureAirportID: "cgk",
			DepartureTerminal:  "2",
			DepartureTime:      "11:00",
			ArrivalAirportID:   "kno",
			ArrivalTerminal:    "",
			ArrivalTime:        "13:00",
			Duration:           120,
			Aircraft:           "Airbus A320",
			DaysOfWeek:         "1,2,3,4,5,6,7",
			EconomyPrice:       700000,
			BusinessPrice:      0,
			FirstClassPrice:    0,
			EconomySeats:       180,
			BusinessSeats:      0,
			FirstClassSeats:    0,
			IsActive:           true,
		},
		// Surabaya to Bali routes
		{
			BaseModel:          models.BaseModel{ID: "schedule-sub-dps-ga-001"},
			AirlineID:          "ga",
			FlightNumber:       getName("GA321", env),
			DepartureAirportID: "sub",
			DepartureTerminal:  "1",
			DepartureTime:      "09:00",
			ArrivalAirportID:   "dps",
			ArrivalTerminal:    "I",
			ArrivalTime:        "10:30",
			Duration:           90,
			Aircraft:           "Boeing 737-800",
			DaysOfWeek:         "1,2,3,4,5,6,7",
			EconomyPrice:       550000,
			BusinessPrice:      1500000,
			FirstClassPrice:    3000000,
			EconomySeats:       150,
			BusinessSeats:      30,
			FirstClassSeats:    10,
			IsActive:           true,
		},
		{
			BaseModel:          models.BaseModel{ID: "schedule-sub-dps-qg-001"},
			AirlineID:          "qg",
			FlightNumber:       getName("QG321", env),
			DepartureAirportID: "sub",
			DepartureTerminal:  "2",
			DepartureTime:      "15:30",
			ArrivalAirportID:   "dps",
			ArrivalTerminal:    "D",
			ArrivalTime:        "17:00",
			Duration:           90,
			Aircraft:           "Airbus A320",
			DaysOfWeek:         "1,2,3,4,5,6,7",
			EconomyPrice:       450000,
			BusinessPrice:      0,
			FirstClassPrice:    0,
			EconomySeats:       180,
			BusinessSeats:      0,
			FirstClassSeats:    0,
			IsActive:           true,
		},
		// Return flights - Bali to Jakarta
		{
			BaseModel:          models.BaseModel{ID: "schedule-dps-cgk-ga-001"},
			AirlineID:          "ga",
			FlightNumber:       getName("GA402", env),
			DepartureAirportID: "dps",
			DepartureTerminal:  "I",
			DepartureTime:      "09:30",
			ArrivalAirportID:   "cgk",
			ArrivalTerminal:    "3",
			ArrivalTime:        "12:00",
			Duration:           150,
			Aircraft:           "Boeing 737-800",
			DaysOfWeek:         "1,2,3,4,5,6,7",
			EconomyPrice:       820000,
			BusinessPrice:      2600000,
			FirstClassPrice:    5200000,
			EconomySeats:       150,
			BusinessSeats:      30,
			FirstClassSeats:    10,
			IsActive:           true,
		},
		{
			BaseModel:          models.BaseModel{ID: "schedule-dps-cgk-jt-001"},
			AirlineID:          "jt",
			FlightNumber:       getName("JT702", env),
			DepartureAirportID: "dps",
			DepartureTerminal:  "D",
			DepartureTime:      "12:00",
			ArrivalAirportID:   "cgk",
			ArrivalTerminal:    "1B",
			ArrivalTime:        "14:30",
			Duration:           150,
			Aircraft:           "Boeing 737-900ER",
			DaysOfWeek:         "1,2,3,4,5,6,7",
			EconomyPrice:       670000,
			BusinessPrice:      1850000,
			FirstClassPrice:    0,
			EconomySeats:       180,
			BusinessSeats:      20,
			FirstClassSeats:    0,
			IsActive:           true,
		},
	}

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
