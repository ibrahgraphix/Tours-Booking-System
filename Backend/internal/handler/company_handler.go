package handler

import (
	"net/http"

	"go-backend/internal/repository"

	"github.com/gin-gonic/gin"
)

type CompanyHandler struct {
	Repo *repository.CompanyRepo
}

func (h *CompanyHandler) ListCompanies(c *gin.Context) {
	cs, err := h.Repo.ListCompanies()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": gin.H{"message": err.Error()}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "companies": cs})
}
