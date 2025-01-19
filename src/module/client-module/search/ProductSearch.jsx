import { Box, Breadcrumbs, Link, Stack, Typography } from "@mui/material";
import React from "react";
import { Mosaic } from "react-loading-indicators";

import { Container } from "react-bootstrap";
import ProductFilterSearch from "./ProductFilterSearch";
import ListProductSearch from "./ListProductSearch";

const ProductSearch = () => {
  return (
    <div className="mt-5" id="filter-list-product">
      <Container style={{ width: "89%" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Trang chủ
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/material-ui/getting-started/installation/"
          >
            Tìm kiếm sản phẩm
          </Link>
        
        </Breadcrumbs>
        <Stack
          direction={"row"}
          spacing={5}
          sx={{ justifyContent: "space-between" }}
          className="mt-5"
        >
          <Box sx={{ width: "45%" }}>
            <ProductFilterSearch></ProductFilterSearch>
          </Box>
          <Box sx={{ width: "160%" }}>
            <ListProductSearch></ListProductSearch>
          </Box>
        </Stack>
      </Container>
    </div>
  );
};

export default ProductSearch;
