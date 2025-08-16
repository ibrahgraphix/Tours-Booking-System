package handler

import (
	"database/sql"
	"net/http"
	"strconv"

	"go-backend/internal/service"

	"github.com/gin-gonic/gin"
)

type AdminPaymentHandler struct {
	Svc service.AdminPaymentService
}

func NewAdminPaymentHandler(svc service.AdminPaymentService) *AdminPaymentHandler {
	return &AdminPaymentHandler{Svc: svc}
}

// GET /api/payments
func (h *AdminPaymentHandler) GetAll(c *gin.Context) {
	payments, err := h.Svc.GetAllPayments()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "failed to fetch payments", "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, payments)
}

// POST /api/payments
// Accepts flexible payload keys (booking_id, BookingID, bookingId, etc.)
func (h *AdminPaymentHandler) Create(c *gin.Context) {
	var payload map[string]interface{}
	if err := c.BindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid payload", "error": err.Error()})
		return
	}

	// Extract booking id flexibly
	var bookingID int
	found := false
	if v, ok := payload["booking_id"]; ok {
		switch t := v.(type) {
		case float64:
			bookingID = int(t)
			found = true
		case string:
			if n, err := strconv.Atoi(t); err == nil {
				bookingID = n
				found = true
			}
		}
	}
	if !found {
		// try other common variants
		if v, ok := payload["bookingId"]; ok {
			switch t := v.(type) {
			case float64:
				bookingID = int(t)
				found = true
			case string:
				if n, err := strconv.Atoi(t); err == nil {
					bookingID = n
					found = true
				}
			}
		}
	}
	if !found {
		if v, ok := payload["BookingID"]; ok {
			switch t := v.(type) {
			case float64:
				bookingID = int(t)
				found = true
			case string:
				if n, err := strconv.Atoi(t); err == nil {
					bookingID = n
					found = true
				}
			}
		}
	}

	if bookingID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid booking id"})
		return
	}

	// extract amount
	var amount float64
	if v, ok := payload["amount"]; ok {
		switch t := v.(type) {
		case float64:
			amount = t
		case string:
			if f, err := strconv.ParseFloat(t, 64); err == nil {
				amount = f
			}
		}
	} else if v, ok := payload["Amount"]; ok {
		switch t := v.(type) {
		case float64:
			amount = t
		case string:
			if f, err := strconv.ParseFloat(t, 64); err == nil {
				amount = f
			}
		}
	}

	// extract method
	var method string
	if v, ok := payload["method"]; ok {
		if s, ok := v.(string); ok {
			method = s
		}
	} else if v, ok := payload["Method"]; ok {
		if s, ok := v.(string); ok {
			method = s
		}
	}

	id, err := h.Svc.CreateOrUpdatePayment(bookingID, amount, method)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "failed to save payment", "error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "payment saved", "id": id})
}

// PUT /api/payments/:id/update
func (h *AdminPaymentHandler) Update(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid payment id"})
		return
	}

	var payload struct {
		Amount float64 `json:"amount"`
		Method string  `json:"method"`
	}
	if err := c.BindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid payload"})
		return
	}

	if err := h.Svc.UpdatePayment(id, payload.Amount, payload.Method); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "payment updated"})
}

// PUT /api/payments/:id/verify
func (h *AdminPaymentHandler) Verify(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid payment id"})
		return
	}
	if err := h.Svc.VerifyPayment(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "payment verified"})
}

// DELETE /api/payments/:id
func (h *AdminPaymentHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid payment id"})
		return
	}

	if err := h.Svc.DeletePayment(id); err != nil {
		// Return 404 if not found, otherwise 400 with error text
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"message": "payment not found"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "payment deleted"})
}

// GET /api/payments/export
func (h *AdminPaymentHandler) Export(c *gin.Context) {
	file, err := h.Svc.ExportPayments()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "failed to export payments", "error": err.Error()})
		return
	}

	c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.Header("Content-Disposition", "attachment; filename=payments.xlsx")
	c.Header("File-Name", "payments.xlsx")
	c.Header("Content-Transfer-Encoding", "binary")

	if err := file.Write(c.Writer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "failed to write file", "error": err.Error()})
		return
	}
}
