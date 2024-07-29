import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import InputField from "../../Component/InputField";
// import 'dayjs/locale/en';


const WithdrawalPopup = ({ open, handleClose, id, fetchStaff, title, fetchAdminDetails }) => {
    const [cookies, setCookie] = useCookies(["token"]);
    const [value, setValue] = useState(dayjs('14-04-2022'));
    const [loading, setLoading] = useState(false)
    const [formErrors, setFormErrors] = useState({});
    const [withdrawalInfo, setWithdrawalInfo] = useState({
        transactionType: "",
        transactionId: "",
        baseAmount: "",
        totalAmount: "",
        tdsDeducted: "",
        tdsCertificate: null,
        date: ""
    });

    if (withdrawalInfo) console.log(withdrawalInfo, "staffIDD");


    const handleChange = (e) => {
        setWithdrawalInfo({ ...withdrawalInfo, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setWithdrawalInfo({ ...withdrawalInfo, tdsCertificate: e.target.files[0] });
    };

    const handleDateChange = (newValue) => {
        setValue(newValue);
        setWithdrawalInfo((prevInfo) => ({
            ...prevInfo,
            date: newValue.format('DD-MM-YYYY'),
        }));
    };


    const handleSubmit = async () => {
        setLoading(true)
        try {
            const token = cookies.token;
            const formData = new FormData();
            formData.append('transactionType', withdrawalInfo.transactionType);
            formData.append('transactionId', withdrawalInfo.transactionId);
            formData.append('baseAmount', withdrawalInfo.baseAmount);
            formData.append('totalAmount', withdrawalInfo.totalAmount);
            formData.append('tdsDeducted', withdrawalInfo.tdsDeducted);
            formData.append('date', withdrawalInfo.date);
            if (withdrawalInfo.tdsCertificate) {
                formData.append('tdsCertificate', withdrawalInfo.tdsCertificate);
            }

            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/admin/updateWithdrawalInfo/user/${id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            if (response.ok) {
                setLoading(false)
                toast.success("Staff details updated successfully");
                fetchStaff()
                handleClose();
                setWithdrawalInfo({
                    transactionType: "",
                    transactionId: "",
                    baseAmount: "",
                    totalAmount: "",
                    tdsDeducted: "",
                    tdsCertificate: null,
                });
            }
            // fetchAdminDetails()


        } catch (error) {
            console.error("Error updating staff details:", error);
            toast.error("Failed to update staff details");
            setWithdrawalInfo({
                transactionType: "",
                transactionId: "",
                baseAmount: "",
                totalAmount: "",
                tdsDeducted: "",
                tdsCertificate: null,
                date: "",
            });
        }
    };

    const validatePrice = (value) => {
        // Check if the value contains only digits and at most one decimal point
        const isValidFormat = /^[0-9]*\.?[0-9]+$/.test(value);

        if (!isValidFormat) {
            return 'Invalid amount format';
        }

        const floatValue = parseFloat(value);

        // Check if the value is a valid positive number
        if (isNaN(floatValue) || floatValue <= 0) {
            return 'Invalid amount';
        }

        return null;
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>{title}</DialogTitle>
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
                    sx={{ marginBottom: 3 }}
                />


                {/* <Typography >Total Amount</Typography> */}
                <InputField
                    type="number"
                    label="Total Amount"
                    variant="outlined"
                    margin="normal"
                    name="totalAmount"
                    value={withdrawalInfo.totalAmount}
                    onChange={(value) => {
                        setWithdrawalInfo({ ...withdrawalInfo, totalAmount: value })
                        setFormErrors({ ...formErrors, totalAmount: validatePrice(value) });
                    }}
                    validate={validatePrice} />

                <Typography >Base Amount</Typography>
                <InputField
                    type="number"
                    value={withdrawalInfo.baseAmount}
                    onChange={(value) => {
                        setWithdrawalInfo({ ...withdrawalInfo, baseAmount: value })
                        setFormErrors({ ...formErrors, baseAmount: validatePrice(value) });
                    }}
                    validate={validatePrice}
                    label="Amount"
                    variant="outlined"
                    width="50%"
                    margin="normal"
                    name="baseAmount"
                />

                <Typography >TDS Deducted</Typography>
                <InputField
                    type="number"
                    value={withdrawalInfo.tdsDeducted}
                    onChange={(value) => {
                        setWithdrawalInfo({ ...withdrawalInfo, tdsDeducted: value })
                        setFormErrors({ ...formErrors, tdsDeducted: validatePrice(value) });
                    }}
                    validate={validatePrice}
                    label="TDS Amount"
                    variant="outlined"
                    width="50%"
                    margin="normal"
                    name="tdsDeducted"
                />

                {/* <Typography sx={{ marginTop: 1 }}>Date </Typography> */}
                <Box sx={{ display: "flex", gap: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker', 'DatePicker']}>
                            <DatePicker
                                label="Pick a Date"
                                value={value}
                                onChange={handleDateChange}
                                format="DD-MM-YYYY"
                            />
                        </DemoContainer>
                    </LocalizationProvider>

                </Box>


                <Typography sx={{ marginTop: 1 }}>TDS Certificate</Typography>
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                />

                <Box sx={{ marginTop: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
                    <Button onClick={handleClose} variant="outlined">Cancel</Button>
                    {/* {loading === true ? <CircularProgress /> : <Button onClick={handleSubmit} variant="contained">Add</Button>} */}

                    {loading ? <CircularProgress /> : Object.values(formErrors).some((error) => Boolean(error)) ? null : (<Button onClick={handleSubmit} variant="contained">Add</Button>)}
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
