package middleware

import (
	"net/http"

	"go-backend/internal/repository"

	"github.com/gin-gonic/gin"
)

var dbSvc *repository.DBService

// SetDB must be called once from main.go to provide DB access
func SetDB(d *repository.DBService) {
	dbSvc = d
}

// SuperAdminOnly checks header "X-User-Email" and verifies is_superadmin in DB
func SuperAdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		if dbSvc == nil {
			// defensive: if middleware not initialized
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": gin.H{"message": "server misconfiguration"}})
			c.Abort()
			return
		}

		email := c.GetHeader("X-User-Email")
		if email == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": gin.H{"message": "missing X-User-Email header"}})
			c.Abort()
			return
		}

		u, err := dbSvc.GetUserByEmail(email)
		if err != nil || u == nil {
			c.JSON(http.StatusForbidden, gin.H{"success": false, "error": gin.H{"message": "forbidden"}})
			c.Abort()
			return
		}

		if !u.IsSuperAdmin {
			c.JSON(http.StatusForbidden, gin.H{"success": false, "error": gin.H{"message": "super admin access required"}})
			c.Abort()
			return
		}

		// optionally place the user in context for downstream handlers:
		c.Set("user_email", u.Email)
		c.Set("user_role", u.Role)
		c.Set("user_is_superadmin", u.IsSuperAdmin)

		c.Next()
	}
}
