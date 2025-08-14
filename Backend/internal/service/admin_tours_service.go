package service

import (
	"database/sql"
	"fmt"
	"go-backend/internal/model"
	"go-backend/internal/repository"
	"os"
	"strings"
)

type AdminToursService interface {
	GetAllTours() ([]model.Tour, error)
	DeleteTour(id int) error
}

type adminToursService struct {
	repo repository.AdminToursRepository
}

func NewAdminToursService(repo repository.AdminToursRepository) AdminToursService {
	return &adminToursService{repo: repo}
}

func (s *adminToursService) GetAllTours() ([]model.Tour, error) {
	return s.repo.GetAll()
}

func (s *adminToursService) DeleteTour(id int) error {
	imageURL, err := s.repo.Delete(id)
	if err != nil {
		if err == sql.ErrNoRows {
			return fmt.Errorf("tour not found")
		}
		return err
	}

	// Delete image file from uploads
	if imageURL != "" {
		// imageURL format: http://host:port/uploads/filename
		parts := strings.Split(imageURL, "/uploads/")
		if len(parts) == 2 {
			filename := parts[1]
			os.Remove("uploads/" + filename) // ignore error if file doesn't exist
		}
	}
	return nil
}
