import  { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import AddBannerModal from "./ModalAdd";
import { fetch } from "../../../api/Fetch";
const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    fetchBanners();
  }, []);
  const handleAddBanner = async (formData) => {
    try {
         await fetch.post("/banners", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
      fetchBanners();
    } catch (error) {
      console.error("Lỗi khi thêm banner:", error);
    }
  };
  const fetchBanners = async () => {
    try {
      const response = await fetch.get("/banners");
      setBanners(response.data);
    } catch (error) {
      console.error("Failed to fetch banners", error);
    }
  };

  const handleDeleteClick = (banner) => {
    setSelectedBanner(banner);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedBanner) {
      try {
        await fetch.delete(`/banners/${selectedBanner.id}`);
        fetchBanners();
      } catch (error) {
        console.error("Failed to delete banner", error);
      }
    }
    setOpenDialog(false);
    setSelectedBanner(null);
  };

  return (
    <div>

    
    <Card>
      <CardHeader title="Banner Management" action={
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Add Banner
        </Button>
      
      } />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {(Array.isArray(banners) && banners.length > 0) ? (
                    banners.map((banner) => (
                        <TableRow key={banner.id}>
                        <TableCell>{banner.id}</TableCell>
                        <TableCell>{banner.description}</TableCell>
                        <TableCell>
                            <img src={banner.image} alt={`Image of ${banner.title}`} width={100} height={50} />
                        </TableCell>
                        <TableCell>
                            <Button color="primary" startIcon={<EditIcon />}>Edit</Button>
                            <Button color="secondary" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(banner)}>
                            Delete
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={4} align="center">
                        No banners available
                        </TableCell>
                    </TableRow>
                    )}

            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this banner?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
    <AddBannerModal open={open} handleClose={() => setOpen(false)} handleAddBanner={handleAddBanner} />
    </div>
  );
};

export default BannerManager;
