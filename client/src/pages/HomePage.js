import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";
import apiService from "../app/apiService";
import { Link } from "react-router-dom";
import "../styles/ItemCard.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadedProducts, setLoadedProducts] = useState([]);

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await apiService.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  const getAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await apiService.get(
        `/api/v1/product/products/page/${page}`
      );
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
    }
  }, [page, setProducts, setLoading]);

  useEffect(() => {
    if (checked.length === 0 && radio.length === 0) getAllProducts();
  }, [checked.length, radio.length, getAllProducts]);

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await apiService.get("/api/v1/product/products/count");
      setTotal(data?.total);
    } catch (error) {}
  };

  const loadMore = useCallback(async () => {
    try {
      setLoading(true);
      let response;
      if (checked.length) {
        response = await apiService.post(
          `/api/v1/product/product-list/${page}`,
          { categories: checked }
        );
      } else {
        response = await apiService.get(`/api/v1/product/product-list/${page}`);
      }
      setLoading(false);

      // Filter out products that have already been loaded
      const newProducts = response?.data?.products.filter(
        (product) => !loadedProducts.includes(product._id)
      );

      setProducts([...products, ...newProducts]);
      setLoadedProducts([
        ...loadedProducts,
        ...newProducts.map((product) => product._id),
      ]);
    } catch (error) {
      setLoading(false);
    }
  }, [checked, page, loadedProducts, products, setProducts, setLoadedProducts]);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page, loadMore]);

  // filter by cat
  const handleFilter = (value, type, id) => {
    if (type === "category") {
      if (value) {
        setChecked((prevChecked) => [...prevChecked, id]);
      } else {
        setChecked((prevChecked) =>
          prevChecked.filter((itemId) => itemId !== id)
        );
      }
    } else if (type === "price") {
      setRadio(value);
    }
    setPage(1);
  };

  const filterProduct = useCallback(async () => {
    try {
      const { data } = await apiService.post(
        "/api/v1/product/products/filters",
        {
          checked,
          radio,
        }
      );
      setProducts(data?.products);
    } catch (error) {}
  }, [checked, radio, setProducts]);

  useEffect(() => {
    if (checked.length > 0 || radio.length > 0) filterProduct();
  }, [checked, radio, filterProduct]);

  // handleAddToCart
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
    <Layout title={"ALl Products - Best offers "}>
      {/* banner image */}
      <img
        src="/images/banner.png"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      />
      {/* banner image */}
      <div className="container-fluid home-page">
        <div className="col-md-3 filters filter-container">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) =>
                  handleFilter(e.target.checked, "category", c._id)
                }
                checked={checked.includes(c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* price filter */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group
              onChange={(e) => handleFilter(e.target.value, "price")}
            >
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
        <div className="col-md-9">
          <h1 className="text-center mb-4">All Products</h1>
          <div className="d-flex flex-wrap justify-content-center">
            {products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              products?.map((p) => (
                <div className="card col-md-4 m-2" key={p._id}>
                  <Link to={`/product/${p.slug}`}>
                    <img src={p.photo} className="card-img" alt={p.name} />
                  </Link>
                  <div className="card-body">
                    <div className="card-name-price">
                      <h5 className="card-title">{p.name}</h5>
                      <h5 className="card-title card-price">
                        {p.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </h5>
                    </div>
                    <div className="card-description">
                      <p className="card-text">
                        {p.description.substring(0, 60)}...
                      </p>
                    </div>
                    <div className="card-buttons d-flex justify-content-between">
                      <button
                        className="btn btn-info"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        More Details
                      </button>
                      <button
                        className="btn btn-dark"
                        onClick={() => handleAddToCart(p)}
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  "Loading ..."
                ) : (
                  <>
                    {" "}
                    Loadmore <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
