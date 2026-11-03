import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';

describe('Input Component', () => {
  test('renders input with label', () => {
    render(<Input label="Email" name="email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  test('renders input without label', () => {
    render(<Input name="email" placeholder="Enter email" />);
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  test('shows required asterisk when required', () => {
    render(<Input label="Email" name="email" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  test('calls onChange when input value changes', () => {
    const handleChange = jest.fn();
    render(<Input name="email" onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('displays error message when error prop is provided', () => {
    render(<Input name="email" error="Email is required" />);
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  test('applies error border style when error exists', () => {
    render(<Input name="email" error="Error message" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
  });

  test('applies normal border style when no error', () => {
    render(<Input name="email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-gray-300');
  });

  test('renders with placeholder', () => {
    render(<Input name="email" placeholder="Enter your email" />);
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  test('renders with initial value', () => {
    render(<Input name="email" value="test@example.com" onChange={jest.fn()} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('test@example.com');
  });

  test('disables input when disabled prop is true', () => {
    render(<Input name="email" disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  test('applies disabled styles when disabled', () => {
    render(<Input name="email" disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('disabled:bg-gray-100');
  });

  test('renders password type input', () => {
    render(<Input type="password" name="password" label="Password" />);
    const input = screen.getByLabelText(/password/i);
    expect(input).toHaveAttribute('type', 'password');
  });
  test('renders email type input', () => {
    render(<Input type="email" name="email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  test('renders text type by default', () => {
    render(<Input name="text" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');
  });

  test('applies custom className', () => {
    render(<Input name="email" className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  test('sets required attribute when required', () => {
    render(<Input name="email" required />);
    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });
});
