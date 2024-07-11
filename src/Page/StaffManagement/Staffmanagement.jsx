import React, { useState, useEffect } from "react";
import axios from "axios";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import VisibilityIcon from "@mui/icons-material/Visibility";

import Cookies from "js-cookie";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import TableSortLabel from "@mui/material/TableSortLabel";
import PaymentIcon from "@mui/icons-material/Payment";
import DoneIcon from "@mui/icons-material/Done";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SideBar from "../../Component/SideBar";
import WithdrawalPopup from "./withdrawalPopup";

const StaffManagement = () => {
  const [filteredReferralCoins, setFilteredReferralCoins] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState("");
  const [refId, setRefId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [openAddStaffDialog, setOpenAddStaffDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [orderBy, setOrderBy] = useState(null);
  const [order, setOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [addStaffData, setAddStaffData] = useState({
    name: "",
    lastName: "",
    email: "",
    mobileNo: "",
    isStaff: true,
  });

  const [editStaffData, setEditStaffData] = useState({
    name: "",
    lastName: "",
    email: "",
    mobileNo: "",
  });
  const [newStaffData, setNewStaffData] = useState({
    name: "",
    lastName: "",
    email: "",
    mobileNo: "",
  });
  const [withdrawalPopupOpen, setWithdrawalPopupOpen] = useState(false);

  if (staffList) console.log(staffList, "fhdsjhfkjs")

  const totalRewardMoney = staffList.reduce((sum, staff) => {
    return sum + (staff.rewardMoney || 0);
  }, 0);


  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleClearDateFilter = () => {
    setStartDate("");
    setEndDate("");
    if (selectedStaff) {
      setFilteredReferralCoins(selectedStaff.referralCoins);
    }
  };
  useEffect(() => {
    if (selectedStaff) {
      if (startDate && endDate) {
        const filteredCoins = filterCoinsByDateRange(
          selectedStaff.referralCoins,
          startDate,
          endDate
        );
        setFilteredReferralCoins(filteredCoins);
      } else {
        setFilteredReferralCoins(selectedStaff.referralCoins);
      }
    }
  }, [startDate, endDate, selectedStaff]);

  const filterCoinsByDateRange = (coins = [], start, end) => {
    const startTime = new Date(start).setHours(0, 0, 0, 0);
    const endTime = new Date(end).setHours(23, 59, 59, 999);
    return coins.filter((coin) => {
      const coinTime = new Date(coin.date).setHours(0, 0, 0, 0);
      return coinTime >= startTime && coinTime <= endTime;
    });
  };

  const sortedReferralCoins =
    selectedStaff?.referralCoins?.slice().sort((a, b) => {
      const dateA = new Date(a.date).setHours(0, 0, 0, 0);
      const dateB = new Date(b.date).setHours(0, 0, 0, 0);
      return dateB - dateA;
    }) || [];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSendOtp = async () => {
    if (addStaffData.mobileNo.length !== 10) {
      toast.error("Mobile number should be 10 digits");
      setSubmitting(false); // Re-enable the button
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/otpRegister`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobileNo: addStaffData.mobileNo }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.error(data.message);
      } else {
        toast.success("OTP sent successfully");
        setRefId(data.otp);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtpAndAddStaff = async () => {
    if (otp.length !== 4) {
      toast.error("OTP should be 4 digits");
      setSubmitting(false); // Re-enable the button
      return;
    }

    setSubmitting(true);

    const staffDataToSend = {
      // ...addStaffData,
      // isStaff: true,
      mobileNo: addStaffData.mobileNo,
      otp,
      // refId: otp,
      name: addStaffData.name,
      email: addStaffData.email,
    };

    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/verifyOtpRegister`,
        {
          method: "POST",
          // headers: {
          //   Authorization: `Bearer ${token}`,
          //   "Content-Type": "application/json",
          // },
          body: JSON.stringify(staffDataToSend),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Staff added successfully");
        setOpenAddStaffDialog(false);
        fetchStaff();
        setAddStaffData({
          name: "",
          lastName: "",
          email: "",
          mobileNo: "",
          isStaff: true,
        });
        setOtp(""); // Clear OTP
        setRefId(""); // Clear refId
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error adding staff:", error);
      toast.error("Failed to add staff");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/staff/getAllStaff`
      );
      if (response.data.success) {
        setStaffList(response.data.data);
      } else {
        setStaffList([]);
        toast.error("Failed to fetch staff");
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = Cookies.get("token");
      const isStaff = false;

      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/admin/customers/${staffToDelete._id}`,
        { isStaff },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Staff deleted successfully");
        fetchStaff();
      } else {
        toast.error(response.data.message); // Display error message from response
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error("Failed to delete staff");
    } finally {
      setStaffToDelete(null);
      setOpenDeleteDialog(false);
    }
  };
  const handleAddStaff = async () => {
    if (addStaffData.mobileNo.length !== 10) {
      toast.error("Mobile number should be 10 digits");
      setSubmitting(false); // Re-enable the button
      return;
    }

    setSubmitting(true);

    // Ensure isStaff is true in the data sent to the API
    const staffDataToSend = {
      ...addStaffData,
      isStaff: true,
    };

    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/verifyOtpRegister`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(staffDataToSend),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Staff added successfully");
        setOpenAddStaffDialog(false);
        fetchStaff();
        setAddStaffData({
          name: "",
          lastName: "",
          email: "",
          mobileNo: "",
          isStaff: true, // Reset form data and keep isStaff true
        });
      } else {
        toast.error(data.message); // Display error message from response
      }
    } catch (error) {
      console.error("Error adding staff:", error);
      toast.error("Failed to add staff");
    } finally {
      setSubmitting(false);
    }
  };

  // ...

  const handleViewDetails = (staff) => {
    setSelectedStaff(staff);
    setOpenViewDialog(true);
  };

  const handleEditSave = async () => {
    if (editStaffData.mobileNo.length !== 10) {
      toast.error("Mobile number should be 10 digits");
      setSubmitting(false); // Re-enable the button
      return;
    }
    setSubmitting(true);
    try {
      // Existing code...

      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/admin/staff/updateDetails/${selectedStaff._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editStaffData),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Staff updated successfully");
        setOpenEditDialog(false);
        fetchStaff();
      } else {
        toast.error(data.message); // Display error message from response
      }
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error("Failed to update staff");
    } finally {
      setSubmitting(false);
    }
  };
  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedStaff(null);
  };
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateMobile = (mobileNo) => {
    const regex = /^\d{10}$/;
    return regex.test(mobileNo);
  };

  const handleInputChange = (e) => {
    setNewStaffData({ ...newStaffData, [e.target.name]: e.target.value });
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setEditStaffData({
      name: staff.name,
      lastName: staff.lastName,
      email: staff.email,
      mobileNo: staff.mobileNo,
    });
    setOpenEditDialog(true);
  };

  const handleConfirmDelete = (staff) => {
    setStaffToDelete(staff);
    setOpenDeleteDialog(true);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };


  const sortedStaff = [...staffList].sort((a, b) => {
    const orderByValueA = a[orderBy] || "";
    const orderByValueB = b[orderBy] || "";
    if (orderBy === "mobileNo") {
      return (order === "asc" ? 1 : -1) * (parseInt(orderByValueA) - parseInt(orderByValueB));
    } else {
      return (order === "asc" ? 1 : -1) * orderByValueA.localeCompare(orderByValueB);
    }
  });


  const filteredStaff = sortedStaff.filter((staff) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      staff.name.toLowerCase().includes(searchTermLower) ||
      staff.email.toLowerCase().includes(searchTermLower) ||
      String(staff.mobileNo).toLowerCase().includes(searchTermLower)
    );
  });

  const handleExportExcel = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/admin/staff/get`
      );

      if (response.data.success) {
        const staffData = response.data.data.map(
          ({ name, email, mobileNo, referralCount }) => ({
            " Name": name,

            Email: email,
            "Mobile No": mobileNo,
            "Referral Count": referralCount,
          })
        );

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(staffData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Staff Data");

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(blob, "staff_data.xlsx");
      } else {
        toast.error("Failed to export staff data");
      }
    } catch (error) {
      console.error("Error exporting staff data:", error);
      toast.error("Failed to export staff data");
    }
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleWithdrawPopup = () => {
    setWithdrawalPopupOpen(true);
  };

  const handleWithdrawClosePopup = () => {
    setWithdrawalPopupOpen(false);
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <SideBar />
        <div
          className="staff-management"
          style={{ width: "100%", margin: "2%" }}
        >
          <Box
            display="flex"
            alignItems="center"
            marginTop="7%"
            justifyContent="space-between"
          // marginLeft="20%"
          >
            <TextField
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              sx={{ mr: 1 }} // Add margin-right to create space between the elements
            />
            <Box
              display="flex"
              alignItems="center"
              width="100%"
              justifyContent="flex-end"
            >
              {/* <Button
                variant="contained"
                onClick={() => setOpenAddStaffDialog(true)}
                style={{ backgroundColor: "#ffa500", marginRight: "5%" }}
              >
                Add Staff
              </Button> */}

              <Button
                variant="contained"
                onClick={handleExportExcel}
                style={{ backgroundColor: "#ffa500", marginRight: "5%" }}
              >
                Export
              </Button>
            </Box>
          </Box>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "start" }}>
            <div
              className="ProductManagementProductDetailsSecond00"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "20px 20px",
                marginTop: "2%",

                width: "30%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "4rem",
                }}
              >
                <PeopleOutlineIcon
                  sx={{
                    color: "black",
                    background: "#ffffcc",
                    p: 1,
                    fontSize: "40px",
                    borderRadius: "10px",
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" sx={{ fontSize: "14px", color: "grey" }}>
                  All Staff
                  <br />
                  <Typography
                    paragraph
                    style={{ fontWeight: "500", color: "black" }}
                  >
                    {staffList && staffList.length}
                    <span
                      style={{
                        fontSize: "12px",
                        color: "green",
                        marginLeft: "4px",
                      }}
                    >
                      {/* Calculate the percentage based on the total count of users */}
                      {staffList &&
                        staffList.length > 0 &&
                        `+${((staffList.length / staffList.length) * 100).toFixed(
                          2
                        )}%`}
                    </span>
                  </Typography>
                </Typography>
              </Box>
            </div>

            <div
              className="ProductManagementProductDetailsSecond00"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginLeft: "2%",
                marginTop: "2%",
                padding: "20px 20px",
                width: "70%",
              }}
            >

              <Box>
                <Typography variant="h6" gutterBottom align="center">
                  Admin
                </Typography>
                <Divider />
                <Grid container spacing={2} sx={{ marginTop: 1 }}>
                  <Grid item xs={4}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PaymentIcon color="primary" />
                      <Box sx={{ marginLeft: 1 }}>
                        <Typography variant="subtitle1">Total Amount</Typography>
                        <Typography variant="h6" color="green">
                          ₹{totalRewardMoney}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <DoneIcon color="secondary" />
                      <Box sx={{ marginLeft: 1 }}>
                        <Typography variant="subtitle1">Total Paid</Typography>
                        <Typography variant="h6" color="textSecondary">
                          ₹
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <HourglassEmptyIcon color="error" />
                      <Box sx={{ marginLeft: 1 }}>
                        <Typography variant="subtitle1">
                          Pending Amount
                        </Typography>
                        <Typography variant="h6" color="textSecondary">
                          ₹
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleWithdrawPopup}
                    >
                      Withdraw
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </div>


          </div>


          {/* <Box>
            <Typography variant="h6" gutterBottom align="center">
              Admin
            </Typography>
            <Divider />
            <Grid container spacing={2} sx={{ marginTop: 1 }}>
              <Grid item xs={4}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PaymentIcon color="primary" />
                  <Box sx={{ marginLeft: 1 }}>
                    <Typography variant="subtitle1">Total Amount</Typography>
                    <Typography variant="h6" color="textSecondary">
                      ₹{totalRewardMoney}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <DoneIcon color="secondary" />
                  <Box sx={{ marginLeft: 1 }}>
                    <Typography variant="subtitle1">Total Paid</Typography>
                    <Typography variant="h6" color="textSecondary">
                      ₹
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <HourglassEmptyIcon color="error" />
                  <Box sx={{ marginLeft: 1 }}>
                    <Typography variant="subtitle1">
                      Pending Amount
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      ₹
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  color="primary"
                // onClick={handleClickOpen}
                >
                  Withdraw
                </Button>
              </Grid>
            </Grid>
          </Box> */}
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress />
            </div>
          ) : staffList.length === 0 ? (
            <Typography variant="body1">No staff at the moment</Typography>
          ) : (
            <TableContainer
              component={Paper}
              style={{
                width: "100%",
                // marginLeft: "19%",
                marginTop: "2%",
                marginBottom: "2%",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "name"}
                        direction={orderBy === "name" ? order : "asc"}
                        onClick={() => handleRequestSort("name")}
                      >
                        Name
                      </TableSortLabel>
                    </TableCell>

                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "email"}
                        direction={orderBy === "email" ? order : "asc"}
                        onClick={() => handleRequestSort("email")}
                      >
                        Email
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "mobileNo"}
                        direction={orderBy === "mobileNo" ? order : "asc"}
                        onClick={() => handleRequestSort("mobileNo")}
                      >
                        Mobile No
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>RewardCoins</TableCell>
                    <TableCell>RewardMoney</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStaff.map((staff) => (
                    <TableRow key={staff._id}>
                      <TableCell>{capitalizeFirstLetter(staff.name)}</TableCell>

                      <TableCell>{staff.email || " Not Given"}</TableCell>
                      <TableCell>{staff.mobileNo}</TableCell>
                      <TableCell>{staff.rewardCoins || 0} Coins</TableCell>
                      <TableCell>₹{staff.rewardMoney || 0}</TableCell>

                      <TableCell>
                        <IconButton
                          color="default"
                          onClick={() => handleViewDetails(staff)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(staff)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => handleConfirmDelete(staff)}
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
          {openDeleteDialog && (
            <div className="delete-confirmation-modal">
              <div className="modal-content">
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete this Staff?</p>
                <div className="delete-confirmation-buttons">
                  <button onClick={handleDelete}>Delete</button>

                  <button onClick={() => setOpenDeleteDialog(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          <Dialog
            open={openAddStaffDialog}
            onClose={() => setOpenAddStaffDialog(false)}
          >
            <DialogTitle>Add Staff</DialogTitle>
            <DialogContent>
              <TextField
                name="name"
                label="First Name"
                value={addStaffData.name}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (/^[A-Za-z\s]*$/.test(newValue) || newValue === "") {
                    setAddStaffData({ ...addStaffData, name: newValue });
                  }
                }}
                fullWidth
                margin="normal"
                error={!/^[A-Za-z\s]*$/.test(addStaffData.name)}
                helperText={
                  !/^[A-Za-z\s]*$/.test(addStaffData.name) &&
                  "First Name should only contain alphabets"
                }
              />

              <TextField
                name="lastName"
                label="Last Name"
                value={addStaffData.lastName}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (/^[A-Za-z\s]*$/.test(newValue) || newValue === "") {
                    setAddStaffData({ ...addStaffData, lastName: newValue });
                  }
                }}
                fullWidth
                margin="normal"
                error={!/^[A-Za-z\s]*$/.test(addStaffData.lastName)}
                helperText={
                  !/^[A-Za-z\s]*$/.test(addStaffData.lastName) &&
                  "Last Name should only contain alphabets"
                }
              />

              <TextField
                name="email"
                label="Email"
                value={addStaffData.email}
                onChange={(e) =>
                  setAddStaffData({ ...addStaffData, email: e.target.value })
                }
                fullWidth
                margin="normal"
              />

              <TextField
                name="mobileNo"
                label="Mobile No"
                value={addStaffData.mobileNo}
                onChange={(e) =>
                  setAddStaffData({ ...addStaffData, mobileNo: e.target.value })
                }
                fullWidth
                margin="normal"
              />

              <TextField
                name="otp"
                label="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                fullWidth
                margin="normal"
                disabled={!refId} // Disable OTP input until OTP is sent
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAddStaffDialog(false)}>
                Cancel
              </Button>
              {!refId ? (
                <Button
                  onClick={handleSendOtp}
                  color="primary"
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={24} /> : "Send OTP"}
                </Button>
              ) : (
                <Button
                  onClick={handleVerifyOtpAndAddStaff}
                  color="primary"
                  disabled={
                    submitting ||
                    !/^[A-Za-z\s]*$/.test(addStaffData.name) ||
                    !/^[A-Za-z\s]*$/.test(addStaffData.lastName) ||
                    !validateEmail(addStaffData.email) ||
                    !validateMobile(addStaffData.mobileNo) ||
                    otp.length !== 4 // Ensure consistent OTP length
                  }
                >
                  {submitting ? <CircularProgress size={24} /> : "Add"}
                </Button>
              )}
            </DialogActions>
          </Dialog>

          <Dialog
            open={openEditDialog}
            onClose={() => setOpenEditDialog(false)}
          >
            <DialogTitle>Edit Staff</DialogTitle>
            <DialogContent>
              {selectedStaff && (
                <>
                  <TextField
                    name="name"
                    label="First Name"
                    value={editStaffData.name}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (/^[A-Za-z\s]*$/.test(newValue) || newValue === "") {
                        setEditStaffData({
                          ...editStaffData,
                          name: newValue,
                        });
                      }
                    }}
                    fullWidth
                    margin="normal"
                    error={!/^[A-Za-z\s]*$/.test(editStaffData.name)}
                    helperText={
                      !/^[A-Za-z\s]*$/.test(editStaffData.name) &&
                      "First Name should only contain alphabets"
                    }
                  />

                  <TextField
                    name="lastName"
                    label="Last Name"
                    value={editStaffData.lastName}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (/^[A-Za-z\s]*$/.test(newValue) || newValue === "") {
                        setEditStaffData({
                          ...editStaffData,
                          lastName: newValue,
                        });
                      }
                    }}
                    fullWidth
                    margin="normal"
                    error={!/^[A-Za-z\s]*$/.test(editStaffData.lastName)}
                    helperText={
                      !/^[A-Za-z\s]*$/.test(editStaffData.lastName) &&
                      "Last Name should only contain alphabets"
                    }
                  />

                  <TextField
                    name="email"
                    label="Email"
                    value={editStaffData.email}
                    onChange={(e) =>
                      setEditStaffData({
                        ...editStaffData,
                        email: e.target.value,
                      })
                    }
                    fullWidth
                    margin="normal"
                    error={!validateEmail(editStaffData.email)}
                    helperText={
                      !validateEmail(editStaffData.email) &&
                      "Invalid email format"
                    }
                  />
                  <TextField
                    name="mobileNo"
                    label="Mobile No"
                    value={editStaffData.mobileNo}
                    onChange={(e) =>
                      setEditStaffData({
                        ...editStaffData,
                        mobileNo: e.target.value,
                      })
                    }
                    fullWidth
                    margin="normal"
                    error={!validateMobile(editStaffData.mobileNo)}
                    helperText={
                      !validateMobile(editStaffData.mobileNo) &&
                      "Invalid mobile number format"
                    }
                  />
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
              <Button
                onClick={handleEditSave}
                color="primary"
                disabled={
                  submitting ||
                  !/^[A-Za-z ]*$/.test(editStaffData.name) ||
                  !/^[A-Za-z ]+$/.test(editStaffData.lastName) ||
                  !validateEmail(editStaffData.email) ||
                  !validateMobile(editStaffData.mobileNo)
                }
              >
                {submitting ? <CircularProgress size={24} /> : "Save"}
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openViewDialog}
            onClose={handleCloseViewDialog}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle>Staff Details</DialogTitle>
            <DialogContent>
              {selectedStaff && (
                <>
                  <Typography variant="h6">
                    Name: {capitalizeFirstLetter(selectedStaff.name)}
                  </Typography>
                  <Typography variant="body1">
                    Reward Coins: {selectedStaff.rewardCoins}
                  </Typography>
                  <Typography variant="body1">
                    Reward Money: ₹{selectedStaff.rewardMoney}
                  </Typography>
                  <Typography variant="body1">
                    Mobile Number: {selectedStaff.mobileNo}
                  </Typography>
                  <Typography variant="h6" style={{ marginTop: "1rem" }}>
                    Referral Coins
                  </Typography>
                  <TextField
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ mr: 1, marginTop: "2%" }}
                  />
                  <TextField
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ mr: 1, marginTop: "2%" }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleClearDateFilter}
                    style={{ backgroundColor: "#ffa500", marginTop: "3%" }}
                  >
                    Clear Date Filter
                  </Button>
                  <TableContainer
                    component={Paper}
                    style={{ marginTop: "1rem" }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Date & Time</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredReferralCoins.length > 1 ? (
                          filteredReferralCoins.slice(1).map((coin) => (
                            <TableRow key={coin._id}>
                              <TableCell>{coin._id}</TableCell>
                              <TableCell>{coin.amount}</TableCell>
                              <TableCell>
                                {new Date(coin.date).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} align="center">
                              No referral coins available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseViewDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <WithdrawalPopup
            open={withdrawalPopupOpen}
            handleClose={handleWithdrawClosePopup}
          />
          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default StaffManagement;
