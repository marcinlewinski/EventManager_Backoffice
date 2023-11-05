import React from "react"
import { FormGroup, FormControl, TextField } from '@mui/material';

export const LocationDialogFields = ({ formik }) => {
 
    return (
        <>
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
                            id="standard-multiline-flexible"
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
        </>
    )
}