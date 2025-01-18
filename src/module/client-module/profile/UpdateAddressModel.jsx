import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Box, Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { updateAddress } from "../../../api/addressApi";
import Swal from "sweetalert2";
import { queryClient } from "../../../main";
const UpdateAddressModel = ({ address, show, closeShow }) => {
  let [err, setErr] = useState({
    province: null,
    district: null,
    ward: null,
  });
  let [haveErr, setHaveErr] = useState(false);
  let [province, setProvince] = useState(null);
  let [district, setDistrict] = useState(null);
  let [ward, setWard] = useState(null);
  let [selectProvice, setSelectProvince] = useState("");
  let [selectDistrict, setSelectDistrict] = useState("");
  let [selectWard, setSelectWard] = useState("");
  let [selectDefault, setSelectDefault] = useState(0);

  let formdata = [
    {
      name: "name",
      label: "Nhập tên địa chỉ",
    },
    {
      name: "nameReceiver",
      label: "Nhập họ tên người liên hệ",
    },
    {
      name: "phone",
      label: "Nhập số điện thoại liên hệ",
    },
    {
      name: "address",
      label: "Nhập địa chỉ",
    },
  ];

  //lấy dữ liệu tỉnh thành
  useEffect(() => {
    axios
      .get("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((data) => setProvince(data.data.data));
  }, []);

  useEffect(() => {
    let id = selectProvice == "" ? "" : selectProvice.id;
    if (id) {
      axios
        .get(`https://esgoo.net/api-tinhthanh/2/${id}.htm`)
        .then((data) => setDistrict(data.data.data));
    }
  }, [selectProvice]);

  useEffect(() => {
    let id = selectDistrict == "" ? "" : selectDistrict.id;
    if (id) {
      axios
        .get(`https://esgoo.net/api-tinhthanh/3/${id}.htm`)
        .then((data) => setWard(data.data.data));
    }
  }, [selectDistrict]);

  // set address có sẵn
  useEffect(() => {
    if (address.province && province) {
      let initialProvince = province.find(
        (item) => item.name == address.province
      );
      setSelectProvince({ name: initialProvince.name, id: initialProvince.id });
    }
  }, [address, province]);

  useEffect(() => {
    if (address.district && district != null) {
      let initialDistrict = district.find(
        (item) => item.name == address.district
      );
      if (initialDistrict) {
        setSelectDistrict({
          name: initialDistrict.name,
          id: initialDistrict.id,
        });
      }
    } else {
      setSelectDistrict("");
    }
  }, [address, district]);

  useEffect(() => {
    if (address.ward && ward != null) {
      let initialWard = ward.find((item) => item.name == address.ward);
      if (initialWard) {
        setSelectWard({ name: initialWard.name, id: initialWard.id });
      }
    } else {
      setSelectWard("");
    }
  }, [address, ward]);

  // xư lý dữ liệu khi chọn lại tỉnh thành
  const handleSelectProvince = (e) => {
    if (e.target.value != "") {
      let value = JSON.parse(e.target.value);
      setSelectProvince(value);
      setSelectDistrict(""); // Đặt lại quận
      setSelectWard(""); // Đặt lại xã
      setDistrict(null); // Xóa dữ liệu quận
      setWard(null); // Xóa dữ liệu xã
      setErr({ ...err, province: null });
      setHaveErr(false);
    } else {
      setSelectProvince(""); // Đặt lại lựa chọn tỉnh
      setSelectDistrict(""); // Đặt lại lựa chọn quận
      setSelectWard(""); // Đặt lại lựa chọn xã
      setDistrict(null); // Xóa dữ liệu quận
      setWard(null); // Xóa dữ liệu xã
    }
  };

  const handleSelectDistrict = (e) => {
    let value = JSON.parse(e.target.value);
    setSelectDistrict(value);
    setSelectWard("");
    setErr({ ...err, district: null });
    setHaveErr(false);
  };

  const handleSelectWard = (e) => {
    let value = JSON.parse(e.target.value);
    setSelectWard(value);
    setErr({ ...err, ward: null });
    setHaveErr(false);
  };
  const handleCheckboxChange = (e) => {
    setSelectDefault(e.target.checked ? 1 : 0); // Cập nhật trạng thái checkbox
  };

  let schema = yup.object({
    name: yup.string().required("Vui lòng nhập tên địa chỉ"),
    nameReceiver: yup.string().required("Vui lòng nhập tên người nhận"),
    phone: yup
      .string()
      .required("Vui lòng nhập số điện thoại ")
      .matches(
        "^(0[3|5|7|8|9][0-9]{8})$|^(01[2|6|8|9][0-9]{8})$",
        "Số điện thoại không hợp lệ"
      ),
    address: yup.string().required("Vui lòng nhập địa chỉ"),
  });

  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: address.name ? address.name : "",
      nameReceiver: address.nameReceiver ? address.nameReceiver : "",
      phone: address.phone ? address.phone : "",
      address: address.address ? address.address : "",
    },
    resolver: yupResolver(schema),
    mode: "all",
  });

  //kết nối backend
  const { mutate } = useMutation({
    mutationFn: (content) => updateAddress(content),
    onSuccess: () => {
      queryClient.refetchQueries(["get-add-address"]);
      closeShow();
      reset();
      setSelectDefault(0);
      setSelectDistrict("");
      setSelectProvince("");
      setSelectWard("");
      Swal.fire({
        icon: "success",
        title: "Cập nhật địa chỉ thành công",
        confirmButtonText: "Trở lại",
        confirmButtonColor: "#28a745",
      }).then((result) => {
        if (result.isConfirmed) {
          closeShow();
        }
      });
    },
    onError: (e) => {
      console.log(e);
      
      Swal.fire({
        icon: "error",
        title: "Vui lòng thử lại sau",
        confirmButtonText: "Trở lại",
        confirmButtonColor:"#28a745"
    }).then((result) => {
      if(result.isConfirmed){
        closeShow()
      }
  })
    },
  });

  //submit form
  const onSubmit = (data) => {
    if (selectProvice == "" || selectProvice == null) {
      setErr({ ...err, province: "Vui lòng chọn tỉnh thành" });
      setHaveErr(true);
      return;
    } else if (selectDistrict == "" || selectDistrict == null) {
      setErr({ ...err, district: "Vui lòng chọn quận/huyện" });
      setHaveErr(true);
      return;
    } else if (selectWard == "" || selectWard == null) {
      setErr({ ...err, ward: "Vui lòng chọn xã/phường" });
      setHaveErr(true);
      return;
    } else {
      data["id"] = address.id;
      data["province"] = selectProvice.name;
      data["district"] = selectDistrict.name;
      data["ward"] = selectWard.name;
      data["isDefault"] = selectDefault;
      setHaveErr(false);
      mutate(data);
    }
  };

  //get err when submit
  const getErrMess = () => {
    let mess = "";
    if (err.province != null) {
      mess = err.province;
    } else if (err.district != null) {
      mess = err.district;
    } else {
      mess = err.ward;
    }
    return (
      <Alert className="my-3" severity="error">
        {mess}
      </Alert>
    );
  };

  return (
    <div>
      <Modal dialogClassName="address-modal" show={show} onHide={closeShow}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa địa chỉ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {haveErr ? getErrMess() : ""}

            <Row>
              {formdata.map((item) => {
                return (
                  <Col key={item.name} lg={6}>
                    <Form.Group className="mb-3" id="form-password">
                      <Form.Label>
                        {item.label} <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        className="custom-input"
                        type="text"
                        name={item.name}
                        placeholder={item.label}
                        isInvalid={Boolean(errors[item.name])}
                        {...register(item.name)}
                      />
                      {Boolean(errors[item.name]) ? (
                        <Form.Control.Feedback type="invalid">
                          {errors[item.name].message}
                        </Form.Control.Feedback>
                      ) : (
                        ""
                      )}
                    </Form.Group>
                  </Col>
                );
              })}

              <Col lg={6}>
                <Form.Group className="mb-3" id="form-password">
                  <Form.Label>
                    Chọn tỉnh thành <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Select
                    name="province"
                    aria-label="Default select example"
                    onChange={handleSelectProvince}
                  >
                    <option value="">-- Chọn tỉnh thành --</option>
                    {province != null
                      ? province.map((item) => {
                          return (
                            <option
                              selected={address.province === item.name}
                              key={item.id}
                              value={JSON.stringify({
                                id: item.id,
                                name: item.name,
                              })}
                            >
                              {item.name}
                            </option>
                          );
                        })
                      : ""}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col lg={6}>
                <Form.Group className="mb-3" id="form-password">
                  <Form.Label>
                    Chọn quận/huyện <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Select
                    name="province"
                    aria-label="Default select example"
                    onChange={handleSelectDistrict}
                  >
                    <option value="">-- Chọn quận/huyện --</option>
                    {district != null
                      ? district.map((item) => {
                          return (
                            <option
                              selected={address.district === item.name}
                              key={item.id}
                              value={JSON.stringify({
                                id: item.id,
                                name: item.name,
                              })}
                            >
                              {item.name}
                            </option>
                          );
                        })
                      : ""}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col lg={6}>
                <Form.Group className="mb-3" id="form-password">
                  <Form.Label>
                    Chọn xã/phường <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Select
                    onChange={handleSelectWard}
                    name="province"
                    aria-label="Default select example"
                  >
                    <option value="">-- Chọn xã/phường --</option>
                    {ward != null
                      ? ward.map((item) => {
                          return (
                            <option
                              selected={item.name === address.ward}
                              key={item.id}
                              value={JSON.stringify({
                                id: item.id,
                                name: item.name,
                              })}
                            >
                              {item.name}
                            </option>
                          );
                        })
                      : ""}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Check
              inline
              label="Chọn làm mặc định"
              name="group1"
              type={"checkbox"}
              onChange={handleCheckboxChange}
            />
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <Button variant="secondary" onClick={closeShow}>
                Hủy
              </Button>
              <Button
                type="submit"
                sx={{
                  background: " #ffcf20",
                  color: "#1b1b1b",
                  textTransform: "capitalize",
                  borderRadius: "100px",
                }}
                variant="contained"
              >
                Lưu địa chỉ
              </Button>
            </Box>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UpdateAddressModel;
