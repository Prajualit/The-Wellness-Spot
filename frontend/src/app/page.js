'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  // redirect to login page
  const { push } = useRouter();
  useEffect(() => {
    push("/login");
  }, [push]);
}
