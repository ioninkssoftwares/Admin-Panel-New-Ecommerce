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
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import DoneIcon from "@mui/icons-material/Done";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SideBar from "../../Component/SideBar"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useCookies } from "react-cookie";
import WithdrawalPopup from "../StaffManagement/withdrawalPopup";

const AdminManagement = () => {
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [cookies, setCookie] = useCookies(["token"]);
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [adminDetails, setAdminDetails] = useState({});
  const [withdrawalPopupOpen, setWithdrawalPopupOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  if (adminDetails) console.log(adminDetails, "jkhjkkj")

  const handleWithdrawPopup = () => {
    setWithdrawalPopupOpen(true);
  };

  const handleWithdrawClosePopup = () => {
    setWithdrawalPopupOpen(false);
  }

   const [view, setView] = useState("transactions");

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleClearDateFilter = () => {
    setStartDate("");
    setEndDate("");
    // if (selectedStaff) {
    //   setFilteredReferralCoins(selectedStaff.referralCoins);
    // }
  };

  const filterByDateRange = (data) => {
    if (!startDate || !endDate) return data;
    return data.filter(item => {
      const date = dayjs(item.date);
      return date.isAfter(dayjs(startDate).subtract(1, 'day')) && date.isBefore(dayjs(endDate).add(1, 'day'));
    });
  };

  // const sortedReferralCoinss = filteredReferralCoins.slice().reverse();
  // const sortedWithdrawalInfo = (selectedStaff?.withdrawalInfo || []).slice().reverse();

  // const filteredReferralCoinsByDate = filterByDateRange(sortedReferralCoinss);
  // const filteredWithdrawalInfoByDate = filterByDateRange(sortedWithdrawalInfo);




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

  const fetchAdminDetails = async () => {
    const token = cookies.token;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setAdminDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchAdminDetails();
  }, []);

  const handleViewDetails = () => {
    // setSelectedStaff(staff);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    // setSelectedStaff(null);
  };

  const totalStaffRewardMoney = staffList?.reduce((sum, staff) => {
    return sum + (staff.rewardMoney || 0);
  }, 0);

  const totalPaidStaffMoney = staffList?.reduce((sum, staff) => {
    const staffTotal = staff.withdrawalInfo.reduce((staffSum, withdrawal) => {
      return staffSum + (withdrawal.totalAmount || 0);
    }, 0);
    return sum + staffTotal;
  }, 0);

  const totalPendinggStaffMoney = totalStaffRewardMoney - totalPaidStaffMoney


  const adminWithdrawalMoney = adminDetails?.user?.withdrawalInfo.reduce((sum, staff) => {
    return sum + (staff.rewardMoney || 0);
  }, 0);

  const calculateRewardMoney = (referralCoins) => {
    return referralCoins.reduce((sum, coin) => {
      return coin.amount < 50 ? sum + coin.amount : sum;
    }, 0);
  };

  const sortedAdminWithdrawalInfo = (adminDetails?.user?.withdrawalInfo || []).slice().reverse();

  const filteredWithdrawalInfoByDate = filterByDateRange(sortedAdminWithdrawalInfo);

  const totalWithdrawalAmount = adminDetails?.user?.withdrawalInfo.reduce((sum, transaction) => sum + transaction.totalAmount, 0);



  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <div
        className="staff-management"
        style={{ width: "100%", margin: "5% 2%" }}
      >
        <Box>
          <Typography variant="h4" gutterBottom align="center">
            Admin Management S
          </Typography>
          <Divider />
          {/* <Grid container spacing={2} sx={{ marginTop: 1 }}>
            <Grid item xs={4}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PaymentIcon color="primary" />
                <Box sx={{ marginLeft: 1 }}>
                  <Typography variant="subtitle1">Total Amount</Typography>
                  <Typography variant="h6" color="green">
                 
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
                
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleViewDetails}
              >
                <VisibilityIcon />
              </Button>
            </Grid>
          </Grid> */}
        </Box>
        {/* <Dialog
          open={openViewDialog}
          onClose={handleCloseViewDialog}
          fullWidth
          maxWidth="lg"
        > */}
        {/* <DialogTitle> Details</DialogTitle> */}
        {/* <DialogContent> */}
        {staffList && (
          <>
            {/* <Typography variant="h6">
                    Name: {capitalizeFirstLetter(selectedStaff.name)}
                  </Typography> */}
            {/* <Typography variant="body1">
                    Reward Coins: {selectedStaff.rewardCoins}
                  </Typography>
                  <Typography variant="body1">
                    Reward Money: ₹{selectedStaff.rewardMoney}
                  </Typography> */}
            {/* <Typography variant="body1">
                    Mobile Number: {selectedStaff.mobileNo}
                  </Typography> */}
            {/* <Typography variant="h6" style={{ marginTop: "1rem" }}>
                    Referral Coins
                  </Typography> */}

            <Grid container spacing={2} sx={{ marginTop: 1 }}>
              <Grid item xs={4}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PaymentIcon color="primary" />
                  <Box sx={{ marginLeft: 1 }}>
                    <Typography variant="subtitle1">Total Amount Earned</Typography>
                    <Typography variant="h6" color="textSecondary">
                      ₹{totalStaffRewardMoney}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              {/* <Grid item xs={4}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <DoneIcon color="secondary" />
                  <Box sx={{ marginLeft: 1 }}>
                    <Typography variant="subtitle1">Total Staff Withdrawal</Typography>
                    <Typography variant="h6" color="textSecondary">
                      ₹{totalPaidStaffMoney || 0}
                    </Typography>
                  </Box>
                </Box>
              </Grid> */}
              <Grid item xs={4}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <HourglassEmptyIcon color="error" />
                  <Box sx={{ marginLeft: 1 }}>
                    <Typography variant="subtitle1">
                      Pending Amount
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      ₹{totalPendinggStaffMoney}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <HourglassEmptyIcon color="error" />
                  <Box sx={{ marginLeft: 1 }}>
                    <Typography variant="subtitle1">
                      Total withdrawal Amount
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      ₹{totalWithdrawalAmount}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", gap: "20px", marginBottom: "10px" }}>
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={handleViewChange}
                aria-label="view toggle"
              >
                <ToggleButton value="transactions" aria-label="products view">
                  All Staff Transactions List
                </ToggleButton>
                <ToggleButton value="allTransactions" aria-label="products view">
                  All Transactions List
                </ToggleButton>
                <ToggleButton value="adminWithdrawalTransactions" aria-label="transactions view">
                  Admin Withdrawal List
                </ToggleButton>

              </ToggleButtonGroup>

              {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        format="DD-MM-YYYY"
                      />
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        format="DD-MM-YYYY"
                      />
                    </div>
                  </LocalizationProvider> */}
              {/* <Button
                    variant="contained"
                    onClick={handleClearDateFilter}
                    style={{ backgroundColor: "#ffa500" }}
                  >
                    Clear
                  </Button> */}
              <Button
                variant="contained"
                onClick={handleWithdrawPopup}
                style={{ backgroundColor: "#ffa500" }}
              >
                Withdraw
              </Button>

            </Box>


            {view === "transactions" && (
              <>
                <Typography variant="h6"> All Staff Transactions</Typography>
                {staffList && staffList.length > 0 ? (
                  <TableContainer
                    component={Paper}
                    style={{ marginBottom: "20px" }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Transaction ID</TableCell>
                          <TableCell> Name</TableCell>
                          <TableCell>Reward Money</TableCell>
                          {/* <TableCell>Price</TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {staffList.map((staff) => (
                          <TableRow key={staff._id}>
                            <TableCell>{staff._id}</TableCell>
                            <TableCell>{staff.name}</TableCell>
                            <TableCell>            {calculateRewardMoney(staff.referralCoins)}</TableCell>
                            {/* <TableCell>{staff.price}</TableCell> */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography>Staffs are not available</Typography>
                )}
              </>
            )}

            {view === "adminWithdrawalTransactions" && (
              <TableContainer component={Paper} style={{ marginTop: "1rem" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Id</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Total Amount</TableCell>
                      <TableCell>TDS</TableCell>
                      <TableCell>Base Amount</TableCell>
                      <TableCell>TDS Certificate</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredWithdrawalInfoByDate.map((withdrawal) => (
                      <TableRow key={withdrawal.transactionId}>
                        <TableCell>{withdrawal.transactionId}</TableCell>
                        <TableCell>{withdrawal.transactionType}</TableCell>
                        <TableCell>{withdrawal.totalAmount}</TableCell>
                        <TableCell>{withdrawal.tdsDeducted}</TableCell>
                        <TableCell>{withdrawal.baseAmount}</TableCell>
                        <TableCell>
                          {withdrawal.tdsCertificate ? (
                            <a href={withdrawal.tdsCertificate} target="_blank" rel="noopener noreferrer">
                              <img src={withdrawal.tdsCertificate} alt="TDS Certificate" style={{ width: '50px', height: '50px' }} />
                            </a>
                          ) : 'No Certificate'}
                        </TableCell>
                        <TableCell>{dayjs(withdrawal.date).format('DD-MM-YYYY')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {view === "allTransactions" && (
              <>
                <Typography variant="h6">All Transactions:</Typography>
                {staffList && staffList.length > 0 ? (
                  <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Transaction ID</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Commission Earned</TableCell>
                          <TableCell>Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {staffList.map((staff) => (
                          <React.Fragment key={staff._id}>
                            {staff.referralCoins
                              // .filter(coin => coin.amount < 50)
                              .map((coin, index) => (
                                <TableRow key={`${staff._id}-${index}`}>
                                  <TableCell>{staff._id}</TableCell>
                                  <TableCell>{staff.name}</TableCell>
                                  <TableCell>
                                    {coin.amount}
                                    {coin.amount > 100 && (
                                      <span style={{ color: 'red', marginLeft: '10px' }}>Coin Bonus</span>
                                    )}
                                  </TableCell>
                                  <TableCell>{dayjs(staff.date).format('DD-MM-YYYY')}</TableCell>
                                </TableRow>
                              ))}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography>No orders found for this vendor</Typography>
                )}
              </>
            )}


          </>


        )}
        {/* </DialogContent> */}
        {/* <DialogActions>
            <Button onClick={handleCloseViewDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog> */}
        <WithdrawalPopup
          open={withdrawalPopupOpen}
          handleClose={handleWithdrawClosePopup}
          id={adminDetails?.user?._id}
          fetchStaff={fetchStaff}
          fetchAdminDetails={fetchAdminDetails}
          title="Withdrawal for Admin"
        />
        <ToastContainer />
      </div>
    </div >
  )
}
export default AdminManagement