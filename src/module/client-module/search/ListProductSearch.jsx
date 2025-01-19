import React, { useEffect, useState } from "react";
import { Box, Typography, Select, MenuItem, InputLabel, FormControl, Pagination } from "@mui/material";
import { fetch } from '../../../api/Fetch';
import { useNavigate, useSearchParams } from "react-router-dom";
import ErrorIcon from '@mui/icons-material/Error';

const ListProductSearch = () => {
  const [searchParams] = useSearchParams();
  const key = searchParams.get("key") || "";
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1); // Current page
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order (ascending)
  const [totalProducts, setTotalProducts] = useState(0); // Total number of products for pagination

  const productsPerPage = 16; // Number of products to show per page

  const formatToVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch.get(`/product/search?name=${key}`);
        const data = response.data;
        const filteredProducts = data.data
          .filter((item) => item.type === "product" )
          .map((product) => ({
            ...product,
            description: product.description ? product.description.replace(/<[^>]+>/g, "") : "Không có mô tả",
            shopName: product.shopName || "Không xác định",
            avatar: product.avatar || "path_to_default_image", // Fallback for missing image
          }));
        
        setTotalProducts(filteredProducts.length); // Set total number of products
        const startIndex = (page - 1) * productsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

        // Sort products based on price
        const sortedProducts = paginatedProducts.sort((a, b) => {
          return sortOrder === "asc" 
            ? a.price - b.price 
            : b.price - a.price;
        });

        setProducts(sortedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [key, page, sortOrder]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };
  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage); // Calculate total pages
  const navigate = useNavigate()
  return (
    <Box   sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      {/* Sorting Input */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Sort</InputLabel>
          <Select
            value={sortOrder}
            label="Sort"
            onChange={handleSortChange}
            fullWidth
          >
            <MenuItem value="asc">Giá tăng dần</MenuItem>
            <MenuItem value="desc">Giá giảm dần</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Products List */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
        {products.length === 0 ? (
          <Box
            
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              textAlign: "center",
              padding: "20px",
            }}
            
          >
            <ErrorIcon sx={{ fontSize: "50px", color: "#ff0000" }} />
            <Typography variant="h6" sx={{ marginTop: "10px" }}>
              Không có sản phẩm phù hợp
            </Typography>
          </Box>
        ) : (
          products.map((product) => (
            <div onClick={() => navigate("/product-detail/"+product.id)} key={product.id} className="product-item">
              <img src={product.avatar} alt={product.name} />
              <div className="product-info">
                <div className="product-name-all">
                  {product.name.length > 45
                    ? `${product.name.substring(0, 45)}...`
                    : product.name}
                </div>
                <div className="product-price">{formatCurrency(product.price)}</div>
              </div>
            </div>
          ))
        )}
      </Box>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default ListProductSearch;
