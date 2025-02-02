import React, { useEffect, useState } from "react"; // Thêm useEffect vào import
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Pagination, Stack, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Alert } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Loading from "../../client-module/loading/Loading";
import { getAllCustomers, updateCustomerManage, updateStatus } from "../../../api/customerApi";
import { Form } from "react-bootstrap";
import ModalEmail from "../shop-resgiter/ModalEmail";
const TableCustomer = () => {
    const [show,setShow] = useState(false)
    const [email,setMail] = useState(null)
    const handleMail = (email) =>{
        setMail(email)
        setShow(true)
    }
    const [isOpen, setIsOpen] = useState(false);
    const [cusEdit, setCusEdit] = useState(null);
    const toggleForm = (customers) => {
        setIsOpen(!isOpen);
        setCusEdit({
            ...customers,
            password: generatePassword()
        });
    }

    const handleClose =() =>{
        setShow(false)
    }

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

    const { data: customers, isLoading, refetch } = useQuery({
        queryKey: ['customers'],
        queryFn: getAllCustomers,
    })
   

    const [err, setErr] = useState(null);

    const { mutate } = useMutation({
        mutationFn: (data) => updateStatus(data),
        onSuccess: () => {
            refetch()
            Swal.fire({
                icon: "success",
                title: "Cập nhật tài khoản thành công",
                confirmButtonText: "Trở lại",
                confirmButtonColor: "#28a745",
            });
        },
        onError: (error) => {
            console.log(error)
        }
    })

    const queryClient = useQueryClient(); // Khởi tạo queryClient

    const { mutate: updateMutate } = useMutation({
        mutationFn: (data) => updateCustomerManage(data),
        onSuccess: () => {
            queryClient.refetchQueries(["customers"]);
            setIsOpen(false);
        },
        onError: (err) => {
            console.log(err);
            setErr(err.response.data.message);
        }
    });

    const onsubmit = (e) => {
        e.preventDefault();
        console.log(cusEdit);
        if (cusEdit.email === "") {
            setErr("Please enter email");
            return;
        } else if (!cusEdit.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/)) {
            setErr("Please enter valid email");
            return;
        } else {
            setErr(null);
            updateMutate(cusEdit); // Gọi hàm mutate để cập nhật dữ liệu
        }
    };


    const handleChangeStatus = (id, newStatus) => {
        console.log(id, newStatus);

        mutate({ id: id, status: newStatus })

    };
    const handleChange = (e) => {
        setCusEdit({ ...cusEdit, [e.target.name]: e.target.value });
    };

    if (isLoading) {
        return <Loading></Loading>
    } else {
        return (
            <div style={{ marginRight: "20px" }} className="mt-4">
                <ModalEmail handleClose={handleClose} show={show} email={email} subject={"Thông tin tài khoản"}></ModalEmail>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell >No</TableCell>
                                <TableCell >Email</TableCell>
                                <TableCell >Tên</TableCell>
                                <TableCell >Ngày tạo</TableCell>
                                <TableCell >Ngày chỉnh sửa</TableCell>
                                <TableCell >hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                customers.map((c, index) =>
                                (
                                    <TableRow
                                        key={c.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell >{c.email}</TableCell>
                                        <TableCell >{c.name}</TableCell>
                                        <TableCell >{c.create_at}</TableCell>
                                        <TableCell >{c.update_at}</TableCell>
                                        <TableCell >
                                            <Stack spacing={1} direction={"row"}>
                                                <div>
                                                    <Button variant="contained" color="success" onClick={() => toggleForm(c)}>chỉnh sửa</Button>
                                                    <Dialog open={isOpen} onClose={() => toggleForm(null)} fullWidth maxWidth="sm">
                                                        <DialogTitle>chỉnh sửa thông tin khách hàng</DialogTitle>
                                                        <DialogContent>
                                                            <Form onSubmit={onsubmit}>
                                                                {err != null ? <Alert severity="error">{err}</Alert> : null}
                                                                <TextField onChange={handleChange} value={cusEdit?.email} name='email' autoFocus margin="dense" label="Tên tài khoản" type="text" fullWidth />
                                                                <TextField onChange={handleChange} value={cusEdit?.name} name='name' autoFocus margin="dense" label="Tên người dùng" type="text" fullWidth />
                                                                <TextField value={cusEdit?.password} disabled autoFocus margin="dense" label="Mật khẩu" type="password" fullWidth />
                                                                <DialogActions>
                                                                    <Button onClick={() => toggleForm(null)} color="primary">Hủy</Button>
                                                                    <Button type='submit' color="primary">Gửi</Button>
                                                                </DialogActions>
                                                            </Form>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                                
                                                {c.status === 0 ? (
                                                    <Button variant="contained" color="success" onClick={() => handleChangeStatus(c.id, 1)}>
                                                        Kích hoạt
                                                    </Button>
                                                ) : c.status === 1 ? ( // Thêm điều kiện cho status 1
                                                    <Button variant="contained" color="error" onClick={() => handleChangeStatus(c.id, 2)}>
                                                        Chặn
                                                    </Button>
                                                ) : c.status === 2 ? ( // Sửa lỗi cú pháp ở đây
                                                    <Button variant="contained" color="primary" onClick={() => handleChangeStatus(c.id, 1)}>Bỏ chặn</Button>
                                                ) : null}
                                                <Button variant="contained" color="warning" onClick={() => handleMail(c.email)}>
                                                        Gửi mail
                                                    </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                )
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Pagination className="mt-4" count={10} color="primary" />
            </div>
        )
    }
}

export default TableCustomer
