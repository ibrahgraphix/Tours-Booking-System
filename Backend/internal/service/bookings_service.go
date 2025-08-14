package service

import (
	"errors"
	"strings"

	"go-backend/internal/model"
	"go-backend/internal/repository"
)

type BookingsService interface {
	CreateBooking(booking *model.Booking) error
	GetBookingsByEmail(email string) ([]model.BookingSummary, error)
	CancelBooking(id string) error
}

type bookingsService struct {
	repo repository.BookingsRepository
}

func NewBookingsService(r repository.BookingsRepository) BookingsService {
	return &bookingsService{repo: r}
}

func (s *bookingsService) CreateBooking(b *model.Booking) error {
	if b.TourID <= 0 {
		return errors.New("tour_id is required")
	}
	if strings.TrimSpace(b.FullName) == "" {
		return errors.New("full_name is required")
	}
	if strings.TrimSpace(b.Email) == "" {
		return errors.New("email is required")
	}
	if b.NumberOfPeople <= 0 {
		return errors.New("number_of_people must be > 0")
	}
	if b.Status == "" {
		b.Status = "unpaid"
	}
	return s.repo.CreateBooking(b)
}

func (s *bookingsService) GetBookingsByEmail(email string) ([]model.BookingSummary, error) {
	if strings.TrimSpace(email) == "" {
		return nil, errors.New("email is required")
	}
	return s.repo.GetBookingsByEmail(email)
}

func (s *bookingsService) CancelBooking(id string) error {
	if strings.TrimSpace(id) == "" {
		return errors.New("booking id is required")
	}
	return s.repo.CancelBooking(id)
}
