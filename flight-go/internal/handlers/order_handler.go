package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/mirahekatiket/flight-go/internal/middleware"
	"github.com/mirahekatiket/flight-go/internal/models"
	"github.com/mirahekatiket/flight-go/internal/services"
)

type OrderHandler struct {
	orderService services.OrderService
}

func NewOrderHandler(orderService services.OrderService) *OrderHandler {
	return &OrderHandler{orderService: orderService}
}

// Create godoc
// @Summary Create order
// @Description Create a new flight booking order
// @Tags Orders
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body CreateOrderRequest true "Order data"
// @Success 201 {object} Response{data=Order}
// @Failure 400 {object} ErrorMessageResponse
// @Failure 401 {object} ErrorMessageResponse
// @Failure 500 {object} ErrorMessageResponse
// @Router /orders [post]
func (h *OrderHandler) Create(c *gin.Context) {
	userID := middleware.GetUserID(c)
	if userID == "" {
		UnauthorizedResponse(c, "Not authenticated")
		return
	}

	var req services.CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequestResponse(c, err.Error())
		return
	}

	order, err := h.orderService.Create(userID, req)
	if err != nil {
		if err == services.ErrScheduleNotFound {
			BadRequestResponse(c, "Flight schedule not found")
			return
		}
		if err == services.ErrInvalidFlightDate {
			BadRequestResponse(c, "Invalid flight date")
			return
		}
		InternalServerErrorResponse(c, "Failed to create order: "+err.Error())
		return
	}

	CreatedResponse(c, order)
}

// GetByID godoc
// @Summary Get order by ID
// @Description Get a single order by its ID
// @Tags Orders
// @Security BearerAuth
// @Produce json
// @Param id path string true "Order ID"
// @Success 200 {object} Response{data=Order}
// @Failure 401 {object} ErrorMessageResponse
// @Failure 403 {object} ErrorMessageResponse
// @Failure 404 {object} ErrorMessageResponse
// @Router /orders/{id} [get]
func (h *OrderHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	userID := middleware.GetUserID(c)
	userRole := middleware.GetUserRole(c)

	order, err := h.orderService.GetByID(id)
	if err != nil {
		NotFoundResponse(c, "Order not found")
		return
	}

	// Check if user owns this order or is admin
	if order.UserID != userID && userRole != models.RoleAdmin {
		ForbiddenResponse(c, "Access denied")
		return
	}

	SuccessResponse(c, order)
}

// Update godoc
// @Summary Update order
// @Description Update an existing order (admin only)
// @Tags Orders
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path string true "Order ID"
// @Param request body services.UpdateOrderRequest true "Order data"
// @Success 200 {object} Response{data=Order}
// @Failure 400 {object} ErrorMessageResponse
// @Failure 401 {object} ErrorMessageResponse
// @Failure 403 {object} ErrorMessageResponse
// @Failure 404 {object} ErrorMessageResponse
// @Failure 500 {object} ErrorMessageResponse
// @Router /admin/orders/{id} [put]
func (h *OrderHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var req services.UpdateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequestResponse(c, err.Error())
		return
	}

	order, err := h.orderService.Update(id, req)
	if err != nil {
		if err == services.ErrOrderNotFound {
			NotFoundResponse(c, "Order not found")
			return
		}
		InternalServerErrorResponse(c, "Failed to update order")
		return
	}

	SuccessResponse(c, order)
}

// Cancel godoc
// @Summary Cancel order
// @Description Cancel an existing order
// @Tags Orders
// @Security BearerAuth
// @Param id path string true "Order ID"
// @Success 200 {object} SuccessMessageResponse
// @Failure 401 {object} ErrorMessageResponse
// @Failure 403 {object} ErrorMessageResponse
// @Failure 404 {object} ErrorMessageResponse
// @Failure 500 {object} ErrorMessageResponse
// @Router /orders/{id}/cancel [post]
func (h *OrderHandler) Cancel(c *gin.Context) {
	id := c.Param("id")
	userID := middleware.GetUserID(c)
	userRole := middleware.GetUserRole(c)

	// Get order first to check ownership
	order, err := h.orderService.GetByID(id)
	if err != nil {
		NotFoundResponse(c, "Order not found")
		return
	}

	// Check if user owns this order or is admin
	if order.UserID != userID && userRole != models.RoleAdmin {
		ForbiddenResponse(c, "Access denied")
		return
	}

	if err := h.orderService.Cancel(id); err != nil {
		InternalServerErrorResponse(c, "Failed to cancel order")
		return
	}

	SuccessResponse(c, gin.H{"message": "Order cancelled successfully"})
}

// List godoc
// @Summary List all orders
// @Description Get a paginated list of all orders (admin only)
// @Tags Orders
// @Security BearerAuth
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(10)
// @Success 200 {object} Response{data=PaginatedResponse}
// @Failure 401 {object} ErrorMessageResponse
// @Failure 403 {object} ErrorMessageResponse
// @Failure 500 {object} ErrorMessageResponse
// @Router /admin/orders [get]
func (h *OrderHandler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))

	result, err := h.orderService.List(page, pageSize)
	if err != nil {
		InternalServerErrorResponse(c, "Failed to list orders")
		return
	}

	SuccessResponse(c, result)
}

// ListMyOrders godoc
// @Summary List my orders
// @Description Get a paginated list of orders for the current user
// @Tags Orders
// @Security BearerAuth
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(10)
// @Success 200 {object} Response{data=PaginatedResponse}
// @Failure 401 {object} ErrorMessageResponse
// @Failure 500 {object} ErrorMessageResponse
// @Router /orders [get]
func (h *OrderHandler) ListMyOrders(c *gin.Context) {
	userID := middleware.GetUserID(c)
	if userID == "" {
		UnauthorizedResponse(c, "Not authenticated")
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))

	result, err := h.orderService.ListByUser(userID, page, pageSize)
	if err != nil {
		InternalServerErrorResponse(c, "Failed to list orders")
		return
	}

	SuccessResponse(c, result)
}
