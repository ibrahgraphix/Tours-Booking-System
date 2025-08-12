package constants

const (
	// Error Messages
	MsgInvalidRequest        = "Invalid request"
	MsgEmailNotFound         = "Incorrect email/password"
	MsgPasswordIncorrect     = "Incorrect email/password"
	MsgInternalServerError   = "Internal server error"
	MsgServiceUnavailable    = "Service Unavailable"
	MsgEmailAlreadyExists    = "Email already registered"
	MsgInternalServerFailure = "Internal Server Failure"

	// Success Messages
	MsgLoginSuccess = "Login successful"

	// Error Codes
	CodeInvalidCredentials    = 100
	CodePasswordIncorrect     = 101
	CodeInternalError         = 102
	CodeInvalidRequest        = 103
	CodeServiceUnavailable    = 104
	CodeEmailAlreadyExists    = 110
	CodeInternalServerFailure = 111
)
