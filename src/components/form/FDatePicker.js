import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

function FDatePicker({ name, label, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          label={label}
          slots={{ textField: TextField }}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error ? error.message : null,
            },
          }}
          {...other}
        />
      )}
    />
  );
}

export default FDatePicker;
