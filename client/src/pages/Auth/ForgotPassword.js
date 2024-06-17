import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import apiService from "../../app/apiService";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";

const ForgotPassword = () => {
  const [values, setValues] = useState({
    email: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await apiService.post(
        `${process.env.REACT_APP_API}/api/v1/auth/forgot-password`,
        values
      );

      if (data?.status === "User Not Exists!!") {
        toast.error(data?.status);
      } else {
        toast.success("Password reset email sent successfully!");
        navigate("/reset-password"); // Navigate to the ResetPassword component
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to send password reset email. Please try again.");
    }
  };

  const onChangeInput = (key, value) => {
    setValues({ ...values, [key]: value });
  };

  return (
    <Layout title={"Forgot Password"}>
      <div className="form-container" style={{ minHeight: "90vh" }}>
        <h1>RESET PASSWORD</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your Email"
              required
              onChange={(e) => onChangeInput("email", e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            SEND RESET EMAIL
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
