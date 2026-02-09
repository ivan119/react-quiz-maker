import {
  Button as MuiButton,
  type ButtonProps as MuiButtonProps,
  CircularProgress,
  IconButton as MuiIconButton,
  Tooltip,
} from '@mui/material';
import { type ReactNode, useRef } from 'react';

// Extend MUI Button props but make some more explicit/restricted if needed
// or just pass them through. User wants specific props.

export interface ButtonProps extends Omit<MuiButtonProps, 'title'> {
  /** The text to display inside the button */
  title?: string;
  /** Optional icon to display before the text */
  icon?: ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Tooltip text */
  tooltip?: string;
  /** Render as an icon-only button */
  isIconButton?: boolean;
}

export const Button = ({
  title,
  children,
  icon,
  isLoading,
  variant = 'contained',
  color = 'primary',
  disabled,
  startIcon,
  tooltip,
  isIconButton,
  onClick,
  ...props
}: ButtonProps) => {
  const isProcessingRef = useRef(false);

  const handleThrottledClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;
    onClick?.(event);

    // Allow clicking again after 500ms
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 500);
  };

  if (isIconButton) {
    const iconButtonNode = (
      <MuiIconButton
        color={color}
        disabled={disabled || isLoading}
        aria-label={props['aria-label'] || tooltip || title}
        onClick={handleThrottledClick}
        {...(props as any)}
      >
        {isLoading ? <CircularProgress size={20} color="inherit" /> : icon}
      </MuiIconButton>
    );

    return tooltip ? (
      <Tooltip title={tooltip}>{iconButtonNode}</Tooltip>
    ) : (
      iconButtonNode
    );
  }

  const buttonNode = (
    <MuiButton
      variant={variant}
      color={color}
      disabled={disabled || isLoading}
      onClick={handleThrottledClick}
      startIcon={
        !isIconButton &&
        (isLoading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          icon || startIcon
        ))
      }
      {...props}
    >
      {title || children}
    </MuiButton>
  );

  return tooltip ? <Tooltip title={tooltip}>{buttonNode}</Tooltip> : buttonNode;
};
