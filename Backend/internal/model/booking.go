package model

import "time"

// Matches your schema (case-sensitive JSON tags)
type Booking struct {
	ID              int       `json:"id"`
	TourID          int       `json:"tour_id"`
	FullName        string    `json:"full_name"`
	Email           string    `json:"email"`
	NumberOfPeople  int       `json:"number_of_people"`
	Status          string    `json:"status"`
	CreatedAt       time.Time `json:"created_at"`
}

// Response for MyBookings
type BookingSummary struct {
	ID             int       `json:"id"`
	TourName       string    `json:"tour_name"`
	Date           time.Time `json:"date"`
	NumberOfPeople int       `json:"number_of_people"`
	Status         string    `json:"status"`
}

// Response for Admin Booking List
type AdminBooking struct {
	ID             int       `json:"id"`
	FullName       string    `json:"full_name"`
	Email          string    `json:"email"`       
	TourName       string    `json:"tour_name"`
	Date           time.Time `json:"date"`
	NumberOfPeople int       `json:"number_of_people"`
	Status         string    `json:"status"`
	CreatedAt      time.Time `json:"created_at"`   
}
