'use client';
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function SignupPage() {
  // ✅ استدعاء الـ mutation بالطريقة الصحيحة
const createUser = useMutation(api.functions.createUser.createUser);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

  try {
  await createUser(formData);
  alert("✅ User created successfully!");
} catch (error: unknown) {
  console.error("❌ Error:", error);

  if (error instanceof Error) {
    alert("❌ Error creating user: " + error.message);
  } else {
    alert("❌ An unexpected error occurred!");
  }
}

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Create Account
        </h1>

        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="w-full border rounded p-2" />
        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="w-full border rounded p-2" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border rounded p-2" />
        <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full border rounded p-2" />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full border rounded p-2" />

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          Create Account
        </button>
      </form>
    </div>
  );
}
