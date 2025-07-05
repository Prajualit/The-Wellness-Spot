"use client";
import { useState } from "react";
import Navbar from "../Navbar";
import Footer from "../footer";

export default function BookSessionForm({ onClose, isModal = false }) {
  const [form, setForm] = useState({
    name: "",
    sessionType: "Online",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `New session booking request from "${form.name}" wanting session type "${form.sessionType}" and a message: "${form.message}"`;
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      text
    )}`;
    window.open(url, "_blank");
    if (onClose) onClose();
  };

  // Modal version (already centered)
  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-xl max-w-sm w-full mx-4"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Book a Session
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="sessionType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Session Type
              </label>
              <select
                id="sessionType"
                name="sessionType"
                value={form.sessionType}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Message (optional)
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 h-24 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
            >
              Send on WhatsApp
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Non-modal version: center on screen
  return (
    <div>
      <Navbar />
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col xl:w-[50%] sm:w-[80%] w-full border-4 gap-4 bg-white p-6 sm:rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-800">Book a Session</h2>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="sessionType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Session Type
            </label>
            <select
              id="sessionType"
              name="sessionType"
              value={form.sessionType}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Message (optional)
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 h-24 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 mt-2 max-md:flex-col">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
            >
              Send on WhatsApp
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
