// src/components/Input.tsx
import { TextInput as MantineTextInput, TextInputProps } from '@mantine/core';
import React from 'react';

// We create a wrapper around the Mantine component to match the existing app structure
// and allow for any future customizations.
const Input: React.FC<TextInputProps> = (props) => {
  return <MantineTextInput {...props} />;
};

export default Input;
