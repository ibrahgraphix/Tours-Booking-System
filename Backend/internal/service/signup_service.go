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
	if req.Email == "admin12@gmail.com" {
		role = "admin"
	}

	user := model.User{
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		Email:        req.Email,
		Password:     hashedPassword,
		MobileNumber: req.MobileNumber,
		Role:         role,
	}

	return s.DB.CreateUser(user)
}
