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
import dayjs from 'dayjs';


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

    const totalPaidMoney = allStaff.reduce((sum, staff) => {
        const staffTotal = staff.withdrawalInfo.reduce((staffSum, withdrawal) => {
            return staffSum + (withdrawal.totalAmount || 0);
        }, 0);
        return sum + staffTotal;
    }, 0);

    const pendingAmount = totalRewardMoney - totalPaidMoney

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
                                        ₹{totalPaidMoney || 0}
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
                            Staff wise Transactions
                        </ToggleButton>
                        <ToggleButton value="allTransactions" aria-label="orders view">
                            Staff wise All Transactions
                        </ToggleButton>
                        <ToggleButton value="withdrawalTransactions" aria-label="transactions view">
                            Withdrawal List
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
                            <Typography variant="h6">Staff wise Transactions</Typography>
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
                            <Typography variant="h6">Staff wise All Transactions:</Typography>
                            {allStaff && allStaff.length > 0 ? (
                                <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Transaction ID</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Commission Earned </TableCell>
                                                <TableCell>Date</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {allStaff.map((staff) => (
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


                    {view === "withdrawalTransactions" && (
                        <>
                            <Typography variant="h6">Withdrawal Transactions List:</Typography>
                            {allStaff && allStaff.length > 0 ? (
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell> Id</TableCell>
                                                <TableCell> Type</TableCell>
                                                <TableCell>Total Amount</TableCell>
                                                <TableCell>TDS </TableCell>
                                                <TableCell>Base Amount</TableCell>
                                                <TableCell>TDS Certificate</TableCell>
                                                <TableCell>Date</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {allStaff.map((staff) => (
                                                staff.withdrawalInfo.map((withdrawal, index) => (
                                                    <TableRow key={`${staff._id}-${index}`}>
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
                                                        <TableCell>{dayjs(withdrawal.date).format('YYYY-MM-DD')}</TableCell>
                                                    </TableRow>
                                                ))
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
