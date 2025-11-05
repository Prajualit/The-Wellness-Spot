# The Wellness Spot

A comprehensive full-stack web application for fitness, nutrition, and wellness coaching. The platform enables users to book sessions, explore premium products, interact with certified coaches, and manage their wellness journey with a modern, responsive interface.

---

## 🚀 Features

- **User Authentication:** OTP-based login via Firebase for secure access.
- **Session Booking:** Book online/offline wellness sessions; booking details sent to WhatsApp and optionally stored in Google Sheets.
- **Product Showcase:** Video/image carousels for featured products and services.
- **Coach Profiles:** Display of certified wellness coaches with experience, certifications, and social links.
- **Admin Dashboard:** User management, record addition, avatar updates, and protected admin routes.
- **Nutrition & Consultation:** Nutrition plans, consultation booking, and query storage via Google Sheets.
- **Testimonials & Social Proof:** Client testimonials, money-back guarantee, and service highlights.
- **Responsive UI:** Mobile-friendly, modern design with custom SVGs and images.

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js (React)
- Tailwind CSS
- Redux Toolkit
- Swiper.js (carousels)
- Axios
- Firebase (OTP authentication)

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- Google Sheets API
- Cloudinary (image uploads)
- Firebase Admin SDK

**Other:**
- Vercel (frontend hosting)
- Environment variables for configuration

---

## 📦 Project Structure

```
client-work-jyoti-prakash/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── firebase/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── redux/
│   │   └── utils/
│   ├── public/
│   ├── .env.local
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── credentials/
│   ├── db/
│   ├── lib/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```sh
git clone https://github.com/yourusername/the-wellness-spot.git
cd the-wellness-spot
```

### 2. Install dependencies

```sh
cd frontend
npm install

cd ../backend
npm install
```

### 3. Environment Variables

- **Frontend:**  
  Copy `.env.example` to `.env.local` in the `frontend` directory and fill in the required values.

- **Backend:**  
  Copy `.env.example` to `.env` in the `backend` directory and fill in the required values (Firebase, Google Cloud, Cloudinary, etc.).

### 4. Start the development servers

**Frontend:**
```sh
cd frontend
npm run dev
```

**Backend:**
```sh
cd backend
nodemon index.js
```

---

## 🌐 API & Integrations

- **Google Sheets API:** Store user queries and bookings.
- **Cloudinary API:** Image uploads for avatars and products.
- **Firebase Admin SDK:** User authentication and verification.
- **WhatsApp API (wa.me):** Booking details sent directly to WhatsApp.

---

## 📝 Usage

- Visit the home page to explore services and products.
- Book a session (online/offline) and receive confirmation via WhatsApp.
- Browse coach profiles and testimonials.
- Admins can manage users and records via the dashboard.

---

## 🧑‍💻 Contributing

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Firebase](https://firebase.google.com/)
- [Cloudinary](https://cloudinary.com/)
- [Google Cloud](https://cloud.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Swiper.js](https://swiperjs.com/)

---

## 📬 Contact

For questions or support, please contact [your-email@example.com].

---

**Happy coding and stay healthy!**
