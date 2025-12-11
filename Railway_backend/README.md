# Ticket Booking System - Backend

**Developed by:** Khushi  
**Education:** B.Tech in Computer Science and Business Systems (CSBS)  
**Institution:** SRM Institute of Science and Technology, NCR Campus

---

A robust Node.js/Express backend for a ticket booking system with PostgreSQL, designed to handle high concurrency and prevent overbooking through advanced transaction management.

## Features
- **Admin Management:** Create shows/trips/slots with automatic seat generation
- **User Operations:** View available shows and seat availability in real-time
- **Concurrency Control:** Race-condition-free booking using PostgreSQL transactions and row-level locks (`FOR UPDATE`)
- **Booking Lifecycle:** PENDING → CONFIRMED/FAILED status management
- **Auto-Expiry:** Automatic expiry of PENDING bookings after 2 minutes (bonus feature)
- **Scalable Architecture:** Designed with production-grade patterns

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Key Libraries:** pg (node-postgres), dotenv, nodemon

## Architecture Highlights
- **Transaction Management:** ACID-compliant operations prevent double-booking
- **Row-Level Locking:** `SELECT ... FOR UPDATE` ensures seat atomicity
- **Modular Structure:** Separation of concerns (routes → controllers → models)
- **Error Handling:** Comprehensive validation and user-friendly error messages

---

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Railway_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/ticket_booking_db
   PORT=5000
   ```

4. **Initialize the database**
   ```bash
   node scripts/initDb.js
   ```
   
   This creates the following tables:
   - `shows` - Stores show/trip/slot information
   - `bookings` - Stores booking records
   - `seats` - Stores individual seat status per show

5. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Server will run on `http://localhost:5000`

---

## API Endpoints

### Health Check
- **GET** `/` - Verify API is running

### Admin APIs

#### Create Show/Trip/Slot
- **POST** `/api/shows`
- **Request Body:**
  ```json
  {
    "name": "Evening Express",
    "start_time": "2025-12-12T18:00:00.000Z",
    "total_seats": 40
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "id": 1,
    "name": "Evening Express",
    "start_time": "2025-12-12T18:00:00.000Z",
    "total_seats": 40
  }
  ```

#### List All Shows
- **GET** `/api/shows`
- **Response:** `200 OK`
  ```json
  [
    {
      "id": 1,
      "name": "Evening Express",
      "start_time": "2025-12-12T18:00:00.000Z",
      "total_seats": 40,
      "created_at": "2025-12-11T10:00:00.000Z"
    }
  ]
  ```

### User/Booking APIs

#### List Available Seats for a Show
- **GET** `/api/bookings/seats/:showId`
- **Response:** `200 OK`
  ```json
  [
    {
      "id": 1,
      "show_id": 1,
      "seat_number": 1,
      "booked": false,
      "booking_id": null
    },
    {
      "id": 2,
      "show_id": 1,
      "seat_number": 2,
      "booked": true,
      "booking_id": 5
    }
  ]
  ```

#### Create a Booking
- **POST** `/api/bookings`
- **Request Body:**
  ```json
  {
    "show_id": 1,
    "user_email": "khushi@example.com",
    "seat_numbers": [5, 6]
  }
  ```
- **Success Response:** `201 Created`
  ```json
  {
    "id": 1,
    "status": "CONFIRMED",
    "seat_numbers": [5, 6]
  }
  ```
- **Conflict Response:** `409 Conflict`
  ```json
  {
    "id": 2,
    "status": "FAILED",
    "reason": "Some seats already booked",
    "conflictSeats": [5, 6]
  }
  ```

#### Get Booking Details
- **GET** `/api/bookings/:id`
- **Response:** `200 OK`
  ```json
  {
    "id": 1,
    "show_id": 1,
    "user_email": "khushi@example.com",
    "seat_numbers": [5, 6],
    "status": "CONFIRMED",
    "created_at": "2025-12-11T10:30:00.000Z"
  }
  ```

---

## Concurrency Handling

### Problem Statement
When multiple users attempt to book the same seats simultaneously, without proper concurrency control, both bookings might succeed, leading to overbooking (race condition).

### Solution Implemented
1. **Database Transactions:** All booking operations wrapped in BEGIN...COMMIT blocks
2. **Row-Level Locks:** `SELECT ... FOR UPDATE` locks specific seat rows during transaction
3. **Atomic Operations:** Seat availability check and update happen atomically
4. **Status Management:** Clear PENDING → CONFIRMED/FAILED lifecycle

### Testing Concurrency

Run these commands in **two separate PowerShell terminals simultaneously** to test race condition handling:

**Terminal 1:**
```powershell
$body = @{
  show_id = 1
  user_email = "user1@example.com"
  seat_numbers = @(10,11)
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/bookings" -Method Post -ContentType "application/json" -Body $body
```

**Terminal 2:**
```powershell
$body = @{
  show_id = 1
  user_email = "user2@example.com"
  seat_numbers = @(10,11)
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/bookings" -Method Post -ContentType "application/json" -Body $body
```

**Expected Result:**
- One booking returns `201 Created` with status `CONFIRMED`
- The other returns `409 Conflict` with status `FAILED` and `conflictSeats` listed

---

## Documentation

### API Documentation
- **Postman Collection:** `docs/postman/TicketBooking.postman_collection.json`
  - Import into Postman for ready-to-use API testing
- **Swagger/OpenAPI Spec:** `docs/swagger/openapi.yaml`
  - View in Swagger Editor for interactive documentation

---

## Project Structure

```
Railway_backend/
├── config/
│   └── db.js                    # PostgreSQL connection pool
├── controllers/
│   ├── showController.js        # Show/trip business logic
│   └── bookingController.js     # Booking business logic
├── models/
│   ├── show.js                  # Show database operations
│   └── booking.js               # Booking database operations with transactions
├── routes/
│   ├── showRoutes.js            # Show API route definitions
│   └── bookingRoutes.js         # Booking API route definitions
├── jobs/
│   └── expirePending.js         # Background job for auto-expiry
├── scripts/
│   └── initDb.js                # Database schema initialization
├── docs/
│   ├── postman/                 # Postman collection
│   └── swagger/                 # OpenAPI specification
├── .env                         # Environment variables (not in git)
├── .gitignore
├── index.js                     # Application entry point
├── package.json
└── README.md
```

---

## Database Schema

### `shows` Table
```sql
CREATE TABLE shows (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  total_seats INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `seats` Table
```sql
CREATE TABLE seats (
  id SERIAL PRIMARY KEY,
  show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
  seat_number INTEGER NOT NULL,
  booking_id INTEGER REFERENCES bookings(id),
  booked BOOLEAN DEFAULT FALSE,
  UNIQUE (show_id, seat_number)
);
```

### `bookings` Table
```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  show_id INTEGER REFERENCES shows(id) ON DELETE CASCADE,
  user_email VARCHAR(255) NOT NULL,
  seat_numbers INTEGER[] NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Relationships
- One show has many seats (1:N)
- One booking can reserve multiple seats (stored as array)
- Each seat can belong to zero or one booking

---

## Scalability Considerations

### Current Implementation
- Transaction-based concurrency control
- Connection pooling with `pg.Pool`
- Modular architecture for easy maintenance

### Production Scaling Strategies

1. **Database Optimization**
   - Indexing on `show_id`, `booking_id`, `seat_number`
   - Read replicas for GET requests
   - Write master for POST/UPDATE operations
   - Database sharding by `show_id` or geographical region

2. **Caching Layer**
   - Redis for show listings and seat availability
   - Cache invalidation on booking confirmation
   - TTL-based expiry for stale data prevention

3. **Load Balancing**
   - Horizontal scaling with multiple Node.js instances
   - Nginx/HAProxy for load distribution
   - Sticky sessions not required (stateless API)

4. **Message Queue**
   - RabbitMQ/Kafka for booking request queuing
   - Decouple booking requests from processing
   - Handle burst traffic gracefully

5. **Monitoring & Observability**
   - Application Performance Monitoring (APM)
   - Database query performance tracking
   - Error logging and alerting

---

## Deployment Checklist

### Environment Variables Required
```env
DATABASE_URL=<production-postgres-url>
PORT=5000
NODE_ENV=production
```

### Pre-Deployment Steps
1. Run database migrations: `node scripts/initDb.js`
2. Test all endpoints with Postman collection
3. Verify concurrency handling with load testing
4. Set up SSL for database connections
5. Configure CORS for frontend integration

### Recommended Hosting Platforms
- **Backend:** Railway, Render, Heroku, AWS EC2
- **Database:** Railway Postgres, AWS RDS, Supabase, Neon
- **Alternative:** Docker containerization for any platform

---

## Testing Commands

### Create a Show
```powershell
$body = @{
  name = "Morning Special"
  start_time = "2025-12-13T09:00:00.000Z"
  total_seats = 50
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/shows" -Method Post -ContentType "application/json" -Body $body
```

### List Shows
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/shows" -Method Get
```

### View Seats
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/bookings/seats/1" -Method Get
```

### Create Booking
```powershell
$body = @{
  show_id = 1
  user_email = "khushi@srm.edu"
  seat_numbers = @(15,16)
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/bookings" -Method Post -ContentType "application/json" -Body $body
```

---

## Known Limitations
- No authentication/authorization (can be added with JWT)
- Basic email validation (can integrate email verification)
- Expiry job runs in-process (use external scheduler in production)

## Future Enhancements
- Payment gateway integration
- Real-time seat updates via WebSockets
- Email notifications for booking confirmation
- Admin dashboard for analytics
- Rate limiting and API throttling

---

## License
MIT

## Author
**Khushi**  
B.Tech Computer Science and Business Systems  
SRM Institute of Science and Technology, NCR Campus  
📧 Contact: [Your Email]  
🔗 GitHub: [Your GitHub Profile]

---

## Acknowledgments
Built as part of the Modex Assessment to demonstrate:
- Clean code architecture
- Production-grade concurrency handling
- Scalable system design principles
- Comprehensive API documentation 