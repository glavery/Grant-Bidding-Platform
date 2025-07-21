# Grant Bidding Platform - In Progress

A web application for managing grant opportunities and bid submissions. Organizations can view available grants, submit bids, and track their submissions.

An exercise in building a database driven API without using any frameworks. 

## Project Overview

This project consists of:

- **Backend**: Python-based API server using PostgreSQL database
- **Frontend**: React application with Tailwind CSS for styling

The application allows users to:
- Browse available grants
- View detailed information about each grant
- Submit bids for grants
- View all submitted bids

## Technologies Used

### Backend
- Python
- PostgreSQL
- psycopg2 (PostgreSQL adapter for Python)
- HTTP server from Python's standard library

### Frontend
- React
- Tailwind CSS
- JavaScript/ES6+

## Setup Instructions

### Prerequisites
- Python 3.6+
- Node.js and npm
- PostgreSQL database

### Database Setup

1. Create the database and user:
   ```bash
   cd scripts
   ./create_database.sh
   ```
   This script creates a PostgreSQL database named `grants_db` and a user `grants_user` with the password `grants_password`.

2. Initialize the database schema:
   ```bash
   ./run_schema.sh
   ```
   This script populates the database with the necessary tables and initial data.

### Backend Setup

1. Create a Python virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install required dependencies:
   ```bash
   pip install psycopg2-binary python-dotenv
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file to update the values as needed.

4. Start the API server:
   ```bash
   python api_server.py
   ```
   The server will run on the port specified in the `.env` file (default: 8000).

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file to update the values as needed.

4. Start the development server:
   ```bash
   npm start
   ```
   The frontend will be available at http://localhost:3000.

## Environment Variables

This project uses environment variables for configuration to avoid hardcoding sensitive information and to make the application more flexible across different environments.

### Backend Environment Variables

The backend uses the following environment variables:

- `DB_HOST`: Database host address (default: localhost)
- `DB_NAME`: Database name (default: grants_db)
- `DB_USER`: Database username (default: grants_user)
- `DB_PASSWORD`: Database password
- `PORT`: Port on which the API server runs (default: 8000)

These variables are loaded from a `.env` file in the project root directory using the python-dotenv package.

### Frontend Environment Variables

The frontend uses the following environment variables:

- `REACT_APP_API_BASE`: Base URL for API requests (default: http://localhost:8000)

These variables are automatically loaded by Create React App from a `.env` file in the frontend directory. Note that all frontend environment variables must be prefixed with `REACT_APP_` to be accessible in the React application.

### Setting Up Environment Variables

Example `.env.example` files are provided for both the backend and frontend. To set up your environment:

1. Copy the example files:
   ```bash
   # For backend
   cp .env.example .env
   
   # For frontend
   cd frontend
   cp .env.example .env
   ```

2. Edit the `.env` files to update the values according to your environment.

## API Endpoints

The backend provides the following API endpoints:

- `GET /grants` - List all grants
- `GET /grants/{id}` - Get a specific grant by ID
- `GET /grants/{id}/bids` - Get all bids for a specific grant
- `GET /organizations` - List all organizations
- `GET /bids` - List all bids with grant and organization information
- `POST /bids` - Create a new bid

### Creating a Bid

To create a new bid, send a POST request to `/bids` with the following JSON structure:

```json
{
  "grant_id": 1,
  "organization_id": 2,
  "title": "Bid Title",
  "proposal": "Detailed proposal text...",
  "requested_amount": 5000
}
```

## Troubleshooting

If you encounter a "Failed to fetch" error on the frontend:
1. Ensure the backend server is running
2. Check that the database is accessible with the correct credentials
3. Verify that the frontend is configured to connect to the correct API endpoint (default: http://localhost:8000)

## License

This project is proprietary and confidential.

## Contributing

For internal use only. Please follow the company's development guidelines when contributing to this project.