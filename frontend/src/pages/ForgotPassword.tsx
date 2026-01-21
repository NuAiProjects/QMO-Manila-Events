import { useState } from "react";
import { resetPassword } from "@/auth/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  async function handleReset() {
    try {
      await resetPassword(email);
      alert("Password reset email sent");
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h1>Reset Password</h1>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <button onClick={handleReset}>Send reset link</button>
    </div>
  );
}
