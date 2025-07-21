
#!/bin/bash
# Create Python virtual environment
uv venv --python python3.12
source .venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
uv pip install -r requirements.txt

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Source environment variables from .env file
source "$PROJECT_ROOT/.env"

# Run the API server with environment variables available
python api_server.py