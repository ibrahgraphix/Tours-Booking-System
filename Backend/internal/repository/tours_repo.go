package repository

import (
	"database/sql"
	"go-backend/internal/model"
)

type ToursRepository struct {
	DB *sql.DB
}

func NewToursRepository(db *sql.DB) *ToursRepository {
	return &ToursRepository{DB: db}
}

func (r *ToursRepository) CreateTour(tour *model.Tour) error {
	query := `INSERT INTO tours (name, description, date, price, image_url)
	          VALUES ($1, $2, $3, $4, $5) RETURNING id`
	err := r.DB.QueryRow(query,
		tour.Name,
		tour.Description,
		tour.Date,
		tour.Price,
		tour.ImageURL,
	).Scan(&tour.ID)
	return err
}

func (r *ToursRepository) GetAllTours() ([]model.Tour, error) {
	query := `SELECT id, name, description, date, price, image_url FROM tours ORDER BY date`
	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tours []model.Tour
	for rows.Next() {
		var t model.Tour
		err := rows.Scan(&t.ID, &t.Name, &t.Description, &t.Date, &t.Price, &t.ImageURL)
		if err != nil {
			return nil, err
		}
		tours = append(tours, t)
	}

	return tours, nil
}
