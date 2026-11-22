# 🏎️ BMW Interactive Showcase

An interactive, full-stack web application built with **React** and **Node.js** designed to showcase luxury BMW models, performance specs, visual customizers, and modern automotive digital experiences.

---

## 🌟 Overview

The **BMW Interactive Showcase** combines a dynamic frontend interface with a fast Node.js backend. Designed with high-performance responsive UI elements, it gives users an immersive experience exploring BMW models, engine specifications, image galleries, and interactive features.

---

## ✨ Features

- **Interactive Vehicle Gallery:** High-resolution visuals with model feature breakdowns.
- **Model Comparison & Specs:** Detailed specifications including engine, horsepower, 0–60 acceleration, and drivetrain.
- **Dynamic Configuration / Filtering:** Filter models by series, fuel type (EV, Hybrid, M Power), and price range.
- **Node.js REST API:** Backend services delivering structured vehicle dataset and backend logic.
- **Modern Responsive Design:** Optimized for mobile, tablet, and high-DPI desktop viewports.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React.js
- **Styling:** CSS3 / Modern Flexbox & Grid
- **State Management:** React Hooks (`useState`, `useEffect`, `useContext`)

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **API Routing:** RESTful APIs for vehicle data

---

## 📁 Project Structure

```text
BMW website/
├── client/              # React frontend application
│   ├── public/          # Public assets & index.html
│   └── src/             # Components, pages, assets, styles
│       ├── components/  # Modular UI components
│       ├── pages/       # Showcase page views
│       └── App.js       # Main React entry point
├── server/              # Node.js / Express backend
│   ├── controllers/     # Route logic
│   ├── data/            # Vehicle specifications & dataset
│   ├── routes/          # Express API endpoints
│   └── server.js        # Node.js server entry point
├── .gitignore           # Git ignore configuration
├── package.json         # Node.js dependencies & scripts
└── README.md            # Project documentation
```

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally on your machine.

### Prerequisites

Make sure you have the following installed on your machine:
- **Node.js** (v14.x or higher)
- **npm** (v6.x or higher) or **yarn**
- **Git**

---

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nakulburkul/bmw-website.git
   cd "BMW website"
   ```

2. **Install Backend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Frontend Dependencies (if separated):**
   ```bash
   cd client
   npm install
   cd ..
   ```

---

### Running the Application

1. **Start the Node.js Server:**
   ```bash
   node server/server.js
   # or using nodemon:
   npm run dev
   ```

2. **Start the React Frontend:**
   ```bash
   cd client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`.

---

## 👤 Author

**Nakul Burkul**
- **GitHub:** [@nakulburkul](https://github.com/nakulburkul)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
