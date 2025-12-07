package handlers

import (
	"github.com/gin-gonic/gin"
)

// EnvAwareHandler wraps handlers for both staging and production environments
type EnvAwareHandler struct {
	stagingAirlineHandler  *AirlineHandler
	productionAirlineHandler *AirlineHandler
	stagingScheduleHandler *ScheduleHandler
	productionScheduleHandler *ScheduleHandler
}

func NewEnvAwareHandler(
	stagingAirlineHandler *AirlineHandler,
	productionAirlineHandler *AirlineHandler,
	stagingScheduleHandler *ScheduleHandler,
	productionScheduleHandler *ScheduleHandler,
) *EnvAwareHandler {
	return &EnvAwareHandler{
		stagingAirlineHandler:     stagingAirlineHandler,
		productionAirlineHandler:  productionAirlineHandler,
		stagingScheduleHandler:    stagingScheduleHandler,
		productionScheduleHandler: productionScheduleHandler,
	}
}

// getEnv extracts environment from query parameter, defaults to staging
func getEnv(c *gin.Context) string {
	env := c.DefaultQuery("env", "staging")
	if env != "production" && env != "staging" {
		env = "staging"
	}
	return env
}

// Airlines - Environment-aware airline list
func (h *EnvAwareHandler) ListAirlines(c *gin.Context) {
	env := getEnv(c)
	if env == "production" {
		h.productionAirlineHandler.List(c)
	} else {
		h.stagingAirlineHandler.List(c)
	}
}

// Airlines - Environment-aware airline list all
func (h *EnvAwareHandler) ListAllAirlines(c *gin.Context) {
	env := getEnv(c)
	if env == "production" {
		h.productionAirlineHandler.ListAll(c)
	} else {
		h.stagingAirlineHandler.ListAll(c)
	}
}

// Airlines - Environment-aware airline create
func (h *EnvAwareHandler) CreateAirline(c *gin.Context) {
	env := getEnv(c)
	if env == "production" {
		h.productionAirlineHandler.Create(c)
	} else {
		h.stagingAirlineHandler.Create(c)
	}
}

// Airlines - Environment-aware airline update
func (h *EnvAwareHandler) UpdateAirline(c *gin.Context) {
	env := getEnv(c)
	if env == "production" {
		h.productionAirlineHandler.Update(c)
	} else {
		h.stagingAirlineHandler.Update(c)
	}
}

// Airlines - Environment-aware airline delete
func (h *EnvAwareHandler) DeleteAirline(c *gin.Context) {
	env := getEnv(c)
	if env == "production" {
		h.productionAirlineHandler.Delete(c)
	} else {
		h.stagingAirlineHandler.Delete(c)
	}
}

// Schedules - Environment-aware schedule list
func (h *EnvAwareHandler) ListSchedules(c *gin.Context) {
	env := getEnv(c)
	if env == "production" {
		h.productionScheduleHandler.List(c)
	} else {
		h.stagingScheduleHandler.List(c)
	}
}

// Schedules - Environment-aware schedule create
func (h *EnvAwareHandler) CreateSchedule(c *gin.Context) {
	env := getEnv(c)
	if env == "production" {
		h.productionScheduleHandler.Create(c)
	} else {
		h.stagingScheduleHandler.Create(c)
	}
}

// Schedules - Environment-aware schedule get by ID
func (h *EnvAwareHandler) GetScheduleByID(c *gin.Context) {
	env := getEnv(c)
	if env == "production" {
		h.productionScheduleHandler.GetByID(c)
	} else {
		h.stagingScheduleHandler.GetByID(c)
	}
}

// Schedules - Environment-aware schedule update
func (h *EnvAwareHandler) UpdateSchedule(c *gin.Context) {
	env := getEnv(c)
	if env == "production" {
		h.productionScheduleHandler.Update(c)
	} else {
		h.stagingScheduleHandler.Update(c)
	}
}

// Schedules - Environment-aware schedule delete
func (h *EnvAwareHandler) DeleteSchedule(c *gin.Context) {
	env := getEnv(c)
	if env == "production" {
		h.productionScheduleHandler.Delete(c)
	} else {
		h.stagingScheduleHandler.Delete(c)
	}
}

