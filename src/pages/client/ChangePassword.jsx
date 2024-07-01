import React, { useState } from 'react'
import { alpha, Backdrop, CircularProgress, Box, Button, FormLabel, Typography, InputAdornment, IconButton, styled, OutlinedInput } from '@mui/material'
import { KeyboardBackspace } from '@mui/icons-material'
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from "react-i18next";
import { useSnackbar } from 'notistack';
import Api from '../../api/api';
import { logoutUser } from '../../services/auth';
import PasswordStrengthIndicator from "../../pages/auth/PasswordStrengthIndicator/PasswordStrengthIndicator";
import PasswordStrengthSuggestions from "../../pages/auth/PasswordStrengthSuggestions/PasswordStrengthSuggestions";

const InputField = styled(OutlinedInput)(({ theme }) => ({
    margin: '.7rem 0',
    borderRadius: '15px',
    background: '#fff',
}))

function ChangePassword({ openChangePassword, setOpenChangePassword }) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showcurrentPassword, setShowcurrentPassword] = useState(false)
    const [shownewPassword, setShownewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [pwdStrengthScore, setPwdStrengthScore] = useState(0);
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setOpenChangePassword(false)
    }

    const handleClickShowCurrentPassword = () => {
        setShowcurrentPassword(!showcurrentPassword)
    };

    const handleClickShowNewPassword = () => {
        setShownewPassword(!shownewPassword)
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword)
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value)

        if (e.target.value === "") {
            setPwdStrengthScore(0);
            return;
        }
        //eslint-disable-next-line
        if (e.target.value?.match(/[a-z]/) && e.target.value?.match(/[A-Z]/) && e.target.value.match(/[0-9]/) && e.target.value?.match(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/) && e.target.value?.length > 7) {
            setPwdStrengthScore(5);
            return
        }
        if (e.target.value?.match(/[a-z]/) && e.target.value?.match(/[A-Z]/) && e.target.value.match(/[0-9]/) && e.target.value.match(/[0-9]/)) {
            setPwdStrengthScore(4);
            return
        }
        //eslint-disable-next-line
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
            currentPassword: currentPassword,
            password: newPassword,
            confirmPassword: confirmPassword,
        }

        if (currentPassword === "" || newPassword === "" || confirmPassword === "") {
            setError(true)
            enqueueSnackbar(t('dashboard.changepassword.validation.emptyfields'), { variant: 'error' });
        } else if (newPassword !== confirmPassword) {
            enqueueSnackbar(t('dashboard.changepassword.validation.passwordnotequal'), { variant: 'error' });
        } else {
            setLoading(true)
            Api().post("/change-password", data)
                .then((response) => {
                    handleClose()
                    setLoading(false)
                    enqueueSnackbar(response.data, { variant: 'success' });
                    setTimeout(() => {
                        logoutUser()
                        window.location.assign("/")
                    }, 3000)
                })
                .catch((error) => {
                    setLoading(false)
                    enqueueSnackbar(error?.response?.data?.error?.message, { variant: 'error' });
                })
        }
    }

    return (
        <Backdrop open={openChangePassword} sx={{ bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.97), marginTop: "75px" }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <form onSubmit={handlePasswordChange}>
                    <Box color={'#fff'} width='25rem' textAlign={'center'}>
                        {/* <IconButton sx={{ border: '1px solid white', padding: '1.2rem', marginBottom: '1rem' }}><LockOutlined color='paper' sx={{ fontSize: '2rem' }} /></IconButton> */}
                        <Typography variant='h5' sx={{ fontWeight: 500 }}>{t('dashboard.changepassword.title')}</Typography>
                        <Typography variant='body2' sx={{ color: alpha('#fff', 0.5) }} mb={'2rem'}>{t('dashboard.changepassword.instruction')}</Typography>

                        <Box width={'100%'}>
                            <FormLabel sx={{ color: '#fff' }}>{t('dashboard.changepassword.currentpassword')}</FormLabel>
                            <InputField
                                fullWidth
                                id="change-password-current"
                                type={showcurrentPassword ? 'text' : 'password'}
                                value={currentPassword}
                                size="small"
                                placeholder={t('dashboard.changepassword.currentpasswordplaceholder')}
                                variant="outlined"
                                error={currentPassword.length > 0 ? false : error}
                                onChange={(e) => { setCurrentPassword(e.target.value); setError(false) }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowCurrentPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showcurrentPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />

                            <FormLabel sx={{ color: '#fff' }}>{t('dashboard.changepassword.newpassword')}</FormLabel>
                            <InputField
                                fullWidth
                                id="change-password-new"
                                type={shownewPassword ? 'text' : 'password'}
                                value={newPassword}
                                placeholder={t('dashboard.changepassword.newpasswordplaceholder')}
                                variant="outlined"
                                size="small"
                                error={newPassword.length > 0 ? false : error}
                                onChange={(e) => { handlePasswordChange(e); setError(false) }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowNewPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {shownewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />

                            <div className='my-2 m-auto text-start'>
                                {pwdStrengthScore > 0 && <PasswordStrengthIndicator score={pwdStrengthScore} />}
                                {pwdStrengthScore > 0 && <PasswordStrengthSuggestions suggestions={pwdStrengthScore} />}
                            </div>

                            <FormLabel sx={{ color: '#fff' }}>{t('dashboard.changepassword.confirmpassword')}</FormLabel>
                            <InputField
                                fullWidth
                                id="change-password-confirm"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                placeholder={t('dashboard.changepassword.confirmpasswordplaceholder')}
                                variant="outlined"
                                size="small"
                                error={confirmPassword.length > 0 ? false : error}
                                onChange={(e) => { setConfirmPassword(e.target.value); setError(false) }}
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
                                {loading || t('dashboard.changepassword.changepasswordbtn')}
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
                            <Button disableRipple sx={{ textTransform: 'none', marginTop: '1rem' }}
                                startIcon={<KeyboardBackspace color='paper' fontSize='small' />} onClick={handleClose} variant='text' color='paper'>{t('dashboard.changepassword.back')}</Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Backdrop>
    )
}

export default ChangePassword