import React from "react";
import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/search";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";
import { useNavigate, Link } from "react-router-dom";
import "../styles/SearchStyles.css";

const Search = () => {
  const [values] = useSearch();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      // If the item already exists in the cart, increase its quantity
      const updatedCart = cart.map((item) => {
        if (item._id === product._id) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success("Quantity increased in cart");
    } else {
      // If the item doesn't exist in the cart, add it with quantity 1
      setCart([...cart, { ...product, quantity: 1 }]);
      localStorage.setItem(
        "cart",
        JSON.stringify([...cart, { ...product, quantity: 1 }])
      );
      toast.success("Item added to cart");
    }
  };

  return (
    <Layout title={"Search results"}>
      <div className="container-fluid">
        <div className="text-center">
          <h1>Search results</h1>
          <h6>
            {values?.results.length < 1
              ? "No product found"
              : `Found ${values?.results.length} items`}
          </h6>
          <div className="d-flex flex-wrap justify-content-center mt-4 search-page">
            {values?.results.map((p) => (
              <div
                key={p.id}
                className="card-name-price m-2"
                style={{ width: "18rem" }}
              >
                <Link to={`/product/${p.slug}`}>
                  <img src={p.photo} className="card-img" alt={p.name} />
                </Link>
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">
                    {p.description.substring(0, 60)}...
                  </p>
                  <p className="card-price">
                    {p.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                  <button
                    className="btn btn-primary ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                  <button
                    className="btn btn-dark ms-1"
                    onClick={() => handleAddToCart(p)} // Update the onClick event handler
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
