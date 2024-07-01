import { Close, East, KeyboardArrowRight, SaveAlt } from '@mui/icons-material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { alpha, CircularProgress, Box, Autocomplete, Chip, Button, Container, Grid, IconButton, Stack, styled, Tab, TextField, Typography, Hidden } from '@mui/material'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react'
import { useState } from 'react'
import FileUploadService from '../../services/FileUpload'
import { useTranslation } from "react-i18next";
import RoundButton from '../../components/Buttons/RoundButton'
import Gallery_Icon from '../../assets/images/gallery.png'
import Docimage from '../../assets/images/docimage.png'
import PackageItem from '../../components/PackageItem'
import { useSnackbar } from 'notistack'
import Api from '../../api/api'
import mankeys from "../../assets/images/mankeys.png"
import { isMobile } from 'react-device-detect'
import { motion } from "framer-motion";
import validator from "validator";
import PhoneInput from 'react-phone-number-input'
import en from 'react-phone-number-input/locale/en'
import fr from 'react-phone-number-input/locale/fr'
import imageCompression from 'browser-image-compression'

const InputField = styled(TextField)(({ theme }) => ({
    margin: '.7rem 0',

    '& .MuiOutlinedInput-root': {
        borderRadius: '15px',
        background: '#fff',
    }
}))

const Browse = styled(Box)(({ theme, image }) => ({
    background: image ? null : '#fff',
    backgroundImage: image ? `url(${image})` : null,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '11rem',
    padding: '2rem',
    [theme.breakpoints.down('md')]: {
        height: '12rem',
        padding: '2rem 3rem',

    },
    border: '1px dotted lightgrey',
    borderRadius: '15px',
    cursor: 'pointer',
    position: 'relative',
    '&:hover': {
        borderColor: theme.palette.primary.main
    }
}))

const Onboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const { enqueueSnackbar } = useSnackbar();
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false)
    const [tabIndex, setTabIndex] = useState('1')
    const profilePic = useRef()
    const ghCard = useRef()
    const busDoc = useRef()
    const [disableTab, setDisableTab] = useState({ personal: false, business: true, package: true, finish: true })

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [NAR, setNAR] = useState("")
    const [userType, setUserType] = useState("")
    const [profilePhoto, setProfilePhoto] = useState()
    const [ghanaCard, setGhanaCard] = useState()
    const [businessDoc, setBusinessDoc] = useState([])
    const [businessName, setBusinessName] = useState("")
    const [businessPhone, setBusinessPhone] = useState("")
    const [address, setAddress] = useState("")
    const [businessEmail, setBusinessEmail] = useState("")
    const [location, setLocation] = useState("")
    const [serviceArea, setServiceArea] = useState([])
    const [constantLocation, setConstantLocation] = useState([])
    const [search, setSearch] = useState("")


    const [businessDescription, setBusinessDescription] = useState("")
    const [businessFax, setBusinessFax] = useState("")
    const [zip, setZip] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [country, setCountry] = useState("")
    const [businessCount, setBusinessCount] = useState(1)
    const [businessPosition, setBusinessPosition] = useState("")
    const [facebook, setFacebook] = useState("")
    const [twitter, setTwitter] = useState("")
    const [instagram, setInstagram] = useState("")
    const [linkedIn, setLinkedIn] = useState("")

    const tabHandler = (e, val) => {
        setTabIndex(val)
    }

    let url = "/files/pictures";
    let doc_url = "/files/documents";

    const getProfilePhoto = async (event) => {
        if (event?.target?.files?.length < 1) {
            return
        }

        setLoading(true)
        if (!event.target.files[0]) {
            enqueueSnackbar(t('dashboard.profileimage.validimage'), { variant: 'error' })
            return;
        } else {
            const imageFile = event.target.files[0]
            const options = {
                maxSizeMB: 4,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            }
            const compressedFile = await imageCompression(imageFile, options);

            FileUploadService.upload(compressedFile, url)
                .then((response) => {
                    setProfilePhoto(response.data.path)
                    setLoading(false)
                    setError(false)
                })
                .catch((error) => {
                    setLoading(false)
                });
        }
    };

    const getGhanaCard = (event) => {
        if (event?.target?.files?.length < 1) {
            return
        }

        setLoading(true)
        const file = event.target.files[0]
        if (!file) {
            enqueueSnackbar(t('dashboard.profileimage.validimage'), { variant: 'error' })
            return;
        } else {
            FileUploadService.upload(file, doc_url)
                .then((response) => {
                    setGhanaCard({
                        filename: response?.data?.filename,
                        title: response?.data?.originalname,
                        id_number: null,
                        uri: response?.data?.path,
                        identification_type: "ghana_card"
                    })
                    setLoading(false)
                    setError(false)
                })
                .catch((error) => {
                    setLoading(false)
                });
        }
    };

    const getBusinessDoc = (event) => {
        if (event?.target?.files?.length < 1) {
            return
        }

        setLoading(true)
        const file = event.target.files[0]
        if (!file) {
            enqueueSnackbar(t('dashboard.profileimage.validdoc'), { variant: 'error' })
            return;
        } else {
            FileUploadService.upload(file, doc_url)
                .then((response) => {
                    setBusinessDoc(
                        {
                            title: response?.data?.originalname,
                            filename: response?.data?.filename,
                            uri: response?.data?.path,
                            document_type: "business_registration"
                        })
                    setLoading(false)
                    setError(false)
                })
                .catch((error) => {
                    setLoading(false)
                });
        }
    };

    const onSubmit = (type) => {
        const data = {
            firstName: firstName,
            lastName: lastName,
            NAR: NAR,
            phone: phone,
            avatar: profilePhoto,
            socialLinks: {
                facebook: facebook,
                twitter: twitter,
                instagram: instagram,
                linkedIn: linkedIn
            },
            company: {
                name: businessName,
                phone: businessPhone,
                fax: businessFax,
                description: businessDescription,
                email: businessEmail,
                address: `${address}, ${city}, ${state}. ${country}`,
                addressBreakDown: {
                    address: address,
                    city: city,
                    state: state,
                    country: country,
                    zip: zip
                },
                location: city,
                serviceAreas: serviceArea,
                documents: [businessDoc], 
                profession: businessPosition,
                size: Number(businessCount) || 1
            },
            identifications: [
                {
                    ...ghanaCard
                }
            ],
        }

        setLoading(true)
        Api().patch("/me", data)
            .then((response) => {
                setLoading(false)
                if (type === "draft") {
                    enqueueSnackbar(t('onboard.draftmessage'), { variant: 'success' })
                    setTimeout(() => {
                        navigate("/broker/dashboard")
                    }, 3000)
                } else {
                    setTabIndex('3')
                    closeOnboard(true);
                }
            })
            .catch((error) => {
                setLoading(false)
            })
    }

    // function call that handles the next button
    const nextHandler = (e) => {
        e.preventDefault()

        if (tabIndex === '1') {
            //validate input fields
            if (firstName === undefined || firstName === "") {
                enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
                setError(true)
                return
            }
            if (lastName === undefined || lastName === "") {
                enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
                setError(true)
                return
            }
            if (phone === undefined || phone === "") {
                enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
                setError(true)
                return
            }
            if (phone?.length > 0 && phone?.length < 10) {
                enqueueSnackbar(t('phonevalidationalert'), { variant: 'error' })
                setError(true)
                return
            }
            if (profilePhoto === undefined) {
                enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
                setError(true)
                return
            }
            if (ghanaCard === undefined) {
                enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
                setError(true)
                return
            }
            //move to next tab
            setDisableTab(prev => {
                return { ...prev, personal: false, business: false }
            })
            setTabIndex('2')
        } else
            if (tabIndex === '2') {
                //validate fields
                if (businessName === undefined || businessName === "") {
                    enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
                    setError(true)
                    return
                }
                if (businessPhone === undefined || businessPhone === "") {
                    enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
                    setError(true)
                    return
                }
                if (businessPhone?.length > 0 && businessPhone?.length < 10) {
                    enqueueSnackbar(t('phonevalidationalert'), { variant: 'error' })
                    setError(true)
                    return
                }
                if (address === undefined || address === "") {
                    enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
                    setError(true)
                    return
                }
                if (businessEmail === undefined || businessEmail === "") {
                    enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
                    setError(true)
                    return
                }
                if (city === undefined || city === "") {
                    enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
                    setError(true)
                    return
                }
                if (serviceArea === undefined || serviceArea.length < 1) {
                    enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
                    setError(true)
                    return
                }
                if (!validator.isEmail(businessEmail)) {
                    enqueueSnackbar(t('onboard.validemail'), { variant: 'error' });
                    setError(true)
                    return
                }
                if (businessDoc === undefined) {
                    enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
                    setError(true)
                    return
                }
                //move to next
                setDisableTab(prev => {
                    return { ...prev, personal: false, business: false, package: false }
                })
                onSubmit()
            } else
                if (tabIndex === '3') {
                    //move to next tab
                    setDisableTab(prev => {
                        return { ...prev, personal: false, business: false, package: false, finish: false }
                    })
                }
    }

    const closeOnboard = (force) => {
        if (tabIndex === '3' || force) {
            window.location.assign("/broker/dashboard")
        }
    }

    const stepBack = () => {
        if (tabIndex === '4') setTabIndex('3')
        if (tabIndex === '3') setTabIndex('2')
        if (tabIndex === '2') setTabIndex('1')
    }

    useEffect(() => {
        Api().get("/me")
            .then((response) => {
                setFirstName(response?.data?.firstName)
                setLastName(response?.data?.lastName)
                setPhone(response?.data?.phone)
                setEmail(response?.data?.email)
                setNAR(response?.data?.NAR)
                setUserType(response?.data?.userType)
                setProfilePhoto(response?.data?.avatar)
                setGhanaCard(response?.data?.identifications.find(x => x.identification_type === "ghana_card"))
                setBusinessName(response?.data?.company?.name)
                setBusinessPhone(response?.data?.company?.phone)
                setAddress(response?.data?.company?.address)
                setBusinessEmail(response?.data?.company?.email)
                setLocation(response?.data?.company?.location)
                setServiceArea(response?.data?.company?.serviceAreas)
                setBusinessDoc(response?.data?.company?.documents.find(x => x.document_type === "business_registration"))
            })
            .catch((error) => {

            })
    }, [])

    useEffect(() => {
        //get locations

        if (!search) {
            setConstantLocation([])
            return
        }
        setSearchLoading(true)
        let wherequery = { active: true }
        if (search) {
            let pattern = { like: "^" + search + ".*", options: "i" };
            wherequery.label = pattern
        }

        Api().get('/constants/atlas/locations', {
            params: {
                filter: {
                    text: search,
                    limit: 10
                }
            }
        })
            .then((res) => {
                setConstantLocation(res?.data)
                setSearchLoading(false)
            })
            .catch((error) => {
                setSearchLoading(false)
            })

    }, [search])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })

        var el = document.getElementById("top");

        // To set the scroll
        el.scrollTop = 0;
        el.scrollLeft = 0;
    }, [tabIndex])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box sx={{
                bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.97),
                padding: { xs: '2rem 1rem', sm: '2rem', lg: '3rem' },
                overflow: "scroll",
                height: '100vh'
            }} id="top" className="noScrollBar">
                <Container maxWidth='xl'>
                    <Box sx={{ borderRadius: '15px' }}>
                        <Grid container>
                            <Hidden mdDown>
                                <Grid item lg={5}>
                                    <Box sx={{
                                        padding: '3rem 3rem 0 3rem',
                                        borderRadius: "15px 0 0 15px",
                                        height: '50rem',
                                        position: 'relative',
                                        backgroundImage: `linear-gradient(#fff 60%, #03254C 0%, #03254C 30%, #03254C 65%, #1267B1 0%, #1267B1  )`
                                    }}>
                                        <Typography mb={3} textAlign={'center'} sx={{ fontWeight: 500 }} variant='h5'>{t('onboard.sidenote.welcome')} {firstName}</Typography>
                                        <Typography mb={3}>{t('onboard.sidenote.note')}</Typography>

                                        <span style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                                            <Typography sx={{ fontWeight: 500 }} variant='body2'>{t('onboard.sidenote.fill')}</Typography>
                                            <East fontSize='small' />
                                        </span>
                                        <img src={mankeys} width='80%' alt="" style={{ position: 'absolute', bottom: 0 }} className='mb-auto' />
                                    </Box>
                                </Grid>
                            </Hidden>

                            <Grid item xs={12} sm={12} lg={7} id="top">
                                <Box sx={{
                                    bgcolor: theme => alpha('#fff', 0.95),
                                    borderRadius: { xs: '15px', sm: '15px', lg: "0 15px 15px 0" },
                                    overflowY: 'scroll', height: { xs: '48rem', sm: '48rem', md: '45rem', lg: '50rem' }
                                }} className="noScrollBar">
                                    <Box sx={{ padding: { xs: '2rem', sm: '2rem', lg: '4rem' }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div>
                                            <TabContext value={tabIndex} >
                                                <TabList variant='scrollable' onChange={tabHandler} sx={{ borderBottom: '1px solid lightgrey' }}>
                                                    <Tab color='primary' sx={{ textTransform: 'none' }} disabled={disableTab.personal} disableRipple label={t('onboard.tab1.title')} value="1" />
                                                    <Tab color='primary' sx={{ textTransform: 'none' }} disabled={disableTab.business} disableRipple label={t('onboard.tab2.title')} value="2" />
                                                    {/* <Tab color='primary' sx={{ textTransform: 'none' }} disabled={disableTab.package} disableRipple label={t('onboard.tab3.title')} value="3" /> */}
                                                    {/* <Tab color='primary' sx={{ textTransform: 'none' }} disabled={disableTab.finish} disableRipple label={t('onboard.tab4.title')} value="4" /> */}
                                                </TabList>
                                                <TabPanel value='1' sx={{ padding: { xs: '20px 0px' } }}>
                                                    <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'}>
                                                        <Typography variant='body2' color={'textSecondary'} sx={{ width: '10rem' }}>{t('onboard.tab1.firstname')}</Typography>
                                                        <InputField
                                                            id="first-name"
                                                            type="text"
                                                            variant='outlined'
                                                            value={firstName === null ? "" : firstName}
                                                            error={firstName?.length > 0 ? false : error}
                                                            onChange={(e) => { setFirstName(e.target.value); setError(false) }}
                                                            fullWidth
                                                            placeholder={t('onboard.tab1.firstnameplaceholder')}
                                                        />
                                                    </Box>
                                                    <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'}>
                                                        <Typography variant='body2' color={'textSecondary'} sx={{ width: '10rem' }}>{t('onboard.tab1.lastname')}</Typography>
                                                        <InputField
                                                            id="last-name"
                                                            type="text"
                                                            variant='outlined'
                                                            value={lastName === null ? "" : lastName}
                                                            error={lastName?.length > 0 ? false : error}
                                                            onChange={(e) => { setLastName(e.target.value); setError(false) }}
                                                            fullWidth
                                                            placeholder={t('onboard.tab1.lastnameplaceholder')}
                                                        />
                                                    </Box>
                                                    <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'}>
                                                        <Typography variant='body2' color={'textSecondary'} sx={{ width: '10rem' }}>{t('onboard.tab1.phone')}</Typography>
                                                        {/* <InputField
                                                            id="phone-number"
                                                            type="number"
                                                            variant='outlined'
                                                            value={phone}
                                                            onKeyDown={(e) => {
                                                                if (e.keyCode === 38 || e.keyCode === 40) {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                            onWheel={(e) => e.target.blur()}
                                                            error={phone?.length > 0 ? false : error}
                                                            onChange={(e) => { setPhone(e.target.value); setError(false) }}
                                                            fullWidth
                                                            placeholder={t('onboard.tab1.phoneplaceholder')}
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
                                                    </Box>
                                                    <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'}>
                                                        <Typography variant='body2' color={'textSecondary'} sx={{ width: '10rem' }}>{t('onboard.tab1.email')}</Typography>
                                                        <InputField
                                                            id="email"
                                                            type="email"
                                                            variant='outlined'
                                                            value={email}
                                                            disabled
                                                            fullWidth
                                                        />
                                                    </Box>
                                                    {userType === 'realtor' ? <>
                                                        <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'}>
                                                            <Typography variant='body2' color={'textSecondary'} sx={{ width: '10rem' }}>{t('onboard.tab1.nar')}</Typography>
                                                            <InputField
                                                                id="nar"
                                                                type="text"
                                                                variant='outlined'
                                                                value={NAR}
                                                                onChange={(e) => { setNAR(e.target.value) }}
                                                                fullWidth
                                                                placeholder={t('onboard.tab1.narplaceholder')}
                                                            />
                                                        </Box>
                                                        <Typography sx={{ fontSize: '12px', color: 'red', fontStyle: 'italic' }}>{t('onboard.tab1.nardisclaimer')}</Typography>
                                                    </> : <></>}

                                                    <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'}>
                                                        <Typography sx={{ width: '10rem' }} />
                                                        <Grid container spacing={2} sx={{ mt: '1rem' }}>
                                                            <input type={'file'} accept="image/x-png,image/gif,image/jpeg, image/jpg" onChange={getProfilePhoto} ref={profilePic} style={{ display: 'none' }} />
                                                            <input type={'file'} accept="application/msword, application/pdf, image/x-png,image/gif,image/jpeg, image/jpg" onChange={getGhanaCard} ref={ghCard} style={{ display: 'none' }} />

                                                            {/* Profile Image */}
                                                            <Grid item xs={12} sm={12} md={6}>
                                                                <Stack>
                                                                    <Browse image={profilePhoto} onClick={() => profilePic.current.click()} sx={{ border: error && profilePhoto === undefined ? `1px solid red` : "" }}>
                                                                        {
                                                                            profilePhoto ?
                                                                                <Box sx={{ height: '6rem', width: { xs: '5rem', sm: '5rem', lg: '10rem' } }}>
                                                                                    <IconButton
                                                                                        sx={{ background: '#ffffff80', position: 'absolute', top: '10%', right: '5%', padding: '.3rem' }}>
                                                                                        <Close sx={{ fontSize: '1rem' }} />
                                                                                    </IconButton>
                                                                                </Box>
                                                                                :
                                                                                <Box>
                                                                                    <img src={Gallery_Icon} style={{ margin: '1rem auto' }} width='30%' alt='browse_profile_pic' />
                                                                                    <Typography sx={{ fontSize: '.7rem' }} color='primary' textAlign='center'>{t('onboard.tab1.clickbrowse')}</Typography>
                                                                                </Box>
                                                                        }
                                                                    </Browse>
                                                                    <Typography my={1} textAlign={'center'} sx={{ fontSize: '.8rem' }}>{t('onboard.tab1.profilepicture')}</Typography>
                                                                </Stack>
                                                            </Grid>

                                                            {/* Ghana Card */}
                                                            <Grid item xs={12} sm={12} md={6}>
                                                                <Stack>
                                                                    <Browse onClick={() => ghCard.current.click()} sx={{ border: error && ghanaCard === undefined ? `1px solid red` : "" }}>
                                                                        {
                                                                            ghanaCard ?
                                                                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                                    <img src={Docimage} width={90} alt="preview" />
                                                                                </Box>
                                                                                :
                                                                                <Box>
                                                                                    <img src={Gallery_Icon} style={{ margin: '1rem auto' }} width='30%' alt='browse_ghana_card' />
                                                                                    <Typography sx={{ fontSize: '.7rem' }} color='primary' textAlign='center'>{t('onboard.tab1.clickbrowse')}</Typography>
                                                                                </Box>
                                                                        }
                                                                    </Browse>
                                                                    <Typography my={1} textAlign={'center'} sx={{ fontSize: '.8rem' }}>{t('onboard.tab1.ghanacard')}</Typography>
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </TabPanel>

                                                {/* BUSINESS DETAILS */}
                                                <TabPanel value='2' sx={{ padding: { xs: '20px 0px' } }}>
                                                    <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'}>
                                                        <Typography variant='body2' color={'textSecondary'} sx={{ width: '10rem' }}>{t('onboard.tab2.businessname')}</Typography>
                                                        <InputField
                                                            id="business-name"
                                                            type="text"
                                                            variant='outlined'
                                                            value={businessName}
                                                            error={businessName?.length > 0 ? false : error}
                                                            onChange={(e) => { setBusinessName(e.target.value); setError(false) }}
                                                            fullWidth
                                                            placeholder={t('onboard.tab2.businessnameplaceholder')}
                                                        />
                                                    </Box>
                                                    <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'}>
                                                        <Typography variant='body2' color={'textSecondary'} sx={{ width: '10rem' }}>{t('onboard.tab2.businessdescription')}</Typography>
                                                        <InputField
                                                            id="business-description"
                                                            type="text"
                                                            variant='outlined'
                                                            value={businessDescription}
                                                            onChange={(e) => { setBusinessDescription(e.target.value);}}
                                                            fullWidth multiline
                                                            rows={5}
                                                            placeholder={t('onboard.tab2.businessdescriptionplaceholder')}
                                                        />
                                                    </Box>
                                                    <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'} sx={{marginTop: '0.6rem', marginBottom: '0.6rem'}}>
                                                        <Typography variant='body2' color={'textSecondary'} sx={{ width: '10rem' }}>{t('onboard.tab2.businessphone')}</Typography>
                                                        <PhoneInput
                                                            placeholder={t('onboard.tab2.businessphoneplaceholder')}
                                                            labels={localStorage.getItem('i18nextLng') === 'en' ? en : fr}
                                                            international
                                                            initialValueFormat="national"
                                                            countryCallingCodeEditable={false}
                                                            defaultCountry="GH"
                                                            value={businessPhone}
                                                            onChange={setBusinessPhone}
                                                            style={{
                                                                border: "1px solid #0000003b",
                                                                borderRadius: "15px",
                                                                padding: "16.5px 14px",
                                                                backgroundColor: "#fff",
                                                                width: "100%"
                                                            }}
                                                            className={"input-phone-number"}
                                                        />
                                                    </Box>
                                                    <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'} sx={{marginTop: '1.2rem', marginBottom: '0.6rem'}}>
                                                        <Typography variant='body2' color={'textSecondary'} sx={{ width: '10rem' }}>{t('onboard.tab2.businessfax')}</Typography>
                                                        <PhoneInput
                                                            placeholder={t('onboard.tab2.businessfaxplaceholder')}
                                                            labels={localStorage.getItem('i18nextLng') === 'en' ? en : fr}
                                                            international
                                                            initialValueFormat="national"
                                                            countryCallingCodeEditable={false}
                                                            defaultCountry="GH"
                                                            value={businessFax}
                                                            onChange={setBusinessFax}
                                                            style={{
                                                                border: "1px solid #0000003b",
                                                                borderRadius: "15px",
                                                                padding: "16.5px 14px",
                                                                backgroundColor: "#fff",
                                                                width: "100%"
                                                            }}
                                                            className={"input-phone-number"}
                                                        />
                                                    </Box>
                                                    <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'}>
                                                        <Typography variant='body2' color={'textSecondary'} sx={{ width: '10rem' }}>{t('onboard.tab2.businessemail')}</Typography>
                                                        <InputField
                                                            id="business-email"
                                                            type="email"
                                                            variant='outlined'
                                                            value={businessEmail}
                                                            error={businessEmail?.length > 0 ? false : error}
                                                            onChange={(e) => { setBusinessEmail(e.target.value); setError(false) }}
                                                            fullWidth
                                                            placeholder={t('onboard.tab2.businessemail')}
                                                        />
                                                    </Box>
                                                    <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'} sx={{marginTop: '3.2rem'}}>
                                                        <Typography variant='body2' color={'textSecondary'} sx={{ width: '10rem' }}>{t('onboard.tab2.address')}</Typography>
                                                        <Box className='flex w-full' gap='2rem' >
                                                            <InputField
                                                                id="address"
                                                                type="text"
                                                                variant='outlined'
                                                                value={address}
                                                                error={address?.length > 0 ? false : error}
                                                                onChange={(e) => { setAddress(e.target.value); setError(false) }}
                                                                fullWidth
                                                                placeholder={t('onboard.tab2.addressplaceholder')}
                                                            />
                                                            <InputField
                                                                id="zip"
                                                                type="text"
                                                                variant='outlined'
                                                                value={zip}
                                                                onChange={(e) => { setZip(e.target.value);}}
                                                                
                                                                placeholder={t('onboard.tab2.zipplaceholder')}
                                                            />
                                                        </Box>
                                                    </Box>
                                                    <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'}>
                                                        <Typography variant='body2' color={'textSecondary'} sx={{ width: '10rem' }}></Typography>
                                                        <Box className='flex w-full' gap='2rem' >
                                                            <InputField
                                                                id="city"
                                                                type="text"
                                                                variant='outlined'
                                                                value={city}
                                                                onChange={(e) => { setCity(e.target.value);}}
                                                                fullWidth
                                                                placeholder={t('onboard.tab2.cityplaceholder')}
                                                            />
                                                            <InputField
                                                                id="state"
                                                                type="text"
                                                                variant='outlined'
                                                                value={state}
                                                                onChange={(e) => { setState(e.target.value);}}
                                                                fullWidth
                                                                placeholder={t('onboard.tab2.stateplaceholder')}
                                                            />
                                                            <InputField
                                                                id="country"
                                                                type="text"
                                                                variant='outlined'
                                                                value={country}
                                                                onChange={(e) => { setCountry(e.target.value);}}
                                                                fullWidth
                                                                placeholder={t('onboard.tab2.countryplaceholder')}
                                                            />
                                                        </Box>
                                                    </Box>
                                                    {/* <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'}>
                                                        <Typography variant='body2' color={'textSecondary'} sx={{ width: '10rem' }}>{t('onboard.tab2.location')}</Typography>
                                                        <InputField
                                                            id="location"
                                                            type="text"
                                                            value={location}
                                                            error={location?.length > 0 ? false : error}
                                                            onChange={(e) => { setLocation(e.target.value); setError(false) }}
                                                            variant='outlined'
                                                            fullWidth
                                                            placeholder={t('onboard.tab2.locationplaceholder')}
                                                        />
                                                    </Box> */}
                                                    <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'}>
                                                        <Typography variant='body2' color={'textSecondary'} sx={{ width: '10rem' }}>{t('onboard.tab2.serviceareas')}</Typography>

                                                        <Autocomplete
                                                            multiple
                                                            id="tags-filled"
                                                            getOptionLabel={(option) => option}
                                                            loading={searchLoading}
                                                            options={constantLocation.map((option) => option.label)}
                                                            fullWidth
                                                            value={serviceArea}
                                                            onChange={(event, newValue) => {
                                                                setServiceArea(newValue);
                                                            }}
                                                            freeSolo
                                                            renderTags={(value, getTagProps) =>
                                                                value.map((option, index) => (
                                                                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                                                ))
                                                            }
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    sx={{
                                                                        '& .MuiOutlinedInput-root': {
                                                                            borderRadius: '15px',
                                                                            background: '#fff',
                                                                        },
                                                                        margin: '.7rem 0'
                                                                    }}
                                                                    variant="outlined"
                                                                    placeholder={t('onboard.tab2.serviceareas')}
                                                                    onChange={(e) => setSearch(e.target.value)}
                                                                />
                                                            )}
                                                        />
                                                    </Box>


                                                    <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'} sx={{marginTop: '3.2rem'}}>
                                                        <Typography variant='body2' color={'textSecondary'} sx={{ width: '10rem' }}>{t('onboard.tab2.businesscount')}</Typography>
                                                        <InputField
                                                            id="business-count"
                                                            type="number"
                                                            variant='outlined'
                                                            value={businessCount}
                                                            onChange={(e) => { setBusinessCount(e.target.value);}}
                                                            fullWidth
                                                            placeholder={t('onboard.tab2.businesscountplaceholder')}
                                                        />
                                                    </Box>
                                                    <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'}>
                                                        <Typography variant='body2' color={'textSecondary'} sx={{ width: '10rem' }}>{t('onboard.tab2.businessposition')}</Typography>
                                                        <InputField
                                                            id="business-position"
                                                            type="text"
                                                            variant='outlined'
                                                            value={businessPosition}
                                                            onChange={(e) => { setBusinessPosition(e.target.value);}}
                                                            fullWidth
                                                            placeholder={t('onboard.tab2.businesspositionplaceholder')}
                                                        />
                                                    </Box>


                                                    <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'} sx={{marginTop: '3.2rem'}}>
                                                        <Typography variant='body2' color={'textSecondary'} sx={{ width: '10rem' }}>{t('onboard.tab2.facebook')}</Typography>
                                                        <InputField
                                                            id="facebook"
                                                            type="text"
                                                            variant='outlined'
                                                            value={facebook}
                                                            onChange={(e) => { setFacebook(e.target.value);}}
                                                            fullWidth
                                                            placeholder={t('onboard.tab2.facebook')}
                                                        />
                                                    </Box>
                                                    <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'}>
                                                        <Typography variant='body2' color={'textSecondary'} sx={{ width: '10rem' }}>{t('onboard.tab2.instagram')}</Typography>
                                                        <InputField
                                                            id="instagram"
                                                            type="text"
                                                            variant='outlined'
                                                            value={instagram}
                                                            onChange={(e) => { setInstagram(e.target.value);}}
                                                            fullWidth
                                                            placeholder={t('onboard.tab2.instagram')}
                                                        />
                                                    </Box>
                                                    <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'}>
                                                        <Typography variant='body2' color={'textSecondary'} sx={{ width: '10rem' }}>{t('onboard.tab2.linkedIn')}</Typography>
                                                        <InputField
                                                            id="linkedIn"
                                                            type="text"
                                                            variant='outlined'
                                                            value={linkedIn}
                                                            onChange={(e) => { setLinkedIn(e.target.value);}}
                                                            fullWidth
                                                            placeholder={t('onboard.tab2.linkedIn')}
                                                        />
                                                    </Box>
                                                    <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'}>
                                                        <Typography variant='body2' color={'textSecondary'} sx={{ width: '10rem' }}>{t('onboard.tab2.twitter')}</Typography>
                                                        <InputField
                                                            id="twitter"
                                                            type="text"
                                                            variant='outlined'
                                                            value={twitter}
                                                            onChange={(e) => { setTwitter(e.target.value);}}
                                                            fullWidth
                                                            placeholder={t('onboard.tab2.twitter')}
                                                        />
                                                    </Box>

                                                    {/* Business Docs */}
                                                    <Box display={{ xs: 'block', sm: 'flex', lg: 'flex' }} gap='2rem' alignItems={'center'}>
                                                        <Typography sx={{ width: '10rem' }} />
                                                        <Grid container spacing={2} sx={{ mt: '1rem' }}>
                                                            <input type={'file'} onChange={getBusinessDoc} accept="application/msword, application/pdf, image/x-png,image/gif,image/jpeg, image/jpg" ref={busDoc} style={{ display: 'none' }} />
                                                            <Grid item xs={12}>
                                                                <Stack sx={{ width: { xs: '100%', sm: '50%', lg: '50%' } }}>
                                                                    <Browse onClick={() => busDoc.current.click()} sx={{ border: error && businessDoc ? `1px solid red` : "" }}>
                                                                        {
                                                                            businessDoc ?
                                                                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                                    <img src={Docimage} width={90} alt="preview" />
                                                                                </Box>
                                                                                :
                                                                                <>
                                                                                    <img src={Gallery_Icon} style={{ margin: '5px auto' }} width='30%' alt='browse_ghana_card' />
                                                                                    <Typography sx={{ fontSize: '.7rem' }} color='primary' textAlign='center'>{t('onboard.tab1.clickbrowse')}</Typography>
                                                                                </>
                                                                        }
                                                                    </Browse>
                                                                    <Typography mt={1} textAlign={'center'} sx={{ fontSize: '.8rem' }}>{t('onboard.tab2.businessregistration')}</Typography>
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </TabPanel>

                                                {/* SUBSCRIPTION */}
                                                {/* <TabPanel value='3' sx={{ padding: 0 }}>
                                                    <Typography textAlign={'center'} mt='1rem' sx={{ fontWeight: 300 }} variant='h6' ><span style={{ color: '#03254C', fontWeight: 700 }}>{t('onboard.tab3.heading1')}</span> {t('onboard.tab3.heading2')}</Typography>
                                                    <Typography textAlign={'center'} mb={'2rem'} sx={{ fontWeight: 300 }} variant='body2'>or <span onClick={()=>{
                                                        window.location.assign('/broker/dashboard')
                                                    }} style={{ color: '#5b9c00', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer'}}>{t('onboard.tab3.heading3')}</span></Typography>

                                                    <PackageItem
                                                        userType={currentUser?.profile?.userType ? currentUser?.profile?.userType : currentUser?.userType}
                                                        lightPrice={2399} plusPrice={3899} realtorPrice={5099} devPrice={5999}
                                                    />

                                                </TabPanel> */}

                                                {/* <TabPanel value='4'>
                                                    <Box sx={{
                                                        '& > img': {
                                                            width: { xs: '100%', sm: '100%', lg: '80%' }
                                                        }
                                                    }}>
                                                        <Typography mt={3} variant='h6' textAlign={'center'} sx={{ fontWeight: 600 }}>{t('onboard.tab4.title')}</Typography>
                                                        <Typography textAlign={'center'} variant='body2'>{t('onboard.tab4.note')}</Typography>
                                                        <img src={Finish} alt='finish' style={{ margin: '1rem auto' }} />
                                                    </Box>
                                                </TabPanel> */}
                                            </TabContext>
                                        </div>

                                        {tabIndex === '3' ? null :
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '3rem' }}>
                                                <Box sx={{ display: 'flex', gap: '1rem' }}>
                                                    {tabIndex === '1' ? null : <RoundButton onClick={stepBack} text={t('onboard.back')} variant='outlined' disableElevation sx={{ padding: '.35rem 1.5rem' }} />}
                                                    <div>
                                                        <RoundButton
                                                            onClick={(e) => { nextHandler(e); closeOnboard() }}
                                                            variant={'contained'}
                                                            disableElevation sx={{ padding: '.35rem 2rem' }}
                                                            endIcon={<KeyboardArrowRight fontSize='small' />}
                                                            disable={loading}
                                                            progress={loading && (
                                                                <CircularProgress
                                                                    size={20}
                                                                    sx={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        color: "white",
                                                                        margin: "3px 0"
                                                                    }}
                                                                />
                                                            )}
                                                            text={loading || (tabIndex === '2' ? t('onboard.save') : tabIndex === '4' ? t('onboard.close') : t('onboard.next'))}
                                                        />
                                                    </div>
                                                </Box>
                                                <div onClick={() => onSubmit("draft")}>
                                                    <Button variant='text' sx={{ textTransform: 'none' }} endIcon={<SaveAlt fontSize='small' />}>{isMobile ? null : t('onboard.draft')}</Button>
                                                </div>
                                            </Box>
                                        }
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Box>

        </motion.div>
    )
}

export default Onboard