package model

import "time"

type SignUpRequest struct {
	Email        string `json:"email"`
	FirstName    string `json:"first_name"`
	LastName     string `json:"last_name"`
	MobileNumber string `json:"mobile_number"`
	Password     string `json:"password"`
	Role         string `json:"role,omitempty"`        // optional: frontend hint (server enforces)
	CompanyID    *int   `json:"company_id,omitempty"`  // optional: allow frontend to pass existing company id
	CompanyName  string `json:"company_name,omitempty"`// optional: new company name when user wants to create
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
	Role         string    `json:"role"`                 // "customer" or "admin"
	CompanyID    *int      `json:"company_id,omitempty"` // nullable
	IsSuperAdmin bool      `json:"is_superadmin"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
