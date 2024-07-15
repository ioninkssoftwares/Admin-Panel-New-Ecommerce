import React from "react";
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
    Grid,
    Divider,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import DoneIcon from "@mui/icons-material/Done";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { useState } from "react";
import { useCookies } from "react-cookie";


const AllWithdrawalPopup = ({ open, handleClose, allStaff }) => {
    const [cookies, setCookie] = useCookies(["token"]);
    const [withdrawalInfo, setWithdrawalInfo] = useState({
        type: "",
        transactionId: "",
        baseAmount: "",
        totalAmount: "",
        tdsAmount: "",
    });
    const [view, setView] = useState("transactions");

    const handleViewChange = (event, newView) => {
        if (newView !== null) {
            setView(newView);
        }
    };

    if (allStaff) console.log(allStaff, "allstaff");


    const handleChange = (event) => {
        setWithdrawalInfo({ ...withdrawalInfo, type: event.target.value });
    };


    // const handleSubmit = async () => {
    //     try {
    //       const token = cookies.token;
    //       const payload = {
    //         address: formData.address,
    //         city: formData.city,
    //         state: formData.state,
    //         country: formData.country,
    //         pinCode: formData.pinCode,
    //         product: selectedProduct._id, // Send the product ID
    //         quantity: formData.quantity,
    //         shippingCharges: formData.shippingCharges,
    //         discount: formData.discount,
    //         subtotal: formData.subtotal,
    //         total: formData.total,
    //         user: selectedAdmin, // Send the selected user ID
    //       };
    //       const response = await fetch(
    //         `${process.env.REACT_APP_BASE_URL}/order/new`,
    //         {
    //           method: "POST",
    //           headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Bearer ${token}`,
    //           },
    //           body: JSON.stringify(payload),
    //         }
    //       );
    //       if (!response.ok) {
    //         throw new Error("Failed to create order");
    //       }
    //       toast.success("Order created successfully");
    //       handleClose();
    //       fetchData(); // Refresh order data
    //     } catch (error) {
    //       console.error("Error creating order:", error);
    //       toast.error("Failed to create order");
    //     }
    //   };

    const calculateRewardMoney = (referralCoins) => {
        return referralCoins.reduce((sum, coin) => {
            return coin.amount < 50 ? sum + coin.amount : sum;
        }, 0);
    };

    const totalRewardMoney = allStaff.reduce((sum, staff) => {
        return sum + (staff.rewardMoney || 0);
    }, 0);


    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Withdrawal for staff</DialogTitle>
            <DialogContent>
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
                                        {/* ₹{totalPaid || 0} */} 500 ₹
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
                                        {/* ₹{pendingAmount} */} 400 ₹
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        {/* <Grid item xs={4}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleClickOpen}
                            >
                                Withdraw
                            </Button>
                        </Grid> */}
                    </Grid>

                    {/* ToggleButtonGroup and Views */}
                    <ToggleButtonGroup
                        value={view}
                        exclusive
                        onChange={handleViewChange}
                        aria-label="view toggle"
                        sx={{ marginTop: 2, marginBottom: 2 }}
                    >
                        <ToggleButton value="transactions" aria-label="products view">
                            Staff with Transactions
                        </ToggleButton>
                        <ToggleButton value="allTransactions" aria-label="orders view">
                            Staff with All Transactions
                        </ToggleButton>
                        {/* <ToggleButton
                            value="transactions"
                            aria-label="transactions view"
                        >
                            Transactions
                        </ToggleButton> */}
                    </ToggleButtonGroup>

                    {/* Render view based on selected view */}
                    {view === "transactions" && (
                        <>
                            <Typography variant="h6">Staff with Transactions</Typography>
                            {allStaff && allStaff.length > 0 ? (
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
                                            {allStaff.map((staff) => (
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
                    {view === "allTransactions" && (
                        <>
                            <Typography variant="h6">Staff with All Transactions:</Typography>
                            {allStaff && allStaff.length > 0 ? (
                                <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Transaction ID</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Referral Coin Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {allStaff.map((staff) => (
                                                <React.Fragment key={staff._id}>
                                                    {staff.referralCoins
                                                        .filter(coin => coin.amount < 50)
                                                        .map((coin, index) => (
                                                            <TableRow key={`${staff._id}-${index}`}>
                                                                <TableCell>{staff._id}</TableCell>
                                                                <TableCell>{staff.name}</TableCell>
                                                                <TableCell>{coin.amount}</TableCell>
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


                    {/* {view === "transactions" && (
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
                    )} */}
                </Box>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AllWithdrawalPopup;
