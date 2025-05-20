import { useState } from "react";

export default function UserInfoForm({ onNext }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleNext = () => {
    if (!name.trim() || !phone.trim()) {
      alert("Please enter both name and phone");
      return;
    }
    onNext({ name, phone }); // send data to parent
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Phone (e.g., +919876543210)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={handleNext}>Next</button>
    </div>
  );
}
