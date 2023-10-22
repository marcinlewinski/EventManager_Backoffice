import * as Yup from "yup";

const dialogValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .matches(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed")
    .test("no-whitespace-only", "Name cannot consist only of whitespace", (value) => {
      return value && value.trim().length > 0;
    })
    .required("Required"),
  email: Yup.string()
    .email("Invalid email format")
    .test("no-whitespace-only", "Email cannot consist only of whitespace", (value) => {
      return value && value.trim().length > 0;
    })
    .required("Required"),
  phone: Yup.string()
    .matches(/^[\d]{9}$/, "Phone number must have exactly 9 digits")
    .test("no-whitespace-only", "Phone number cannot consist only of whitespace", (value) => {
      return value && value.trim().length > 0;
    })
    .required("Required"),
  roleIds: Yup.array()
    .min(1, "At least one role must be assigned")
    .required("Required"),
  locationIds: Yup.array().required("Required"),
});

export default dialogValidationSchema;
