
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

const InputField = ({ label, type, value, onChange, validate, width = '100%' }) => {
    const [error, setError] = useState(null);

    const handleValidation = (inputValue) => {
        const validationError = validate(inputValue);
        setError(validationError);
        return validationError;
    };

    return (
        <TextField
            sx={{ width, mb: 3 }}
            label={label}
            type={type}
            value={value}
            onChange={(e) => {
                onChange(e.target.value);
                handleValidation(e.target.value);
            }}
            error={Boolean(error)}
            helperText={error}
            required
        />
    );
};

export default InputField;
