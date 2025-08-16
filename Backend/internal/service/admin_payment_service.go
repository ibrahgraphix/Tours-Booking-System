package service

import (
	"go-backend/internal/model"
	"go-backend/internal/repository"

	"github.com/xuri/excelize/v2"
)

type AdminPaymentService interface {
	GetAllPayments() ([]model.Payment, error)
	VerifyPayment(id int) error
	UpdatePayment(id int, amount float64, method string) error
	CreateOrUpdatePayment(bookingID int, amount float64, method string) (int, error)
	DeletePayment(id int) error
	ExportPayments() (*excelize.File, error)
}

type adminPaymentService struct {
	repo repository.AdminPaymentRepository
}

func NewAdminPaymentService(repo repository.AdminPaymentRepository) AdminPaymentService {
	return &adminPaymentService{repo: repo}
}

func (s *adminPaymentService) GetAllPayments() ([]model.Payment, error) {
	return s.repo.GetAll()
}

func (s *adminPaymentService) VerifyPayment(id int) error {
	return s.repo.VerifyPayment(id)
}

func (s *adminPaymentService) UpdatePayment(id int, amount float64, method string) error {
	return s.repo.UpdatePayment(id, amount, method)
}

// CreateOrUpdatePayment prevents duplicates for same booking
func (s *adminPaymentService) CreateOrUpdatePayment(bookingID int, amount float64, method string) (int, error) {
	// check if payment exists for booking
	existingID, _ := s.repo.GetPaymentIDByBooking(bookingID)
	if existingID > 0 {
		// update existing payment
		err := s.repo.UpdatePayment(existingID, amount, method)
		return existingID, err
	}
	// create new payment
	return s.repo.CreatePayment(bookingID, amount, method)
}

func (s *adminPaymentService) DeletePayment(id int) error {
	return s.repo.DeletePayment(id)
}

func (s *adminPaymentService) ExportPayments() (*excelize.File, error) {
	return s.repo.ExportPayments()
}
