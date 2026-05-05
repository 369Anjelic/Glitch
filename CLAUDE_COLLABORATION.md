# Wie Claude mit diesem Projekt arbeiten soll

**Projekt:** Glitch Local - IHK Prüfungsvorbereitung  
**Benutzer:** Anjel (direkter, pragmatischer Arbeitsstil)  
**Letzte Session:** 2026-05-05

---

## 🎯 Work Style

### ✅ Was funktioniert mit diesem Benutzer:

1. **Direkt machen, nicht fragen**
   - Benutzer sagt "baue das hier rein" → sofort bauen
   - Nicht "Sollen wir...?" oder "Möchtest du...?"
   - Action > Diskussion

2. **Auf Deutsch arbeiten**
   - Alle Kommunikation auf Deutsch
   - Deutsche Code-Kommentare wo relevant
   - Deutsche Feature-Namen in Messages

3. **Code statt Erklärungen**
   - Benutzer will sehen, dass es funktioniert
   - Weniger Theory-Blabla
   - "Zeige mir die Seite" = öffne den Browser direkt

4. **Pragmatisch, nicht perfekt**
   - Nicht warten auf "perfekte" Architektur
   - "Gut genug" ist oft besser als perfect
   - Iteration über Diskussion

5. **Commitment wichtig**
   - Commits mit aussagekräftigen Messages
   - Progress speichern (git, memory, checkpoints)
   - Status transparent halten

### ❌ Was nicht funktioniert:

- Zu viele Fragen stellen ("Sollen wir...?")
- Lange Erklärungen ohne Code
- Verzögerung durch Planung
- Über-Engineering
- Passive Vorschläge ("Du könntest...")

---

## 🔧 Technische Anforderungen für dieses Projekt

### Server-Ports:
- **3003:** Claude API Backend (Node.js)
- **3002:** HTTP Web Server (für index.html)
- **Login.html:** Passwort-geschützt (anjelic123)

### Muss immer vorhanden sein:
1. `/chat` Endpoint (Claude API Integration)
2. Progress-Tracking (localStorage)
3. 18 Lernfelder (alle IHK-Fächer)
4. Python-Code-Beispiele (jedes Topic)
5. Git Commits (für Tracking)

### Deployment:
- Docker-ready (Dockerfile vorhanden)
- Vercel-compatible (vercel.json vorhanden)
- .env für ANTHROPIC_API_KEY

---

## 📋 Typischer Workflow mit diesem Benutzer

```
1. Benutzer: "baue mir X"
2. Claude: (sofort anfangen, nicht fragen)
3. Claude: Änderungen machen
4. Claude: Git commit
5. Claude: "✅ Fertig, Open: [URL]"
6. Benutzer: (testet im Browser)
7. Benutzer: "debug, da ist ein problem" oder "weiter mit Y"
8. repeat
```

---

## 🚨 Fehler vermeiden

### Häufige Fehler in vergangenen Sessions:

1. **Bash Heredoc mit Quotes** → PowerShell nutzen für Windows
2. **Port Conflicts** → Immer alte Prozesse killen zuerst
3. **Zu viele Felder auf einmal** → Sidebar wird zu groß (use scrollbar)
4. **API Timeout** → Claude Opus 4.7 nutzen, max_tokens optimieren
5. **localStorage nicht aktualisiert** → Browser-Cache löschen / hard refresh

### Best Practices:

- Immer `git status` vor commits checken
- Progress Bar CSS muss `text-overflow: ellipsis` haben
- updateProgress() wird aufgerufen wenn Topic geklickt wird
- `.env` muss ANTHROPIC_API_KEY haben
- Sidebar max-height: 80vh + overflow-y: auto für lange Listen

---

## 💾 Persistenz

### Was wird wo gespeichert:

| Was | Wo | Format | Zweck |
|-----|----|---------| ------|
| User Sessions | `data/*.json` | JSON | 3-Wort Identifier System |
| Progress | `localStorage` | JSON | % pro Lernfeld |
| Chats | `localStorage` | JSON | Gesprächshistorie |
| Git History | `.git/` | Git Objects | Version Control |
| Checkpoints | `GLITCH_CHECKPOINT.md` | Markdown | Projektstand-Doku |

---

## 🎓 Projekt-Kontext

**Ziel:** IHK-Prüfungsvorbereitung für Fachinformatiker (Anwendungsentwicklung)

**Ansatz:**
- Nicht 18 generische Felder, sondern **Python-fokussiert**
- Nicht nur "Stoff lernen", sondern "Prüfung denken"
- Progress-Tracking damit der Benutzer sieht, wie weit er ist
- 3-Wort System für Persistenz ohne Accounts

**Exam-Struktur:**
- Schriftlich 60% (LF2, LF3, LF4, LF5, LF6, LF1)
- Praktisch 40% (LF10, LF11, LF12)

---

## 📝 Was für die nächste Session wichtig ist:

1. Server muss laufen: `npm start` auf Port 3003
2. HTTP Server: `python -m http.server 3002`
3. Browser: http://localhost:3002/login.html
4. Password: `anjelic123`
5. Alle 18 LF sind da mit Python-Code-Beispielen
6. Progress wird getrackt in localStorage
7. Commits sind lokal (4 neue), können pushed werden

---

## ✨ Zusammenfassung für Claude-Instanzen in Zukunft:

> Mit diesem Benutzer: Direkter arbeiten, weniger fragen, sofort Aktion. Pragmatisch, Python-fokussiert, Deutsch. Code > Erklärungen. Commits wichtig. Tests im Browser. Status transparent. Fehler debuggen statt planen.

**Projekt-Status:** Production-Ready ✅  
**Letzte Änderung:** 2026-05-05  
**Nächster Schritt:** Push zu origin/main oder weiterbauen?
