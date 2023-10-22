import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, TextField, Typography } from '@mui/material';
import { registerUser } from '../../../services/EmployeeManagement';
import { useUser } from '../../../services/useUser';
import addEmployeeValidationSchema from './validationSchemas'; 

const AddEmployeeDialog = ({ open, handleClose, allRoles, allLocations }) => {
  const { user, token } = useUser();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      roleIds: [],
      locationIds: []
    },
    addEmployeeValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await registerUser(values);
        console.log("User registered");
        console.log("User context:", { user, token });
        handleClose(false, values);
        resetForm();
      } catch (error) {
        console.error("Error during registration:", error);
      }
    }
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Add New Employee
        </Typography>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Name and Surname"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            margin="normal"
            variant="outlined"
          />
          <FormControl fullWidth margin="normal" variant="outlined" error={formik.touched.roleIds && Boolean(formik.errors.roleIds)}>
            <InputLabel>Roles</InputLabel>
            <Select
              multiple
              name="roleIds"
              value={formik.values.roleIds}
              onChange={formik.handleChange}
            >
              {allRoles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{formik.touched.roleIds && formik.errors.roleIds}</FormHelperText>
          </FormControl>
          <FormControl fullWidth margin="normal" variant="outlined" error={formik.touched.locationIds && Boolean(formik.errors.locationIds)}>
            <InputLabel>Locations</InputLabel>
            <Select
              multiple
              name="locationIds"
              value={formik.values.locationIds}
              onChange={formik.handleChange}
            >
              {allLocations.map((location) => (
                <MenuItem key={location.id} value={location.id}>
                  {location.title}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{formik.touched.locationIds && formik.errors.locationIds}</FormHelperText>
          </FormControl>
          <DialogActions>
            <Button onClick={() => { handleClose(true, null); formik.resetForm(); }} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddEmployeeDialog;
