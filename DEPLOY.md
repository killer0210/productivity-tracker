# Deployment Guide

## Шаардлага

- GitHub account
- [Vercel](https://vercel.com) account (GitHub-аар нэвтрэх)
- [Render](https://render.com) account (GitHub-аар нэвтрэх)
- [MongoDB Atlas](https://cloud.mongodb.com) cluster

---

## 1. MongoDB Atlas тохиргоо

### IP Whitelist
1. [cloud.mongodb.com](https://cloud.mongodb.com) → **Network Access**
2. **Add IP Address** → **Allow Access from Anywhere** → `0.0.0.0/0`
3. **Confirm**

> Render free tier дээр IP тогтмол биш тул бүх IP зөвшөөрөх шаардлагатай.

---

## 2. GitHub-д push хийх

```bash
git remote add origin https://github.com/<username>/<repo>.git
git branch -M main
git push -u origin main
```

---

## 3. Backend — Render

### Web Service үүсгэх
1. [render.com](https://render.com) → **New → Web Service**
2. GitHub repo холбох
3. Дараах тохиргоог оруулах:

| Талбар | Утга |
|--------|------|
| Root Directory | `server` |
| Runtime | `Node` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | Free |

### Environment Variables
Render → **Environment** tab:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://<user>:<pass>@cluster.mongodb.net/...` |
| `JWT_SECRET` | өөрийн нууц үг |
| `CLIENT_URL` | Vercel frontend URL (доор тохируулна) |
| `PORT` | `5000` |

### Deploy
**Save** → Render автоматаар deploy хийнэ (~2 минут)

Амжилттай бол log дээр дараах харагдана:
```
MongoDB connected: ...
Server running on port 5000
==> Your service is live
```

---

## 4. Frontend — Vercel

### client/.env.production үүсгэх

```bash
# client/.env.production
VITE_API_URL=https://<таны-render-url>.onrender.com/api
```

GitHub-д push хийх:
```bash
git add client/.env.production
git commit -m "feat: add production API URL"
git push origin main
```

### Vercel дээр deploy
1. [vercel.com](https://vercel.com) → **New Project**
2. GitHub repo import хийх
3. Дараах тохиргоог оруулах:

| Талбар | Утга |
|--------|------|
| Root Directory | `client` |
| Framework Preset | Vite |

4. **Deploy** дарна

### Production URL авах
Deploy дууссаны дараа Vercel `https://<project-name>.vercel.app` URL өгнө.

---

## 5. CORS тохиргоо дуусгах

Render → **Environment** → `CLIENT_URL` утгыг Vercel URL-ээр шинэчлэх:

```
CLIENT_URL = https://<project-name>.vercel.app
```

Render автоматаар redeploy хийнэ.

---

## 6. Шалгах

| Flow | URL |
|------|-----|
| Frontend | `https://<project>.vercel.app` |
| Backend health | `https://<project>.onrender.com/api/health` |

Backend health endpoint амжилттай бол:
```json
{ "status": "ok" }
```

---

## Нийтлэг алдаа

| Алдаа | Шалтгаан | Засах |
|-------|----------|-------|
| `CORS policy` | CLIENT_URL таарахгүй | Render env дахь CLIENT_URL шалгах |
| `DB connection failed` | MongoDB IP whitelist | Atlas → `0.0.0.0/0` нэмэх |
| `Exited with status 1` | Env variable байхгүй | Render env бүгдийг нэмсэн эсэх шалгах |
| `404 Not Found` | VITE_API_URL тохируулаагүй | `client/.env.production` файл нэмэх |
| Build command error | `npm` гэж бичсэн | `npm install` болгох |

---

## Дахин deploy хийх (код өөрчлөлтийн дараа)

```bash
git add .
git commit -m "feat: ..."
git push origin main
```

Vercel болон Render хоёул GitHub-тай холбогдсон тул **автоматаар** redeploy хийгдэнэ.
