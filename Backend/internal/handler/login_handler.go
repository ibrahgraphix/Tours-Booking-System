package handler

import (
	"errors"
	"go-backend/internal/constants"
	"go-backend/internal/model"
	"go-backend/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type LoginHandler struct {
	LoginService *service.LoginService
}

func (h *LoginHandler) Login(c *gin.Context) {
	var req model.LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"Message":   constants.MsgInvalidRequest,
				"errorCode": constants.CodeInvalidRequest,
			},
		})
		return
	}
    
	user, err := h.LoginService.Login(req.Email, req.Password)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrAuthenticationFailed):
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"Message":   constants.MsgEmailNotFound,
					"errorCode": constants.CodeInvalidCredentials, // 100
				},
			})
			return

		case errors.Is(err, service.ErrPasswordIncorrect):
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"Message":   constants.MsgPasswordIncorrect,
					"errorCode": constants.CodePasswordIncorrect, // 101
				},
			})
			return

		default:
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error": gin.H{
					"Message":   constants.MsgInternalServerError,
					"errorCode": constants.CodeInternalError,
				},
			})
			return
		}
	}

	// On success, include role
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": constants.MsgLoginSuccess,
		"user": gin.H{
			"id":           user.ID,
			"first_name":   user.FirstName,
			"last_name":    user.LastName,
			"email":        user.Email,
			"mobile_number": user.MobileNumber,
			"role":         user.Role,
		},
	})
}
