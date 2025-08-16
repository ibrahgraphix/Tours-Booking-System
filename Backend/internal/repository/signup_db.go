package repository

import (
	"database/sql"
	"errors"
	"go-backend/internal/model"
)

var (
	ErrEmailAlreadyExists = errors.New("email already in use")
	ErrDBUnavailable      = errors.New("database unavailable")
)

type SignUpDBService struct {
	DB *sql.DB
}

// IsEmailExists checks if an email is already present in users table.
func (s *SignUpDBService) IsEmailExists(email string) (bool, error) {
	var count int
	err := s.DB.QueryRow("SELECT COUNT(*) FROM users WHERE email = $1", email).Scan(&count)
	if err != nil {
		if err == sql.ErrConnDone {
			return false, ErrDBUnavailable
		}
		return false, err
	}
	return count > 0, nil
}

// GetOrCreateCompany returns the company id for the given name; creates the company if it doesn't exist.
func (s *SignUpDBService) GetOrCreateCompany(name string) (int, error) {
	// First try to find it
	var id int
	err := s.DB.QueryRow("SELECT id FROM companies WHERE name = $1", name).Scan(&id)
	if err == nil {
		return id, nil
	}
	if err != sql.ErrNoRows {
		return 0, err
	}

	// Not found — insert and return id
	err = s.DB.QueryRow("INSERT INTO companies (name, created_at) VALUES ($1, NOW()) RETURNING id", name).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

// CreateUser inserts a new user (including company_id if provided).
func (s *SignUpDBService) CreateUser(user model.User) error {
	role := user.Role
	if role == "" {
		role = "customer"
	}

	// Insert company_id as NULL when not provided
	query := `
        INSERT INTO users (
            first_name,
            last_name,
            email,
            password,
            mobile_number,
            role,
            company_id,
            is_superadmin,
            created_at,
            updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, FALSE, NOW(), NOW())
    `

	var companyVal interface{}
	if user.CompanyID != nil {
		companyVal = *user.CompanyID
	} else {
		companyVal = nil
	}

	_, err := s.DB.Exec(query,
		user.FirstName,
		user.LastName,
		user.Email,
		user.Password,
		user.MobileNumber,
		role,
		companyVal,
	)
	if err != nil {
		if err == sql.ErrConnDone {
			return ErrDBUnavailable
		}
	}
	return err
}

// IsCompanyExists checks whether a company with the given id exists.
func (s *SignUpDBService) IsCompanyExists(companyID int) (bool, error) {
	var count int
	err := s.DB.QueryRow("SELECT COUNT(1) FROM companies WHERE id = $1", companyID).Scan(&count)
	if err != nil {
		if err == sql.ErrConnDone {
			return false, ErrDBUnavailable
		}
		return false, err
	}
	return count > 0, nil
}

// CountAdminsForCompany returns how many admin users exist for a given company.
func (s *SignUpDBService) CountAdminsForCompany(companyID int) (int, error) {
	var count int
	err := s.DB.QueryRow("SELECT COUNT(1) FROM users WHERE company_id = $1 AND role = 'admin'", companyID).Scan(&count)
	if err != nil {
		if err == sql.ErrConnDone {
			return 0, ErrDBUnavailable
		}
		return 0, err
	}
	return count, nil
}
