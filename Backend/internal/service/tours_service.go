package service

import (
	"go-backend/internal/model"
	"go-backend/internal/repository"
	"time"
)

type ToursService struct {
	Repo *repository.ToursRepository
}

func NewToursService(repo *repository.ToursRepository) *ToursService {
	return &ToursService{Repo: repo}
}

func (s *ToursService) CreateTour(tour *model.Tour) error {
	// Validate date is not in the past
	if tour.Date.Before(time.Now()) {
		return &ValidationError{"Date cannot be in the past"}
	}
	return s.Repo.CreateTour(tour)
}

func (s *ToursService) GetAllTours() ([]model.Tour, error) {
	return s.Repo.GetAllTours()
}

type ValidationError struct {
	Message string
}

func (v *ValidationError) Error() string {
	return v.Message
}
