import React, { useState, useEffect, useContext } from 'react';
import { TextField, CircularProgress, Grid, Box, Container, Autocomplete, Typography, Button, Card, CardContent, styled, List, ListItem, ListItemIcon, ListItemText, Hidden, IconButton, Dialog, Select, MenuItem, InputAdornment } from '@mui/material';
import { useTranslation } from "react-i18next";
import landingImage from "../../assets/images/landingimage.png"
import { Help, HorizontalRule, Search } from '@mui/icons-material';
import housePlaceholder from '../../assets/images/bannerbackground.jpg'
import RoundButton from '../Buttons/RoundButton';
import BuyIcon from '../../assets/images/buyHome.svg'
import RentIcon from '../../assets/images/rentHome.svg'
import SellIcon from '../../assets/images/sellHome.svg'
import Deals from '../../assets/images/deals_img.png'
import Deals1 from '../../assets/images/deals_01.png'
import Deals2 from '../../assets/images/deals_02.png'
import HPhone from '../../assets/images/handheld.png'
import AppStore from '../../assets/images/appstore.png'
import GooglePlay from '../../assets/images/googleplay.png'
import FLAGS from '../../assets/images/Flags/flags'
import { useNavigate, useSearchParams } from 'react-router-dom';
import Api from '../../api/api';
import { isLoggedIn, setAuthToken } from '../../services/auth';
import { motion } from "framer-motion";
import { useSnackbar } from 'notistack';
import PropertyItem from '../PropertyItem';
import RateContext from '../../contexts/rateContext';
import OffPlanItem from '../OffPlanItem';
import FirstVisitDialog from '../FirstVisitDialog';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import PillButton from '../Buttons/PillButton';
import { isMobile } from 'react-device-detect';
import { useGoogleOneTapLogin } from '@react-oauth/google';

const SubTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: '1.5rem',
  margin: '2rem 0'
}))

function Banner() {
  const { t } = useTranslation();
  const ExContext = useContext(RateContext);
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams] = useSearchParams();
  const SITE_KEY = process.env.REACT_APP_SITE_KEY

  const [constantLocation, setConstantLocation] = useState([])
  const [timeoutMulti, setTimeoutMulti] = useState(null)
  const [properties, setProperties] = useState([])
  const [location, setLocation] = useState("")
  const [country, setCountry] = useState("ghana")
  const [countries, setCountries] = useState(['ghana'])
  const [coordinates, setCoordinates] = useState([{ lng: "", lat: "" }])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [openVisitDialog, setOpenVisitDialog] = useState(false)
  const [user, setUser] = useState()
  const [load, setLoad] = useState(false)
  const [favs, setFavs] = useState([])
  const [redirectPage, setRedirectPage] = useState('buy')
  const accessToken = searchParams.get('code');

  const getLocation = (event, newValue) => {
    setLocation(newValue.label)
    setCoordinates({ lng: newValue?.longitude, lat: newValue?.latitude })
    navigate('/' + redirectPage, { state: { coordinates: { lng: newValue?.longitude, lat: newValue?.latitude }, search: newValue.label } })
  }

  useEffect(() => {
    if (accessToken !== null) {
      setAuthToken(accessToken)
      window.location.replace('/')
    } else if (searchParams.get('no_auth') === "no_email_signup_error") {
      enqueueSnackbar(t('createaccount.noemailerror'), { variant: 'error' });
      navigate('/')
    } else if (searchParams.get('no_auth') === "suspended_account_error") {
      enqueueSnackbar(t('createaccount.suspenderror'), { variant: 'error' });
      navigate('/')
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    Api().get('constants/countries')
      .then((res) => {
        setCountries(res?.data)
      })
      .catch((error) => {

      })
  }, [])


  const handleSearchChange = (value) => {
    try {
      clearTimeout(timeoutMulti)
    }
    catch {

    }
    setLoading(true)
    setSearch(value);
    setTimeoutMulti(setTimeout(() => {
      getConstantLocation(value)
    }, 1500))
  }

  const getConstantLocation = (searchTerm) => {
    Api().get('/constants/atlas/locations', {
      params: {
        filter: {
          text: searchTerm,
          country: country,
          limit: 10
        }
      }
    })
      .then((res) => {
        setConstantLocation(res?.data)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
      })
  }

  // get sponsored properties
  const getListings = () => {

    Api().get('/rehome-properties/featured')
      .then((response) => {
        setProperties(response?.data?.map((el) => el?.sponsored ? { ...el, sponsored: false } : { ...el }))
      })
      .catch((error) => {
      })
  }

  useEffect(() => {
    getListings()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getUserInfo = () => {
    Api().get('/me')
      .then((res) => {
        setUser(res?.data)
        setFavs(res?.data?.wishlist?.rehomePropertyIds)
      })
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  // Add to wishlist
  const toggleWishlist = (e, id) => {
    e.preventDefault()
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

  useEffect(() => {
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        navigate('/buy', { state: { coordinates } })
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [coordinates]);

  // first time visit dialog
  useEffect(() => {

    const code = searchParams.get('show')

    if (code === 'newsletter') {
      setOpenVisitDialog(true)
    } else if (localStorage.getItem("hasVisited") == null) {
      setOpenVisitDialog(true)
      localStorage.setItem("hasVisited", "true")
    }
  }, [])

  useGoogleOneTapLogin({
    onSuccess: credentialResponse => {
      Api().post('/auth/thirdparty/google/one-tap-signin/'+credentialResponse.credential)
        .then(res => {
          setAuthToken(res.data.accessToken)
          window.location.replace('/')
        })
        .catch(err => console.log(err))
    },
    onError: () => {
      console.log('Login Failed');
    },
    disabled: isLoggedIn(),
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >

      {/* WhatApp Floating Btn */}
      <IconButton onClick={() => navigate('/help')} size='large' sx={{ position: 'fixed', bottom: '2.5%', right: '1.5%', bgcolor: '#5b9c00', '&:hover': { bgcolor: '#03254C' } }}>
        <Help sx={{ color: '#fff', fontSize: '2.1rem' }} />
      </IconButton>

      {/* Banner section */}
      <Box sx={{ 
        backgroundImage: `url(${housePlaceholder})`, 
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        //bgcolor: (theme) => theme.palette.tertiary.main,
        height: { xs: "28rem" , sm: "28rem", md: '35rem', lg: '35rem' } }}>
        <Container maxWidth='xl' sx={{ height: '100%', overflow: "hidden" }}>
          <Grid container spacing={5} sx={{ height: '100%', marginTop: { xs: "0rem", md: "0", lg: "-1.5rem" } }} >
            <Grid item xs={12} sm={12} md={12} lg={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: { xs: '0rem', sm: '0rem', md: '0rem', lg: '0rem' } }} >
              <Box>
                <Typography mb={4} sx={{ fontWeight: 600, fontSize: { xs: '1.6rem', sm: '1.6rem', lg: '2.5rem' }, color: '#fff', lineHeight: 1.2 }} dangerouslySetInnerHTML={{ __html: !isMobile ? t('banner.mainText') : t('banner.subText_'+redirectPage) }} />
                {!isMobile && <Typography mb={6} sx={{ fontWeight: 600, color: '#fff' }} dangerouslySetInnerHTML={{ __html: t('banner.subText_'+redirectPage) }} />
                }

                <Autocomplete
                  id="location"
                  getOptionLabel={(option) => option.label}
                  options={constantLocation}
                  freeSolo
                  loading={loading}
                  open={search.length > 1}
                  renderInput={(params) => (
                    <div className="flex">
                      <TextField
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '50px',
                            background: '#fff',
                            border: 'none',
                            outline: 'none',
                            // height: "56.8px"
                          }
                        }}
                        {...params}
                        variant='outlined'
                        fullWidth
                        placeholder={t('banner.searchPlaceholder')}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: <InputAdornment position='start'>
                            <Select
                              id="countrySelect"
                              size="small"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              renderValue={() => {
                                return (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '60px' }}>
                                    <img
                                      src={`${FLAGS[country]}`}
                                      className="h-[17px] ml-1"
                                      alt={country}
                                    />
                                  </Box>
                                );
                              }}
                              sx={{
                                '& .MuiSelect-select': {
                                  display: 'flex',
                                  padding: '0 !important',
                                  backgroundColor: "#fff"
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  border: '0',
                                  margin: "0"
                                },
                              }}
                            >
                              {countries.map(c =>
                              (<MenuItem value={c.key} key={c.key} disabled={c.key !== 'ghana'}>
                                <img src={`${FLAGS[c.key]}`} width={19} className="mr-1" alt={c.key} />
                                <Typography sx={{textTransform: 'capitalize', marginLeft: '.5rem', fontSize: '1rem'}}>{c.key}</Typography>
                              </MenuItem>)
                              )}
                            </Select>
                          </InputAdornment>
                        }}
                        onChange={(e) => handleSearchChange(e.target.value)}
                      />
                    </div>
                  )}
                  onChange={(event, newValue) => { getLocation(event, newValue) }}
                />

                <div className='flex gap-2 mt-5 justify-between'>
                  <Box mt={1} sx={{ display: "flex", justifyContent: "center" }} onClick={() => setRedirectPage('buy')}>
                    <PillButton
                      text={t('navbar.buy').toUpperCase()}
                      size="small"
                      width={{ xs: '80px', sm: '100px', md: '140px', lg: "140px" }}
                      borderColor="transparent"
                      color="#FFFFFF"
                      backgroundColor={redirectPage === 'buy' ? "secondary.main" : "#1267B1"}
                      variant={redirectPage === 'buy' ? "contained" : "outlined"}
                      hoverColor="#1267B1"
                    />
                  </Box>
                  <Box mt={1} sx={{ display: "flex", justifyContent: "center" }} onClick={() => setRedirectPage('rent')}>
                    <PillButton
                      text={t('navbar.rent').toUpperCase()}
                      size="small"
                      width={{ xs: '80px', sm: '100px', md: '140px', lg: "140px" }}
                      borderColor="transparent"
                      color="#FFFFFF"
                      backgroundColor={redirectPage === 'rent' ? "secondary.main" : "#1267B1"}
                      variant={redirectPage === 'rent' ? "contained" : "outlined"}
                      hoverColor="#1267B1"
                    />
                  </Box>
                  <Box mt={1} sx={{ display: "flex", justifyContent: "center" }} onClick={() => setRedirectPage('shortlet')}>
                    <PillButton
                      text={t('navbar.shortlet').toUpperCase()}
                      size="small"
                      width={{ xs: '80px', sm: '100px', md: '140px', lg: "140px" }}
                      borderColor="transparent"
                      color="#FFFFFF"
                      backgroundColor={redirectPage === 'shortlet' ? "secondary.main" : "#1267B1"}
                      variant={redirectPage === 'shortlet' ? "contained" : "outlined"}
                      hoverColor="#1267B1"
                    />
                  </Box>
                  <Box mt={1} sx={{ display: "flex", justifyContent: "center" }} onClick={() => setRedirectPage('off-plan')}>
                    <PillButton
                      text={t('navbar.offplan').toUpperCase()}
                      size="small"
                      width={{ xs: '80px', sm: '100px', md: '140px', lg: "140px" }}
                      borderColor="transparent"
                      color="#FFFFFF"
                      backgroundColor={redirectPage === 'off-plan' ? "secondary.main" : "#1267B1"}
                      variant={redirectPage === 'off-plan' ? "contained" : "outlined"}
                      hoverColor="#1267B1"
                    />
                  </Box>
                </div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured properties */}
      <Box bgcolor='#F7F7F7'>
        <Container maxWidth='lg'>
          <Grid container spacing={3} >
            {/* {loading ?
            <Grid item pt={'6rem'} xs={12}>
              <PageLoader />
            </Grid>
            :
            <> */}
            {properties?.length < 1 ? "" :
              <Grid item xs={12} sx={{ marginTop: { xs: "4rem", md: "0" } }}>
                {/* <Typography variant='h5' sx={{ fontWeight: "600", color: "#fff" }}>{t('banner.featuredproperties')}</Typography> */}
              </Grid>
            }
            {properties?.length < 1 ? "" : properties?.map((el, index) => {
              return (
                <Grid item xs={12} sm={6} md={3} lg={3} key={index}>
                  {el?.propertyType === "development" ?
                    <OffPlanItem el={el} ExContext={ExContext}/>
                    :
                    <PropertyItem
                      el={el}
                      name={el?.name}
                      address={el?.geoAddress}
                      price={el?.price}
                      images={el?.pictures}
                      wifi
                      bed={{ number: el?.bedrooms }}
                      bath={{ number: el?.bathrooms }}
                      garage={{ number: '1' }}
                      agentName={el?.user?.firstName + " " + el?.user?.lastName}
                      agentImage={el?.user?.avatar}
                      verified={el?.user?.verified}
                      type={el?.transactionType}
                      ExContext={ExContext}
                      currency={el?.currency}
                      toggleWishlist={toggleWishlist}
                      load={load}
                      favs={favs}
                    />
                  }
                </Grid>
              )
            })
            }
          </Grid>
        </Container>
      </Box>

      {/* card section */}

      <Box sx={{ padding: { xs: "6rem 0 5.5rem 0", md: "5rem 0 5.5rem 0" } }} bgcolor='#F7F7F7'>
        <Container maxWidth='lg'>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <Card elevation={0} variant='outlined' sx={{ borderRadius: '10px' }}>
                <CardContent sx={{ padding: '4rem 3rem', textAlign: 'center' }}>
                  <img src={BuyIcon} alt='buy' width={'25%'} style={{ margin: '0 auto' }} />
                  <SubTitle>{t('sectionone.buy')}</SubTitle>
                  <Typography sx={{ mb: '2rem', height: "6.4rem" }}>{t('sectionone.buysubText')}</Typography>
                  <a href='/buy'><RoundButton text={t('sectionone.button')} sx={{ mb: '2rem' }} variant='outlined' color={'primary'} /></a>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <Card elevation={0} variant='outlined' sx={{ borderRadius: '10px' }}>
                <CardContent sx={{ padding: '4rem 3rem', textAlign: 'center' }}>
                  <img src={RentIcon} alt='rent' width={'25%'} style={{ margin: '0 auto' }} />
                  <SubTitle>{t('sectionone.rent')}</SubTitle>
                  <Typography sx={{ mb: '2rem', height: "6.4rem" }}>{t('sectionone.rentsubText')}</Typography>
                  <a href='/rent'><RoundButton text={t('sectionone.button')} sx={{ mb: '2rem' }} variant='outlined' color={'primary'} /></a>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <Card elevation={0} variant='outlined' sx={{ borderRadius: '10px' }}>
                <CardContent sx={{ padding: '4rem 3rem', textAlign: 'center' }}>
                  <img src={SellIcon} alt='sell' width={'25%'} style={{ margin: '0 auto' }} />
                  <SubTitle>{t('sectionone.sell')}</SubTitle>
                  <Typography sx={{ mb: '2rem', height: "6.4rem" }}>{t('sectionone.sellsubText')}</Typography>
                  <a href='/sell'><RoundButton text={t('sectionone.button')} sx={{ mb: '2rem' }} variant='outlined' color={'primary'} /></a>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* right choice section */}
      <Box sx={{ bgcolor: 'secondary.main', color: '#fff', py: '8rem' }}>
        <Container maxWidth='lg'>
          <Grid container spacing={5}>

            <Grid item xs={12} sm={12} md={6} lg={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
              <Typography variant='h4' sx={{ fontWeight: 600, fontSize: { xs: '1.7rem', sm: '1.8rem', md: '2.4rem' } }} mb={3} dangerouslySetInnerHTML={{ __html: t('sectiontwo.maintext') }} />
              <Typography mb={'2rem'}>{t('sectiontwo.subtextone')}</Typography>
              <List disablePadding sx={{ mb: '3rem' }}>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: '30px' }}><HorizontalRule color='paper' /></ListItemIcon>
                  <ListItemText>{t('sectiontwo.subtexttwo')}</ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: '30px' }}><HorizontalRule color='paper' /></ListItemIcon>
                  <ListItemText>{t('sectiontwo.subtextthree')}</ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: '30px' }}><HorizontalRule color='paper' /></ListItemIcon>
                  <ListItemText>{t('sectiontwo.subtextfour')}</ListItemText>
                </ListItem>
              </List>

              <RoundButton onClick={() => navigate('/advertise')} text={t('footer.advertise')} sx={{ width: '8rem' }} disableElevation variant='contained' color={'primary'} />

            </Grid>

            <Hidden mdDown>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Box sx={{ position: 'relative' }}>
                  <img src={Deals1} width='25%' style={{ position: 'absolute', top: '0%', right: 0 }} alt='right-choice' />
                  <img src={Deals} width='80%' style={{ margin: '0 auto' }} alt='right-choice' />
                  <img src={Deals2} width='28%' style={{ position: 'absolute', bottom: '-8%', left: '-10%' }} alt='right-choice' />
                </Box>
              </Grid>
            </Hidden>
          </Grid>
        </Container>
      </Box>

      {/* mobile app section */}
      <Box sx={{ padding: '4rem 0 0 0' }}>
        <Container maxWidth='xl'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6} sx={{
              '& > img': {
                margin: '0 auto',
                marginRight: { xs: '0', sm: '0', lg: '-10px' },
                width: { xs: '80%', sm: '80%', lg: '70%' },
                opacity: '0.5'
              }
            }}>
              <img src={HPhone} alt='hand_with_phone' />
            </Grid>
            <Grid item sm={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
              <Typography variant='h4' mb={'2rem'} sx={{ fontWeight: 600, opacity: '0.5', fontSize: { xs: '1.8rem', sm: '2rem' }, textAlign: { xs: 'center', sm: 'left' } }}>{t('sectionthree.maintext')} </Typography>
              <Typography sx={{ textAlign: { xs: 'center', sm: 'left' }, opacity: '0.5' }} dangerouslySetInnerHTML={{ __html: t('sectionthree.subtext') }} />
              <Box sx={{ display: 'flex', gap: '1rem', mt: '2rem', mb: '2rem', justifyContent: { xs: 'center', sm: 'flex-start' }, opacity: '0.5' }}>
                <img src={AppStore} width='30%' alt='appstore' />
                <img src={GooglePlay} width='30%' alt='google_play' />
              </Box>
              <Typography variant='h4' sx={{ margin: '2rem auto', fontWeight: "400" }}>{t('comingsoon.title')}</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Dialog
        open={openVisitDialog}
        keepMounted
        onClose={() => setOpenVisitDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: {
            backgroundColor: 'red',
            boxShadow: 'none',
          },
        }}
      >
        <GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}>
          <FirstVisitDialog setOpenVisitDialog={setOpenVisitDialog} />
        </GoogleReCaptchaProvider>
      </Dialog>
    </motion.div>
  );
}

export default Banner;