// src/components/Button.tsx
import { Button as MantineButton, ButtonProps } from '@mantine/core';
import React from 'react';

// Re-exporting the Mantine Button under a local name to fit the existing architecture.
// This wrapper can be used for future app-specific customizations.
const Button: React.FC<ButtonProps & { component?: any; to?: string; }> = (props) => {
  return <MantineButton {...props} />;
};

export default Button;
