import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import apiService from "../../app/apiService";
import toast from "react-hot-toast";
import Layout from "./../../components/Layout/Layout";
import * as Yup from "yup";

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one symbol"
      )
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = async (values) => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      // Validation passed, proceed with form submission
      const res = await apiService.post(
        `${process.env.REACT_APP_API}/api/v1/auth/reset-password/${id}/${token}`,
        { password: values.password }
      );
      if (res && res.status === 200) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // Validation failed, display error messages
        error.inner.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error("Something happened");
      }
    }
  };

  return (
    <Layout title={"Reset Password"}>
      <div className="form-container" style={{ minHeight: "90vh" }}>
        <h1>RESET PASSWORD</h1>
        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="mb-3 row d-flex flex-column ">
              <Field
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                required
              />
              <ErrorMessage name="password" component="div" className="error" />
              <br />
              <Field
                type="password"
                name="confirmPassword"
                id="confirm-password"
                placeholder="Confirm password"
                required
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="error"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </Form>
        </Formik>
      </div>
    </Layout>
  );
};

export default ResetPassword;
