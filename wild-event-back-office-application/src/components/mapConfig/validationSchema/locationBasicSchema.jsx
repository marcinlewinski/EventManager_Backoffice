import * as yup from "yup";


const locationBasicSchema = yup.object().shape({
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

});

export default locationBasicSchema;
