import { Typography, type TypographyProps } from '@mui/material';

interface PreviewText extends TypographyProps {
  text?: string;
  limit?: number;
  label?: string;
  to?: string;
}

export const PreviewText = ({
  text = '',
  limit = 50,
  label,
  ...props
}: PreviewText) => {
  const display = text.length > limit ? `${text.slice(0, limit)}…` : text;
  console.log(display);
  return (
    <Typography {...props}>
      {label && <strong>{label}: </strong>}
      {display || ''}
    </Typography>
  );
};
