package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/mirahekatiket/flight-go/internal/services"
)

type WhitelistHandler struct {
	whitelistService *services.WhitelistService
}

func NewWhitelistHandler(whitelistService *services.WhitelistService) *WhitelistHandler {
	return &WhitelistHandler{whitelistService: whitelistService}
}

// Create creates a new whitelisted user
// @Summary Create whitelisted user
// @Tags Admin - Whitelist
// @Accept json
// @Produce json
// @Param whitelist body services.CreateWhitelistRequest true "Whitelist data"
// @Success 201 {object} Response{data=models.WhitelistedUser}
// @Router /admin/whitelist [post]
// @Security BearerAuth
func (h *WhitelistHandler) Create(c *gin.Context) {
	var req services.CreateWhitelistRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequestResponse(c, err.Error())
		return
	}

	whitelistedUser, err := h.whitelistService.Create(req)
	if err != nil {
		if err.Error() == "email already whitelisted" {
			BadRequestResponse(c, err.Error())
			return
		}
		InternalServerErrorResponse(c, "Failed to create whitelisted user")
		return
	}

	CreatedResponse(c, whitelistedUser)
}

// List lists all whitelisted users
// @Summary List whitelisted users
// @Tags Admin - Whitelist
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(20)
// @Success 200 {object} PaginatedResponse{data=[]models.WhitelistedUser}
// @Router /admin/whitelist [get]
// @Security BearerAuth
func (h *WhitelistHandler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	whitelistedUsers, total, err := h.whitelistService.List(page, pageSize)
	if err != nil {
		InternalServerErrorResponse(c, "Failed to list whitelisted users")
		return
	}

	totalPages := int(total) / pageSize
	if int(total)%pageSize != 0 {
		totalPages++
	}

	c.JSON(200, PaginatedResponse{
		Data:        whitelistedUsers,
		Page:        page,
		PageSize:    pageSize,
		TotalItems:  total,
		TotalPages:  totalPages,
	})
}

// GetByID gets a whitelisted user by ID
// @Summary Get whitelisted user
// @Tags Admin - Whitelist
// @Produce json
// @Param id path string true "Whitelist ID"
// @Success 200 {object} Response{data=models.WhitelistedUser}
// @Router /admin/whitelist/{id} [get]
// @Security BearerAuth
func (h *WhitelistHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	whitelistedUser, err := h.whitelistService.GetByID(id)
	if err != nil {
		NotFoundResponse(c, "Whitelisted user not found")
		return
	}

	SuccessResponse(c, whitelistedUser)
}

// Update updates a whitelisted user
// @Summary Update whitelisted user
// @Tags Admin - Whitelist
// @Accept json
// @Produce json
// @Param id path string true "Whitelist ID"
// @Param whitelist body services.UpdateWhitelistRequest true "Whitelist data"
// @Success 200 {object} Response{data=models.WhitelistedUser}
// @Router /admin/whitelist/{id} [put]
// @Security BearerAuth
func (h *WhitelistHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var req services.UpdateWhitelistRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequestResponse(c, err.Error())
		return
	}

	whitelistedUser, err := h.whitelistService.Update(id, req)
	if err != nil {
		InternalServerErrorResponse(c, "Failed to update whitelisted user")
		return
	}

	SuccessResponse(c, whitelistedUser)
}

// Delete deletes a whitelisted user
// @Summary Delete whitelisted user
// @Tags Admin - Whitelist
// @Param id path string true "Whitelist ID"
// @Success 200 {object} Response
// @Router /admin/whitelist/{id} [delete]
// @Security BearerAuth
func (h *WhitelistHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.whitelistService.Delete(id); err != nil {
		InternalServerErrorResponse(c, "Failed to delete whitelisted user")
		return
	}

	SuccessResponse(c, gin.H{"message": "Whitelisted user deleted successfully"})
}

// ToggleAirlineAccess toggles airline access for a whitelisted user
// @Summary Toggle airline access
// @Tags Admin - Whitelist
// @Accept json
// @Produce json
// @Param id path string true "Whitelist ID"
// @Param body body object{airline_id=string} true "Airline ID"
// @Success 200 {object} Response{data=models.WhitelistedUser}
// @Router /admin/whitelist/{id}/toggle-airline [post]
// @Security BearerAuth
func (h *WhitelistHandler) ToggleAirlineAccess(c *gin.Context) {
	id := c.Param("id")

	var req struct {
		AirlineID string `json:"airline_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequestResponse(c, err.Error())
		return
	}

	whitelistedUser, err := h.whitelistService.ToggleAirlineAccess(id, req.AirlineID)
	if err != nil {
		InternalServerErrorResponse(c, "Failed to toggle airline access")
		return
	}

	SuccessResponse(c, whitelistedUser)
}

// CheckEmailAccess checks if an email has access to an airline
// @Summary Check email access
// @Tags Whitelist
// @Produce json
// @Param email query string true "Email address"
// @Param airline_id query string false "Airline ID"
// @Success 200 {object} Response{data=object{whitelisted=bool,has_access=bool}}
// @Router /whitelist/check [get]
func (h *WhitelistHandler) CheckEmailAccess(c *gin.Context) {
	email := c.Query("email")
	airlineID := c.Query("airline_id")

	if email == "" {
		BadRequestResponse(c, "Email is required")
		return
	}

	whitelisted, err := h.whitelistService.IsEmailWhitelisted(email)
	if err != nil {
		InternalServerErrorResponse(c, "Failed to check whitelist status")
		return
	}

	result := gin.H{
		"whitelisted": whitelisted,
	}

	if airlineID != "" && whitelisted {
		hasAccess, err := h.whitelistService.HasAirlineAccess(email, airlineID)
		if err != nil {
			InternalServerErrorResponse(c, "Failed to check airline access")
			return
		}
		result["has_access"] = hasAccess
	}

	SuccessResponse(c, result)
}

