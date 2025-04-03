import  { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import { styled } from "@mui/system";

const StyledBox = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "white",
  boxShadow: 24,
  padding: "20px",
  borderRadius: "8px",
});



  return (
    <Modal open={open} onClose={handleClose}>
      <StyledBox>
        <h2>Thêm Banner</h2>
        <TextField
          label="Mô tả"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ marginBottom: "16px" }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={handleClose} color="error">
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Thêm
          </Button>
        </Box>
      </StyledBox>
    </Modal>
  );
};

export default AddBannerModal;
