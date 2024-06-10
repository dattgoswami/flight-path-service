# Flight Path Microservice

## Overview

This microservice API sorts and tracks a person's flight path from unordered flight records. It accepts a list of flights defined by source and destination airport codes, sorts them, and finds the total flight path from starting to ending airports.

## API Endpoint

### URL

`POST http://localhost:8080/calculate`

### Request Body

The request body should be a JSON object containing an array of flight segments. Each segment is an array with two elements: the source and destination airport codes.

**Example:**

```json
{
  "flights": [
    ["IND", "EWR"],
    ["SFO", "ATL"],
    ["GSO", "IND"],
    ["ATL", "GSO"]
  ]
}
```

### Response

The response will be a JSON object containing the ordered flight path from the starting airport to the ending airport.

**Example:**

```json
{
  "path": ["SFO", "EWR"]
}
```

### Error Responses

- **400 Bad Request**: Invalid input

  ```json
  {
    "error": "Invalid input: The request body must contain a \"flights\" array of arrays, where each sub-array represents a flight with a source and destination airport code. Example: { \"flights\": [[\"SFO\", \"EWR\"], [\"ATL\", \"EWR\"]] }"
  }
  ```

- **500 Internal Server Error**:
  - No unique starting point
    ```json
    {
      "error": "Invalid flight data: no unique starting point found."
    }
    ```
  - Cycle detected
    ```json
    {
      "error": "Cycle detected in the flight path."
    }
    ```
  - Disjoint or unconnected flights
    ```json
    {
      "error": "Invalid flight data: disjoint or unconnected flights detected."
    }
    ```

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/dattgoswami/flight-path-service
   cd flight-path-service
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create `.env` file:**

   ```bash
   touch .env
   echo "PORT=8080" >> .env
   ```

4. **Start the server:**

   ```bash
   npm start
   ```

5. **Run in development mode:**

   ```bash
   npm run dev
   ```

6. **Run tests:**

   ```bash
   npm test
   ```

7. **Lint the code:**
   ```bash
   npm run lint
   ```

## Project Structure

Files and directories:

```
flight-path-service/
├── index.js 
├── controllers/
│   └── flightController.js
├── routes/
│   └── flightRoutes.js
├── middleware/
│   ├── errorHandler.js
│   └── logger.js
├── tests/
|   └── flightRoutes.test.js
├── .env //to be created from .env.example
├── server.log
├── package.json
└── README.md
```

## Scaling / Hosting
- It can be hosted on AWS Lambda; provisioned concurrency can be used to pre-initialize execution environments to respond to incoming requests meediately(i.e. reducing cold starts)
- With a trigger from API Gateway set on this Lambda
- It can be made asynchronous by decoupling the API Gateway and Lambda using AWS SQS(queue) in between

## Tests

The following 10 test cases validate the `calculateFlightPath` function thoroughly:

1. **Valid flight path**:
    - Confirms the correct ordering of a simple set of flights.

2. **Valid flight path with multiple segments**:
    - Ensures the function handles longer flight paths correctly.

3. **No unique starting point**:
    - Detects when there is no unique starting point in the flight data.

4. **Single flight**:
    - Handles a case with only one flight segment.

5. **Empty input**:
    - Handles empty flight data gracefully.

6. **Invalid input (not an array)**:
    - Ensures the input must be an array of flight segments.

7. **Invalid input (malformed flight data)**:
    - Validates the structure of each flight segment.

8. **Unconnected flight**:
    - Detects if there are any unconnected flights.

9. **Disjoint flights**:
    - Identifies when flights are not connected to form a single path.

10. **Cycle detected**:
    - Checks for cycles in the flight path.

## Summary

The Flight Path Microservice efficiently handles unordered flight records to provide a sorted flight path. By following the setup instructions and utilizing the error handling, the service ensures robust performance and accurate results. 