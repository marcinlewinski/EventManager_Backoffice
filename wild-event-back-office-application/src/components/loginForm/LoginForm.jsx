import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUser } from '../../services/providers/LoggedUserProvider';
import { loginUser } from '../../services/api/LoginService';
import ResetPasswordRequestByEmail from '../resetPasswordForm/ResetPasswordRequestByEmail';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  ThemeProvider,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import backgroundImage from '../../assets/logo2.jpg';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';

const defaultTheme = createTheme();

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Required'),
  password: Yup.string().required('Required'),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [loginError, setLoginError] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setDisableBtn(true)
        const response = await loginUser(values.email, values.password);
        sessionStorage.setItem('token', response.token);
        login(response, response.token);
        navigate('/main');
      } catch (error) {
        setDisableBtn(false)
        console.error('Error while logging in:', error);
        setLoginError('Invalid email or password');
      }
    },
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} sx={{ backgroundImage: `url(${backgroundImage})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
              {loginError && <Typography color="error">{loginError}</Typography>}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
              <LoadingButton
                fullWidth
                size="medium"
                color="primary"
                onClick={formik.handleSubmit}
                loadingPosition="end"
                endIcon={<SendIcon />}
                loading={disableBtn}
                variant="contained"
              >
                <span>Sign In</span>
              </LoadingButton>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2" onClick={() => setDialogOpen(true)}>
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent>
          <ResetPasswordRequestByEmail />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default LoginForm;
