import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import SearchIcon from "@mui/icons-material/Search";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { saveAs } from "file-saver";
import SideBar from "../../Component/SideBar";
import ServiceOrderManagementTable from "./ServiceOrderManagementTable";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {
  Table,
  TableCell,
  TableRow,
  TableBody,
  Card,
  CardContent,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import * as XLSX from "xlsx";
export default function ServiceOrderManagement() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["token"]);
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    product: "",
    user: "",
    shippingCharges: 0,
    discount: 0,
    quantity: 1,
    subtotal: 0,
    total: 0,
  });
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("");
  const [openOrderSummary, setOpenOrderSummary] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  if (orders) console.log(orders, "orderrrrr");
  const handleSearch = () => {
    if (searchInput.trim() !== "") {
      const result = orders.find((order) => order._id === searchInput.trim());
      setSearchResult(result || null);
    } else {
      setSearchResult(null);
    }
  };

  const handleOpenOrderSummary = () => {
    setOpenOrderSummary(true);
  };

  const handleCloseOrderSummary = () => {
    setOpenOrderSummary(false);
  };
  useEffect(() => {
    const token = cookies.token;
    if (!token) {
      navigate("/loginadmin");
      return;
    }
    fetchData();
  }, [cookies, navigate]);

  const fetchData = async () => {
    try {
      const token = cookies.token;

      // Fetch service orders
      const orderResponse = await fetch(
        `${process.env.REACT_APP_BASE_URL}/order/service/getServiceOrder`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!orderResponse.ok) {
        throw new Error("Failed to fetch orders");
      }
      const orderData = await orderResponse.json();
      if (orderData.success && orderData.data) {
        setOrders(orderData.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDownloadExcel = () => {
    // Function for downloading excel
  };

  const countOrdersByStatus = (status) => {
    return orders.filter((order) => order.status === status).length;
  };

  const handleCreateOrder = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      product: "",
      user: "",
      shippingCharges: 0,
      discount: 0,
      quantity: 1,
      subtotal: 0,
      total: 0,
    });
    setSelectedProduct(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };
    if (name === "quantity") {
      // Update quantity and recalculate subtotal and total
      updatedFormData = {
        ...updatedFormData,
        quantity: value,
        subtotal: selectedProduct ? selectedProduct.price * value : 0,
      };
      // Calculate total
      const total =
        updatedFormData.subtotal +
        Number(updatedFormData.shippingCharges) -
        Number(updatedFormData.discount);
      updatedFormData = { ...updatedFormData, total };
    } else if (name === "shippingCharges" || name === "discount") {
      // Update shipping charges or discount and recalculate total
      const total =
        formData.subtotal +
        Number(updatedFormData.shippingCharges) -
        Number(updatedFormData.discount);
      updatedFormData = { ...updatedFormData, total };
    }
    setFormData(updatedFormData);
  };

  const handleProductChange = (e) => {
    const selectedProductId = e.target.value;
    const selectedProduct = products.find(
      (product) => product._id === selectedProductId
    );
    setSelectedProduct(selectedProduct);
    // Update subtotal and total when product changes
    const subtotal = selectedProduct
      ? selectedProduct.price * formData.quantity
      : 0;
    const total =
      subtotal + Number(formData.shippingCharges) - Number(formData.discount);
    setFormData({ ...formData, subtotal, total });
  };

  const handleAdminChange = (e) => {
    setSelectedAdmin(e.target.value);
  };
  const handleOrderStatusChange = (e) => {
    setSelectedOrderStatus(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const token = cookies.token;
      const payload = {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pinCode: formData.pinCode,
        product: selectedProduct._id, // Send the product ID
        quantity: formData.quantity,
        shippingCharges: formData.shippingCharges,
        discount: formData.discount,
        subtotal: formData.subtotal,
        total: formData.total,
        user: selectedAdmin, // Send the selected user ID
      };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/order/new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create order");
      }
      toast.success("Order created successfully");
      handleClose();
      fetchData(); // Refresh order data
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
    }
  };

  const calculateSubtotalAndTotal = (
    product,
    quantity,
    shippingCharges,
    discount
  ) => {
    if (product) {
      const subtotal = product.price * quantity;
      const total = subtotal + shippingCharges - discount;
      setFormData({ ...formData, subtotal, total });
    }
  };
  const downloadOrderSummary = () => {
    // Filter orders based on the selected order status
    const filteredOrders =
      selectedOrderStatus === "all"
        ? orders
        : orders.filter((order) => order.status === selectedOrderStatus);

    // Convert filtered orders to CSV format
    const csvData = convertOrdersToCSV(filteredOrders);

    // Generate Excel file from CSV data
    generateExcelFile(csvData);
  };

  const convertOrdersToCSV = (orders) => {
    // Get current date and time
    const currentDateTime = new Date().toLocaleString();

    // Create CSV headers
    let csvData = `Downloaded Date: ${currentDateTime}\n\nOrder ID,Ordered Date,Product Id,Quantity,Total Price,User Id,User Name\n`;

    // Append order details to CSV data
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt).toLocaleString();
      csvData += `${order._id},${orderDate},${order.product},${order.quantity},${order.total},${order.user.id},${order.user.name}\n`;
    });

    return csvData;
  };

  const generateExcelFile = (csvData) => {
    // Parse CSV data into an array of arrays
    const parsedData = csvData.split("\n").map((row) => row.split(","));

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Add a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(parsedData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Order Summary");

    // Generate a blob from the workbook
    const excelBlob = workbookToArrayBuffer(workbook);

    // Trigger the download
    saveAs(excelBlob, "order_summary.xlsx");
  };

  const workbookToArrayBuffer = (workbook) => {
    // Convert the workbook to an array buffer
    const excelArrayBuffer = XLSX.write(workbook, {
      type: "array",
      bookType: "xlsx",
    });

    // Create a blob from the array buffer
    return new Blob([excelArrayBuffer], { type: "application/octet-stream" });
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };
  const exportToExcel = () => {
    // Create a new worksheet
    const ws = XLSX.utils.json_to_sheet([]);

    // Add headers to the worksheet
    const headers = [
      "OrderId",
      "Customer name",
      "Ordered Date",
      "Product Id",
      "Quantity",
      "Sub Total",
      "Shipping Charges",
      "Discount",
      "Total",
      "Address",
      "City",
      "State",
    ];
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });

    // Append products data to the worksheet
    const data = orders.map((product) => [
      product._id,
      product.user?.name,
      formatDate(product.createdAt),
      product.product,
      product.quantity,
      product.subtotal,
      product.shippingCharges,
      product.discount,
      product.total,
      product.shippingInfo.address,
      product.shippingInfo.city,
      product.shippingInfo.state,
    ]);
    XLSX.utils.sheet_add_aoa(ws, data, { origin: "A2" });

    // Set column widths
    const columnWidths = [
      { wpx: 160 }, // OrderId
      { wpx: 150 }, // Customer name
      { wpx: 120 }, // Ordered Date
      { wpx: 160 }, // Product Id
      { wpx: 70 }, // Quantity
      { wpx: 100 }, // Sub Total
      { wpx: 120 }, // Shipping Charges
      { wpx: 100 }, // Discount
      { wpx: 100 }, // Total
      { wpx: 200 }, // Address
      { wpx: 100 }, // City
      { wpx: 100 }, // State
    ];
    ws["!cols"] = columnWidths;

    // Create a workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

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
    const filename = `Orders_Sheet_${formattedDate}_${formattedTime}.xlsx`;

    // Save the Excel file
    saveAs(blob, filename);
  };
  const deliveredOrders =
    orders?.filter((order) => order.status === "Delivered") || [];
  const deliveredPercentage =
    orders && orders.length > 0
      ? ((deliveredOrders.length / orders.length) * 100).toFixed(2)
      : 0;
  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "55px" }}>
        <Box sx={{ marginTop: "1rem" }}>
          {/* <Button
            // onClick={handleOpenOrderSummary}
            onClick={exportToExcel}
            sx={{ background: "orange" }}
            variant="contained"
          >
            SErvice Order Summary
          </Button>
          <Button
            onClick={handleCreateOrder}
            sx={{ background: "orange", ml: 2 }}
            variant="contained"
          >
            Create SErvice Order
          </Button> */}
        </Box>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            className="ProductManagementProductDetailsSecond00"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "2%",
              width: "100%",
              marginBottom: "2%",
            }}
          >
            {/* Container for the icon and all order statistics */}
            <div
              style={{ flex: "1", marginRight: "1rem", alignContent: "center" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <PeopleOutlineIcon
                  sx={{
                    color: "black",
                    background: "#ffffcc",
                    p: 1,
                    fontSize: "40px",
                    borderRadius: "10px",
                    marginBottom: "12%",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontSize: "16px", color: "black" }}
                >
                  All Service Orders
                  <br />
                  <Typography
                    paragraph
                    style={{ fontWeight: "500", color: "black" }}
                  >
                    {orders && orders.length}
                    <span
                      style={{
                        fontSize: "12px",
                        color: "green",
                        marginLeft: "4px",
                      }}
                    >
                      {/* Calculate the percentage based on the total count of users */}
                      {orders &&
                        orders.length > 0 &&
                        `+${deliveredPercentage}%`}
                    </span>
                  </Typography>
                </Typography>
              </Box>
            </div>

            {/* Container for Delivered Orders */}
            <div
              style={{
                flex: "1",
                marginRight: "1rem",
                alignContent: "center",
                alignContent: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontSize: "14px", color: "grey" }}>
                Delivered Service Orders
                <br />
                <Typography
                  paragraph
                  style={{ fontWeight: "500", color: "black" }}
                >
                  {orders &&
                    orders.filter((product) => product.status === "Delivered")
                      .length}
                </Typography>
              </Typography>
            </div>

            {/* Container for Shipped Orders */}
            <div
              style={{ flex: "1", marginRight: "1rem", alignContent: "center" }}
            >
              <Typography variant="h6" sx={{ fontSize: "14px", color: "grey" }}>
                Shipped Service Orders
                <br />
                <Typography
                  paragraph
                  style={{ fontWeight: "500", color: "black" }}
                >
                  {orders &&
                    orders.filter((product) => product.status === "Shipped")
                      .length}
                </Typography>
              </Typography>
            </div>

            {/* Container for Processing Orders */}
            <div
              style={{ flex: "1", marginRight: "1rem", alignContent: "center" }}
            >
              <Typography variant="h6" sx={{ fontSize: "14px", color: "grey" }}>
                Processing Service Orders
                <br />
                <Typography
                  paragraph
                  style={{ fontWeight: "500", color: "black" }}
                >
                  {orders &&
                    orders.filter((product) => product.status === "Processing")
                      .length}
                </Typography>
              </Typography>
            </div>

            {/* Container for Returned Orders */}
            <div
              style={{ flex: "1", marginRight: "1rem", alignContent: "center" }}
            >
              <Typography variant="h6" sx={{ fontSize: "14px", color: "grey" }}>
                Returned Service Orders
                <br />
                <Typography
                  paragraph
                  style={{ fontWeight: "500", color: "black" }}
                >
                  {orders &&
                    orders.filter((product) => product.status === "Returned")
                      .length}
                </Typography>
              </Typography>
            </div>

            {/* Container for Cancelled Orders */}
            <div style={{ flex: "1", alignContent: "center" }}>
              <Typography variant="h6" sx={{ fontSize: "14px", color: "grey" }}>
                Cancelled Service Orders
                <br />
                <Typography
                  paragraph
                  style={{ fontWeight: "500", color: "black" }}
                >
                  {orders &&
                    orders.filter((product) => product.status === "Cancelled")
                      .length}
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
              width: "50%",
              justifyContent: "space-between",
              padding:"2%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: "1rem",
                marginBottom: "2rem",
              }}
            >
              <TextField
                label="Search Order ID"
                variant="outlined"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                sx={{ marginRight: "1rem" }}
              />
              <Button
                onClick={handleSearch}
                sx={{ background: "orange" }}
                variant="contained"
              >
                <SearchIcon />
              </Button>
            </Box>

            {searchResult ? (
              <Card
                sx={{
                  width: "70%",
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
                    Username:
                    <Typography
                      component="span"
                      style={{
                        fontWeight: "500",
                        color: "black",
                        marginLeft: "0.5rem",
                      }}
                    >
                      {searchResult.user.name}
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
                    Total:
                    <Typography
                      component="span"
                      style={{
                        fontWeight: "500",
                        color: "black",
                        marginLeft: "0.5rem",
                      }}
                    >
                      ₹{searchResult.total}
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
                    Order Status:
                    <Typography
                      component="span"
                      style={{
                        fontWeight: "500",
                        color: "black",
                        marginLeft: "0.5rem",
                      }}
                    >
                      {searchResult.status}
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
                    Order Date:
                    <Typography
                      component="span"
                      style={{
                        fontWeight: "500",
                        color: "black",
                        marginLeft: "0.5rem",
                      }}
                    >
                      {new Date(searchResult.createdAt).toLocaleString()}
                    </Typography>
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              ""
            )}
          </div> */}
        </div>

        <ServiceOrderManagementTable />

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogContent>
            <TextField
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="city"
              label="City"
              value={formData.city}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="state"
              label="State"
              value={formData.state}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="country"
              label="Country"
              value={formData.country}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="pinCode"
              label="Pin Code"
              value={formData.pinCode}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Select Product"
              name="product"
              value={formData.product}
              onChange={handleProductChange}
              fullWidth
              margin="normal"
            >
              {products.map((product) => (
                <MenuItem key={product._id} value={product._id}>
                  {product.name}
                </MenuItem>
              ))}
            </TextField>
            {selectedProduct && (
              <Box>
                <Typography variant="h6">
                  Selected Product Information
                </Typography>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Image</TableCell>
                      <TableCell>
                        <img
                          style={{
                            width: "350px",
                            height: "200px",
                            objectFit: "contain",
                          }}
                          src={selectedProduct.productImages[0]}
                          alt="Product"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>{selectedProduct.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Price</TableCell>
                      <TableCell>₹{selectedProduct.price}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>MRP</TableCell>
                      <TableCell>₹{selectedProduct.mrp}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Verified</TableCell>
                      <TableCell
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        {selectedProduct.isVerified === "true" ? (
                          <>
                            <p style={{ marginRight: "5px", color: "green" }}>
                              YES
                            </p>
                            <CheckCircleIcon style={{ color: "green" }} />
                          </>
                        ) : (
                          <>
                            <p style={{ marginRight: "5px", color: "red" }}>
                              NO
                            </p>
                            <CancelIcon style={{ color: "red" }} />
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            )}

            <TextField
              name="quantity"
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="shippingCharges"
              label="Shipping Charges"
              type="number"
              value={formData.shippingCharges}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="discount"
              label="Discount"
              type="number"
              value={formData.discount}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <Typography>Subtotal: ₹{formData.subtotal}</Typography>
            <Typography>Total: ₹{formData.total}</Typography>
            <TextField
              select
              label="Select Admin"
              name="user"
              value={selectedAdmin}
              onChange={handleAdminChange}
              fullWidth
              margin="normal"
            >
              {admins
                .filter((admin) => admin.role === "admin")
                .map((admin) => (
                  <MenuItem key={admin._id} value={admin._id}>
                    {admin.name}
                  </MenuItem>
                ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openOrderSummary} onClose={handleCloseOrderSummary}>
          <DialogTitle>Order Summary</DialogTitle>
          <DialogContent>
            <TextField
              select
              label="Select Order Status"
              value={selectedOrderStatus}
              onChange={handleOrderStatusChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="returned">Returned</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={downloadOrderSummary}
              variant="contained"
              color="primary"
            >
              Download
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <ToastContainer />
    </Box>
  );
}
