#!/usr/bin/env python3
"""
Lean Python API Server for Grant Bidding Platform
No frameworks - using standard library + psycopg2
"""

import json
import os
import psycopg2
import psycopg2.extras
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import logging
from datetime import datetime, date
from decimal import Decimal

# Function to read environment variables from .env file
def load_env_from_file():
    try:
        with open('.env', 'r') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                key, value = line.split('=', 1)
                os.environ[key] = value
    except FileNotFoundError:
        logging.warning(".env file not found, using default values")

# Load environment variables from .env file
load_env_from_file()

# Database configuration from environment variables
DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'database': os.environ.get('DB_NAME', 'grants_db'),
    'user': os.environ.get('DB_USER', 'grants_user'),
    'password': os.environ.get('DB_PASSWORD', 'grants_password')
}

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DatabaseManager:
    def __init__(self, config):
        self.config = config

    def get_connection(self):
        return psycopg2.connect(**self.config)

    def execute_query(self, query, params=None, fetch=True):
        """Execute SQL query and return results"""
        try:
            with self.get_connection() as conn:
                with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                    cur.execute(query, params)
                    if fetch:
                        return cur.fetchall()
                    return cur.rowcount
        except psycopg2.Error as e:
            logger.error(f"Database error: {e}")
            raise


db = DatabaseManager(DB_CONFIG)


class JSONEncoder(json.JSONEncoder):
    """Custom JSON encoder for PostgreSQL data types"""

    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)


class GrantAPIHandler(BaseHTTPRequestHandler):

    def _set_cors_headers(self):
        """Set CORS headers for React frontend"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def _send_json_response(self, data, status=200):
        """Send JSON response"""
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self._set_cors_headers()
        self.end_headers()

        json_data = json.dumps(data, cls=JSONEncoder, indent=2)
        self.wfile.write(json_data.encode())

    def _send_error(self, message, status=400):
        """Send error response"""
        self._send_json_response({'error': message}, status)

    def _parse_request_body(self):
        """Parse JSON request body"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            return json.loads(post_data.decode())
        except (ValueError, KeyError) as e:
            logger.error(f"Error parsing request body: {e}")
            return None

    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_GET(self):
        """Handle GET requests"""
        parsed_url = urlparse(self.path)
        path_parts = [p for p in parsed_url.path.split('/') if p]

        try:
            if not path_parts:
                self._send_json_response({'message': 'Grant Bidding API', 'version': '1.0'})

            elif path_parts[0] == 'grants':
                if len(path_parts) == 1:
                    self._get_grants()
                elif len(path_parts) == 2:
                    self._get_grant_by_id(int(path_parts[1]))
                elif len(path_parts) == 3 and path_parts[2] == 'bids':
                    self._get_grant_bids(int(path_parts[1]))
                else:
                    self._send_error('Invalid grants endpoint', 404)

            elif path_parts[0] == 'organizations':
                self._get_organizations()

            elif path_parts[0] == 'bids' and len(path_parts) == 1:
                self._get_all_bids()

            else:
                self._send_error('Endpoint not found', 404)

        except ValueError:
            self._send_error('Invalid ID format', 400)
        except Exception as e:
            logger.error(f"GET request error: {e}")
            self._send_error('Internal server error', 500)

    def do_POST(self):
        """Handle POST requests"""
        parsed_url = urlparse(self.path)
        path_parts = [p for p in parsed_url.path.split('/') if p]

        try:
            if path_parts[0] == 'bids':
                self._create_bid()
            else:
                self._send_error('Endpoint not found', 404)

        except Exception as e:
            logger.error(f"POST request error: {e}")
            self._send_error('Internal server error', 500)

    def _get_grants(self):
        """Get all grants"""
        query = """
                SELECT g.*, o.name as created_by_name
                FROM grants g
                         LEFT JOIN organizations o ON g.created_by = o.id
                ORDER BY g.created_at DESC \
                """
        grants = db.execute_query(query)
        self._send_json_response(list(grants))

    def _get_grant_by_id(self, grant_id):
        """Get specific grant by ID"""
        query = """
                SELECT g.*, o.name as created_by_name
                FROM grants g
                         LEFT JOIN organizations o ON g.created_by = o.id
                WHERE g.id = %s \
                """
        grants = db.execute_query(query, (grant_id,))

        if grants:
            self._send_json_response(grants[0])
        else:
            self._send_error('Grant not found', 404)

    def _get_grant_bids(self, grant_id):
        """Get all bids for a specific grant"""
        query = """
                SELECT b.*, o.name as organization_name
                FROM bids b
                         JOIN organizations o ON b.organization_id = o.id
                WHERE b.grant_id = %s
                ORDER BY b.submitted_at DESC \
                """
        bids = db.execute_query(query, (grant_id,))
        self._send_json_response(list(bids))

    def _get_all_bids(self):
        """Get all bids with grant and organization info"""
        query = """
                SELECT b.*, g.title as grant_title, o.name as organization_name
                FROM bids b
                         JOIN grants g ON b.grant_id = g.id
                         JOIN organizations o ON b.organization_id = o.id
                ORDER BY b.submitted_at DESC \
                """
        bids = db.execute_query(query)
        self._send_json_response(list(bids))

    def _get_organizations(self):
        """Get all organizations"""
        query = "SELECT * FROM organizations ORDER BY name"
        organizations = db.execute_query(query)
        self._send_json_response(list(organizations))

    def _create_bid(self):
        """Create a new bid"""
        data = self._parse_request_body()

        if not data:
            self._send_error('Invalid JSON data')
            return

        required_fields = ['grant_id', 'organization_id', 'title', 'proposal', 'requested_amount']
        if not all(field in data for field in required_fields):
            self._send_error('Missing required fields')
            return

        try:
            query = """
                    INSERT INTO bids (grant_id, organization_id, title, proposal, requested_amount)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING * \
                    """
            params = (
                data['grant_id'],
                data['organization_id'],
                data['title'],
                data['proposal'],
                data['requested_amount']
            )

            result = db.execute_query(query, params)
            if result:
                self._send_json_response(result[0], 201)
            else:
                self._send_error('Failed to create bid', 500)

        except psycopg2.IntegrityError as e:
            if 'duplicate key' in str(e).lower():
                self._send_error('Organization has already submitted a bid for this grant', 409)
            else:
                self._send_error('Data integrity error', 400)


def run_server():
    """Start the HTTP server"""
    port = int(os.environ.get('PORT', 8000))
    server_address = ('', port)
    httpd = HTTPServer(server_address, GrantAPIHandler)

    logger.info(f"Starting Grant Bidding API server on port {port}")
    logger.info(f"Visit http://localhost:{port} to test the API")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        logger.info("Shutting down server...")
        httpd.server_close()


if __name__ == '__main__':
    # Install required packages:
    # pip install psycopg2-binary

    print("Grant Bidding API Server")
    print("=" * 30)
    print("Endpoints:")
    print("GET  /grants           - List all grants")
    print("GET  /grants/{id}      - Get specific grant")
    print("GET  /grants/{id}/bids - Get bids for grant")
    print("GET  /organizations    - List organizations")
    print("GET  /bids             - List all bids")
    print("POST /bids             - Create new bid")
    print()

    run_server()