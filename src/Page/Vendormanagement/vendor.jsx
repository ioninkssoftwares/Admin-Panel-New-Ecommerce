import React, { useState, useEffect } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import PersonIcon from "@mui/icons-material/Person";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DescriptionIcon from "@mui/icons-material/Description";

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  DialogContentText,
} from "@mui/material";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "../../Component/SideBar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { Grid, Divider, MenuItem } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import DoneIcon from "@mui/icons-material/Done";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
const VendorManagement = () => {
  const transactionTypes = [
    "Card",
    "UPI",
    "Net Banking",
    "Wallet",
    "Cheque",
    "Bitcoin",
    "PayPal",
    "Apple Pay",
    "Google Pay",
    "Bank Transfer",
  ];

  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingOrderData, setViewingOrderData] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    mobileNo: "",
    email: "",
    password: "",
    address1: "",
    address2: "",
    bankName: "",
    ifsc: "",
    accountNo: "",
    upiId: "",
    adhaarCardNo: "",
    pancardNo: "",
    gstNo: "",
  });

  const [gstError, setGstError] = useState("");
  const [bankNameError, setBankNameError] = useState("");
  const [upiIdError, setUpiIdError] = useState("");
  const [ifscError, setIfscError] = useState("");
  const [adhaarCardError, setAdhaarCardError] = useState("");
  const [panCardError, setPanCardError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [accountNoError, setAccountNoError] = useState("");

  const [editingVendorId, setEditingVendorId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [mobileError, setMobileError] = useState("");
  const [viewingVendorData, setViewingVendorData] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedVendorDetails, setSelectedVendorDetails] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/vendor/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
      } else {
        setVendors(data.data);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    if (name === "name" || name === "lastName") {
      if (!/^[a-zA-Z\s]{1,40}$/.test(value)) {
        // Assuming the same error message for both name and last name
        setNameError(
          "Name should only contain letters and should not exceed 40 characters"
        );
      } else {
        setNameError("");
      }
    }

    if (name === "email") {
      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setEmailError("Invalid email address");
      } else {
        setEmailError("");
      }
    }

    if (name === "mobileNo") {
      if (!/^\d{10}$/.test(value)) {
        setMobileError(
          "Mobile Number should be numeric and have exactly 10 digits"
        );
      } else {
        setMobileError("");
      }
    }

    if (name === "gstNo") {
      const gstRegex = /^\d{2}[A-Z0-9]{13}$/;
      if (!gstRegex.test(value)) {
        setGstError("Invalid GST Number format");
      } else {
        setGstError("");
      }
    }

    if (name === "bankName") {
      if (!/^[a-zA-Z\s]{1,40}$/.test(value)) {
        setBankNameError(
          "Bank Name should only contain letters and should not exceed 40 characters"
        );
      } else {
        setBankNameError("");
      }
    }

    if (name === "upiId") {
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
      if (!upiRegex.test(value)) {
        setUpiIdError("Invalid UPI ID format");
      } else {
        setUpiIdError("");
      }
    }

    if (name === "ifsc") {
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(value)) {
        setIfscError("Invalid IFSC Code format");
      } else {
        setIfscError("");
      }
    }

    if (name === "adhaarCardNo") {
      if (!/^\d{12}$/.test(value)) {
        setAdhaarCardError(
          "Aadhaar Card Number should be numeric and have exactly 12 digits"
        );
      } else {
        setAdhaarCardError("");
      }
    }

    if (name === "pancardNo") {
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value)) {
        setPanCardError(
          "PAN Card Number should be in the format ABCDE1234F and all in capital letters"
        );
      } else {
        setPanCardError("");
      }
    }

    if (name === "accountNo") {
      if (!/^\d{9,18}$/.test(value)) {
        setAccountNoError(
          "Bank Account Number should be numeric and have 9 to 18 digits"
        );
      } else {
        setAccountNoError("");
      }
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOFormData({
      ...OformData,
      [name]: value,
    });
  };
  const handleOpenEditDialog = (vendorId) => {
    setEditingVendorId(vendorId);
    const vendorToEdit = vendors.find((vendor) => vendor._id === vendorId);
    setFormData({
      name: vendorToEdit.name,
      lastName: vendorToEdit.lastName,
      mobileNo: vendorToEdit.mobileNo,
      email: vendorToEdit.email,
      password: "",
      address1: vendorToEdit.address1,
      address2: vendorToEdit.address2,
      bankName: vendorToEdit.bankName,
      ifsc: vendorToEdit.ifsc,
      accountNo: vendorToEdit.accountNo,
      upiId: vendorToEdit.upiId,
      adhaarCardNo: vendorToEdit.adhaarCardNo,
      pancardNo: vendorToEdit.pancardNo,
      gstNo: vendorToEdit.gstNo,
    });
    setOpenEditDialog(true);
  };

  const validateFormData = (formData) => {
    const newErrors = {};

    // Validate name
    if (!/^[a-zA-Z\s]{1,40}$/.test(formData.name)) {
      newErrors.name = "Enter a correct Name with only alphabets";
    }

    // Validate last name
    if (!/^[a-zA-Z\s]{1,40}$/.test(formData.lastName)) {
      newErrors.lastName = "Enter a correct Last Name with only alphabets";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a correct Email Address";
    }

    // Validate mobile number
    if (!/^\d{10}$/.test(formData.mobileNo)) {
      newErrors.mobileNo =
        "Mobile Number should be numeric and have exactly 10 digits";
    }

    // Password validation removed to make it optional

    // Validate address1
    if (!formData.address1) {
      newErrors.address1 = "Address1 is required";
    }

    // Validate Aadhaar Card Number
    if (formData.adhaarCardNo && !/^\d{12}$/.test(formData.adhaarCardNo)) {
      newErrors.adhaarCardNo =
        "Aadhaar Card Number should be numeric and have exactly 12 digits";
    }

    // Validate PAN Card Number
    if (
      formData.pancardNo &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.pancardNo)
    ) {
      newErrors.pancardNo =
        "PAN Card Number should be in the format ABCDE1234F and all in capital letters";
    }

    // Validate UPI ID format
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (formData.upiId && !upiRegex.test(formData.upiId)) {
      newErrors.upiId = "Invalid UPI ID format";
    }

    // Validate IFSC Code format
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (formData.ifsc && !ifscRegex.test(formData.ifsc)) {
      newErrors.ifsc = "Invalid IFSC Code format";
    }

    // Validate Bank Account Number
    if (formData.accountNo && !/^\d{9,18}$/.test(formData.accountNo)) {
      newErrors.accountNo =
        "Bank Account Number should be numeric and have 9 to 18 digits";
    }

    // Validate GST Number format
    const gstRegex = /^\d{2}[A-Z0-9]{13}$/;
    if (formData.gstNo && !gstRegex.test(formData.gstNo)) {
      newErrors.gstNo = "Invalid GST Number format";
    }

    // Validate Bank Name
    if (formData.bankName && !/^[a-zA-Z\s]{1,40}$/.test(formData.bankName)) {
      newErrors.bankName =
        "Bank Name should only contain letters and should not exceed 40 characters";
    }

    return newErrors;
  };

  const handleEditVendor = async () => {
    setLoading(true);
    try {
      const errors = validateFormData(formData);
      if (Object.keys(errors).length > 0) {
        Object.keys(errors).forEach((field) => {
          toast.error(errors[field]);
        });
        setLoading(false);
        return;
      }

      const token = Cookies.get("token");
      const vendorToEdit = vendors.find(
        (vendor) => vendor._id === editingVendorId
      );

      const fieldsToUpdate = [
        "name",
        "lastName",
        "mobileNo",
        "email",
        "address1",
        "address2",
        "password",
        "bankName",
        "ifsc",
        "accountNo",
        "upiId",
        "adhaarCardNo",
        "pancardNo",
        "gstNo",
        "password",
      ];

      const updatedData = {};

      fieldsToUpdate.forEach((field) => {
        if (formData[field] && formData[field] !== vendorToEdit[field]) {
          updatedData[field] = formData[field];
        }
      });

      // Check if any fields were updated
      if (Object.keys(updatedData).length === 0) {
        toast.info("No changes were made.");
        setOpenEditDialog(false);
        setLoading(false);
        return;
      }

      // Check if all fields are reverted to their original values
      const allFieldsReverted = Object.keys(updatedData).every((field) => {
        // Special handling for mobile number field
        if (field === "mobileNo") {
          const originalMobileNo = vendorToEdit[field];
          const currentMobileNo = formData[field];
          // Check if the current mobile number matches the original
          return originalMobileNo === currentMobileNo;
        }
        // For other fields, compare directly
        return formData[field] === vendorToEdit[field];
      });

      if (allFieldsReverted) {
        toast.info("No changes were made.");
        setOpenEditDialog(false);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/admin/vendor/updateDetails/${editingVendorId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
      } else {
        toast.success("Vendor updated successfully");
        setOpenEditDialog(false);
        fetchVendors();
      }
    } catch (error) {
      console.error("Error editing vendor:", error);
      toast.error("Failed to edit vendor");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVendor = async () => {
    setLoading(true);
    try {
      const errors = validateFormData(formData);
      if (Object.keys(errors).length > 0) {
        Object.keys(errors).forEach((field) => {
          toast.error(errors[field]);
        });
        setLoading(false);
        return;
      }

      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/admin/vendor/new`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
      } else {
        toast.success("Vendor created successfully");
        setOpenCreateDialog(false);
        fetchVendors();
        setFormData({
          name: "",
          lastName: "",
          mobileNo: "",
          email: "",
          password: "",
          address1: "",
          address2: "",
          bankName: "",
          ifsc: "",
          accountNo: "",
          upiId: "",
          adhaarCardNo: "",
          pancardNo: "",
          gstNo: "",
        });
      }
    } catch (error) {
      console.error("Error creating vendor:", error);
      toast.error("Failed to create vendor");
    } finally {
      setLoading(false);
    }
  };

  const handleViewVendor = async (vendorId) => {
    try {
      const token = Cookies.get("token");
      setTotalAmount(0);
      let selectedVendor = vendors.find((vendor) => vendor._id === vendorId);
      setSelectedVendor(selectedVendor); // Set selectedVendor initially

      // Fetch products
      const productResponse = await fetch(
        `${process.env.REACT_APP_BASE_URL}/product/getProductByVendorId/${vendorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const productData = await productResponse.json();

      // Fetch orders
      const orderResponse = await fetch(
        `${process.env.REACT_APP_BASE_URL}/vendor/getOrderByVendorId/${vendorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const orderData = await orderResponse.json();

      if (productResponse.ok && orderResponse.ok) {
        // Filter orders to include only those with status "Delivered"
        const deliveredOrders = orderData.data.filter(
          (order) => order.status === "Delivered"
        );

        const totalAmount = deliveredOrders.reduce((sum, order) => {
          return sum + order.product.price * order.quantity;
        }, 0);
        setTotalAmount(totalAmount);

        // Calculate total withdrawal amount for this vendor
        let vendorTotalWithdrawal = 0;
        if (selectedVendor && selectedVendor.withdrawalInfo) {
          vendorTotalWithdrawal = selectedVendor.withdrawalInfo.reduce(
            (sum, withdrawal) => {
              return sum + withdrawal.amount;
            },
            0
          );
        }
        setTotalPaid(vendorTotalWithdrawal);

        // Set the vendor's product details and order details
        setViewingVendorData(productData.data || []);
        setViewingOrderData(deliveredOrders || []);
      } else {
        // If the fetch fails, set empty data
        setViewingVendorData([]);
        setViewingOrderData([]);
      }

      setOpenViewDialog(true); // Open the dialog
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      toast.error("Failed to fetch vendor data");
      // Set empty data and open the dialog in case of an error
      setViewingVendorData([]);
      setViewingOrderData([]);
      setOpenViewDialog(true);
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/admin/vendor/delete/${vendorId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
      } else {
        toast.success("Vendor deleted successfully");
        fetchVendors();
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast.error("Failed to delete vendor");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (vendorId) => {
    setSelectedVendorId(vendorId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setSelectedVendorId(null);
    setDeleteDialogOpen(false);
  };
  const [totalAmount, setTotalAmount] = useState(0);

  const [totalPaid, setTotalPaid] = useState(0);
  const pendingAmount = totalAmount - totalPaid;
  const [view, setView] = useState("products");

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [open, setOpen] = useState(false);
  const [OformData, setOFormData] = useState({
    transactionType: "",
    transactionId: "",
    amount: "",
    date: "",
  });
  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleConfirmSubmit = () => {
    setConfirmOpen(false);
    handleSubmit();
  };

  const handleFormSubmit = () => {
    setConfirmOpen(true);
  };
  const handleSubmit = async () => {
    if (OformData.amount <= 0) {
      toast("Amount should be greater than 0");
      return;
    }

    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/admin/vendor/updateDetails/${selectedVendor._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ withdrawalInfo: [OformData] }), // Send only withdrawalInfo
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      toast.success("Withdrawal done successfully");

      handleClose();
      await fetchVendors();
      handleViewVendor(selectedVendor._id);

      // Reset form data and close the form
      setOFormData({
        transactionType: "",
        transactionId: "",
        amount: "",
        date: "",
      });
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred during the withdrawal process");
    }
  };

  const renderViewDialog = () => (
    <Dialog
      open={openViewDialog}
      onClose={() => {
        setOpenViewDialog(false);
        setTotalAmount(0);
      }}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          width: "80%", // Set the dialog width to 100%
          maxWidth: "none", // Override the default maxWidth behavior
        },
      }}
    >
      <DialogTitle>Vendor Details</DialogTitle>
      <DialogContent style={dialogContentStyle}>
        {selectedVendor ? (
          <div>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
                marginBottom: "2%",
              }}
            >
              {/* Personal Info Box */}
              {selectedVendor.name && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "whitesmoke",
                    padding: "20px",
                    borderRadius: "15px",
                    flex: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <PersonIcon sx={{ color: "orange", marginRight: "10px" }} />
                    <Typography variant="h6">Personal Info</Typography>
                  </Box>
                  <Typography variant="subtitle1">
                    <strong>Name:</strong> {selectedVendor.name}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Last Name:</strong> {selectedVendor.lastName}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Email:</strong> {selectedVendor.email}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Mobile Number:</strong> {selectedVendor.mobileNo}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Address1:</strong> {selectedVendor.address1}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Address2:</strong> {selectedVendor.address2}
                  </Typography>
                </Box>
              )}

              {/* Banking Info Box */}
              {selectedVendor.bankName && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "whitesmoke",
                    padding: "20px",
                    borderRadius: "15px",
                    flex: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <AccountBalanceIcon
                      sx={{ color: "orange", marginRight: "10px" }}
                    />
                    <Typography variant="h6">Banking Info</Typography>
                  </Box>
                  <Typography variant="subtitle1">
                    <strong>Bank Name:</strong> {selectedVendor.bankName}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>IFSC:</strong> {selectedVendor.ifsc}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Account Number:</strong> {selectedVendor.accountNo}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>UPI ID:</strong> {selectedVendor.upiId}
                  </Typography>
                </Box>
              )}

              {/* Documental Info Box */}
              {selectedVendor.adhaarCardNo && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "whitesmoke",
                    padding: "20px",
                    borderRadius: "15px",
                    flex: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <DescriptionIcon
                      sx={{ color: "orange", marginRight: "10px" }}
                    />
                    <Typography variant="h6">Documental Info</Typography>
                  </Box>
                  <Typography variant="subtitle1">
                    <strong>Aadhaar Card Number:</strong>{" "}
                    {selectedVendor.adhaarCardNo}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>PAN Card Number:</strong> {selectedVendor.pancardNo}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>GST Number:</strong> {selectedVendor.gstNo}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Payment Section */}
            <Box
              sx={{
                padding: 2,
                margin: "20px",
                borderRadius: "8px",
                boxShadow: 3,
                backgroundColor: "#f5f5f5",
              }}
              component={Paper}
            >
              {/* Payment Info */}
              <Typography variant="h6" gutterBottom align="center">
                Payments
              </Typography>
              <Divider />
              <Grid container spacing={2} sx={{ marginTop: 1 }}>
                <Grid item xs={4}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PaymentIcon color="primary" />
                    <Box sx={{ marginLeft: 1 }}>
                      <Typography variant="subtitle1">Total Amount</Typography>
                      <Typography variant="h6" color="textSecondary">
                        ₹{totalAmount}
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
                        ₹{totalPaid || 0}
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
                        ₹{pendingAmount}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                  >
                    Withdraw
                  </Button>
                </Grid>
              </Grid>

              {/* ToggleButtonGroup and Views */}
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={handleViewChange}
                aria-label="view toggle"
                sx={{ marginTop: 2, marginBottom: 2 }}
              >
                <ToggleButton value="products" aria-label="products view">
                  Products
                </ToggleButton>
                <ToggleButton value="orders" aria-label="orders view">
                  Orders
                </ToggleButton>
                <ToggleButton
                  value="transactions"
                  aria-label="transactions view"
                >
                  Transactions
                </ToggleButton>
              </ToggleButtonGroup>

              {/* Render view based on selected view */}
              {view === "products" && (
                <>
                  <Typography variant="h6">Products:</Typography>
                  {viewingVendorData && viewingVendorData.length > 0 ? (
                    <TableContainer
                      component={Paper}
                      style={{ marginBottom: "20px" }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Product ID</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Price</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {viewingVendorData.map((product) => (
                            <TableRow key={product._id}>
                              <TableCell>{product._id}</TableCell>
                              <TableCell>{product.name}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>{product.price}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography>No products found for this vendor</Typography>
                  )}
                </>
              )}
              {view === "orders" && (
                <>
                  <Typography variant="h6">Orders:</Typography>
                  {viewingOrderData && viewingOrderData.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Order Id</TableCell>
                            <TableCell>Order Date</TableCell>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {viewingOrderData.map((order) => (
                            <TableRow key={order._id}>
                              <TableCell>{order._id}</TableCell>
                              <TableCell>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{order.product.name}</TableCell>
                              <TableCell>{order.product.price}</TableCell>
                              <TableCell>{order.quantity}</TableCell>
                              <TableCell>
                                {order.product.price * order.quantity}
                              </TableCell>
                              <TableCell>{order.status}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography>No orders found for this vendor</Typography>
                  )}
                </>
              )}
              {view === "transactions" && (
                <>
                  <Typography variant="h6">Transactions:</Typography>
                  {selectedVendor.withdrawalInfo &&
                    selectedVendor.withdrawalInfo.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Transaction Id</TableCell>
                            <TableCell>Transaction Type</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedVendor.withdrawalInfo
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map((transaction, index) => (
                              <TableRow key={`${selectedVendor._id}-${index}`}>
                                <TableCell>
                                  {transaction.transactionId}
                                </TableCell>
                                <TableCell>
                                  {transaction.transactionType}
                                </TableCell>
                                <TableCell>₹{transaction.amount}</TableCell>
                                <TableCell>
                                  {new Date(
                                    transaction.date
                                  ).toLocaleDateString()}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography>
                      No transactions found for this vendor
                    </Typography>
                  )}
                </>
              )}
            </Box>
          </div>
        ) : (
          <CircularProgress />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenViewDialog(false)} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
  const dialogContentStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px", // Add space between the tables
  };

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
    setFormData({
      name: "",
      lastName: "",
      mobileNo: "",
      email: "",
      password: "",
      address1: "",
      address2: "",
      bankName: "",
      ifsc: "",
      accountNo: "",
      upiId: "",
      adhaarCardNo: "",
      pancardNo: "",
      gstNo: "",
    });
    setMobileError("");
    setGstError("");
    setIfscError("");
    setAccountNoError("");
    setAdhaarCardError("");
    setPanCardError("");
    setBankNameError("");
    setUpiIdError("");
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <div style={{ width: "100%", margin: "2%", marginTop: "7%" }}>
        <ToastContainer />
        <Typography variant="h4" gutterBottom>
          Vendor Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenCreateDialog()}
          sx={{ background: "orange", marginBottom: "2%" }}
        >
          Add Vendor
        </Button>
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper} className="mt-4">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Id</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Mobile Number</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor._id}>
                    <TableCell>{vendor.name}</TableCell>
                    <TableCell>{vendor._id}</TableCell>
                    <TableCell>{vendor.lastName}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>{vendor.mobileNo}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleOpenEditDialog(vendor._id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleViewVendor(vendor._id)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => openDeleteDialog(vendor._id)}>
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
          open={openCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
        >
          <DialogTitle>Create Vendor</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="name"
              label="Name"
              type="text"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
              error={!!nameError}
              helperText={nameError}
            />
            <TextField
              margin="dense"
              name="lastName"
              label="Last Name"
              type="text"
              fullWidth
              value={formData.lastName}
              onChange={handleInputChange}
              error={!!nameError}
              helperText={nameError}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleInputChange}
              error={!!emailError}
              helperText={emailError}
            />

            <TextField
              margin="dense"
              name="mobileNo"
              label="Mobile Number"
              type="text"
              fullWidth
              value={formData.mobileNo}
              onChange={handleInputChange}
              error={!!mobileError}
              helperText={mobileError}
            />

            <TextField
              margin="dense"
              name="address1"
              label="Address 1"
              type="text"
              fullWidth
              value={formData.address1}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="address2"
              label="Address 2"
              type="text"
              fullWidth
              value={formData.address2}
              onChange={handleInputChange}
            />
            <TextField
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              margin="dense"
              name="bankName"
              label="Bank Name"
              type="text"
              fullWidth
              value={formData.bankName}
              onChange={handleInputChange}
              error={!!bankNameError}
              helperText={bankNameError}
            />
            <TextField
              margin="dense"
              name="ifsc"
              label="IFSC Code"
              type="text"
              fullWidth
              value={formData.ifsc}
              onChange={handleInputChange}
              error={!!ifscError}
              helperText={ifscError}
            />
            <TextField
              margin="dense"
              name="accountNo"
              label="Account Number"
              type="text"
              fullWidth
              value={formData.accountNo}
              onChange={handleInputChange}
              error={!!accountNoError}
              helperText={accountNoError}
            />
            <TextField
              margin="dense"
              name="upiId"
              label="UPI ID"
              type="text"
              fullWidth
              value={formData.upiId}
              onChange={handleInputChange}
              error={!!upiIdError}
              helperText={upiIdError}
            />
            <TextField
              margin="dense"
              name="adhaarCardNo"
              label="Aadhaar Card Number"
              type="text"
              fullWidth
              value={formData.adhaarCardNo}
              onChange={handleInputChange}
              error={!!adhaarCardError}
              helperText={adhaarCardError}
            />
            <TextField
              margin="dense"
              name="pancardNo"
              label="PAN Card Number"
              type="text"
              fullWidth
              value={formData.pancardNo}
              onChange={handleInputChange}
              error={!!panCardError}
              helperText={panCardError}
            />
            <TextField
              margin="dense"
              name="gstNo"
              label="GST Number"
              type="text"
              fullWidth
              value={formData.gstNo}
              onChange={handleInputChange}
              error={!!gstError}
              helperText={gstError}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenCreateDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleCreateVendor} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openEditDialog}
          onClose={() => {
            setOpenEditDialog(false);
            setFormData({
              name: "",
              lastName: "",
              mobileNo: "",
              email: "",
              // password: "",
              address1: "",
              address2: "",
              bankName: "",
              ifsc: "",
              accountNo: "",
              upiId: "",
              adhaarCardNo: "",
              pancardNo: "",
              gstNo: "",
            });
          }}
        >
          <DialogTitle>Edit Vendor</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="name"
              label="Name"
              type="text"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
              error={!!nameError}
              helperText={nameError}
            />
            <TextField
              margin="dense"
              name="lastName"
              label="Last Name"
              type="text"
              fullWidth
              value={formData.lastName}
              onChange={handleInputChange}
              error={!!nameError}
              helperText={nameError}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleInputChange}
              error={!!emailError}
              helperText={emailError}
            />

            <TextField
              margin="dense"
              name="mobileNo"
              label="Mobile Number"
              type="text"
              fullWidth
              value={formData.mobileNo}
              onChange={handleInputChange}
              error={!!mobileError}
              helperText={mobileError}
            />

            <TextField
              margin="dense"
              name="address1"
              label="Address 1"
              type="text"
              fullWidth
              value={formData.address1}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="address2"
              label="Address 2"
              type="text"
              fullWidth
              value={formData.address2}
              onChange={handleInputChange}
            />
            <TextField
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              margin="dense"
              name="bankName"
              label="Bank Name"
              type="text"
              fullWidth
              value={formData.bankName}
              onChange={handleInputChange}
              error={!!bankNameError}
              helperText={bankNameError}
            />
            <TextField
              margin="dense"
              name="ifsc"
              label="IFSC Code"
              type="text"
              fullWidth
              value={formData.ifsc}
              onChange={handleInputChange}
              error={!!ifscError}
              helperText={ifscError}
            />
            <TextField
              margin="dense"
              name="accountNo"
              label="Account Number"
              type="text"
              fullWidth
              value={formData.accountNo}
              onChange={handleInputChange}
              error={!!accountNoError}
              helperText={accountNoError}
            />
            <TextField
              margin="dense"
              name="upiId"
              label="UPI ID"
              type="text"
              fullWidth
              value={formData.upiId}
              onChange={handleInputChange}
              error={!!upiIdError}
              helperText={upiIdError}
            />
            <TextField
              margin="dense"
              name="adhaarCardNo"
              label="Aadhaar Card Number"
              type="text"
              fullWidth
              value={formData.adhaarCardNo}
              onChange={handleInputChange}
              error={!!adhaarCardError}
              helperText={adhaarCardError}
            />
            <TextField
              margin="dense"
              name="pancardNo"
              label="PAN Card Number"
              type="text"
              fullWidth
              value={formData.pancardNo}
              onChange={handleInputChange}
              error={!!panCardError}
              helperText={panCardError}
            />
            <TextField
              margin="dense"
              name="gstNo"
              label="GST Number"
              type="text"
              fullWidth
              value={formData.gstNo}
              onChange={handleInputChange}
              error={!!gstError}
              helperText={gstError}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleEditVendor} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {deleteDialogOpen && (
          <div className="delete-confirmation-modal">
            <div className="modal-content">
              <h2>Confirm Deletion</h2>
              <p> Are you sure you want to delete this vendor</p>
              <div className="delete-confirmation-buttons">
                <button onClick={() => handleDeleteVendor(selectedVendorId)}>
                  Confirm
                </button>

                <button onClick={() => closeDeleteDialog()}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Withdraw</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please fill in the transaction details.
            </DialogContentText>
            <TextField
              select
              label="Transaction Type"
              name="transactionType"
              value={OformData.transactionType}
              onChange={handleChange}
              fullWidth
              margin="dense"
            >
              {transactionTypes.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Transaction ID"
              name="transactionId"
              value={OformData.transactionId}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={OformData.amount}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              value={OformData.date}
              onChange={handleChange}
              fullWidth
              margin="dense"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleFormSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        {renderViewDialog()}

        {confirmOpen && (
          <div className="delete-confirmation-modal">
            <div className="modal-content">
              <h2>Confirm Deletion</h2>
              <p> Are you sure you want to make this withdrawal?</p>
              <div className="delete-confirmation-buttons">
                <button onClick={handleConfirmSubmit}>Confirm</button>

                <button onClick={() => handleConfirmClose()}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorManagement;
