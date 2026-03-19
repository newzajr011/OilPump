# 🚀 วิธี Deploy — Oil Pump Dashboard

## วิธีที่ 1: GitHub Pages (ฟรี, ง่ายที่สุด)

### ขั้นตอน
1. สร้าง repository ใหม่บน [github.com](https://github.com)
2. Push ไฟล์ทั้งหมดขึ้นไป:
   ```bash
   cd d:\oil_pump
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo-name>.git
   git push -u origin main
   ```
3. ไปที่ **Settings → Pages → Source** เลือก `main` branch → Save
4. รอ 1-2 นาที จะได้ URL: `https://<username>.github.io/<repo-name>/`

---

## วิธีที่ 2: Nginx / IIS (เซิร์ฟเวอร์ภายในบริษัท)

### Nginx
1. คัดลอกไฟล์ทั้งหมดไปยังเซิร์ฟเวอร์:
   ```
   /var/www/oil-pump/
   ├── index.html
   ├── style.css
   ├── data.js
   └── app.js
   ```
2. สร้างไฟล์ config:
   ```nginx
   server {
       listen 80;
       server_name oil-pump.example.com;
       root /var/www/oil-pump;
       index index.html;

       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```
3. เปิดใช้งาน: `sudo nginx -t && sudo systemctl reload nginx`

### IIS (Windows Server)
1. เปิด **IIS Manager**
2. คลิกขวา **Sites → Add Website**
3. ตั้งชื่อ `OilPump`, Physical path: `D:\oil_pump`, Port: `8080`
4. เข้าใช้งานที่ `http://localhost:8080`

---

## วิธีที่ 3: Python Simple Server (ทดสอบภายใน LAN)

```bash
cd d:\oil_pump
python -m http.server 8000
```
เข้าใช้งานที่ `http://<IP-ของเครื่อง>:8000` จากเครื่องอื่นในเครือข่ายเดียวกัน

---

## วิธีที่ 4: Netlify / Vercel (ฟรี, อัตโนมัติ)

### Netlify
1. ไปที่ [netlify.com](https://netlify.com) → Sign up
2. ลากโฟลเดอร์ `d:\oil_pump` ไปวางบนหน้าเว็บ
3. ได้ URL ทันที เช่น `https://oil-pump.netlify.app`

### Vercel
1. ติดตั้ง: `npm i -g vercel`
2. Deploy:
   ```bash
   cd d:\oil_pump
   vercel --prod
   ```
3. ได้ URL ทันที

---

## หมายเหตุสำคัญ
- เว็บนี้เป็น **Static Site** (HTML/CSS/JS ล้วน) ไม่ต้องใช้ backend
- **Chart.js** โหลดจาก CDN ดังนั้นเครื่องที่เปิดใช้ต้อง**มีอินเทอร์เน็ต**
- หากต้องการใช้ offline ให้ดาวน์โหลด `chart.umd.min.js` มาวางในโฟลเดอร์แล้วแก้ path ใน `index.html`
