import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import Select from "react-select";
import { FormControl, FormHelperText } from "@mui/material";

const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#fff",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#fff",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#4caf50" : "#fff",
    color: state.isSelected ? "#fff" : "#000",
    "&:hover": {
      backgroundColor: state.isSelected ? "#388e3c" : "#f5f5f5",
      color: state.isSelected ? "#fff" : "#000",
    },
  }),
  multivalue: (provided) => ({
    ...provided,
    backgroundColor: "#4caf50",
    color: "#fff",
  }),
  multivalueLabel: (provided) => ({
    ...provided,
    color: "#fff",
  }),
  multivalueRemove: (provided) => ({
    ...provided,
    color: "#fff",
    ":hover": {
      backgroundColor: "#388e3c",
      color: "#fff",
    },
  }),
};
function FFillAndSelect({ name, options, ...other }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullwidth error={!!error}>
          <Select
            {...field}
            {...other}
            isMulti
            options={options}
            styles={customStyles}
            onChange={(selected) =>
              field.onChange(
                selected ? selected.map((option) => option.value) : []
              )
            }
            onBlur={field.onBlur}
            value={options.filter((option) =>
              field.value.includes(option.value)
            )}
          />
          <FormHelperText>{error ? error.message : null}</FormHelperText>
        </FormControl>
      )}
    />
  );
}

export default FFillAndSelect;
