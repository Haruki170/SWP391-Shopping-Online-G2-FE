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
import { checkCode, forgotPassword } from "../../../api/AdminApi";
import Loading from "../../client-module/loading/Loading";

// Định nghĩa schema với yup
const schema = yup.object().shape({
    code: yup
        .string()
        .required("Vui lòng nhập mã xác thực")
        .min(8, "Mã xác thực phải có 8 ký tự")
});

const SendCode = () => {
    const email = useSelector(state => state.forgot.email);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [err, setErr] = useState(null)

    const { mutate, isPending } = useMutation({
        mutationFn: (data) => checkCode(data),
        onSuccess: (response) => {
            console.log(response);
            navigate("/admin-gate/reset-password");
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
        defaultValues: {
            code: "",
        },
        resolver: yupResolver(schema), // Tích hợp yup để kiểm tra form
        mode: "all",
    });

    const onSubmit = async (data) => {
        console.log(data);

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
                    Welcome to Chus! 👋
                </Typography>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 3, textAlign: "center" }}
                >
                    Đăng nhập để truy cập quản trị
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
                        id="code"
                        label="Mã xác thực"
                        name="code"
                        autoComplete="code"
                        placeholder="nhập mã xác thực"
                        autoFocus
                        {...register("code")}
                        error={!!errors.code}
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

export default SendCode;
