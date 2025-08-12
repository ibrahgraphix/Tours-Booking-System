package model

import "time"

type SignUpRequest struct {
	Email        string `json:"email"`
	FirstName    string `json:"first_name"`
	LastName     string `json:"last_name"`
	MobileNumber string `json:"mobile_number"`
	Password     string `json:"password"`
	Role         string `json:"role,omitempty"`  // keep this to allow optional passing, but ignored in service
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type User struct {
	ID           int       `json:"id"`
	FirstName    string    `json:"first_name"`
	LastName     string    `json:"last_name"`
	Email        string    `json:"email"`
	Password     string    `json:"password"`
	MobileNumber string    `json:"mobile_number"`
	Role         string    `json:"role"`    // added role
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
