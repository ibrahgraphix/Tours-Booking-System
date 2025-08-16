package repository

import (
	"database/sql"
)

type Company struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type CompanyRepo struct {
	DB *sql.DB
}

func (r *CompanyRepo) ListCompanies() ([]Company, error) {
	rows, err := r.DB.Query(`SELECT id, name FROM companies ORDER BY name ASC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var res []Company
	for rows.Next() {
		var c Company
		if err := rows.Scan(&c.ID, &c.Name); err != nil {
			return nil, err
		}
		res = append(res, c)
	}
	return res, rows.Err()
}
