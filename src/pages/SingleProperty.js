import { PrivacyTipOutlined, FireplaceOutlined, FeaturedPlayListOutlined, FmdGoodOutlined, ReplyOutlined, Close, FiberManualRecord, Favorite, FavoriteBorder, Place, TaskAlt } from '@mui/icons-material'
import { alpha, Avatar, Box, Backdrop, IconButton, CircularProgress, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Popover, Typography, Container, Tooltip, Dialog, Hidden } from '@mui/material'
import React, { useContext, useEffect, useState, useRef } from 'react'
import RoundButton from '../components/Buttons/RoundButton'
import NoImage from '../assets/images/no-image.jpg'
import verifieddocs from '../assets/images/verifieddocs.png'
import styled from '@emotion/styled'
import Api from '../api/api'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import OwlCarousel from 'react-owl-carousel'
import { isLoggedIn } from '../services/auth'
import { PopupButton } from "react-calendly";
import RateContext from '../contexts/rateContext'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import PageLoader from '../components/PageLoader'
import { useSnackbar } from 'notistack';
import { motion } from "framer-motion";
import AmenitiesItem from '../components/AmenitiesItem'
import SocialMediaShare from '../components/Social/SocialMediaShare'
import PropertyContactForm from '../components/PropertyContactForm'
import mapboxgl from 'mapbox-gl'
import { Link } from "react-scroll";
import moment from 'moment/moment'
import ReactGA from 'react-ga4'
import GiveawayForm from './GiveawayForm'
import { getCurrentUser } from '../services/auth';
import QRCode from 'qrcode-generator'

const FlexBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '.5rem',
    alignItems: 'center'
}))

const StyledButton = styled(IconButton)(({ theme }) => ({
    borderRadius: '5px',
    // color: "white",
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

function SingleProperty() {
    const loc = window.location.pathname.split("/");
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [verify, setVerify] = useState(null);
    const openVerify = Boolean(verify);
    const [share, setShare] = useState(null);
    const openShare = Boolean(share);
    const [data, setData] = useState()
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(false)
    const [openGiveaway, setOpenGiveaway] = useState(false)
    const [giveaway, setGiveaway] = useState()
    let el = data?.user
    const ExContext = useContext(RateContext);
    const mapContainer = useRef(null);
    const map = useRef(null);
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [qrImage, setqrImage] = useState("");
    const [hideQR, setHideQR] = useState(false);


    useEffect(() => {
        (async () => {
            try {
                // check if the code is on the url
                const code = searchParams.get('code')

                const giveaway_response = await Api().get(`/giveaway-codes/${code}`);
                // if we dont have a giveaway that matches the code
                if (!giveaway_response?.data?.id) return;
                // if the giveaway we got isnt of the correct property id
                if (giveaway_response?.data?.rehomePropertyId !== loc[2] ) return;

                const codes = localStorage.getItem("GIVEAWAY_CODES");
                // if we dont have any saved giveaway or current giveaway id isnt included
                if (!codes || !codes.includes(`**${giveaway_response.data.id}**`)) {
                    // if we are loggedIn
                    if (getCurrentUser()?.id) {
                        // if giveaway has a response that matches our email
                        const existing_giveaway_response =
                            await Api().get(`/giveaways/${giveaway_response.data.id}/responses/${getCurrentUser()?.email}`)
                        if (!existing_giveaway_response?.data?.id) {
                            // open giveaway popup form
                            setGiveaway(giveaway_response?.data)
                            setOpenGiveaway(true);
                        }
                    } else {
                        // if we aren't logged in
                        setGiveaway(giveaway_response?.data)
                        setOpenGiveaway(true);
                    }
                }
            } catch (e) {
            }
        })()
    }, [])

    const AnalyticsEvent = () => {
        setTimeout(() => {
            ReactGA.event({
                category: data?.transactionType,
                action: "view",
                label: "Single property page",
                value: 99,
                location: data?.geoAddress,
                userName: user?.firstName + " " + user?.lastName,
            });
        }, 1000)
    }

    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Single property page" });

        AnalyticsEvent()
    }, [data])

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
                setHideQR(true)
                if(getCurrentUser().id === res?.data?.userId || getCurrentUser().userType === 'admin'){
                    setHideQR(false)
                }
            })
            .catch(() => {
                setLoading(false)
            })


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        // Create a QRCode instance with type number 4 and error correction level 'L' (Low)
        const qr = new QRCode(4, 'L');

        // Add the URL to the QR code
        qr.addData(window.location.href.split('?')[0]);
        
        // Make the QR code scalable by setting the size and scale
        qr.make();

        // Get the QR code as a data URL (base64 encoded image)
        setqrImage(qr.createDataURL(10, 0));
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
        try {
            if (!data || !data.gpsLocation || !mapContainer.current) return

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
            new mapboxgl.Marker(el).setLngLat([lng, lat])
                .addTo(map.current);

            map.current.scrollZoom.disable();
            map.current.addControl(new mapboxgl.NavigationControl());

            // eslint-disable-next-line react-hooks/exhaustive-deps
        } catch (e) {

        }
    }, [data, mapContainer])

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
            <Box>
                {loading ? <div style={{ height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}><PageLoader /></div> :
                    <Container maxWidth='xl'>
                        <Box sx={{ display: { sm: "flex", xs: "block" }, justifyContent: "space-between", alignItems: "center", padding: ".6rem 0", borderWidth: "1px 0" }}>

                            <Typography noWrap variant='h5'>{data?.name}</Typography>

                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: { xs: "1rem" } }}>
                                <StyledButton onClick={handleShare}>
                                    <ReplyOutlined />
                                    <Typography sx={{ marginLeft: "5px" }}>{t("singleproperty.tab1.title")}</Typography>
                                </StyledButton>
                                <StyledButton onClick={(e) => { toggleWishlist(loc[2]) }}>
                                    {load ? <CircularProgress size='1.33rem' color='primary' />
                                        : favs?.includes(loc[2]) ? <Favorite color='secondary' fontSize='small' /> : <FavoriteBorder color='#757575' fontSize='small' />
                                    }
                                </StyledButton>
                            </Box>
                        </Box>
                        <Grid container spacing={1}>
                            <Grid item xs={12} lg={8}>
                                <PropertySlider
                                    items={1} autoplay={true} autoplaySpeed={500} margin={20} loop={true} lazyLoad={true}
                                    nav={true} navElement="div" navText={[
                                        `<i class='fas fa-arrow-left'></i>`, `<i class='fas fa-arrow-right'></i>`]}
                                    responsive={{ 760: { items: '1' }, 340: { items: '1' } }}
                                >
                                    {
                                        data?.pictures.length < 1 ?
                                            <Box sx={{
                                                height: '37.8rem',
                                                backgroundImage: `url(${data?.pictures[0] ? data?.pictures[0] : NoImage})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                mb: .5,
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                alignItems: 'flex-end'

                                            }}>
                                                {/* <Button disabled={data?.pictures.length < 1} sx={{ mb: '3rem', ml: '2rem', bgcolor: '#fff', textTransform: 'none', color: '#000', '&:hover': { bgcolor: 'secondary', color: '#fff' } }} onClick={() => setPreview(true)} variant='contained' size='medium' >{t('singleproperty.viewphotos', { number: data?.pictures?.length })}</Button> */}
                                            </Box> :
                                            data?.pictures.map((item, index) => {
                                                return (
                                                    <Box key={index} sx={{
                                                        backgroundImage: `url(${item})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                        width: '100%', height: '37.8rem',

                                                    }}

                                                    />
                                                )

                                            })
                                    }
                                </PropertySlider>
                            </Grid>
                            <Hidden lgDown>
                                <Grid item xs={12} lg={4} sx={{ display: "flex", justifyContent: "center" }}>
                                    <PropertyContactForm user={user} data={data} executeRecaptcha={executeRecaptcha} />
                                </Grid>
                            </Hidden>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }} py={5}>
                                    <Avatar
                                        onClick={() => navigate(`/brokers/${data?.user?.firstName.toLowerCase()}/${el?.id}`, { state: { el } })}
                                        src={ExContext?.thumbnail(data?.user?.avatar)}
                                        sx={{ width: '3.5rem', height: '3.5rem', cursor: "pointer" }}
                                    />
                                    <Box sx={{ width: "100%" }}>
                                        <Typography fontSize={"1.2rem"} fontWeight={"600"} width={"70%"}>{data?.user?.agencies[0]?.name}</Typography>
                                        <FlexBox>
                                            <Place fontSize='small' />
                                            <Typography noWrap variant='body2'>{data?.user?.agencies[0]?.address}</Typography>
                                        </FlexBox>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Tabs & Buttons */}
                        <Box>
                            <Box sx={{ bgcolor: 'secondary.main', height: '4rem', padding: "0 1rem", borderColor: 'divider', color: '#fff', position: "sticky", top: "0", zIndex: '1', display: { xs: "none", sm: "flex" }, alignItems: "center", width: "100%", overflowX: "auto" }}>
                                <Box sx={{ display: "flex", gap: "22px" }}>
                                    <Link activeClass="activenav" style={{ padding: "8px", cursor: "pointer" }} spy to="overview">
                                        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <PrivacyTipOutlined size="small" />
                                            {t("singleproperty.tab3.title")}
                                        </Box>
                                    </Link>
                                    {data?.amenities?.length > 0 &&
                                        <Link activeClass="activenav" style={{ padding: "8px", cursor: "pointer" }} spy to="amenities">
                                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <FireplaceOutlined size="small" />
                                                {t("singleproperty.tab4.title")}
                                            </Box>
                                        </Link>
                                    }
                                    {
                                        data?.features?.filter((ft) => ft?.active === true)?.length > 0 &&
                                        <Link activeClass="activenav" style={{ padding: "8px", cursor: "pointer" }} spy to="features">
                                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <FeaturedPlayListOutlined size="small" />
                                                {t("singleproperty.tab5.title")}
                                            </Box>
                                        </Link>
                                    }
                                    <Link activeClass="activenav" style={{ padding: "8px", cursor: "pointer" }} spy to="mapp">
                                        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <FmdGoodOutlined size="small" />
                                            {t("singleproperty.tab6.title")}
                                        </Box>
                                    </Link>
                                </Box>
                            </Box>

                            <Box id="overview" sx={{ paddingTop: { xs: '15px', sm: '100px' } }}>
                                <Box>
                                    <Typography variant='h5' mb={3}>{t("singleproperty.tab3.title")}</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={10}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6} sm={3} padding={'1rem'}><Typography paddingLeft={"1rem"}>{t("singleproperty.tab1.propertyname")}</Typography></Grid>
                                                <Grid item xs={6} sm={9} padding={'1rem'}><Tooltip title={data?.name}><Typography>{data?.name}</Typography></Tooltip></Grid>

                                                <Grid item xs={12} md={6}>
                                                    <Box sx={{ display: "flex", gap: "17px", alignItems: "center", padding: "1rem" }}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6}><Typography>{t("singleproperty.tab1.price")}</Typography></Grid>
                                                            <Grid item xs={6}><Typography>{data?.hidePrice ? `${t('findanagent.singleagent.contactagentforprice')}` : `${ExContext?.preferredCurrency} ${(ExContext?.convert(data?.currency, data?.price))?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${data?.priceInterval ? ` ${t('agentdashboard.addlisting.tab6.' + data?.priceInterval)}` : data?.transactionType === "sale" ? "" : "/" + t('agentdashboard.addoffplan.tab2.month')} `}</Typography></Grid>
                                                        </Grid>
                                                    </Box>
                                                    <Box sx={{ display: "flex", gap: "17px", alignItems: "center", backgroundColor: "#F8F8F8", padding: "1rem" }}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6}><Typography>{t("singleproperty.tab1.size")}</Typography></Grid>
                                                            <Grid item xs={6}><Typography>{data?.sizeOfHouse < 1 ? t('offplan.singleoffplan.pricing.tab1.sizenotavailable') : data?.sizeOfHouse + ' sqft'}</Typography></Grid>
                                                        </Grid>
                                                    </Box>
                                                    <Box sx={{ display: "flex", gap: "17px", alignItems: "center", padding: "1rem" }}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6}><Typography>{t("singleproperty.tab1.sizeLand")}</Typography></Grid>
                                                            <Grid item xs={6}><Typography>{!data?.sizeOfLand || data?.sizeOfLand < 1 ? t('offplan.singleoffplan.pricing.tab1.sizenotavailable') : data?.sizeOfLand + ' sqft'}</Typography></Grid>
                                                        </Grid>
                                                    </Box>
                                                    <Box sx={{ display: "flex", gap: "17px", alignItems: "center", backgroundColor: "#F8F8F8", padding: "1rem" }}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6}><Typography>{t("singleproperty.tab3.year")}</Typography></Grid>
                                                            <Grid item xs={6}><Typography>{data?.year_constructed < 1 ? t('offplan.singleoffplan.pricing.tab1.yearnotavailable') : data?.year_constructed}</Typography></Grid>
                                                        </Grid>
                                                    </Box>
                                                    <Box sx={{ display: "flex", gap: "17px", alignItems: "center", padding: "1rem" }}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6}><Typography>{t("singleproperty.tab1.datelisted")}</Typography></Grid>
                                                            <Grid item xs={6}><Typography>{moment(data?.createdAt).format('DD MMM YYYY')}</Typography></Grid>
                                                        </Grid>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Box sx={{ display: "flex", gap: "17px", alignItems: "center", backgroundColor: "#F8F8F8", padding: "1rem" }}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6}><Typography>{t('filter.location.title')}</Typography></Grid>
                                                            <Grid item xs={6}><Typography>{data?.geoAddress}</Typography></Grid>
                                                        </Grid>
                                                    </Box>
                                                    <Box sx={{ display: "flex", gap: "17px", alignItems: "center", padding: "1rem" }}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6}><Typography>{t("singleproperty.tab1.bedrooms")}</Typography></Grid>
                                                            <Grid item xs={6}><Typography>{data?.bedrooms}</Typography></Grid>
                                                        </Grid>
                                                    </Box>
                                                    <Box sx={{ display: "flex", gap: "17px", alignItems: "center", backgroundColor: "#F8F8F8", padding: "1rem" }}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6}><Typography>{t("singleproperty.tab1.bathrooms")}</Typography></Grid>
                                                            <Grid item xs={6}><Typography>{data?.bathrooms}</Typography></Grid>
                                                        </Grid>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={6} sm={4} md={3} marginTop={'1rem'}><Typography paddingLeft={"1rem"}>{t("singleproperty.tab3.description")}</Typography></Grid>
                                                <Grid item xs={6} sm={8} md={9} marginTop={'1rem'}><Tooltip title={data?.description}><Typography>{data?.description}</Typography></Tooltip></Grid>
                                            </Grid>

                                        </Grid>

                                        <Grid item xs={12} md={2}>
                                            <Box sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'row', md: 'column', lg: 'column' }, gap: '1rem', mb: { xs: '1rem', sm: '1rem', md: 0, lg: 0 } }}>
                                                {/* <PopupButton
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

                                                /> */}
                                                <RoundButton onClick={handleVerify} size={'small'} text={t("singleproperty.tab3.buttons.verify")} variant='contained' disableElevation color={'primary'} sx={{ lineHeight: 1.3, borderRadius: { xs: '8px', sm: '8px' } }} />

                                            </Box>
                                            {!!qrImage && !hideQR && <Box mt={3}>
                                                <Grid item xs={12} sm={12} md={12} lg={12} sx={{ width: '100%', height: "30vh" }}>
                                                    <Box mb={2} sx={{ height: '100%' }}>
                                                        <img src={qrImage} alt="QR Code" />
                                                    </Box>
                                                </Grid>
                                            </Box>}
                                        </Grid>
                                    </Grid>
                                    <Divider  />

                                </Box>
                            </Box>

                            {
                                data?.amenities?.length > 0 &&
                                <div id="amenities" >
                                    <Box id="tab2" sx={{ paddingTop: {sm: "100px", xs: "50px"} }}>
                                        <Typography variant='h5' mb={3}>{t("singleproperty.tab4.title")}</Typography>
                                        {/* <Typography variant='h6' mb={2} sx={{ fontSize: '1.2rem', fontWeight: 600 }}>{t('singleproperty.tab4.note', { number: data?.amenities?.length })}</Typography> */}
                                        <Grid container spacing={2}>
                                            {
                                                data?.amenities?.map((el, index) => {
                                                    return (
                                                        <Grid key={index} item xs={4} sm={2} md={2} lg={2} mb={2}>
                                                            <AmenitiesItem el={el} />
                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </Grid>
                                    </Box>
                                </div>
                            }

                            {
                                data?.features?.filter((ft) => ft?.active === true)?.length > 0 &&
                                <div id="features">
                                    <Box sx={{ paddingTop: {sm: "100px", xs: "50px"} }}>
                                        <Typography variant='h5' mb={3}>{t("singleproperty.tab5.title")}</Typography>
                                        {/* <Typography variant='h6' mb={2} sx={{ fontSize: '1.2rem', fontWeight: 600 }}>{t('singleproperty.tab5.note', { number: data?.features?.filter((ft) => ft?.active === true)?.length })}</Typography> */}
                                        <Grid container>
                                            {
                                                data?.features?.filter((ft) => ft?.active === true)?.map((el, index) => {
                                                    return (
                                                        <Grid item xs={12} sm={6} lg={4} mb={2} key={index} sx={{ display: "flex", alignItems: "center" }}>
                                                            <ListItemIcon sx={{ minWidth: '30px' }}><FiberManualRecord color='primary' sx={{ fontSize: '.7rem' }} /></ListItemIcon>
                                                            <ListItemText>{el?.name}</ListItemText>
                                                        </Grid>
                                                    )
                                                })
                                            }

                                        </Grid>

                                    </Box>
                                </div>
                            }

                            <div id="mapp">
                                <Box  sx={{ paddingTop: {sm: "100px", xs: "50px"}, marginBottom: {sm: "70px", xs: "35px"} }}>
                                    <Typography variant='h5' mb={3}>{t('singleproperty.tab6.note')}</Typography>
                                    <Box>
                                        {/* Put Map Here */}
                                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ width: '100%', height: "50vh", overflow: "visible" }}>
                                            <Box mb={2} sx={{ height: '100%' }}>
                                                <div id="map" ref={mapContainer} className="h-full" />
                                            </Box>
                                        </Grid>
                                    </Box>
                                </Box>
                            </div>


                            <Hidden lgUp>
                                <Grid item xs={12} lg={4} sx={{ display: "flex", justifyContent: "center" }}>
                                    <PropertyContactForm user={user} data={data} executeRecaptcha={executeRecaptcha} />
                                </Grid>
                            </Hidden>
                        </Box>
                    </Container>}

                {/* Social media share */}
                <Popover sx={{ marginTop: '2.5rem' }} open={openShare} anchorEl={share} onClose={handleCloseShare}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }} PaperProps={{ sx: { width: '17rem' } }}
                >
                    <SocialMediaShare />
                </Popover>

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

                {/* Giveaway form */}
                <Dialog
                    open={openGiveaway}
                    keepMounted
                    onClose={() => setOpenGiveaway(false)}
                    fullWidth
                    maxWidth="sm"
                >
                    <GiveawayForm openGiveaway={giveaway} setOpenGiveaway={setOpenGiveaway} executeRecaptcha={executeRecaptcha} />
                </Dialog>
            </Box>
        </motion.div>
    )
}

export default SingleProperty