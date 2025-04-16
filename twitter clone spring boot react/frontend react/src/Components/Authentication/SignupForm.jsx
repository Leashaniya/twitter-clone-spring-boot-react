import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { registerUser } from "../../Store/Auth/Action";

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  dateOfBirth: Yup.object().shape({
    day: Yup.string().required("Day is required"),
    month: Yup.string().required("Month is required"),
    year: Yup.string().required("Year is required"),
  }),
});

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

const SignupForm = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      dateOfBirth: {
        day: "",
        month: "",
        year: "",
      },
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError(null);
        setLoading(true);
        const { day, month, year } = values.dateOfBirth;
        const dateOfBirth = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const userData = {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          dateOfBirth,
        };
        console.log("Submitting user data:", userData);
        await dispatch(registerUser(userData));
      } catch (err) {
        setError(err.response?.data?.message || "Registration failed. Please try again.");
        console.error("Registration error:", err);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleDateChange = (name) => (event) => {
    formik.setFieldValue("dateOfBirth", {
      ...formik.values.dateOfBirth,
      [name]: event.target.value,
    });
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2 className="text-2xl font-bold mb-4 text-center">Create your account</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="fullName"
            label="Full Name"
            fullWidth
            variant="outlined"
            size="large"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            className="w-full"
            name="email"
            label="Email"
            fullWidth
            variant="outlined"
            size="large"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="password"
            label="Password"
            fullWidth
            variant="outlined"
            size="large"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel className="mb-2">Date of Birth</InputLabel>
        </Grid>
        <Grid item xs={4}>
          <Select
            name="day"
            value={formik.values.dateOfBirth.day}
            onChange={handleDateChange("day")}
            onBlur={formik.handleBlur}
            error={
              formik.touched.dateOfBirth?.day && Boolean(formik.errors.dateOfBirth?.day)
            }
            className="w-full"
            displayEmpty
            disabled={loading}
          >
            <MenuItem value="" disabled>Day</MenuItem>
            {days.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={4}>
          <Select
            name="month"
            value={formik.values.dateOfBirth.month}
            onChange={handleDateChange("month")}
            onBlur={formik.handleBlur}
            error={
              formik.touched.dateOfBirth?.month && Boolean(formik.errors.dateOfBirth?.month)
            }
            className="w-full"
            displayEmpty
            disabled={loading}
          >
            <MenuItem value="" disabled>Month</MenuItem>
            {months.map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={4}>
          <Select
            name="year"
            value={formik.values.dateOfBirth.year}
            onChange={handleDateChange("year")}
            onBlur={formik.handleBlur}
            error={
              formik.touched.dateOfBirth?.year && Boolean(formik.errors.dateOfBirth?.year)
            }
            className="w-full"
            displayEmpty
            disabled={loading}
          >
            <MenuItem value="" disabled>Year</MenuItem>
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12}>
          {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
            <div className="text-red-500">Please select a valid date of birth</div>
          )}
        </Grid>
        <Grid className="mt-5" item xs={12}>
          <Button
            type="submit"
            sx={{
              width: "100%",
              borderRadius: "29px",
              py: "15px",
              bgcolor: "#1d9bf0",
            }}
            variant="contained"
            size="large"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign up"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default SignupForm;
