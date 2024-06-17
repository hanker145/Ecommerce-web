import { useState, useEffect } from "react";
import apiService from "../app/apiService";

export default function useCategory() {
  const [categories, setCategories] = useState([]);

  //get category
  const getCategories = async () => {
    try {
      const { data } = await apiService.get("/api/v1/category/get-category");
      setCategories(data?.category);
    } catch (error) {}
  };

  useEffect(() => {
    getCategories();
  }, []);
  return categories;
}
