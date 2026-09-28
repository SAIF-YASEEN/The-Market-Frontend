import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ShieldCheck,
  ShoppingCart,
  Loader2,
} from "lucide-react";

import "./RegisterForm.css";
import sendRegistrationVerificationCode from "../../API/Auth/sendRegistrationVerificationCode";
import { type RegisterPayload } from "../../API/Auth/register";
import { getDeviceId } from "../../Utils/deviceId";
import { registerUser } from "./../../API/Auth/register";

function RegisterForm() {
  const [formData, setFormData] = useState<RegisterPayload>({
    username: "",
    email: "",
    password: "",
    deviceId: getDeviceId(),
  });
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [isVerificationSent, setIsVerificationSent] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSendVerification = async () => {
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await sendRegistrationVerificationCode(
        formData.email,
        formData.username,
      );

      /*
       * Show the exact message returned
       * by the backend.
       */
      if (response.success) {
        setSuccessMessage(
          response.message || "Verification code sent successfully.",
        );

        /*
         * Move to verification stage
         * only after successful response.
         */
        setIsVerificationSent(true);

        return;
      }

      setError(response.message || "Unable to send verification code.");
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong while sending the verification code.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    /*
     * STAGE 1
     *
     * Send verification code.
     */
    if (!isVerificationSent) {
      await handleSendVerification();
      return;
    }

    /*
     * STAGE 2
     *
     * Verify code and create account.
     */
    const code = verificationCode.trim();

    if (!code) {
      setError("Please enter the verification code.");
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError("Verification code must be 6 digits.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        deviceId: formData.deviceId,
        verificationCode: code,
      });

      if (response.success) {
        setSuccessMessage(response.message || "Account created successfully.");
        navigate("/");

        return;
      }

      setError(response.message || "Registration failed.");
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong while creating your account.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register_page_wrapper">
      <main className="register_page_card">
        {/* =========================
            BRAND
        ========================= */}

        <div className="register_page_brand">
          <ShoppingCart
            className="register_page_brand_icon"
            size={48}
            strokeWidth={2}
          />

          <span className="register_page_brand_name">The Market</span>
        </div>

        {/* =========================
            HEADER
        ========================= */}

        <div className="register_page_header">
          <h1>
            {isVerificationSent ? "Verify your email" : "Create your account"}
          </h1>

          <p>
            {isVerificationSent
              ? "Enter the verification code we sent to your email."
              : "Join The Market and start shopping with a simple and secure experience."}
          </p>
        </div>

        {/* =========================
            ERROR RESPONSE
        ========================= */}

        {error && (
          <div className="register_page_error" role="alert">
            {error}
          </div>
        )}

        {/* =========================
            BACKEND RESPONSE
        ========================= */}

        {successMessage && (
          <div className="register_page_success" role="status">
            {successMessage}
          </div>
        )}

        {/* =========================
            FORM
        ========================= */}

        <form className="register_page_form" onSubmit={handleSubmit}>
          {/* =================================
              STAGE 1
              ACCOUNT INFORMATION
          ================================= */}

          {!isVerificationSent && (
            <>
              {/* Username */}

              <div className="register_page_field">
                <label htmlFor="username">Username</label>

                <div className="register_page_input_wrapper">
                  <User size={18} />

                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Email */}

              <div className="register_page_field">
                <label htmlFor="email">Email address</label>

                <div className="register_page_input_wrapper">
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

              {/* Password */}

              <div className="register_page_field">
                <label htmlFor="password">Password</label>

                <div className="register_page_input_wrapper">
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
                    className="register_page_password_toggle"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Send Verification */}

              <button
                type="submit"
                className="register_page_submit_button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="register_page_loader" />

                    <span>Sending verification code...</span>
                  </>
                ) : (
                  "Send verification code"
                )}
              </button>
            </>
          )}

          {/* =================================
              STAGE 2
              EMAIL VERIFICATION
          ================================= */}

          {isVerificationSent && (
            <div className="register_page_verification_container">
              <div className="register_page_field">
                <label htmlFor="verificationCode">Verification code</label>

                <div className="register_page_input_wrapper register_page_verification_input">
                  <ShieldCheck size={19} />

                  <input
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(event) =>
                      setVerificationCode(event.target.value)
                    }
                    maxLength={6}
                    required
                    autoComplete="one-time-code"
                    autoFocus
                  />
                </div>

                <span className="register_page_verification_hint">
                  We sent a 6-digit verification code to{" "}
                  <strong>{formData.email}</strong>
                </span>
              </div>

              <button
                type="submit"
                className="register_page_submit_button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="register_page_loader" />

                    <span>Verifying...</span>
                  </>
                ) : (
                  "Verify and create account"
                )}
              </button>
            </div>
          )}
        </form>

        {/* =========================
            LOGIN
        ========================= */}

        <p className="register_page_login_text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </main>
    </div>
  );
}

export default RegisterForm;
