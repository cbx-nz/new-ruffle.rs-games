# Online Maths Club — Advanced Mathematics & STEM Modeling

Putting Flash back on the web, disguised as an authentic interactive mathematics and STEM laboratory with Vercel serverless functions, a dynamic REST API, and academic cloaking.

    PRODUCTION: https://onlinemathsclub.vercel.app/
    MIRROR:     https://maths.cbx.kiwi

---

## 🧮 Features & Academic Disguise

- **Educational Stealth Cloak**: Disguises all games as genuine STEM problem sets, calculus trajectory modules, and spatial topology simulations (e.g. `PHYS-204: Kinetic Trajectories & Vector Analysis` for Bloons TD).
- **Panic / Boss Key**: Pressing `Esc` or `` ` `` (backtick) immediately pauses the game, mutes audio, changes the browser tab to `Desmos Scientific Calculator | Online Practice`, and displays an authentic working scientific calculator with formula notes.
- **Embedded Math Tools**: Built-in full scientific calculator, calculus/trig formula reference sheets, and quick links to Desmos and Khan Academy.
- **Vercel Serverless Functions (`/api/*`)**: Clean RESTful API for querying games, categories, recommendations, and random challenges.
- **Universal Player (`/player.html?id=<id>` or `/play/:id`)**: One unified player supporting Ruffle Flash and Unity/WebGL with customizable letterboxing, fullscreen, and disguise headers.
- **100% Backwards Compatible**: All legacy `/players/*.html` paths and datalist `<option>` formats continue to work seamlessly.

---

## 🚀 API Endpoints

### 1. Get All Games / Search
```http
GET /api/games
```
**Query Parameters:**
- `q=<search>`: Search across game titles, math titles, course codes, and tags.
- `category=<name>`: Filter by academic category (`Kinematics & Dynamics`, `Spatial Geometry & Topology`, `Resource Optimization`, `Computational Logic`, `Fluid & Thermodynamics`, `3D WebGL Labs`).
- `type=<flash|unity|webgl>`: Filter by engine type.
- `disguise=true`: Formats titles strictly as course numbers and academic topics.
- `format=html`: Returns datalist `<option>` markup for legacy HTML frontends.
- `random=true`: Returns a single random game.

**Example Response:**
```json
{
  "success": true,
  "total": 68,
  "categories": [
    { "name": "Kinematics & Dynamics", "count": 21 },
    { "name": "Spatial Geometry & Topology", "count": 7 },
    { "name": "Resource Optimization", "count": 24 },
    { "name": "Computational Logic", "count": 11 },
    { "name": "Fluid & Thermodynamics", "count": 3 },
    { "name": "3D WebGL Labs", "count": 2 }
  ],
  "games": [
    {
      "id": "bloonstd",
      "title": "Bloons Tower Defense",
      "mathTitle": "Vector Range Optimization & Rate of Change (Bloons TD)",
      "shortMathTitle": "Vector Range Optimization & Rate of Change",
      "courseCode": "CALC-205",
      "category": "Kinematics & Dynamics",
      "type": "flash",
      "playerUrl": "/player.html?id=bloonstd"
    }
  ]
}
```

### 2. Single Game Lookup & Recommendations
```http
GET /api/game?id=bloonstd
```
Returns game metadata and 4 related modules in the same academic subject.

### 3. Random Module
```http
GET /api/random
GET /api/random?redirect=true
```

---

## 🛠️ Local Development & Deployment

### Run Locally:
```bash
npm install
npm start
```
Starts Express server at `http://localhost:3015/` with identical Vercel serverless routing, API endpoints, and WASM/SWF MIME headers.

### Deploy to Vercel:
Push to your GitHub repository connected to Vercel, or run:
```bash
vercel --prod
```
The included `vercel.json` automatically configures routes, serverless functions in `/api`, WASM caching, and clean URLs.
