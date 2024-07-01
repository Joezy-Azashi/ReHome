import { Call, CheckCircle, Close, BedOutlined, Favorite, FiberManualRecord, ShowerOutlined, AccountBalanceWalletOutlined, Collections, FavoriteBorder, PermPhoneMsg, PinDrop, Place, ReplyOutlined, TaskAlt, Videocam, ViewInAr, Reply } from '@mui/icons-material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { ExpandMore } from '@mui/icons-material'
import { alpha, Backdrop, Box, Container, Accordion, Button, Dialog, DialogContent, AccordionDetails, AccordionSummary, Divider, CircularProgress, Grid, IconButton, ImageList, ImageListItem, List, ListItem, ListItemIcon, ListItemText, Popover, styled, Tab, Typography, Tooltip } from '@mui/material'
import NoImage from '../assets/images/no-image.jpg'
import verifieddocs from '../assets/images/verifieddocs.png'
import login from '../assets/images/loginIcon.png';
import signUp from '../assets/images/signUpIcon.png';
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AmenitiesItem from '../components/AmenitiesItem'
import RoundButton from '../components/Buttons/RoundButton'
import GroupSocials from '../components/Social/GroupSocials'
import Api from '../api/api'
import { isLoggedIn } from '../services/auth'
import { useTranslation } from "react-i18next";
import { PopupButton } from "react-calendly";
import { useSnackbar } from 'notistack'
import { motion } from "framer-motion";
import { isMobile } from 'react-device-detect';
import RateContext from '../contexts/rateContext'
import SocialMediaShare from '../components/Social/SocialMediaShare'
import PropertyContactForm from '../components/PropertyContactForm'
import CustomerCompleteProfile from '../components/CustomerCompleteProfile'
import PhotoPreview from '../components/PhotoPreview'
import UnitPreview from '../components/UnitPreview'
import PillButton from '../components/Buttons/PillButton'
import OwlCarousel from 'react-owl-carousel'

const MuiAccordion = styled(Accordion)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}))

const MuiAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
    background: 'rgba(0, 0, 0, .03)',
}))


const PropertySlider = styled(OwlCarousel)(({ theme }) => ({
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
        top: '30%',
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

export const SubMenu = ({ active, clickHandle }) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem' }}>
            <Typography variant='body2' color={active === 'about' && 'primary'} sx={{ cursor: 'pointer', fontWeight: active === 'about' && 600 }} onClick={() => clickHandle('about')}>About</Typography>
            <Divider flexItem orientation='vertical' />
            <Typography variant='body2' color={active === 'amenities' && 'primary'} sx={{ cursor: 'pointer', fontWeight: active === 'amenities' && 600 }} onClick={() => clickHandle('amenities')}>Amenities</Typography>
            <Divider flexItem orientation='vertical' />
            <Typography variant='body2' color={active === 'features' && 'primary'} sx={{ cursor: 'pointer', fontWeight: active === 'features' && 600 }} onClick={() => clickHandle('features')}>Features</Typography>
            <Divider flexItem orientation='vertical' />
            <Typography variant='body2' color={active === 'interest' && 'primary'} sx={{ cursor: 'pointer', fontWeight: active === 'interest' && 600 }} onClick={() => clickHandle('interest')}>Points of Interest</Typography>
            <Divider flexItem orientation='vertical' />
            <Typography variant='body2' color={active === 'location' && 'primary'} sx={{ cursor: 'pointer', fontWeight: active === 'location' && 600 }} onClick={() => clickHandle('location')}>Location</Typography>
        </Box>
    )
}

const SingleOffPlan = () => {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const ExContext = useContext(RateContext);
    const { enqueueSnackbar } = useSnackbar();
    const [preview, setPreview] = useState(false)
    const [message, setMessage] = useState(false)
    const [value, setValue] = useState('1')
    const [verify, setVerify] = useState(null)
    const openVerify = Boolean(verify);
    const [share, setShare] = useState(null);
    const openShare = Boolean(share);
    const [data, setData] = useState()
    const [user, setUser] = useState()
    const [isProfileComplete, setIsProfileComplete] = useState(false)
    const [unitView, setUnitView] = useState(false)
    const [floorPlan, setFloorPlan] = useState([])
    const [loginPrompt, setLoginPrompt] = useState(false)
    const id = window.location.pathname.split("/");

    const getSingleDevelopment = (id) => {
        Api().get(`/rehome-properties/${id[2]}`, {
            params: {
                filter: {
                    include: [
                        {
                            relation: "user",
                            scope: { include: [{ relation: "agencies" }] }
                        }
                    ]
                }
            }
        })
            .then((response) => {
                setData(response?.data)
            })
            .catch((error) => { })
    }

    useEffect(() => {

        window.scrollTo({ top: '0', behavior: 'smooth' })
        getSingleDevelopment(id)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getUserInfo = () => {
        if (isLoggedIn()) {
            Api().get("/me")
                .then((response) => {
                    setUser(response?.data)
                    setFavs(response?.data?.wishlist?.rehomePropertyIds)
                })
                .catch(() => { })
        }
    }

    useEffect(() => {
        getUserInfo()
    }, []);

    const openContactForm = () => {
        if (!isLoggedIn()) {
            setLoginPrompt(true)
        } else if (user?.userType === "customer" &&
            (user?.firstName === "" || user?.firstName === undefined ||
                user?.firstName === "" || user?.firstName === undefined ||
                user?.phone === "" || user?.phone === undefined ||
                user?.gender === "" || user?.gender === undefined ||
                user?.address === "" || user?.address === undefined)) {
            setIsProfileComplete(true)
        } else {
            setMessage(true)
        }
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Popover Function Calls
    const handleVerify = (event) => {
        if (data?.documents?.length < 1) {
            enqueueSnackbar(t('offplan.singleoffplan.buttons.nodocs'), { variant: 'info' })
            return
        } else {
            setVerify(event.currentTarget)
        }
    }

    const handleClose = () => {
        setVerify(null)
    };

    // Share Popover
    const handleShare = (event) => {
        setShare(event.currentTarget);
    };
    const handleCloseShare = () => {
        setShare(null)
    };

    const [load, setLoad] = useState(false)
    const [favs, setFavs] = useState([])

    // Add to wishlist
    const toggleWishlist = (id) => {
        const exists = user?.wishlist?.rehomePropertyIds.includes(id)

        if (isLoggedIn()) {
            if (exists) {
                const newArray = user?.wishlist?.rehomePropertyIds.filter((item) => item !== id)

                setLoad(true)
                Api().patch(`wishlists/${user?.wishlist?.id}`, { rehomePropertyIds: newArray })
                    .then((res) => {
                        setLoad(false)
                        enqueueSnackbar(t('dashboard.wishlist.removed'), { variant: 'success' });
                        setFavs(favs.filter(item => item !== id));
                        getUserInfo()
                    })
            } else {
                user?.wishlist?.rehomePropertyIds.push(id)

                setLoad(true)
                Api().patch(`wishlists/${user?.wishlist?.id}`, { rehomePropertyIds: user?.wishlist?.rehomePropertyIds })
                    .then((res) => {
                        setLoad(false)
                        enqueueSnackbar(t('dashboard.wishlist.added'), { variant: 'success' });
                        setFavs((prevState) => [...prevState, id])
                    })
            }
        } else {
            navigate('/login')
        }
    }

    const copyURL = () => {
        const url = window.location.href
        navigator.clipboard.writeText(url).then(function () {
            enqueueSnackbar(t('share'), { variant: 'success' });
        }, function () {
            enqueueSnackbar(t('shareerror'), { variant: 'error' });
        });

        if (isLoggedIn()) {
            Api().post(`call/${data?.user?.agencies[0]?.userId}/type/${isMobile ? 'mobile' : 'desktop'}`,{
                propertyId: id[2]
            })
            .then(()=>{
                window.location.href = `tel:${data?.user?.phone}`
            })
        }else{
            Api().post(`call-anonymous/${data?.user?.agencies[0]?.userId}`,{
                propertyId: id[2]
            })
            .then(()=>{
                window.location.href = `tel:${data?.user?.phone}`
            })
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box bgcolor={'#FAFAFA'}>
                <Grid container spacing={.5}>
                    <Grid item xs={12} sm={12} md={6} lg={6} >
                        <Box sx={{ position: 'relative', minHeight: { xs: "50px", lg: "31rem" } }}>

                            {/* Sidebar */}
                            {
                                isMobile ? null :
                                    <Box sx={{
                                        bgcolor: 'secondary.main',
                                        position: 'absolute',
                                        left: 0, top: 0,
                                        padding: { xs: '0', sm: '0', md: '1.5rem .5rem', lg: '1.5rem .5rem' },
                                        zIndex: 11, height: '100%',
                                        color: '#fff',
                                        textAlign: 'center',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        flexDirection: 'column',
                                    }}>
                                        <TabContext >
                                            <TabList variant={isMobile ? 'scrollable' : 'fullWidth'} orientation='vertical' textColor='inherit' indicatorColor='secondary.main' >
                                                <Tab disableRipple sx={{ textTransform: 'none', fontSize: { xs: '.8rem', sm: '.8rem', lg: '1rem' }, fontWeight: 500, color: value === '1' && 'paper.main' }} onClick={() => openContactForm()} icon={<PermPhoneMsg />} label={t('offplan.singleoffplan.sidebar.contact.title')} value="1" />
                                                <Tab onClick={handleShare} disableRipple sx={{ textTransform: 'none', fontSize: { xs: '.8rem', sm: '.8rem', lg: '1rem' }, fontWeight: 500, color: value === '2' && 'paper.main' }} icon={<ReplyOutlined />} label={t('offplan.singleoffplan.sidebar.share')} value="2" />
                                                <Tab onClick={(e) => { toggleWishlist(id[2]) }} disableRipple sx={{ textTransform: 'none', fontSize: { xs: '.8rem', sm: '.8rem', lg: '1rem' }, fontWeight: 500, color: value === '3' && 'paper.main' }} icon={load ? <CircularProgress size='1.33rem' color='paper' /> : favs?.includes(id[2]) ? <Favorite color='paper' fontSize='small' /> : <FavoriteBorder color='paper' fontSize='small' />} label={favs?.includes(id[2]) ? t('offplan.singleoffplan.sidebar.saved') : t('offplan.singleoffplan.sidebar.save')} value="3" />
                                                <Tab disableRipple sx={{ textTransform: 'none', fontSize: { xs: '.8rem', sm: '.8rem', lg: '1rem' }, fontWeight: 500, color: value === '3' && 'paper.main' }} onClick={() => setPreview(true)} icon={<Collections />} label={t('offplan.singleoffplan.sidebar.pictures')} value="4" />
                                                <Tooltip title={t('comingsoon.title')} arrow><Tab disableRipple sx={{ textTransform: 'none', fontSize: { xs: '.8rem', sm: '.8rem', lg: '1rem' }, fontWeight: 500, color: value === '3' && 'paper.main' }} style={{ opacity: "0.3" }} icon={<Videocam />} label={t('offplan.singleoffplan.sidebar.video')} value="5" /></Tooltip>
                                                <Tooltip title={t('comingsoon.title')} arrow><Tab disableRipple sx={{ textTransform: 'none', fontSize: { xs: '.8rem', sm: '.8rem', lg: '1rem' }, fontWeight: 500, color: value === '3' && 'paper.main' }} style={{ opacity: "0.3" }} icon={<ViewInAr />} label={t('offplan.singleoffplan.sidebar.3dtour')} value="6" /></Tooltip>

                                            </TabList>
                                        </TabContext>
                                    </Box>
                            }

                            {

                                isMobile ?
                                    <Box sx={{ position: 'relative', }}>
                                        <PropertySlider
                                            items={1} autoplay={true} autoplaySpeed={500} margin={20} loop={true} lazyLoad={true}
                                            nav={true} navElement="div" navText={[
                                                `<i class='fas fa-arrow-left'></i>`, `<i class='fas fa-arrow-right'></i>`]}
                                            responsive={{ 760: { items: '1' }, 340: { items: '1' } }}
                                        >
                                            {
                                                data?.pictures.map((item, index) => {
                                                    return (
                                                        <Box key={index} sx={{
                                                            backgroundImage: `url(${item})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            width: '100%', height: '25rem',

                                                        }}

                                                        />
                                                    )

                                                })
                                            }
                                        </PropertySlider>
                                        <Box sx={{ display: 'flex', gap: '.5rem', position: 'absolute', bottom: '10%', left: '5%', zIndex: 5 }}>
                                            <IconButton sx={{ bgcolor: '#03254cbd', color: '#fff' }} onClick={() => openContactForm()}><Call fontSize='small' /></IconButton>
                                            <IconButton sx={{ bgcolor: '#03254cbd', color: '#fff' }} onClick={handleShare}><Reply fontSize='small' /></IconButton>
                                            <IconButton sx={{ bgcolor: '#03254cbd', color: '#fff' }} onClick={(e) => { toggleWishlist(id[2]) }}>{load ? <CircularProgress size='1.33rem' color='paper' /> : favs?.includes(id[2]) ? <Favorite color='paper' fontSize='small' /> : <FavoriteBorder fontSize='small' />}</IconButton>
                                        </Box>
                                    </Box>
                                    :
                                    <ImageListItem sx={{ cursor: 'pointer' }} onClick={() => setPreview(true)}>
                                        <img
                                            src={`${data?.pictures?.length < 1 ? NoImage : data?.pictures[0]}?w=164&h=164&fit=crop&auto=format`}
                                            alt='propertyimage'
                                            loading="lazy"
                                            style={{ height: data?.pictures?.length < 1 ? "31rem" : "30.8rem" }}
                                        />
                                    </ImageListItem>

                            }

                        </Box>
                    </Grid>

                    {/* Image Lists */}
                    {
                        isMobile ? null :
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <ImageList variant='quilted' cols={2}>
                                    {
                                        data?.pictures?.slice(1, 5).map((el, index) => {
                                            return (
                                                <ImageListItem key={index} onClick={() => setPreview(true)} sx={{ cursor: 'pointer' }}>
                                                    <img
                                                        src={`${el}?w=164&h=164&fit=crop&auto=format`}
                                                        alt='propertyimage'
                                                        loading="lazy"
                                                        style={{ height: "15.27rem" }}
                                                    />
                                                </ImageListItem>
                                            )
                                        })
                                    }
                                </ImageList>
                            </Grid>
                    }
                </Grid>

                <Box sx={{ mt: { xs: '-4.5rem', sm: '-4rem', md: 0, lg: 0 } }} >
                    {/* <Container maxWidth='xl'> */}
                    <Grid container spacing={6} >
                        <Grid item xs={12} sm={12} lg={12}>
                            <TabContext value={value}>
                                <Box sx={{ bgcolor: 'secondary.main', padding: '.7rem 0 0 0', borderColor: 'divider', color: '#fff' }}>
                                    <TabList variant={isMobile ? 'scrollable' : 'fullWidth'} indicatorColor='primary' textColor='inherit' sx={{ '& .MuiTabs-indicator': { height: "5px" } }} onChange={handleChange}>
                                        <Tab disableRipple sx={{ textTransform: 'none', fontSize: { xs: "16px", sm: '16px', md: '18px', lg: '20px' } }} label={t('offplan.singleoffplan.mainheader.tab1')} value="1" />
                                        <Tab disableRipple sx={{ textTransform: 'none', fontSize: { xs: "16px", sm: '16px', md: '18px', lg: '20px' } }} label={t('offplan.singleoffplan.mainheader.tab2')} value="2" />
                                        <Tab disableRipple sx={{ textTransform: 'none', fontSize: { xs: "16px", sm: '16px', md: '18px', lg: '20px' } }} label={t('offplan.singleoffplan.mainheader.tab3')} value="3" />
                                    </TabList>
                                </Box>

                                <Container maxWidth='lg' sx={{ height: '100%' }}>
                                    <Grid container spacing={5}>
                                        <Grid item xs={12} sm={12} lg={9}>

                                            {/* General Details */}
                                            <TabPanel value="1" >
                                                <Box sx={{ marginBottom: '1.5rem' }}>
                                                    <Typography variant='h6' sx={{ fontWeight: 600 }} mt={3}>{data?.name}</Typography>
                                                    <ListItem disablePadding sx={{ marginLeft: '-.4rem' }}>
                                                        <ListItemIcon sx={{ minWidth: '28px' }}><Place fontSize='small' /></ListItemIcon>
                                                        <ListItemText>
                                                            <Typography sx={{ fontSize: '1rem' }}>{data?.geoAddress}</Typography>
                                                        </ListItemText>
                                                    </ListItem>
                                                </Box>
                                                <Divider orientation='horizontal' sx={{ backgroundColor: 'primary.main', opacity: "30%" }} />

                                                {/* About Off-plan */}
                                                <Box sx={{ marginBottom: '1.5rem' }}>
                                                    <Typography variant='h6' my={2} sx={{ fontWeight: 600 }}>{t('offplan.singleoffplan.general.tab1.about')}</Typography>
                                                    <Typography paragraph mb={3} textAlign={'justify'}>
                                                        {data?.description}
                                                    </Typography>
                                                </Box>
                                                <Divider orientation='horizontal' sx={{ backgroundColor: 'primary.main', opacity: "30%" }} />

                                                {/* Amenities */}
                                                {data?.amenities?.length > 0 ?
                                                    <>
                                                        <Box sx={{ marginBottom: '1.5rem' }}>
                                                            <Typography variant='h6' my={2} sx={{ fontWeight: 600 }}>{t('offplan.singleoffplan.general.tab2.note', { number: data?.amenities?.length })}</Typography>
                                                            <Grid container spacing={2}>
                                                                {
                                                                    data?.amenities?.map((el, index) => {
                                                                        return (
                                                                            <Grid key={index} item xs={6} sm={2} md={2} lg={2}>
                                                                                <AmenitiesItem el={el} />
                                                                            </Grid>
                                                                        )
                                                                    })
                                                                }
                                                            </Grid>
                                                        </Box>
                                                        <Divider orientation='horizontal' sx={{ backgroundColor: 'primary.main', opacity: "30%" }} />
                                                    </> : ""
                                                }

                                                {/* Features */}
                                                {data?.features?.filter((ft) => ft?.active === true)?.length > 0 ?
                                                    <Box sx={{ marginBottom: '1.5rem' }}>
                                                        <Typography variant='h6' my={2} sx={{ fontWeight: 600 }}>{t('offplan.singleoffplan.general.tab3.note', { number: data?.features?.filter((ft) => ft?.active === true)?.length })}</Typography>
                                                        <Grid container spacing={2}>
                                                            {
                                                                data?.features?.filter((ft) => ft?.active === true)?.map((el, index) => {
                                                                    return (
                                                                        <Grid key={index} item xs={12} md={6}>
                                                                            <ListItem>
                                                                                <ListItemIcon sx={{ minWidth: '30px' }}><FiberManualRecord color='primary' sx={{ fontSize: '.7rem' }} /></ListItemIcon>
                                                                                <ListItemText>{el?.name}</ListItemText>
                                                                            </ListItem>
                                                                        </Grid>
                                                                    )
                                                                })
                                                            }
                                                        </Grid>
                                                    </Box> : ""}
                                            </TabPanel>

                                            {/* Units */}
                                            <TabPanel value="2" >
                                                {data?.units?.map((el, index) => {
                                                    return (
                                                        <Box sx={{ marginBottom: '13px' }}>
                                                            <MuiAccordion key={index} elevation={0}>
                                                                <MuiAccordionSummary expandIcon={<ExpandMore />} sx={{ '& .MuiAccordionSummary-content': { display: "block" } }}>
                                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                        <Typography variant='h6' sx={{ fontWeight: 600, fontSize: '1.2rem', marginRight: "10px" }}>{el?.bedrooms} {t('agentdashboard.addoffplan.tab2.rooms')}{el !== 1 && 's'}</Typography>
                                                                        <Box sx={{
                                                                            bgcolor: 'primary.main',
                                                                            display: 'flex',
                                                                            justifyContent: 'center', alignItems: 'center',
                                                                            height: "16px",
                                                                            maxWidth: "70px"
                                                                        }}>
                                                                            <Typography textAlign={'center'} sx={{
                                                                                padding: '0 4px', borderRadius: '3px',
                                                                                fontSize: '.65rem', fontWeight: 600,
                                                                                color: '#fff', textTransform: "capitalize"
                                                                            }}>
                                                                                {el?.transactionType === 'sale' && el?.status !== 'sold' ? t('agentdashboard.home.forsale') : el?.transactionType === 'sale' && el?.status === 'sold' ? t('agentdashboard.home.sold') : el?.transactionType === 'rent' && el?.status !== 'rented' ? t('agentdashboard.home.forrent') : t('agentdashboard.home.rented')}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                    <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
                                                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                            <BedOutlined color={"secondary"} style={{ marginRight: '7px' }} />
                                                                            {el?.bedrooms}
                                                                        </Box>
                                                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                            <ShowerOutlined color={"secondary"} style={{ marginRight: '7px' }} />
                                                                            {el?.bathrooms}
                                                                        </Box>
                                                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                            <AccountBalanceWalletOutlined color={"primary"} style={{ marginRight: '7px' }} />
                                                                            {el?.hidePrice ? <Typography variant='body2' whiteSpace={'noWrap'}>{t('findanagent.singleagent.contactagentforprice')}</Typography> :
                                                                                <>{ExContext?.preferredCurrency} {(ExContext?.convert(el?.currency, el?.price))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</>
                                                                            }
                                                                        </Box>
                                                                    </Box>
                                                                </MuiAccordionSummary>
                                                                <AccordionDetails>
                                                                    <List disablePadding>
                                                                        <Grid container spacing={2.5}>
                                                                            <Grid item xs={6}>
                                                                                <Typography>{t('agentdashboard.addoffplan.tab2.rooms')}{el !== 1 && 's'}</Typography>
                                                                            </Grid>
                                                                            <Grid item xs={6}>
                                                                                <Typography sx={{ fontWeight: "600" }}>{el?.bedrooms}</Typography>
                                                                            </Grid>

                                                                            <Grid item xs={6}>
                                                                                <Typography>{t('agentdashboard.addoffplan.tab2.baths')}{el !== 1 && 's'}</Typography>
                                                                            </Grid>
                                                                            <Grid item xs={6}>
                                                                                <Typography sx={{ fontWeight: "600" }}>{el?.bathrooms}</Typography>
                                                                            </Grid>

                                                                            <Grid item xs={6}>
                                                                                <Typography>{t('agentdashboard.addoffplan.tab2.price')}</Typography>
                                                                            </Grid>
                                                                            <Grid item xs={6}>
                                                                                {el?.hidePrice ? <Typography variant='body2' sx={{ fontWeight: "600" }} whiteSpace={'noWrap'}>{t('findanagent.singleagent.contactagentforprice')}</Typography> :
                                                                                    <Typography sx={{ fontWeight: "600" }}>{ExContext?.preferredCurrency} {(ExContext?.convert(el?.currency, el?.price))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Typography>
                                                                                }
                                                                            </Grid>

                                                                            <Grid item xs={6}>
                                                                                <Typography>{t('agentdashboard.addoffplan.tab2.squarefoot')}</Typography>
                                                                            </Grid>
                                                                            <Grid item xs={6}>
                                                                                <Typography sx={{ fontWeight: "600" }}>{el?.sizeOfHouse < 1 ? t('offplan.singleoffplan.pricing.tab1.sizenotavailable') : el?.sizeOfHouse}</Typography>
                                                                            </Grid>

                                                                            <Grid item xs={6}>
                                                                                <Typography>{t('agentdashboard.addoffplan.tab2.transactiontype')}</Typography>
                                                                            </Grid>
                                                                            <Grid item xs={6}>
                                                                                <Typography sx={{ textTransform: "capitalize", fontWeight: "600" }}>{el?.transactionType}</Typography>
                                                                            </Grid>

                                                                            <Grid item xs={6}>
                                                                                <Typography>{t('agentdashboard.addoffplan.tab2.propertystatus')}</Typography>
                                                                            </Grid>
                                                                            <Grid item xs={6}>
                                                                                <Typography sx={{ textTransform: "capitalize", fontWeight: "600" }}>{el?.status}</Typography>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </List>

                                                                    <Button disabled={el?.documents?.length < 1} sx={{ bgcolor: 'primary', marginTop: "2rem", textTransform: 'none', color: '#fff', '&:hover': { bgcolor: 'secondary', color: '#fff' } }} onClick={() => { setFloorPlan(el); setUnitView(true) }} variant='contained' size='medium' >{t('offplan.singleoffplan.pricing.tab1.view')}</Button>
                                                                </AccordionDetails>
                                                            </MuiAccordion>
                                                        </Box>
                                                    )
                                                })}
                                            </TabPanel>

                                            {/* Developer Details */}
                                            <TabPanel value="3" >
                                                <Grid container>
                                                    <Grid item xs={12} sm={12} md={12} lg={5}>
                                                        <Box sx={{ backgroundImage: `url(${data?.user?.avatar})`, backgroundSize: '100%', backgroundRepeat: "no-repeat", height: { xs: '20rem', sm: '20rem', md: '20rem', lg: '30.6rem' }, backgroundPosition: 'center', border: '1px solid #e1e1e1' }}></Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={7} sx={{ mb: { sm: '2rem', lg: 0 } }}>
                                                        <Box height={'80%'} padding={'2rem'} bgcolor={'#fff'} border={'1px solid #e1e1e1'} borderBottom={'none'}>
                                                            <Typography variant='h5' sx={{ fontWeight: 500 }}>{data?.user?.firstName} {data?.user?.lastName && (data?.user?.lastName)[0]}.<span><CheckCircle sx={{ fontSize: '1.2rem' }} color='primary' /></span></Typography>
                                                            <Typography variant='body2' mb={2} color={'primary'}>{data?.user?.agencies[0]?.name}</Typography>
                                                            <Typography>
                                                                {data?.user?.agencies[0]?.description}
                                                            </Typography>
                                                        </Box>
                                                        <Box height={'20%'} bgcolor={'#F5F5F5'} border={'1px solid #e1e1e1'} padding={'1rem 2rem'} display={'flex'} justifyContent={'space-between'}>
                                                            <List disablePadding>
                                                                <a
                                                                    onClick={copyURL}
                                                                    href='#'
                                                                    style={{ textDecoration: "none", color: "#707070", marginRight: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                                                >
                                                                    <ListItem disablePadding sx={{ cursor: "pointer" }}>
                                                                        <ListItemIcon sx={{ minWidth: '32px' }}><Call sx={{ fontSize: '1.2rem' }} /></ListItemIcon>
                                                                        <ListItemText>{data?.user?.phone}</ListItemText>
                                                                    </ListItem>
                                                                </a>
                                                                <ListItem disablePadding>
                                                                    <ListItemIcon sx={{ minWidth: '32px' }}><PinDrop sx={{ fontSize: '1.4rem' }} /></ListItemIcon>
                                                                    <ListItemText>{data?.user?.agencies[0]?.location}</ListItemText>
                                                                </ListItem>
                                                            </List>
                                                            <GroupSocials gap={'.6rem'} color={'primary.main'} hoverColor={'tertiary.main'} />
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </TabPanel>
                                        </Grid>

                                        <Grid item lg={3}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} mt={7} mb={5}>
                                                {/* <PopupButton
                                                    url={localStorage.getItem('i18nextLng') === 'en' ? "https://calendly.com/rehome-calendar/schedule-a-tour-en" : "https://calendly.com/rehome-calendar/schedule-a-tour-fr"}
                                                    rootElement={document.getElementById("root")}
                                                    text={t('offplan.singleoffplan.buttons.schedule')}
                                                    styles={{
                                                        backgroundColor: "#5B9C00",
                                                        color: "white",
                                                        padding: ".8rem 1.5rem",
                                                        borderRadius: '50px',
                                                        textTransform: 'none',
                                                        fontSize: "0.88rem",
                                                        fontWeight: "500"
                                                    }}
                                                    prefill={{
                                                        email: user?.email,
                                                        firstName: user?.firstName || "",
                                                        lastName: user?.lastName || "",
                                                        name: (user?.firstName || "") + " " + (user?.lastName || ""),
                                                        customAnswers: {
                                                            a1: user?.phone || "",
                                                            a2: data?.user?.email,
                                                            a3: window.location.href,
                                                        }
                                                    }}
                                                /> */}
                                                <RoundButton onClick={handleVerify} size={'small'} text={t('offplan.singleoffplan.buttons.verify')} variant='contained' disableElevation color={'primary'} />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Container>
                            </TabContext>
                        </Grid>

                    </Grid>
                    {/* </Container> */}
                </Box>
            </Box>

            {/* Property Verification */}
            <Backdrop open={openVerify} sx={{ bgcolor: alpha('#03254C', 0.98), zIndex: 99 }}>
                <Box>
                    <IconButton sx={{ position: 'absolute', top: '3%', right: '5%' }} onClick={() => handleClose()}><Close color='paper' fontSize='small' /></IconButton>
                    <Box sx={{ padding: '1.5rem', color: '#fff', height: "50%", width: "20rem", backgroundColor: "#fff" }}>
                        <img src={verifieddocs} width={100} style={{ margin: "0 auto" }} alt="docs" />
                        <Typography textAlign={'center'} variant='h6' sx={{ fontSize: '1.2rem', fontWeight: 500, color: "#1267B1" }}>{t('offplan.singleoffplan.general.verifydocs.title')}</Typography>
                    </Box>
                    <Box padding='1.5rem' sx={{ height: "50%", bgcolor: "#1267B1", width: "20rem" }}>
                        <List disablePadding>
                            {data?.documents?.find((hp) => hp?.document_type === "land_title") ?
                                <ListItem>
                                    <ListItemIcon ><TaskAlt color='primary' sx={{ backgroundColor: "#fff", borderRadius: "50%" }} /></ListItemIcon>
                                    <ListItemText sx={{ color: "#fff" }}>{t('offplan.singleoffplan.general.verifydocs.landtitle')}</ListItemText>
                                </ListItem>
                                : ""
                            }

                            {data?.documents?.find((hp) => hp?.document_type === "building_permit") ?
                                <ListItem>
                                    <ListItemIcon ><TaskAlt color='primary' sx={{ backgroundColor: "#fff", borderRadius: "50%" }} /></ListItemIcon>
                                    <ListItemText sx={{ color: "#fff" }}>{t('offplan.singleoffplan.general.verifydocs.buildingpermit')}</ListItemText>
                                </ListItem>
                                : ""
                            }

                            {data?.documents?.find((hp) => hp?.document_type === "house_plan") ?
                                <ListItem>
                                    <ListItemIcon ><TaskAlt color='primary' sx={{ backgroundColor: "#fff", borderRadius: "50%" }} /></ListItemIcon>
                                    <ListItemText sx={{ color: "#fff" }}>{t('offplan.singleoffplan.general.verifydocs.houseplan')}</ListItemText>
                                </ListItem>
                                : ""
                            }
                        </List>
                        {/* <RoundButton sx={{ marginTop: '1rem' }} size={'small'} variant={'outlined'} text='How to Be Confident in a Property’s Legitimacy?' /> */}
                    </Box>
                </Box>
            </Backdrop>

            {/* Social media share */}
            <Popover sx={{ marginTop: '4rem' }} open={openShare} anchorEl={share} onClose={handleCloseShare}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }} PaperProps={{ sx: { width: '17rem' } }}
            >
                <SocialMediaShare />
            </Popover>

            {/* Image Preview */}
            <PhotoPreview data={data?.pictures} preview={preview} setPreview={setPreview} />

            {/* Unit Preview */}
            <UnitPreview floorPlan={floorPlan} unitView={unitView} setUnitView={setUnitView} />

            <Backdrop open={message} sx={{ bgcolor: alpha('#03254C', 0.98), zIndex: 99 }}>
                {/* Message Box */}
                <PropertyContactForm user={user} data={data} setMessage={setMessage} name={t('signuptype.developer')} subtext={t('offplan.singleoffplan.sidebar.contact.developernote')} />
            </Backdrop>

            {/* customer complete profile */}
            <Backdrop open={isProfileComplete} sx={{ bgcolor: alpha('#03254C', .9), zIndex: 20 }}>
                <CustomerCompleteProfile setIsProfileComplete={setIsProfileComplete} />
            </Backdrop>

            {/* Login prompt */}
            <Dialog open={loginPrompt} onClose={() => { setLoginPrompt(false) }} fullWidth maxWidth='xs'>
                <DialogContent>
                    <IconButton sx={{ position: "absolute", right: "5px", top: "5px" }} onClick={() => setLoginPrompt(false)}><Close /></IconButton>
                    <Typography textAlign={"center"}>{t('loginprompt.note1')}</Typography>

                    <Box mt={2} sx={{ display: "flex", justifyContent: "center" }} onClick={() => navigate('/login')}>
                        <PillButton
                            text={t('navbar.login')}
                            size="small"
                            width={{ xs: '100px', sm: '140px', md: '140px', lg: "140px" }}
                            borderColor=""
                            color="#FFFFFF"
                            backgroundColor="#1267B1"
                            startIcon={login}
                            variant="contained"
                        />
                    </Box>

                    <Typography mt={1} textAlign={"center"}>{t('loginprompt.note2')}</Typography>

                    <Box mt={1} sx={{ display: "flex", justifyContent: "center" }} onClick={() => navigate('/signup')}>
                        <PillButton
                            text={t('navbar.signup')}
                            size="small"
                            width="140px"
                            borderColor="rgba(0, 0, 0, 0.3)"
                            color="#000000"
                            startIcon={signUp}
                            variant="outlined"
                        />
                    </Box>

                    <Typography mt={1} textAlign={"center"}>{t('loginprompt.note3')}</Typography>
                </DialogContent>
            </Dialog>

        </motion.div >
    )
}

export default SingleOffPlan