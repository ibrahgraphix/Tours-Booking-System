package handler

import (
	"go-backend/internal/constants"
	"go-backend/internal/model"
	"go-backend/internal/repository"
	"go-backend/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SignUpHandler struct {
	SignUpService *service.SignUpService
}

func (h *SignUpHandler) SignUp(c *gin.Context) {
	var req model.SignUpRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"message":   constants.MsgInvalidRequest,
				"errorCode": constants.CodeInvalidRequest,
			},
		})
		return
	}

	err := h.SignUpService.RegisterUser(req)
	if err != nil {
		switch err {
		case repository.ErrEmailAlreadyExists:
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"error": gin.H{
					"message":   constants.MsgEmailAlreadyExists,
					"errorCode": constants.CodeEmailAlreadyExists,
				},
			})
			return
		case repository.ErrDBUnavailable:
			c.JSON(http.StatusServiceUnavailable, gin.H{
				"success": false,
				"error": gin.H{
					"message":   constants.MsgServiceUnavailable,
					"errorCode": constants.CodeServiceUnavailable,
				},
			})
			return
		default:
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error": gin.H{
					"message":   constants.MsgInternalServerFailure,
					"errorCode": constants.CodeInternalServerFailure,
				},
			})
			return
		}
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"user_info": gin.H{
			"email": req.Email,
			"role":  req.Role, // might be empty or "customer"
		},
	})
}
