package handler

import (
	"net/http"
	"strconv"

	"go-backend/internal/service"

	"github.com/gin-gonic/gin"
)

type SuperAdminUserHandler struct {
	Svc *service.SuperAdminUserService
}

func (h *SuperAdminUserHandler) ListUsers(c *gin.Context) {
	users, err := h.Svc.ListUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   gin.H{"message": err.Error()},
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"users":   users,
	})
}

type updateRoleBody struct {
	Role      string `json:"role"`       // "admin" or "customer"
	CompanyID int    `json:"company_id"` // required
}

func (h *SuperAdminUserHandler) UpdateUserRole(c *gin.Context) {
	idStr := c.Param("id")
	uid, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"message": "invalid user id"}})
		return
	}
	var body updateRoleBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"message": "invalid body"}})
		return
	}
	if body.CompanyID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"message": "company_id required"}})
		return
	}
	if err := h.Svc.UpdateUserRoleAndCompany(uid, body.Role, body.CompanyID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"message": err.Error()}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "user updated"})
}

func (h *SuperAdminUserHandler) DeleteUser(c *gin.Context) {
	idStr := c.Param("id")
	uid, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": gin.H{"message": "invalid user id"}})
		return
	}
	if err := h.Svc.DeleteUser(uid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": gin.H{"message": err.Error()}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "user deleted"})
}
