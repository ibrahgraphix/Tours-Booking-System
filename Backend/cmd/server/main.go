package main

import (
	"database/sql"
	"fmt"
	"go-backend/internal/handler"
	"go-backend/internal/middleware"
	"go-backend/internal/repository"
	"go-backend/internal/service"
	"log"
	"time"

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
	middleware.SetDB(dbService)
	loginService := &service.LoginService{DBService: dbService}
	loginHandler := &handler.LoginHandler{LoginService: loginService}

	signUpRepo := &repository.SignUpDBService{DB: db}
	signUpService := &service.SignUpService{DB: signUpRepo} // ✅ fixed field name
	signUpHandler := &handler.SignUpHandler{SignUpService: signUpService}

	toursRepo := repository.NewToursRepository(db)
	toursService := service.NewToursService(toursRepo)
	toursHandler := handler.NewToursHandler(toursService)

	saRepo := &repository.SuperAdminUserRepo{DB: db}
	coRepo := &repository.CompanyRepo{DB: db}

	saSvc := &service.SuperAdminUserService{
		UserRepo:    saRepo,
		CompanyRepo: coRepo,
	}
	saHandler := &handler.SuperAdminUserHandler{Svc: saSvc}
	companyHandler := &handler.CompanyHandler{Repo: coRepo}

	// ===== New Booking service and handler =====
	bookingsRepo := repository.NewBookingsRepository(db)
	bookingsService := service.NewBookingsService(bookingsRepo)
	bookingsHandler := handler.NewBookingsHandler(bookingsService)

	// ===== Admin Bookings wiring =====
	adminBookingRepo := repository.NewAdminBookingRepository(db)
	adminBookingService := service.NewAdminBookingService(adminBookingRepo)
	adminBookingHandler := handler.NewAdminBookingHandler(adminBookingService)

	adminToursRepo := repository.NewAdminToursRepository(db)
	adminToursService := service.NewAdminToursService(adminToursRepo)
	adminToursHandler := handler.NewAdminToursHandler(adminToursService)

	// ===== Admin Payments wiring =====
	adminPaymentRepo := repository.NewAdminPaymentRepository(db)
	adminPaymentService := service.NewAdminPaymentService(adminPaymentRepo)
	adminPaymentHandler := handler.NewAdminPaymentHandler(adminPaymentService)

	// ===== Router setup =====
	router := gin.Default()

	// ✅ Replaced cors.Default() with explicit config that allows X-User-Email
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Vite dev origin
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-User-Email"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// public routes:
	router.GET("/api/companies", companyHandler.ListCompanies)

	// super-admin only:
	sa := router.Group("/api/superadmin")
	sa.Use(middleware.SuperAdminOnly()) // ✅ fixed middleware usage
	{
		sa.GET("/users", saHandler.ListUsers)
		sa.PUT("/users/:id/role", saHandler.UpdateUserRole)
		sa.DELETE("/users/:id", saHandler.DeleteUser)
	}

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
	router.POST("/api/bookings", bookingsHandler.CreateBooking)               // BookingForm submit
	router.GET("/api/bookings/:email", bookingsHandler.GetBookingsByUser)     // MyBookings list
	router.PATCH("/api/bookings/:id/cancel", bookingsHandler.CancelBooking)

	// ===== Admin Bookings Routes =====
	router.GET("/api/admin/bookings", adminBookingHandler.GetAll)                  // View all bookings
	router.DELETE("/api/admin/bookings/:id", adminBookingHandler.Delete)           // Delete booking
	router.GET("/api/admin/bookings/export", adminBookingHandler.Export)
	router.PATCH("/api/admin/bookings/:id", adminBookingHandler.Patch)             // Update full booking
	router.PUT("/api/admin/bookings/:id/status", adminBookingHandler.UpdateStatus) // Update status only

	// ===== Admin Tours Routes =====
	router.GET("/api/admin/my-tours", adminToursHandler.GetAll)
	router.DELETE("/api/admin/my-tours/:id", adminToursHandler.Delete)
	router.GET("/api/admin/my-tours/export", adminToursHandler.Export)

	// ===== Admin Payments Routes =====
	paymentRoutes := router.Group("/api/payments")
	{
		paymentRoutes.GET("", adminPaymentHandler.GetAll)            // fetch all payments
		paymentRoutes.POST("", adminPaymentHandler.Create)           // create new payment
		paymentRoutes.PUT("/:id/update", adminPaymentHandler.Update) // update existing payment
		paymentRoutes.PUT("/:id/verify", adminPaymentHandler.Verify) // verify manual payment
		paymentRoutes.DELETE("/:id", adminPaymentHandler.Delete)     // delete payment
		paymentRoutes.GET("/export", adminPaymentHandler.Export)     // export to Excel
	}

	fmt.Println("All APIs running on :3000")
	if err := router.Run(":3000"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
