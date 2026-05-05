# Glitch Pimp

Vollständige, funktionionierende Glitch-Umgebung — ready to deploy.

## Quick Start

### Mit Python (lokal sofort verfügbar)
```bash
python -m http.server 3000
```
Dann: `http://localhost:3000`

**Passwort:** `anjelic123`

### Mit Node
```bash
npm install
npm run serve
```

## Struktur

```
glitch-pimp/
├── index.html                 # Hauptseite (Landing + Chat-Demo)
├── dashboard.html             # Benutzer-Dashboard
├── assets/
│   ├── images/               # Icons, Hero-Video, Screenshots
│   └── ...
├── package.json              # Node Dependencies
└── README.md                 # Diese Datei
```

## Features

- ✅ **Hero-Section** mit Video
- ✅ **Chat-Interface** (Alpine.js, Live-Demo)
- ✅ **Drei-Wörter-System** (persistent, no account)
- ✅ **Mastery Levels** (draft → commit → merge → deploy)
- ✅ **Joker-System** (3 pro Azubi)
- ✅ **Export-Funktionen** (Tagebuch, Lernfortschritt)
- ✅ **Dashboard** (Übersicht & Analytics)
- ✅ **SEO/Meta** (OG Tags, JSON-LD)
- ✅ **Mobile-responsive**

## API-Integration

Die Demo verwendet folgende Endpoints:

```
POST /chat              → Chat-Antworten
POST /identify          → Benutzererkennung (Drei-Wörter)
POST /history           → Tagebuch-Export
POST /export            → Lernfortschritt-Export
```

**Aktuell konfiguriert für:** `https://glitch-api.post-666.workers.dev`

Um lokal zu testen: Backend auf Port 3001 starten, dann in `index.html` ändern:
```javascript
API_URL: 'http://localhost:3001',
```

## Deployment

### Vercel
```bash
vercel
```

### GitHub Pages
Push zu `main` Branch, Pages aktivieren.

### Docker
```bash
docker build -t glitch-pimp .
docker run -p 3000:3000 glitch-pimp
```

## Customization

- **Farben:** Siehe `:root` in `<style>` (index.html Zeile ~54)
- **Texte:** Deutsche Strings sind durchsuchbar (Ctrl+F)
- **Features:** Alpine.js `glitchChat()` Komponente ist vollständig dokumentiert

## Status

**Build:** `2026-05-05`  
**Version:** `2.1`  
**Ready:** ✅ Fully functional standalone

---

Made at Unwritten Studio — `glitch.unwritten.studio`
