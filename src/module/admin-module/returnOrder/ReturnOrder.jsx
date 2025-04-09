import React from "react";
import "./ReturnOrderHeader.scss";

const ReturnOrderHeader = () => {
  const currentDate = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="return-order-header">
      <div className="breadcrumb">
        <span>Trang chủ</span> &gt; <span>Đơn hàng</span> &gt; <strong>Quản lý hoàn trả</strong>
      </div>

      <div className="header-content">
        <div className="title-section">
          <h1>Quản lý đơn hoàn trả</h1>
          <p>Quản lý tất cả các đơn hàng hoàn trả từ khách hàng, bao gồm theo dõi trạng thái xử lý, lý do hoàn trả và phản hồi từ bộ phận hỗ trợ.</p>
        </div>
        <div className="date-info">
          <span>📅 {currentDate}</span>
        </div>
      </div>
    </div>
  );
};

export default ReturnOrderHeader;
