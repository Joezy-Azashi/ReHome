import { CheckCircle, ReplyOutlined, Close, FiberManualRecord, Home, KingBed, Favorite, FavoriteBorder, AccountBalanceWallet, PermPhoneMsgOutlined, Place, Shower, TaskAlt } from '@mui/icons-material'
import { alpha, Avatar, Box, Backdrop, IconButton, Button, Chip, Dialog, DialogContent, CircularProgress, Divider, Grid, ImageList, ImageListItem, List, ListItem, ListItemIcon, ListItemText, Popover, Stack, Tab, Typography, Hidden, Tooltip } from '@mui/material'
import React, { useContext, useEffect, useState, useRef } from 'react'
import RoundButton from '../components/Buttons/RoundButton'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import NoImage from '../assets/images/no-image.jpg'
import verifieddocs from '../assets/images/verifieddocs.png'
import styled from '@emotion/styled'
import login from '../assets/images/loginIcon.png';
import signUp from '../assets/images/signUpIcon.png';
import { grey } from '@mui/material/colors'
import Api from '../api/api'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { isMobile } from 'react-device-detect'
import OwlCarousel from 'react-owl-carousel'
import { isLoggedIn } from '../services/auth'
import { PopupButton } from "react-calendly";
import RateContext from '../contexts/rateContext'
import PageLoader from '../components/PageLoader'
import { useSnackbar } from 'notistack';
import { motion } from "framer-motion";
import AmenitiesItem from '../components/AmenitiesItem'
import SocialMediaShare from '../components/Social/SocialMediaShare'
import PropertyContactForm from '../components/PropertyContactForm'
import CustomerCompleteProfile from '../components/CustomerCompleteProfile'
import PhotoPreview from '../components/PhotoPreview'
import PillButton from '../components/Buttons/PillButton'
import mapboxgl from 'mapbox-gl'

const FlexBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '.5rem',
    alignItems: 'center'
}))

const StyledButton = styled(IconButton)(({ theme }) => ({
    borderRadius: '5px',
    color: "white",
    padding: "5px 10px",
    cursor: "pointer"
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

const SinglePro = () => {
    const loc = window.location.pathname.split("/");
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [value, setValue] = useState('1');
    const [verify, setVerify] = useState(null);
    const openVerify = Boolean(verify);
    const [share, setShare] = useState(null);
    const openShare = Boolean(share);
    const [data, setData] = useState()
    const [preview, setPreview] = useState(false)
    const [user, setUser] = useState()
    const [message, setMessage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loginPrompt, setLoginPrompt] = useState(false)
    const [isProfileComplete, setIsProfileComplete] = useState(false)
    let el = data?.user
    const ExContext = useContext(RateContext);
    const mapContainer = useRef(null);
    const map = useRef(null);

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
    };

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

    useEffect(() => {
        setLoading(true)
        Api().get(`/rehome-properties/${loc[2]}`, {
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
            .then((res) => {
                setLoading(false)
                setData(res?.data)
            })
            .catch(() => {
                setLoading(false)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getUserInfo = () => {
        if (isLoggedIn()) {
            Api().get("/me")
                .then((response) => {
                    setUser(response.data)
                    setFavs(response?.data?.wishlist?.rehomePropertyIds)
                })
                .catch(() => { })
        }
    }

    useEffect(() => {
        getUserInfo()

        window.scrollTo({ top: 0 })
    }, []);

    useEffect(() => {
        try{
            if(!data || !data.gpsLocation || !mapContainer.current) return

            const lng = data.gpsLocation.lon
            const lat = data.gpsLocation.lat
    
            mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN
    
            map.current = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [lng, lat],
                zoom: 12
            });
    
            // add markers to map
            // create a HTML element for each feature
            const el = document.createElement('div');
            el.className = data.transactionType === 'sale' ? 'buymarker' : 'rentmarker';
    
            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el).setLngLat([lng,lat])
            .addTo(map.current);
      
            map.current.scrollZoom.disable();
            map.current.addControl(new mapboxgl.NavigationControl());
    
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }catch(e){
            
        }
    }, [data, mapContainer, value])


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

    const [load, setLoad] = useState(false)
    const [favs, setFavs] = useState([])
    const { enqueueSnackbar } = useSnackbar();

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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box sx={{ width: '100%', height: { xs: 'auto', sm: 'auto', lg: 'auto' }, bgcolor: '#fff' }}>
                {loading ? <div style={{ height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}><PageLoader /></div> :
                    <Grid container>
                        <Grid item xs={12} sm={12} lg={6}>
                            {
                                isMobile ?
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
                                                        width: '100%', height: '22rem',

                                                    }}

                                                    />
                                                )

                                            })
                                        }
                                    </PropertySlider>
                                    :
                                    <Box>
                                        <Box sx={{
                                            height: '55vh',
                                            backgroundImage: `url(${data?.pictures[0] ? data?.pictures[0] : NoImage})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            mb: .5,
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            alignItems: 'flex-end'

                                        }}>
                                            <Button disabled={data?.pictures.length < 1} sx={{ mb: '3rem', ml: '2rem', bgcolor: '#fff', textTransform: 'none', color: '#000', '&:hover': { bgcolor: 'secondary', color: '#fff' } }} onClick={() => setPreview(true)} variant='contained' size='medium' >{t('singleproperty.viewphotos', { number: data?.pictures?.length })}</Button>
                                        </Box>
                                        <ImageList variant='quilted' id='imgList' cols={2} gap={6}>

                                            <ImageListItem cols={isMobile ? 2 : 1} sx={{ height: '37vh !important' }}>
                                                {data?.pictures[1] ? <img src={`${data?.pictures[1]}?fit=crop&auto=format`} alt={`property_img_${1}`} loading='lazy' /> : <img src={`${NoImage}`} alt={`property_img_${2}`} loading='lazy' />}
                                            </ImageListItem>
                                            <ImageListItem cols={isMobile ? 2 : 1} sx={{ height: '37vh !important' }}>
                                                {data?.pictures[2] ? <img src={`${data?.pictures[2]}?fit=crop&auto=format`} alt={`property_img_${2}`} loading='lazy' /> : <img src={`${NoImage}`} alt={`property_img_${2}`} loading='lazy' />}
                                            </ImageListItem>
                                        </ImageList>
                                    </Box>


                            }
                        </Grid>
                        <Grid item xs={12} sm={12} lg={6}>
                            <Box sx={{ mt: { xs: '-1.5rem', sm: '-1.5rem', md: 0, lg: 0 }, height: '100%' }}>
                                <Grid container spacing={0}>
                                    <Grid item sm={8} sx={{ bgcolor: 'gray', color: '#fff', padding: { xs: '1.5rem', sm: '1.5rem', md: '1.5rem' }, width: '100%', position: 'relative' }}>
                                        <Hidden smUp>
                                            <Avatar
                                                onClick={() => navigate(`/brokers/${data?.user?.firstName.toLowerCase()}/${el?.id}`, { state: { el } })}
                                                src={ExContext?.thumbnail(data?.user?.avatar)}
                                                sx={{ width: '3rem', height: '3rem', margin: '0 auto', position: 'absolute', top: '-12%', right: '5%', zIndex: 30 }}
                                            />
                                        </Hidden>
                                        <Typography noWrap mb={1} variant='h6'>{data?.name}</Typography>
                                        <FlexBox mb={2}>
                                            <Place fontSize='small' />
                                            <Typography noWrap variant='body2'>{data?.geoAddress}</Typography>
                                        </FlexBox>
                                        <Box sx={{ display: 'flex', gap: '.5rem' }}>

                                            <FlexBox>
                                                <AccountBalanceWallet fontSize='medium' />
                                                {data?.hidePrice ? <Typography variant='body2' >{t('findanagent.singleagent.contactagentforprice')}</Typography> :
                                                    <Typography variant='h6'>{ExContext?.preferredCurrency} {(ExContext?.convert(data?.currency, data?.price))?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Typography>
                                                }
                                            </FlexBox>
                                            <Divider orientation='vertical' sx={{ background: '#fff' }} flexItem />
                                            <FlexBox>
                                                <KingBed />
                                                <Typography variant='body2'>{data?.bedrooms}</Typography>
                                            </FlexBox>
                                            <Divider orientation='vertical' sx={{ background: '#fff' }} flexItem />
                                            <FlexBox>
                                                <Shower />
                                                <Typography variant='body2'>{data?.bathrooms}</Typography>
                                            </FlexBox>
                                            <Hidden only={'xs'}>
                                                <Divider orientation='vertical' sx={{ background: '#fff' }} flexItem />
                                                <FlexBox>
                                                    <Home />
                                                    <Typography variant='body2'>{data?.sizeOfHouse < 1 ? t('offplan.singleoffplan.pricing.tab1.sizenotavailable') : data?.sizeOfHouse + ' sqft'}</Typography>
                                                </FlexBox>
                                            </Hidden>
                                        </Box>

                                        <Box sx={{ marginTop: "15px", display: { xs: "block", sm: "flex" }, alignItems: "center" }}>
                                            <Hidden smUp>
                                                <Box sx={{ display: "flex", alignItems: "center" }} mb={2}>
                                                    <Tooltip title={t('findanagent.singleagent.contactagent')} arrow>
                                                        <PermPhoneMsgOutlined onClick={() => openContactForm()} sx={{ color: "white", cursor: "pointer", marginRight: "2rem" }} fontSize='large' />
                                                    </Tooltip>
                                                    {data?.user?.verified ?
                                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                                            <CheckCircle sx={{ fontSize: '2rem', marginRight: ".2rem" }} color='#fff' />
                                                            <Typography>{t("singleproperty.verified")}</Typography>
                                                        </Box> : ""}
                                                </Box>
                                            </Hidden>

                                            <StyledButton onClick={(e) => { toggleWishlist(loc[2]) }} sx={{ marginBottom: { xs: "15px", sm: "0" } }}>
                                                {load ? <CircularProgress size='1.33rem' color='paper' />
                                                    : favs?.includes(loc[2]) ? <Favorite color='paper' fontSize='small' /> : <FavoriteBorder color='paper' fontSize='small' />
                                                }
                                                <Typography sx={{ marginLeft: "10px" }}>{favs?.includes(loc[2]) ? t('dashboard.wishlist.remove') : t('dashboard.wishlist.add')}</Typography>
                                            </StyledButton>

                                            <Divider orientation='vertical' sx={{ background: '#fff', margin: "0 .5rem" }} flexItem />

                                            <StyledButton onClick={handleShare}>
                                                <ReplyOutlined />
                                                <Typography sx={{ marginLeft: "5px" }}>{t("singleproperty.tab1.title")}</Typography>
                                            </StyledButton>
                                        </Box>
                                    </Grid>
                                    <Hidden smDown>
                                        <Grid item sm={4} sx={{ padding: ' 1rem 2rem', textAlign: 'center', bgcolor: grey[100] }}>
                                            <Avatar
                                                onClick={() => navigate(`/brokers/${data?.user?.firstName.toLowerCase()}/${el?.id}`, { state: { el } })}
                                                src={ExContext?.thumbnail(data?.user?.avatar)}
                                                sx={{ width: '5rem', height: '5rem', margin: '0 auto', marginBottom: '1rem', cursor: "pointer" }}
                                            />
                                            <Tooltip title={t('findanagent.singleagent.contactagent')} arrow>
                                                <PermPhoneMsgOutlined onClick={() => openContactForm()} color='primary' fontSize='large' sx={{ cursor: "pointer" }} />
                                            </Tooltip>

                                            {data?.user?.verified ?
                                                <FlexBox mt={2} sx={{ justifyContent: 'center' }}>
                                                    <CheckCircle sx={{ fontSize: '1.2rem' }} color='primary' />
                                                    <Typography sx={{ fontSize: '.8rem' }}>{t("singleproperty.verified")}</Typography>
                                                </FlexBox> : ""}

                                        </Grid>

                                    </Hidden>
                                </Grid>

                                {/* Tabs & Buttons */}
                                <TabContext value={value}>
                                    <Box sx={{ bgcolor: 'secondary.main', padding: '.5rem 0 0 0', borderColor: 'divider', color: '#fff' }}>
                                        <TabList variant={isMobile ? 'scrollable' : 'fullWidth'} indicatorColor='primary' textColor='inherit' sx={{ '& .MuiTabs-indicator': { height: "5px" } }} onChange={handleChange}>
                                            {/* <Tab disableRipple sx={{ textTransform: 'none' }} icon={<ReplyOutlined />} iconPosition="start" label={t("singleproperty.tab1.title")} /> */}
                                            <Tab disableRipple sx={{ textTransform: 'none' }} label={t("singleproperty.tab3.title")} value="1" />
                                            <Tab disableRipple sx={{ textTransform: 'none' }} label={t("singleproperty.tab4.title")} value="2" />
                                            <Tab disableRipple sx={{ textTransform: 'none' }} label={t("singleproperty.tab5.title")} value="3" />
                                            <Tab disableRipple sx={{ textTransform: 'none' }} label={t("singleproperty.tab6.title")} value="4" />
                                        </TabList>
                                    </Box>
                                    <TabPanel value="1" sx={{ paddingBottom: "0" }}>
                                        <Box sx={{ paddingBottom: '0rem', maxHeight: '51vh', minHeight: "100%", overflowY: "auto" }} className="noScrollBar">
                                            <Box sx={{ display: { xs: 'block', sm: 'block', lg: 'flex' }, justifyContent: 'space-between', alignItems: 'center', padding: { xs: '1rem', sm: '1rem', lg: '1.5rem 0' } }}>
                                                <Stack>
                                                    <Typography variant='h6' mb={1} sx={{ fontSize: '1.1rem' }}>{t("singleproperty.tab3.year")}: {data?.year_constructed < 1 ? t('offplan.singleoffplan.pricing.tab1.yearnotavailable') : data?.year_constructed}</Typography>
                                                </Stack>
                                                {/* <Box sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'row', md: 'column', lg: 'column' }, gap: '1rem', mb: { xs: '1rem', sm: '1rem', md: 0, lg: 0 } }}>
                                                    <PopupButton
                                                        url={localStorage.getItem('i18nextLng') === 'en' ? "https://calendly.com/rehome-calendar/schedule-a-tour-en" : "https://calendly.com/rehome-calendar/schedule-a-tour-fr"}
                                                        rootElement={document.getElementById("root")}
                                                        text={t("singleproperty.tab3.buttons.schedule")}
                                                        styles={{
                                                            backgroundColor: "#5B9C00",
                                                            color: "white",
                                                            padding: ".8rem 1.5rem",
                                                            borderRadius: '8px',
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

                                                    />
                                                    <RoundButton onClick={handleVerify} size={'small'} text={t("singleproperty.tab3.buttons.verify")} variant='contained' disableElevation color={'primary'} sx={{ lineHeight: 1.3, borderRadius: { xs: '8px', sm: '8px' } }} />
                                                </Box> */}
                                            </Box>
                                            <Divider sx={{ mt: '0' }} />
                                            <Box mb={0} sx={{ padding: '1.5rem 0' }}>
                                                <Typography variant='h6' mb={2} sx={{ fontSize: '1.2rem', fontWeight: 600 }}>{t("singleproperty.tab3.description")}</Typography>
                                                <Typography variant='body2'>
                                                    {data?.description}
                                                </Typography>

                                                {data?.documents?.find((hp) => hp?.document_type === "house_plan")?.uri ?
                                                    <>
                                                        <Typography variant='h6' mt={4} mb={2} sx={{ fontSize: '1.2rem', fontWeight: 600 }}>{t("singleproperty.tab3.houseplan")}</Typography>
                                                        <Box sx={{
                                                            padding: '1rem', borderRadius: '10px', display: 'flex', alignItems: 'flex-end',
                                                            height: '11.4rem', width: '11.4rem',
                                                            backgroundImage: `url(${data?.documents?.find((hp) => hp?.document_type === "house_plan")?.uri})`,
                                                            backgroundSize: 'cover',
                                                        }}>
                                                            <Chip size='medium' sx={{ bgcolor: '#fff', '&:hover': { bgcolor: 'secondary.main', color: '#fff' } }} onClick={() => window.open(data?.documents?.find((hp) => hp?.document_type === "house_plan")?.uri, '_blank')} label={t("singleproperty.viewplan")} />
                                                            {/* <img src={data?.documents?.find((hp) => hp?.document_type === "house_plan")?.uri} width='80%' alt={'house plan'} /> */}
                                                        </Box>
                                                    </> : null
                                                }
                                            </Box>
                                        </Box>
                                    </TabPanel>

                                    <TabPanel value="2">
                                        <Box sx={{ minHeight: "15rem" }}>
                                            <Typography variant='h6' mb={2} sx={{ fontSize: '1.2rem', fontWeight: 600 }}>{t('singleproperty.tab4.note', { number: data?.amenities?.length })}</Typography>
                                            <Grid container spacing={2}>
                                                {
                                                    data?.amenities?.map((el, index) => {
                                                        return (
                                                            <Grid key={index} item xs={4} sm={2} md={2} lg={2}>
                                                                <AmenitiesItem el={el} />
                                                            </Grid>
                                                        )
                                                    })
                                                }
                                            </Grid>
                                        </Box>
                                    </TabPanel>
                                    <TabPanel value="3">
                                        <Box sx={{ minHeight: "15rem" }}>
                                            <Typography variant='h6' mb={2} sx={{ fontSize: '1.2rem', fontWeight: 600 }}>{t('singleproperty.tab5.note', { number: data?.features?.filter((ft) => ft?.active === true)?.length })}</Typography>
                                            <Grid container>
                                                {
                                                    data?.features?.filter((ft) => ft?.active === true)?.map((el, index) => {
                                                        return (
                                                            <Grid item xs={6} key={index} sx={{ display: "flex", alignItems: "center" }}>
                                                                <ListItemIcon sx={{ minWidth: '30px' }}><FiberManualRecord color='primary' sx={{ fontSize: '.7rem' }} /></ListItemIcon>
                                                                <ListItemText>{el?.name}</ListItemText>
                                                            </Grid>
                                                        )
                                                    })
                                                }

                                            </Grid>

                                        </Box>
                                    </TabPanel>
                                    <TabPanel value="4">
                                        <Box sx={{ minHeight: "15rem" }}>
                                            <Typography variant='h6' mb={2} sx={{ fontSize: '1.2rem', fontWeight: 600 }}>{t('singleproperty.tab6.note')}</Typography>
                                            <Box>
                                                {/* Put Map Here */}
                                                <Grid item xs={12} sm={12} md={12} lg={12} sx={{ width: '100%', height: "46vh", overflow: "visible" }}>
                                                    <Box mb={2} sx={{ height: '100%' }}>
                                                        <div id="map" ref={mapContainer} className="h-full" />
                                                    </Box>
                                                </Grid>
                                            </Box>
                                        </Box>
                                    </TabPanel>
                                </TabContext>
                            </Box>
                        </Grid>

                    </Grid>
                }
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
                    </Box>
                </Box>
            </Backdrop>

            {/* Social media share */}
            <Popover sx={{ marginTop: '2.5rem' }} open={openShare} anchorEl={share} onClose={handleCloseShare}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }} PaperProps={{ sx: { width: '17rem' } }}
            >
                <SocialMediaShare />
            </Popover>

            {/* PHOTO PREVIEW */}
            <PhotoPreview data={data?.pictures} preview={preview} setPreview={setPreview} value={value} setValue={setValue} />

            <Backdrop open={message} sx={{ bgcolor: alpha('#03254C', 0.98), zIndex: 99 }}>
                {/* Message Box */}
                <PropertyContactForm user={user} data={data} setMessage={setMessage} name={t('signuptype.agent')} subtext={t('offplan.singleoffplan.sidebar.contact.agentnote')} />
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
        </motion.div>
    )
}

export default SinglePro