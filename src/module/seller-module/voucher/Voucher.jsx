import React, { useState } from "react";
import "./Voucher.scss"; // Thêm import cho file CSS
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Stack,
} from "@mui/material";
import { styled } from "@mui/system";
import { FaTicketAlt, FaPlus, FaRegCopy } from "react-icons/fa";
import { getAllVoucher, insertVoucher } from "../../../api/voucherApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import Swal from 'sweetalert2';

const StyledCard = styled(Card)(({ theme }) => ({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: theme.shadows
    },
}));

const FloatingAddButton = styled(Button)({
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    minWidth: "unset",
});

const VoucherList = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [err, setErr] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [newVoucher, setNewVoucher] = useState({
        code: "",
        discountAmount: "",
        minOrderAmount: "",
        startDate: "",
        endDate: "",
        description: "",
    });

    const { data: vouchers = [], isLoading, refetch } = useQuery({
        queryKey: ["vouchers"],
        queryFn: getAllVoucher,
    });

    const { mutate: addVoucher } = useMutation({
        mutationFn: (data) => insertVoucher(data),
        onSuccess: () => {
            refetch();
            Swal.fire({
                icon: "success",
                title: "Thêm voucher thành công",
                confirmButtonText: "Trở lại",
                confirmButtonColor: "#28a745",
            });
            setOpenDialog(false);
            setNewVoucher({ code: "", discountAmount: "", endDate: "", description: "" });
        },
        onError: (error) => {
            setErr(error.response.data.message);
            console.log(error.response.data.message);
        }
    });

    const handleAddVoucher = () => {
        try {
            if (!newVoucher.code || !newVoucher.discountAmount || !newVoucher.endDate || !newVoucher.startDate) {
                throw new Error("Please fill in all required fields");
            }

            addVoucher(newVoucher);
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.message,
                severity: "error",
            });
        }
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setSnackbar({
            open: true,
            message: "Voucher code copied to clipboard!",
            severity: "success",
        });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }} >
            <Typography variant="h4" component="h1" gutterBottom>
                Danh sách voucher
            </Typography>

            <Grid container spacing={3}>
                {vouchers.map((voucher) => (
                    <Grid item xs={12} sm={6} md={4} key={voucher.id}>
                        <StyledCard>
                            <CardContent>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 2,
                                    }}
                                >
                                    <Stack>

                                        <Typography variant="h6" component="div">
                                            <FaTicketAlt size={24} style={{ marginRight: "8px" }} />Giảm {voucher.discountAmount}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            aria-label="Expiry date"
                                        >
                                            Đơn hàng tối thiểu: {voucher.minOrderAmount}
                                        </Typography>
                                    </Stack>
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        mb: 1,
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{ fontWeight: "bold" }}
                                        aria-label="Voucher code"
                                    >
                                        {voucher.code}
                                    </Typography>
                                    <IconButton
                                        onClick={() => handleCopyCode(voucher.code)}
                                        aria-label="sao chép mã"
                                    >
                                        <FaRegCopy />
                                    </IconButton>
                                </Box>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                    aria-label="Voucher description"
                                >
                                    {voucher.description}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    aria-label="Expiry date"
                                >
                                    Số lượng: {voucher.quantity}
                                </Typography>
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={{ xs: 1, sm: 2, md: 4 }} >
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        aria-label="Start date"
                                    >
                                        Ngày băt đầu: {new Date(voucher.startDate).toLocaleDateString()}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        aria-label="Expiry date"
                                    >
                                        Ngày hết hạn: {new Date(voucher.endDate).toLocaleDateString()}
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>

            <FloatingAddButton
                variant="contained"
                color="primary"
                onClick={() => setOpenDialog(true)}
                aria-label="Add new voucher"
            >
                <FaPlus size={24} />
            </FloatingAddButton>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="add-voucher-dialog"
            >
                <DialogTitle id="add-voucher-dialog">Thêm Voucher</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Mã giảm giá"
                        fullWidth
                        value={newVoucher.code}
                        onChange={(e) =>
                            setNewVoucher({ ...newVoucher, code: e.target.value })
                        }
                        required
                    />
                    <TextField
                        margin="dense"
                        label="giảm giá"
                        fullWidth
                        value={newVoucher.discountAmount}
                        onChange={(e) =>
                            setNewVoucher({ ...newVoucher, discountAmount: e.target.value })
                        }
                        required
                    />
                    <TextField
                        margin="dense"
                        label="đơn hàng tối thiểu"
                        fullWidth
                        value={newVoucher.minOrderAmount}
                        onChange={(e) =>
                            setNewVoucher({ ...newVoucher, minOrderAmount: e.target.value })
                        }
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Ngày bắt đầu"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={newVoucher.startDate}
                        onChange={(e) =>
                            setNewVoucher({ ...newVoucher, startDate: e.target.value })
                        }
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Ngày hết hạn"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={newVoucher.endDate}
                        onChange={(e) =>
                            setNewVoucher({ ...newVoucher, endDate: e.target.value })
                        }
                        required
                    />
                    <TextField
                        margin="dense"
                        label="số lượng"
                        fullWidth
                        value={newVoucher.quantity}
                        onChange={(e) =>
                            setNewVoucher({ ...newVoucher, quantity: e.target.value })
                        }
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        value={newVoucher.description}
                        onChange={(e) =>
                            setNewVoucher({ ...newVoucher, description: e.target.value })
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddVoucher} variant="contained">
                        Add Voucher
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container >
    );
};

export default VoucherList;
