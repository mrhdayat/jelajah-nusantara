# 🗺️ Alternatif Maps Gratis untuk Demo

Panduan lengkap untuk menggunakan alternatif maps gratis tanpa perlu kartu kredit.

## 🎯 **Rekomendasi: Mapbox (GRATIS - No Credit Card)**

### **Keunggulan Mapbox:**
- ✅ **50,000 map loads/bulan** gratis
- ✅ **Tidak perlu kartu kredit** untuk free tier
- ✅ **Fitur lengkap**: Routing, geocoding, satellite imagery
- ✅ **Performance tinggi** dan modern
- ✅ **Customizable styling**

### **Setup Mapbox (5 menit):**

1. **Daftar Mapbox:**
   ```
   1. Buka https://mapbox.com
   2. Klik "Sign up" 
   3. Daftar dengan email (TIDAK PERLU KARTU KREDIT)
   4. Verifikasi email
   ```

2. **Get Access Token:**
   ```
   1. Login ke Mapbox dashboard
   2. Buka "Access tokens" di sidebar
   3. Copy "Default public token"
   4. Token format: pk.eyJ1abc...xyz
   ```

3. **Update Environment:**
   ```bash
   # Edit backend/.env
   MAPBOX_ACCESS_TOKEN=pk.eyJ1abc...xyz
   MAPS_PROVIDER=mapbox
   
   # Edit frontend/.env.local
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1abc...xyz
   NEXT_PUBLIC_MAPS_PROVIDER=mapbox
   ```

## 🌍 **Option 2: OpenStreetMap (GRATIS - Unlimited)**

### **Keunggulan OpenStreetMap:**
- ✅ **Unlimited requests** gratis
- ✅ **Tidak perlu API key**
- ✅ **Open source** dan community-driven
- ✅ **Data global** yang akurat
- ✅ **Zero setup** required

### **Setup OpenStreetMap (1 menit):**

```bash
# Edit backend/.env
MAPS_PROVIDER=openstreetmap

# Edit frontend/.env.local  
NEXT_PUBLIC_MAPS_PROVIDER=openstreetmap
```

**That's it!** Tidak perlu API key atau registrasi.

## 🗺️ **Option 3: Google Maps (GRATIS tapi Butuh Credit Card)**

### **Keunggulan Google Maps:**
- ✅ **$200 credit/bulan** gratis
- ✅ **Fitur paling lengkap**
- ✅ **Data paling akurat**
- ✅ **Street View** integration

### **Kekurangan:**
- ❌ **Butuh kartu kredit** untuk verifikasi
- ❌ **Setup lebih ribet**
- ❌ **Bisa kena charge** jika over limit

## 🚀 **Quick Setup untuk Demo**

### **Recommended: Gunakan Mapbox**

```bash
# 1. Daftar Mapbox (tanpa kartu kredit)
# https://mapbox.com

# 2. Get access token dari dashboard

# 3. Update environment
cp backend/.env.demo backend/.env
cp frontend/.env.demo frontend/.env.local

# 4. Edit backend/.env
MAPBOX_ACCESS_TOKEN=pk.eyJ1abc...xyz
MAPS_PROVIDER=mapbox

# 5. Edit frontend/.env.local
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1abc...xyz
NEXT_PUBLIC_MAPS_PROVIDER=mapbox

# 6. Restart demo
docker-compose -f docker-compose.demo.yml restart
```

### **Fallback: Gunakan OpenStreetMap**

```bash
# Jika Mapbox bermasalah, gunakan OpenStreetMap
# Edit backend/.env
MAPS_PROVIDER=openstreetmap

# Edit frontend/.env.local
NEXT_PUBLIC_MAPS_PROVIDER=openstreetmap

# Restart
docker-compose -f docker-compose.demo.yml restart
```

## 🎭 **Demo Scenarios dengan Maps**

### **Scenario 1: Mapbox (Recommended)**
```
✅ Modern styling dengan satellite imagery
✅ Smooth animations dan interactions
✅ Custom markers dengan icons
✅ Route planning (jika diperlukan)
✅ Perfect untuk presentasi IBM
```

### **Scenario 2: OpenStreetMap (Backup)**
```
✅ Reliable dan selalu available
✅ Good enough untuk demo basic
✅ Markers dan popups berfungsi
✅ Zero dependency pada external services
```

## 🔧 **Troubleshooting Maps**

### **Problem: Mapbox tidak load**
```bash
# Check token di browser console
# Pastikan token dimulai dengan "pk."
# Restart containers
docker-compose -f docker-compose.demo.yml restart frontend
```

### **Problem: OpenStreetMap lambat**
```bash
# Normal, karena free tier
# Tunggu beberapa detik untuk loading
# Atau switch ke Mapbox
```

### **Problem: Maps tidak muncul sama sekali**
```bash
# Check browser console untuk errors
# Pastikan MAPS_PROVIDER sudah di-set
# Restart semua services
docker-compose -f docker-compose.demo.yml restart
```

## 📊 **Comparison Table**

| Feature | Mapbox | OpenStreetMap | Google Maps |
|---------|--------|---------------|-------------|
| **Cost** | Free 50K/month | Free Unlimited | Free $200/month |
| **Setup** | 5 min | 1 min | 15 min |
| **Credit Card** | ❌ No | ❌ No | ✅ Yes |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Features** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Reliability** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Demo Ready** | ✅ Perfect | ✅ Good | ✅ Perfect |

## 🎯 **Recommendation untuk IBM Jakarta Demo**

### **Primary Choice: Mapbox**
- Professional appearance
- Modern styling
- No credit card required
- Perfect untuk impress IBM

### **Backup Choice: OpenStreetMap**
- Zero setup
- Always works
- Good enough untuk demo
- Fallback jika Mapbox bermasalah

### **Avoid: Google Maps**
- Ribet setup karena butuh kartu kredit
- Risk kena charge jika demo banyak diakses
- Tidak worth it untuk demo

## 🚀 **Final Setup Command**

```bash
# Recommended setup untuk demo IBM Jakarta
./scripts/setup-demo.sh

# Saat ditanya maps provider, pilih:
# 1. Mapbox (jika sudah daftar)
# 2. OpenStreetMap (jika ingin zero setup)

# Maps akan otomatis berfungsi di:
# http://localhost:3000
```

---

**💡 Pro Tip:** Untuk demo ke IBM Jakarta, gunakan Mapbox karena tampilannya lebih professional dan modern. Jika ada masalah, OpenStreetMap adalah backup yang reliable!
