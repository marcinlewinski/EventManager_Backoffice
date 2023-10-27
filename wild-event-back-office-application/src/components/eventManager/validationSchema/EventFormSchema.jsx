import * as yup from "yup";

const basicSchema = yup.object().shape({
    title: yup.string()
        .trim()
        .required("This field is required!")
        .matches(/\S/, "You can't enter only spaces!")
        .min(5, "Too Short!").max(100, "Too Long!"),
    description: yup.string()
        .trim()
        .required("This field is required!")
        .matches(/\S/, "You can't enter only spaces!")
        .min(5, "Too Short!").max(500, "Too Long!"),
    locationId: yup.string().required("This field is required!"),
    organizers: yup.array().of(yup.string()).min(1, "At least one organizer is required!"),
    openToPublic: yup.boolean(),
});

export default basicSchema;
