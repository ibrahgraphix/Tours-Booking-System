package repository

import (
	"database/sql"
	"fmt"
	"go-backend/internal/model"
	"strconv"
	"time"

	"github.com/xuri/excelize/v2"
)

type AdminPaymentRepository interface {
	GetAll() ([]model.Payment, error)
	GetPaymentIDByBooking(bookingID int) (int, error)
	VerifyPayment(id int) error
	UpdatePayment(id int, amount float64, method string) error
	CreatePayment(bookingID int, amount float64, method string) (int, error)
	DeletePayment(id int) error
	ExportPayments() (*excelize.File, error)
}

type adminPaymentRepo struct {
	DB *sql.DB
}

func NewAdminPaymentRepository(db *sql.DB) AdminPaymentRepository {
	return &adminPaymentRepo{DB: db}
}

func (r *adminPaymentRepo) GetAll() ([]model.Payment, error) {
	query := `
	SELECT 
		b.id AS booking_id,
		b.full_name AS customer_name,
		t.name AS tour_name,
		COALESCE(p.id, 0) AS id,
		COALESCE(p.amount, 0) AS amount,
		COALESCE(p.method, '') AS method,
		CASE 
		  WHEN p.id IS NOT NULL THEN COALESCE(p.status, 'paid') 
		  WHEN b.status = 'paid' THEN 'paid' 
		  ELSE 'unpaid' 
		END AS status,
		COALESCE(p.verified, false) AS verified,
		COALESCE(p.created_at, b.created_at) AS date
	FROM bookings b
	INNER JOIN tours t ON t.id = b.tour_id
	LEFT JOIN payments p ON p.booking_id = b.id
	ORDER BY date DESC
	`
	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var payments []model.Payment
	for rows.Next() {
		var p model.Payment
		if err := rows.Scan(
			&p.BookingID, &p.CustomerName, &p.TourName,
			&p.ID, &p.Amount, &p.Method, &p.Status, &p.Verified, &p.Date,
		); err != nil {
			return nil, err
		}
		payments = append(payments, p)
	}
	return payments, nil
}

func (r *adminPaymentRepo) GetPaymentIDByBooking(bookingID int) (int, error) {
	var id int
	err := r.DB.QueryRow(`SELECT id FROM payments WHERE booking_id=$1 LIMIT 1`, bookingID).Scan(&id)
	if err == sql.ErrNoRows {
		return 0, nil
	}
	return id, err
}

func (r *adminPaymentRepo) VerifyPayment(id int) error {
	res, err := r.DB.Exec(`UPDATE payments SET verified = true, status = 'paid' WHERE id = $1`, id)
	if err != nil {
		return err
	}
	if rows, _ := res.RowsAffected(); rows == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (r *adminPaymentRepo) UpdatePayment(id int, amount float64, method string) error {
	res, err := r.DB.Exec(`UPDATE payments SET amount=$1, method=$2 WHERE id=$3`, amount, method, id)
	if err != nil {
		return err
	}
	if rows, _ := res.RowsAffected(); rows == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (r *adminPaymentRepo) CreatePayment(bookingID int, amount float64, method string) (int, error) {
	// Fetch customer_name and tour_name from bookings + tours to satisfy NOT NULL constraints
	var customerName, tourName string
	err := r.DB.QueryRow(`
		SELECT b.full_name, t.name
		FROM bookings b
		INNER JOIN tours t ON t.id = b.tour_id
		WHERE b.id = $1
		LIMIT 1
	`, bookingID).Scan(&customerName, &tourName)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, fmt.Errorf("booking with id %d not found", bookingID)
		}
		return 0, err
	}

	now := time.Now()
	status := "paid"
	var id int
	err = r.DB.QueryRow(
		`INSERT INTO payments (booking_id, amount, method, status, verified, created_at, customer_name, tour_name)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
		bookingID, amount, method, status, false, now, customerName, tourName,
	).Scan(&id)
	return id, err
}

func (r *adminPaymentRepo) DeletePayment(id int) error {
	res, err := r.DB.Exec(`DELETE FROM payments WHERE id=$1`, id)
	if err != nil {
		return err
	}
	if rows, _ := res.RowsAffected(); rows == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (r *adminPaymentRepo) ExportPayments() (*excelize.File, error) {
	payments, err := r.GetAll()
	if err != nil {
		return nil, err
	}

	f := excelize.NewFile()
	sheet := "Payments"
	f.NewSheet(sheet)

	headers := []string{"Booking ID", "Customer", "Tour", "Payment ID", "Amount", "Method", "Status", "Verified", "Date"}
	for i, h := range headers {
		cell, _ := excelize.CoordinatesToCellName(i+1, 1)
		f.SetCellValue(sheet, cell, h)
	}

	for i, p := range payments {
		row := i + 2
		f.SetCellValue(sheet, "A"+strconv.Itoa(row), p.BookingID)
		f.SetCellValue(sheet, "B"+strconv.Itoa(row), p.CustomerName)
		f.SetCellValue(sheet, "C"+strconv.Itoa(row), p.TourName)
		f.SetCellValue(sheet, "D"+strconv.Itoa(row), p.ID)
		f.SetCellValue(sheet, "E"+strconv.Itoa(row), p.Amount)
		f.SetCellValue(sheet, "F"+strconv.Itoa(row), p.Method)
		f.SetCellValue(sheet, "G"+strconv.Itoa(row), p.Status)
		f.SetCellValue(sheet, "H"+strconv.Itoa(row), p.Verified)
		f.SetCellValue(sheet, "I"+strconv.Itoa(row), p.Date.Format("2006-01-02 15:04"))
	}

	return f, nil
}
