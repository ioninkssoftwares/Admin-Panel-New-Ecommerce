import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";


const WithdrawalPopup = ({ open, handleClose, products }) => {

    const [withdrawalInfo, setWithdrawalInfo] = useState({
        type: "",
        transactionId: "",
        baseAmount: "",
        totalAmount: "",
        tdsAmount: "",
    });

    const handleChange = (event) => {
        setWithdrawalInfo({ ...withdrawalInfo, type: event.target.value });
    };


    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Withdrawal for staff</DialogTitle>
            <DialogContent>
                <Typography>
                    Withdrawal Information
                </Typography>

                <Box sx={{ minWidth: 120, marginY: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Transaction Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={withdrawalInfo.type}
                            label="Transaction Type"
                            onChange={handleChange}
                        >
                            <MenuItem value="upi">UPI</MenuItem>
                            <MenuItem value="cash">CASH</MenuItem>
                            <MenuItem value="netBanking">NET BANKING</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <TextField
                    type="text"
                    value={withdrawalInfo.transactionId}
                    onChange={(e) => setWithdrawalInfo({ ...withdrawalInfo, transactionId: e.target.value })}
                    label="Transaction Id"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />

                <Typography sx={{ marginTop: 2 }}>Base Amount</Typography>
                <TextField
                    type="text"
                    value={withdrawalInfo.baseAmount}
                    onChange={(e) => setWithdrawalInfo({ ...withdrawalInfo, baseAmount: e.target.value })}
                    label="Amount"
                    variant="outlined"
                    sx={{ width: "50%" }}
                    margin="normal"
                />

                <Typography sx={{ marginTop: 2 }}>TDS Deducted</Typography>
                <TextField
                    type="text"
                    value={withdrawalInfo.tdsAmount}
                    onChange={(e) => setWithdrawalInfo({ ...withdrawalInfo, tdsAmount: e.target.value })}
                    label="TDS Amount"
                    variant="outlined"
                    sx={{ width: "50%" }}
                    margin="normal"
                />

                <Typography sx={{ marginTop: 2 }}>TDS Certificate</Typography>
                <TextField
                    type="text"
                    value={withdrawalInfo.tdsAmount}
                    // onChange={(e) => setWithdrawalInfo({ ...withdrawalInfo, tdsAmount: e.target.value })}
                    label="TDS Certificate"
                    variant="outlined"
                    sx={{ width: "50%" }}
                    margin="normal"
                />

                <Box sx={{ marginTop: 2, display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
                    <Button variant="outlined">Cancel</Button>
                    <Button variant="contained">Add</Button>
                </Box>
            </DialogContent>
            {/* <DialogActions>
                <Button onClick={handleClose} color="primary" variant="contained">
                    Close
                </Button>
            </DialogActions> */}
        </Dialog>
    );
};

export default WithdrawalPopup;
