// lib/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
  withCredentials: true, // ensures cookies (like accessToken) are sent
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
