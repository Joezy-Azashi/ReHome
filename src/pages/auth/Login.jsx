import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, FormLabel, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import { Apple, Facebook, Mail, Visibility, VisibilityOff } from '@mui/icons-material';
import google from '../../assets/images/google.svg'
import { LoadingButton } from '@mui/lab'
import { useTranslation } from "react-i18next";
import { useSnackbar } from 'notistack';
import * as auth from "../../services/auth"
import config from '../../public/config'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import ReactGA from 'react-ga4'

function Login() {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate()
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleLogin = async (e) => {
        e.preventDefault()

        if (email === "") {
            setError(true)
            enqueueSnackbar(t('login.validation.emptyfields'), { variant: 'error' });
        } else if (password === "") {
            setError(true)
            enqueueSnackbar(t('login.validation.emptyfields'), { variant: 'error' });
        } else {
            setLoading(true)

            const token = await executeRecaptcha('loginForm')

            if (token.length > 0) {
                const userData = {
                    email: email.toLowerCase(),
                    password: password,
                    recaptcha: token
                }

                auth.loginUser(userData)
                    .then((response) => {
                        setLoading(false)

                        if ((response?.data?.profile?.userType === "agent" || response?.data?.profile?.userType === "developer" || response?.data?.profile?.userType === "realtor") && !response?.data?.profile?.onboardingComplete) {
                            navigate("/broker/onboard")
                                ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Login page" });

                        } else if (response?.data?.profile?.userType === "agent" || response?.data?.profile?.userType === "developer" || response?.data?.profile?.userType === "realtor") {
                            navigate("/broker/dashboard")
                            ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Login page" });
                        } else if (response?.data?.profile?.userType === "customer" &&
                            (response?.data?.profile?.firstName === "" || response?.data?.profile?.firstName === undefined ||
                                response?.data?.profile?.firstName === "" || response?.data?.profile?.firstName === undefined ||
                                response?.data?.profile?.phone === "" || response?.data?.profile?.phone === undefined ||
                                response?.data?.profile?.gender === "" || response?.data?.profile?.gender === undefined ||
                                response?.data?.profile?.address === "" || response?.data?.profile?.address === undefined)) {
                            navigate('/client/profile')
                            ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Login page" });
                        } else if(response?.data?.profile?.userType === "admin" || response?.data?.profile?.userType === "support"){
                            navigate('/admin/dashboard')
                        } else {
                            navigate("/")
                        }
                    })
                    .catch((error) => {
                        setLoading(false)
                        enqueueSnackbar((error?.response?.data?.error?.message), { variant: 'error' });
                    })
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleLogin} id="loginForm">
                <Box mt={'2rem'}>
                    <FormLabel sx={{ mb: '.5rem', display: 'block', fontWeight: 500, color: '#000' }}>{t('login.email')}</FormLabel>
                    <TextField sx={{
                        mb: '2rem',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '15px',
                            background: '#fff'
                        },
                        '& .MuiInputBase-input': { borderRadius: "15px 0 0 15px" }
                    }}
                        variant='outlined'
                        id="login-email"
                        type={'email'}
                        value={email}
                        error={email.length > 0 ? false : error}
                        onChange={(e) => { setEmail(e.target.value); setError(false) }}
                        fullWidth
                        placeholder={t('login.emailPlaceholder')}
                        InputProps={{
                            endAdornment: <InputAdornment position='start'><Mail fontSize='small' sx={{ marginLeft: "8px" }} /></InputAdornment>
                        }}
                    />

                    <FormLabel sx={{ mb: '.5rem', display: 'block', fontWeight: 500, color: '#000' }}>{t('login.password')}</FormLabel>
                    <TextField sx={{
                        mb: '2rem',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '15px',
                            background: '#fff'
                        },
                        '& .MuiInputBase-input': { borderRadius: "15px 0 0 15px" }
                    }}
                        variant='outlined'
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        placeholder={t('login.passwordPlaceholder')}
                        error={password.length > 0 ? false : error}
                        onChange={(e) => { setPassword(e.target.value); setError(false) }}
                        fullWidth
                        InputProps={{
                            endAdornment:
                                <InputAdornment position='start'>
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                        }}
                    />
                    <LoadingButton
                        size='large'
                        disableElevation
                        fullWidth
                        variant='contained'
                        color='secondary'
                        sx={{ textTransform: 'none', borderRadius: '10px' }}
                        type="submit"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress
                                size={20}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: "white",
                                    margin: "4px 0"
                                }}
                            />
                        ) : t("login.login")}
                    </LoadingButton>

                    <NavLink to="/forgot-password">
                        <Typography mt={'1rem'} textAlign={'center'} sx={{ fontSize: '.9rem', textDecoration: "underline" }} variant='body2'>{t('login.forgotPassword')}</Typography>
                    </NavLink>
                </Box>
            </form>

            <Box sx={{
                mt: '2rem',
                width: '100%',
                '& span': {
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' },
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '.5rem'
                }
            }}>
                <Typography mb={'1rem'} mt={'2rem'} textAlign={'center'} sx={{ fontSize: '.9rem' }} variant='body2'>{t('login.connect')}</Typography>
                <span>

                    <a href={`${config.api}/auth/thirdparty/apple`} style={{ width: '100%' }}>
                        <Button
                            fullWidth
                            variant='contained'
                            disableElevation
                            sx={{ bgcolor: '#000', textTransform: 'none', }}
                            startIcon={
                                <Apple fontSize='small' />
                            }
                        >
                            {t("login.signInApple")}
                        </Button>
                    </a>

                    <a href={`${config.api}/auth/thirdparty/google`} style={{ width: '100%' }}>
                        <Button
                            fullWidth
                            variant='outlined'
                            color='secondary'
                            disableElevation
                            sx={{ bgcolor: '#fff', textTransform: 'none' }}
                        >
                            <img src={google} style={{ width: "21px", marginRight: "5px" }} alt="google_logo" />
                            {t("createaccount.signInGoogle")}
                        </Button>
                    </a>


                    <a href={`${config.api}/auth/thirdparty/facebook`} style={{ width: '100%' }}>
                        <Button
                            fullWidth
                            variant='contained'
                            disableElevation
                            sx={{ textTransform: 'none', color: '#fff' }}
                            color='tertiary'
                            startIcon={
                                <Facebook fontSize='small' />
                            }
                        >
                            {t("createaccount.signInFacebook")}
                        </Button>
                    </a>
                </span>
            </Box>
        </div>
    )
}

export default Login