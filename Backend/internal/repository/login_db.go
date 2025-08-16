package repository

import (
	"database/sql"
	"errors"
	"go-backend/internal/model"
	"time"
)

var (
	ErrUserNotFound = errors.New("user not found")
)

type DBService struct {
	DB *sql.DB
}

func (s *DBService) GetUserByEmail(email string) (*model.User, error) {
	var user model.User
	var companyNull sql.NullInt64

	query := `SELECT id, first_name, last_name, email, password, mobile_number, role, company_id, is_superadmin, created_at, updated_at
              FROM users WHERE email = $1 LIMIT 1`

	err := s.DB.QueryRow(query, email).Scan(
		&user.ID,
		&user.FirstName,
		&user.LastName,
		&user.Email,
		&user.Password,
		&user.MobileNumber,
		&user.Role,
		&companyNull,
		&user.IsSuperAdmin,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	if companyNull.Valid {
		v := int(companyNull.Int64)
		user.CompanyID = &v
	} else {
		user.CompanyID = nil
	}

	// Ensure CreatedAt/UpdatedAt have sensible zero values if DB driver didn't set them.
	// (Optional: depends on your DB)
	if user.CreatedAt.IsZero() {
		user.CreatedAt = time.Now()
	}
	if user.UpdatedAt.IsZero() {
		user.UpdatedAt = user.CreatedAt
	}

	return &user, nil
}
