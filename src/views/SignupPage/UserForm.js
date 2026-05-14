import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Box
} from '@mui/material';

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    postalCode: '',
    phoneNumber: '',
    emailNotification: false,
    smsNotification: false,
  });

  const [errors, setErrors] = useState([]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    // validation
    if (formData.password !== formData.passwordConfirmation) {
      setErrors(['Passwords do not match.']);
      return;
    }

    if (formData.password.length < 8) {
      setErrors(['Password must be at least 8 characters.']);
      return;
    }

    const user = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phone_number: formData.phoneNumber || null,
      postal_code: formData.postalCode || null,
      email_notification: formData.emailNotification,
      sms_notification: formData.smsNotification,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_COMMONS_API}/api/auth/register`,
        user,
        { withCredentials: true }
      );

      // ✅ IMPORTANT: use AuthContext instead of props
      login(response.data);
      navigate("/signup-success");

    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);

      setErrors([
        error.response?.data?.error ||
        'Something went wrong. Please try again.'
      ]);
    }
  };

  return (
    <Box sx={{
      maxWidth: 400,
      mx: 'auto',
      mt: 4,
      p: 3,
      border: '1px solid #ddd',
      borderRadius: 2
    }}>
      <Typography variant="h4" align="center" gutterBottom>
        Sign Up
      </Typography>

      {errors.length > 0 && (
        <Box sx={{ color: 'red', mb: 2 }}>
          {errors.map((error, index) => (
            <Typography key={index} variant="body2">
              {error}
            </Typography>
          ))}
        </Box>
      )}

      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} margin="normal" required />

        <TextField fullWidth label="Username" name="username" value={formData.username} onChange={handleChange} margin="normal" required />

        <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} margin="normal" required />

        <TextField fullWidth label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} margin="normal" />

        <TextField fullWidth label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} margin="normal" />

        <TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} margin="normal" required />

        <TextField fullWidth label="Confirm Password" name="passwordConfirmation" type="password" value={formData.passwordConfirmation} onChange={handleChange} margin="normal" required />

        <FormControlLabel
          control={
            <Checkbox
              name="emailNotification"
              checked={formData.emailNotification}
              onChange={handleChange}
            />
          }
          label="Receive email notifications"
        />

        <FormControlLabel
          control={
            <Checkbox
              name="smsNotification"
              checked={formData.smsNotification}
              onChange={handleChange}
            />
          }
          label="Receive SMS notifications"
        />

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
          Register
        </Button>
      </form>
    </Box>
  );
};

export default UserForm;