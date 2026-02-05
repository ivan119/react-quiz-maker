import type { ReactNode } from 'react';
import {
  useForm,
  type UseFormReturn,
  type SubmitHandler,
  type FieldValues,
  type DefaultValues,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';

import { Box, type BoxProps } from '@mui/material';
interface FormProps<T extends FieldValues> {
  onSubmit: SubmitHandler<T>;
  schema?: ZodType<T, any, any>;
  children: ReactNode | ((methods: UseFormReturn<T>) => ReactNode);
  defaultValues?: DefaultValues<T>;
  useFormMethods?: UseFormReturn<T>;
  boxProps?: BoxProps;
}

export const Form = <T extends FieldValues>({
  onSubmit,
  schema,
  children,
  defaultValues,
  useFormMethods,
  boxProps,
}: FormProps<T>) => {
  const internalMethods = useForm<T>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
    mode: 'onTouched',
  });

  const methods = useFormMethods || internalMethods;

  return (
    <Box
      component="form"
      onSubmit={methods.handleSubmit(onSubmit)}
      noValidate
      {...boxProps}
    >
      {typeof children === 'function'
        ? (children as (methods: UseFormReturn<T>) => ReactNode)(methods)
        : children}
    </Box>
  );
};
