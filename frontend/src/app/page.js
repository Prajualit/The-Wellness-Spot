"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Landing from "@/components/Landing";
import About from "@/components/about";
import Testimonials from "@/components/testimonials";
import Product from "@/components/Families";
import Footer from "@/components/footer";
import { useSelector } from "react-redux";

export default function Home() {
  // redirect to login page
  // const { push } = useRouter();
  // useEffect(() => {
  //   push("/login");
  // }, [push]);

  const activeNav = useSelector((state) => state.navbar.activeNav);

  return (
    <div className="w-screen h-screen bg-[#f7fafc]">
      <Navbar />
      <Landing />
      <About />
      <Testimonials />
      <Product />
      <Footer />
    </div>
  );
}
