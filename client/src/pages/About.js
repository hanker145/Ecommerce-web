import React from "react";
import Layout from "../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About us - Final Project app"}>
      <div className="row contactus">
        <div className="col-md-6">
          <img src="/images/about.jpeg" alt="about" style={{ width: "100%" }} />
        </div>
        <div className="col-md-4">
          <p>Test APP</p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
