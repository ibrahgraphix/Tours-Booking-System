package main

import (
	"database/sql"
	"fmt"
	"go-backend/internal/handler"
	"go-backend/internal/repository"
	"go-backend/internal/service"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	// Connect to DB for Login and Sign Up API
	db, err := sql.Open("postgres", "host=localhost user=postgres password=numerology dbname=ToursDB sslmode=disable")
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal("Database ping failed:", err)
	}

	// Login API Wiring
	dbService := &repository.DBService{DB: db}
	loginService := &service.LoginService{DBService: dbService}
	loginHandler := &handler.LoginHandler{LoginService: loginService}

	// Sign Up API Wiring
	signUpRepo := &repository.SignUpDBService{DB: db}
	signUpService := &service.SignUpService{DB: signUpRepo}
	signUpHandler := &handler.SignUpHandler{SignUpService: signUpService}

	// Set up Router
	router := gin.Default()
	router.Use(cors.Default())

	// Health check
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	// Login API
	router.POST("/login", loginHandler.Login)

	// Sign Up API
	router.POST("/signup", signUpHandler.SignUp)

	fmt.Println("All APIs running on :3000")
	if err := router.Run(":3000"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
