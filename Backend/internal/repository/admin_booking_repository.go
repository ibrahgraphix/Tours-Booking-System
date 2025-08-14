package repository

import (
	"database/sql"
	"go-backend/internal/model"
	"strconv"
)

type AdminBookingRepository interface {
	GetAll() ([]model.AdminBooking, error)
	Update(id int, status *string, numberOfPeople *int) error
	Delete(id int) error
}

type adminBookingRepository struct {
	db *sql.DB
}

func NewAdminBookingRepository(db *sql.DB) AdminBookingRepository {
	return &adminBookingRepository{db: db}
}

func (r *adminBookingRepository) GetAll() ([]model.AdminBooking, error) {
	query := `
		SELECT 
			b.id,
			b.full_name,
			b.email,
			t.name AS tour_name,
			t.date,
			b.number_of_people,
			b.status,
			b.created_at
		FROM bookings b
		JOIN tours t ON b.tour_id = t.id
		ORDER BY b.created_at DESC
	`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var bookings []model.AdminBooking
	for rows.Next() {
		var bk model.AdminBooking
		err := rows.Scan(
			&bk.ID,
			&bk.FullName,
			&bk.Email,
			&bk.TourName,
			&bk.Date,
			&bk.NumberOfPeople,
			&bk.Status,
			&bk.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		bookings = append(bookings, bk)
	}
	return bookings, nil
}

func (r *adminBookingRepository) Update(id int, status *string, numberOfPeople *int) error {
	query := `UPDATE bookings SET `
	args := []interface{}{}
	argIndex := 1

	if status != nil {
		query += "status = $" + strconv.Itoa(argIndex)
		args = append(args, *status)
		argIndex++
	}

	if numberOfPeople != nil {
		if len(args) > 0 {
			query += ", "
		}
		query += "number_of_people = $" + strconv.Itoa(argIndex)
		args = append(args, *numberOfPeople)
		argIndex++
	}

	query += " WHERE id = $" + strconv.Itoa(argIndex)
	args = append(args, id)

	res, err := r.db.Exec(query, args...)
	if err != nil {
		return err
	}
	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (r *adminBookingRepository) Delete(id int) error {
	res, err := r.db.Exec(`DELETE FROM bookings WHERE id = $1`, id)
	if err != nil {
		return err
	}
	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		return sql.ErrNoRows
	}
	return nil
}
