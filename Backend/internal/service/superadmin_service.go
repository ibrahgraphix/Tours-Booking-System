package service

import (
	"errors"
	"go-backend/internal/repository"
)

var (
	ErrInvalidRole = errors.New("invalid role")
)

type SuperAdminUserService struct {
	UserRepo    *repository.SuperAdminUserRepo
	CompanyRepo *repository.CompanyRepo
}

func (s *SuperAdminUserService) ListUsers() (interface{}, error) {
	return s.UserRepo.ListUsers()
}

func (s *SuperAdminUserService) UpdateUserRoleAndCompany(userID int, role string, companyID int) error {
	if role != "admin" && role != "customer" {
		return ErrInvalidRole
	}
	companies, err := s.CompanyRepo.ListCompanies()
	if err != nil {
		return err
	}
	found := false
	for _, c := range companies {
		if c.ID == companyID {
			found = true
			break
		}
	}
	if !found {
		return errors.New("company not found")
	}
	return s.UserRepo.UpdateUserRoleAndCompany(userID, role, companyID)
}

func (s *SuperAdminUserService) DeleteUser(userID int) error {
	return s.UserRepo.DeleteUser(userID)
}
