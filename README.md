# 🏛️ Commons Master

**Commons Master** is a React-based web app for browsing and filtering Canadian federal legislation. It connects to a custom Express.js API to fetch real-time data about bills, including their status, session, and machine-learned topic categories.

🔗 **Live App**: [https://commons-app.netlify.app](https://commons-app.netlify.app)

---

## ✨ Features

- 📜 Browse active and passed Canadian parliamentary bills  
- 🧠 Categories powered by uClassify machine learning  
- 🧭 Filter by session, house (Commons or Senate), and legislative status  
- 🗂️ Paginated results with performance-optimized loading  
- 🧪 Connected to a PostgreSQL + Express.js backend via REST API  

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- NPM

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/mxmitch/commons-master.git
cd commons-master
npm install
```

### Environment Configuration

Create a `.env` file in the root folder (optional if using localhost by default):

```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

### Run the App Locally

```bash
npm start
```

Then visit `http://localhost:3000` in your browser.

---

## 🔌 API Integration

This frontend connects to the [`commons-api-master`](https://github.com/mxmitch/commons-api-master) backend.

The API provides:

- `GET /api/bills` – Fetch bills with filters like status, session, category, and pagination
- `GET /api/categories` – Get list of available bill categories
- `POST /api/auth/register` – Register new users
- `POST /api/auth/login` – Login for user authentication

Make sure the backend server is running and accessible at the base URL defined in your `.env`.

---

## 🗂️ Project Structure

```
src/
├── assets/             # Image files and Material UI css
├── components/         # UI components (cards, headers, layout)
├── helpers/            # Helper functions for validation
├── hooks/              # Loading Spinner
├── utils/              # Axios instance
├── views/              # Page components like Home
├── App.js              # React Router setup and global layout
├── index.js            # App entry point
```

---

## 🧪 Testing (Coming Soon)

Testing will be added using:

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest](https://jestjs.io/)
- [Cypress](https://www.cypress.io/) (for integration testing)

---

## 📸 Screenshots

Coming Soon

## 🛠️ Built With

- [React](https://reactjs.org/)
- [Material UI (MUI)](https://mui.com/)
- [Axios](https://axios-http.com/)
- [React Router](https://reactrouter.com/)
- [Netlify](https://www.netlify.com/) for deployment
- [Express.js API](https://github.com/mxmitch/commons-api-master)
- [PostgreSQL](https://www.postgresql.org/)

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

---

## 🙌 Acknowledgements

- Forked from initial project [`fgfl/commons`](https://github.com/fgfl/commons)
- Parliamentary bill data from [parl.ca](https://www.parl.ca/)
- Category classification powered by [uClassify](https://uclassify.com/)
