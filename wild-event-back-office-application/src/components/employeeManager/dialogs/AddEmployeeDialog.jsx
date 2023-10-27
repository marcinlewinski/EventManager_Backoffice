import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, TextField, Typography } from '@mui/material';
import { registerUser } from '../../../services/EmployeeManagement';
import { useUser } from '../../../services/useUser';
import dialogValidationSchema from './validationSchema';
import CircularProgress from '@mui/material/CircularProgress';


const AddEmployeeDialog = ({ open, handleClose, allRoles, allLocations }) => {
  const { user, token } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      roleIds: [],
      locationIds: []
    },
    validationSchema: dialogValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsLoading(!isLoading);
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
  useEffect(() => {
    setIsLoading(false);
  }, [open])
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
            onBlur={formik.handleBlur}
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
            onBlur={formik.handleBlur}
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
            onBlur={formik.handleBlur}
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
              onBlur={formik.handleBlur}
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
              onBlur={formik.handleBlur}
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
            <Button disabled={isLoading} type="submit" color="primary">
              {user && isLoading ? (
                <CircularProgress
                  sx={{
                    color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                    position: 'absolute',
                  }}
                  size={20}
                  thickness={4}
                />
              ) : (
                "Add"
              )}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddEmployeeDialog;
