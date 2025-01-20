import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Alert } from '@mui/material';
import { Form } from 'react-bootstrap';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../main';
import { InsertCustomers } from '../../../api/customerApi';

const InsertCustomer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [customer, setCustomer] = useState({
        email: "",
        name: "",
        password: ""
    });
    const [err, setErr] = useState(null);

    const toggleForm = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setCustomer({
                ...customer, password: generatePassword()
            });
        }
    };

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let password = '';
        password += chars.charAt(Math.floor(Math.random() * 26 + 26)); // 1 uppercase
        password += chars.charAt(Math.floor(Math.random() * 26)); // 1 lowercase
        password += chars.charAt(Math.floor(Math.random() * 10 + 52)); // 1 number
        password += chars.charAt(Math.floor(Math.random() * 10 + 62)); // 1 special character
        for (let i = 4; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length)); // 2 random
        }
        return password.split('').sort(() => 0.5 - Math.random()).join(''); // shuffle
    };

    const handleChange = (e) => {
        setCustomer({
            ...customer,
            [e.target.emai]: e.target.value,
            [e.target.name]: e.target.value
        });
    };

    const onsubmit = (e) => {
        e.preventDefault();
        console.log(customer);
        if (customer.email === "") {
            setErr("Vui lòng nhập email");
            return;
        } else if (!customer.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/)) {
            setErr("Vui lòng nhập email hợp lệ");
            return;
        } else if (customer.name === "") {
            setErr("Vui lòng nhập tên");
            return;
        }
        else {
            setErr(null);
            mutate(customer);
        }
    };

    const { mutate } = useMutation({
        mutationFn: (data) => InsertCustomers(data),
        onSuccess: () => {
            queryClient.refetchQueries(["customer"]);
            setIsOpen(false);
            Swal.fire({
                icon: "success",
                title: "Thêm tài khoản thành công",
                confirmButtonText: "Trở lại",
                confirmButtonColor: "#28a745",
            });
        },
        onError: (err) => {
            console.log(err.response.data.message);
            setErr(err.response.data.message);
        }
    });

    return (
        <div>
            <Button variant="contained" onClick={toggleForm}>Thêm Khách Hàng</Button>

            <Dialog open={isOpen} onClose={toggleForm} fullWidth maxWidth="sm">
                <DialogTitle>Thêm Tài Khoản</DialogTitle>
                <DialogContent>
                    <Form onSubmit={onsubmit}>
                        {err != null ? <Alert severity="error">{err}</Alert> : null}
                        <TextField onChange={handleChange} value={customer.email} name='email' autoFocus margin="dense" label="Tên tài khoản" type="text" fullWidth />
                        <TextField onChange={handleChange} value={customer.name} name='name' autoFocus margin="dense" label="Tên người dùng" type="text" fullWidth />
                        <TextField value={customer.password} disabled autoFocus margin="dense" label="Mật khẩu" type="password" fullWidth />
                        <DialogActions>
                            <Button onClick={toggleForm} color="primary">Hủy</Button>
                            <Button type='submit' color="primary">Gửi</Button>
                        </DialogActions>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default InsertCustomer;
