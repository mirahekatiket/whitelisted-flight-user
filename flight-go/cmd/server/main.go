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

	// Connect to dual databases (staging and production)
	dualDB, err := database.ConnectDual(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to databases: %v", err)
	}

	// Get main database for users, whitelists, orders
	mainDB := dualDB.GetMainDB()

	// Seed default data to both databases
	log.Println("Seeding staging database...")
	if err := database.SeedDefaultData(dualDB.Staging, cfg, "staging"); err != nil {
		log.Printf("Warning: Failed to seed staging data: %v", err)
	}
	log.Println("Seeding production database...")
	if err := database.SeedDefaultData(dualDB.Production, cfg, "production"); err != nil {
		log.Printf("Warning: Failed to seed production data: %v", err)
	}

	// Initialize repositories
	userRepo := repository.NewUserRepository(mainDB)
	orderRepo := repository.NewOrderRepository(mainDB)
	whitelistRepo := repository.NewWhitelistRepository(mainDB)

	// Initialize dual repositories for airlines, airports, schedules
	stagingAirlineRepo := repository.NewAirlineRepository(dualDB.Staging)
	productionAirlineRepo := repository.NewAirlineRepository(dualDB.Production)
	stagingAirportRepo := repository.NewAirportRepository(dualDB.Staging)
	stagingScheduleRepo := repository.NewScheduleRepository(dualDB.Staging)
	productionScheduleRepo := repository.NewScheduleRepository(dualDB.Production)

	// Initialize services
	authService := services.NewAuthService(userRepo, cfg)
	whitelistService := services.NewWhitelistService(whitelistRepo)

	// Create dual schedule service with both repositories and whitelist service
	scheduleService := services.NewDualScheduleService(
		stagingScheduleRepo,
		productionScheduleRepo,
		whitelistService,
	)

	// Create services for both environments
	stagingAirlineService := services.NewAirlineService(stagingAirlineRepo)
	productionAirlineService := services.NewAirlineService(productionAirlineRepo)
	stagingScheduleService := services.NewScheduleService(stagingScheduleRepo)
	productionScheduleService := services.NewScheduleService(productionScheduleRepo)

	orderService := services.NewOrderService(orderRepo, stagingScheduleRepo)

	// Create default admin user in main database
	createAdminUser(mainDB, cfg)

	// Initialize middleware
	authMiddleware := middleware.NewAuthMiddleware(authService)

	// Initialize handlers for both environments
	authHandler := handlers.NewAuthHandler(authService)
	stagingAirlineHandler := handlers.NewAirlineHandler(stagingAirlineService)
	productionAirlineHandler := handlers.NewAirlineHandler(productionAirlineService)
	stagingScheduleHandler := handlers.NewScheduleHandler(stagingScheduleService)
	productionScheduleHandler := handlers.NewScheduleHandler(productionScheduleService)
	airportHandler := handlers.NewAirportHandler(stagingAirportRepo)
	scheduleHandler := handlers.NewScheduleHandler(scheduleService) // For public search (dual)
	orderHandler := handlers.NewOrderHandler(orderService)
	whitelistHandler := handlers.NewWhitelistHandler(whitelistService)

	// Create environment-aware handler
	envHandler := handlers.NewEnvAwareHandler(
		stagingAirlineHandler,
		productionAirlineHandler,
		stagingScheduleHandler,
		productionScheduleHandler,
	)

	// Setup router
	r := router.NewRouter(
		authMiddleware,
		authHandler,
		stagingAirlineHandler,
		airportHandler,
		scheduleHandler,
		orderHandler,
		whitelistHandler,
		envHandler,
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
