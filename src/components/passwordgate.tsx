import { useState } from "react";

export default function PasswordGate({ onAccess }: { onAccess: () => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const correctPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD;

    if (input === correctPassword) {
      localStorage.setItem("accessGranted", "true");
      onAccess();
    } else {
      setError("Incorrect password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
      <div className="bg-neutral-800 p-6 rounded-xl shadow-xl max-w-md w-full text-center">
        <h2 className="text-xl mb-4">🔒 Access restricted</h2>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 rounded bg-neutral-700 text-white mb-4"
          placeholder="Nooooope ! What's the password ? :D"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
        >
          Confirm
        </button>
        {error && <p className="mt-4 text-red-400">{error}</p>}
      </div>
    </div>
  );
}
