import { TextField, type TextFieldProps } from '@mui/material';
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from 'react-hook-form';

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
}

// Combine our props with MUI TextField props
export const FormInput = <T extends FieldValues>({
  name,
  control,
  label,
  ...textFieldProps
}: FormInputProps<T> & Omit<TextFieldProps, 'name' | 'label'>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          {...textFieldProps}
          label={label}
          value={value ?? ''}
          onChange={onChange}
          error={!!error}
          helperText={error ? error.message : textFieldProps.helperText}
          fullWidth
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              transition: 'all 0.2s',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            },
            ...textFieldProps.sx,
          }}
        />
      )}
    />
  );
};
