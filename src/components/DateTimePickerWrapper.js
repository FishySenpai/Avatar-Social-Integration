import React from 'react';
import { TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';

const DateTimePickerWrapper = ({ value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        value={value}
        onChange={onChange}
        slotProps={{
          textField: {
            fullWidth: true
          }
        }}
      />
    </LocalizationProvider>
  );
};

export default DateTimePickerWrapper; 