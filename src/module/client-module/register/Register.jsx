import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import "./register.scss";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
const Register = () => {
  const navigate = useNavigate();

  const login = useSelector((state) => state.auth.login);
  if (login) {
    return <Navigate to={"/"}></Navigate>;
  }

  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);
  const schema = yup
    .object({
      name: yup.string().required("Vui lòng nhập họ và tên"),
      email: yup
        .string()
        .required("Vui lòng nhập email")
        .email("Email không hợp lệ")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/,
          "Email không đúng định dạng"
        ),
      password: yup
        .string()
        .required("Vui lòng nhập mật khẩu")
        .min(8, "Mật khẩu phải chứa một ký tự viết hoa và ít nhất 8 ký tự")
        .matches(/[A-Z]/, "Mật khẩu phải chứa một ký tự viết hoa và ít nhất 8 ký tự"), // Kiểm tra ít nhất 1 chữ hoa
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
        .required("Vui lòng xác nhận mật khẩu"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      comfirmPassword: "",
    },
    resolver: yupResolver(schema),
    mode: "all",
  });
  const formData = [
    {
      label: "Họ và tên",
      placeholder: "Nhập tên người dùng",
      name: "name",
      type: "text",
    },
    {
      label: "Email",
      placeholder: "Nhập email",
      name: "email",
      type: "text",
    },
    {
      label: "Mật khẩu",
      placeholder: "Nhập mật khẩu",
      name: "password",
      type: "password",
    },
    {
      label: "Xác nhận mật khẩu",
      placeholder: "Nhập lại mật khẩu",
      name: "confirmPassword",
      type: "password",
    },
  ];

  const submitData = (data) => {
    axios
      .post("http://localhost:8080/auth/customer/sign-up", data)
      .then((content) => {
        Swal.fire({
          text:"Đăng ký thành công. Vui lòng đăng nhập để tiếp tục",
          icon:"success",
          confirmButtonText:"Ok"
        })
        .then((result) => {
            if(result.isConfirmed){
              navigate("/login")
            }
        })
      })
      .catch((error) => {
        if (error.response) {
          setErr(error.response.data.message);
          setSuccess(null);
        }
      });
  };
  return (
    <section style={{ backgroundColor: "#f3f3f3" }} id="sign-up">
      <form action="" onSubmit={handleSubmit(submitData)}>
        <Stack gap={3}>
          <Typography variant="h6" sx={{ fontWeight: "600" }} color="initial">
            Đăng ký tài khoản
          </Typography>
          {err != null ? <Alert severity="error">{err}</Alert> : ""}
          {success != null ? <Alert severity="success">{success}</Alert> : ""}
          {formData.map((item) => {
            return (
              <Form.Group key={item.name} className="form-input">
                <Form.Label className="label">
                  {item.label} <span>*</span>
                </Form.Label>
                <Form.Control
                  className="mb-0"
                  type={item.type}
                  isInvalid={Boolean(errors[item.name])}
                  {...register(item.name)}
                  name={item.name}
                  placeholder={item.placeholder}
                />
                {Boolean(errors[item.name]) ? (
                  <Form.Control.Feedback type="invalid">
                    {errors[item.name].message}
                  </Form.Control.Feedback>
                ) : (
                  ""
                )}
              </Form.Group>
            );
          })}
          <Button
            type="submit"
            sx={{
              backgroundColor: "#ffcf20",
              color: "#1b1b1b",
              borderRadius: "999px",
              textTransform: "capitalize",
            }}
          >
            <b>Đăng ký</b>
          </Button>
          <Button
            onClick={() => navigate("/login")}
            sx={{
              backgroundColor: "white",
              color: "#1b1b1b",
              border: "solid 1px #ccc",
              borderRadius: "999px",
              textTransform: "capitalize",
            }}
          >
            <b>
              Đã có tài khoản? Đăng nhập <ArrowForwardIcon></ArrowForwardIcon>
            </b>
          </Button>
        </Stack>
      </form>
    </section>
  );
};

export default Register;
