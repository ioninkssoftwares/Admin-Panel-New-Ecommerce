import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";


const WithdrawalPopup = ({ open, handleClose, staffId }) => {
    const [cookies, setCookie] = useCookies(["token"]);
    const [withdrawalInfo, setWithdrawalInfo] = useState({
        transactionType: "",
        transactionId: "",
        baseAmount: "",
        totalAmount: "",
        tdsDeducted: "",
        tdsCertificate: null,
    });

    if (staffId) console.log(staffId, "staffIDD");


    const handleChange = (e) => {
        setWithdrawalInfo({ ...withdrawalInfo, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setWithdrawalInfo({ ...withdrawalInfo, tdsCertificate: e.target.files[0] });
    };


    const handleSubmit = async () => {
        try {
            const token = cookies.token;
            const formData = new FormData();
            formData.append('transactionType', withdrawalInfo.transactionType);
            formData.append('transactionId', withdrawalInfo.transactionId);
            formData.append('baseAmount', withdrawalInfo.baseAmount);
            formData.append('totalAmount', withdrawalInfo.totalAmount);
            formData.append('tdsDeducted', withdrawalInfo.tdsDeducted);
            if (withdrawalInfo.tdsCertificate) {
                formData.append('tdsCertificate', withdrawalInfo.tdsCertificate);
            }

            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/admin/staff/updateDetails/${staffId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update staff details");
            }

            toast.success("Staff details updated successfully");
            handleClose();
        } catch (error) {
            console.error("Error updating staff details:", error);
            toast.error("Failed to update staff details");
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Withdrawal for staff</DialogTitle>
            <DialogContent>
                <Typography>
                    Withdrawal Information
                </Typography>

                <Box sx={{ minWidth: 120, marginY: 1 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Transaction Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={withdrawalInfo.transactionType}
                            label="Transaction Type"
                            onChange={handleChange}
                            name="transactionType"
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
                    name="transactionId"
                />

                <Typography sx={{ marginTop: 1 }}>Base Amount</Typography>
                <TextField
                    type="text"
                    value={withdrawalInfo.baseAmount}
                    onChange={(e) => setWithdrawalInfo({ ...withdrawalInfo, baseAmount: e.target.value })}
                    label="Amount"
                    variant="outlined"
                    sx={{ width: "50%" }}
                    margin="normal"
                    name="baseAmount"
                />

                <Typography sx={{ marginTop: 1 }}>Total Amount</Typography>
                <TextField
                    type="text"
                    value={withdrawalInfo.totalAmount}
                    onChange={(e) => setWithdrawalInfo({ ...withdrawalInfo, totalAmount: e.target.value })}
                    label="Total Amount"
                    variant="outlined"
                    sx={{ width: "50%" }}
                    margin="normal"
                    name="totalAmount"
                />

                <Typography sx={{ marginTop: 1 }}>TDS Deducted</Typography>
                <TextField
                    type="text"
                    value={withdrawalInfo.tdsDeducted}
                    onChange={(e) => setWithdrawalInfo({ ...withdrawalInfo, tdsDeducted: e.target.value })}
                    label="TDS Amount"
                    variant="outlined"
                    sx={{ width: "50%" }}
                    margin="normal"
                    name="tdsDeducted"
                />

                <Typography sx={{ marginTop: 1 }}>TDS Certificate</Typography>
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                />

                <Box sx={{ marginTop: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
                    <Button onClick={handleClose} variant="outlined">Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">Add</Button>
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
