import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";

import PaymentIcon from "@mui/icons-material/Payment";
import PrintIcon from "@mui/icons-material/Print";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import FilterListIcon from "@mui/icons-material/FilterList";
import UpdateIcon from "@mui/icons-material/Update";
import CancelIcon from "@mui/icons-material/Cancel";
import { visuallyHidden } from "@mui/utils";
import DateRangeIcon from "@mui/icons-material/DateRange";
import Divider from "@mui/material/Divider";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ClearIcon from "@mui/icons-material/Clear"; // Added Clear icon

import axios from "axios";
import Cookies from "js-cookie";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import VisibilityIcon from "@mui/icons-material/Visibility";

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a, b, orderBy) {
  if (orderBy === "user") {
    return b.user.name.localeCompare(a.user.name);
  }

  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2",
    },
  ],
});
const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  section: {
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 10,
    marginBottom: 3,
    maxWidth: "100%",
    wordWrap: "break-word",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoColumn: {
    width: "48%",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableHeader: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    padding: 5,
    fontWeight: "bold",
    fontSize: 10,
    maxWidth: "100%",
    wordWrap: "break-word",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tableBody: {
    width: "100%",
    fontWeight: "bold",
    fontSize: 10,
    maxWidth: "100%",
    wordWrap: "break-word",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tableCell: {
    padding: 10,
    fontSize: 10,
    maxWidth: "25%",
    wordWrap: "break-word",
    width: "15%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

const InvoiceDocument = ({ selectedOrderDetails }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.title}>
        <Text>Invoice: #{selectedOrderDetails._id}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Order Information</Text>
        <Text style={styles.infoText}>Order #: {selectedOrderDetails._id}</Text>
        <Text style={styles.infoText}>
          Date: {new Date(selectedOrderDetails.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {/* Customer Information and Shipping Information */}
      <View style={styles.infoContainer}>
        <View style={styles.infoColumn}>
          <Text style={styles.subtitle}>Owner Information</Text>
          <Text style={styles.infoText}>
{/*             Name: {selectedOrderDetails.user?.name} */}
Name : S2 For You
          </Text>
          <Text style={styles.infoText}>
{/*             Email: {selectedOrderDetails.user?.email} */}
Email : s2foryou@gmail.com
          </Text>
          <Text style={styles.infoText}>
            Issued On:{" "}
            {new Date(selectedOrderDetails.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.infoText}>
{/*             Address: {selectedOrderDetails.user?.myAddress?.address} */}
Adress : Dummy address area
          </Text>
        </View>
        <View style={styles.infoColumn}>
          <Text style={styles.subtitle}>Shipping Information</Text>
          <Text style={styles.infoText}>
            Contact Number:{" "}
            {selectedOrderDetails.user?.mobileNo || "Not Given"}
          </Text>
          {/* <Text style={styles.infoText}>
            Email: {selectedOrderDetails.shippingInfo?.email}
          </Text> */}
          <Text style={styles.infoText}>
            Issued On:{" "}
            {new Date(selectedOrderDetails.createdAt).toLocaleDateString()}
          </Text>
          {/* <Text style={styles.infoText}>
            Address: {selectedOrderDetails.shippingInfo?.address}
          </Text> */}
          {/* <Text style={styles.infoText}>Address:</Text> */}
        <Text style={styles.infoText}>
        Address:{" "}
          {selectedOrderDetails.shippingInfo.address}, {selectedOrderDetails.shippingInfo.city}, {selectedOrderDetails.shippingInfo.state},{" "}
          {selectedOrderDetails.shippingInfo.country}, {selectedOrderDetails.shippingInfo.pinCode}
        </Text>
        </View>
      </View>

      {/* Products Table */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Products</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Product ID</Text>
            <Text style={styles.tableCell}>Product Name</Text>
            <Text style={styles.tableCell}>Quantity</Text>
            <Text style={styles.tableCell}>Total</Text>
          </View>
          <View style={[styles.tableRow, styles.tableBody]}>
            <Text style={styles.tableCell}>
              {selectedOrderDetails.product?._id}
            </Text>
            <Text style={styles.tableCell}>
              {selectedOrderDetails.product?.name}
            </Text>
            <Text style={styles.tableCell}>
              {selectedOrderDetails.quantity}
            </Text>
            <Text style={styles.tableCell}> {selectedOrderDetails.total}</Text>
          </View>
        </View>
      </View>

      {/* Amounts Table */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Amounts</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Base Price</Text>
            {selectedOrderDetails.cgst === 0 &&
            selectedOrderDetails.sgst === 0 ? (
              <Text style={styles.tableCell}>IGST</Text>
            ) : (
              <>
                <Text style={styles.tableCell}>CGST</Text>
                <Text style={styles.tableCell}>SGST</Text>
              </>
            )}
            <Text style={styles.tableCell}>Total Amount</Text>
          </View>
          <View style={[styles.tableRow, styles.tableBody]}>
            <Text style={styles.tableCell}>
              {(selectedOrderDetails.basePrice.toFixed(2))}
            </Text>
            {selectedOrderDetails.cgst === 0 && selectedOrderDetails.sgst === 0 ? (
  <Text style={styles.tableCell}> {selectedOrderDetails.igst.toFixed(2)}</Text>
) : (
  <>
    <Text style={styles.tableCell}>
      {selectedOrderDetails.cgst.toFixed(2)} {/* Format CGST */}
    </Text>
    <Text style={styles.tableCell}>
      {selectedOrderDetails.sgst.toFixed(2)} {/* Format SGST */}
    </Text>
  </>
)}

            <Text style={styles.tableCell}>
              {Math.round(selectedOrderDetails.total)}
            </Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "orderid", numeric: true, disablePadding: false, label: "OrderId" },
  { id: "user", numeric: false, disablePadding: false, label: "Customer Name" },
  {
    id: "createdAt",
    numeric: false,
    disablePadding: false,
    label: "Order Date",
  },
  { id: "subtotal", numeric: true, disablePadding: false, label: "Subtotal" },
  { id: "discount", numeric: true, disablePadding: false, label: "Discount" },
  {
    id: "shippingCharges",
    numeric: true,
    disablePadding: false,
    label: "Shipping",
  },
  { id: "total", numeric: true, disablePadding: false, label: "Order Total" },
  { id: "status", numeric: false, disablePadding: false, label: "Status" }, // Added status column
  { id: "actions", numeric: false, disablePadding: false, label: "Actions" }, // Added actions column
];
const statusOptions = [
  "None",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function EnhancedTable() {
  const [dialogueContentLoading, setDialogueContentLoading] =
    React.useState(false);
  const [productDetails, setProductDetails] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  const [orders, setOrders] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const [openPopup, setOpenPopup] = React.useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(null); // State to store selected date
  const [selectedStatusFilter, setSelectedStatusFilter] =
    React.useState("None");
  const [userDetails, setUserDetails] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [openDateRangePicker, setOpenDateRangePicker] = useState(false);

  const [openIPopup, setOpenIPopup] = useState(false);
  if (selectedOrderDetails) console.log(selectedOrderDetails, "jkjkjk");

  const handleInvoice = () => {
    setOpenIPopup(true);
  };

  const handleClosePopup = () => {
    setOpenIPopup(false);
  };
  const clearDateRangeFilter = () => {
    setFromDate(""); // Clear from date
    setToDate(""); // Clear to date
  };
  const handleStatusFilterChange = (event) => {
    setSelectedStatusFilter(event.target.value);
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenPopup = async (id) => {
    try {
      setDialogueContentLoading(true);
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/order/orderByorderId/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setSelectedOrderDetails(response.data.data);
        // Directly set the popup to open without fetching user and product details
        setOpenPopup(true);
      } else {
        setSelectedOrderDetails(null);
        toast.error("Failed to fetch order details");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setSelectedOrderDetails(null);
      toast.error("Failed to fetch order details");
    } finally {
      setDialogueContentLoading(false); // Set loading state to false in any case
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/orders/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        const sortedOrders = response.data.orders.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setOrders(sortedOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    if (property === "user") {
      // Use custom sorting function for name
      const sortedOrders = stableSort(orders, getComparator(order, "name"));
      setOrders(sortedOrders);
      return;
    }
    if (property === "mobileNo") {
      const sortedOrders = stableSort(orders, (a, b) =>
        order === "asc" ? a.mobileNo - b.mobileNo : b.mobileNo - a.mobileNo
      );
      setOrders(sortedOrders);
      return;
    }

    // For sorting by other columns
    const sortedOrders = stableSort(orders, getComparator(order, property));
    setOrders(sortedOrders);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "DeepSkyBlue";
      case "Shipped":
        return "Goldenrod";
      case "Delivered":
        return "ForestGreen";
      default:
        return "inherit";
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;

  const handleSearchInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const clearDateFilter = () => {
    setSelectedDate(null);
  };

  // Filtering logic with date range
  // Filtering logic with date range
  // const filteredOrders = orders.filter((order) => {
  //   const nameMatch = order.user?.name
  //     .toLowerCase()
  //     .includes(searchText.toLowerCase());
  //   const orderDateMatch = order.createdAt
  //     ? formatDate(order.createdAt).includes(searchText)
  //     : false;
  //   const subtotalMatch = order.subtotal
  //     ? order.subtotal.toString().includes(searchText)
  //     : false;
  //   const discountMatch = order.discount
  //     ? order.discount.toString().includes(searchText)
  //     : false;
  //   const shippingMatch = order.shippingCharges
  //     ? order.shippingCharges.toString().includes(searchText)
  //     : false;
  //   const totalMatch = order.total
  //     ? order.total.toString().includes(searchText)
  //     : false;
  //   const statusMatch = order.status
  //     ? order.status.toLowerCase().includes(searchText.toLowerCase())
  //     : false;
  //   const orderIdMatch = order._id
  //     ? order._id.toLowerCase().includes(searchText.toLowerCase())
  //     : false;

  //   const isMatch =
  //     nameMatch ||
  //     orderDateMatch ||
  //     subtotalMatch ||
  //     discountMatch ||
  //     shippingMatch ||
  //     totalMatch ||
  //     statusMatch ||
  //     orderIdMatch;

  //   // Filter based on selected status
  //   const statusFilterMatch =
  //     selectedStatusFilter === "None" || order.status === selectedStatusFilter;

  //   // Filter based on date range
  //   const orderDate = new Date(order.createdAt);
  //   const isAfterFromDate =
  //     !fromDate ||
  //     new Date(
  //       orderDate.getFullYear(),
  //       orderDate.getMonth(),
  //       orderDate.getDate()
  //     ) >= new Date(fromDate);
  //   const isBeforeOrEqualToToDate =
  //     !toDate ||
  //     new Date(
  //       orderDate.getFullYear(),
  //       orderDate.getMonth(),
  //       orderDate.getDate()
  //     ) <= new Date(toDate); // Adjusted here

  //   // If no date is selected or if searchText is not empty, include all orders
  //   if (
  //     !fromDate &&
  //     !toDate &&
  //     (searchText.trim() === "" || selectedStatusFilter === "None")
  //   ) {
  //     return isMatch;
  //   }

  //   // If a date range is selected, filter orders within the range
  //   return (
  //     isMatch && statusFilterMatch && isAfterFromDate && isBeforeOrEqualToToDate
  //   );
  // });

  const filteredOrders = orders.filter((order) => {
    // Search conditions
    const nameMatch = order.user?.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const orderDateMatch = order.createdAt
      ? formatDate(order.createdAt).includes(searchText)
      : false;
    const subtotalMatch = order.subtotal
      ? order.subtotal.toString().includes(searchText)
      : false;
    const discountMatch = order.discount
      ? order.discount.toString().includes(searchText)
      : false;
    const shippingMatch = order.shippingCharges
      ? order.shippingCharges.toString().includes(searchText)
      : false;
    const totalMatch = order.total
      ? order.total.toString().includes(searchText)
      : false;
    const statusMatch = order.status
      ? order.status.toLowerCase().includes(searchText.toLowerCase())
      : false;
    const orderIdMatch = order._id
      ? order._id.toLowerCase().includes(searchText.toLowerCase())
      : false;

    // Combine search text filters
    const isMatch =
      nameMatch ||
      orderDateMatch ||
      subtotalMatch ||
      discountMatch ||
      shippingMatch ||
      totalMatch ||
      statusMatch ||
      orderIdMatch;

    // Status filter - For any status except "Cancelled", isCancelled should be false
    const statusFilterMatch =
      selectedStatusFilter === "None" ||
      (selectedStatusFilter === "Cancelled" && order.isCancelled) ||
      (selectedStatusFilter !== "Cancelled" &&
        order.status === selectedStatusFilter &&
        order.isCancelled === false);

    // Date range filter
    const orderDate = new Date(order.createdAt);
    const isAfterFromDate =
      !fromDate ||
      new Date(
        orderDate.getFullYear(),
        orderDate.getMonth(),
        orderDate.getDate()
      ) >= new Date(fromDate);
    const isBeforeOrEqualToToDate =
      !toDate ||
      new Date(
        orderDate.getFullYear(),
        orderDate.getMonth(),
        orderDate.getDate()
      ) <= new Date(toDate);

    // Final condition combining all filters
    return (
      isMatch && statusFilterMatch && isAfterFromDate && isBeforeOrEqualToToDate
    );
  });

  if (filteredOrders) console.log(filteredOrders, "dklfjdlksjlk");

  const handleCopyOrderID = (orderId) => {
    const textarea = document.createElement("textarea");
    textarea.value = orderId;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    toast.info("Order ID copied to clipboard");
  };

  const clearAllFilters = () => {
    setSearchText(""); // Clear the search text
    setSelectedStatusFilter("None"); // Reset the status filter to "None"
    setFromDate(null); // Reset the from date filter
    setToDate(null); // Reset the to date filter
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(selected.length > 0 && {
              bgcolor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.activatedOpacity
                ),
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }),
          }}
        >
          {selected.length > 0 ? (
            <Typography
              sx={{ flex: "1 1 100%" }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {selected.length} selected
            </Typography>
          ) : (
            <>
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Orders
              </Typography>
              <IconButton onClick={() => setOpenDateRangePicker(true)}>
                <DateRangeIcon /> {/* Date range icon */}
                <span style={{ fontSize: "0.8rem" }}>Date Range</span>
              </IconButton>
              <FormControl sx={{ ml: 2, minWidth: 120 }}>
                <InputLabel id="status-filter-label">Status Filter</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter-select"
                  value={selectedStatusFilter}
                  label="Status Filter"
                  onChange={handleStatusFilterChange}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: 400,
                  ml: 2,
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search Orders"
                  inputProps={{ "aria-label": "search orders" }}
                  value={searchText}
                  onChange={handleSearchInputChange}
                />
                <IconButton
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </Paper>
              {/* <Box sx={{ ml: 2 }}>
                <InputBase
                  type="date"
                  onChange={handleDateChange}
                  sx={{ width: 180 }}
                  inputProps={{ "aria-label": "select date" }}
                />
              </Box> */}
            </>
          )}

          <Tooltip title="Clear filter">
            <IconButton
              onClick={clearAllFilters}
              sx={{ p: "10px" }}
              aria-label="clear filter"
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>

          {/* {selected.length > 0 ? (
            <Tooltip title="Delete">
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Clear filter">
              <IconButton
                onClick={clearDateFilter}
                sx={{ p: "10px" }}
                aria-label="clear filter"
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          )} */}
        </Toolbar>

        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? "center" : "left"}
                    padding={headCell.disablePadding ? "none" : "normal"}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      {headCell.label}
                      {orderBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading || dialogueContentLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order, index) => {
                    const isItemSelected = isSelected(order.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={order.id}
                        selected={isItemSelected}
                      >
                        <TableCell
                          align="left"
                          // sx={{ display: "flex", alignItems: "center" }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "0.7rem" }}
                            >
                              {order._id}
                            </Typography>
                            <Tooltip title="Copy ID" arrow>
                              <IconButton
                                onClick={() => handleCopyOrderID(order._id)}
                                size="small"
                                sx={{ fontSize: "0.7rem" }} // Adjust the font size as needed
                              >
                                <FileCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </TableCell>

                        <TableCell component="th" id={labelId} scope="row">
                          {order.user?.name}
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell align="right">{order.subtotal}</TableCell>
                        <TableCell align="right">{order.discount}</TableCell>
                        <TableCell align="right">
                          {order.shippingCharges}
                        </TableCell>
                        <TableCell align="right">{order.total}</TableCell>
                        {/* <TableCell
                          style={{ color: getStatusColor(order.status) }}
                        >
                          {order.status}
                        </TableCell> */}
                        {order.isCancelled === true ? (
                          <TableCell style={{ color: "red" }}>
                            Cancelled
                          </TableCell>
                        ) : (
                          <TableCell
                            style={{ color: getStatusColor(order.status) }}
                          >
                            {order.status}
                          </TableCell>
                        )}
                        <TableCell>
                          <IconButton
                            aria-label="view details"
                            onClick={() => handleOpenPopup(order._id)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {dialogueContentLoading ? (
        <> </>
      ) : (
        <>
          <Dialog
            open={openPopup}
            onClose={() => setOpenPopup(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
              "& .MuiDialog-paper": {
                width: "80%", // Custom width here
                maxWidth: "none",
              },
            }}
          >
            <DialogTitle id="alert-dialog-title">
              <b>Order Details</b>
            </DialogTitle>

            <DialogContent>
              {selectedOrderDetails ? (
                <Box>
                  <Box
                    sx={{
                      padding: "20px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      backgroundColor: "#fafafa",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body1">
                      <strong>Order ID: </strong> {selectedOrderDetails._id}
                      <IconButton
                        onClick={handleCopyOrderID}
                        aria-label="Copy"
                        size="small"
                        style={{ fontSize: "0.7rem" }}
                      >
                        <FileCopyIcon />
                      </IconButton>
                    </Typography>
                    <Typography variant="body1">
                      <strong>Order Date:</strong>{" "}
                      {formatDate(selectedOrderDetails.createdAt)}
                    </Typography>
                    {selectedOrderDetails?.isCancelled === true ? (
                      <Typography variant="body1">
                        <strong>Status:</strong> <span>Cancelled</span>
                      </Typography>
                    ) : (
                      <Typography variant="body1">
                        <strong>Status:</strong>{" "}
                        <span
                          style={{
                            backgroundColor: getStatusColor(
                              selectedOrderDetails.status
                            ),
                            padding: "2px 8px",
                            borderRadius: "4px",
                            color: "#fff",
                          }}
                        >
                          {selectedOrderDetails.status}
                        </span>
                      </Typography>
                    )}

                    <IconButton
                      aria-label="view details"
                      onClick={() => handleInvoice()}
                    >
                      <PrintIcon />
                    </IconButton>
                  </Box>

                  {selectedOrderDetails?.isCancelled === true && (
                    <Box
                      sx={{
                        padding: "10px",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        backgroundColor: "#fafafa",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "25px",
                      }}
                    >
                      <Typography variant="body1" color="red">
                        <strong style={{ color: "black" }}>
                          Cancelled Reason:{" "}
                        </strong>{" "}
                        {selectedOrderDetails.customCancelReason}
                      </Typography>
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* First Box */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "whitesmoke",
                        padding: "10px",
                        margin: "2%",
                        width: "50%",
                        borderRadius: "15px",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                          size="medium"
                          style={{
                            color: "white",
                            backgroundColor: "orange",
                            borderRadius: "10px",
                          }}
                        >
                          <AccountCircleIcon />
                        </IconButton>
                        <Typography variant="body1" sx={{ marginLeft: "3%" }}>
                          <b>{selectedOrderDetails?.user?.name}</b>
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          backgroundColor: "whitesmoke",
                          marginTop: "5%",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box sx={{ marginRight: "5%" }}>
                            <Typography
                              variant="body1"
                              sx={{ marginBottom: "4px" }}
                            >
                              Email
                            </Typography>
                            <Typography variant="body1">
                              <strong>
                                {selectedOrderDetails.user.email
                                  ? selectedOrderDetails.user.email
                                  : "N/A"}
                              </strong>
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{ marginBottom: "4px" }}
                            >
                              Mobile Number
                            </Typography>
                            <Typography variant="body1">
                              <strong>
                                {selectedOrderDetails.user.mobileNo
                                  ? selectedOrderDetails.user.mobileNo
                                  : "N/A"}
                              </strong>
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* Second Box */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "whitesmoke",
                        padding: "10px",
                        width: "50%",
                        margin: "2%",
                        borderRadius: "15px",
                      }}
                    >
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "10px",
                          }}
                        >
                          {/* Location or address logo/button */}
                          <IconButton
                            size="medium"
                            style={{
                              color: "white",
                              backgroundColor: "orange",
                              borderRadius: "10px",
                            }}
                          >
                            <LocationOnIcon />
                          </IconButton>
                          <Box sx={{ marginLeft: "10px" }}>
                            <Typography
                              variant="body1"
                              sx={{ marginBottom: "4px" }}
                            >
                              <strong>
                                {selectedOrderDetails.shippingInfo.address}
                              </strong>
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            marginTop: "5%",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box sx={{ marginRight: "20px" }}>
                            <Typography
                              variant="body1"
                              sx={{ marginBottom: "4px" }}
                            >
                              <>City:</>
                            </Typography>
                            <Typography variant="body1">
                              <strong>
                                {selectedOrderDetails.shippingInfo.city}
                              </strong>
                            </Typography>
                          </Box>
                          <Box sx={{ marginRight: "20px" }}>
                            <Typography
                              variant="body1"
                              sx={{ marginBottom: "4px" }}
                            >
                              State
                            </Typography>
                            <Typography variant="body1">
                              <strong>
                                {selectedOrderDetails.shippingInfo.state}
                              </strong>
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{ marginBottom: "4px" }}
                            >
                              Pin Code
                            </Typography>
                            <Typography variant="body1">
                              <strong>
                                {selectedOrderDetails.shippingInfo.pinCode}
                              </strong>
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* First Box */}
                    {selectedOrderDetails.trackingDetails && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          backgroundColor: "whitesmoke",
                          padding: "10px",
                          margin: "2%",
                          width: "50%",
                          borderRadius: "15px",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <IconButton
                            size="medium"
                            style={{
                              color: "white",
                              backgroundColor: "orange",
                              borderRadius: "10px",
                            }}
                          >
                            <TrackChangesIcon />
                          </IconButton>
                          <Typography variant="body1" sx={{ marginLeft: "3%" }}>
                            <b>
                              {" "}
                              {
                                selectedOrderDetails.trackingDetails
                                  .shippingPartner
                              }
                            </b>
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: "whitesmoke",
                            marginTop: "5%",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box sx={{ marginRight: "5%" }}>
                              <Typography
                                variant="body1"
                                sx={{ marginBottom: "4px" }}
                              >
                                TrackingId
                              </Typography>
                              <Typography variant="body1">
                                <strong>
                                  {selectedOrderDetails &&
                                  selectedOrderDetails.trackingDetails
                                    ? selectedOrderDetails.trackingDetails
                                        .trackingId
                                    : "N/A"}
                                </strong>
                              </Typography>
                            </Box>

                            <Box>
                              <Typography
                                variant="body1"
                                sx={{ marginBottom: "4px" }}
                              >
                                Tracking Link
                              </Typography>
                              <Typography variant="body1">
                                <strong>
                                  {selectedOrderDetails &&
                                  selectedOrderDetails.trackingDetails
                                    ? selectedOrderDetails.trackingDetails
                                        .trackingLink
                                    : "N/A"}
                                </strong>
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    )}

                    {/* Second Box */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "whitesmoke",
                        padding: "10px",
                        width: "50%",
                        margin: "2%",
                        borderRadius: "15px",
                      }}
                    >
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "10px",
                          }}
                        >
                          {/* Location or address logo/button */}
                          <IconButton
                            size="medium"
                            style={{
                              color: "white",
                              backgroundColor: "orange",
                              borderRadius: "10px",
                            }}
                          >
                            <PaymentIcon />
                          </IconButton>
                          <Box sx={{ marginLeft: "10px" }}>
                            <Typography
                              variant="body1"
                              sx={{ marginBottom: "4px" }}
                            >
                              <strong>Cash On Delivery</strong>
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            marginTop: "5%",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box sx={{ marginRight: "20px" }}>
                            <Typography
                              variant="body1"
                              sx={{ marginBottom: "4px" }}
                            >
                              <>Payment Id</>
                            </Typography>
                            <Typography variant="body1">
                              <strong>#334229119227</strong>
                            </Typography>
                          </Box>

                          {/* <Box>
                            <Typography
                              variant="body1"
                              sx={{ marginBottom: "4px" }}
                            >
                              Payment State
                            </Typography>
                            <Typography variant="body1">
                              <strong>Paid</strong>
                            </Typography>
                          </Box> */}
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{ marginBottom: "4px" }}
                            >
                              Return
                            </Typography>
                            <Typography variant="body1">
                              <strong>No</strong>
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "whitesmoke",
                        padding: "10px",
                        margin: "2%",
                        width: "50%",
                        borderRadius: "15px",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                          size="medium"
                          style={{
                            color: "white",
                            backgroundColor: "orange",
                            borderRadius: "10px",
                          }}
                        >
                          <AccountCircleIcon />
                        </IconButton>
                        <Typography variant="body1" sx={{ marginLeft: "3%" }}>
                          Vendor :
                          <b>{selectedOrderDetails?.product?.vendorId?.name}</b>
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          backgroundColor: "whitesmoke",
                          marginTop: "5%",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box sx={{ marginRight: "5%" }}>
                            <Typography
                              variant="body1"
                              sx={{ marginBottom: "4px" }}
                            >
                              Email
                            </Typography>
                            <Typography variant="body1">
                              <strong>
                                {selectedOrderDetails?.product?.vendorId?.email
                                  ? selectedOrderDetails.product.vendorId.email
                                  : "N/A"}
                              </strong>
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{ marginBottom: "4px" }}
                            >
                              Mobile Number
                            </Typography>
                            <Typography variant="body1">
                              <strong>
                                {selectedOrderDetails?.product?.vendorId
                                  ?.mobileNo
                                  ? selectedOrderDetails.product.vendorId
                                      .mobileNo
                                  : "N/A"}
                              </strong>
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Product Name</TableCell>
                          {selectedOrderDetails.color && (
                            <TableCell>Color</TableCell>
                          )}
                          {selectedOrderDetails.size && (
                            <TableCell>SIze</TableCell>
                          )}
                          <TableCell>Price</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Subtotal</TableCell>

                          <TableCell>Discount</TableCell>
                          <TableCell>Shipping Charges</TableCell>
                          <TableCell>Total Fare</TableCell>
                          {/* <TableCell>Final Price</TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            {selectedOrderDetails.product &&
                            selectedOrderDetails.product.name
                              ? selectedOrderDetails.product.name
                              : "N/A"}
                          </TableCell>
                          {selectedOrderDetails.color && (
                            <TableCell>{selectedOrderDetails.color}</TableCell>
                          )}
                          {selectedOrderDetails.size && (
                            <TableCell>{selectedOrderDetails.size}</TableCell>
                          )}
                          <TableCell>
                            {selectedOrderDetails.subtotal &&
                            selectedOrderDetails.quantity
                              ? `₹${(
                                  selectedOrderDetails.subtotal /
                                  selectedOrderDetails.quantity
                                ).toFixed(2)}`
                              : "N/A"}
                          </TableCell>

                          <TableCell>{selectedOrderDetails.quantity}</TableCell>
                          <TableCell>
                            ₹{selectedOrderDetails.subtotal}
                          </TableCell>

                          <TableCell>
                            ₹{selectedOrderDetails.discount}
                          </TableCell>
                          <TableCell>
                            ₹{selectedOrderDetails.shippingCharges}
                          </TableCell>
                          <TableCell>
                            ₹
                            {selectedOrderDetails &&
                            selectedOrderDetails.subtotal &&
                            selectedOrderDetails.discount != null &&
                            selectedOrderDetails.shippingCharges != null
                              ? (
                                  selectedOrderDetails.subtotal -
                                  selectedOrderDetails.discount +
                                  selectedOrderDetails.shippingCharges
                                ).toFixed(2)
                              : "N/A"}
                          </TableCell>
                          {/* <TableCell>
                            ₹
                            {selectedOrderDetails && selectedOrderDetails.total
                              ? selectedOrderDetails.total
                              : "N/A"}
                          </TableCell> */}
                        </TableRow>
                      </TableBody>
                    </Table>
                    {/* <Typography variant="body1" sx={{ mt: 2 }}>
                    <strong>Total:</strong> ₹{selectedOrderDetails.total}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Shipping Charges:</strong> ₹
                    {selectedOrderDetails.shippingCharges}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Discount:</strong> ₹{selectedOrderDetails.discount}
                  </Typography> */}
                  </TableContainer>
                </Box>
              ) : (
                <Typography>Loading...</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenPopup(false)}>Close</Button>
            </DialogActions>
          </Dialog>
          {selectedOrderDetails && (
            <Dialog
              open={openIPopup}
              onClose={handleClosePopup}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="h6" sx={{ flex: "1 1 100%" }}>
                    Invoice: #{selectedOrderDetails._id}
                  </Typography>
                  <IconButton aria-label="print invoice">
                    <PrintIcon />
                  </IconButton>
                </Box>
                <Typography variant="subtitle1">
                  Order #: {selectedOrderDetails._id}
                </Typography>
                <Typography variant="subtitle1">
                  Date:{" "}
                  {new Date(
                    selectedOrderDetails.createdAt
                  ).toLocaleDateString()}
                </Typography>
              </DialogTitle>
              <DialogContent>
                <PDFViewer width="100%" height="500px">
                  <InvoiceDocument
                    selectedOrderDetails={selectedOrderDetails}
                  />
                </PDFViewer>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenIPopup(false)}>Close</Button>
              </DialogActions>
            </Dialog>
          )}
        </>
      )}
      <Dialog
        open={openDateRangePicker}
        onClose={() => setOpenDateRangePicker(false)}
      >
        <DialogTitle>Select Date Range</DialogTitle>
        <DialogContent>
          {/* Date pickers for selecting from and to dates */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              id="from-date"
              label="From Date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginTop: "2%" }}
            />
            <TextField
              id="to-date"
              label="To Date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
          >
            <Button
              variant="outlined"
              onClick={() => setOpenDateRangePicker(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={clearDateRangeFilter}
              sx={{ marginLeft: 2, background: "orange" }}
            >
              Clear Date Range
            </Button>
            <Button
              variant="contained"
              onClick={() => setOpenDateRangePicker(false)}
              sx={{ marginLeft: 2, background: "orange" }}
            >
              Apply
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      ;
    </Box>
  );
}
