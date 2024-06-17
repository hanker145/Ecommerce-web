import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import apiService from "../app/apiService";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart.forEach((item) => {
        total += item.price * item.quantity;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.error(error);
    }
  };

  // delete item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.error(error);
    }
  };

  // handleDecrement
  const handleDecrement = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item._id === productId && item.quantity > 1) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // handleIncrement
  const handleIncrement = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item._id === productId) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await apiService.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  // handle payment
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      // eslint-disable-next-line
      const { data } = await apiService.post(
        "/api/v1/product/braintree/payment",
        {
          nonce,
          cart,
        }
      );
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully");
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("Payment Failed");
    }
  };
  return (
    <Layout>
      <div
        className=" cart-page"
        style={{ minHeight: "90vh", marginTop: "60px" }}
      >
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You Have ${cart.length} items in your cart ${
                      auth?.token ? "" : "please login to checkout !"
                    }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container ">
          <div className="row ">
            <div className="col-md-7  p-0 m-0">
              {cart?.map((p) => (
                <div className="row card flex-row" key={p._id}>
                  <div className="col-md-4">
                    <img
                      src={p.photo}
                      className="card-img"
                      alt={p.name}
                      width="100%"
                      height={"130px"}
                    />
                  </div>
                  <div className="col-md-4">
                    <p>{p.name}</p>
                    <p>{p.description.substring(0, 30)}</p>
                    <p>
                      Price :{" "}
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}{" "}
                    </p>
                  </div>

                  <div className="row col-md-4 cart-remove-btn">
                    <div className="input-group">
                      <button
                        type="button"
                        className="input-group-text"
                        onClick={() => handleDecrement(p._id)}
                      >
                        -
                      </button>

                      <div className="form-control text-center">
                        {p.quantity}
                      </div>
                      <button
                        type="button"
                        className="input-group-text"
                        onClick={() => handleIncrement(p._id)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="btn btn-danger"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-5 cart-summary ">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total : {totalPrice()} </h4>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Plase Login to checkout
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2">
                {!clientToken || !auth?.token || !cart?.length ? (
                  ""
                ) : (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />

                    <button
                      className="btn btn-primary"
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}
                    >
                      {loading ? "Processing ...." : "Make Payment"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
