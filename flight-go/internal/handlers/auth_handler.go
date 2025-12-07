package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/mirahekatiket/flight-go/internal/middleware"
	"github.com/mirahekatiket/flight-go/internal/services"
)

type AuthHandler struct {
	authService services.AuthService
}

func NewAuthHandler(authService services.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

// Register godoc
// @Summary Register a new user
// @Description Register a new user account and return JWT token
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body RegisterRequest true "Registration data"
// @Success 201 {object} Response{data=TokenResponse}
// @Failure 400 {object} ErrorMessageResponse
// @Failure 500 {object} ErrorMessageResponse
// @Router /auth/register [post]
func (h *AuthHandler) Register(c *gin.Context) {
	var req services.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequestResponse(c, err.Error())
		return
	}

	tokenResponse, err := h.authService.Register(req)
	if err != nil {
		if err == services.ErrUserAlreadyExists {
			BadRequestResponse(c, "User with this email already exists")
			return
		}
		InternalServerErrorResponse(c, "Failed to register user")
		return
	}

	CreatedResponse(c, tokenResponse)
}

// Login godoc
// @Summary Login user
// @Description Authenticate user and return JWT token
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body LoginRequest true "Login credentials"
// @Success 200 {object} Response{data=TokenResponse}
// @Failure 400 {object} ErrorMessageResponse
// @Failure 401 {object} ErrorMessageResponse
// @Router /auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req services.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		BadRequestResponse(c, err.Error())
		return
	}

	response, err := h.authService.Login(req)
	if err != nil {
		if err == services.ErrInvalidCredentials {
			UnauthorizedResponse(c, "Invalid email or password")
			return
		}
		InternalServerErrorResponse(c, "Failed to login")
		return
	}

	SuccessResponse(c, response)
}

// Me godoc
// @Summary Get current user
// @Description Get the currently authenticated user's information
// @Tags Auth
// @Security BearerAuth
// @Produce json
// @Success 200 {object} Response{data=User}
// @Failure 401 {object} ErrorMessageResponse
// @Failure 404 {object} ErrorMessageResponse
// @Router /auth/me [get]
func (h *AuthHandler) Me(c *gin.Context) {
	userID := middleware.GetUserID(c)
	if userID == "" {
		UnauthorizedResponse(c, "Not authenticated")
		return
	}

	user, err := h.authService.GetUserByID(userID)
	if err != nil {
		NotFoundResponse(c, "User not found")
		return
	}

	SuccessResponse(c, user)
}
