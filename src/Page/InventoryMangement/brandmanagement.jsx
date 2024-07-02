import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, TextField, Typography } from "@mui/material";

import "./brandsmanagement.css";
import SideBar from "../../Component/SideBar";
import Cookies from "js-cookie"; // Import Cookies library
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import "./addbanner.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const BrandsManagement = () => {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState("");
  const [order, setOrder] = useState("asc"); // State for sorting order
  const [orderBy, setOrderBy] = useState("brandName"); // State for sorting column
  const [confirmDelete, setConfirmDelete] = useState(null); // State for confirmation dialog

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const token = Cookies.get("token"); // Fetch user token from cookies
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admin/getAllBrands`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );
      setBrands(
        response.data.brands.map((brand) => ({
          ...brand,
          brandName: capitalizeFirstLetter(brand.brandName),
        }))
      ); // Capitalize brand names before setting them
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleAddBrand = async () => {
    if (newBrand.trim() !== "") {
      try {
        const token = Cookies.get("token"); // Fetch user token from cookies
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/admin/brand/new`,
          { brandName: newBrand.trim() },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in headers
            },
          }
        );
        // Show success toast
        fetchBrands();
        setNewBrand("");
      } catch (error) {
        console.error("Error adding brand:", error);
        // Show error toast
      }
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedBrands = brands.slice().sort((a, b) => {
    const isAsc = order === "asc";
    if (a[orderBy] < b[orderBy]) {
      return isAsc ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return isAsc ? 1 : -1;
    }
    return 0;
  });

  const handleDelete = (brandId) => {
    // Open confirmation dialog
    setConfirmDelete(brandId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const token = Cookies.get("token");
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/admin/brand/${confirmDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Show success toast
      fetchBrands();
    } catch (error) {
      console.error("Error deleting brand:", error);
      // Show error toast
    } finally {
      // Close confirmation dialog
      setConfirmDelete(null);
    }
  };

  const handleSortDirection = (property) => {
    return orderBy === property ? order : "asc";
  };

  return (
    <Box display="flex">
      <SideBar />
      <Box flexGrow={1} p={3}>
        <Box mb={3}>
          <Typography variant="h4" component="h1">
            Brands Management
          </Typography>
        </Box>
        <Box display="flex" mb={3} alignItems="center">
          <TextField
            label="Enter brand name"
            variant="outlined"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddBrand}
            sx={{ ml: 2 }}
          >
            Add Brand
          </Button>
        </Box>
        {brands.length === 0 ? (
          <Typography variant="h6" color="textSecondary">
            No brands available or added.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ width: "100%" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort("brandName")}
                    >
                      Brand Name
                      {orderBy === "brandName" ? (
                        order === "asc" ? (
                          <ArrowUpward fontSize="small" />
                        ) : (
                          <ArrowDownward fontSize="small" />
                        )
                      ) : null}
                    </Box>
                  </TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedBrands.map((brand) => (
                  <TableRow key={brand._id}>
                    <TableCell>{brand.brandName}</TableCell>
                    <TableCell>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDelete(brand._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {confirmDelete !== null && (
          <div className="delete-confirmation-modal">
            <div className="modal-content">
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this Brand?</p>
              <div className="delete-confirmation-buttons">
                <button onClick={handleDeleteConfirmed} >
                  Delete
                </button>

                <button onClick={() =>  setConfirmDelete(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </Box>
    </Box>
  );
};

export default BrandsManagement;
