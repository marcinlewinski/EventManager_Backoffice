import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, Button, TextField, Grid, Box, DialogContent } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { submitLocation } from '../../../services/LocationService';
import MapForm from '../map/MapForm';
import { useUser } from "../../../services/useUser";
import { useFormik, } from 'formik';
import locationBasicSchema from '../validationSchema/locationBasicSchema';



const LocationDialog = ({ mapLocations, open, location, handleClose, closeModal }) => {
    const { token } = useUser();
    const [coordinate, setCoordinate] = useState({
        latitude: mapLocations.coordinate.latitude,
        longitude: mapLocations.coordinate.longitude
    });

    const formik = useFormik({
        initialValues: {
            id: null,
            title: "",
            description: "",
            longitude: 0.0,
            latitude: 0.0

        },
        validationSchema: locationBasicSchema,
        onSubmit: async (values) => {
            await submitLocation(token, values);
            await handleClose();
            formik.resetForm()
        },
    });

    useEffect(() => {
        formik.setFieldValue("longitude", coordinate.longitude);
        formik.setFieldValue("latitude", coordinate.latitude)
    }, [coordinate])

    useEffect(() => {
        formik.resetForm();
        if (location) {
            formik.setFieldValue("id", location.id);
            formik.setFieldValue("title", location.title);
            formik.setFieldValue("description", location.description);
            formik.setFieldValue("longitude", location.longitude);
            formik.setFieldValue("latitude", location.latitude);
        } else {
            formik.setFieldValue("id", null);
            formik.setFieldValue("title", "");
            formik.setFieldValue("description", "");
            formik.setFieldValue("longitude", mapLocations.coordinate.longitude);
            formik.setFieldValue("latitude", mapLocations.coordinate.latitude);
        }
    }, [open]);


    return (
        <Dialog fullWidth open={open} onClose={handleClose} style={{}}>
            <DialogTitle>{location ? "Location details" : "Add new location"}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <form onSubmit={formik.handleSubmit}>
                            <FormGroup >
                                <FormControl margin="normal">
                                    <TextField
                                        label="Title"
                                        variant="outlined"
                                        name="title"
                                        value={formik.values.title}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={!!formik.touched.title && !!formik.errors.title}
                                        helperText={formik.touched.title && formik.errors.title}
                                    />
                                </FormControl>
                                <FormControl margin="normal">
                                    <TextField
                                        label="Description"
                                        variant="outlined"
                                        multiline
                                        rows={4}
                                        name="description"
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={!!formik.touched.description && !!formik.errors.description}
                                        helperText={formik.touched.description && formik.errors.description}
                                    />
                                </FormControl>
                                <FormControl margin="normal">
                                    <TextField autoFocus
                                        label="Latitude"
                                        variant="outlined"
                                        type="number"
                                        name="latitude"
                                        value={formik.values.latitude}
                                        InputProps={{ readOnly: true }} />
                                </FormControl>
                                <FormControl margin="normal">
                                    <TextField autoFocus
                                        label="Longitude"
                                        variant="outlined"
                                        type="number"
                                        name="longitude"
                                        value={formik.values.longitude}
                                        InputProps={{ readOnly: true }} />
                                </FormControl>
                            </FormGroup>
                        </form>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{ width: '290px', height: '400px' }}>
                            <MapForm mapLocations={mapLocations} location={location} coordinate={coordinate} setCoordinate={(e) => setCoordinate(e)}></MapForm>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={closeModal} color="primary">
                    Cancel
                </Button>
                <Button onClick={formik.handleSubmit} type="submit" color="primary">
                    {location ? "Update" : "Create"}
                </Button>
            </DialogActions>

        </Dialog>
    );
};

export default LocationDialog;