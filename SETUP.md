# Setup Instructions

- Node.js (v25.2.1)
- npm (v11.6.2)
- Python (v3.12.11)
- pip (v25.0.1)

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the backend server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

1. Start the backend server first (port 8000)
2. Start the frontend development server (port 5173)
3. Open `http://localhost:5173` in your browser
4. Login with any credentials (mock authentication)
5. View and filter lessons in the dashboard

## API Endpoints

- `POST /api/login` - Mock login (accepts any credentials)
- `GET /api/lessons` - Get all lessons
- `POST /api/lessons/take` - Take an available class

## Project Structure

```
.
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── store/          # Zustand state management
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── package.json        # Node dependencies
└── README.md               # Project overview
└── SETUP.md                # Project setup guidance

```
