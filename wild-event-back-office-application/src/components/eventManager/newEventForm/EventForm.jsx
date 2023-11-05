import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import dayjs from 'dayjs';
import { addEvent, updateEvent } from '../../../services/api/EventService';
import { useFormik, } from 'formik';
import { useUser } from '../../../services/providers/LoggedUserProvider';
import { EventFormFields } from './EventFormFields';
import { EventFormActions } from './EventFormActions';
import eventSchema from '../validationSchema/EventSchema';

const EventForm = ({
    open,
    locationDB,
    handleModalClose,
    isTimeGridWeek,
    isUpdateEvent,
    pickedEvent,
    handleDeleteEvent,
    userDB,
    handleEvent,
}) => {

    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const STARTS_AT = 'startsAt';
    const ENDS_AT = 'endsAt';
    const { token } = useUser();
    const [isLoading, setIsLoading] = useState(false);


    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            dateRange: {
                startsAt: dayjs('2023-09-20T08:00:00').format('YYYY-MM-DDTHH:mm:ss'),
                endsAt: dayjs('2023-09-20T08:00:00').format('YYYY-MM-DDTHH:mm:ss'),
            },
            locationId: '',
            organizers: [],
            openToPublic: false,

        },
        validationSchema: eventSchema,
        onSubmit: async (values) => {
            setIsLoading(!isLoading);

            let id = null;
            isUpdateEvent
                ? (id = await updateEvent(values, pickedEvent.id, token))
                : (id = await addEvent(values, token));
            await handleEvent(values, id);
            await handleModalClose();
            formik.resetForm()
        },
    });
    const closeModal = () => {
        handleModalClose();
        formik.resetForm();
    }
    useEffect(() => {
        setIsLoading(false);

        formik.resetForm();
        if (pickedEvent && pickedEvent.organizers && userDB) {
            formik.setFieldValue('title', pickedEvent.title);
            formik.setFieldValue('description', pickedEvent.description);
            formik.setFieldValue(
                'dateRange.startsAt',
                dayjs(pickedEvent.start).format('YYYY-MM-DDTHH:mm:ss')
            );
            formik.setFieldValue(
                'dateRange.endsAt',
                dayjs(pickedEvent.end).format('YYYY-MM-DDTHH:mm:ss')
            );
            formik.setFieldValue('locationId', pickedEvent.location.id);
            formik.setFieldValue(
                'organizers',
                pickedEvent.organizers.map((organizerName) => {
                    const user = userDB.find((user) => user.name === organizerName);
                    return user ? user.id : null;
                }).filter((id) => id !== null)
            );
        }

        if (!isUpdateEvent) {
            formik.setFieldValue('dateRange.startsAt', dayjs(`${pickedEvent.start}T00:00:00`).format('YYYY-MM-DDTHH:mm:ss'));
            formik.setFieldValue('dateRange.endsAt', dayjs(`${pickedEvent.end}T00:00:00`).format('YYYY-MM-DDTHH:mm:ss'));
        }

        if (isTimeGridWeek) {
            formik.setFieldValue('dateRange.startsAt', dayjs(pickedEvent.start.toString().split('+')[0]).format('YYYY-MM-DDTHH:mm:ss'));
            formik.setFieldValue('dateRange.endsAt', dayjs(pickedEvent.end.toString().split('+')[0]).format('YYYY-MM-DDTHH:mm:ss'));
        }

        if (pickedEvent.allDay) {
            formik.setFieldValue('dateRange.startsAt', dayjs(`${pickedEvent.start}T00:00:00`).format('YYYY-MM-DDTHH:mm:ss'));
            formik.setFieldValue('dateRange.endsAt', dayjs(pickedEvent.start).add(1, 'day').format('YYYY-MM-DDTHH:mm:ss'));
        }
        setIsDataLoaded(true)
    }, [isUpdateEvent, isTimeGridWeek, pickedEvent, userDB]);

    const handleDateChange = (newValue, flag) => {
        const formattedValue = newValue.format('YYYY-MM-DDTHH:mm:ss');
        formik.setFieldValue(`dateRange.${flag === STARTS_AT ? 'startsAt' : 'endsAt'}`, formattedValue);
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        formik.setFieldValue(name, value);
    };

    const getNameFromId = (selected) => {
        const selectedNames = selected.map((id) => {
            const user = userDB.find((user) => user.id === id);
            return user ? user.name : '';
        });
        return selectedNames.join(', ');
    };
    const deleteEvent = () => {
        handleDeleteEvent(pickedEvent);
        setIsLoading(true);
    }
    return (
        isDataLoaded ? (
            <Dialog fullWidth open={open} onClose={handleModalClose}>
                <DialogTitle>{isUpdateEvent ? 'Event details' : 'Add New Event'}</DialogTitle>
                <DialogContent>
                    <EventFormFields
                        STARTS_AT={STARTS_AT}
                        ENDS_AT={ENDS_AT}
                        pickedEvent={pickedEvent}
                        getNameFromId={getNameFromId}
                        formik={formik}
                        handleInputChange={handleInputChange}
                        handleDateChange={handleDateChange}
                        locationDB={locationDB}
                        userDB={userDB}>
                    </EventFormFields>
                </DialogContent>
                <EventFormActions
                    pickedEvent={pickedEvent}
                    isUpdateEvent={isUpdateEvent}
                    formik={formik}
                    isLoading={isLoading}
                    closeModal={closeModal}
                    deleteEvent={deleteEvent}>
                </EventFormActions>
            </Dialog>
        ) : null
    );
};

export default EventForm;
