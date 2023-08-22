import React from "react";
import { FormGroup, FormControl, InputLabel, Input, Button, Autocomplete, TextField, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import { addEvent } from "../../../services/EventService"
import { getLocations } from "../../../services/LocationService"



const EventForm = () => {
    const START_AT = 'start';
    const ENDS_AT = 'end';
    const navigate = useNavigate();

    const [locationDB, setLocationDB] = useState([]);
    const getAllLocations = async () => {
        try {
            const data = await getLocations();
            setLocationDB(
                data.map(locationDataFromDB => ({
                    id: locationDataFromDB.id,
                    title: locationDataFromDB.title,
                })));
        } catch (error) {
            console.error("Error fetching events", error);
            setLocationDB([]);
        }
    }
    console.log(locationDB)
    useEffect(() => {
        getAllLocations();
    }, []);


    const userOptions = [
        "User1",
        "User2",
        "User3",
        "User4",
    ];
    const [eventData, setEventData] = useState({
        title: "",
        description: "",
        start: dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]'),
        end: dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]'),
        location: "",
        organizer: [],
        avaiable: false
    });

    const handleDateChange = (newValue, flag) => {
        const formattedValue = newValue.format("YYYY-MM-DDTHH:mm:ssZ[Z]");
        setEventData((prevData) => ({
            ...prevData,
            [flag === START_AT ? "start" : "end"]: formattedValue,
        }));
    };

    console.log(eventData)
    const handleSubmit = (event) => {
        event.preventDefault();

        if (eventData.start < eventData.end) {
            const newEvent = {
                title: eventData.title,
                start: eventData.start,
                end: eventData.end
            };
            addEvent(eventData);

            navigate("/calendar", { selected: newEvent });
        } else {
            alert("Invalid dates. Make sure the start date is earlier than the end date.");
        }
    }

    return (
        <Box>
            <FormGroup
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    margin: "5% auto",
                    gap: '0.9em',
                    height: '70vh',
                    width: '50%',
                    padding: '2rem',
                    boxShadow: '0px 0px 10px rgba(0,0,0,0.5)'
                }}
            >
                <FormControl>
                    <InputLabel>Event title</InputLabel>
                    <Input onChange={(event) => setEventData((prevData) => ({
                        ...prevData,
                        title: event.target.value
                    }))} />
                </FormControl>
                <FormControl>
                    <InputLabel>Description</InputLabel>
                    <Input
                        multiline rows={3}
                        onChange={(event) => setEventData((prevData) => ({
                            ...prevData,
                            description: event.target.value
                        }))} />
                </FormControl>
                <FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="Start at"
                            value={eventData.start}
                            onChange={(newValue) => handleDateChange(newValue, START_AT)} />
                    </LocalizationProvider>
                </FormControl>
                <FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="Ends at"
                            value={eventData.end}
                            onChange={(newValue) => handleDateChange(newValue, ENDS_AT)} />
                    </LocalizationProvider>
                </FormControl>
                <FormControl>
                    <Autocomplete
                        disablePortal
                        options={locationDB}
                        getOptionLabel={(option) => option.title}
                        renderInput={(params) => <TextField {...params} label="Locations" />}
                        onChange={(event, value) => setEventData((prevData) => ({
                            ...prevData,
                            location: value.id
                        }))}
                    />
                </FormControl>
                <FormControl>
                    <InputLabel>Select Users</InputLabel>
                    <Select
                        multiple
                        value={eventData.organizer}
                        onChange={(event) => setEventData((prevData) => ({
                            ...prevData,
                            organizer: event.target.value
                        }))}
                        renderValue={(selected) => selected.join(", ")}
                    >
                        {userOptions.map((user, index) => (
                            <MenuItem key={index} value={user}>
                                {user}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl >
                    <FormControlLabel control={<Checkbox onChange={(event) => setEventData((prevData) => ({
                        ...prevData,
                        avaiable: !eventData.avaiable
                    }))} />} label="available for everyone " />
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleSubmit} type="submit">
                    Submit
                </Button>
                <Button onClick={() => navigate('/calendar')} variant="contained" color="primary">
                    Cancel
                </Button>
            </FormGroup>
        </Box>
    );
};

export default EventForm;