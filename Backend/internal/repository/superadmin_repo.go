package repository

import (
	"database/sql"
	"go-backend/internal/model"
	"time"
)

type SuperAdminUserRepo struct {
	DB *sql.DB
}

func (r *SuperAdminUserRepo) ListUsers() ([]model.User, error) {
	rows, err := r.DB.Query(`SELECT id, first_name, last_name, email, mobile_number, role, company_id, is_superadmin, created_at, updated_at FROM users ORDER BY id DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []model.User
	for rows.Next() {
		var u model.User
		var companyNull sql.NullInt64
		if err := rows.Scan(
			&u.ID, &u.FirstName, &u.LastName, &u.Email, &u.MobileNumber,
			&u.Role, &companyNull, &u.IsSuperAdmin, &u.CreatedAt, &u.UpdatedAt,
		); err != nil {
			return nil, err
		}
		if companyNull.Valid {
			v := int(companyNull.Int64)
			u.CompanyID = &v
		} else {
			u.CompanyID = nil
		}
		// optional: ensure createdAt/updatedAt
		if u.CreatedAt.IsZero() {
			u.CreatedAt = time.Now()
		}
		if u.UpdatedAt.IsZero() {
			u.UpdatedAt = u.CreatedAt
		}
		users = append(users, u)
	}
	return users, rows.Err()
}

func (r *SuperAdminUserRepo) UpdateUserRoleAndCompany(userID int, role string, companyID int) error {
	_, err := r.DB.Exec(`UPDATE users SET role = $1, company_id = $2, updated_at = NOW() WHERE id = $3`, role, companyID, userID)
	return err
}

func (r *SuperAdminUserRepo) DeleteUser(userID int) error {
	_, err := r.DB.Exec(`DELETE FROM users WHERE id = $1`, userID)
	return err
}
