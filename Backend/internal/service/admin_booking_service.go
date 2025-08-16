package service

import (
	"database/sql"
	"errors"
	"strings"

	"go-backend/internal/model"
	"go-backend/internal/repository"
)

type AdminBookingService interface {
	GetAll() ([]model.AdminBooking, error)
	Update(id int, status *string, numberOfPeople *int) error
	Delete(id int) error
}

type adminBookingService struct {
	repo repository.AdminBookingRepository
}

func NewAdminBookingService(repo repository.AdminBookingRepository) AdminBookingService {
	return &adminBookingService{repo: repo}
}

func (s *adminBookingService) GetAll() ([]model.AdminBooking, error) {
	return s.repo.GetAll()
}

func (s *adminBookingService) Update(id int, status *string, numberOfPeople *int) error {
	// Fetch existing booking to check current status
	bookingList, err := s.repo.GetAll()
	if err != nil {
		return err
	}

	var existingBooking *model.AdminBooking
	for _, b := range bookingList {
		if b.ID == id {
			existingBooking = &b
			break
		}
	}

	if existingBooking == nil {
		return errors.New("booking not found")
	}

	// Admin cannot update cancelled bookings
	if existingBooking.Status == "cancelled" && status != nil {
		return errors.New("cannot update a cancelled booking")
	}

	// Validate status if provided
	if status != nil {
		sv := strings.ToLower(strings.TrimSpace(*status))
		switch sv {
		case "pending", "confirmed", "paid", "completed":
			*status = sv
		default:
			return errors.New("invalid status: must be pending, confirmed, paid, or completed")
		}
	}

	// Validate number of people
	if numberOfPeople != nil {
		if *numberOfPeople <= 0 {
			return errors.New("number_of_people must be greater than 0")
		}
	}

	err = s.repo.Update(id, status, numberOfPeople)
	if err == sql.ErrNoRows {
		return errors.New("booking not found")
	}
	return err
}

func (s *adminBookingService) Delete(id int) error {
	err := s.repo.Delete(id)
	if err == sql.ErrNoRows {
		return errors.New("booking not found")
	}
	return err
}
