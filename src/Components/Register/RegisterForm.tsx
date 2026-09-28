import { useState, type ChangeEvent, type FormEvent } from "react";

import { Link } from "react-router-dom";

import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

import "./RegisterForm.css";

import { registerUser, type RegisterPayload } from "../../API/Auth/register";

import { getDeviceId } from "../../Utils/deviceId";

function RegisterForm() {
  const [formData, setFormData] = useState<RegisterPayload>({
    username: "",
    email: "",
    password: "",
    deviceId: getDeviceId(),
  });

  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const response = await registerUser(formData);

      console.log(response.message);
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-form-wrapper">
      <div className="register-form-card">
        <div className="register-form-header">
          <div className="register-logo">TM</div>

          <h1>Create your account</h1>

          <p>Join The Market and start shopping.</p>
        </div>

        {error && <div className="register-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="register-field">
            <label htmlFor="username">Username</label>

            <div className="register-input-wrapper">
              <User size={18} />

              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="email">Email</label>

            <div className="register-input-wrapper">
              <Mail size={18} />

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="password">Password</label>

            <div className="register-input-wrapper">
              <Lock size={18} />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="register-submit-button"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="register-login-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
