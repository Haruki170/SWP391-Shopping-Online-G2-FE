import { Box, Breadcrumbs, Link, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import OrderDetail from "./OrderDetail";
import OrderTotal from "./OrderTotal";
import { Container } from "react-bootstrap";
import "./order.scss";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllAddress } from "../../../api/addressApi";
import Loading from "../loading/Loading";
import { useSelector } from "react-redux";
import { createOrderCod, createOrderVnPay } from "../../../api/orderApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Order = () => {
  const orderData = useSelector((state) => state.order.order);
  console.log(orderData)
  const login = useSelector((state) => state.auth.login);
  const navigate = useNavigate();
  if (!orderData || orderData.length == 0) {
    navigate("/cart");
  }

  if (!login) {
    navigate("/login");
  }

  const { data, isLoading } = useQuery({
    queryKey: ["getAddress-order"],
    queryFn: getAllAddress,
  });

  const { mutate } = useMutation({
    mutationFn: (data) => createOrderVnPay(data),
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const { mutate: codOrder } = useMutation({
    mutationFn: (data) => createOrderCod(data),
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (data) => {
      window.location.href = "http://localhost:5173/payment-err";
    },
  });



  const createOrderVnp = (address, method) => {
    if (!address) {
      Swal.fire({
        icon: "warning",
        text: "Vui lòng thêm địa chỉ giao hàng",
      });
    } else {
      let data = {
        address,
        orders: orderData,
        
      };
      
      
      if (method == 1) {
        mutate(data);
      } else {
        codOrder(data);
      }
    }
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div id="order">
      <div className="order-head">
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          height={90}
          sx={{ boxShadow: 1 }}
          bgcolor={"white"}
          p={2}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              sx={{ fontWeight: "bold" }}
              typography={"h6"}
              underline="hover"
              color="inherit"
            >
              Giỏ Hàng
            </Link>
            <Link
              sx={{ fontWeight: "bold", color: "black" }}
              typography={"h6"}
              underline="hover"
              color="inherit"
            >
              Thanh Toán
            </Link>
            <Link
              sx={{ fontWeight: "bold" }}
              typography={"h6"}
              underline="hover"
              color="inherit"
            >
              Hoàn Thành
            </Link>
          </Breadcrumbs>
        </Box>
      </div>
      <div className="order-body mt-2">
        <Container style={{ width: "90%" }}>
          <Stack direction={"row"}>
            <div className="left" style={{ width: "67%" }}>
              <OrderDetail orderData={orderData}></OrderDetail>
            </div>
            <div className="right" style={{ width: "33%" }}>
              <OrderTotal
                orderVnPay={createOrderVnp}
                orderData={orderData}
                address={data}
              ></OrderTotal>
            </div>
          </Stack>
        </Container>
      </div>
    </div>
  );
};

export default Order;
