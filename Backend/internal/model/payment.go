package model

import "time"

type Payment struct {
	ID           int       `json:"id"`
	BookingID    int       `json:"booking_id"`
	CustomerName string    `json:"customer_name"`
	TourName     string    `json:"tour_name"`
	Amount       float64   `json:"amount"`
	Method       string    `json:"method"`
	Status       string    `json:"status"`
	Verified     bool      `json:"verified"`
	Date         time.Time `json:"date"`
}
