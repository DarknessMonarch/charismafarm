"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEcommerceStore } from "@/app/store/ecommerceStore";
import Loader from "@/app/components/Loader";
import styles from "@/app/style/auth.module.css";


import {
  FiEye as ShowPasswordIcon,
  FiEyeOff as HidePasswordIcon,
} from "react-icons/fi";

import { MdOutlineVpnKey as PasswordIcon } from "react-icons/md";

export default function Reset({ params }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();
  const { resetPassword } = useEcommerceStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleConfirmPassword = () => setConfirmPassword(!showConfirmPassword);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const Login = () => router.push("login", { scroll: false });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password) return toast.error("Password is required");
    if (!formData.confirmPassword)
      return toast.error("Please confirm your password");
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");

    setIsLoading(true);

    try {
      const result = await resetPassword(params?.slug, formData.password);

      if (result.success) {
        toast.success(result.message || "Password reset successful");
        router.push("login", { scroll: false });
      } else {
        toast.error(result.message || "Reset failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
   <div className={styles.authWrapper}>
        <form onSubmit={onSubmit} className={styles.formContainer}>
          <div className={styles.formHeader}>
    
            <h1>Reset Password</h1>
            <p>Enter your new Password</p>
          </div>

          <div className={styles.authInput}>
            <PasswordIcon className={styles.authIcon} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className={styles.showBtn}
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <ShowPasswordIcon className={styles.authIcon} />
              ) : (
                <HidePasswordIcon className={styles.authIcon} />
              )}
            </button>
          </div>

          <div className={styles.authInput}>
            <PasswordIcon className={styles.authIcon} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className={styles.showBtn}
              onClick={toggleConfirmPassword}
            >
              {showConfirmPassword ? (
                <ShowPasswordIcon className={styles.authIcon} />
              ) : (
                <HidePasswordIcon className={styles.authIcon} />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.formAuthButton}
          >
            {isLoading ? <Loader /> : "Reset"}
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
