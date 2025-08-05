© 2025 Tour Booking System by Ibrahim Shelukindo. All rights reserved.
This web application and its contents are the property of Ibrahim Shelukindo. Unauthorized copying, reproduction, or distribution of any part of this project is strictly prohibited without written permission. This project is developed for learning and demonstration purposes.

Tour Booking System is a web-based application designed to help customers explore available tours, make bookings, and complete payments online. It allows tour companies to manage their tours, track bookings, and monitor payment status efficiently. The system includes both a customer interface for browsing and booking tours, and an admin interface for managing tour details, viewing customer bookings, and organizing schedules. This project aims to simplify the tour reservation process, reduce manual work, and improve the overall experience for both customers and tour operators.

Tour-booking-system/
│
├── client/ # React frontend
│
├── server/ # Go backend API
│
├── docker-compose.yml # Optional: Run backend + DB easily
├── README.md
└── .gitignore

Client/
├── public/
│ └── index.html
│
├── src/
│ ├── assets/ # Images, logos
│ ├── components/ # Shared UI components (Navbar, Button, etc.)
│   ├── Sidebar/
│   ├── Topbar/
│   └── Footer/
│ ├── pages/
│ │ ├── customer/
│ │ │ ├── HomePage.jsx
│ │ │ ├── TourList.jsx
│ │ │ ├── BookingForm.jsx
│ │ │ ├── MyBookings.jsx
│ │ │ ├── PaymentPage.jsx
│ │ │ └── ContactPage.jsx
│ │ │ └──Login.jsx & SignUp.jsx
│ │ └── admin/
│ │ ├── Dashboard.jsx
│ │ ├── BookingList.jsx
│ │ ├── AddTour.jsx
│ │ ├── PaymentStatus.jsx
│ │ └── CalendarView.jsx
│
│ ├── services/ # Axios service for calling Go APIs
│ │ └── api.js
│
│ ├── App.jsx
│ ├── index.js
│ └── router.jsx # React Router setup
│
├── package.json

Server/
├── cmd/
│ └── server/
│ └── main.go # Entry point
│
├── config/
│ └── config.go # DB connection, environment variables
│
├── internal/
│ ├── handler/
│ │ ├── booking_handler.go
│ │ ├── tour_handler.go
│ │ ├── payment_handler.go
│ │ └── customer_handler.go
│
│ ├── service/
│ │ ├── booking_service.go
│ │ ├── tour_service.go
│ │ ├── payment_service.go
│ │ └── customer_service.go
│
│ ├── repository/
│ │ ├── booking_repository.go
│ │ ├── tour_repository.go
│ │ ├── payment_repository.go
│ │ └── customer_repository.go
│
│ ├── model/
│ │ ├── booking.go
│ │ ├── customer.go
│ │ ├── tour.go
│ │ └── payment.go
│
│ └── util/
│ ├── response.go # JSON response formatting
│ └── validator.go # Input validation
│
├── router/
│ └── routes.go # All API endpoints registered here
│
├── go.mod
└── go.sum

Database Tables
| Table | Purpose |
| ----------- | ----------------------------------- |
| `customers` | Stores tourist info |
| `tours` | Tour name, description, price, date |
| `bookings` | Links customer + tour |
| `payments` | Payment records for bookings |
| `admins` | (Optional) for admin login |

Sample API Endpoints
| Method | Endpoint | Description |
| ------ | ---------------------- | -------------------- |
| GET | `/api/tours` | List available tours |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings/:id` | View booking details |
| POST | `/api/payments` | Submit payment info |
| GET | `/api/admin/dashboard` | Admin stats summary |

APIs Needed
CUSTOMER APIs
BOOKING APIs
PAYMENT APIs
Login and Sign Up APIs (Numerology)
ADMIN APIs (for managing tours and bookings)
