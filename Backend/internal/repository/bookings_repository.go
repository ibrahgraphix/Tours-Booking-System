package repository

import (
	"database/sql"
	"go-backend/internal/model"
)

type BookingsRepository interface {
	CreateBooking(booking *model.Booking) error
	GetBookingsByEmail(email string) ([]model.BookingSummary, error)
	CancelBooking(id string) error
}

type bookingsRepository struct {
	db *sql.DB
}

func NewBookingsRepository(db *sql.DB) BookingsRepository {
	return &bookingsRepository{db: db}
}

func (r *bookingsRepository) CreateBooking(booking *model.Booking) error {
	query := `
		INSERT INTO bookings (tour_id, full_name, email, number_of_people, status)
		VALUES ($1, $2, $3, $4, COALESCE($5, 'unpaid'))
		RETURNING id, created_at, status
	`
	return r.db.QueryRow(query,
		booking.TourID,
		booking.FullName,
		booking.Email,
		booking.NumberOfPeople,
		booking.Status,
	).Scan(&booking.ID, &booking.CreatedAt, &booking.Status)
}

func (r *bookingsRepository) GetBookingsByEmail(email string) ([]model.BookingSummary, error) {
	query := `
		SELECT b.id, t.name AS tour_name, t.date, b.number_of_people, b.status
		FROM bookings b
		JOIN tours t ON t.id = b.tour_id
		WHERE b.email = $1
		ORDER BY b.created_at DESC
	`
	rows, err := r.db.Query(query, email)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var bookings []model.BookingSummary
	for rows.Next() {
		var bk model.BookingSummary
		if err := rows.Scan(&bk.ID, &bk.TourName, &bk.Date, &bk.NumberOfPeople, &bk.Status); err != nil {
			return nil, err
		}
		bookings = append(bookings, bk)
	}

	return bookings, nil
}

func (r *bookingsRepository) CancelBooking(id string) error {
	query := `UPDATE bookings SET status = 'cancelled' WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}
