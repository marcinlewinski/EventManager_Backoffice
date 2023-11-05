import React from 'react';
import {
    FormGroup,
    FormControl,
    InputLabel,
    TextField,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    FormHelperText
} from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider, DateTimePicker, } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export const EventFormFields = ({
    STARTS_AT,
    ENDS_AT,
    pickedEvent,
    getNameFromId,
    formik,
    handleInputChange,
    handleDateChange,
    locationDB,
    userDB }) => {
        
    const today = dayjs();
    const tomorrow = dayjs().add(1, 'day');

    return (
        <>
          
                <FormGroup onSubmit={formik.handleSubmit}>
                    <FormControl margin="normal">
                        <TextField
                            label="Event title"
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
                            name="description"
                            value={formik.values.description}
                            multiline
                            rows={3}
                            onChange={handleInputChange}
                            onBlur={formik.handleBlur}
                            error={!!formik.touched.description && !!formik.errors.description}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                    </FormControl>
                    <FormControl margin="normal">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                minDate={today}
                                disablePast={true}
                                slotProps={{
                                    textField: {
                                        helperText: formik.errors.dateRange?.startsAt
                                    },
                                }}
                                spacing={0.5}
                                defaultValue={
                                    formik.values.dateRange?.startsAt
                                }
                                name="dateRange.startsAt"
                                className='dateRange.startsAt'
                                label="Starts At"
                                value={dayjs(formik.values.dateRange.startsAt)}
                                onChange={(newValue) => handleDateChange(newValue, STARTS_AT)}
                                onBlur={formik.handleBlur}
                                error={!!formik.touched.dateRange?.startsAt && !!formik.errors.dateRange?.startsAt}
                            />
                        </LocalizationProvider>
                    </FormControl>
                    <FormControl margin="normal">
                        <LocalizationProvider name="dateRange.endsAt" dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Ends At"
                                name="dateRange.endsAt"
                                className='dateRange.endsAt'
                                slotProps={{
                                    textField: {
                                        helperText: formik.errors.dateRange?.endsAt
                                    },
                                }}
                                disablePast={true}
                                minDate={tomorrow}
                                defaultValue={
                                    pickedEvent.end.trim() !== ''
                                        ? dayjs(pickedEvent.end)
                                        : dayjs(pickedEvent.start).add(1, 'day')
                                }
                                value={dayjs(formik.values.dateRange.endsAt)}
                                onChange={(newValue) => handleDateChange(newValue, ENDS_AT)}
                                onBlur={formik.handleBlur}
                                error={!!formik.touched.dateRange?.endsAt && !!formik.errors.dateRange?.endsAt}
                            />
                        </LocalizationProvider>
                    </FormControl>
                    <FormControl margin="normal">
                        <InputLabel>Locations</InputLabel>
                        <Select
                            label="Locations"
                            value={formik.values.locationId || ''}
                            name="locationId"
                            onChange={handleInputChange}
                            onBlur={formik.handleBlur}
                            error={!!formik.touched.locationId && !!formik.errors.locationId}
                        >
                            {locationDB && locationDB.map((location) => (
                                <MenuItem key={location.id} value={location.id}>
                                    {location.title}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{formik.touched.locationId && formik.errors.locationId}</FormHelperText>
                    </FormControl>
                    <FormControl margin="normal">
                        <InputLabel>Select Users</InputLabel>
                        <Select
                            label="Select Users"
                            multiple
                            value={formik.values.organizers}
                            name="organizers"
                            onChange={handleInputChange}
                            renderValue={getNameFromId}
                            onBlur={formik.handleBlur}
                            error={!!formik.touched.organizers && !!formik.errors.organizers}
                        >
                            {userDB.map((user, index) => (
                                <MenuItem key={index} value={user.id}>
                                    {user.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{formik.touched.organizers && formik.errors.organizers}</FormHelperText>
                    </FormControl>
                    <FormControl margin="normal">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={(event) =>
                                        formik.setFieldValue('openToPublic', !formik.values.openToPublic)
                                    }
                                />
                            }
                            label="Available for everyone?"
                        />
                    </FormControl>
                </FormGroup>
          
        </>
    )
}
