# Fimmit

**Find open-source issues that fit your stack, interests, and experience.**

Fimmit is an open-source contribution discovery platform designed to help developers find relevant GitHub issues without spending hours searching manually. It connects your GitHub profile and preferences with issue recommendations to make getting started with open source easier.

## 🌐 Live Demo

- **Frontend:** [Fimmit on Vercel](https://team-task-frontend-henna.vercel.app/)
- **Frontend Repository:** [Team-Task-Frontend](https://github.com/ManishKumar1309/Team-Task-Frontend)
- **Backend API:** [Fimmit Backend](https://fimmit-backend.onrender.com)

## ✨ Features

- **GitHub Authentication** — Sign in using your GitHub account.
- **Personalized Onboarding** — Set your preferred technologies, interests, and difficulty level.
- **Issue Recommendations** — Discover open-source issues based on your preferences and profile.
- **Issue Details** — View issue information and open the original GitHub issue.
- **Save Issues** — Keep track of issues you want to explore.
- **Profile Integration** — Use GitHub profile information to support personalized recommendations.
- **Responsive Interface** — Explore recommendations through a clean, accessible interface.
- **Loading, Error, and Empty States** — Receive appropriate feedback while data is loading or when results are unavailable.

*Feature availability depends on the current frontend and backend implementation.*

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| Vite | Development server and build tooling |
| JavaScript | Application logic |
| CSS | Styling and responsive layouts |
| GitHub OAuth | User authentication |
| REST API | Communication with the backend |
| Vercel | Frontend deployment |
| Render | Backend hosting |

## 🔗 Backend Integration

The frontend communicates with the Fimmit backend for authentication, user profile information, preferences, and issue recommendations.

Production API base URL:

```text
https://fimmit-backend.onrender.com
```

The frontend and backend must have compatible authentication, API endpoint, and CORS configurations for the deployed application to work correctly.

## 📁 Project Structure

```text
Team-Task-Frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── .env
├── .gitignore
├── package.json
└── README.md
```

*This is a high-level overview. Actual folders and files may vary as the project evolves.*

## 🧑‍💻 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and test them locally.
4. Commit your changes with a descriptive message.
5. Open a pull request describing your changes.

Please avoid committing environment files, credentials, or generated build artifacts.

## 🔮 Future Improvements

Potential areas for further development include:

- More detailed explanations for recommendation rankings.
- Improved issue-label and technology-tag mapping.
- Enhanced saved-issue and contribution tracking.
- Additional accessibility and responsive-design improvements.

---

*Built to make your first open-source contribution a little less intimidating.*
