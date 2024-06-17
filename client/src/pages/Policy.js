import React from "react";
import Layout from "../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Policy"}>
      <div className="row contactus">
        <div className="col-md-6">
          <img
            src="/images/policy.jpeg"
            alt="policy"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p>Demo APP only</p>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
