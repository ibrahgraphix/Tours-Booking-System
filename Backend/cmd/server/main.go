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
	db, err := sql.Open("postgres", "host=localhost user=postgres password=numerology dbname=ToursDB sslmode=disable")
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal("Database ping failed:", err)
	}

	// ===== Existing services and handlers =====
	dbService := &repository.DBService{DB: db}
	loginService := &service.LoginService{DBService: dbService}
	loginHandler := &handler.LoginHandler{LoginService: loginService}

	signUpRepo := &repository.SignUpDBService{DB: db}
	signUpService := &service.SignUpService{DB: signUpRepo}
	signUpHandler := &handler.SignUpHandler{SignUpService: signUpService}

	toursRepo := repository.NewToursRepository(db)
	toursService := service.NewToursService(toursRepo)
	toursHandler := handler.NewToursHandler(toursService)

	// ===== New Booking service and handler =====
	bookingsRepo := repository.NewBookingsRepository(db)
	bookingsService := service.NewBookingsService(bookingsRepo)
	bookingsHandler := handler.NewBookingsHandler(bookingsService)

	// ===== Router setup =====
	router := gin.Default()
	router.Use(cors.Default())

	// Serve static files for uploaded images
	router.Static("/uploads", "./uploads")

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	// ===== Auth Routes =====
	router.POST("/login", loginHandler.Login)
	router.POST("/signup", signUpHandler.SignUp)

	// ===== Tours Routes =====
	router.POST("/api/tours", toursHandler.CreateTour)
	router.GET("/api/tours", toursHandler.GetTours)

	// ===== Bookings Routes =====
	router.POST("/api/bookings", bookingsHandler.CreateBooking)             // BookingForm submit
	router.GET("/api/bookings/:email", bookingsHandler.GetBookingsByUser)  // MyBookings list
	router.PATCH("/api/bookings/:id/cancel", bookingsHandler.CancelBooking)

	// ===== Admin Bookings wiring =====
    adminBookingRepo := repository.NewAdminBookingRepository(db)
    adminBookingService := service.NewAdminBookingService(adminBookingRepo)
    adminBookingHandler := handler.NewAdminBookingHandler(adminBookingService)
	adminToursRepo := repository.NewAdminToursRepository(db)
    adminToursService := service.NewAdminToursService(adminToursRepo)
    adminToursHandler := handler.NewAdminToursHandler(adminToursService)

// ===== Admin Bookings Routes =====
    router.GET("/api/admin/bookings", adminBookingHandler.GetAll)       // View all bookings
    router.DELETE("/api/admin/bookings/:id", adminBookingHandler.Delete) // Delete booking
	router.GET("/api/admin/bookings/export", adminBookingHandler.Export)
	router.PATCH("/api/admin/bookings/:id", adminBookingHandler.Patch)  // Update full booking
    router.PUT("/api/admin/bookings/:id/status", adminBookingHandler.UpdateStatus) // Update status only
	router.GET("/api/admin/my-tours", adminToursHandler.GetAll)
    router.DELETE("/api/admin/my-tours/:id", adminToursHandler.Delete)
    router.GET("/api/admin/my-tours/export", adminToursHandler.Export)

	


	fmt.Println("All APIs running on :3000")
	if err := router.Run(":3000"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
