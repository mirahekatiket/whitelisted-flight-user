package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/mirahekatiket/flight-go/internal/models"
	"github.com/mirahekatiket/flight-go/internal/services"
)

type AuthMiddleware struct {
	authService services.AuthService
}

func NewAuthMiddleware(authService services.AuthService) *AuthMiddleware {
	return &AuthMiddleware{authService: authService}
}

// RequireAuth middleware requires a valid JWT token
func (m *AuthMiddleware) RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Bearer token required"})
			c.Abort()
			return
		}

		claims, err := m.authService.ValidateToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Set user info in context
		c.Set("user_id", claims.UserID)
		c.Set("user_email", claims.Email)
		c.Set("user_role", claims.Role)

		c.Next()
	}
}

// RequireAdmin middleware requires admin role
func (m *AuthMiddleware) RequireAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("user_role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated"})
			c.Abort()
			return
		}

		if role != models.RoleAdmin {
			c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// GetUserID helper to get user ID from context
func GetUserID(c *gin.Context) string {
	userID, _ := c.Get("user_id")
	if id, ok := userID.(string); ok {
		return id
	}
	return ""
}

// GetUserRole helper to get user role from context
func GetUserRole(c *gin.Context) models.Role {
	role, _ := c.Get("user_role")
	if r, ok := role.(models.Role); ok {
		return r
	}
	return models.RoleUser
}

// GetUserEmail helper to get user email from context
func GetUserEmail(c *gin.Context) string {
	email, _ := c.Get("user_email")
	if e, ok := email.(string); ok {
		return e
	}
	return ""
}

// OptionalAuth middleware tries to extract user info but doesn't require authentication
// This allows public endpoints to still check whitelist status if user is logged in
func (m *AuthMiddleware) OptionalAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader != "" {
			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
			if tokenString != authHeader {
				claims, err := m.authService.ValidateToken(tokenString)
				if err == nil {
					// Set user info in context if token is valid
					c.Set("user_id", claims.UserID)
					c.Set("user_email", claims.Email)
					c.Set("user_role", claims.Role)
				}
			}
		}
		c.Next()
	}
}

