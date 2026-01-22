"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import { useEcommerceStore } from "@/app/store/ecommerceStore";
import styles from "@/app/style/auth.module.css";

import {
  FiEye as ShowPasswordIcon,
  FiEyeOff as HidePasswordIcon,
} from "react-icons/fi";

import { FaRegUser as UserNameIcon } from "react-icons/fa6";
import { MdOutlineVpnKey as PasswordIcon } from "react-icons/md";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useEcommerceStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const forgotPassword = () => {
    router.push("resetcode", { scroll: false });
  };

  const SignUp = () => {
    router.push("signup", { scroll: false });
  };

  async function onSubmit(e) {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        toast.success(result.message || "Welcome");

        switch (true) {
          case result.isAdmin:
            router.push("/", { scroll: false });
            toast.success("Welcome Admin!");
            break;

          case result.isVip && !result.isAdmin:
            router.push("/vip", { scroll: false });
            toast.success("Welcome VIP!");
            break;

          default:
            router.push("/", { scroll: false });
            toast.success("Welcome back!");
            break;
        }
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.authWrapper}>
      <form
        onSubmit={onSubmit}
        className={styles.formContainer}
        autoComplete="on"
      >
        <div className={styles.formHeader}>
     
          <h1>Welcome back</h1>
          <p>Enter your account details</p>
        </div>
        {/* Email */}
        <div className={styles.authInput}>
          <UserNameIcon
            className={styles.authIcon}
            alt="Email icon"
            width={20}
            height={20}
          />
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            autoComplete="username"
            required
          />
        </div>
        {/* Password */}
        <div className={styles.authInput}>
          <PasswordIcon
            className={styles.authIcon}
            alt="password icon"
            width={20}
            height={20}
          />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className={styles.showBtn}
            onClick={toggleShowPassword}
          >
            {showPassword ? (
              <ShowPasswordIcon
                className={styles.authIcon}
                width={20}
                height={20}
              />
            ) : (
              <HidePasswordIcon
                className={styles.authIcon}
                width={20}
                height={20}
              />
            )}
          </button>
        </div>
        {/* Forgot Password */}
        <div className={styles.forgotpasswordspan}>
          <span onClick={forgotPassword}>Forgot Password</span>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={styles.formAuthButton}
        >
          {isLoading ? <Loader /> : "Login"}
        </button>
        <h3>
          Don&apos;t have an account?{" "}
          <div className={styles.btnLoginContainer} onClick={SignUp}>
            Sign up
          </div>
        </h3>
      </form>
    </div>
  );
}
