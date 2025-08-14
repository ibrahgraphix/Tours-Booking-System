package repository

import (
	"database/sql"
	"go-backend/internal/model"
)

type AdminToursRepository interface {
	GetAll() ([]model.Tour, error)
	Delete(id int) (string, error) // returns image URL for deletion
}

type adminToursRepository struct {
	DB *sql.DB
}

func NewAdminToursRepository(db *sql.DB) AdminToursRepository {
	return &adminToursRepository{DB: db}
}

func (r *adminToursRepository) GetAll() ([]model.Tour, error) {
	query := `SELECT id, name, description, date, price, image_url FROM tours ORDER BY date`
	rows, err := r.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tours []model.Tour
	for rows.Next() {
		var t model.Tour
		if err := rows.Scan(&t.ID, &t.Name, &t.Description, &t.Date, &t.Price, &t.ImageURL); err != nil {
			return nil, err
		}
		tours = append(tours, t)
	}
	return tours, nil
}

func (r *adminToursRepository) Delete(id int) (string, error) {
	var imageURL string
	err := r.DB.QueryRow(`SELECT image_url FROM tours WHERE id = $1`, id).Scan(&imageURL)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", sql.ErrNoRows
		}
		return "", err
	}

	res, err := r.DB.Exec(`DELETE FROM tours WHERE id = $1`, id)
	if err != nil {
		return "", err
	}
	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		return "", sql.ErrNoRows
	}
	return imageURL, nil
}
