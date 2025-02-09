import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import "./login.scss";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN } from "../../../redux/slice/AuthSlice";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()


  const login = useSelector((state) => state.auth.login)
  if (login) {
    return <Navigate to={"/"}></Navigate>
  }

  const [err, setErr] = useState(null)
  const [success, setSuccess] = useState(null)

  const schema = yup
    .object({
      email: yup
        .string()
        .required("Vui lòng nhập email")
        .email("Email không hợp lệ"),
      password: yup.string().required("Vui lòng nhập mật khẩu")
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    })
    .required();

  const formData = [
    {
      label: "Email",
      placeholder: "Nhập email",
      name: "email",
      type: "text"
    },
    {
      label: "Mật khẩu",
      placeholder: "Nhập mật khẩu",
      name: "password",
      type: "password"
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
    mode: "all"
  });



  const submitData = (data) => {
    axios.post("http://localhost:8080/auth/customer/sign-in", data)
      .then((content) => {
        let response = content.data.data
        dispatch(LOGIN(response))
        navigate("/")
      })
      .catch((error) => {
        console.log(error);

        if (error.response) {
          setErr(error.response.data.message)
        }
      });



  }
  return (
    <section style={{ backgroundColor: "#f3f3f3" }} id="login">
      <form action="" onSubmit={handleSubmit(submitData)}>
        <Stack gap={3}>
          <Typography variant="h6" sx={{ fontWeight: "600" }} color="initial">
            Đăng nhập
          </Typography>
          {err != null ? <Alert severity="error">{err}</Alert> : ""}
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
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <NavLink to={"/forgotPassword"}>Quên mật khẩu?</NavLink>
          </Box>
          <Button
            type="submit"
            sx={{

              backgroundColor: "#ffcf20",
              color: "#1b1b1b",
              borderRadius: "999px",
              textTransform: "capitalize",
            }}
          >
            <b>Đăng nhập</b>
          </Button>
          <Button
            onClick={() => navigate("/register")}
            sx={{
              backgroundColor: "white",
              color: "#1b1b1b",
              border: "solid 1px #ccc",
              borderRadius: "999px",
              textTransform: "capitalize",
            }}
          >
            <b>
              Đăng ký tài khoản mới <ArrowForwardIcon></ArrowForwardIcon>
            </b>
          </Button>
        </Stack>
      </form>
    </section>
  );
};

export default Login;
