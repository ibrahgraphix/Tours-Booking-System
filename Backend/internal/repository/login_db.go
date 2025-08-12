package repository

import (
	"database/sql"
	"errors"
	"go-backend/internal/model"
)

var (
	ErrUserNotFound = errors.New("user not found")
)

type DBService struct {
	DB *sql.DB
}

func (s *DBService) GetUserByEmail(email string) (*model.User, error) {
	var user model.User
	query := `SELECT id, first_name, last_name, email, password, mobile_number, role, created_at, updated_at 
              FROM users WHERE email = $1`
	err := s.DB.QueryRow(query, email).Scan(
		&user.ID,
		&user.FirstName,
		&user.LastName,
		&user.Email,
		&user.Password,
		&user.MobileNumber,
		&user.Role,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrUserNotFound
		}
		return nil, err
	}
	return &user, nil
}
