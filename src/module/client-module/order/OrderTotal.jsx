import React, { useEffect, useState } from "react";
import "./order.scss";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Box, Button, Stack } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

import "./order.scss";
import OrderAddressModal from "./OrderAddressModal";
import AddAdressModal from "../profile/AddAdressModal";
import { Form } from "react-bootstrap";
import PaymentIcon from "@mui/icons-material/Payment";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const OrderTotal = ({ address, orderData, orderVnPay }) => {
  const selectedVoucher = useSelector((state) => state.voucher.selectedVoucher);
  const [show, setShow] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(0);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSelectPayment = (e) => {
    setPaymentMethod(e.target.value);
  };
  const [addressSelect, setAdressSelect] = useState(
    address.find((item) => item.isDefault == 1)
  );
  const handleChangeAddress = (id) => {
    setAdressSelect(address.find((item) => item.id == id));
  };

  const totalShipCost = orderData.reduce((total, item) => {
    return total + item.shipCost;
  }, 0);


  const totalOrder = orderData.reduce((total, item) => {
    const orderItem = item.orderList;
    return (total += item.totalCost);
  }, 0);
  const totalWithDiscount = selectedVoucher
  ? totalOrder + totalShipCost - selectedVoucher.discountAmount
  : totalOrder + totalShipCost;
  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <div id="order-total" style={{ padding: "20px" }}>
      <div
        className="order-cost "
        style={{ backgroundColor: "white", width: "100%", padding: "20px" }}
      >
        <Box sx={{ borderBottom: "1px solid #ccc", paddingBottom: "15px" }}>
          <Stack
            direction={"row"}
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <h5 className="order-address-title mb-0">
              <SummarizeOutlinedIcon
                sx={{ marginRight: "10px" }}
              ></SummarizeOutlinedIcon>{" "}
              Tóm tắt đơn hàng
            </h5>
          </Stack>
        </Box>
        <Box sx={{ marginTop: "20px" }}>
          <Stack>
            <Stack
              direction={"row"}
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <p className="total-item-title">Tổng</p>
              <h6>{formatCurrency(totalOrder)}</h6>
            </Stack>

            <Stack
              direction={"row"}
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <p className="total-item-title"> vận chuyển</p>
              <h6>{formatCurrency(totalShipCost)}</h6>
            </Stack>

            {selectedVoucher && (
                            <Stack direction={"row"} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                                <p className="total-item-title">Giảm giá ({selectedVoucher.code})</p>
                                <h6>- {formatCurrency(selectedVoucher.discountAmount)}</h6>
                            </Stack>
                        )}

                        <Stack direction={"row"} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                            <p className="total-title">Tổng đơn hàng</p>
                            <h6 className="total-price">{formatCurrency(totalWithDiscount)}</h6>
            </Stack>

            <Button
              sx={{
                background: " #ffcf20",
                color: "#1b1b1b",
                textTransform: "capitalize",
                borderRadius: "100px",
                marginTop: "20px",
              }}
              variant="contained"
              onClick={() => orderVnPay(addressSelect,paymentMethod)}
            >
              Thanh toán
            </Button>
          </Stack>
        </Box>
      </div>
      <div
        style={{ backgroundColor: "white", width: "100%", padding: "20px" }}
        className="order-address mt-4"
      >
        <Box sx={{ borderBottom: "1px solid #ccc", paddingBottom: "15px" }}>
          <Stack
            direction={"row"}
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <h5 className="order-address-title mb-0">
              <LocalShippingOutlinedIcon
                sx={{ marginRight: "10px" }}
              ></LocalShippingOutlinedIcon>{" "}
              Vận chuyển đến
            </h5>
            <Button
              type="submit"
              sx={{
                background: " #ffcf20",
                color: "#1b1b1b",
                textTransform: "capitalize",
                borderRadius: "100px",
              }}
              variant="contained"
              onClick={handleShow}
            >
              Đổi địa chỉ
            </Button>
          </Stack>
        </Box>
        <Box sx={{ marginTop: "20px" }}>
          {addressSelect ? (
            <Stack className="mx-2">
              <h6>
                <PlaceOutlinedIcon></PlaceOutlinedIcon> {addressSelect.name}
              </h6>
              <Stack className="mx-3">
                <Stack
                  className="mb-1"
                  direction={"row"}
                  sx={{ alignItems: "center" }}
                  spacing={1}
                >
                  <p className="mb-0">{addressSelect.nameReceiver}</p>
                  <FiberManualRecordIcon sx={{ fontSize: "15px" }} />
                  <p className="mb-0">{addressSelect.phone}</p>
                </Stack>
                <p className="order-address-detail">{addressSelect.address}</p>
              </Stack>
            </Stack>
          ) : address.length != 0 ? (
            <Button
              type="submit"
              sx={{
                background: " #ffcf20",
                color: "#1b1b1b",
                textTransform: "capitalize",
                borderRadius: "100px",
              }}
              variant="contained"
              onClick={handleShow}
            >
              Lựa chọn địa chỉ
            </Button>
          ) : (
            <Button
              type="submit"
              sx={{
                background: " #ffcf20",
                color: "#1b1b1b",
                textTransform: "capitalize",
                borderRadius: "100px",
              }}
              variant="contained"
              onClick={handleShow}
            >
              <Link to={"/profile/address"}>Thêm địa chỉ mới</Link>
            </Button>
          )}
        </Box>
      </div>

      <div
        style={{ backgroundColor: "white", width: "100%", padding: "20px" }}
        className="order-payment mt-4"
      >
        <Box sx={{ borderBottom: "1px solid #ccc", paddingBottom: "15px" }}>
          <Stack
            direction={"row"}
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <h5 className="order-address-title mb-0">
              <PaymentIcon sx={{ marginRight: "10px" }}></PaymentIcon> Phương
              thức thanh toán
            </h5>
          </Stack>
        </Box>

        <Box sx={{ marginTop: "20px" }}>
          <Form>
            <Stack direction={"row"} spacing={2} sx={{ alignItems: "center" }}>
              <Form.Check
                value={0}
                onChange={handleSelectPayment}
                checked={paymentMethod == 0 ? true : false}
                type="radio"
                className="custom-radio"
                name="payment"
              />
              <Stack
                direction={"row"}
                sx={{ alignItems: "center" }}
                spacing={2}
              >
                <img
                  width={30}
                  src="https://chus.vn/design/themes/chus/media/images/payment/cod-3x.png"
                  alt=""
                />
                <span className="mb-0 payment-title">
                  Thanh toán khi nhận hàng
                </span>
              </Stack>
            </Stack>
            
            <Stack direction={"row"} spacing={2} sx={{ alignItems: "center" }}>
              <Form.Check
                onChange={handleSelectPayment}
                checked={paymentMethod == 1 ? true : false}
                value={1}
                type="radio"
                className="custom-radio"
                name="payment"
              />
              <Stack
                direction={"row"}
                sx={{ alignItems: "center" }}
                spacing={2}
              >
                <img
                  width={30}
                  src="https://static.chus.vn/images/payment/78/vnpay-3x.png"
                  alt=""
                />
                <span className="mb-0 payment-title">VnPay</span>
              </Stack>
            </Stack>
          </Form>
        </Box>
      </div>

      <OrderAddressModal
        address={address}
        show={show}
        handleClose={handleClose}
        addressSelect={addressSelect}
        handleChangeAddress={handleChangeAddress}
      ></OrderAddressModal>
    </div>
  );
};

export default OrderTotal;
