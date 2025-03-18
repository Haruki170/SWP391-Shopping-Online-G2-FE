import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Checkbox,
    Link,
    FormControlLabel,
    Alert,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { LOGIN, LOGOUT } from "../../../redux/slice/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../../../api/AdminApi";
import Loading from "../../client-module/loading/Loading";
import { SAVE_EMAIL } from "../../../redux/slice/ForgotPasswordSlice";

// Định nghĩa schema với yup
const schema = yup.object().shape({
    email: yup
        .string()
        .required("Vui lòng nhập email")
        .email("Email không hợp lệ")
});

const ForgotPasswordAdmin = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [err, setErr] = useState(null)

    const { mutate, isPending } = useMutation({
        mutationFn: (data) => forgotPassword(data),
        onSuccess: (response) => {
            console.log(response);
            dispatch(SAVE_EMAIL(response))
            navigate("/admin-gate/send-code");
            return; // Đảm bảo không có giá trị trả về
        },
        onError: (error) => {
            console.log(error);
            if (err.response) {
                setErr(error.response.data.message);
            }

        }
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema), // Tích hợp yup để kiểm tra form
        mode: "all",
    });

    const onSubmit = async (data) => {
        mutate(data);
    }
    if (isPending) {
        return <Loading />
    }
    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    boxShadow: 3,
                    padding: 4,
                    borderRadius: 2,
                    bgcolor: "#ffffff",
                }}
            >
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{ fontWeight: "bold", mb: 1 }}
                >
                    Welcome to 6MEMs! 👋
                </Typography>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 3, textAlign: "center" }}
                >
                    nhập email để đặt lại mật khẩu
                </Typography>
                {/* Hiển thị cảnh báo lỗi nếu có lỗi */}
                {err && (
                    <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
                        {err}
                    </Alert>
                )}
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    sx={{ width: "100%" }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        placeholder="Enter your email or username"
                        autoFocus
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email ? errors.email.message : ""}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            background: "#6c5ce7",
                            color: "#fff",
                            textTransform: "none",
                            fontWeight: "bold",
                        }}
                    >
                        Gửi mã xác thực
                    </Button>
                    <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                        <Link href="/admin-gate/login" sx={{ color: "#6c5ce7", fontWeight: "bold" }}>
                            Bạn đã là thành viên? Đăng nhập ngay!
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default ForgotPasswordAdmin;
