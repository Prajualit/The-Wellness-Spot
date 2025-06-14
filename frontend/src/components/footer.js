import { useState } from "react";
import emailjs from '@emailjs/browser';
import {
  Mail,
  Phone,
  Instagram,
  Facebook,
  Send,
  MapPin,
  Clock,
  Dumbbell,
} from "lucide-react";

export default function Footer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("");

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      setSubmitStatus("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-20">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            {/* Brand Section */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 group">
                  <div className="p-2 bg-gradient-to-r from-neutral-200 to-neutral-700 rounded-xl group-hover:from-neutral-700 group-hover:to-neutral-200 transition-all duration-300">
                    <Dumbbell className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-bold text-3xl bg-gradient-to-r from-neutral-200 to-neutral-500 bg-clip-text text-transparent">
                    FitPro Trainer
                  </span>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Transform your fitness journey with expert guidance,
                  personalized training, and cutting-edge techniques.
                </p>
              </div>

              {/* Contact Info Cards */}
              <div className="space-y-4">
                <a
                  href="mailto:radhekrishna51@gmail.com"
                  className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group"
                >
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email us</p>
                    <p className="text-white font-medium">
                      radhekrishna51@gmail.com
                    </p>
                  </div>
                </a>

                <a
                  href="tel:+917807066646"
                  className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-green-500/50 transition-all duration-300 group"
                >
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Call us</p>
                    <p className="text-white font-medium">+91 78070 66646</p>
                  </div>
                </a>
              </div>

              {/* Social Media */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Follow Us</h4>
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com/fitprotrainer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-300 hover:scale-110"
                  >
                    <Instagram className="w-6 h-6 text-white" />
                    <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Instagram
                    </span>
                  </a>
                  <a
                    href="https://facebook.com/fitprotrainer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-blue-600 transition-all duration-300 hover:scale-110"
                  >
                    <Facebook className="w-6 h-6 text-white" />
                    <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Facebook
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-neutral-200 to-neutral-700 bg-clip-text text-transparent">
                  Get in Touch
                </h3>
                <p className="text-gray-400">
                  Ready to start your fitness journey? Drop us a message!
                </p>
              </div>

              <div className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl space-y-6">
                <div className="space-y-4">
                  <div className="group">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:bg-white/15"
                    />
                  </div>

                  <div className="group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 group-hover:bg-white/15"
                    />
                  </div>

                  <div className="group">
                    <textarea
                      name="message"
                      placeholder="Tell us about your fitness goals..."
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 resize-none transition-all duration-300 group-hover:bg-white/15"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full relative overflow-hidden px-8 py-4 bg-gradient-to-r bg-white text-black rounded-xl font-semibold transition-all disabled:bg-neutral-600 disabled:text-white hover:text-white hover:bg-black duration-300 transform hover:scale-105 hover:shadow-2xl disabled:scale-100 disabled:shadow-none group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r hover:bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </div>
                  </button>

                  {submitStatus && (
                    <div
                      className={`p-4 rounded-xl text-sm text-center font-medium ${
                        submitStatus.includes("successfully")
                          ? "bg-green-500/20 border border-green-500/30 text-green-400"
                          : "bg-red-500/20 border border-red-500/30 text-red-400"
                      }`}
                    >
                      {submitStatus}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-12 border-t border-white/10">
            <div className="flex flex-col text-gray-400 lg:flex-row items-center justify-between gap-6">
              <span>© 2024 FitPro Trainer. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
