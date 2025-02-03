import React from 'react';
import { Box, Button, Stack, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import "./ForgotPassword.scss"
import Form from "react-bootstrap/Form";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { changePasswordByCode, checkCode } from '../../../api/customerApi'; // Thêm import cho hàm changePasswordByCode
import { useSelector } from 'react-redux';

const CheckCode = () => {
    const email = useSelector(state => state.forgot.email);
    const formData = [
        {
            label: "Xác thực tài khoản",
            placeholder: "Nhập mã xác thực",
            name: "code",
            type: "text"
        },
    ];

    const schema = yup
    .object({
        code: yup
        .string()
        .required("Vui lòng nhập mã xác thực")
        .min(8, "Mã xác thực phải có 8 ký tự") // Đảm bảo mã xác thực có 8 ký tự
    });

    const navigate = useNavigate();

    const navigateToLogin = () => {
        console.log("navigateToLogin");
        return navigate("/login");
    }

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            code: "",
        },
        resolver: yupResolver(schema),
        mode: "all"
    });

    const { mutate } = useMutation({
        mutationFn: (data) => checkCode(data.code), // Chỉ truyền mã xác thực
        onSuccess: (data) => {
            console.log("data", data);
            navigate("/reset-password"); // Điều hướng đến trang đổi mật khẩu
        },
        onError: (error) => {
            console.log("error", error);
            alert("Mã xác thực không hợp lệ hoặc chưa được nhận."); // Thông báo lỗi cho người dùng
        }
    });

    const onSubmit = (data) => {
        console.log("data", data);
        mutate(data);
    }

    return (
        <section style={{ backgroundColor: "#f3f3f3" }} id="forgot-password">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={3}>
                    <Typography variant="h5" sx={{ fontWeight: "600" }} color="initial">
                        Nhập mã xác thực
                    </Typography>

                    {errors.code && <span style={{ color: 'red' }}>{errors.code.message}</span>} {/* Hiển thị lỗi nếu có */}

                    {formData.map((item) => {
                        return (
                            <Form.Group key={item.name} className="form-input">
                                <Form.Label className="label">
                                    {item.label} <span>*</span>
                                </Form.Label>
                                <Controller
                                    name={item.name}
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            {...field}
                                            className="mb-0"
                                            type={item.type}
                                            placeholder={item.placeholder}
                                        />
                                    )}
                                />
                            </Form.Group>
                        );
                    })}
                    <Button
                        type="submit" // Đổi type thành submit
                        sx={{
                            backgroundColor: "#ffcf20",
                            color: "#1b1b1b",
                            borderRadius: "999px",
                            textTransform: "capitalize",
                        }}
                    >
                        <b>Đổi mật khẩu</b>
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

export default CheckCode
