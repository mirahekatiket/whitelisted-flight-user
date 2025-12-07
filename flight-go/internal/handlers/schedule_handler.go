package handlers

import (
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/mirahekatiket/flight-go/internal/services"
)

type ScheduleHandler struct {
	scheduleService services.ScheduleService
}

func NewScheduleHandler(scheduleService services.ScheduleService) *ScheduleHandler {
	return &ScheduleHandler{scheduleService: scheduleService}
}

// Create godoc
// @Summary Create schedule
// @Description Create a new flight schedule (admin only)
// @Tags Schedules
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body CreateScheduleRequest true "Schedule data"
// @Success 201 {object} Response{data=Schedule}
// @Failure 400 {object} ErrorMessageResponse
// @Failure 401 {object} ErrorMessageResponse
// @Failure 403 {object} ErrorMessageResponse
// @Failure 500 {object} ErrorMessageResponse
// @Router /admin/schedules [post]
func (h *ScheduleHandler) Create(c *gin.Context) {
	var req services.CreateScheduleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequestResponse(c, err.Error())
		return
	}

	schedule, err := h.scheduleService.Create(req)
	if err != nil {
		InternalServerErrorResponse(c, "Failed to create schedule: "+err.Error())
		return
	}

	CreatedResponse(c, schedule)
}

// GetByID godoc
// @Summary Get schedule by ID
// @Description Get a single flight schedule by its ID
// @Tags Schedules
// @Security BearerAuth
// @Produce json
// @Param id path string true "Schedule ID"
// @Success 200 {object} Response{data=Schedule}
// @Failure 404 {object} ErrorMessageResponse
// @Router /admin/schedules/{id} [get]
func (h *ScheduleHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	schedule, err := h.scheduleService.GetByID(id)
	if err != nil {
		NotFoundResponse(c, "Schedule not found")
		return
	}

	SuccessResponse(c, schedule)
}

// Update godoc
// @Summary Update schedule
// @Description Update an existing flight schedule (admin only)
// @Tags Schedules
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path string true "Schedule ID"
// @Param request body CreateScheduleRequest true "Schedule data"
// @Success 200 {object} Response{data=Schedule}
// @Failure 400 {object} ErrorMessageResponse
// @Failure 401 {object} ErrorMessageResponse
// @Failure 403 {object} ErrorMessageResponse
// @Failure 404 {object} ErrorMessageResponse
// @Failure 500 {object} ErrorMessageResponse
// @Router /admin/schedules/{id} [put]
func (h *ScheduleHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var req services.UpdateScheduleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequestResponse(c, err.Error())
		return
	}

	schedule, err := h.scheduleService.Update(id, req)
	if err != nil {
		if err == services.ErrScheduleNotFound {
			NotFoundResponse(c, "Schedule not found")
			return
		}
		InternalServerErrorResponse(c, "Failed to update schedule")
		return
	}

	SuccessResponse(c, schedule)
}

// Delete godoc
// @Summary Delete schedule
// @Description Delete a flight schedule (admin only)
// @Tags Schedules
// @Security BearerAuth
// @Param id path string true "Schedule ID"
// @Success 200 {object} SuccessMessageResponse
// @Failure 401 {object} ErrorMessageResponse
// @Failure 403 {object} ErrorMessageResponse
// @Failure 404 {object} ErrorMessageResponse
// @Failure 500 {object} ErrorMessageResponse
// @Router /admin/schedules/{id} [delete]
func (h *ScheduleHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.scheduleService.Delete(id); err != nil {
		if err == services.ErrScheduleNotFound {
			NotFoundResponse(c, "Schedule not found")
			return
		}
		InternalServerErrorResponse(c, "Failed to delete schedule")
		return
	}

	SuccessResponse(c, gin.H{"message": "Schedule deleted successfully"})
}

// List godoc
// @Summary List schedules
// @Description Get a paginated list of all flight schedules (admin only)
// @Tags Schedules
// @Security BearerAuth
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(10)
// @Success 200 {object} Response{data=PaginatedResponse}
// @Failure 401 {object} ErrorMessageResponse
// @Failure 403 {object} ErrorMessageResponse
// @Failure 500 {object} ErrorMessageResponse
// @Router /admin/schedules [get]
func (h *ScheduleHandler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))

	result, err := h.scheduleService.List(page, pageSize)
	if err != nil {
		InternalServerErrorResponse(c, "Failed to list schedules")
		return
	}

	SuccessResponse(c, result)
}

// ListByAirline godoc
// @Summary List schedules by airline
// @Description Get flight schedules for a specific airline
// @Tags Flights
// @Produce json
// @Param id path string true "Airline ID"
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(10)
// @Success 200 {object} Response{data=PaginatedResponse}
// @Failure 500 {object} ErrorMessageResponse
// @Router /airlines/{id}/schedules [get]
func (h *ScheduleHandler) ListByAirline(c *gin.Context) {
	airlineID := c.Param("id")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))

	result, err := h.scheduleService.ListByAirline(airlineID, page, pageSize)
	if err != nil {
		InternalServerErrorResponse(c, "Failed to list schedules")
		return
	}

	SuccessResponse(c, result)
}

// Search godoc
// @Summary Search flights
// @Description Search for available flights by origin, destination, and date
// @Tags Flights
// @Produce json
// @Param origin query string true "Origin airport code (e.g., CGK)"
// @Param destination query string true "Destination airport code (e.g., DPS)"
// @Param departure_date query string true "Departure date (YYYY-MM-DD)"
// @Param cabin_class query string false "Cabin class (economy, business, first)" default(economy)
// @Param airlines query string false "Comma-separated airline IDs to filter"
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(10)
// @Success 200 {object} Response{data=PaginatedResponse}
// @Failure 400 {object} ErrorMessageResponse
// @Failure 500 {object} ErrorMessageResponse
// @Router /flights/search [get]
func (h *ScheduleHandler) Search(c *gin.Context) {
	var req services.SearchFlightRequest

	req.Origin = c.Query("origin")
	req.Destination = c.Query("destination")
	req.DepartureDate = c.Query("departure_date")
	req.CabinClass = c.DefaultQuery("cabin_class", "economy")
	req.Page, _ = strconv.Atoi(c.DefaultQuery("page", "1"))
	req.PageSize, _ = strconv.Atoi(c.DefaultQuery("page_size", "10"))

	// Parse airlines filter
	airlinesStr := c.Query("airlines")
	if airlinesStr != "" {
		req.Airlines = strings.Split(airlinesStr, ",")
	}

	if req.Origin == "" || req.Destination == "" || req.DepartureDate == "" {
		BadRequestResponse(c, "origin, destination, and departure_date are required")
		return
	}

	result, err := h.scheduleService.Search(req)
	if err != nil {
		InternalServerErrorResponse(c, "Failed to search flights")
		return
	}

	SuccessResponse(c, result)
}

// GetFlightDetail godoc
// @Summary Get flight detail
// @Description Get detailed information about a specific flight
// @Tags Flights
// @Produce json
// @Param id path string true "Flight/Schedule ID"
// @Success 200 {object} Response{data=Schedule}
// @Failure 404 {object} ErrorMessageResponse
// @Router /flights/{id} [get]
func (h *ScheduleHandler) GetFlightDetail(c *gin.Context) {
	h.GetByID(c)
}
