package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// RequireRole checks user role from context (assumed set by auth middleware)
func RequireRole(role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("userRole")
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error":   gin.H{"message": "Unauthorized"},
			})
			return
		}
		if userRole != role {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"success": false,
				"error":   gin.H{"message": "Forbidden: insufficient privileges"},
			})
			return
		}
		c.Next()
	}
}
