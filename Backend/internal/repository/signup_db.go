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

func (s *SignUpDBService) CreateUser(user model.User) error {
	role := user.Role
	if role == "" {
		role = "customer"
	}
	query := `
        INSERT INTO users (
            first_name,
            last_name,
            email,
            password,
            mobile_number,
            role,
            created_at,
            updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    `
	_, err := s.DB.Exec(query,
		user.FirstName,
		user.LastName,
		user.Email,
		user.Password,
		user.MobileNumber,
		role,
	)
	if err != nil {
		if err == sql.ErrConnDone {
			return ErrDBUnavailable
		}
	}
	return err
}
