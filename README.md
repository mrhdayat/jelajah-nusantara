# Jelajah Nusantara AI: Perencana Rute Wisata Personalisasi

Sebuah platform web cerdas yang merevolusi cara wisatawan merencanakan perjalanan mereka di Indonesia menggunakan AI dan Natural Language Processing.

## 🌟 Fitur Utama

- **Perencana Rute Berbasis AI**: Input bahasa alami untuk membuat itinerary personal
- **Analisis Sentimen Destinasi**: Analisis ulasan real-time untuk rekomendasi yang lebih baik
- **Visualisasi Interaktif**: Peta interaktif dengan drag-and-drop itinerary
- **Estimasi Anggaran Otomatis**: Perhitungan biaya perjalanan yang akurat
- **UI Modern**: Antarmuka yang indah dengan animasi halus

## 🏗️ Arsitektur Teknologi

### Frontend
- **Next.js 14** - Framework React dengan App Router
- **TypeScript** - Type safety dan developer experience
- **ShadCN UI** - Komponen UI modern dan accessible
- **Aceternity UI** - Komponen UI dengan animasi premium
- **Framer Motion** - Animasi dan transisi yang halus
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **FastAPI** - Modern Python web framework
- **Python 3.11+** - Bahasa pemrograman utama
- **PostgreSQL** - Database relasional via Supabase/Neon
- **Pydantic** - Data validation dan serialization

### AI & Machine Learning
- **IBM Watsonx (Granite)** - Primary LLM untuk production
- **Hugging Face Transformers** - Alternative/fallback LLM
- **LangChain** - Framework untuk aplikasi LLM
- **Sentence Transformers** - Untuk embedding dan similarity search

### Maps & Geolocation
- **Google Maps API** - Peta interaktif dan geocoding
- **Mapbox** - Alternative mapping solution

## 📁 Struktur Proyek

```
destination-ai/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   ├── lib/            # Utilities dan helpers
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Core functionality
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   ├── requirements.txt
│   └── main.py
├── docs/                   # Documentation
├── scripts/               # Development scripts
└── docker-compose.yml     # Local development setup
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ dan npm/yarn
- Python 3.11+
- PostgreSQL (atau akun Supabase/Neon)
- API keys untuk Google Maps dan LLM service

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd destination-ai
```

2. **Setup Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Setup Frontend**
```bash
cd frontend
npm install
```

4. **Environment Configuration**
```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

5. **Run Development Servers**
```bash
# Terminal 1 - Backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🔧 Development

### Backend Development
- FastAPI server runs on `http://localhost:8000`
- API documentation available at `http://localhost:8000/docs`
- Database migrations: `alembic upgrade head`

### Frontend Development
- Next.js dev server runs on `http://localhost:3000`
- Hot reload enabled for rapid development
- TypeScript checking: `npm run type-check`

## 📝 API Documentation

API documentation tersedia di `/docs` endpoint ketika server backend berjalan.

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

Platform ini dirancang untuk di-deploy pada infrastruktur cloud gratis:

- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Render, atau Google Cloud Run
- **Database**: Supabase, Neon, atau PlanetScale

## 📄 License

MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 🤝 Contributing

Kontribusi sangat diterima! Silakan baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan.

## 📞 Support

Untuk pertanyaan atau dukungan, silakan buka issue di GitHub repository ini.
