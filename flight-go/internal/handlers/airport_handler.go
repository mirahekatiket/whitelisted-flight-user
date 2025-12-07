package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/mirahekatiket/flight-go/internal/repository"
)

type AirportHandler struct {
	airportRepo repository.AirportRepository
}

func NewAirportHandler(airportRepo repository.AirportRepository) *AirportHandler {
	return &AirportHandler{airportRepo: airportRepo}
}

// List godoc
// @Summary List airports
// @Description Get a paginated list of airports
// @Tags Airports
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(20)
// @Success 200 {object} Response{data=PaginatedResponse}
// @Failure 500 {object} ErrorMessageResponse
// @Router /airports [get]
func (h *AirportHandler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	airports, total, err := h.airportRepo.List(page, pageSize)
	if err != nil {
		InternalServerErrorResponse(c, "Failed to list airports")
		return
	}

	totalPages := int(total) / pageSize
	if int(total)%pageSize > 0 {
		totalPages++
	}

	SuccessResponse(c, gin.H{
		"data":        airports,
		"page":        page,
		"page_size":   pageSize,
		"total_items": total,
		"total_pages": totalPages,
	})
}

// ListAll godoc
// @Summary List all airports
// @Description Get all airports without pagination
// @Tags Airports
// @Produce json
// @Success 200 {object} Response{data=[]Airport}
// @Failure 500 {object} ErrorMessageResponse
// @Router /airports/all [get]
func (h *AirportHandler) ListAll(c *gin.Context) {
	airports, err := h.airportRepo.ListAll()
	if err != nil {
		InternalServerErrorResponse(c, "Failed to list airports")
		return
	}

	SuccessResponse(c, airports)
}

// Search godoc
// @Summary Search airports
// @Description Search airports by code, city, or name
// @Tags Airports
// @Produce json
// @Param q query string true "Search query"
// @Success 200 {object} Response{data=[]Airport}
// @Failure 400 {object} ErrorMessageResponse
// @Failure 500 {object} ErrorMessageResponse
// @Router /airports/search [get]
func (h *AirportHandler) Search(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		BadRequestResponse(c, "Search query required")
		return
	}

	airports, err := h.airportRepo.Search(query)
	if err != nil {
		InternalServerErrorResponse(c, "Failed to search airports")
		return
	}

	SuccessResponse(c, airports)
}

// GetByID godoc
// @Summary Get airport by ID
// @Description Get a single airport by its ID
// @Tags Airports
// @Produce json
// @Param id path string true "Airport ID"
// @Success 200 {object} Response{data=Airport}
// @Failure 404 {object} ErrorMessageResponse
// @Router /airports/{id} [get]
func (h *AirportHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	airport, err := h.airportRepo.FindByID(id)
	if err != nil {
		NotFoundResponse(c, "Airport not found")
		return
	}

	SuccessResponse(c, airport)
}

// GetByCode godoc
// @Summary Get airport by code
// @Description Get a single airport by its IATA code
// @Tags Airports
// @Produce json
// @Param code path string true "Airport IATA code (e.g., CGK)"
// @Success 200 {object} Response{data=Airport}
// @Failure 404 {object} ErrorMessageResponse
// @Router /airports/code/{code} [get]
func (h *AirportHandler) GetByCode(c *gin.Context) {
	code := c.Param("code")

	airport, err := h.airportRepo.FindByCode(code)
	if err != nil {
		NotFoundResponse(c, "Airport not found")
		return
	}

	SuccessResponse(c, airport)
}
