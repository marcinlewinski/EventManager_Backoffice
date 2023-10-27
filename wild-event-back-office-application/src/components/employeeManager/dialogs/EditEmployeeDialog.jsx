import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, TextField, FormHelperText } from '@mui/material';
import dialogValidationSchema from './validationSchema';
import { useEmployees } from '../../../services/EmployeeProvider';

const EditEmployeeDialog = ({ open, handleClose, allRoles, allLocations, userToEdit }) => {
    const { updateEmployee } = useEmployees();
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            roleIds: [],
            locationIds: [],
        },
        validationSchema: dialogValidationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            setIsLoading(!isLoading);
            console.log(values)
            await updateEmployee(userToEdit.id, values);
            handleClose(false, values);
        },
    });

    useEffect(() => {
        if (userToEdit) {
            const roleIds = userToEdit.roles.map(role =>
                allRoles.find(r => r.name === role)?.id || ''
            );
            const locationIds = userToEdit.locations.map(location =>
                allLocations.find(l => l.title === location)?.id || ''
            );
            formik.setValues({
                ...userToEdit,
                roleIds,
                locationIds,
            });
        }
    }, [userToEdit]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit selected employee</DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        label="Name and Surname"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        {...formik.getFieldProps('name')}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        {...formik.getFieldProps('email')}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        label="Phone"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        {...formik.getFieldProps('phone')}
                        onBlur={formik.handleBlur}
                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                        helperText={formik.touched.phone && formik.errors.phone}
                    />
                    <FormControl fullWidth margin="normal" variant="outlined" error={formik.touched.roleIds && Boolean(formik.errors.roleIds)}>
                        <InputLabel>Roles</InputLabel>
                        <Select
                            label="Roles"
                            multiple
                            name="roleIds"
                            {...formik.getFieldProps('roleIds')}
                            onBlur={formik.handleBlur}
                        >
                            {allRoles?.map((role) => (
                                <MenuItem key={role.id} value={role.id}>
                                    {role.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {formik.touched.roleIds && <FormHelperText>{formik.errors.roleIds}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth margin="normal" variant="outlined" error={formik.touched.locationIds && Boolean(formik.errors.locationIds)}>
                        <InputLabel>Locations</InputLabel>
                        <Select
                            label="Locations"
                            multiple
                            name="locationIds"
                            {...formik.getFieldProps('locationIds')}
                            onBlur={formik.handleBlur}
                        >
                            {allLocations?.map((location) => (
                                <MenuItem key={location.id} value={location.id}>
                                    {location.title}
                                </MenuItem>
                            ))}
                        </Select>
                        {formik.touched.locationIds && <FormHelperText>{formik.errors.locationIds}</FormHelperText>}
                    </FormControl>
                    <DialogActions>
                        <Button onClick={() => handleClose(true, null)} color="primary">
                            Cancel
                        </Button>
                        <Button disabled={isLoading} type="submit" color="primary">
                            Edit
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditEmployeeDialog;
