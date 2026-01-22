"use client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import { useEcommerceStore } from "@/app/store/ecommerceStore";
import styles from "@/app/style/auth.module.css";
import { BsQrCode as VerificationIcon } from "react-icons/bs";

export default function Verification() {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const router = useRouter();
  const { verifyEmail, resendVerificationCode, email } = useEcommerceStore();


  useEffect(() => {
    if (!email) {
      toast.error("Please register or login first");
      router.push("/authentication/register");
    }
  }, [email, router]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    if (!email) {
      toast.error("Email not found. Please register again.");
      router.push("/authentication/register");
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyEmail(email, verificationCode);

      if (result.success) {
        toast.success(result.message || "Email verified successfully!");
        // Redirect to home page after successful verification
        setTimeout(() => {
          router.push("/", { scroll: false });
        }, 1000);
      } else {
        toast.error(result.message || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(error.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Email not found. Please register again.");
      router.push("/authentication/register");
      return;
    }

    if (resendTimer > 0) {
      toast.error(`Please wait ${resendTimer} seconds before resending.`);
      return;
    }

    setIsResending(true);

    try {
      const result = await resendVerificationCode(email);

      if (result.success) {
        toast.success(result.message || "Verification code sent to your email!");
        setResendTimer(60); // 60 second cooldown
      } else {
        toast.error(result.message || "Failed to resend code");
      }
    } catch (error) {
      console.error("Resend error:", error);
      toast.error("Failed to resend verification code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h1>Verify your account</h1>
          <p>
            We sent a 6-digit verification code to <strong>{email}</strong>
          </p>
        </div>

        <div className={styles.authInput}>
          <VerificationIcon
            className={styles.authIcon}
            alt="Verification code icon"
            width={20}
            height={20}
          />
          <input
            type="text"
            name="verificationCode"
            id="verificationCode"
            placeholder="000000"
            value={verificationCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // Only allow digits
              if (value.length <= 6) {
                setVerificationCode(value);
              }
            }}
            maxLength={6}
            required
            pattern="[0-9]{6}"
            title="Verification code must be exactly 6 digits"
            autoComplete="off"
            inputMode="numeric"
          />
        </div>

        <div className={styles.authBottomBtn}>
          <button
            type="submit"
            disabled={isLoading || verificationCode.length !== 6}
            className={styles.formAuthButton}
          >
            {isLoading ? <Loader /> : "Verify your account"}
          </button>

          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResending || !email || resendTimer > 0}
            className={styles.resendButton}
          >
            {isResending ? (
              <Loader />
            ) : resendTimer > 0 ? (
              `Resend code in ${resendTimer}s`
            ) : (
              "Resend verification code"
            )}
          </button>
        </div>

        <div className={styles.formFooter}>
          <p>
            Wrong email?{" "}
            <span
              onClick={() => router.push("/authentication/register")}
              style={{ cursor: "pointer", color: "#3b82f6" }}
            >
              Register again
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}