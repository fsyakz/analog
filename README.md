# RouteOptimize - Modern Route Optimization App

Aplikasi web modern untuk optimasi rute distribusi dengan React, Next.js, dan Firebase.

## Features

- **Authentication** - Login & Register dengan Firebase
- **Route Optimization** - Algoritma Greedy Nearest Neighbor
- **Real-time Visualization** - Peta interaktif dengan arahan
- **Modern UI** - Beige & Dark Green theme dengan glassmorphism
- **Responsive Design** - Mobile-first approach
- **Vercel Ready** - Optimized untuk deployment

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: Firebase Auth
- **Maps**: Leaflet, React-Leaflet
- **Icons**: Lucide React
- **Deployment**: Vercel

## Installation

```bash
# Clone repository
git clone <repository-url>
cd route-optimize-react

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local

# Run development server
npm run dev
```

## Environment Variables

Buat file `.env.local` dengan konfigurasi berikut:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Map Configuration
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

## Deployment ke Vercel

### Cara 1: Melalui Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel
```

### Cara 2: Melalui GitHub

1. Push code ke GitHub repository
2. Import repository ke Vercel dashboard
3. Setup environment variables di Vercel
4. Deploy otomatis

### Cara 3: Manual Upload

1. Build project:
   ```bash
   npm run build
   ```

2. Upload folder `.next` ke Vercel

## Usage

### 1. Authentication
- Buka `/auth` untuk login atau register
- Gunakan akun demo:
  - Email: `demo@routeoptimize.com`
  - Password: `demo123`

### 2. Route Optimization
- Tambah lokasi melalui form
- Klik "Hitung Rute Optimal"
- Lihat hasil optimasi dengan visualisasi

### 3. Features
- **Dashboard**: Overview statistik dan kontrol
- **Lokasi**: Manajemen titik-titik pengiriman
- **Visualisasi**: Peta interaktif dengan rute
- **Hasil**: Analisis detail optimasi

## Design System

### Color Palette
- **Primary Green**: `#22c55e` - `#14532d`
- **Beige**: `#eab308` - `#713f12`
- **Neutral**: `#fafafa` - `#171717`

### Components
- **Glassmorphism**: Blur effects dengan transparency
- **Animations**: Smooth transitions dengan Framer Motion
- **Responsive**: Mobile-first design approach

## Project Structure

```
route-optimize-react/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── contexts/              # React contexts
│   ├── AuthContext.tsx    # Authentication state
│   └── RouteContext.tsx   # Route optimization state
├── lib/                   # Utilities
│   └── firebase.ts       # Firebase config
├── components/            # Reusable components
├── public/               # Static assets
└── styles/              # CSS files
```

## Firebase Setup

1. Buat project baru di [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Setup Firestore database
4. Copy konfigurasi ke `.env.local`

## Map Setup

1. Daftar ke [Mapbox](https://www.mapbox.com/)
2. Buat access token
3. Tambahkan ke environment variables

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - lihat [LICENSE](LICENSE) file untuk detail.

## 🆘 Troubleshooting

### Common Issues

1. **Build Error**: Pastikan semua dependencies terinstall
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Firebase Error**: Check environment variables
3. **Map tidak muncul**: Pastikan Mapbox token valid

### Performance Tips

- Gunakan `next/image` untuk optimasi gambar
- Implement lazy loading untuk components
- Optimize bundle size dengan dynamic imports

## Support

Hubungi:
- Email: support@routeoptimize.com
- GitHub Issues: [Create Issue](https://github.com/username/repo/issues)

---

**Built with passion using Next.js, React, and Firebase**
