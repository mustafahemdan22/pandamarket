'use client';

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function UploadImageButton() {
  const uploadImageMutation = useMutation(api.uploadImage.uploadImage);

  const handleUpload = async () => {
    const storageId = "example-storage-id"; // مؤقت
    await uploadImageMutation({
      storageId,
      title: "My First Image",
      uploadedBy: "Yazan",
    });
    alert("✅ Image uploaded successfully!");
  };

  return (
    <button
      onClick={handleUpload}
      style={{
        backgroundColor: "#0070f3",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      Upload Image
    </button>
  );
}
