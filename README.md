# Study Circle — Backend API (v2, matches your real frontend)

This backend now matches your actual app: Batches → Courses → Notes + Study Group chats, an admin approval system, a shared "Ask Anything" board, and the leaderboard/streak system.

---

## 1. Setup

```bash
cd study-circle-backend
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `MONGO_URI` — your MongoDB connection string (MongoDB Atlas free tier is easiest: https://www.mongodb.com/cloud/atlas/register)
- `JWT_SECRET` — any long random string
- Admin usernames/passwords are already filled in to match your frontend's `admin1` / `admin2` accounts — change them if you want.

### Seed the batches & courses (run once)
Your app expects Batch 58–66, each with the same 6 courses (DSA, DBMS, OS, CN, SE, AI). This command creates them in the database:
```bash
npm run seed
```

### Run the server
```bash
npm run dev
```
Visit `http://localhost:5000` — you should see a small JSON message confirming it's running.

---

## 2. How this replaces your `localStorage` code

Your frontend currently keeps everything in the browser via `users.js`, `data.js`, and `community.js`. To connect it to this backend, you'll swap those `localStorage` calls for `fetch` calls to these endpoints. I did **not** edit your frontend files — that's a separate step we can do together once this is running.

| Your frontend function | Replace with this backend call |
|---|---|
| `signUpStudent()` | `POST /api/auth/signup` |
| `signInStudent()` | `POST /api/auth/login` |
| Admin login (`checkAdminPassword`) | `POST /api/auth/admin-login` |
| `approveUser()` / `rejectUser()` / `removeUser()` | `POST /api/admin/users/:username/approve` etc. |
| `getLeaderboard()` | `GET /api/leaderboard` |
| `recordUpload()` | happens automatically when you call the note upload endpoint |
| `DATA.batches` (in data.js) | `GET /api/batches` and `GET /api/batches/:number/courses` |
| Notes in `course.notes` | `GET /api/courses/:id/notes` and `POST /api/courses/:id/notes` (real file upload) |
| Group chat (`group.messages`) | `GET` / `POST /api/courses/:courseId/groups/:groupId/messages` |
| `postCommunityMessage()` | `POST /api/community` |

---

## 3. Full API Reference

### Auth
| Method | Endpoint | Auth | Body | Notes |
|---|---|---|---|---|
| POST | `/api/auth/signup` | No | `{ email, studentId, username }` | Creates a pending student account |
| POST | `/api/auth/login` | No | `{ username }` | No password (matches your prototype). Fails if pending/rejected. |
| POST | `/api/auth/admin-login` | No | `{ username, password }` | For admin1 / admin2 |
| GET | `/api/auth/me` | Yes | — | Returns your own profile |

### Admin (admin token required for all of these)
| Method | Endpoint |
|---|---|
| GET | `/api/admin/users` |
| POST | `/api/admin/users/:username/approve` |
| POST | `/api/admin/users/:username/reject` |
| DELETE | `/api/admin/users/:username` |

### Batches / Courses
| Method | Endpoint |
|---|---|
| GET | `/api/batches` |
| GET | `/api/batches/:number/courses` |
| GET | `/api/courses/:id` (full detail: notes + groups + messages) |

### Notes (real file uploads)
| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/courses/:id/notes` | No | |
| POST | `/api/courses/:id/notes` | Yes | `multipart/form-data`, field name `file` |
| GET | `/api/notes/:id/download` | No | Downloads the real file |

### Group chat
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/courses/:courseId/groups/:groupId/messages` | No |
| POST | `/api/courses/:courseId/groups/:groupId/messages` | Yes — body `{ text }` |

### Community board
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/community` | No |
| POST | `/api/community` | Yes — body `{ text }` |
| DELETE | `/api/community/:id` | Admin only |

### Leaderboard
| Method | Endpoint |
|---|---|
| GET | `/api/leaderboard` |

**Auth header for protected routes:**
```
Authorization: Bearer <token>
```
(token comes from `/api/auth/login` or `/api/auth/admin-login`)

---

## 4. Uploading a file example (from your frontend JS)

```js
const formData = new FormData();
formData.append("file", fileInput.files[0]);

const res = await fetch(`http://localhost:5000/api/courses/${courseId}/notes`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` }, // do NOT set Content-Type manually here
  body: formData,
});
```

---

## 5. Running it for others on your WiFi
The server listens on `0.0.0.0`, so people on the same WiFi can reach it at `http://<your-local-ip>:5000` (find your IP with `ipconfig` on Windows or `ifconfig` on Mac). For access from *any* network, you'd deploy it (e.g. Render, Railway) — ask me when you're ready for that.

---

## 6. Next step
This backend is ready, but your frontend files (`users.js`, `data.js`, `app.js`, `community.js`) still use `localStorage`, not this API. When you're ready, I can go through your actual frontend code with you and swap those pieces over one file at a time, so nothing breaks.
