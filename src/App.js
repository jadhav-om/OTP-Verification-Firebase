import React, { useState } from "react";
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "./firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";

const App = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);

  // Function to initialize reCAPTCHA
  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible", // Invisible reCAPTCHA
          callback: (response) => {
            console.log("reCAPTCHA completed successfully!");
            onSignup();
          },
          "expired-callback": () => {
            console.log("reCAPTCHA expired!");
          },
        },
        auth
      );
    }
  }

  // Function to send OTP
  // Function to send OTP
function onSignup() {
  setLoading(true);
  onCaptchVerify();

  const appVerifier = window.recaptchaVerifier;
  const formatPh = "+" + ph; // Ensure correct phone number format

  console.log("Sending OTP to phone number:", formatPh); // Log the phone number being used

  signInWithPhoneNumber(auth, formatPh, appVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      setLoading(false);
      setShowOTP(true);
      toast.success("OTP sent successfully!");
    })
    .catch((error) => {
      console.error("Error while sending OTP: ", error.message); // Log the error message
      setLoading(false);
      toast.error(`Failed to send OTP. Reason: ${error.message}`); // Display error message
    });
}

  // Function to verify OTP
  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error verifying OTP: ", err);
        setLoading(false);
        toast.error("Invalid OTP. Please try again.");
      });
  }

  return (
    <section className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center h-screen">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <h2 className="text-center text-white font-semibold text-2xl">
            👍 Login Success
          </h2>
        ) : (
          <div className="w-80 flex flex-col gap-4 rounded-lg p-6 bg-blue-100 shadow-lg">
            <h1 className="text-center leading-normal text-indigo-700 font-bold text-3xl mb-6">
              WELCOME!
            </h1>
            {showOTP ? (
              <>
                <div
                  className="bg-indigo-100 text-indigo-700 mx-auto p-4 rounded-full"
                  style={{ width: "3rem", height: "3rem" }} // Ensures logo remains circular
                >
                  <BsFillShieldLockFill size={30} className="mx-auto" />
                </div>
                <label
                  htmlFor="otp"
                  className="font-bold text-xl text-gray-700 text-center"
                >
                  Enter your OTP
                </label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="opt-container"
                />
                <button
                  onClick={onOTPVerify}
                  className="bg-indigo-600 hover:bg-indigo-700 w-full flex gap-2 items-center justify-center py-2.5 text-white rounded shadow-md"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Verify OTP</span>
                </button>
              </>
            ) : (
              <>
                <div
                  className="bg-indigo-100 text-indigo-700 mx-auto p-4 rounded-full"
                  style={{ width: "3rem", height: "3rem" }} // Ensures logo remains circular
                >
                  <BsTelephoneFill size={30} className="mx-auto" />
                </div>
                <label
                  htmlFor=""
                  className="font-bold text-xl text-gray-700 text-center"
                >
                  Verify your phone number
                </label>
                <PhoneInput country={"in"} value={ph} onChange={setPh} />
                <button
                  onClick={onSignup}
                  className="bg-indigo-600 hover:bg-indigo-700 w-full flex gap-2 items-center justify-center py-2.5 text-white rounded shadow-md"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Send code via SMS</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default App;
