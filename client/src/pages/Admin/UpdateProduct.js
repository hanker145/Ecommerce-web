import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import apiService from "../../app/apiService";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, Button } from "antd";

const { Option } = Select;
const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [id, setId] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  //get single product
  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        const { data } = await apiService.get(
          `/api/v1/product/products/${params.slug}`
        );
        setName(data.product.name);
        setId(data.product._id);
        setDescription(data.product.description);
        setPrice(data.product.price);
        setQuantity(data.product.quantity);
        setShipping(data.product.shipping);
        setCategory(data.product.category._id);
        setIsDeleted(data.product.isDeleted); // Set the isDeleted state
      } catch (error) {
        toast.error("Something went wrong while fetching the product");
      }
    };

    getSingleProduct();
  }, [params.slug]);

  //get all category
  const getAllCategory = async () => {
    try {
      const { data } = await apiService.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      toast.error("Something wwent wrong in getting catgeory");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  //create product function
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      photo && productData.append("photo", photo);
      productData.append("category", category);
      const { data } = await apiService.put(
        `/api/v1/product/update-product/${id}`,
        productData
      );
      if (data?.success) {
        toast.success("Product Updated Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("something went wrong");
    }
  };

  //restore
  const handleRestore = async () => {
    try {
      const { data } = await apiService.put(`/api/v1/product/restore/${id}`, {
        isDeleted: false,
      });
      if (data?.success) {
        toast.success("Product Restored Successfully");
        navigate("/dashboard/admin/products");
        setIsDeleted(false);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  //delete a product
  const handleDelete = async () => {
    try {
      closeDeleteModal();
      const { data } = await apiService.delete(
        `/api/v1/product/products/${id}`
      );
      if (data?.success) {
        toast.success("Product Marked as Deleted Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const showDeleteModal = () => {
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
  };

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Product</h1>
            <div className="m-1 w-75">
              <Select
                variant={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setCategory(value);
                }}
                value={category}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>
              <div className="mb-3">
                {photo ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <img
                      src={"/images/upload.png"}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="write a name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  type="text"
                  value={description}
                  placeholder="write a description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="write a Price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="write a quantity"
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <Select
                  variant={false}
                  placeholder="Select Shipping "
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => {
                    setShipping(value);
                  }}
                  value={shipping ? "yes" : "No"}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleUpdate}>
                  UPDATE PRODUCT
                </button>
              </div>
              <div className="mb-3">
                <button className="btn btn-danger" onClick={showDeleteModal}>
                  DELETE PRODUCT
                </button>
                <div className="mt-3">
                  {isDeleted && (
                    <button className="btn btn-primary" onClick={handleRestore}>
                      RESTORE PRODUCT
                    </button>
                  )}
                </div>
              </div>
              <Modal
                title="Delete Product"
                visible={deleteModalVisible}
                onCancel={closeDeleteModal}
                footer={[
                  <Button
                    key="cancel"
                    className="btn btn-primary"
                    onClick={closeDeleteModal}
                  >
                    Cancel
                  </Button>,
                  <Button
                    key="delete"
                    className="btn btn-danger"
                    onClick={handleDelete} // Update the onClick handler
                  >
                    Delete
                  </Button>,
                ]}
              >
                <p>Are you sure you want to delete this product?</p>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
