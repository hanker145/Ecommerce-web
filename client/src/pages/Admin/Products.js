import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import apiService from "../../app/apiService";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        setLoading(true);
        const url = `/api/v1/product/products${page ? `?page=${page}` : ""}`;
        const { data } = await apiService.get(url);
        setLoading(false);
        setProducts((prevProducts) => [...prevProducts, ...data.products]);
        setTotal(data.countTotal);
      } catch (error) {
        setLoading(false);
      }
    };

    getAllProducts();
  }, [page]);

  return (
    <Layout>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products List</h1>
          <div className="d-flex flex-wrap">
            {products.map((p) => (
              <div key={p._id} className="card m-2" style={{ width: "20rem" }}>
                <Link
                  to={`/dashboard/admin/product/${p.slug}`}
                  className="product-link"
                >
                  <img src={p.photo} className="card-img" alt={p.name} />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">{`${p.description.substring(
                      0,
                      60
                    )}...`}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {products.length < total && (
              <button
                className="btn btn-warning"
                onClick={() => setPage((prevPage) => prevPage + 1)}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
