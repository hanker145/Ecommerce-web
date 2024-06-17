import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import apiService from "../../app/apiService";
import toast from "react-hot-toast";

import { useAuth } from "../../context/auth";

const Profile = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [auth, setAuth] = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await apiService.put(
        `${process.env.REACT_APP_API}/api/v1/auth/profile`,
        values
      );
      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile Updated successfully");
      }
    } catch (error) {
      toast.error("Something happened");
    }
  };

  const onChangeInput = (key, value) => {
    setValues({ ...values, [key]: value });
  };

  useEffect(() => {
    const { user } = auth;
    setValues(user);
  }, [auth]);

  return (
    <Layout title={"Your Profile"}>
      <div className="container-fluid m-3 p-3" style={{ minHeight: "80vh" }}>
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="form-container ">
              <form onSubmit={handleSubmit}>
                <h1 className="title text-center">USER PROFILE</h1>
                <div className="mb-3">
                  <input
                    type="text"
                    defaultValue={values?.name || ""}
                    className="form-control"
                    placeholder="Enter your name"
                    onChange={(e) => onChangeInput("name", e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    defaultValue={values?.email || ""}
                    className="form-control"
                    placeholder="Enter your Email"
                    onChange={(e) => onChangeInput("email", e.target.value)}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    autoComplete="on"
                    className="form-control"
                    placeholder="Enter your new Password"
                    onChange={(e) => onChangeInput("password", e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    defaultValue={values?.phone || ""}
                    className="form-control"
                    placeholder="Enter your Phone"
                    onChange={(e) => onChangeInput("phone", e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    defaultValue={values?.address || ""}
                    className="form-control"
                    placeholder="Enter your Address"
                    onChange={(e) => onChangeInput("address", e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary d-flex justify-content-center"
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
