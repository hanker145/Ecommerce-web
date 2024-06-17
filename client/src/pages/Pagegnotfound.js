import React from "react";
import Layout from "../components/Layout/Layout";
import { Link } from "react-router-dom";

const Pagegnotfound = () => {
  return (
    <Layout title={"Page not found - go back"}>
      <div className="pnf">
        <h1 className="pnf-title">404</h1>
        <h2 className="pnf-headingg">Opp! Page Not Found</h2>
        <Link to="/" className="pnf-btn">
          Go Back
        </Link>
      </div>
    </Layout>
  );
};

export default Pagegnotfound;
