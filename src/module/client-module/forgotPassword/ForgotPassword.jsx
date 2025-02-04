import React, { useState } from 'react';
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import "./ForgotPassword.scss"
import Form from "react-bootstrap/Form";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPassword } from '../../../api/customerApi';
import { useMutation } from '@tanstack/react-query'; // Thêm import useMutation
import Loading from '../loading/Loading';
import { useDispatch } from 'react-redux';
import { SAVE_EMAIL } from '../../../redux/slice/ForgotPasswordSlice';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const formData = [
    {
      label: "Email",
      placeholder: "Nhập email",
      name: "email",
      type: "text"
    },
  ];

  const [err, setErr] = useState(null);

  const schema = yup
    .object({
      email: yup
        .string()
        .required("vui lòng nhập email")
        .email("Email không hợp lệ")
    });

  const { control, register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(schema),
    mode: "all"
  });

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => forgotPassword(data),
    onSuccess: (data) => {
      dispatch(SAVE_EMAIL(data))
      return navigate("/send-code");
    },
    onError: (error) => {
      console.log(error);
      setErr(error.response.data.message);

    }
  })

  const onSubmit = (data) => {

    mutate(data); // Gọi mutate với dữ liệu email
  };

  const navigateToLogin = () => {
    console.log("navigateToLogin");
    return navigate("/login");
  };

  if(isPending){
    return <Loading />
  }

  return (
    <section style={{ backgroundColor: "#f3f3f3" }} id="forgot-password">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={3}>
          <Typography variant="h5" sx={{ fontWeight: "600" }} color="initial">
            Đổi mật khẩu
          </Typography>

          {err != null ? <Alert severity='error'>{err}</Alert> : null}

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
                  {...register("email")}
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
            <b>Lấy lại mật khẩu</b>
          </Button>
          <Button
            type="button"
            onClick={navigateToLogin}
            sx={{
              backgroundColor: "white",
              color: "#1b1b1b",
              borderRadius: "999px",
              textTransform: "capitalize",
              border: "1px solid rgba(0, 0, 0, 0.5) !important",
            }}
          >
            <b>Bạn đã là thành viên? Đăng nhập ngay!</b>
          </Button>
        </Stack>
      </form>
    </section>
  );
}

export default ForgotPassword;
