import * as yup from "yup";


const locationBasicSchema = yup.object().shape({
  title: yup.string().min(5, "Too Short!").max(100, "Too Long!").required("This field is required!"),
  description: yup.string().min(5, "Too Short!").max(500, "Too Long!").required("This field is required!"),
 
});

export default locationBasicSchema;
