import React from "react";
import Typography from "@mui/material/Typography";
import StarIcon from "@mui/icons-material/Star";
import {
  Box,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Radio,
  Stack,
} from "@mui/material";

const provinceFilter = [
  { label: "Hà Nội" },
  { label: "Hồ Chí Minh" },
  { label: "Đà Nẵng" },
  { label: "Khác" },
];

const ratingFilter = [
  { label: "Từ 5 sao", stars: 5 },
  { label: "Từ 4 sao", stars: 4 },
  { label: "Từ 3 sao", stars: 3 },
];

const priceFilter = [
  { label: "Từ 20k đến 200k" },
  { label: "Từ 200k đến 500k" },
  { label: "Từ 500k đến 1tr" },
  { label: "Từ 1tr trở lên" },
];

const ProductFilterSearch = () => {
  return (
    <div id="product-filter">
      <h3>Bộ lọc</h3>

      {/* Địa điểm */}
      <Box sx={{ margin: "30px 0" }}>
        <Typography className="filter-label" variant="h6">
          Địa điểm
        </Typography>
        <Stack direction="column" className="mt-4">
          {provinceFilter.map((item) => (
            <MenuItem key={item.label}>
              <FormControlLabel
                sx={{
                  "&:hover": { backgroundColor: "transparent" },
                }}
                control={
                  <Checkbox
                    sx={{
                      padding: 0,
                      "&:hover": { backgroundColor: "transparent" },
                    }}
                  />
                }
                label={
                  <Typography
                    className="checkbox-label"
                    variant="body2"
                    sx={{ fontSize: "0.875rem" }}
                  >
                    {item.label}
                  </Typography>
                }
              />
            </MenuItem>
          ))}
        </Stack>
      </Box>

      {/* Lọc đánh giá */}
      <Box sx={{ margin: "30px 0" }}>
        <Typography className="filter-label" variant="h6">
          Đánh giá
        </Typography>
        <Stack direction="column" className="mt-4">
          {ratingFilter.map((rating, index) => (
            <MenuItem key={index}>
              <FormControlLabel
                sx={{
                  "&:hover": { backgroundColor: "transparent" },
                }}
                control={
                  <Radio
                    name="rate"
                    sx={{
                      padding: 0,
                      "&:hover": { backgroundColor: "transparent" },
                    }}
                  />
                }
                label={
                  <Stack direction="row" alignItems="center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        sx={{ color: i < rating.stars ? "orange" : "#ddd" }}
                      />
                    ))}
                    <Typography
                      className="radio-label"
                      variant="body1"
                      sx={{ marginLeft: "5px" }}
                    >
                      {rating.label}
                    </Typography>
                  </Stack>
                }
              />
            </MenuItem>
          ))}
        </Stack>
      </Box>

      {/* Lọc giá */}
      <Box sx={{ margin: "30px 0" }}>
        <Typography className="filter-label" variant="h6">
          Giá
        </Typography>
        <Stack direction="column" className="mt-4">
          {priceFilter.map((price, index) => (
            <MenuItem key={index}>
              <FormControlLabel
                sx={{
                  "&:hover": { backgroundColor: "transparent" },
                }}
                control={
                  <Radio
                    name="price"
                    sx={{
                      padding: 0,
                      "&:hover": { backgroundColor: "transparent" },
                    }}
                  />
                }
                label={
                  <Typography
                    className="radio-label"
                    variant="body1"
                    sx={{ fontSize: "0.875rem" }}
                  >
                    {price.label}
                  </Typography>
                }
              />
            </MenuItem>
          ))}
        </Stack>
      </Box>
    </div>
  );
};

export default ProductFilterSearch;
