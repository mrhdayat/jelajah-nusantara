# 🆓 Setup Gratis - Jelajah Nusantara AI

Panduan lengkap untuk menjalankan aplikasi **100% GRATIS** menggunakan free tier dari berbagai layanan.

## 🎯 **Total Biaya: $0/bulan**

Dengan setup ini, Anda bisa menjalankan aplikasi tanpa biaya untuk development dan testing dengan batasan reasonable.

## 📋 **Layanan Gratis yang Digunakan**

### **1. 🗄️ Database - Supabase (Gratis)**
- **Kapasitas**: 500MB database
- **Bandwidth**: 2GB/bulan
- **Rows**: 500,000 rows
- **API Requests**: Unlimited

**Setup:**
1. Daftar di [supabase.com](https://supabase.com)
2. Buat project baru
3. Copy connection string dari Settings > Database
4. Update `DATABASE_URL` di `.env`

```bash
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### **2. 🤖 AI Service - Hugging Face (Gratis)**
- **Rate Limit**: 1000 requests/hour
- **Models**: Akses ke ribuan open-source models
- **Inference API**: Gratis dengan batasan

**Setup:**
1. Daftar di [huggingface.co](https://huggingface.co)
2. Buat Access Token di Settings > Access Tokens
3. Update `.env`:

```bash
AI_PROVIDER=huggingface
HUGGINGFACE_API_TOKEN=hf_your_token_here
HUGGINGFACE_MODEL=mistralai/Mistral-7B-Instruct-v0.2
```

### **3. 🗺️ Maps - Google Maps (Gratis)**
- **Credit**: $200/bulan gratis
- **Requests**: ~28,000 map loads/bulan
- **Features**: Maps, Geocoding, Places API

**Setup:**
1. Buat project di [Google Cloud Console](https://console.cloud.google.com)
2. Enable Maps JavaScript API
3. Buat API Key dengan restrictions
4. Update `.env`:

```bash
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### **4. 💾 Cache - Redis Local (Gratis)**
- **Kapasitas**: Unlimited (tergantung RAM)
- **Performance**: Sangat cepat (local)

**Setup:**
```bash
# Install Redis
# macOS
brew install redis

# Ubuntu/Debian
sudo apt install redis-server

# Start Redis
redis-server

# Update .env
REDIS_URL=redis://localhost:6379
```

**Alternative: Upstash Redis (Gratis)**
- **Requests**: 10,000 commands/hari
- **Storage**: 256MB

1. Daftar di [upstash.com](https://upstash.com)
2. Buat Redis database
3. Copy connection string

## 🚀 **Quick Setup Gratis**

### **1. Clone & Setup**
```bash
git clone <repository-url>
cd destination-ai

# Copy free configuration
cp backend/.env.free backend/.env
cp frontend/.env.example frontend/.env.local
```

### **2. Update Configuration**
Edit `backend/.env` dengan credentials Anda:

```bash
# Database - Supabase
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres

# AI - Hugging Face
AI_PROVIDER=huggingface
HUGGINGFACE_API_TOKEN=hf_your_token_here

# Maps - Google
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Cache - Local Redis
REDIS_URL=redis://localhost:6379
```

Edit `frontend/.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### **3. Run dengan Docker**
```bash
# Start services
docker-compose up -d

# Initialize database
docker-compose exec backend python scripts/init_db.py
```

### **4. Access Application**
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📊 **Batasan Free Tier**

| Service | Limit | Upgrade Trigger |
|---------|-------|-----------------|
| Supabase | 500MB DB | Database size |
| Hugging Face | 1000 req/hour | API calls |
| Google Maps | $200 credit | Map loads |
| Redis Local | RAM limit | Memory usage |

## 🔄 **Upgrade Path**

Ketika aplikasi berkembang, upgrade secara bertahap:

### **Stage 1: AI Upgrade ($10-20/bulan)**
```bash
# Upgrade ke OpenAI untuk AI yang lebih baik
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-3.5-turbo
```

### **Stage 2: Database Upgrade ($25/bulan)**
```bash
# Upgrade ke Supabase Pro
# Atau gunakan dedicated PostgreSQL
```

### **Stage 3: Production Setup ($50-100/bulan)**
- Dedicated hosting (Vercel Pro, Railway Pro)
- CDN untuk static assets
- Monitoring dan analytics
- Backup automation

## 🛠️ **Development Tips**

### **1. Optimize API Calls**
```python
# Cache AI responses
@lru_cache(maxsize=100)
def cached_ai_call(query: str):
    return ai_service.parse_query(query)
```

### **2. Batch Operations**
```python
# Process multiple queries together
def batch_process_queries(queries: List[str]):
    # Reduce API calls
    pass
```

### **3. Fallback Mechanisms**
```python
# Always have local fallback
if ai_provider_fails:
    return local_processing(query)
```

## 🔍 **Monitoring Usage**

### **1. Supabase Dashboard**
- Monitor database size
- Track API usage
- Check performance metrics

### **2. Google Cloud Console**
- Monitor Maps API usage
- Track billing
- Set up alerts

### **3. Hugging Face**
- Check API usage in dashboard
- Monitor rate limits

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **Database Connection Failed**
```bash
# Check Supabase connection
psql "postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
```

2. **AI API Rate Limited**
```bash
# Switch to local fallback temporarily
AI_PROVIDER=none
```

3. **Maps Not Loading**
```bash
# Check API key restrictions
# Verify domain whitelist
```

## 🎉 **Success Metrics**

Dengan setup gratis ini, Anda bisa:
- ✅ Handle 100-500 users/hari
- ✅ Process 1000 AI queries/hari
- ✅ Store 100,000+ destinations
- ✅ Serve 10,000+ map requests/hari

## 📞 **Support**

Jika mengalami masalah dengan setup gratis:
1. Check [Troubleshooting Guide](docs/troubleshooting.md)
2. Join [Discord Community](https://discord.gg/jelajahnusantara)
3. Create [GitHub Issue](https://github.com/jelajahnusantara/issues)

---

**💡 Pro Tip**: Mulai dengan setup gratis, monitor usage, dan upgrade hanya ketika benar-benar diperlukan. Banyak startup sukses dimulai dengan free tier!
