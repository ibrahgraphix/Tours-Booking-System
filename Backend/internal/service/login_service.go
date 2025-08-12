package service

import (
	"errors"
	"go-backend/internal/model"
	"go-backend/internal/repository"
	"go-backend/internal/util"
)

var (
    ErrAuthenticationFailed = errors.New("authentication failed") // email not found
    ErrPasswordIncorrect    = errors.New("password incorrect")    // password wrong
)

type LoginService struct {
    DBService *repository.DBService
}

// Login checks the user’s email and password
func (s *LoginService) Login(email, password string) (*model.User, error) {
    user, err := s.DBService.GetUserByEmail(email)
    if err != nil {
        if err == repository.ErrUserNotFound {
            return nil, ErrAuthenticationFailed
        }
        return nil, err
    }

    // Verify password using bcrypt
    if err := util.VerifyPassword(user.Password, password); err != nil {
        return nil, ErrPasswordIncorrect
    }

    return user, nil
}
