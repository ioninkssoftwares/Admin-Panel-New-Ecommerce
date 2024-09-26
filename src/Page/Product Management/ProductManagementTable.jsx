import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TableSortLabel from "@mui/material/TableSortLabel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from "js-cookie";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admin/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        setProducts([]);
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/editproduct/${productId}`);
  };

  const handleDeleteClick = (productId) => {
    setDeleteProductId(productId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/admin/product/${deleteProductId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const sortedProducts = [...products].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const filteredProducts = sortedProducts.filter((product) => {
    const name = String(product.name).toLowerCase();
    const category = String(product.category).toLowerCase();
    const subCategory = String(product.subCategory).toLowerCase();
    const brand = String(product.brand).toLowerCase();
    const price = String(product.price).toLowerCase();
    const stock = String(product.stock).toLowerCase();

    return (
      name.includes(searchQuery) ||
      category.includes(searchQuery) ||
      subCategory.includes(searchQuery) ||
      brand.includes(searchQuery) ||
      price.includes(searchQuery) ||
      stock.includes(searchQuery)
    );
  });

  return (
    <div
      className="thethings"
      style={{ display: "flex", width: "100%", flexDirection: "column" }}
    >
      <h2>Product List</h2>
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search a Product"
          onChange={handleSearch}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              padding: "1px",
              borderRadius: "10px",
              boxSizing: "border-box",
              fontSize: "16px",
              maxWidth: "300px",
            },
          }}
        />
      </Box>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper} style={{ width: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "35%", fontWeight: "bold" }}>
                  Name
                </TableCell>
                <TableCell style={{ width: "35%", fontWeight: "bold" }}>
                  Vendor Id
                </TableCell>
                <TableCell style={{ width: "15%", fontWeight: "bold" }}>
                  Category
                </TableCell>
                <TableCell style={{ width: "15%", fontWeight: "bold" }}>
                  Sub Category
                </TableCell>
                <TableCell style={{ width: "10%", fontWeight: "bold" }}>
                  Brand
                </TableCell>
                {/* <TableCell style={{ width: "25%", fontWeight: "bold" }}>
                  Selling Price
                </TableCell> */}
                <TableCell style={{ width: "10%", fontWeight: "bold" }}>
                  Stock
                </TableCell>
                <TableCell style={{ width: "15%", fontWeight: "bold" }}>
                  Status
                </TableCell>
                <TableCell style={{ width: "1%", fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    {product.name.charAt(0).toUpperCase() +
                      product.name.slice(1)}
                  </TableCell>
                  <TableCell>{product.vendorId}</TableCell>
                  <TableCell>{product.category.toUpperCase()}</TableCell>
                  <TableCell>
                    {product.subCategory.charAt(0).toUpperCase() +
                      product.subCategory.slice(1)}
                  </TableCell>
                  <TableCell>{product.brand.toUpperCase()}</TableCell>
                  {/* <TableCell>₹ {product.price}</TableCell> */}
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    {product.isVerified === true ? (
                      <p
                        style={{
                          backgroundColor: "#32936F29",
                          textAlign: "center",
                          borderRadius: "8px",
                          padding: "4px 11px",
                        }}
                      >
                        Active
                      </p>
                    ) : (
                      <p
                        style={{
                          backgroundColor: " #FF578929",
                          textAlign: "center",
                          borderRadius: "8px",
                          padding: "4px 11px",
                        }}
                      >
                        Inactive
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(product._id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteClick(product._id)}
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
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions className="delete-confirmation-buttons">
          <button onClick={handleDeleteConfirm} autoFocus>
            Delete
          </button>
          <button
            style={{ backgroundColor: "#dc3545" }}
            onClick={handleDeleteCancel}
          >
            Cancel
          </button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default ProductList;
