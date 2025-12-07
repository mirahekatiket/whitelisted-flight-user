package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/mirahekatiket/flight-go/internal/services"
)

type AirlineHandler struct {
	airlineService services.AirlineService
}

func NewAirlineHandler(airlineService services.AirlineService) *AirlineHandler {
	return &AirlineHandler{airlineService: airlineService}
}

// Create godoc
// @Summary Create airline
// @Description Create a new airline (admin only)
// @Tags Airlines
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body CreateAirlineRequest true "Airline data"
// @Success 201 {object} Response{data=Airline}
// @Failure 400 {object} ErrorMessageResponse
// @Failure 401 {object} ErrorMessageResponse
// @Failure 403 {object} ErrorMessageResponse
// @Failure 500 {object} ErrorMessageResponse
// @Router /admin/airlines [post]
func (h *AirlineHandler) Create(c *gin.Context) {
	var req services.CreateAirlineRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequestResponse(c, err.Error())
		return
	}

	airline, err := h.airlineService.Create(req)
	if err != nil {
		if err == services.ErrAirlineCodeExists {
			BadRequestResponse(c, "Airline code already exists")
			return
		}
		InternalServerErrorResponse(c, "Failed to create airline")
		return
	}

	CreatedResponse(c, airline)
}

// GetByID godoc
// @Summary Get airline by ID
// @Description Get a single airline by its ID
// @Tags Airlines
// @Produce json
// @Param id path string true "Airline ID"
// @Success 200 {object} Response{data=Airline}
// @Failure 404 {object} ErrorMessageResponse
// @Router /airlines/{id} [get]
func (h *AirlineHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	airline, err := h.airlineService.GetByID(id)
	if err != nil {
		NotFoundResponse(c, "Airline not found")
		return
	}

	SuccessResponse(c, airline)
}

// Update godoc
// @Summary Update airline
// @Description Update an existing airline (admin only)
// @Tags Airlines
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path string true "Airline ID"
// @Param request body UpdateAirlineRequest true "Airline data"
// @Success 200 {object} Response{data=Airline}
// @Failure 400 {object} ErrorMessageResponse
// @Failure 401 {object} ErrorMessageResponse
// @Failure 403 {object} ErrorMessageResponse
// @Failure 404 {object} ErrorMessageResponse
// @Failure 500 {object} ErrorMessageResponse
// @Router /admin/airlines/{id} [put]
func (h *AirlineHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var req services.UpdateAirlineRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequestResponse(c, err.Error())
		return
	}

	airline, err := h.airlineService.Update(id, req)
	if err != nil {
		if err == services.ErrAirlineNotFound {
			NotFoundResponse(c, "Airline not found")
			return
		}
		if err == services.ErrAirlineCodeExists {
			BadRequestResponse(c, "Airline code already exists")
			return
		}
		InternalServerErrorResponse(c, "Failed to update airline")
		return
	}

	SuccessResponse(c, airline)
}

// Delete godoc
// @Summary Delete airline
// @Description Delete an airline (admin only)
// @Tags Airlines
// @Security BearerAuth
// @Param id path string true "Airline ID"
// @Success 200 {object} SuccessMessageResponse
// @Failure 401 {object} ErrorMessageResponse
// @Failure 403 {object} ErrorMessageResponse
// @Failure 404 {object} ErrorMessageResponse
// @Failure 500 {object} ErrorMessageResponse
// @Router /admin/airlines/{id} [delete]
func (h *AirlineHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.airlineService.Delete(id); err != nil {
		if err == services.ErrAirlineNotFound {
			NotFoundResponse(c, "Airline not found")
			return
		}
		InternalServerErrorResponse(c, "Failed to delete airline")
		return
	}

	SuccessResponse(c, gin.H{"message": "Airline deleted successfully"})
}

// List godoc
// @Summary List airlines
// @Description Get a paginated list of airlines
// @Tags Airlines
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(10)
// @Param active_only query bool false "Show only active airlines" default(false)
// @Success 200 {object} Response{data=PaginatedResponse}
// @Failure 500 {object} ErrorMessageResponse
// @Router /airlines [get]
func (h *AirlineHandler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	activeOnly, _ := strconv.ParseBool(c.DefaultQuery("active_only", "false"))

	result, err := h.airlineService.List(page, pageSize, activeOnly)
	if err != nil {
		InternalServerErrorResponse(c, "Failed to list airlines")
		return
	}

	SuccessResponse(c, result)
}

// ListAll godoc
// @Summary List all active airlines
// @Description Get all active airlines without pagination
// @Tags Airlines
// @Produce json
// @Success 200 {object} Response{data=[]Airline}
// @Failure 500 {object} ErrorMessageResponse
// @Router /airlines/all [get]
func (h *AirlineHandler) ListAll(c *gin.Context) {
	airlines, err := h.airlineService.ListAll()
	if err != nil {
		InternalServerErrorResponse(c, "Failed to list airlines")
		return
	}

	SuccessResponse(c, airlines)
}
