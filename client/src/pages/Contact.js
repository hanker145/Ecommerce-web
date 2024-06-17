import React from "react";
import Layout from "../components/Layout/Layout";
import { BiMailSend, BiPhone, BiSupport } from "react-icons/bi";

const Contact = () => {
  return (
    <Layout title={"Contact us"}>
      <div className="row contactus">
        <div className="col-md-6">
          <img
            src="/images/contactus1.jpeg"
            alt="contact"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center"> CONTACT US</h1>
          <p className="text-justify mt-2 ">
            {" "}
            Feel free to contact us if any problem happned
          </p>
          <p className="mt-3">
            <BiMailSend /> : www.help@final.com
          </p>
          <p className="mt-3">
            <BiPhone /> : 09123456
          </p>
          <p className="mt-3">
            <BiSupport /> : 01020203 (free)
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
