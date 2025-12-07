# Flight Server API

A simple Go service for flight booking management.

## Features

- **User & Admin Authentication** - JWT-based authentication with role-based access control
- **CRUD for Airlines** - Manage airline data
- **CRUD for Airline Schedules** - Manage flight schedules
- **Search Airline Tickets** - Search flights by origin, destination, and date
- **Airline Ticket Detail** - View detailed flight information
- **Create Order** - Book flight tickets

## Prerequisites

- Go 1.21 or higher
- SQLite (included with Go SQLite driver)

## Getting Started

### 1. Install dependencies

```bash
cd flight-go
go mod tidy
```

### 2. Run the server

```bash
go run cmd/server/main.go
```

The server will start on `http://localhost:8080`

### 3. Default Admin Credentials

- Email: `admin@flight.com`
- Password: `admin123`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SERVER_PORT` | `8080` | Server port |
| `DATABASE_PATH` | `flight.db` | SQLite database file path |
| `JWT_SECRET` | `your-super-secret-key-change-in-production` | JWT signing secret |
| `ADMIN_EMAIL` | `admin@flight.com` | Default admin email |
| `ADMIN_PASSWORD` | `admin123` | Default admin password |

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Airlines (Public Read)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/airlines` | List airlines (paginated) | No |
| GET | `/api/airlines/all` | List all active airlines | No |
| GET | `/api/airlines/:id` | Get airline by ID | No |
| GET | `/api/airlines/:airline_id/schedules` | Get airline schedules | No |

### Airlines (Admin)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/admin/airlines` | Create airline | Admin |
| PUT | `/api/admin/airlines/:id` | Update airline | Admin |
| DELETE | `/api/admin/airlines/:id` | Delete airline | Admin |

### Airports

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/airports` | List airports (paginated) | No |
| GET | `/api/airports/all` | List all airports | No |
| GET | `/api/airports/search?q=query` | Search airports | No |
| GET | `/api/airports/:id` | Get airport by ID | No |
| GET | `/api/airports/code/:code` | Get airport by code | No |

### Flights / Schedules

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/flights/search` | Search flights | No |
| GET | `/api/flights/:id` | Get flight detail | No |

**Search Parameters:**
- `origin` (required): Origin airport code (e.g., CGK)
- `destination` (required): Destination airport code (e.g., DPS)
- `departure_date` (required): Date in YYYY-MM-DD format
- `cabin_class`: economy, business, or first
- `airlines`: Comma-separated airline IDs
- `page`: Page number
- `page_size`: Items per page

### Schedules (Admin)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/schedules` | List all schedules | Admin |
| POST | `/api/admin/schedules` | Create schedule | Admin |
| GET | `/api/admin/schedules/:id` | Get schedule | Admin |
| PUT | `/api/admin/schedules/:id` | Update schedule | Admin |
| DELETE | `/api/admin/schedules/:id` | Delete schedule | Admin |

### Orders (User)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Create order | User |
| GET | `/api/orders` | List my orders | User |
| GET | `/api/orders/:id` | Get order detail | User |
| POST | `/api/orders/:id/cancel` | Cancel order | User |

### Orders (Admin)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/orders` | List all orders | Admin |
| GET | `/api/admin/orders/:id` | Get order detail | Admin |
| PUT | `/api/admin/orders/:id` | Update order | Admin |

## Example Requests

### Register User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "phone": "+6281234567890"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@flight.com",
    "password": "admin123"
  }'
```

### Search Flights

```bash
curl "http://localhost:8080/api/flights/search?origin=CGK&destination=DPS&departure_date=2024-12-20"
```

### Create Schedule (Admin)

```bash
curl -X POST http://localhost:8080/api/admin/schedules \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "airline_id": "ga",
    "flight_number": "GA123",
    "departure_airport_id": "cgk",
    "departure_terminal": "3",
    "departure_time": "08:00",
    "arrival_airport_id": "dps",
    "arrival_terminal": "D",
    "arrival_time": "10:30",
    "duration": 150,
    "aircraft": "Boeing 737-800",
    "economy_price": 1500000,
    "business_price": 4500000,
    "economy_seats": 150,
    "business_seats": 30,
    "valid_from": "2024-01-01",
    "valid_until": "2024-12-31"
  }'
```

### Create Order

```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "schedule_id": "SCHEDULE_ID",
    "flight_date": "2024-12-20",
    "cabin_class": "economy",
    "contact_name": "John Doe",
    "contact_email": "john@example.com",
    "contact_phone": "+6281234567890",
    "passengers": [
      {
        "title": "Mr",
        "full_name": "John Doe",
        "type": "adult"
      }
    ]
  }'
```

## Project Structure

```
flight-go/
├── cmd/
│   └── server/
│       └── main.go          # Entry point
├── internal/
│   ├── config/
│   │   └── config.go        # Configuration
│   ├── database/
│   │   └── database.go      # Database connection & seeding
│   ├── handlers/
│   │   ├── airline_handler.go
│   │   ├── airport_handler.go
│   │   ├── auth_handler.go
│   │   ├── order_handler.go
│   │   ├── response.go
│   │   └── schedule_handler.go
│   ├── middleware/
│   │   └── auth_middleware.go
│   ├── models/
│   │   └── models.go        # Data models
│   ├── repository/
│   │   ├── airline_repository.go
│   │   ├── airport_repository.go
│   │   ├── order_repository.go
│   │   ├── schedule_repository.go
│   │   └── user_repository.go
│   ├── router/
│   │   └── router.go        # Route definitions
│   └── services/
│       ├── airline_service.go
│       ├── auth_service.go
│       ├── order_service.go
│       └── schedule_service.go
├── go.mod
├── go.sum
└── README.md
```

## License

MIT

