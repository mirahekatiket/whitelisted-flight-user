package main

import (
	"log"

	"github.com/mirahekatiket/flight-go/internal/config"
	"github.com/mirahekatiket/flight-go/internal/database"
	"github.com/mirahekatiket/flight-go/internal/handlers"
	"github.com/mirahekatiket/flight-go/internal/middleware"
	"github.com/mirahekatiket/flight-go/internal/models"
	"github.com/mirahekatiket/flight-go/internal/repository"
	"github.com/mirahekatiket/flight-go/internal/router"
	"github.com/mirahekatiket/flight-go/internal/services"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// @title Flight Server API
// @version 1.0
// @description A simple Go service for flight booking management
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.email support@flight.com

// @license.name MIT
// @license.url https://opensource.org/licenses/MIT

// @host localhost:8080
// @BasePath /api

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.

func main() {
	// Load configuration
	cfg := config.Load()

	// Connect to database
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Seed default data
	if err := database.SeedDefaultData(db, cfg); err != nil {
		log.Printf("Warning: Failed to seed default data: %v", err)
	}

	// Initialize repositories
	userRepo := repository.NewUserRepository(db)
	airlineRepo := repository.NewAirlineRepository(db)
	airportRepo := repository.NewAirportRepository(db)
	scheduleRepo := repository.NewScheduleRepository(db)
	orderRepo := repository.NewOrderRepository(db)

	// Initialize services
	authService := services.NewAuthService(userRepo, cfg)
	airlineService := services.NewAirlineService(airlineRepo)
	scheduleService := services.NewScheduleService(scheduleRepo)
	orderService := services.NewOrderService(orderRepo, scheduleRepo)

	// Create default admin user
	createAdminUser(db, cfg)

	// Initialize middleware
	authMiddleware := middleware.NewAuthMiddleware(authService)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	airlineHandler := handlers.NewAirlineHandler(airlineService)
	airportHandler := handlers.NewAirportHandler(airportRepo)
	scheduleHandler := handlers.NewScheduleHandler(scheduleService)
	orderHandler := handlers.NewOrderHandler(orderService)

	// Setup router
	r := router.NewRouter(
		authMiddleware,
		authHandler,
		airlineHandler,
		airportHandler,
		scheduleHandler,
		orderHandler,
	)

	engine := r.Setup()

	// Start server
	log.Printf("Starting server on port %s", cfg.ServerPort)
	log.Printf("Swagger docs available at http://localhost:%s/swagger/index.html", cfg.ServerPort)
	log.Printf("Admin credentials - Email: %s, Password: %s", cfg.AdminEmail, cfg.AdminPassword)
	if err := engine.Run(":" + cfg.ServerPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func createAdminUser(db *gorm.DB, cfg *config.Config) {
	// Check if admin already exists
	var existingAdmin models.User
	result := db.Where("email = ?", cfg.AdminEmail).First(&existingAdmin)
	if result.Error == nil {
		log.Println("Admin user already exists")
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(cfg.AdminPassword), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Failed to hash admin password: %v", err)
		return
	}

	admin := &models.User{
		Email:    cfg.AdminEmail,
		Password: string(hashedPassword),
		Name:     "Administrator",
		Role:     models.RoleAdmin,
	}

	if err := db.Create(admin).Error; err != nil {
		log.Printf("Failed to create admin user: %v", err)
	} else {
		log.Println("Admin user created successfully")
	}
}
