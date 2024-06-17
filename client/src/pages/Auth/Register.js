import React from "react";
import Layout from "./../../components/Layout/Layout";
import apiService from "../../app/apiService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { useFormik } from "formik";
import * as Yup from "yup";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(
          /[!@#$%^&*(),.?":{}|<>]/,
          "Password must contain at least one symbol"
        )
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(
          /[a-z]/,
          "Password must contain at least one lowercase letter"
        ),
      phone: Yup.string()
        .required("Phone is required")
        .matches(/^\d{10}$/, "Phone Number must be 10 digits"),

      address: Yup.string().required("Address is required"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await apiService.post("/api/v1/auth/register", values);
        if (res && res.data.success) {
          toast.success(res.data && res.data.message);
          navigate("/login");
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    },
  });

  return (
    <Layout title="Register - Ecommer App">
      <div className="form-container" style={{ minHeight: "90vh" }}>
        <form onSubmit={formik.handleSubmit}>
          <h4 className="title">REGISTER FORM</h4>
          <div className="mb-3">
            <input
              type="text"
              {...formik.getFieldProps("name")}
              className="form-control"
              id="name"
              placeholder="Enter Your Name"
              autoFocus
            />
            {formik.touched.name && formik.errors.name && (
              <div className="error error-red">{formik.errors.name}</div>
            )}
          </div>
          <div className="mb-3">
            <input
              type="email"
              {...formik.getFieldProps("email")}
              className="form-control"
              id="email"
              placeholder="Enter Your Email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="error error-red">{formik.errors.email}</div>
            )}
          </div>
          <div className="mb-3 password-input-row">
            <input
              type={showPassword ? "text" : "password"}
              {...formik.getFieldProps("password")}
              className="form-control password-input"
              id="password"
              placeholder="Enter Your Password"
            />
            <button
              type="button"
              className="btn btn-secondary password-toggle-btn"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <span>&#x1F441;</span> // Show password symbol (👁️)
              ) : (
                <span>&#x1F576;</span> // Hide password symbol (🕶️)
              )}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="error error-red">{formik.errors.password}</div>
          )}
          <div className="mb-3">
            <input
              type="text"
              {...formik.getFieldProps("phone")}
              className="form-control"
              id="phone"
              placeholder="Enter Your Phone"
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="error error-red">{formik.errors.phone}</div>
            )}
          </div>
          <div className="mb-3">
            <input
              type="text"
              {...formik.getFieldProps("address")}
              className="form-control"
              id="address"
              placeholder="Enter Your Address"
            />
            {formik.touched.address && formik.errors.address && (
              <div className="error error-red">{formik.errors.address}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            REGISTER
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
