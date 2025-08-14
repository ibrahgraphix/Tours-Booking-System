package handler

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"go-backend/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/xuri/excelize/v2"
)

type AdminBookingHandler struct {
	svc service.AdminBookingService
}

func NewAdminBookingHandler(s service.AdminBookingService) *AdminBookingHandler {
	return &AdminBookingHandler{svc: s}
}

// GET /api/admin/bookings
func (h *AdminBookingHandler) GetAll(c *gin.Context) {
	bookings, err := h.svc.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "failed to fetch bookings",
			"error":   err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, bookings)
}

// PATCH /api/admin/bookings/:id
func (h *AdminBookingHandler) Patch(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid booking id"})
		return
	}

	var req struct {
		Status         *string `json:"status"`
		NumberOfPeople *int    `json:"number_of_people"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid request body"})
		return
	}

	if req.Status == nil && req.NumberOfPeople == nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "nothing to update"})
		return
	}

	if err := h.svc.Update(id, req.Status, req.NumberOfPeople); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "update failed",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "booking updated"})
}

// PUT /api/admin/bookings/:id/status
func (h *AdminBookingHandler) UpdateStatus(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid booking id"})
		return
	}

	var req struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&req); err != nil || req.Status == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid status"})
		return
	}

	if err := h.svc.Update(id, &req.Status, nil); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "failed to update status",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "status updated"})
}

// DELETE /api/admin/bookings/:id
func (h *AdminBookingHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid booking id"})
		return
	}

	if err := h.svc.Delete(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "delete failed",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "booking deleted"})
}

// GET /api/admin/bookings/export
func (h *AdminBookingHandler) Export(c *gin.Context) {
	bookings, err := h.svc.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "failed to fetch bookings",
			"error":   err.Error(),
		})
		return
	}

	f := excelize.NewFile()
	sheet := "Bookings"

	index, err := f.NewSheet(sheet)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "failed to create excel sheet",
			"error":   err.Error(),
		})
		return
	}

	headers := []string{"ID", "Tour", "Customer", "Email", "People", "Status", "Booked On"}
	for i, hname := range headers {
		cell, _ := excelize.CoordinatesToCellName(i+1, 1)
		_ = f.SetCellValue(sheet, cell, hname)
	}

	for idx, b := range bookings {
		row := idx + 2
		_ = f.SetCellValue(sheet, fmt.Sprintf("A%d", row), b.ID)
		_ = f.SetCellValue(sheet, fmt.Sprintf("B%d", row), b.TourName)
		_ = f.SetCellValue(sheet, fmt.Sprintf("C%d", row), b.FullName)
		_ = f.SetCellValue(sheet, fmt.Sprintf("D%d", row), b.Email)
		_ = f.SetCellValue(sheet, fmt.Sprintf("E%d", row), b.NumberOfPeople)
		_ = f.SetCellValue(sheet, fmt.Sprintf("F%d", row), b.Status)
		_ = f.SetCellValue(sheet, fmt.Sprintf("G%d", row), b.CreatedAt.Format("2006-01-02"))
	}

	f.SetActiveSheet(index)

	filename := fmt.Sprintf("bookings_%s.xlsx", time.Now().Format("20060102"))
	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	c.Header("File-Name", filename)
	c.Status(http.StatusOK)

	if err := f.Write(c.Writer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "failed to write excel file",
			"error":   err.Error(),
		})
	}
}
