package service

import (
	"errors"
	"go-backend/internal/model"
	"go-backend/internal/repository"
	"go-backend/internal/util"
)

type SignUpService struct {
	DB *repository.SignUpDBService
}

func (s *SignUpService) RegisterUser(req model.SignUpRequest) error {
	if req.FirstName == "" || req.LastName == "" || req.Email == "" || req.Password == "" || req.MobileNumber == "" {
		return errors.New("all fields are required")
	}

	if !util.IsValidEmail(req.Email) {
		return errors.New("invalid email format")
	}

	exists, err := s.DB.IsEmailExists(req.Email)
	if err != nil {
		return err
	}
	if exists {
		return repository.ErrEmailAlreadyExists
	}

	hashedPassword, err := util.HashPassword(req.Password)
	if err != nil {
		return err
	}

	role := "customer" // default role
	// keep any existing logic you had for special admin emails removed (we rely on superadmin management)
	// if you have some legacy logic you can keep it, but it's safer to assign admin via SuperAdmin UI.

	user := model.User{
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		Email:        req.Email,
		Password:     hashedPassword,
		MobileNumber: req.MobileNumber,
		Role:         role,
	}

	// If frontend passed an existing company_id, use it
	if req.CompanyID != nil {
		user.CompanyID = req.CompanyID
	} else if req.CompanyName != "" {
		// Create company if not exists and get id
		companyID, err := s.DB.GetOrCreateCompany(req.CompanyName)
		if err != nil {
			return err
		}
		user.CompanyID = &companyID
	}

	return s.DB.CreateUser(user)
}
