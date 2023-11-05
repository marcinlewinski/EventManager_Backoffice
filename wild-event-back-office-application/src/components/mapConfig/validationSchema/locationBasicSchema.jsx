import * as yup from "yup";


const LocationBasicSchema = yup.object().shape({
    title: yup.string()
        .trim()
        .matches(/\S/, "You can't enter only spaces!")
        .required("This field is required!")
        .min(5, "Too Short!").max(100, "Too Long!"),
    description: yup.string()
        .trim()
        .matches(/\S/, "You can't enter only spaces!")
        .required("This field is required!")
        .min(5, "Too Short!").max(500, "Too Long!"),

});

export default LocationBasicSchema;
