import React, { useState } from 'react'
import { TextField, CircularProgress, FormLabel, Typography, Button, IconButton, InputAdornment, Box } from '@mui/material';
import { Apple, Facebook, Mail, Visibility, VisibilityOff } from '@mui/icons-material';
import google from '../../assets/images/google.svg'
import { useTranslation } from "react-i18next";
import { useSnackbar } from 'notistack';
import * as auth from "../../services/auth"
import validator from "validator";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator/PasswordStrengthIndicator";
import PasswordStrengthSuggestions from "./PasswordStrengthSuggestions/PasswordStrengthSuggestions";
import buyerrenter from "../../assets/images/buyer01.png"
import individualSeller from "../../assets/images/developer01.png"
import realtor from "../../assets/images/realtor01.png"
import agent from "../../assets/images/agent01.png"
import { LoadingButton } from '@mui/lab'
import config from '../../public/config';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import OneSignal from 'react-onesignal';
import { Link, useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

function CreateAccount() {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate()
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [pwdStrengthScore, setPwdStrengthScore] = useState(0);
    const [userType, setUserType] = useState("")
    const [background, setBackground] = useState("")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)

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

    const getType = (string) => {
        setUserType(string)
        setBackground(string)
    }

    const onSignup = async (e) => {
        e.preventDefault();

        if (userType === "") {
            enqueueSnackbar(t('createaccount.validation.choosetype'), { variant: 'error' });
        } else if (email === "") {
            enqueueSnackbar(t('createaccount.validation.emptyemail'), { variant: 'error' });
            setError(true)
        } else if (!validator.isEmail(email)) {
            enqueueSnackbar(t('createaccount.validation.email'), { variant: 'error' });
        } else if (password === "") {
            setError(true)
            enqueueSnackbar(t('createaccount.validation.emptyPassfields'), { variant: 'error' });
        } else if (confirmPassword === "") {
            setError(true)
            enqueueSnackbar(t('createaccount.validation.emptyPassfields'), { variant: 'error' });
        } else if (password !== confirmPassword) {
            enqueueSnackbar(t('createaccount.validation.passwordnotequal'), { variant: 'error' });
        } else if (pwdStrengthScore < 4) {
            enqueueSnackbar(t('createaccount.validation.weakpassword'), { variant: 'error' });
        } else {
            setLoading(true)

            const token = await executeRecaptcha('signupForm')

            if (token.length > 0) {

                const userData = {
                    email: email.toLowerCase(),
                    password: password,
                    userType: userType,
                    recaptcha: token
                }

                auth.signUpUser(userData)
                    .then((response) => {
                        setLoading(false)
                        enqueueSnackbar(t('createaccount.validation.success'), { variant: 'success' });
                        auth.setAuthToken(response?.data?.accessToken);
                        auth.setCurrentUser(response.data);
                        OneSignal.setExternalUserId(response.data.profile.id)

                        if ((response?.data?.profile?.userType === "agent" || response?.data?.profile?.userType === "developer" || response?.data?.profile?.userType === "realtor") && !response?.data?.profile?.onboardingComplete) {
                            navigate("/broker/onboard")
                        } else if (response?.data?.profile?.userType === "agent" || response?.data?.profile?.userType === "developer" || response?.data?.profile?.userType === "realtor") {
                            navigate("/broker/dashboard")
                        } else if (response?.data?.profile?.userType === "customer" &&
                            (response?.data?.profile?.firstName === "" || response?.data?.profile?.firstName === undefined ||
                                response?.data?.profile?.firstName === "" || response?.data?.profile?.firstName === undefined ||
                                response?.data?.profile?.phone === "" || response?.data?.profile?.phone === undefined ||
                                response?.data?.profile?.gender === "" || response?.data?.profile?.gender === undefined ||
                                response?.data?.profile?.address === "" || response?.data?.profile?.address === undefined)) {
                            navigate('/client/profile')
                        } else {
                            navigate("/")
                        }
                    })
                    .catch((error) => {
                        setLoading(false)
                        if (error) {
                            enqueueSnackbar(error?.response?.data?.error?.message, { variant: 'error' });
                        }
                    })
            }
        }
    }

    return (
        <div>
            <form onSubmit={onSignup} id="signupForm">
                <Typography mb={2} mt={2} textAlign={'center'}>{t('signuptype.choosetype')}</Typography>
                <div style={{ gap: '10px' }} className="flex justify-between">
                    <div onClick={() => { getType("customer") }} className="cursor-pointer flex-1 w-[23%]">
                        <div className='border border-[#bfbfbf] rounded-xl' style={{ backgroundColor: background === "customer" ? "#bfbfbf" : "" }}>
                            <img src={buyerrenter} style={{ margin: '.8rem auto', display: 'block' }} alt="buyer" width={'32px'} className='md:m-3 m-1' />
                        </div>
                        {
                            isMobile ?
                                <p className='mt-2 text-[10px] font-semibold text-center'>{t('signuptype.buyer')}</p>
                                :
                                <p className='mt-2 text-[10px] font-semibold text-center'>{t('signuptype.buyerRenter')}</p>

                        }
                    </div>
                    <div onClick={() => { getType("agent") }} className="cursor-pointer flex-1 w-[25%]" >
                        <div className='border border-[#bfbfbf] rounded-xl' style={{ backgroundColor: background === "agent" ? "#bfbfbf" : "" }}>
                            <img src={agent} style={{ margin: '.8rem auto', display: 'block' }} alt="agent" width={'33px'} className='md:m-3 m-1' />
                        </div>
                        <p className='mt-2 text-[10px] font-semibold text-center'>{t('signuptype.agent')}</p>
                    </div>
                    <div onClick={() => { getType("realtor") }} className="cursor-pointer flex-1 w-[25%]">
                        <div className='border border-[#bfbfbf] rounded-xl' style={{ backgroundColor: background === "realtor" ? "#bfbfbf" : "" }}>
                            <img src={realtor} style={{ margin: '.8rem auto', display: 'block' }} alt="realtor" width={'33px'} className='md:m-3 m-1' />
                        </div>
                        <p className='mt-2 text-[10px] font-semibold text-center'>{t('signuptype.realtor')}</p>
                    </div>
                    <div onClick={() => { getType("developer") }} className="cursor-pointer flex-1 w-[25%]">
                        <div className='border border-[#bfbfbf] rounded-xl' style={{ backgroundColor: background === "developer" ? "#bfbfbf" : "" }}>
                            <img src={individualSeller} style={{ margin: '.8rem auto', display: 'block' }} alt="developer" width={'33px'} className='md:m-3 m-1' />
                        </div>
                        <p className='mt-2 text-[10px] font-semibold text-center'>{t('signuptype.developer')}</p>
                    </div>
                </div>
                <Box mt={'2rem'}>
                    <FormLabel sx={{ mb: '.5rem', display: 'block', fontWeight: 500, color: '#000' }}>{t('createaccount.enterEmail')}</FormLabel>
                    <TextField sx={{
                        mb: '1.0rem',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '15px',
                            background: '#fff'
                        },
                        '& .MuiInputBase-input': { borderRadius: "15px 0 0 15px" }
                    }}
                        variant='outlined'
                        id="signup-email"
                        type={'email'}
                        fullWidth
                        value={email}
                        placeholder={t('createaccount.emailPlaceholder')}
                        onChange={(e) => { setEmail(e.target.value); setError(false) }}
                        error={email.length > 0 ? false : error}
                        InputProps={{
                            endAdornment: <InputAdornment position='start'><Mail fontSize='small' sx={{ marginLeft: "8px" }} /></InputAdornment>
                        }}
                    />

                    <FormLabel sx={{ mb: '.5rem', display: 'block', fontWeight: 500, color: '#000' }}>{t('createaccount.choosePassword')}</FormLabel>
                    <TextField sx={{
                        mb: '1.0rem',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '15px',
                            background: '#fff'
                        },
                        '& .MuiInputBase-input': { borderRadius: "15px 0 0 15px" }
                    }}
                        variant='outlined'
                        id="signup-new-password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        value={password}
                        error={password.length > 0 ? false : error}
                        onChange={(e) => { handlePasswordChange(e); setError(false) }}
                        placeholder={t('createaccount.passwordPlaceholder')}
                        InputProps={{
                            endAdornment: <InputAdornment position='start'>
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

                    <div className='my-1'>
                        {pwdStrengthScore > 0 && <PasswordStrengthIndicator score={pwdStrengthScore} />}
                        {pwdStrengthScore > 0 && <PasswordStrengthSuggestions score={pwdStrengthScore} />}
                    </div>

                    <FormLabel sx={{ mb: '.5rem', display: 'block', fontWeight: 500, color: '#000' }}>{t('createaccount.confirmPassword')}</FormLabel>
                    <TextField sx={{
                        mb: '1.0rem',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '15px',
                            background: '#fff'
                        },
                        '& .MuiInputBase-input': { borderRadius: "15px 0 0 15px" }
                    }}
                        variant='outlined'
                        id="signup-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        error={confirmPassword.length > 0 ? false : error}
                        onChange={(e) => { setConfirmPassword(e.target.value); setError(false) }}
                        placeholder={t('createaccount.reapeatPasswordPlaceholder')}
                        fullWidth
                        InputProps={{
                            endAdornment:
                                <InputAdornment position='start'>
                                    <IconButton
                                        onClick={handleClickShowConfirmPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                        }}
                    />

                    <Typography mb={3} sx={{ textAlign: "justify", fontStyle: "italic", fontSize: "13px", color: "grey" }}>
                        {t('createaccount.agreement1')} <Link to={'/terms&conditions'} style={{ color: "blue", textDecoration: "underline" }}>{t('footer.termsconditions')}</Link> {t('createaccount.agreement2')} <Link to={'/privacypolicy'} style={{ color: "blue", textDecoration: "underline" }}>{t('footer.privacypolicy')}</Link>. {t('createaccount.agreement3')}
                    </Typography>

                    <LoadingButton
                        size='large'
                        disableElevation
                        fullWidth
                        variant='contained'
                        color='secondary'
                        sx={{ textTransform: 'none', borderRadius: '10px' }}
                        onClick={onSignup}
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
                        ) : t("createaccount.signupButton")}
                    </LoadingButton>

                </Box>

                <Box sx={{
                    mt: '2rem',
                    width: '100%',
                    '& span': {
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' },
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '.5rem',
                    }
                }}>
                    <Typography mb={'1rem'} mt={'2rem'} textAlign={'center'} sx={{ fontSize: '.9rem' }} variant='body2'>{t('createaccount.connect')}</Typography>
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
            </form>
        </div>
    )
}

export default CreateAccount