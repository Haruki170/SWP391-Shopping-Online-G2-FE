import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import OrderCancelDetail from "./OrderCancelDetail";


// Dữ liệu mẫu cho bảng


function Row({ row }) {
  const [open, setOpen] = useState(false);
  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  console.log(row);
  
  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{row.order.code}</TableCell>
        <TableCell>{formatCurrency(row.order.orderTotal)}</TableCell>
        <TableCell>{row.order.create_at}</TableCell>
        <TableCell>{row.create_at}</TableCell>
        <TableCell>{row.status == 0 ?"Chưa xử lý" : "Đã xử lý"}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <OrderCancelDetail row={row} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

};

export default OrderCancel;
