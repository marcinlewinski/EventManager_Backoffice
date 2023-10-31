import { useState, useEffect, useRef, useContext } from "react"
import FullCallendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import interactionPlugin from "@fullcalendar/interaction"
import { Box, Container, Typography } from "@mui/material"
import {
    getAllEvents,
    deleteEvent,
    updateDateEvent,
} from "../../../services/api/EventService"
import dayjs from "dayjs"
import EventForm from "../newEventForm/EventForm"
import { getLocations } from "../../../services/api/LocationService"
import { getUsers } from "../../../services/api/UserService"
import Snackbar from "@mui/material/Snackbar"
import MuiAlert from "@mui/material/Alert"
import { useUser } from "../../../services/providers/LoggedUserProvider"
import { getAllMyEvents } from "../../../services/api/MyEventService"
import { useRoles } from "../../../services/providers/RolesProvider";
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';



const Calendar = ({ isMyCalendar, isMobileView }) => {
    const [snackbarInfo, setSnackbarInfo] = useState({
        open: false,
        message: "",
        severity: "success",
    })
    const { user, token } = useUser();
    const [userDB, setUserDB] = useState([]);
    const [events, setEvents] = useState(null);
    const [locationDB, setLocationDB] = useState([]);
    const [open, setOpen] = useState(false);
    const [isTimeGridWeek, setIsTimeGridWeek] = useState({});
    const [isUpdateEvent, setIsUpdateEvent] = useState(false);
    const [pickedEvent, setPickedEvent] = useState({
        id: "",
        title: "",
        start: "",
        end: "",
        locationId: {},
    });
    const [isLoading, setIsLoading] = useState(true);
    const { roles } = useRoles();
    const calendarRef = useRef(null);

    const isAdmin = () => {
        const allPossibleRoles = roles?.map(role => role.name);
        const userRolesArr = user.roles?.map(role => role.name);

        if (!roles || !userRolesArr) {
            return false;
        }
        return userRolesArr.every(role => allPossibleRoles.includes(role));
    }

    const getEvents = async () => {
        try {
            const data = isMyCalendar
                ? await getAllMyEvents(token)
                : await getAllEvents(token);
            console.log(data)
            setEvents(
                data.map(eventDataFromDB => {
                    const startDate = new Date(eventDataFromDB.startsAt);
                    const endDate = new Date(eventDataFromDB.endsAt);
                    const isSingleDay = isDatesDifferenceOneDay(startDate, endDate);
                    const formattedStart = isSingleDay
                        ? eventDataFromDB.startsAt.toString().split("T")[0]
                        : eventDataFromDB.startsAt;
                    const formattedEnd = isSingleDay ? null : endDate.toISOString();

                    return {
                        title: eventDataFromDB.title,
                        start: formattedStart,
                        end: formattedEnd,
                        id: eventDataFromDB.id,
                        description: eventDataFromDB.description,
                        location: eventDataFromDB.location,
                        organizers: eventDataFromDB.organizers,
                    }
                })
            );
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching events", error)
            setEvents([]);
        }
    }

    function isDatesDifferenceOneDay(date1, date2) {
        const oneDayMilliseconds = 24 * 60 * 60 * 1000;
        const differenceMilliseconds = Math.abs(date1 - date2);
        return differenceMilliseconds === oneDayMilliseconds;
    }

    const getAllLocations = async () => {
        try {
            const data = await getLocations(token)
            setLocationDB(
                data.map(locationDataFromDB => ({
                    id: locationDataFromDB.id,
                    title: locationDataFromDB.title,
                }))
            )
        } catch (error) {
            console.error("Error fetching locations", error)
            setLocationDB([])
        }
    }
    const getAllUsers = async () => {
        try {
            const data = await getUsers(token);
            setUserDB(
                data.map(userData => ({
                    id: userData.id,
                    name: userData.name,
                }))
            );
        } catch (error) {
            console.error("Error fetching users", error);
            setUserDB([]);
        }
    }
    useEffect(() => {
        setEvents(null);
        getEvents();
        getAllLocations();
        getAllUsers();
    }, []);

    const handleDateClick = selected => {
        setOpen(true);
        setIsUpdateEvent(false);
        setIsTimeGridWeek(selected.view.type === "timeGridWeek");
        setPickedEvent({
            id: "",
            title: "",
            start: selected.startStr,
            end: selected.endStr,
        });
    }
    const handleModalClose = () => {
        setIsUpdateEvent(false);
        setOpen(false);
        setPickedEvent({
            id: "",
            title: "",
            start: "",
            end: "",
            description: "",
            location: "",
            organizers: [],
            locationId: {},
        });
    }

    const isUUID = str => {
        const uuidRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
        return uuidRegex.test(str)
    }
    const handleEventClick = selected => {
        setOpen(true);
        setIsUpdateEvent(true);
        const event = events.find(event => event.id === selected.event.id);
        setPickedEvent({
            id: selected.event.id,
            title: selected.event.title,
            start: selected.event.startStr,
            end: selected.event.endStr,
            selected: selected,
            description: event.description,
            organizers: isUUID(event.organizers)
                ? event.organizers.map(organizerId => {
                    const user = userDB.find(user => user.id === organizerId)
                    return user ? user.name : null
                })
                : event.organizers,
            location: locationDB.find(
                location =>
                    location.title === event.location || location.id === event.location
            ),
            allDay: selected.event.allDay,
        });
    }

    const handleDeleteEvent = async dto => {
        try {
            const eventExistsInDatabase = events.some(event => event.id === dto.id);

            if (eventExistsInDatabase) {
                await deleteEvent(dto.id, token);
                setEvents(prevEvents => prevEvents.filter(event => event.id !== dto.id));
                dto.selected.event.remove();
                handleModalClose();
                setSnackbarInfo({
                    open: true,
                    message: `Event has been deleted`,
                    severity: "success",
                });
            } else {
                console.error("This event doesn't exist in the database.");
            }
        } catch (error) {
            console.error("An error occurred while deleting the event:", error);
        }
    }

    const changeDate = (id, newStart, newEnd) => {
        setEvents(prevEvents =>
            prevEvents.map(event =>
                event.id === id ? { ...event, start: newStart, end: newEnd } : event
            )
        );
    }

    const handleDateUpdate = info => {
        const id = info.event._def.publicId;
        const newStart = dayjs(info.event.startStr);
        let newEnd = dayjs(info.event.endStr);
        const formattedStart = newStart.format("YYYY-MM-DDTHH:mm:ss");

        if (!newEnd.isValid()) {
            const defaultEndEvent = newStart.add(1, "hour");
            newEnd = defaultEndEvent;
        }
        const dto = {
            id: id,
            dateRange: {
                startsAt: "",
                endsAt: "",
            },
        };

        if (info.event.allDay) {
            changeDate(id, info.event.startStr, null);

            dto.dateRange.startsAt = formattedStart;
            const endDate = newStart.add(1, "day");
            dto.dateRange.endsAt = endDate.format("YYYY-MM-DDTHH:mm:ss");
        } else {
            const formattedEnd = newEnd.format("YYYY-MM-DDTHH:mm:ss");
            dto.dateRange.startsAt = formattedStart;
            dto.dateRange.endsAt = formattedEnd;
            changeDate(id, dto.dateRange.startsAt, dto.dateRange.endsAt);
        }
        updateDateEvent(dto, token);
    }
    const handleEvent = (eventData, id) => {
        let calendarApi = calendarRef.current.getApi();

        const existingEvent = events.find(event => event.id === id);
        const formattedStart = dayjs(eventData.dateRange.startsAt).format(
            "YYYY-MM-DDTHH:mm:ss"
        );
        const formattedEnd = dayjs(eventData.dateRange.endsAt).format(
            "YYYY-MM-DDTHH:mm:ss"
        );

        const isSingleDay = isDatesDifferenceOneDay(
            new Date(formattedStart),
            new Date(formattedEnd)
        );

        const dtoObj = {
            id: id,
            title: eventData.title,
            start: isSingleDay
                ? formattedStart.toString().split("T")[0]
                : formattedStart,
            end: isSingleDay ? null : formattedEnd,
            description: eventData.description,
            location: eventData.locationId,
            organizers: eventData.organizers,
        };

        if (existingEvent) {
            calendarApi.getEventById(existingEvent.id)?.remove();
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id === id ? { ...event, ...dtoObj } : event
                )
            );
        } else {
            setEvents(prevEvents => [...prevEvents, dtoObj]);
        }

        setSnackbarInfo({
            open: true,
            message: `Event has been ${existingEvent ? "updated" : "added"}`,
            severity: "success",
        });
        calendarApi.addEvent(dtoObj)
    }

    const handleCloseSnackbar = () => {
        setSnackbarInfo(prev => ({
            ...prev,
            open: false,
        }))
    }

    const renderEventContent = (eventInfo) => {
        const organizers = eventInfo.event.extendedProps.organizers;
        const organizersStr = Array.isArray(organizers) ? organizers.join(', ') : 'N/A';

        return (
            <Tooltip title={
                <>
                    <Typography variant="body2">{eventInfo.event.title}</Typography>
                    <Typography variant="body3">Start: {eventInfo.event.start ? eventInfo.event.start.toLocaleString() : 'N/A'}</Typography>
                    <Typography variant="body3">End: {eventInfo.event.end ? eventInfo.event.end.toLocaleString() : 'N/A'}</Typography>
                    <Typography variant="body3">Description: {eventInfo.event.extendedProps.description}</Typography>
                    <Typography variant="body3">Location: {eventInfo.event.extendedProps.location}</Typography>
                    <Typography variant="body3">Organizers: {organizersStr}</Typography>
                </>
            }>
                <Box sx={{ '& > *:not(:last-child)': { marginBottom: '8px' } }}>
                    <Typography variant="body3">{eventInfo.timeText}</Typography>
                    <Typography variant="body3">{eventInfo.event.title}</Typography>
                </Box>
            </Tooltip>
        );
    }

    const plugins = isMobileView
        ? [timeGridPlugin, interactionPlugin, listPlugin]
        : [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]

    const headerToolbar = isMobileView
        ? {
            left: "prev,next",
            center: "title",
            right: "timeGridDay,listMonth",
        }
        : {
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
        }

    const initialViewMode = isMobileView ? "timeGridDay" : "dayGridMonth"

    return (
        <>
            {isLoading ? (
                <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 3, md: 10 } }}>
                    <Box>
                        <FullCallendar
                            ref={calendarRef}
                            timeZone="local"
                            height={window.innerWidth <= 600 ? '60vh' : '70vh'}
                            plugins={plugins}
                            headerToolbar={headerToolbar}
                            initialView={initialViewMode}
                            editable={!isMyCalendar && isAdmin()}
                            selectable={!isMyCalendar && isAdmin()}
                            select={handleDateClick}
                            eventClick={handleEventClick}
                            events={events}
                            selectMirror={!isMyCalendar && isAdmin()}
                            dayMaxEvents={!isMyCalendar && isAdmin()}
                            eventDrop={handleDateUpdate}
                            eventResize={handleDateUpdate}
                            validRange={{
                                start: new Date(),
                            }}
                            eventContent={renderEventContent}
                        />
                    </Box>
                </Container>
            )}
            {events !== null && !isMyCalendar && Object.keys(pickedEvent).length > 0 && (
                <EventForm
                    open={open}
                    isTimeGridWeek={isTimeGridWeek}
                    userDB={userDB}
                    locationDB={locationDB}
                    handleEvent={handleEvent}
                    handleDeleteEvent={handleDeleteEvent}
                    handleModalClose={handleModalClose}
                    isUpdateEvent={isUpdateEvent}
                    pickedEvent={pickedEvent}
                />
            )}
            <Snackbar open={snackbarInfo.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <MuiAlert onClose={handleCloseSnackbar} severity={snackbarInfo.severity} elevation={6} variant="filled">
                    {snackbarInfo.message}
                </MuiAlert>
            </Snackbar>
        </>
    );
}

export default Calendar;
