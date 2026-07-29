# 🛠️ Multi-Tool Playground

A Django REST Framework web application that consolidates multiple tools and games into a single, sleek web platform — featuring a calculator, alarm clock, Snake game, and Dino game.

![Python](https://img.shields.io/badge/Python-3.8%2B-blue?style=flat-square&logo=python)
![Django](https://img.shields.io/badge/Django-4.2-green?style=flat-square&logo=django)
![DRF](https://img.shields.io/badge/DRF-Rest%20Framework-ff5c5c?style=flat-square)
![SQLite](https://img.shields.io/badge/SQLite-07405e?style=flat-square&logo=sqlite)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## ✨ Features

### 🧮 Calculator
- Web-based calculator with a REST API endpoint
- Evaluates mathematical expressions including `sqrt`, `pow`, `abs`, `sin`, `cos`, `tan`, `log`, `factorial`, and constants `pi` and `e`
- API: `POST /cal/api/calculate/` with JSON body `{"expression": "2+2*3"}` returns `{"result": 8}`

### ⏰ Alarm Clock
- Create, list, and soft-delete alarms with labels and times
- Alarms can be toggled active/inactive
- REST API for full CRUD operations
- Endpoints:
  - `GET /alm/api/alarms/` — list active alarms
  - `POST /alm/api/alarms/create/` — create a new alarm
  - `DELETE /alm/api/alarms/delete/<id>/` — soft-delete an alarm

### 🐍 Snake Game
- Browser-based Snake game with session-based high score tracking
- API to get and update high scores via `GET`/`POST /sng/api/score/`

### 🦕 Dino Game
- Browser-based Dino (Chrome dinosaur) game with session-based high score tracking
- API to get and update high scores via `GET`/`POST /dio/api/score/`

---

## 🖥️ Demo

| Calculator | Alarm Clock | Snake Game | Dino Game |
|------------|-------------|------------|-----------|
| `/cal/`    | `/alm/`     | `/sng/`    | `/dio/`   |

### API Root
Visit `/api/` for a JSON overview of all available endpoints.

---

## 🏗️ Project Structure

```
Multi-Tool/
├── config/                  # Django project configuration
│   ├── settings.py          # Project settings & installed apps
│   ├── urls.py              # Root URL routing
│   ├── wsgi.py              # WSGI deployment config
│   └── asgi.py              # ASGI deployment config
├── cal/                     # Calculator app
│   ├── views.py             # Web view + API view
│   ├── api_views.py         # REST API for expression evaluation
│   ├── models.py
│   └── urls.py              # App URL routes
├── alm/                     # Alarm Clock app
│   ├── views.py             # Web view
│   ├── api_views.py         # REST API for CRUD operations
│   ├── models.py            # Alarm model
│   └── urls.py              # App URL routes
├── sng/                     # Snake Game app
│   ├── views.py             # Web view
│   ├── api_views.py         # High score API
│   └── urls.py              # App URL routes
├── dio/                     # Dino Game app
│   ├── views.py             # Web view
│   ├── api_views.py         # High score API
│   └── urls.py              # App URL routes
├── api/                     # API root & documentation
├── templates/               # Base HTML template
├── static/                  # CSS & JS assets per app
│   ├── css/global.css
│   ├── cal/calculator.css
│   ├── cal/calculator.js
│   ├── alm/alarm.css
│   ├── alm/alarm.js
│   ├── sng/snake.css
│   ├── sng/snake.js
│   ├── dio/dino.css
│   └── dio/dino.js
├── manage.py                # Django management script
└── db.sqlite3               # SQLite database
```

---

## 🔌 API Reference

### Calculator
| Method | Endpoint | Body | Returns |
|--------|----------|------|---------|
| POST | `/cal/api/calculate/` | `{"expression": "2+2*3"}` | `{"result": 8}` |

Supported functions: `sqrt`, `pow`, `abs`, `sin`, `cos`, `tan`, `log`, `log10`, `factorial`
Constants: `pi`, `e`

### Alarm Clock
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/alm/api/alarms/` | List all active alarms |
| POST | `/alm/api/alarms/create/` | Create new alarm |
| DELETE | `/alm/api/alarms/delete/<id>/` | Soft-delete alarm |

### Snake Game
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sng/api/score/` | Get high score |
| POST | `/sng/api/score/` | Submit new score |

### Dino Game
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dio/api/score/` | Get high score |
| POST | `/dio/api/score/` | Submit new score |

---

## 🚀 Setup & Installation

### Prerequisites
- Python 3.8+
- pip

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/multi-tool.git
cd multi-tool/config

# 2. Create and activate a virtual environment
python3 -m venv myenv
source myenv/bin/activate

# 3. Install dependencies
pip install django djangorestframework

# 4. Run migrations
python manage.py migrate

# 5. Start the development server
python manage.py runserver

# 6. Open in your browser
# http://127.0.0.1:8000
```

---

## 🎮 Usage

- **Calculator**: Navigate to `/cal/` and use the web calculator, or POST expressions to `/cal/api/calculate/`
- **Alarm Clock**: Navigate to `/alm/` to view and manage alarms via the web UI
- **Snake Game**: Navigate to `/sng/` to play — your high score is tracked per session
- **Dino Game**: Navigate to `/dio/` to play — your high score is tracked per session
- **API Root**: Visit `/api/` for a JSON overview of all available endpoints

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Django 4.2 | Web framework |
| Django REST Framework | API building |
| SQLite | Database |
| HTML / CSS / JS | Frontend |
| Font Awesome 6 | Icons |
| Inter Font | Typography |

---

## 📸 Screenshots

> Add screenshots of your calculator, alarm clock, snake game, and dino game here

```
📸 Add screenshots in a `screenshots/` directory and reference them here
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Django](https://djangoproject.com/) — The web framework used
- [Django REST Framework](https://www.django-rest-framework.org/) — For building the API
- [Font Awesome](https://fontawesome.com/) — Icons
- [Inter Font](https://rsms.me/inter/) — Typography
- [Google Fonts](https://fonts.google.com/) — Font hosting
