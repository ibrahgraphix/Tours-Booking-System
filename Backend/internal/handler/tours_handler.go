package handler

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"go-backend/internal/model"
	"go-backend/internal/service"

	"github.com/gin-gonic/gin"
)

type ToursHandler struct {
	Service *service.ToursService
}

func NewToursHandler(service *service.ToursService) *ToursHandler {
	return &ToursHandler{Service: service}
}

// CreateTour handles POST /api/tours with multipart/form-data including image upload
func (h *ToursHandler) CreateTour(c *gin.Context) {
	name := c.PostForm("name")
	description := c.PostForm("description")
	dateStr := c.PostForm("datetime")
	priceStr := c.PostForm("price")

	if name == "" || description == "" || dateStr == "" || priceStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	date, err := time.Parse("2006-01-02T15:04", dateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
		return
	}

	price, err := strconv.ParseFloat(priceStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid price format"})
		return
	}

	var imageUrl string
	file, err := c.FormFile("image")
	if err == nil && file != nil {
		// Create uploads folder if not exists
		err = os.MkdirAll("uploads", os.ModePerm)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload folder"})
			return
		}

		// Generate unique filename
		filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), file.Filename)
		filepath := "uploads/" + filename

		// Save file
		if err := c.SaveUploadedFile(file, filepath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}

		// Dynamically generate full URL for frontend
		scheme := "http"
		if c.Request.TLS != nil {
			scheme = "https"
		}
		imageUrl = fmt.Sprintf("%s://%s/uploads/%s", scheme, c.Request.Host, filename)
	}

	tour := &model.Tour{
		Name:        name,
		Description: description,
		Date:        date,
		Price:       price,
		ImageURL:    imageUrl,
	}

	if err := h.Service.CreateTour(tour); err != nil {
		if vErr, ok := err.(*service.ValidationError); ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": vErr.Message})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create tour"})
		return
	}

	c.JSON(http.StatusCreated, tour)
}

// GetTours handles GET /api/tours returning all tours as JSON
func (h *ToursHandler) GetTours(c *gin.Context) {
	tours, err := h.Service.GetAllTours()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tours"})
		return
	}
	c.JSON(http.StatusOK, tours)
}
