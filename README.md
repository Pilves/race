# To-Do List

### <span style="color: green;">1. Bug Fix: Car Availability in Assignment</span>
<ul>
    <li><strong><span style="color: green;">Issue</span></strong>: <span style="color: green;">Currently, cars that are already assigned ("TAKEN") to a race session are still visible in the dropdown for car assignment.</span></li>
    <li><strong><span style="color: green;">Task</span></strong>: <span style="color: green;">Ensure that only unassigned cars are shown in the dropdown collection for driver assignment.</span></li>
    <li><strong><span style="color: green;">Priority</span></strong>: <span style="color: green;">High</span></li>
    <li><strong><span style="color: green;">Status</span></strong>: <span style="color: green;">FIXED</span></li>
</ul>


---

### <span style="color: darkorange;">2. Lap Times Display for Last Session</span>
- **<span style="color: darkorange;">Requirement</span>**: <span style="color: darkorange;">The lap times of the last race session must remain visible until the next race session is ready to start.</span>
- **<span style="color: darkorange;">Subtask</span>**: <span style="color: darkorange;">Analyze and optimize the leaderboard display model.</span>
  - <span style="color: darkorange;">Evaluate whether the current model meets usability needs.</span>
  - <span style="color: darkorange;">Implement improvements if necessary for better visualization and data accessibility.</span>
- **<span style="color: darkorange;">Priority</span>**: <span style="color: darkorange;">High</span>

---

### <span style="color: darkorange;">3. Authorization Middleware</span>
- **<span style="color: darkorange;">Requirement</span>**: <span style="color: darkorange;">Implement authorization logic in `../middleware/authMiddleware`.</span>
- **<span style="color: darkorange;">Admin Routes</span>**:
  - **<span style="color: darkorange;">`/front-desk`</span>** <span style="color: darkorange;">(Persona: Receptionist)</span>
  - **<span style="color: darkorange;">`/race-control`</span>** <span style="color: darkorange;">(Persona: Safety Official)</span>
  - **<span style="color: darkorange;">`/lap-line-tracker`</span>** <span style="color: darkorange;">(Persona: Lap-line Observer)</span>
- **<span style="color: darkorange;">Task</span>**:
  - <span style="color: darkorange;">Secure these routes with an admin password.</span>
  - <span style="color: darkorange;">Ensure unauthorized access is blocked.</span>
- **<span style="color: darkorange;">Priority</span>**: <span style="color: darkorange;">Medium</span>

---

### <span style="color: darkorange;">4. Front-End Components for Interfaces</span>
- **<span style="color: darkorange;">Interfaces</span>**:
  - **<span style="color: darkorange;">Receptionist</span>**: <span style="color: darkorange;">`/front-desk`</span>
  - **<span style="color: darkorange;">Safety Official</span>**: <span style="color: darkorange;">`/race-control`</span>
  - **<span style="color: darkorange;">Lap-line Observer</span>**: <span style="color: darkorange;">`/lap-line-tracker`</span>
- **<span style="color: darkorange;">Task</span>**:
  - <span style="color: darkorange;">Build start components for each interface.</span>
  - <span style="color: darkorange;">Design full-screen button functionality for public displays.</span>
- **<span style="color: darkorange;">Public Displays</span>**:
  - **<span style="color: darkorange;">Leader Board</span>**: <span style="color: darkorange;">`/leader-board`</span> <span style="color: darkorange;">(Persona: Guest)</span>
  - **<span style="color: darkorange;">Next Race</span>**: <span style="color: darkorange;">`/next-race`</span> <span style="color: darkorange;">(Persona: Race Driver)</span>
  - **<span style="color: darkorange;">Race Countdown</span>**: <span style="color: darkorange;">`/race-countdown`</span> <span style="color: darkorange;">(Persona: Race Driver)</span>
  - **<span style="color: darkorange;">Race Flag</span>**: <span style="color: darkorange;">`/race-flags`</span> <span style="color: darkorange;">(Persona: Race Driver)</span>

---

### <span style="color: darkorange;">5. Front-End Integration for Race Mode Changes</span>
- **<span style="color: darkorange;">Requirement</span>**: <span style="color: darkorange;">Synchronize race mode changes with the front-end interface.</span>
- **<span style="color: darkorange;">Task</span>**:
  - <span style="color: darkorange;">Ensure front-end dynamically updates based on race mode changes.</span>
  - <span style="color: darkorange;">Test for seamless transitions between modes such as "Safe", "Danger", and "Finish".</span>
- **<span style="color: darkorange;">Priority</span>**: <span style="color: darkorange;">Medium</span>

---

### <span style="color: darkorange;">6. End Race Button</span>
- **<span style="color: darkorange;">Requirement</span>**: <span style="color: darkorange;">Add an "End Race" button functionality after the session is in "Finish" mode.</span>
- **<span style="color: darkorange;">Desired Process</span>**:
  - <span style="color: darkorange;">Once the race is in "Finish" mode, allow the Safety Official to end the session.</span>
  - <span style="color: darkorange;">Queue up the next session on the Safety Official's interface.</span>
  - <span style="color: darkorange;">Display next session details, including:</span>
    - <span style="color: darkorange;">Drivers to brief.</span>
    - <span style="color: darkorange;">Assigned cars for drivers.</span>
  - <span style="color: darkorange;">Transition race mode to "Danger".</span>
  - <span style="color: darkorange;">Update the "Next Race" screen to display:</span>
    - <span style="color: darkorange;">Current session's drivers.</span>
    - <span style="color: darkorange;">A message instructing drivers to proceed to the paddock.</span>
- **<span style="color: darkorange;">Priority</span>**: <span style="color: darkorange;">High</span>

---

### <span style="color: darkorange;">7. Task: Use Environment Variables for Database Settings</span>
- **<span style="color: darkorange;">Issue</span>**: <span style="color: darkorange;">Database settings are hardcoded in `db.js` class.</span>
- **<span style="color: darkorange;">Task</span>**: <span style="color: darkorange;">Move these values to environment variables.</span>
  - <span style="color: darkorange;">Ensure settings are retrieved from `.env` or `.env.development` files.</span>
- **<span style="color: darkorange;">Priority</span>**: <span style="color: darkorange;">High</span>

#### <span style="color: darkorange;">Current Hardcoded Database Settings (`db.js`)</span>
```javascript
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'beachside_racetrack',
    password: '123',
    port: 5432,
});


Add the following to  .env or .env.development file:
        # Access Keys
RECEPTIONIST_KEY=123456
SAFETY_KEY=123456
OBSERVER_KEY=123456

# Race Configuration
RACE_DURATION_MINUTES=10   # Duration of a race in minutes (override in development)

DB_USER=postgres
DB_PASSWORD=123
DB_HOST=localhost
DB_PORT=5432
DB_NAME=beachside_racetrack

```



# API Controllers Documentation

This README provides an overview of the controllers for managing cars, drivers, laps, and race sessions in a racing application. Each controller serves as an entry point for handling HTTP requests, forwarding them to service layers, and returning responses. Real-time updates are broadcasted using Socket.IO.
# Application Server Overview (index.js)

This module initializes and configures the Express server for the racing application, enabling RESTful API endpoints and real-time WebSocket communication using Socket.IO. It also integrates middleware, routes, and socket event handlers to provide a seamless experience for clients.

---

## **Purpose**

The application server serves as the backbone of the racing system, providing:
1. **RESTful API**: Exposes endpoints for managing cars, drivers, laps, and races.
2. **Real-Time Updates**: Enables real-time communication through WebSockets for live race updates and events.
3. **Middleware Integration**: Ensures standardized request handling, including error management and CORS policies.
4. **Environment-Specific Configurations**: Dynamically adjusts configurations (e.g., race duration) based on the environment.

---

## **Core Components**

### **1. Express Server**
- **Initialization**:  
  Sets up the `Express` server and middleware for JSON parsing, CORS handling, and error handling.
- **API Endpoint Registration**:  
  Registers routes for:
  - Drivers (`/api/drivers`)
  - Races (`/api/races`)
  - Cars (`/api/cars`)
  - Laps (`/api/laps`)

- **Health Check**:  
  Includes a basic endpoint (`/api`) to verify that the server is running.

---

### **2. WebSocket Integration**
- **Socket.IO Setup**:  
  Configures `Socket.IO` for real-time communication with:
  - Cross-Origin Resource Sharing (CORS) policies to allow specific origins.
- **Socket Event Handling**:
  - Registers event handlers for:
    - **Session Events** (`sessionSockets`)
    - **Driver Events** (`driversSockets`)
    - **Car Events** (`carsSockets`)
    - **Leaderboard Updates** (`leaderboardSockets`)
    - **Race Store Events** (`raceStoreSockets`)
  - Handles client connections and disconnections.

- **Real-Time Features**:
  - Updates clients on changes to drivers, cars, races, lap times, and leaderboards.
  - Ensures synchronization of race events across all connected clients.

---

### **3. Middleware**
- **CORS**:  
  Enables cross-origin requests from specific frontend origins (`http://localhost:5173`).
- **Error Handling**:  
  Standardizes error responses using a custom `errorHandler` middleware.

---

### **4. Environment Configuration**
- **Environment Variables**:  
  Reads environment-specific settings from `.env.development` or `.env` files, such as:
  - `NODE_ENV`: Defines the current environment (e.g., `development` or `production`).
  - `RACE_DURATION_MINUTES`: Specifies the duration of a race.
  - `PORT`: Defines the server's listening port.

- **Dynamic Configuration**:
  - Race duration and other settings are adjusted based on the environment.

---

### **5. Modular Route and Socket Integration**
- **Routes**:  
  Modular routing separates domain-specific logic:
  - `driverRoutes`: Handles driver-related endpoints.
  - `raceRoutes`: Manages race sessions.
  - `carRoutes`: Handles car management.
  - `lapRoutes`: Processes lap time data.

- **Sockets**:  
  Modular socket handlers manage WebSocket events for different application domains.

---

### **6. Server Startup**
- **Port Configuration**:  
  The server listens on the port specified by `PORT` or defaults to `8080`.
- **Logging**:  
  Logs environment details and server startup messages.

---

## **Key Benefits**
1. **Scalability**:  
   Modular design allows for easy extension of routes and WebSocket handlers.
2. **Real-Time Communication**:  
   Keeps clients updated with live race events and state changes.
3. **Environment Adaptability**:  
   Dynamically adjusts configurations based on development or production environments.
4. **Error Resilience**:  
   Centralized error handling ensures reliable and user-friendly responses.

---

## **Usage in the Application**
- **Frontend Integration**:  
  The server acts as the backend for the frontend application, providing APIs and real-time updates.
- **Real-Time Features**:  
  Enables real-time race updates, leaderboard changes, and session synchronization.
- **APIs**:  
  Serves as the endpoint for managing race-related entities like cars, drivers, laps, and races.

---

# Overview of Sockets and Routes

This document provides an overview of the socket handlers and routes implemented in the racing application. Sockets enable real-time communication between clients and the server, while routes provide RESTful APIs for interacting with the system.

---

## **Socket Handlers**

### **1. Car Sockets**
Handles real-time updates and interactions for cars in the system.
- **Events**:
  - `requestCars`: Fetches and sends the current list of cars to the client.
  - `addCar`: Adds a new car to the system and updates all clients.
  - `deleteCar`: Deletes a car and updates all clients.
  - `carsUpdated`: Broadcasts the updated car list to all connected clients.

---

### **2. Driver Sockets**
Handles real-time updates and interactions for drivers.
- **Events**:
  - `requestDrivers`: Fetches and sends the current list of drivers to the client.
  - `addDriver`: Adds a new driver and updates all clients.
  - `editDriver`: Updates a driver's details and broadcasts changes.
  - `deleteDriver`: Deletes a driver and updates all clients.
  - `driversUpdated`: Broadcasts the updated driver list to all connected clients.

---

### **3. Lap and Leaderboard Sockets**
Manages real-time lap and leaderboard updates.
- **Events**:
  - `recordLap`: Records a lap time and updates the leaderboard.
  - `leaderboardUpdated`: Broadcasts the updated leaderboard to all clients.
  - `lapTimesUpdated`: Broadcasts updated lap times for a session.
  - `flagUpdated`: Sends updates on race status flags (e.g., "Safe", "Finish").

---

### **4. Race Store Sockets**
Handles real-time updates for race state, using the `RaceStore`.
- **Listeners**:
  - `leaderboard`: Broadcasts leaderboard updates.
  - `raceFlags`: Updates clients on race status flags.
  - `liveRace`: Sends details about the current live race.
  - `lapTimes`: Broadcasts updated lap times.
  - `lastSession`: Notifies clients about the last completed session.

---

### **5. Race Sockets**
Manages real-time interactions for race sessions.
- **Events**:
  - `assignDriverToSession`: Assigns a driver to a session and updates clients.
  - `announceNextRace`: Notifies clients about the next scheduled race session.
  - `addSession`: Adds a new race session and updates all clients.
  - `updateSession`: Updates a session and broadcasts changes.
  - `deleteSession`: Deletes a session and updates all clients.
  - `startRace`: Starts a race session and updates the race state for all clients.
  - `endRaceSession`: Marks a race session as ended and updates clients.
  - `changeRaceMode`: Updates the race mode for a session.
  - `setRaceMode`: Sets a specific race mode for a session.
  - `raceSessionsUpdated`: Broadcasts the updated session list.
  - `nextRaceDetails`: Sends details about the next scheduled race session.

---

## **Routes**

### **1. Car Routes**
Provides RESTful API endpoints for car management.
- **Endpoints**:
  - `POST /cars`: Adds a new car.
  - `GET /cars`: Fetches all cars.
  - `GET /cars/:id`: Retrieves a car by ID.
  - `GET /cars/number/:carNumber`: Fetches a car by its number.
  - `GET /cars/available/:sessionId`: Retrieves available cars for a session.
  - `PUT /cars/:id`: Updates car details.
  - `DELETE /cars/:id`: Deletes a car.

---

### **2. Driver Routes**
Provides RESTful API endpoints for driver management.
- **Endpoints**:
  - `POST /drivers`: Adds a new driver.
  - `GET /drivers`: Fetches all drivers.
  - `PUT /drivers/:id`: Updates driver details.
  - `DELETE /drivers/:id`: Deletes a driver.

---

### **3. Lap Routes**
Manages lap times and leaderboard operations.
- **Endpoints**:
  - `POST /laps`: Records a lap time.
  - `GET /leaderboard/:sessionId`: Retrieves the leaderboard for a session.

---

### **4. Race Routes**
Handles race session management, driver assignments, and mode transitions.
- **Endpoints**:
  - `GET /race-mods`: Fetches race modes and modifications.
  - `POST /sessions`: Creates a new race session.
  - `GET /sessions`: Retrieves all race sessions.
  - `PUT /sessions/:id`: Updates a race session.
  - `DELETE /sessions/:id`: Deletes a race session.
  - `POST /sessions/:id/drivers`: Assigns a driver to a session.
  - `GET /sessions/:id/drivers`: Fetches drivers assigned to a session.
  - `DELETE /sessions/:id/drivers/:assignmentId`: Removes a driver from a session.
  - `GET /sessions/next`: Retrieves the next scheduled race session.
  - `POST /sessions/:id/start`: Starts a race session.
  - `GET /sessions/live`: Retrieves details about the live race session.

---

## **Key Benefits**
1. **Real-Time Communication**:  
   Socket handlers ensure all clients are updated in real time with the latest race data, including lap times, leaderboards, and race statuses.

2. **RESTful API**:  
   Routes provide a standardized and modular way for external clients or services to interact with the application.

3. **Scalability**:  
   Modular design for both routes and sockets allows easy addition of new features or modifications without impacting existing functionality.

4. **Robust Error Handling**:  
   Error handling in both routes and sockets ensures clients receive clear and actionable error messages, improving system reliability.


# Overview of Controllers

The controllers in this application serve as the entry point for handling HTTP requests. Each controller processes incoming requests, forwards them to the appropriate service layer, and returns responses to the client. Controllers are designed to manage operations related to cars, drivers, laps, and race sessions, while also emitting real-time updates through Socket.IO.

---

## **Controller Overview**

### **1. Car Controller**
The `CarController` manages HTTP endpoints related to car operations.
- **Purpose**:
  - Handle requests to add, update, delete, and fetch car details.
  - Validate input parameters before forwarding to the `CarService`.
  - Emit real-time updates when cars are added, updated, or removed.
- **Key Features**:
  - Fetch available cars for a specific race session.
  - Ensure unique car numbers and enforce car limits.

---

### **2. Driver Controller**
The `DriverController` handles endpoints related to driver management.
- **Purpose**:
  - Manage requests to add, update, delete, and fetch driver information.
  - Validate input parameters to ensure drivers are properly registered and updated.
  - Emit real-time updates when drivers are added or modified.

---

### **3. Lap Controller**
The `LapController` focuses on lap time recording and leaderboard management.
- **Purpose**:
  - Process lap time submissions for specific cars and race sessions.
  - Provide access to leaderboards based on lap performance.
  - Update the leaderboard in real-time and notify clients of lap time updates.
- **Key Features**:
  - Record lap times with associated metadata like session ID, car ID, and timestamp.
  - Support race flag updates to manage session statuses.

---

### **4. Race Controller**
The `RaceController` oversees race session management, including driver assignments and race modes.
- **Purpose**:
  - Handle race session creation, updates, deletions, and retrievals.
  - Manage the assignment of drivers to sessions and ensure car availability.
  - Support operations for starting and monitoring live race sessions.
  - Fetch the next scheduled race session and provide real-time updates.
- **Key Features**:
  - Emit updates on race session changes, driver assignments, and race starts.
  - Track live race details and broadcast to connected clients.
  - Allow dynamic updates to race modes.

---

## **Key Principles of the Controllers**
- **Request Handling**:  
  Controllers act as the gateway for HTTP requests, validating and forwarding data to the corresponding service.

- **Separation of Concerns**:  
  Controllers focus only on managing HTTP-level concerns, delegating all business logic to the service layers.

- **Real-Time Updates**:  
  Many controllers utilize Socket.IO to emit real-time updates for clients, ensuring the application reflects the latest changes without manual refreshes.

- **Error Handling**:  
  Standardized error handling ensures that meaningful responses are sent back to clients, with appropriate HTTP status codes.

- **Scalability**:  
  The modular design of controllers allows for easy addition of new endpoints or modification of existing ones without affecting other parts of the system.


## **Car Controller**

Handles operations related to car management.

### **Endpoints**
- **`POST /cars`**  
  Adds a new car.
    - **Body**: `{ carNumber: String }`
    - **Response**: `201 Created` with car details.

- **`GET /cars`**  
  Fetches all cars.
    - **Response**: `200 OK` with a list of cars.

- **`GET /cars/:id`**  
  Fetches a car by ID.
    - **Params**: `id`
    - **Response**: `200 OK` with car details.

- **`GET /cars/number/:carNumber`**  
  Fetches a car by number.
    - **Params**: `carNumber`
    - **Response**: `200 OK` with car details.

- **`GET /cars/available/:sessionId`**  
  Fetches cars available for a session.
    - **Params**: `sessionId`
    - **Response**: `200 OK` with a list of available cars.

- **`PUT /cars/:id`**  
  Updates a car.
    - **Params**: `id`
    - **Body**: `{ carNumber: String }`
    - **Response**: `200 OK` with updated car details.

- **`DELETE /cars/:id`**  
  Deletes a car.
    - **Params**: `id`
    - **Response**: `200 OK` with a success message.

---

## **Driver Controller**

Manages driver-related operations.

### **Endpoints**
- **`POST /drivers`**  
  Adds a new driver.
    - **Body**: `{ name: String }`
    - **Response**: `201 Created` with driver details.

- **`GET /drivers`**  
  Fetches all drivers.
    - **Response**: `200 OK` with a list of drivers.

- **`PUT /drivers/:id`**  
  Updates a driver.
    - **Params**: `id`
    - **Body**: `{ name: String }`
    - **Response**: `200 OK` with updated driver details.

- **`DELETE /drivers/:id`**  
  Deletes a driver.
    - **Params**: `id`
    - **Response**: `200 OK` with a success message.

---

## **Lap Controller**

Handles lap time recording and leaderboard management.

### **Endpoints**
- **`POST /laps`**  
  Records a lap time.
    - **Body**: `{ sessionId, carId, lapTime, lapNumber, timestamp }`
    - **Response**: `201 Created` with lap details.

- **`GET /laps/leaderboard/:sessionId`**  
  Fetches the leaderboard for a session.
    - **Params**: `sessionId`
    - **Response**: `200 OK` with leaderboard details.

- **`PUT /laps/flag`**  
  Updates the race flag.
    - **Body**: `{ flag: String }`
    - **Response**: `200 OK` with a success message.

---

## **Race Controller**

Manages race sessions, modes, and assignments.

### **Endpoints**
- **`POST /races/sessions`**  
  Creates a new race session.
    - **Body**: `{ sessionName: String }`
    - **Response**: `201 Created` with session details.

- **`GET /races/sessions`**  
  Fetches all race sessions.
    - **Response**: `200 OK` with a list of sessions.

- **`PUT /races/sessions/:id`**  
  Updates a race session.
    - **Params**: `id`
    - **Body**: `{ sessionName: String }`
    - **Response**: `200 OK` with updated session details.

- **`DELETE /races/sessions/:id`**  
  Deletes a race session.
    - **Params**: `id`
    - **Response**: `200 OK` with a success message.

- **`GET /races/mods`**  
  Fetches race modes.
    - **Response**: `200 OK` with a list of race modes.

- **`POST /races/sessions/:id/drivers`**  
  Assigns a driver to a session.
    - **Params**: `id`
    - **Body**: `{ driverId: Number }`
    - **Response**: `201 Created` with assignment details.

- **`GET /races/sessions/:id/drivers`**  
  Fetches drivers assigned to a session.
    - **Params**: `id`
    - **Response**: `200 OK` with a list of drivers.

- **`DELETE /races/sessions/drivers/:assignmentId`**  
  Removes a driver from a session.
    - **Params**: `assignmentId`
    - **Response**: `200 OK` with a success message.

- **`GET /races/next`**  
  Fetches the next race session.
    - **Response**: `200 OK` with next session details.

- **`POST /races/sessions/:id/start`**  
  Starts a race session.
    - **Params**: `id`
    - **Response**: `200 OK` with race details.

- **`GET /races/live`**  
  Fetches the live race session.
    - **Response**: `200 OK` with live race details.

---

## **Error Handling**

Custom errors are handled using the `CustomError` middleware. All controllers utilize a standardized error-handling process for cleaner and more consistent responses.

---

## **Socket.IO Events**
- `carsUpdated` - Broadcasts updated car list.
- `driversUpdated` - Broadcasts updated driver list.
- `lapTimesUpdated` - Broadcasts updated lap times.
- `leaderboardUpdated` - Broadcasts leaderboard updates.
- `raceSessionsUpdated` - Broadcasts updated race session list.
- `nextRaceDetails` - Broadcasts next race session details.
- `raceStarted` - Broadcasts race start details.
- `raceFinished` - Broadcasts race finish status.
- `flagUpdated` - Broadcasts updated race flag.

# Service Layers Documentation
# Overview of Service Layers

The service layers in this application are designed to handle the core business logic of the racing system. These layers act as intermediaries between the controllers and the repositories, ensuring that all input is validated and processed before interacting with the database. Each service is tailored to a specific domain, such as managing cars, drivers, laps, or races.

---

## **Service Layer Overview**

### **1. Car Service**
The `CarService` manages all operations related to cars in the racing system.
- **Purpose**:
  - Add new cars.
  - Retrieve, update, and delete car records.
  - Ensure car constraints, such as a maximum limit or unique car numbers, are respected.
  - Provide available cars for specific race sessions.

---

### **2. Driver Service**
The `DriverService` handles driver-related operations in the application.
- **Purpose**:
  - Add new drivers.
  - Retrieve all drivers.
  - Update driver information.
  - Delete drivers from the system.

---

### **3. Lap Service**
The `LapService` focuses on recording and managing lap times in the racing system.
- **Purpose**:
  - Record lap times for specific cars in a race session.
  - Update the leaderboard dynamically based on the latest lap times.
  - Retrieve all lap times for a session.

---

### **4. Leaderboard Service**
The `LeaderboardService` manages the leaderboard for race sessions.
- **Purpose**:
  - Fetch the leaderboard for a specific session.
  - Ensure the leaderboard reflects the fastest lap times and race standings.

---

### **5. Race Service**
The `RaceService` oversees race session management, including modes and driver assignments.
- **Purpose**:
  - Create, retrieve, update, and delete race sessions.
  - Manage race modes, including transitions between different modes (e.g., "Safe" or "Finish").
  - Assign drivers to race sessions, ensuring they are paired with available cars.
  - Start race sessions and track live race details.
  - Manage the next scheduled race session.

---

## **Key Principles of the Service Layers**
- **Validation**:  
  Service methods validate all inputs to ensure data integrity and prevent invalid operations.

- **Business Logic**:  
  The core business rules of the application are encapsulated in the service layers, separating them from controllers and repositories.

- **Reusability**:  
  Services can be reused across different parts of the application, ensuring a centralized and consistent approach to handling operations.

- **Error Handling**:  
  Custom error handling ensures that meaningful and clear error messages are provided for both the client and developers.

- **Real-Time Updates**:  
  Several services, especially `CarService` and `RaceService`, emit real-time updates through Socket.IO to ensure a seamless client experience in the racing environment.


This part provides an overview of the service layers used in the racing application. The service layers contain business logic, validate input, and interact with repositories to manage cars, drivers, laps, and race sessions.

---



## **Car Service**

Handles business logic for car management.

### **Methods**
- **`addCar(carNumber)`**  
  Adds a new car.
  - **Parameters**: `carNumber (String)`
  - **Throws**:
    - `400` if the car number is invalid or the maximum car limit is reached.
    - `409` if the car already exists.

- **`getCars()`**  
  Retrieves all cars.
  - **Returns**: Array of cars.

- **`getCarById(id)`**  
  Retrieves a car by its ID.
  - **Parameters**: `id (Number)`
  - **Throws**:
    - `400` if the ID is invalid.
    - `404` if the car is not found.

- **`getCarByNumber(carNumber)`**  
  Retrieves a car by its number.
  - **Parameters**: `carNumber (Number)`
  - **Throws**:
    - `400` if the car number is invalid.
    - `404` if the car is not found.

- **`getAvailableCars(sessionId)`**  
  Retrieves cars available for a session.
  - **Parameters**: `sessionId (Number)`
  - **Throws**: `400` if the session ID is invalid.

- **`updateCar(id, carNumber)`**  
  Updates a car's number.
  - **Parameters**:
    - `id (Number)`
    - `carNumber (String)`
  - **Throws**:
    - `400` for invalid input.
    - `404` if the car is not found.
    - `409` if the car number already exists.

- **`deleteCar(id)`**  
  Deletes a car.
  - **Parameters**: `id (Number)`
  - **Throws**:
    - `400` for invalid ID.
    - `404` if the car is not found.

---

## **Driver Service**

Handles business logic for driver management.

### **Methods**
- **`addDriver(name)`**  
  Adds a new driver.
  - **Parameters**: `name (String)`
  - **Throws**: `400` for invalid name.

- **`getDrivers()`**  
  Retrieves all drivers.
  - **Returns**: Array of drivers.

- **`updateDriver(id, name)`**  
  Updates a driver's name.
  - **Parameters**:
    - `id (Number)`
    - `name (String)`
  - **Throws**:
    - `400` for invalid input.
    - `404` if the driver is not found.

- **`deleteDriver(id)`**  
  Deletes a driver.
  - **Parameters**: `id (Number)`
  - **Throws**: `400` for invalid ID.

---

## **Lap Service**

Handles business logic for recording lap times and managing leaderboards.

### **Methods**
- **`recordLapTime(sessionId, carId, lapTime, lapNumber, timestamp)`**  
  Records a lap time and updates the leaderboard.
  - **Parameters**:
    - `sessionId (Number)`
    - `carId (Number)`
    - `lapTime (Number)`
    - `lapNumber (Number)`
    - `timestamp (Date)`
  - **Throws**:
    - `400` for invalid input.

- **`getLapTimes(sessionId)`**  
  Retrieves all lap times for a session.
  - **Parameters**: `sessionId (Number)`
  - **Returns**: Array of lap times.

---

## **Leaderboard Service**

Handles business logic for leaderboard management.

### **Methods**
- **`getLeaderboard(sessionId)`**  
  Retrieves the leaderboard for a session.
  - **Parameters**: `sessionId (Number)`
  - **Returns**: Leaderboard data.

---

## **Race Service**

Manages race session logic, modes, and assignments.

### **Methods**
- **`addRaceSession(sessionName)`**  
  Creates a new race session.
  - **Parameters**: `sessionName (String)`
  - **Throws**: `400` for invalid session name.

- **`getRaceSessions()`**  
  Retrieves all race sessions.
  - **Returns**: Array of sessions.

- **`updateRaceSession(id, sessionName)`**  
  Updates a race session.
  - **Parameters**:
    - `id (Number)`
    - `sessionName (String)`
  - **Throws**:
    - `400` for invalid input.

- **`deleteRaceSession(id)`**  
  Deletes a race session.
  - **Parameters**: `id (Number)`
  - **Throws**: `400` for invalid ID.

- **`getRaceMods()`**  
  Retrieves race modes.
  - **Returns**: Array of race modes.

- **`assignDriverToSession(sessionId, driverId, carId = null)`**  
  Assigns a driver to a session, optionally with a specific car.
  - **Parameters**:
    - `sessionId (Number)`
    - `driverId (Number)`
    - `carId (Number)` (optional)
  - **Throws**:
    - `400` for invalid input.

- **`getDriversForSession(sessionId)`**  
  Retrieves drivers assigned to a session.
  - **Parameters**: `sessionId (Number)`
  - **Throws**: `400` for invalid session ID.

- **`removeDriverFromSession(assignmentId)`**  
  Removes a driver from a session.
  - **Parameters**: `assignmentId (Number)`
  - **Throws**: `400` for invalid assignment ID.

- **`getNextRaceSession()`**  
  Retrieves the next race session.
  - **Returns**: Next race session data.

- **`startRaceSession(sessionId)`**  
  Starts a race session in "Safe" mode.
  - **Parameters**: `sessionId (Number)`
  - **Throws**:
    - `400` for invalid ID.

- **`updateRaceMode(sessionId, modeName)`**  
  Updates the mode of a race session.
  - **Parameters**:
    - `sessionId (Number)`
    - `modeName (String)`
  - **Throws**:
    - `400` for invalid input.

- **`getModeByName(modeName)`**  
  Retrieves a mode by name.
  - **Parameters**: `modeName (String)`
  - **Returns**: Mode details.

- **`setRaceMode(sessionId, modeId)`**  
  Sets the race mode for a session.
  - **Parameters**:
    - `sessionId (Number)`
    - `modeId (Number)`
  - **Throws**:
    - `400` for invalid input.


# Overview of Repositories

The repository layer provides direct interaction with the database. It serves as a central point for executing queries and retrieving, updating, or deleting data from the database. Each repository is specialized for a specific domain, such as cars, drivers, laps, leaderboards, and race sessions.

---

## **Repository Overview**

### **1. Car Repository**
The `CarRepository` manages database operations related to cars.
- **Purpose**:
  - Add new cars, ensuring the total number of cars does not exceed the maximum limit.
  - Retrieve car records by ID or car number.
  - Update or delete car records in the database.
  - Check for existing cars to enforce unique car numbers.
  - Retrieve available cars for specific race sessions.

---

### **2. Driver Repository**
The `DriverRepository` manages database operations for drivers.
- **Purpose**:
  - Add new drivers to the database.
  - Retrieve all registered drivers.
  - Update driver information, such as their name.
  - Delete driver records from the database.

---

### **3. Lap Repository**
The `LapRepository` manages database operations for lap times.
- **Purpose**:
  - Record new lap times for cars in specific race sessions.
  - Retrieve lap times for a session, including associated metadata like driver name and car ID.
  - Retrieve the fastest lap times and current lap numbers for leaderboard calculations.

---

### **4. Leaderboard Repository**
The `LeaderboardRepository` manages database operations for race leaderboards.
- **Purpose**:
  - Update the leaderboard with the latest lap times and standings.
  - Retrieve the leaderboard for a specific race session, including details like fastest lap time and current lap number.

---

### **5. Race Repository**
The `RaceRepository` handles database interactions for race sessions, modes, and assignments.
- **Purpose**:
  - Create, update, retrieve, and delete race sessions.
  - Manage race modes, including transitions between modes.
  - Assign drivers to sessions, optionally associating them with specific cars.
  - Retrieve the list of drivers assigned to a session.
  - Retrieve the next race session or a specific race mode by name.
  - Validate transitions between race modes.

---

## **Key Principles of the Repository Layer**
- **Database Interaction**:  
  Repositories execute raw SQL queries to directly interact with the database.

- **Domain-Specific Logic**:  
  Each repository is focused on a specific domain, such as cars, drivers, or races, to maintain a clear separation of concerns.

- **Data Integrity**:  
  Repositories include checks to ensure that data constraints, such as unique values or foreign key relationships, are respected.

- **Error Handling**:  
  Database errors are caught and wrapped in meaningful messages to provide better debugging support.

- **Scalability**:  
  The modular design of repositories allows for easy extension or modification without impacting other parts of the system.


# Race Store Overview

The `RaceStore` is a centralized state management utility for the racing application, designed to handle and broadcast real-time updates related to race sessions, lap times, leaderboards, and race statuses. It extends the functionality of Node.js's `EventEmitter`, allowing it to emit events whenever the state changes.

---

## **Purpose**
The `RaceStore` provides a structured and efficient way to manage race-related data and ensures synchronization across all connected clients in real time. It acts as a live data store for the racing environment.

---

## **Core Features**

### **1. Centralized State Management**
- **State Variables**:
  - `liveRace`: Tracks the current live race session.
  - `lapTimes`: Stores all recorded lap times for the current session.
  - `leaderboard`: Maintains the current leaderboard based on lap times.
  - `raceFlags`: Indicates the current status of the race (e.g., "Safe", "Finish").
  - `raceTimer`: Tracks the remaining time for the live race.
  - `lastSession`: Stores details of the last completed session.

- **State Updates**:  
  Changes to the state automatically emit events for subscribers, ensuring that connected clients and application components are notified of updates.

---

### **2. Real-Time Updates**
- **Event Emission**:  
  When the state changes (e.g., new lap time is recorded or leaderboard updates), the store emits events that notify the application or connected clients.

- **Broadcast Capabilities**:  
  Works seamlessly with Socket.IO or similar tools to broadcast updates to all connected clients.

---

### **3. Leaderboard Management**
- **Dynamic Leaderboard Updates**:
  - Calculates the leaderboard based on recorded lap times.
  - Updates entries for each car, tracking their fastest lap and current lap number.
  - Automatically sorts the leaderboard by fastest lap time and lap progress.

- **Formatting**:
  - Lap times are formatted into a readable `MM:SS.MS` format for display purposes.

---

### **4. Race Session Management**
- **Live Race Tracking**:
  - Stores details of the current live race, including its start time and duration.

- **Race Flags**:
  - Manages race statuses (e.g., "Safe", "Finish") and validates transitions between flags.

- **Timers**:
  - Tracks and updates the remaining race time.

---

### **5. Utility Methods**
- **Lap Time Parsing and Formatting**:
  - Converts lap time strings into milliseconds for calculations.
  - Formats milliseconds back into readable time strings.

- **Mode Transition Validation**:
  - Prevents invalid transitions between race modes (e.g., disallowing changes after the race is finished).

---

## **Key Benefits**
1. **Real-Time State Synchronization**:  
   Keeps all components and clients updated with the latest race data, including lap times, leaderboard, and race flags.

2. **Centralized Logic**:  
   Encapsulates race-related state management and calculations in one place, reducing redundancy and ensuring consistency.

3. **Extensibility**:  
   Designed to accommodate additional features or state variables as the racing application grows.

4. **Error Prevention**:  
   Validates data updates (e.g., mode transitions, lap times) to maintain data integrity and prevent conflicts.

---

## **Usage in the Application**
- **Controllers**:  
  Controllers interact with the `RaceStore` to update the state (e.g., recording lap times, updating race flags) and broadcast changes.

- **Real-Time Features**:  
  Integrated with WebSocket or Socket.IO to push updates, such as leaderboard changes or race status updates, to all connected clients.
