package handler

import (
	"net/http"

	"go-backend/internal/model"
	"go-backend/internal/service"

	"github.com/gin-gonic/gin"
)

type BookingsHandler struct {
	service service.BookingsService
}

func NewBookingsHandler(s service.BookingsService) *BookingsHandler {
	return &BookingsHandler{service: s}
}

func (h *BookingsHandler) CreateBooking(c *gin.Context) {
	var booking model.Booking
	if err := c.ShouldBindJSON(&booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON body"})
		return
	}

	if err := h.service.CreateBooking(&booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "booking created",
		"booking": booking,
	})
}

func (h *BookingsHandler) GetBookingsByUser(c *gin.Context) {
	email := c.Param("email")
	bookings, err := h.service.GetBookingsByEmail(email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, bookings)
}

// PATCH /api/bookings/:id/cancel
func (h *BookingsHandler) CancelBooking(c *gin.Context) {
	id := c.Param("id")
	if err := h.service.CancelBooking(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "booking cancelled"})
}
