# Setup Instructions

- Node.js (v25.2.1)
- npm (v11.6.2)
- Python (v3.12.11)
- pip (v25.0.1)

## Backend Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the backend server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
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
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── venv/                   # Python virtual environment
├── src/
│   ├── components/         # React components
│   ├── store/              # Zustand state management
│   ├── services/           # API service layer
│   ├── types/              # TypeScript types
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── package.json            # Node dependencies
├── package-lock.json       # Node dependencies lock file
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── postcss.config.js       # PostCSS configuration
├── node_modules/           # Node dependencies
├── README.md               # Project overview
└── SETUP.md                # Project setup guidance

```
