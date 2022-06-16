import * as Yup from "yup";
import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useFormik, Form, FormikProvider } from "formik";
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";

// component
import Iconify from "../../../components/Iconify";
import axios from "../../../http-common";

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isUserPresent, setIsUserPresent] = useState(false);

  const [open, setOpen] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      console.log(
        "EMAIL: ",
        getFieldProps("email").value,
        getFieldProps("password").value
      );

      try {
        axios
          .post("/authenticate", {
            email: getFieldProps("email").value,
            password: getFieldProps("password").value,
          })
          .then((res) => {
            console.log("res data: ", res.data.message);
            localStorage.setItem("token", res.data.jwt);
            localStorage.setItem("user", getFieldProps("email").value);

            if (!!res.data.message) {
              setIsUserPresent(false);
              setOpen(true);
            } else navigate("/dashboard/app", { replace: true });
          });
      } catch (error) {
        console.log("ERRRR:", error);
        setIsUserPresent(false);
        setOpen(true);
      }
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } =
    formik;

  useEffect(() => {
    localStorage.clear();
  }, []);
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      {!isUserPresent && (
        <Collapse in={open}>
          {" "}
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            The username or password is incorrect!
          </Alert>
        </Collapse>
      )}
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps("email")}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            label="Password"
            {...getFieldProps("password")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify
                      icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2 }}
        >
          <FormControlLabel
            control={
              <Checkbox
                {...getFieldProps("remember")}
                checked={values.remember}
              />
            }
            label="Remember me"
          />

          <Link
            component={RouterLink}
            variant="subtitle2"
            to="#"
            underline="hover"
          >
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isUserPresent}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
