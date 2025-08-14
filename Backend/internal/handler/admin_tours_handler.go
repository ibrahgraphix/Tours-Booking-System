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

type AdminToursHandler struct {
	Svc service.AdminToursService
}

func NewAdminToursHandler(svc service.AdminToursService) *AdminToursHandler {
	return &AdminToursHandler{Svc: svc}
}

// GET /api/admin/my-tours
func (h *AdminToursHandler) GetAll(c *gin.Context) {
	tours, err := h.Svc.GetAllTours()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "failed to fetch tours", "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tours)
}

// DELETE /api/admin/my-tours/:id
func (h *AdminToursHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid tour id"})
		return
	}

	if err := h.Svc.DeleteTour(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "failed to delete tour", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "tour deleted successfully"})
}

// GET /api/admin/my-tours/export
func (h *AdminToursHandler) Export(c *gin.Context) {
	tours, err := h.Svc.GetAllTours()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "failed to fetch tours", "error": err.Error()})
		return
	}

	f := excelize.NewFile()
	sheet := "Tours"

	index, err := f.NewSheet(sheet)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "failed to create excel sheet", "error": err.Error()})
		return
	}

	headers := []string{"ID", "Name", "Description", "Date", "Price", "Image URL"}
	for i, hname := range headers {
		cell, _ := excelize.CoordinatesToCellName(i+1, 1)
		_ = f.SetCellValue(sheet, cell, hname)
	}

	for idx, t := range tours {
		row := idx + 2
		_ = f.SetCellValue(sheet, fmt.Sprintf("A%d", row), t.ID)
		_ = f.SetCellValue(sheet, fmt.Sprintf("B%d", row), t.Name)
		_ = f.SetCellValue(sheet, fmt.Sprintf("C%d", row), t.Description)
		_ = f.SetCellValue(sheet, fmt.Sprintf("D%d", row), t.Date.Format("2006-01-02 15:04"))
		_ = f.SetCellValue(sheet, fmt.Sprintf("E%d", row), t.Price)
		_ = f.SetCellValue(sheet, fmt.Sprintf("F%d", row), t.ImageURL)
	}

	f.SetActiveSheet(index)
	filename := fmt.Sprintf("tours_%s.xlsx", time.Now().Format("20060102"))
	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	c.Header("File-Name", filename)
	c.Status(http.StatusOK)

	if err := f.Write(c.Writer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "failed to write excel file", "error": err.Error()})
	}
}
