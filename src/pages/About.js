import { South } from '@mui/icons-material'
import { alpha, Box, Container, Divider, CircularProgress, FormLabel, Grid, IconButton, styled, TextField, Typography, Hidden } from '@mui/material'
import { grey } from '@mui/material/colors'
import React, { useState, useEffect } from 'react'
import BannerImg from '../assets/images/aboutimg.jpg'
import AboutUs from '../assets/images/about_us.png'
import Grepa from '../assets/images/GREPA.png'
import Realtor from '../assets/images/realtorlogo.jpg'
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack'
import OwlCarousel from 'react-owl-carousel'
import Api from '../api/api'
import { isLoggedIn } from '../services/auth'
import { motion } from "framer-motion";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import RoundButton from '../components/Buttons/RoundButton'
import { HashLink } from 'react-router-hash-link'
import PhoneInput from 'react-phone-number-input'
import en from 'react-phone-number-input/locale/en'
import fr from 'react-phone-number-input/locale/fr'

const Banner = styled(Box)(({ theme }) => ({
    padding: '3rem 0',
    height: { xs: '100vh', md: '70vh' },
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundImage: `linear-gradient( 180deg, rgba(0,0,0, 80%), rgba(0,0,0, 80%)), url(${BannerImg})`
}))

const MemberSlider = styled(OwlCarousel)(({ theme }) => ({
    '& .owl-carousel': {
        position: 'relative',
        '&:hover .owl-nav': {
            opacity: 1
        }
    },
    '& .owl-nav': {
        // opacity: 0,
        width: '100%',
        position: 'absolute',
        display: 'flex',
        top: '20%',
        justifyContent: 'space-between',
        transform: 'TranslateY(50%)',
        transition: 'all .2s ease-in'
    },
    '& .owl-prev': {
        padding: '1rem',
        background: alpha('#000', 0.5),
        color: '#fff'

    },
    '& .owl-next': {
        padding: '1rem',
        background: alpha('#000', 0.5),
        color: '#fff'
    }
}))

const TextInput = styled(TextField)(({ theme }) => ({
    marginBottom: '1rem',
    '& .MuiOutlinedInput-root': {
        background: '#fff',
        borderRadius: '15px'
    }
}))

const TextInputLabel = styled(FormLabel)(({ theme }) => ({
    color: alpha('#fff', 0.5),
    marginBottom: '.5rem',
    display: 'block'
}))


const About = () => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [loading, setLoading] = useState(false)
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [message, setMessage] = useState('')
    const [error, setError] = useState(false)

    useEffect(() => {
        if (isLoggedIn()) {
            Api().get("/me")
                .then((response) => {
                    setFullName(response?.data?.firstName + " " + response?.data?.lastName)
                    setEmail(response?.data?.email)
                    setPhone(response?.data?.phone)
                })
                .catch(() => { })
        }

        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, []);

    const contactUs = async (e) => {
        e.preventDefault();

        if (fullName.length < 1 || phone.length < 1 || email.length < 1 || message.length < 1) {
            enqueueSnackbar(t('gethelp.contactus.emptyfields'), { variant: 'error' })
            setError(true)
        } else {
            setLoading(true)

            const token = await executeRecaptcha('contactusForm')

            if (token.length > 0) {
                const contactData = {
                    fullname: fullName,
                    phone: phone,
                    message: message,
                    email: email,
                    subject: "Anonymous Contact Form",
                    recaptcha: token
                }

                Api().post('/emails/contact-us/anonymous', contactData)
                    .then((res) => {
                        setLoading(false)
                        enqueueSnackbar('Message sent successfully', { variant: 'success' })
                        setMessage('')
                        setFullName("")
                        setPhone("")
                        setEmail("")
                    })
                    .catch((error) => {
                        setLoading(false)
                        enqueueSnackbar('Message not sent', { variant: 'error' })
                    })
            }
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box >
                <Banner>
                    <Container sx={{ height: '100%' }} maxWidth='xl'>
                        {/* Banner */}
                        <Grid container sx={{ height: 'inherit', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Grid item xs={12} lg={5}>
                                <Typography variant='h4' sx={{
                                    fontWeight: 600,
                                    fontSize: {sm:'1.5rem', md:'3.5rem'},
                                    color: '#fff'
                                }}>{t('aboutus.banner.maintext1')}
                                </Typography>
                                <Divider sx={{
                                    margin: '2rem 0',
                                    bgcolor: 'primary.main',
                                    height: '5px',
                                    border: 'none'
                                }} />
                                <Typography variant='body1' sx={{ color: '#fff' }}>{t('aboutus.banner.subtext')}</Typography>
                            </Grid>
                        </Grid>
                    </Container>
                </Banner>

                {/* Service Bar */}
                <Box sx={{ bgcolor: 'secondary.main', padding: '3rem', color: '#fff', textAlign: 'center' }}>
                    <Container maxWidth='xl'>
                        <Typography variant='h5' sx={{ fontWeight: 600 }} >{t('aboutus.services.title')}</Typography>
                    </Container>
                </Box>

                <Box sx={{
                    background: grey[100],
                    padding: {md: '5rem 0', xs: '1rem 0'},
                    '& h5': {
                        color: 'primary.main',
                        marginBottom: '1rem',
                        lineHeight: 1.3,
                        fontWeight: 600,
                    }
                }}>
                    <Container maxWidth='xl'>
                        <Grid container sx={{ margin: '3rem 0' }}>
                            {/* <Grid item xs={12} sm={6} md={6} lg={3} sx={{ padding: '2rem', borderRight: '1px solid lightgrey' }}>
                                <Typography variant='h5' dangerouslySetInnerHTML={{ __html: t('aboutus.services.service1.title') }} />
                                <Typography variant='body2' color={'textSecondary'} paragraph>{t('aboutus.services.service1.note')}</Typography>
                            </Grid> */}
                            <Grid item xs={12} sm={6} md={6} lg={4} sx={{ paddingRight: '2rem', paddingLeft: '2rem' }}>
                                <HashLink to={"#contactUs"}>
                                    <Typography variant='h5' dangerouslySetInnerHTML={{ __html: t('aboutus.services.service2.title') }} />
                                    <Typography variant='body2' color={'textSecondary'} paragraph>{t('aboutus.services.service2.note')}</Typography>
                                </HashLink>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={4} sx={{  paddingRight: '2rem', paddingLeft: '2rem' }}>
                                <HashLink to={"#contactUs"}>
                                    <Typography variant='h5' dangerouslySetInnerHTML={{ __html: t('aboutus.services.service3.title') }} />
                                    <Typography variant='body2' color={'textSecondary'} paragraph>{t('aboutus.services.service3.note')}</Typography>
                                </HashLink>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={4} sx={{  paddingRight: '2rem', paddingLeft: '2rem'}} >
                                <HashLink to={"#contactUs"}>
                                    <Typography variant='h5' dangerouslySetInnerHTML={{ __html: t('aboutus.services.service4.title') }} />
                                    <Typography variant='body2' color={'textSecondary'} paragraph>{t('aboutus.services.service4.note')}</Typography>
                                </HashLink>
                            </Grid>
                        </Grid>

                        <Container>
                            <Box sx={{
                                mb: '5rem',
                                marginTop: '5rem',
                                padding: '1.5rem',
                                bgcolor: 'secondary.main',
                                color: '#fff',
                                textAlign: 'center',
                                borderRadius: '50px 0 50px 0'
                            }}>
                                <Typography variant='h6' mb={3} sx={{ fontWeight: 600, textTransform: 'capitalize'}}>{t('aboutus.moreofyou.title')}</Typography>
                                <Typography variant='body1'>{t('aboutus.moreofyou.note')}</Typography>
                            </Box>

                            {/* Testimonials
                            <Testimonial
                                name={'Anthony Mensah'}
                                content={t('aboutus.ceomessage.note')}
                                title={'C.E.O - ReHome'}
                            /> */}
                            <div id="contactUs" />

                        </Container>
                    </Container>
                </Box>

                {/* Contact Section */}

                <Box sx={{ bgcolor: 'gray', }}>
                    <form id="contactusForm">
                        <Container maxWidth='xl'>
                            <Grid container spacing={5} pb={5}>
                                <Grid item xs={12} md={4}>
                                    <img src={AboutUs} alt='about_us' />
                                </Grid>
                                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                                    <Typography mt={4} mb={4} variant='h5' sx={{ fontWeight: 800, color: '#fff' }}>{t('aboutus.contactus.title')}</Typography>
                                    <TextInputLabel sx={{ color: alpha('#fff', 0.5), marginBottom: '.5rem', display: 'block' }}>{t('aboutus.contactus.fullname')}</TextInputLabel>
                                    <TextInput
                                        value={fullName}
                                        error={fullName?.length > 0 ? false : error}
                                        onChange={(e) => { setFullName(e.target.value); setError(false) }}
                                        fullWidth
                                        placeholder={t('aboutus.contactus.fullnameplaceholder')}
                                    />

                                    <TextInputLabel sx={{ color: alpha('#fff', 0.5), marginBottom: '.5rem', display: 'block' }}>{t('aboutus.contactus.email')}</TextInputLabel>
                                    <TextInput
                                        value={email}
                                        error={email?.length > 0 ? false : error}
                                        onChange={(e) => { setEmail(e.target.value); setError(false) }}
                                        fullWidth
                                        placeholder={t('aboutus.contactus.emailplaceholder')}
                                    />

                                    <TextInputLabel sx={{ color: alpha('#fff', 0.5), marginBottom: '.5rem', display: 'block' }}>{t('aboutus.contactus.phone')}</TextInputLabel>
                                    {/* <TextInput
                                        type="number"
                                        onKeyDown={(e) => {
                                            if (e.keyCode === 38 || e.keyCode === 40) {
                                                e.preventDefault();
                                            }
                                        }}
                                        onWheel={(e) => e.target.blur()}
                                        value={phone}
                                        error={phone?.length > 0 ? false : error}
                                        onChange={(e) => { setPhone(e.target.value); setError(false) }}
                                        fullWidth
                                        placeholder={t('aboutus.contactus.phone')}
                                    /> */}
                                    <PhoneInput
                                        placeholder="Enter phone number"
                                        labels={localStorage.getItem('i18nextLng') === 'en' ? en : fr}
                                        international
                                        initialValueFormat="national"
                                        countryCallingCodeEditable={false}
                                        defaultCountry="GH"
                                        value={phone}
                                        onChange={setPhone}
                                        style={{
                                            border: "1px solid #0000003b",
                                            marginBottom: "1rem",
                                            borderRadius: "15px",
                                            padding: "16.5px 14px",
                                            backgroundColor: "#fff",
                                            width: "100%"
                                        }}
                                        className={"input-phone-number"}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                                    <TextInputLabel sx={{ color: alpha('#fff', 0.5), marginBottom: '.5rem', marginTop: { md: "4rem" }, display: 'block' }}>{t('aboutus.contactus.message')}</TextInputLabel>
                                    <TextInput
                                        value={message}
                                        error={message?.length > 0 ? false : error}
                                        onChange={(e) => { setMessage(e.target.value); setError(false) }}
                                        multiline
                                        rows={6}
                                        fullWidth
                                        placeholder={t('aboutus.contactus.messageplaceholder')}
                                    />

                                    <RoundButton
                                        sx={{ marginTop: "20px", paddingTop: ".5rem", paddingBottom: ".5rem" }}
                                        onClick={contactUs}
                                        size={'small'}
                                        disableElevation={true}
                                        color={'secondary'}
                                        variant='contained'
                                        text={t('aboutus.contactus.send')}
                                        progress={loading && (
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
                                    />
                                </Grid>
                            </Grid>
                        </Container>
                    </form>
                </Box>

                <Container maxWidth='xl' sx={{ margin: "3rem 0" }}>
                    <Typography variant='h5' sx={{ fontWeight: 600 }} textAlign={"center"} mb={5}>{t('aboutus.members.title')}</Typography>
                    <div class="scroll-parent">
                        <div class="scroll-element primary">
                            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                                <img src={Grepa} alt="partners" style={{ width: "300px" }} />
                                <Hidden smDown>
                                    <img src={Realtor} alt="partners" style={{ width: "150px" }} />
                                </Hidden>
                            </Box>
                        </div>
                        <div class="scroll-element secondary">
                            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                                <Hidden smDown>
                                    <img src={Grepa} alt="partners" style={{ width: "300px" }} />
                                </Hidden>
                                <img src={Realtor} alt="partners" style={{ width: "150px" }} />
                            </Box>
                        </div>
                    </div>
                </Container>
            </Box>
        </motion.div>
    )
}

export default About