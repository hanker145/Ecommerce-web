import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useNavigate, useLocation } from "react-router-dom";
import apiService from "../../app/apiService";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiService.post(
        `${process.env.REACT_APP_API}/api/v1/auth/login`,
        values
      );
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        setAuth({ ...auth, user: res.data.user, token: res.data.token });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something happened");
    }
  };

  const onChangeInput = (key, value) => {
    setValues({ ...values, [key]: value });
  };

  return (
    <Layout title={"Register final app"}>
      <div className="form-container " style={{ minHeight: "90vh" }}>
        <h1>LOGIN</h1>
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
          <div className="mb-3 login-password">
            <input
              type={passwordVisible ? "text" : "password"}
              autoComplete="on"
              className="form-control"
              placeholder="Enter your Password"
              required
              onChange={(e) => onChangeInput("password", e.target.value)}
            />
            <img
              src="/images/eye-close.png"
              alt="eyeicon"
              id="eyeicon"
              onClick={togglePasswordVisibility}
            />
          </div>
          <div className="mb-3">
            <button type="submit" className="btn btn-primary">
              LOGIN
            </button>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              navigate("/forgot-password");
            }}
          >
            Forgot Password
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
