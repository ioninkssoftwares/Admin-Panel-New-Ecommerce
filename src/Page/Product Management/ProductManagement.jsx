import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import CircularProgress from "@mui/material/CircularProgress";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";
import { toast } from "react-toastify";
import StockCheckPopup from "./stockcheckpopup";
import { saveAs } from "file-saver"; // Import saveAs from file-saver
import * as XLSX from "xlsx";
import SideBar from "../../Component/SideBar";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ProductList from "./ProductManagementTable";
import AddIcon from "@mui/icons-material/Add";
import ListItem from "@mui/material/ListItem";
import CategorySubcategoryDialog from "./showschemamodel";
import categoriesAndSubs from "./categoriesandsub.json"; // Import your category and subcategory data
import { Link } from "react-router-dom";

const ProductManagement = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading state of button
  const [popupOpen, setPopupOpen] = useState(false);
  const [searchProductInput, setSearchProductInput] = useState("");
  const [productSearchResult, setProductSearchResult] = useState(null);

  const handleProductSearch = () => {
    if (searchProductInput.trim() !== "") {
      const result = products.find(
        (product) => product._id === searchProductInput.trim()
      );
      setProductSearchResult(result || null);
    } else {
      setProductSearchResult(null);
    }
  };
  const showPopupForCategoriesAndSubs = () => {
    setDialogOpen(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true); // Set loading state to true when fetching data
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
      setLoading(false); // Set loading state to false after data is fetched
    }
  };
  const lowStockProducts = products.filter(
    (product) => product.stock < 5 && product.isVerified === "true"
  );

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleStockCheck = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };
  const exportToExcel = () => {
    // Create a new worksheet
    const ws = XLSX.utils.json_to_sheet([]);

    // Add headers to the worksheet
    const headers = [
      "Name",
      "Price",
      "Stock",
      "Category",
      "SubCategory",
      "Brand",
      "Description",
      "Specification",
      "WarrantyPeriod",
      "Active Product",
      "HSN Code",
      "Gst Percentage",
    ];
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });

    // Append products data to the worksheet
    const data = products.map((product) => [
      product.name,
      product.price,
      product.stock,
      product.category,
      product.subCategory,
      product.brand,
      product.description,
      product.specification,
      product.warrantyPeriod,
      product.isVerified,
      product.hsnCode,
      product.gstPerc,
    ]);
    XLSX.utils.sheet_add_aoa(ws, data, { origin: "A2" });

    // Set column widths
    const columnWidths = [
      { wpx: 150 }, // Name
      { wpx: 80 }, // Price
      { wpx: 60 }, // Stock
      { wpx: 100 }, // Category
      { wpx: 100 }, // SubCategory
      { wpx: 100 }, // Brand
      { wpx: 200 }, // Description
      { wpx: 200 }, // Specification
      { wpx: 120 }, // WarrantyPeriod
      { wpx: 100 }, // Active Product
      { wpx: 80 }, // HSN Code
      { wpx: 100 }, // Gst Percentage
    ];
    ws["!cols"] = columnWidths;

    // Create a workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Convert buffer to Blob
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Generate filename with current date and time
    const now = new Date();
    const formattedDate = now.toLocaleDateString().replace(/\//g, "-"); // Formats date as YYYY-MM-DD
    const formattedTime = now.toLocaleTimeString().replace(/:/g, "-"); // Formats time as HH-MM-SS
    const filename = `Products_Sheet_${formattedDate}_${formattedTime}.xlsx`;

    // Save the Excel file
    saveAs(blob, filename);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
        <Box sx={{ marginTop: "1rem" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              sx={{ background: "orange" }}
              variant="contained"
              onClick={exportToExcel} // Call exportToExcel function on button click
            >
              <ListItem disablePadding sx={{ display: "block" }}>
                Export Product
              </ListItem>
            </Button>
            {/* <Button
              sx={{ background: "orange" }}
              variant="contained"
              onClick={showPopupForCategoriesAndSubs}
            >
              <ListItem disablePadding sx={{ display: "block" }}>
                Category Management
              </ListItem>
            </Button> */}
            <Button
              sx={{ background: "orange" }}
              variant="contained"
              component={Link}
              to="/brandmanagement"
            >
              <AddIcon sx={{ mr: 1 }} />
              Brand Management
            </Button>
            <Button
              sx={{
                background: lowStockProducts.length > 0 ? "red" : "green",
                paddingRight: "50px",
              }}
              variant="contained"
              onClick={handleStockCheck}
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Stock"
              )}
              {lowStockProducts.length > 0 ? (
                <WarningIcon
                  sx={{ position: "absolute", top: "5px", right: "5px" }}
                />
              ) : (
                <CheckCircleOutlineIcon
                  sx={{ position: "absolute", top: "5px", right: "5px" }}
                />
              )}
            </Button>

            <Button
              sx={{ background: "orange" }}
              variant="contained"
              component={Link}
              to="/categorymanagement"
            >
              <AddIcon sx={{ mr: 1 }} />
              Add Category
            </Button>
          </Box>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "3%",
            }}
          >
            <div
              className="ProductManagementProductDetailsSecond00"
              style={{
                display: "flex",
                // flexDirection: "column",
                justifyContent: "space-between",
                marginTop: "2%",
                width: "100%",
              }}
            >
              {/* Container for the icon and all product statistics */}
              <div style={{ marginBottom: "1rem" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <PeopleOutlineIcon
                    sx={{
                      color: "black",
                      background: "#ffffcc",
                      p: 1,
                      fontSize: "40px",
                      borderRadius: "10px",
                      marginBottom: "12%"
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "16px", color: "black" }}
                  >
                    All Products
                    <br />
                    <Typography
                      paragraph
                      style={{ fontWeight: "500", color: "black" }}
                    >
                      {products && products.length}
                      <span
                        style={{
                          fontSize: "12px",
                          color: "green",
                          marginLeft: "4px",
                        }}
                      >
                        {/* Calculate the percentage based on the total count of products */}
                        {products &&
                          products.length > 0 &&
                          `+${(
                            (products.length / products.length) *
                            100
                          ).toFixed(2)}%`}
                      </span>
                    </Typography>
                  </Typography>
                </Box>
              </div>

              {/* Container for Verified Products */}
              <div style={{ marginBottom: "1rem", alignContent: "center" }}>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "14px", color: "grey" }}
                >
                  Verified Products
                  <br />
                  <Typography
                    paragraph
                    style={{ fontWeight: "500", color: "black" }}
                  >
                    {products &&
                      products.filter(
                        (product) => product.isVerified === "true"
                      ).length}
                  </Typography>
                </Typography>
              </div>

              {/* Container for Unverified Products */}
              <div style={{ alignContent: "center" }}>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "14px", color: "grey" }}
                >
                  Unverified Products
                  <br />
                  <Typography
                    paragraph
                    style={{ fontWeight: "500", color: "black" }}
                  >
                    {products &&
                      products.filter(
                        (product) => product.isVerified === "false"
                      ).length}
                  </Typography>
                </Typography>
              </div>
            </div>

            {/* <div
              className="ProductManagementProductDetailsSecond00"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                width: "50%",
                padding: "2%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "5%",
                  marginBottom: "2%",
                }}
              >
                <TextField
                  label="Search Product ID"
                  variant="outlined"
                  value={searchProductInput}
                  onChange={(e) => setSearchProductInput(e.target.value)}
                  sx={{ marginRight: "1rem" }}
                />
                <Button
                  onClick={handleProductSearch}
                  sx={{ background: "orange" }}
                  variant="contained"
                >
                  <SearchIcon />
                </Button>
              </Box>

              {productSearchResult ? (
                <Card
                  sx={{
                    width: "100%",
                    maxWidth: "500px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "10px",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "14px",
                        color: "grey",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Product Name:
                      <Typography
                        component="span"
                        style={{
                          fontWeight: "500",
                          color: "black",
                          marginLeft: "0.5rem",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          WebkitLineClamp: 1, // Limit to 2 lines
                        }}
                      >
                        {productSearchResult.name}
                      </Typography>
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "14px",
                        color: "grey",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Stock:
                      <Typography
                        component="span"
                        style={{
                          fontWeight: "500",
                          color: "black",
                          marginLeft: "0.5rem",
                        }}
                      >
                        {productSearchResult.stock}
                      </Typography>
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap", // Allow wrapping if content exceeds width
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "14px",
                          color: "grey",
                          marginBottom: "0.5rem",
                          flex: "1", // Distribute available space equally among all items
                        }}
                      >
                        Category:
                        <Typography
                          component="span"
                          style={{
                            fontWeight: "500",
                            color: "black",
                            marginLeft: "0.5rem",
                          }}
                        >
                          {productSearchResult.category}
                        </Typography>
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "14px",
                          color: "grey",
                          marginBottom: "0.5rem",
                          flex: "1", // Distribute available space equally among all items
                        }}
                      >
                        Subcategory:
                        <Typography
                          component="span"
                          style={{
                            fontWeight: "500",
                            color: "black",
                            marginLeft: "0.5rem",
                          }}
                        >
                          {productSearchResult.subCategory}
                        </Typography>
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "14px",
                          color: "grey",
                          marginBottom: "0.5rem",
                          flex: "1", // Distribute available space equally among all items
                        }}
                      >
                        Brand:
                        <Typography
                          component="span"
                          style={{
                            fontWeight: "500",
                            color: "black",
                            marginLeft: "0.5rem",
                          }}
                        >
                          {productSearchResult.brand}
                        </Typography>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                ""
              )}
            </div> */}
          </div>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
              marginBottom: "15px",
            }}
          >
            <ProductList setProducts={setProducts} />{" "}
            {/* Pass setProducts function as prop */}
          </Box>
        </Box>
      </Box>
      <CategorySubcategoryDialog
        open={dialogOpen}
        handleClose={handleClose}
        data={categoriesAndSubs}
      />
      <StockCheckPopup
        open={popupOpen}
        handleClose={handleClosePopup}
        products={lowStockProducts}
      />
    </Box>
  );
};

export default ProductManagement;
