"use client";

import { toast } from "sonner";
import { useState, useEffect, Suspense } from "react";
import Loader from "@/app/components/Loader";
import { useEcommerceStore } from "@/app/store/ecommerceStore";
import styles from "@/app/style/auth.module.css";
import { useRouter, useSearchParams } from "next/navigation";

import {
  FiEye as ShowPasswordIcon,
  FiEyeOff as HidePasswordIcon,
} from "react-icons/fi";
import { FaRegUser as UserNameIcon } from "react-icons/fa6";
import {
  MdOutlineVpnKey as PasswordIcon,
  MdOutlineEmail as EmailIcon,
} from "react-icons/md";

function SignUpForm() {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [terms, setTerms] = useState(false);
  const [referral, setReferral] = useState(null);
  const [usernameError, setUsernameError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useEcommerceStore();

  useEffect(() => {
    const referralParam = searchParams.get("referral");
    if (referralParam) {
      setReferral(referralParam);
    }
  }, [searchParams]);

  const validateUsername = (username) => {
    if (username.includes("@")) {
      setUsernameError("Username cannot be an email address");
      return false;
    }

    setUsernameError("");
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      validateUsername(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTermsChange = (event) => {
    setTerms(event.target.checked);
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const readTerms = () => {
    router.push("/terms", { scroll: false });
  };

  const Login = () => {
    router.push("login", { scroll: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!validateUsername(formData.username)) {
      toast.error(usernameError);
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return;
    }
    if (!formData.confirmPassword) {
      toast.error("Please confirm your password");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!terms) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      if (referral) {
        userData.referredBy = referral;
      }

      const result = await register(userData);

      if (result.success) {
        toast.success(result.message);
        router.push("verification", { scroll: false });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <form
        onSubmit={handleSubmit}
        className={styles.formContainer}
        autoComplete="on"
      >
        <div className={styles.formHeader}>
          <h1>Welcome</h1>
          <p>Enter your account details</p>
        </div>

        {/* Username */}
        <div className={styles.authInput}>
          <UserNameIcon className={styles.authIcon} width={24} height={24} />
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Username"
            autoComplete="username"
            required
          />
        </div>
        {usernameError && (
          <div className={styles.errorMessage}>{usernameError}</div>
        )}

        {/* Email */}
        <div className={styles.authInput}>
          <EmailIcon className={styles.authIcon} width={24} height={24} />
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            autoComplete="email"
            required
          />
        </div>
        {/* Password */}
        <div className={styles.authInput}>
          <PasswordIcon className={styles.authIcon} width={24} height={24} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            className={styles.showBtn}
            onClick={() => togglePasswordVisibility("password")}
            aria-label="Toggle password visibility"
          >
            {showPassword ? (
              <ShowPasswordIcon
                className={styles.authIcon}
                width={24}
                height={24}
              />
            ) : (
              <HidePasswordIcon
                className={styles.authIcon}
                width={24}
                height={24}
              />
            )}
          </button>
        </div>

        {/* Confirm Password */}
        <div className={styles.authInput}>
          <PasswordIcon className={styles.authIcon} width={24} height={24} />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm Password"
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            className={styles.showBtn}
            onClick={() => togglePasswordVisibility("confirmPassword")}
            aria-label="Toggle confirm password visibility"
          >
            {showConfirmPassword ? (
              <ShowPasswordIcon
                className={styles.authIcon}
                width={24}
                height={24}
              />
            ) : (
              <HidePasswordIcon
                className={styles.authIcon}
                width={24}
                height={24}
              />
            )}
          </button>
        </div>

        <div className={styles.termsContainer}>
          <input
            type="checkbox"
            id="terms"
            checked={terms}
            onChange={handleTermsChange}
            required
          />
          <label htmlFor="terms" onClick={readTerms}>
            Accept terms and conditions
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={styles.formAuthButton}
        >
          {isLoading ? <Loader /> : "Sign up"}
        </button>

        <h3>
          Already have an account?{" "}
          <div className={styles.btnLoginContainer} onClick={Login}>
            Login
          </div>
        </h3>
      </form>
    </div>
  );
}

export default function SignUp() {
  return (
    <Suspense fallback={<Loader />}>
      <SignUpForm />
    </Suspense>
  );
}