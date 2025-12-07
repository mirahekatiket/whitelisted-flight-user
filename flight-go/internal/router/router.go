package router

import (
	"github.com/gin-gonic/gin"
	"github.com/mirahekatiket/flight-go/internal/handlers"
	"github.com/mirahekatiket/flight-go/internal/middleware"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "github.com/mirahekatiket/flight-go/docs"
)

type Router struct {
	engine           *gin.Engine
	authMiddleware   *middleware.AuthMiddleware
	authHandler      *handlers.AuthHandler
	airlineHandler   *handlers.AirlineHandler
	airportHandler   *handlers.AirportHandler
	scheduleHandler  *handlers.ScheduleHandler
	orderHandler     *handlers.OrderHandler
	whitelistHandler *handlers.WhitelistHandler
	envHandler       *handlers.EnvAwareHandler
}

func NewRouter(
	authMiddleware *middleware.AuthMiddleware,
	authHandler *handlers.AuthHandler,
	airlineHandler *handlers.AirlineHandler,
	airportHandler *handlers.AirportHandler,
	scheduleHandler *handlers.ScheduleHandler,
	orderHandler *handlers.OrderHandler,
	whitelistHandler *handlers.WhitelistHandler,
	envHandler *handlers.EnvAwareHandler,
) *Router {
	return &Router{
		engine:           gin.Default(),
		authMiddleware:   authMiddleware,
		authHandler:      authHandler,
		airlineHandler:   airlineHandler,
		airportHandler:   airportHandler,
		scheduleHandler:  scheduleHandler,
		orderHandler:     orderHandler,
		whitelistHandler: whitelistHandler,
		envHandler:       envHandler,
	}
}

func (r *Router) Setup() *gin.Engine {
	// Enable CORS
	r.engine.Use(corsMiddleware())

	// Swagger documentation
	r.engine.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	api := r.engine.Group("/api")
	{
		// Health check
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok"})
		})

		// Auth routes (public)
		auth := api.Group("/auth")
		{
			auth.POST("/register", r.authHandler.Register)
			auth.POST("/login", r.authHandler.Login)
			auth.GET("/me", r.authMiddleware.RequireAuth(), r.authHandler.Me)
		}

		// Airlines routes (public read)
		airlines := api.Group("/airlines")
		{
			airlines.GET("", r.airlineHandler.List)
			airlines.GET("/all", r.envHandler.ListAllAirlines) // Support env query param
			airlines.GET("/:id", r.airlineHandler.GetByID)
			airlines.GET("/:id/schedules", r.scheduleHandler.ListByAirline)
		}

		// Airports routes (public)
		airports := api.Group("/airports")
		{
			airports.GET("", r.airportHandler.List)
			airports.GET("/all", r.airportHandler.ListAll)
			airports.GET("/search", r.airportHandler.Search)
			airports.GET("/:id", r.airportHandler.GetByID)
			airports.GET("/code/:code", r.airportHandler.GetByCode)
		}

		// Flights routes (public - for searching and viewing)
		// OptionalAuth allows authenticated users to access their whitelisted data
		flights := api.Group("/flights")
		flights.Use(r.authMiddleware.OptionalAuth())
		{
			flights.GET("/search", r.scheduleHandler.Search)
			flights.GET("/:id", r.scheduleHandler.GetFlightDetail)
		}

		// Orders routes (authenticated users)
		orders := api.Group("/orders")
		orders.Use(r.authMiddleware.RequireAuth())
		{
			orders.POST("", r.orderHandler.Create)
			orders.GET("", r.orderHandler.ListMyOrders)
			orders.GET("/:id", r.orderHandler.GetByID)
			orders.POST("/:id/cancel", r.orderHandler.Cancel)
		}

		// Whitelist routes (public - for checking)
		whitelist := api.Group("/whitelist")
		{
			whitelist.GET("/check", r.whitelistHandler.CheckEmailAccess)
		}

		// Admin routes
		admin := api.Group("/admin")
		admin.Use(r.authMiddleware.RequireAuth(), r.authMiddleware.RequireAdmin())
		{
			// Airlines management (environment-aware via query param ?env=staging|production)
			admin.GET("/airlines", r.envHandler.ListAirlines)
			admin.POST("/airlines", r.envHandler.CreateAirline)
			admin.PUT("/airlines/:id", r.envHandler.UpdateAirline)
			admin.DELETE("/airlines/:id", r.envHandler.DeleteAirline)

			// Schedules management (environment-aware via query param ?env=staging|production)
			admin.GET("/schedules", r.envHandler.ListSchedules)
			admin.POST("/schedules", r.envHandler.CreateSchedule)
			admin.GET("/schedules/:id", r.envHandler.GetScheduleByID)
			admin.PUT("/schedules/:id", r.envHandler.UpdateSchedule)
			admin.DELETE("/schedules/:id", r.envHandler.DeleteSchedule)

			// Orders management
			admin.GET("/orders", r.orderHandler.List)
			admin.GET("/orders/:id", r.orderHandler.GetByID)
			admin.PUT("/orders/:id", r.orderHandler.Update)

			// Whitelist management
			admin.GET("/whitelist", r.whitelistHandler.List)
			admin.POST("/whitelist", r.whitelistHandler.Create)
			admin.GET("/whitelist/:id", r.whitelistHandler.GetByID)
			admin.PUT("/whitelist/:id", r.whitelistHandler.Update)
			admin.DELETE("/whitelist/:id", r.whitelistHandler.Delete)
			admin.POST("/whitelist/:id/toggle-airline", r.whitelistHandler.ToggleAirlineAccess)
		}
	}

	return r.engine
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
