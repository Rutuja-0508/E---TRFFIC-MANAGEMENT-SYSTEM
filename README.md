# E-Traffic CCS — City Command System

A real-time traffic management web application built with HTML, CSS and JavaScript.

## 📁 Project Structure

```
etraffic-ccs/
├── index.html      ← Main HTML file (open this in browser)
├── styles.css      ← All CSS styles
├── app.js          ← All JavaScript logic + mock backend
└── README.md       ← This file
```

## 🚀 How to Run

1. Download all 4 files into the **same folder**
2. Open the folder in **VS Code**
3. Install the **Live Server** extension in VS Code
4. Right-click `index.html` → Click **"Open with Live Server"**
5. The app will open in your browser at `http://127.0.0.1:5500`

## 🔑 Demo Login Credentials

### Government Portal
| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin Officer |
| officer | officer123 | Traffic Inspector |

### Citizen Portal
| Username | Password |
|----------|----------|
| public | public123 |
| riya | riya123 |

## 🌐 Deploy to GitHub Pages

1. Push all files to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to **main branch / root**
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`

## 🛠️ Features

- **Government Portal** — Signal control, incident management, vehicle registry, challan issuance, roads & rules database
- **Citizen Portal** — Live alerts, traffic map, issue reporting, road rules
- **Live Updates** — Signal timers update every 1.5 seconds in real-time
- **Mock Backend** — Fully functional in-browser API (no server needed)
