import React, { useState } from 'react'
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { alpha, TextField, CircularProgress, Button, Box, IconButton, FormLabel, styled, Typography } from '@mui/material';
import { KeyboardBackspace, LockOutlined } from '@mui/icons-material'
import loginLogo from '../../assets/images/rehomelogowhite.svg'
import Api from '../../api/api';
import { useSnackbar } from 'notistack';
import validator from "validator";

const InputField = styled(TextField)(({ theme }) => ({
    margin: '.7rem 0',

    '& .MuiOutlinedInput-root': {
        borderRadius: '15px',
        background: '#fff',
    }
}))

function ForgotPassword() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [email, setEmail] = useState("")
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault()
        if (email === "") {
            setError(true)
            enqueueSnackbar(t('forgotpassword.validation.emptyfield'), { variant: 'error' });
        } else if (!validator.isEmail(email)) {
            enqueueSnackbar(t('forgotpassword.validation.email'), { variant: 'error' });
        } else {
            setLoading(true)
            Api().post("/request-password", { email: email.toLowerCase() })
                .then((response) => {
                    setLoading(false)
                    enqueueSnackbar(response.data, { variant: 'success' });
                    setTimeout(() => {
                        window.location.assign("/")
                    }, 4000)
                })
                .catch((error) => {
                    setLoading(false)
                    enqueueSnackbar(error?.response?.data?.error?.message, { variant: 'error' });
                })
        }
    }

    return (
        <div className='h-[100vh] w-full bg-[#0A2D65] text-white'>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "0 15px", height: "90vh" }}>
                <Box color={'#fff'} width='25rem' textAlign={'center'}>
                    <div className='flex justify-center my-6'>
                        <img src={loginLogo} width={230} alt="logo" />
                    </div>
                    <IconButton sx={{ border: '1px solid white', padding: '1.2rem', marginBottom: '1rem' }}><LockOutlined color='paper' sx={{ fontSize: '2rem' }} /></IconButton>
                    <Typography variant='h5' sx={{ fontWeight: 500 }}>{t('forgotpassword.title')}</Typography>
                    <Typography variant='body2' sx={{ color: alpha('#fff', 0.5) }} mb={'2rem'}>{t('forgotpassword.instruction')}</Typography>

                    <Box width={'100%'}>
                        <FormLabel sx={{ color: '#fff' }}>{t('forgotpassword.email')}</FormLabel>
                        <InputField
                            fullWidth
                            id="forgot-password-email"
                            variant='outlined'
                            type={'text'}
                            size="small"
                            placeholder={t('forgotpassword.placeholder')}
                            error={email.length > 0 ? false : error}
                            onChange={(e) => { setEmail(e.target.value); setError(false) }}
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
                            {loading || t("forgotpassword.button")}
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
                        <Button onClick={() => navigate(-1)} disableRipple sx={{ textTransform: 'none', marginTop: '1rem' }}
                            startIcon={<KeyboardBackspace color='paper' fontSize='small' />} variant='text' color='paper'>{t("forgotpassword.back")}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </div>
    )
}

export default ForgotPassword