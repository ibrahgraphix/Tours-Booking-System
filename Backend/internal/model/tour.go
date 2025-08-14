package model

import "time"

type Tour struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Date        time.Time `json:"date"`
	Price       float64   `json:"price"`
	ImageURL    string    `json:"image_url"`
}
