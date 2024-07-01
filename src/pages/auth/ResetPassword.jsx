import React, { useState } from 'react'
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CircularProgress, Box, styled, Typography, alpha, FormLabel, IconButton, OutlinedInput, InputAdornment, Button } from '@mui/material';
import { KeyboardBackspace, LockOutlined } from '@mui/icons-material'
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Api from '../../api/api';
import { useSnackbar } from 'notistack';
import PasswordStrengthIndicator from "./PasswordStrengthIndicator/PasswordStrengthIndicator";
import PasswordStrengthSuggestions from "./PasswordStrengthSuggestions/PasswordStrengthSuggestions";

const InputField = styled(OutlinedInput)(({ theme }) => ({
    margin: '.7rem 0',
    borderRadius: '15px',
    background: '#fff',
}))

function ResetPassword() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [pwdStrengthScore, setPwdStrengthScore] = useState(0);
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();

    const resetKey = searchParams.get('resetKey');

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword)
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
        
        if (e.target.value === "") {
            setPwdStrengthScore(0);
            return;
        }
        // eslint-disable-next-line
        if (e.target.value?.match(/[a-z]/) && e.target.value?.match(/[A-Z]/) && e.target.value.match(/[0-9]/) && e.target.value?.match(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/) && e.target.value?.length > 7) {
            setPwdStrengthScore(5);
            return
        }
        if (e.target.value?.match(/[a-z]/) && e.target.value?.match(/[A-Z]/) && e.target.value.match(/[0-9]/) && e.target.value.match(/[0-9]/)) {
            setPwdStrengthScore(4);
            return
        }
        // eslint-disable-next-line
        if (e.target.value?.match(/[a-z]/) && e.target.value?.match(/[A-Z]/) && e.target.value?.match(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)) {
            setPwdStrengthScore(3);
            return
        }
        if (e.target.value?.match(/[a-z]/) && e.target.value?.match(/[A-Z]/)) {
            setPwdStrengthScore(2);
            return
        }
        if (e.target.value?.match(/[a-z]/) || e.target.value?.match(/[A-Z]/)) {
            setPwdStrengthScore(1);
            return
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const data = {
            password: password,
            confirmPassword: confirmPassword,
            resetKey: resetKey
        }

        if (password === "") {
            setError(true)
            enqueueSnackbar(t('resetpassword.validation.emptyfields'), { variant: 'error' });
        } else if (confirmPassword === "") {
            setError(true)
            enqueueSnackbar(t('resetpassword.validation.emptyfields'), { variant: 'error' });
        } else if (password !== confirmPassword) {
            enqueueSnackbar(t('resetpassword.validation.passwordnotequal'), { variant: 'error' });
        } else {
            setLoading(true)
            Api().post("/reset-password", data)
                .then((response) => {
                    setLoading(false)
                    enqueueSnackbar(response.data, { variant: 'success' });
                    setTimeout(() => {
                        window.location.assign("/")
                    }, 3000)
                })
                .catch((error) => {
                    setLoading(false)
                    enqueueSnackbar(error.message, { variant: 'success' });
                })
        }
    }

    return (
        <div className='h-[100vh] w-full bg-[#0A2D65] text-white'>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "0 15px", height: "90vh" }}>
                <Box color={'#fff'} width='25rem' textAlign={'center'}>
                    <IconButton sx={{ border: '1px solid white', padding: '1.2rem', marginBottom: '1rem' }}><LockOutlined color='paper' sx={{ fontSize: '2rem' }} /></IconButton>
                    <Typography variant='h5' sx={{ fontWeight: 500 }}>{t('resetpassword.title')}</Typography>
                    <Typography variant='body2' sx={{ color: alpha('#fff', 0.5) }} mb={'2rem'}>{t('resetpassword.instruction')}</Typography>

                    <Box width={'100%'}>
                        <FormLabel sx={{ color: '#fff' }}>{t('resetpassword.newpassword')}</FormLabel>
                        <InputField
                            fullWidth
                            id="reset-new-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            size="small"
                            placeholder={t('resetpassword.passwordplaceholder')}
                            variant="outlined"
                            error={password.length > 0 ? false : error}
                            onChange={(e) => { handlePasswordChange(e); setError(false) }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />

                        <div className='my-2 m-auto text-start'>
                            {pwdStrengthScore > 0 && <PasswordStrengthIndicator score={pwdStrengthScore} />}
                            {pwdStrengthScore > 0 && <PasswordStrengthSuggestions suggestions={pwdStrengthScore} />}
                        </div>

                        <FormLabel sx={{ color: '#fff' }}>{t('resetpassword.confirmpassword')}</FormLabel>
                        <InputField
                            fullWidth
                            id="reset-confirm-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            placeholder={t('resetpassword.confirmpasswordplaceholder')}
                            variant="outlined"
                            size="small"
                            error={confirmPassword.length > 0 ? false : error}
                            onChange={(e) => { setConfirmPassword(e.target.value);setError(false) }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowConfirmPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />

                        <Button
                            onClick={handleSubmit}
                            fullWidth
                            variant='contained'
                            sx={{
                                borderRadius: '15px',
                                textTransform: 'none',
                                height: '2.8rem', marginTop: '1rem'
                            }}
                            disableElevation
                            color='primary'
                            type="submit"
                        >
                            {loading || t("resetpassword.button")}
                                {loading && (
                                    <CircularProgress
                                        size={20}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: "white"
                                        }}
                                    />
                                )}
                        </Button>
                        <Button onClick={() => navigate("/")} disableRipple sx={{ textTransform: 'none', marginTop: '1rem' }}
                            startIcon={<KeyboardBackspace color='paper' fontSize='small' />} variant='text' color='paper'>{t("resetpassword.back")}</Button>
                    </Box>
                </Box>
            </Box>
        </div>
    )
}

export default ResetPassword