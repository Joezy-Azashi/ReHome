import React, { useState, useEffect, useContext } from 'react';
import cnavLogo from '../../assets/images/christmas_newLogoNavbar.png';
import navLogo from '../../assets/images/newLogoNavbar.png';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams, NavLink } from 'react-router-dom';
import PillButton from '../Buttons/PillButton';
import signUp from '../../assets/images/signUpIcon.png';
import login from '../../assets/images/loginIcon.png';
import LanguageSelection from '../LanguageSelection/LanguageSelection';
import CurrencySelection from '../CurrencySelection/CurrencySelection';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Notifications, Tune } from '@mui/icons-material'
import { grey } from '@mui/material/colors'
import { Dialog, Slide, IconButton, Avatar, Tooltip, Menu, Container, Box, Badge, Typography, Popover, Hidden, Alert } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MobileMenu from './MobileMenu';
import { isMobile } from 'react-device-detect';
import Footer from '../Footer/Footer';
import { useSnackbar } from 'notistack';
import { isLoggedIn, logoutUser, setCurrentUser, getUserType } from '../../services/auth';
import Api from '../../api/api';
import NavbarMenu from './NavbarMenu';
import _ from 'lodash';
import NotificationItem from '../NotificationItem';
import RateContext from '../../contexts/rateContext';
import OneSignal from 'react-onesignal';
import moment from 'moment';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

function Navbar({ page }) {
  const { t, i18n } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()
  const path = useLocation().pathname.split('/')[2]
  const pathname = useLocation().pathname

  const active = useLocation().pathname.split('/')[1]

  const rate = useContext(RateContext);

  const [mobileMenu, setMobileMenu] = useState(false)
  const [loggedin] = useState(isLoggedIn())
  const [userData, setUserData] = useState("")
  const [language, setLanguage] = useState(rate?.preferredLanguage)
  const [currency, setCurrency] = useState(rate?.preferredCurrency ? rate?.preferredCurrency : localStorage.getItem('currency') ? localStorage.getItem('currency') : 'GHS')
  const [notification, setNotification] = useState([])

  const handleNotificationClick = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleSettingsClick = (event) => {
    setAnchorEl3(event.currentTarget);
  };

  const handleOpenMenu = () => {
    setMobileMenu(true);
  };

  const handleCloseMenu = () => {
    setMobileMenu(false);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [anchorEl3, setAnchorEl3] = React.useState(null);
  const openNavbarMenu = Boolean(anchorEl);
  const openNotification = Boolean(anchorEl2);
  const openSettings = Boolean(anchorEl3);

  const closeNotification = () => {
    setAnchorEl2(null);
  };

  const closeSettings = () => {
    setAnchorEl3(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseNavbarMenu = () => {
    setAnchorEl(null);
  };


  const [anchorEl5, setAnchorEl5] = useState(null);
  const handleShortletPopoverOpen = (event) => {
    setAnchorEl5(event.currentTarget);
  };

  const handleShortletPopoverClose = () => {
    setAnchorEl5(null);
  };

  const open5 = Boolean(anchorEl5);

  const logout = () => {
    logoutUser()
    window.location.assign("/")
  }

  const verifyToken = searchParams.get('token')
  useEffect(() => {
    if (verifyToken !== null && !isLoggedIn()) {
      enqueueSnackbar(t('verify.login'), { variant: 'warning' });
    } else if (verifyToken !== null) {
      const data = {
        verificationToken: verifyToken
      }
      Api().patch("/verify/email", data)
        .then((response) => {
          enqueueSnackbar(t('verify.success'), { variant: 'success' });
          navigate("/")
        })
        .catch((error) => {
        })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, enqueueSnackbar, t, verifyToken])

  const getNotification = (id) => {
    Api().get(`users/${id}/notifications`, {
      params: {
        filter: {
          where: { closed: false },
          order: ["createdAt DESC"]
        }
      }
    })
      .then((res) => {
        setNotification(res?.data)
      })
  }

  const checkNotification = (id) => {
      Api().get(`users/${id}/notifications-check`)
      .then((res) => {
          if(res.data.success){
              getNotification(id);
          }
      })
      .catch(e=>{
        
      })
  }
  
  useEffect(() => {
    let interval;
    if (isLoggedIn()) {
      Api().get("/me")
        .then((response) => {
          setUserData(response.data)
          setLanguage(response?.data?.language)
          i18n.changeLanguage(response?.data?.language);
          setCurrency(response?.data?.preferredCurrency)
          setCurrentUser(response.data)

          if (response?.data?.userType === "social") {
            navigate("/select-user-type")
            return
          }


          getNotification(response.data?.id)

          interval = setInterval(()=>{
            checkNotification(response.data?.id);
          }, 30000)

        })
        .catch(() => { })

    }

    return () => {
      clearInterval(interval)
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    
  }, [])

  useEffect(() => {
    const paidToken = searchParams.get('trxref')
    if (paidToken !== null) {
      setTimeout(() => {
        window.location.assign('/broker/dashboard')
      }, [3000])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const closeSingleNotification = (data) => {
    Api().patch(`notifications/${data?.id}`, { closed: true })
      .then((res) => {
        getNotification(userData?.id)
      })
  }

  window.addEventListener("scroll", function () {
    let scroll = document.querySelector(".scrollTop");
    scroll && scroll.classList.toggle("active", window.scrollY > 200);
  });

  // hide navbar onscroll on single property page
  window.addEventListener("scroll", function () {
    let hide = document.querySelector(".hideNav");
    (hide && this.window.screen.width > 400 && window.location.pathname.split("/")[3] === "details") && hide.classList.toggle("active", window.scrollY > 680);
  });

  function scrollToTop() {
    window.scrollTo({
      top: 0,
    });
  }

  useEffect(() => {
    OneSignal.sendTag('userType', isLoggedIn() ? userData?.userType : 'anonymous')
    OneSignal.sendTag('subscribed', isLoggedIn() && userData?.subscription?.active ? true : false)
  }, [userData])

  // currency change
  const handleCurrencyChange = (currency) => {
    localStorage.setItem('currency', currency)

    if (isLoggedIn()) {
      Api().patch('/me', { preferredCurrency: currency })
        .then((response) => {
          Api().get(`/exchange-rates/latest/${currency}`)
            .then((res) => {
              rate.setRates(res?.data)
              rate.setPreferredCurrency(currency)
            })
        })
    } else {
      Api().get(`/exchange-rates/latest/${currency}`)
        .then((res) => {
          rate.setRates(res?.data)
          rate.setPreferredCurrency(currency)
        })
    }
  }
  const [anchorEl4, setAnchorEl4] = React.useState(null);

  const handleMouseEnter = (event) => {
    //hovering on rent
    console.log('mouse entered')
    setAnchorEl4(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl4(null)
  };


  const open4 = Boolean(anchorEl4);

  useEffect(() => {
    handleCurrencyChange(currency)
  }, [currency])

  // language change
  const handleLangChange = (language) => {
    i18n.changeLanguage(language);

    if (isLoggedIn()) {
      Api().patch('/me', { language: language })
        .then(() => { })
    }
  };

  useEffect(() => {
    handleLangChange(language)
  }, [language])

  return (
    <div >
      <div className="navbar-position hideNav" onMouseLeave={handleShortletPopoverClose} >
        <Container maxWidth='xl' sx={{ height: '100%', display: "flex", justifyContent: "space-between" }} >
          <div className="flex items-center">
            <div className="navitems-breakpoint:hidden mr-3">
              <IconButton onClick={handleOpenMenu}>
                <MenuOutlinedIcon />
              </IconButton>
            </div>
            <NavLink to='/'>
              <Box sx={{
                cursor: "pointer",
                '& > img': {
                  width: { xs: '6rem', sm: '8rem', md: '8rem', lg: '8.5rem' }
                }
              }}>
                <img src={moment().month() === 11 ? cnavLogo : navLogo} alt="logo" />
              </Box>
            </NavLink>
            <Hidden mdDown>
              {
                (getUserType() === "agent" || getUserType() === "realtor" || getUserType() === "developer") && pathname.startsWith('/agent') ?
                  <Typography variant='h6' color={'secondary'} sx={{ fontWeight: 600, marginLeft: { xs: '0px', sm: '50px', md: '30px', lg: "60px" } }}>{_.startCase(path === 'newlisting' ? t('navbar.newlisting') : path === 'devlisting' ? t('navbar.developer') : path)}</Typography> :
                  null
              }
            </Hidden>
          </div>

          <div className="navItems">
            {
              (getUserType() === "agent" || getUserType() === "realtor" || getUserType() === "developer") && pathname.startsWith('/agent') ?
                <Box sx={{ display: 'flex', gap: { xs: '0.2rem', sm: '0.2rem', md: '0.5rem', lg: '1rem' }, justifyContent: 'flex-end', alignItems: 'center' }}>

                  <Tooltip title={t('navbar.notifications')} arrow>
                    <Badge variant='standard' overlap='circular' color='primary' badgeContent={notification?.length}>
                      <IconButton onClick={handleNotificationClick} sx={{ background: grey[200] }}><Notifications fontSize='small' /></IconButton>
                    </Badge>
                  </Tooltip>

                  <Popover open={!notification.length ? false : openNotification}
                    anchorEl={anchorEl2} onClose={closeNotification}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <Box sx={{ minHeight: "10rem", maxHeight: '40rem', position: 'relative' }}>
                      <Box sx={{ bgcolor: 'primary.main', padding: '1rem 1.5rem', color: '#fff', position: 'sticky', top: 0, zIndex: 30 }}>
                        <Typography variant='h6' sx={{ fontSize: '1rem' }}>{t('navbar.notifications')}</Typography>
                      </Box>
                      <Box sx={{ padding: '1rem', width: '25rem' }}>
                        {
                          notification?.map((el, index) => {
                            return <NotificationItem el={el} key={el?.id} index={index} setNotification={setNotification} width={'100%'} closeSingleNotification={closeSingleNotification} />
                          })
                        }
                      </Box>

                    </Box>
                  </Popover>
                </Box>
                :
                <>
                  <NavLink to="/buy" className="navBarTitles"><p style={{ color: active === 'buy' && '#1267B1', fontWeight: active === 'buy' && 'bolder' }} className="">{t('navbar.buy')}</p></NavLink>
                  <div className="navBarTitles">
                    <div 
                      onClick={()=>{console.log('test')}}
                      onMouseEnter={handleShortletPopoverOpen} 
                      style={{ color: active === 'rent' && '#1267B1', fontWeight: active === 'rent' && 'bolder', cursor: 'pointer'}} className="">
                      {t('navbar.rent')}
                    </div>
                    <Popover 
                      id="mouse-over-popover"
                      open={open5}
                      anchorEl={anchorEl5}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      onClose={handleShortletPopoverClose}>
                          <Box sx={{padding: '0.5rem 1rem'}}>
                            <NavLink to="/rent" className="navBarTitles"><p style={{ color: active === 'rent' && '#1267B1', fontWeight: active === 'rent' && 'bolder', paddingBottom: '.5rem'}} className="">{t('navbar.rent')}</p></NavLink> 
                            <NavLink to="/shortlet" className="navBarTitles"><p style={{ color: active === 'shortlet' && '#1267B1', fontWeight: active === 'shortlet' && 'bolder'}} className="">{t('navbar.shortlet')}</p></NavLink> 
                          </Box>
                      </Popover>
                  </div>
                         
                  {/* <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={(e)=>{e.stopPropagation(); window.location.href = "/rent"}}>
                    <Popover open={open4}
                      anchorEl={anchorEl4} onClose={handleMouseLeave}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    >
                      <Box sx={{ padding: "8px", display: "flex", flexDirection: "column" }}>
                        <span style={{ }}>
                          </span>
                      </Box>
                    </Popover>
                    <NavLink to="/rent" className="navBarTitles"><p style={{ color: active === 'rent' && '#1267B1', fontWeight: active === 'rent' && 'bolder' }} className="">{t('navbar.rent')}</p></NavLink>
                    
                  </div> */}
                  {/* <NavLink to="/sell" className="navBarTitles"><p style={{ color: active === 'sell' && '#1267B1', fontWeight: active === 'sell' && 'bolder' }} className="">{t('navbar.sell')}</p></NavLink> */}
                  <NavLink to="/off-plan" className="navBarTitles"><p style={{ color: (active === 'off-plan' || active === 'development') && '#1267B1', fontWeight: (active === 'off-plan' || active === 'development') && 'bolder' }} className="">{t('navbar.offplan')}</p></NavLink>
                  {/* <NavLink to="/mortgage" className="navBarTitles"><p style={{ color: active === 'mortgage' && '#1267B1', fontWeight: active === 'mortgage' && 'bolder' }} className="">{t('navbar.mortgage')}</p></NavLink> */}
                  <NavLink to="/find-a-broker" className="navBarTitles"><p style={{ color: active === 'find-a-broker' && '#1267B1', fontWeight: active === 'find-a-broker' && 'bolder' }} className="">{t('navbar.findanAgent')}</p></NavLink>
                  <NavLink to="//blog.rehomeafrica.com/" target="_blank" rel="noreferrer" className="navBarTitles"><p className="">{t('navbar.blog')}</p></NavLink>
                </>
            }
                        
            {!isMobile && <>
              <LanguageSelection language={language} setLanguage={setLanguage} />

              <CurrencySelection currency={currency} setCurrency={setCurrency} />
            </> }

            {!loggedin ? <>
              <div className="hidden xs:block sm:block" onClick={() => navigate('/login')}>
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
              </div>

              <Hidden lgDown>
                <div onClick={() => navigate('/signup')}>
                  <PillButton
                    text={t('navbar.signup')}
                    size="small"
                    width="140px"
                    borderColor="rgba(0, 0, 0, 0.3)"
                    color="#000000"
                    startIcon={signUp}
                    variant="outlined"
                  />
                </div>
              </Hidden>
            </> :
              <>
                <Avatar alt="" src={rate.thumbnail(userData.avatar)} onClick={handleClick} className="cursor-pointer" />
              </>
            }
            {/* <Hidden mdDown> */}
            {/* <IconButton onClick={handleSettingsClick}><Tune fontSize='small' sx={{ cursor: 'pointer' }} /></IconButton> */}


            {/* <Popover open={openSettings}
              anchorEl={anchorEl3} onClose={closeSettings}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              <Box sx={{ bgcolor: 'tertiary.main', color: '#fff', padding: "8px", display: "flex", flexDirection: "column" }}>
                <span style={{ marginBottom: "10px" }}>
                  
                </span>
              </Box>
            </Popover> */}

            {/* </Hidden> */}

          </div>
        </Container>
      </div>

      <div>{page}</div>

      {window.location.pathname === "/client/profile" ||
        window.location.pathname === "/client/wishlist" ||
        window.location.pathname === "/client/messages" ||
        window.location.pathname === "/client/notifications" ||
        window.location.pathname === "/broker/onboard" ||
        window.location.pathname === "/broker/dashboard" ||
        window.location.pathname === "/broker/profile" ||
        window.location.pathname === "/broker/subscription" ||
        window.location.pathname === "/broker/listings" ||
        window.location.pathname === "/broker/newlisting" ||
        window.location.pathname === "/broker/edit-listing" ||
        window.location.pathname === "/broker/off-plan-listing" ||
        window.location.pathname === "/broker/edit-off-plan" ||
        window.location.pathname === "/admin/newlisting" ||
        window.location.pathname === "/admin/edit-listing" ||
        window.location.pathname === "/admin/off-plan-listing" ||
        window.location.pathname === "/admin/edit-off-plan" ||
        window.location.pathname === "/broker/stats" ||
        window.location.pathname === "/broker/help" ||
        window.location.pathname === "/agent/messages" ||
        window.location.pathname === "/buy" ||
        window.location.pathname === "/rent" ||
        window.location.pathname === "/shortlet" ||
        window.location.pathname === "/off-plan" ||
        window.location.pathname === "/mortgage-calculator"
        ? null : <Footer />}

      <Dialog
        open={mobileMenu}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseMenu}
      >
        <MobileMenu setMobileMenu={setMobileMenu} language={language} setLanguage={setLanguage} currency={currency} setCurrency={setCurrency} />
      </Dialog>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openNavbarMenu}
        onClose={handleCloseNavbarMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        PaperProps={{
          sx: {
            width: { xs: '250px', sm: '250px', md: '300px', lg: "300px" },
            backgroundColor: "#F7F7F7",
            minHeight: "100px"
          },
        }}
      >
        <NavbarMenu userData={userData} logout={logout} handleCloseNavbarMenu={handleCloseNavbarMenu} />
      </Menu>

      <span className="scrollTop" onClick={() => scrollToTop()}>
        <KeyboardArrowUpIcon fontSize="large" style={{ color: "white" }} />
      </span>
    </div>
  );
}

export default Navbar;
