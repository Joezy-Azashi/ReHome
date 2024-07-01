import React, { useState, useContext, useEffect } from 'react'
import { IconButton, Avatar, Tooltip, Menu, Container, Slide, Dialog, DialogContent, Box, Badge, Typography, Hidden, Popover, List, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material'
import { Notifications, Tune, MenuOutlined, Campaign, KeyboardArrowDownOutlined, KeyboardArrowUpOutlined, ManageSearchOutlined, SettingsOutlined } from '@mui/icons-material'
import { GridView, PeopleAltOutlined, Close } from '@mui/icons-material';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { grey } from '@mui/material/colors'
import _ from 'lodash';
import navLogo from '../../assets/images/rehomelogowhite.svg'
import loginLogo from '../../assets/images/rehomelogowhite.svg';
import CurrencySelection from '../../components/CurrencySelection/CurrencySelection';
import LanguageSelection from '../../components/LanguageSelection/LanguageSelection';
import RateContext from '../../contexts/rateContext';
import NavbarMenu from '../../components/Navbar/NavbarMenu';
import { isLoggedIn, logoutUser, setCurrentUser } from '../../services/auth';
import AdminUsers from './AdminUsers';
import Api from '../../api/api';
import NotificationItem from '../../components/NotificationItem';
import { motion } from "framer-motion";
import UserProfile from './UserProfile';
import AddListing from '../agents/AddListing';
import DevListing from '../agents/DevListing';
import Discount from './Discount';
import Location from './Location';
import Dashboard from './Dashboard';
import SalesDB from './SalesDB';
import AddToSalesDB from './AddToSalesDB';
import EnterpriseDB from './EnterpriseDB';
import AddToEnterpriseDB from './AddToEnterpriseDB';
import CustomerRequestListing from './CustomerRequestListing';
import Giveaway from './Giveaway';
import AdminDSARForm from './AdminDSARForm';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} />;
});

function AdminDashboard() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate()
    const path = useLocation().pathname.split('/')[2]
    const pathname = useLocation().pathname
    const rate = useContext(RateContext);

    const [mobileMenu, setMobileMenu] = useState(false)
    const [userData, setUserData] = useState("")
    const [currency, setCurrency] = useState(rate?.preferredCurrency ? rate?.preferredCurrency : localStorage.getItem('currency') ? localStorage.getItem('currency') : 'GHS')
    const [language, setLanguage] = useState(rate?.preferredLanguage)
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
    const [anchorEl4, setAnchorEl4] = React.useState(null);
    const [openSubMenu, setOpenSubMenu] = useState(false);
    const [openSubMenu1, setOpenSubMenu1] = useState(false);
    const [openSubMenu2, setOpenSubMenu2] = useState(false);
    const openNavbarMenu = Boolean(anchorEl);
    const openNotification = Boolean(anchorEl2);
    const openSettings = Boolean(anchorEl3);

    const closeNotification = () => {
        setAnchorEl2(null);
    };

    const closeSettings = () => {
        setAnchorEl3(null);
    };

    const closeRequests = () => {
        setAnchorEl4(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseNavbarMenu = () => {
        setAnchorEl(null);
    };

    const handleClickOpenSubMenu = () => {
        setOpenSubMenu(!openSubMenu);
        setOpenSubMenu1(false)
        setOpenSubMenu2(false)
    };

    const handleClickOpenSubMenu1 = () => {
        setOpenSubMenu1(!openSubMenu1);
        setOpenSubMenu2(false)
        setOpenSubMenu(false)
    };

    const handleClickOpenSubMenu2 = () => {
        setOpenSubMenu2(!openSubMenu2);
        setOpenSubMenu(false)
        setOpenSubMenu1(false)
    };

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
                if (res.data.success) {
                    getNotification(id);
                }
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


                    getNotification(response.data?.id)

                    interval = setInterval(() => {
                        checkNotification(response.data?.id);
                        // getNotification(response.data?.id)
                    }, 30000)
                })
                .catch(() => { })
        }
        return () => {
            clearInterval(interval)
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const closeSingleNotification = (data) => {
        Api().patch(`notifications/${data?.id}`, { closed: true })
            .then((res) => {
                getNotification(userData?.id)
            })
    }

    const logout = () => {
        logoutUser()
        window.location.assign("/")
    }

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

    useEffect(() => {
        handleCurrencyChange(currency)

        // eslint-disable-next-line react-hooks/exhaustive-deps
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Sidebar */}
            <Box sx={{ backgroundColor: "#F7F7F7", height: "100vh", overflow: "hidden" }}>
                <Hidden smDown>
                    <Box sx={{ height: "100vh", width: { sm: "28%", lg: "19%" }, backgroundColor: "secondary.main", padding: "1.6rem 1.4rem", position: "fixed", zIndex: "41", overflowY: "auto" }}>
                        {/* Logo */}
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <NavLink to='/'>
                                <Box sx={{ cursor: "pointer" }}>
                                    <img src={navLogo} width={145} alt="logo" />
                                </Box>
                            </NavLink>
                        </Box>

                        {/* Sidebar menuitems */}
                        <List sx={{ color: "#fff", marginTop: "1.5rem" }}>
                            <ListItemButton onClick={() => navigate('/admin/dashboard')} sx={{ backgroundColor: path === "dashboard" ? "tertiary.main" : "", borderRadius: "10px" }}>
                                <ListItemIcon>
                                    <GridView sx={{ color: "#fff" }} />
                                </ListItemIcon>
                                <ListItemText primary={t('admindashboard.sidenav.dashboard')} />
                            </ListItemButton>
                        </List>

                        <List sx={{ color: "#fff" }}>
                            <ListItemButton onClick={() => navigate('/admin/users')} sx={{ backgroundColor: path === "users" ? "tertiary.main" : "", borderRadius: "10px" }}>
                                <ListItemIcon>
                                    <PeopleAltOutlined sx={{ color: "#fff" }} />
                                </ListItemIcon>
                                <ListItemText primary={t('admindashboard.sidenav.users')} />
                            </ListItemButton>
                        </List>

                        <List sx={{ color: "#fff" }}>
                            <ListItemButton onClick={handleClickOpenSubMenu1}>
                                <ListItemIcon>
                                    <SettingsOutlined sx={{ color: "#fff" }} />
                                </ListItemIcon>
                                <ListItemText primary={t('admindashboard.sidenav.settings')} />
                                {openSubMenu1 ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />}
                            </ListItemButton>
                            <Collapse in={openSubMenu1} timeout="auto" unmountOnExit>
                                <List sx={{ color: "#fff" }}>
                                    <ListItemButton onClick={() => navigate('/admin/location')} sx={{ backgroundColor: path === "location" ? "tertiary.main" : "", borderRadius: "10px" }}>
                                        <ListItemText sx={{ marginLeft: "3.5rem" }} primary={t('admindashboard.sidenav.location')} />
                                    </ListItemButton>
                                </List>
                                <List sx={{ color: "#fff" }}>
                                    <ListItemButton onClick={() => navigate('/admin/discount')} sx={{ backgroundColor: path === "discount" ? "tertiary.main" : "", borderRadius: "10px" }}>
                                        <ListItemText sx={{ marginLeft: "3.5rem" }} primary={t('admindashboard.sidenav.discount')} />
                                    </ListItemButton>
                                </List>
                                <List sx={{ color: "#fff" }}>
                                    <ListItemButton onClick={() => navigate('/admin/giveaway')} sx={{ backgroundColor: path === "giveaway" ? "tertiary.main" : "", borderRadius: "10px" }}>
                                        <ListItemText sx={{ marginLeft: "3.5rem" }} primary={t('admindashboard.sidenav.giveaway')} />
                                    </ListItemButton>
                                </List>
                            </Collapse>
                        </List>

                        <List sx={{ color: "#fff" }}>
                            <ListItemButton onClick={handleClickOpenSubMenu}>
                                <ListItemIcon>
                                    <ManageSearchOutlined sx={{ color: "#fff" }} />
                                </ListItemIcon>
                                <ListItemText primary={t('admindashboard.sidenav.search')} />
                                {openSubMenu ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />}
                            </ListItemButton>
                            <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
                                <List sx={{ color: "#fff" }}>
                                    <ListItemButton onClick={() => navigate('/admin/customer-search')} sx={{ backgroundColor: path === "customer-search" ? "tertiary.main" : "", borderRadius: "10px" }}>
                                        <ListItemText sx={{ marginLeft: "3.5rem" }} primary={t('admindashboard.sidenav.salesdb')} />
                                    </ListItemButton>
                                </List>

                                <List sx={{ color: "#fff" }}>
                                    <ListItemButton onClick={() => navigate('/admin/enterprise-search')} sx={{ backgroundColor: path === "enterprise-search" ? "tertiary.main" : "", borderRadius: "10px" }}>
                                        <ListItemText sx={{ marginLeft: "3.5rem" }} primary={t('admindashboard.sidenav.enterprisedb')} />
                                    </ListItemButton>
                                </List>
                            </Collapse>
                        </List>

                        <List sx={{ color: "#fff" }}>
                            <ListItemButton onClick={handleClickOpenSubMenu2}>
                                <ListItemIcon>
                                    <Campaign sx={{ color: "#fff" }} />
                                </ListItemIcon>
                                <ListItemText primary={t('admindashboard.sidenav.requests')} />
                                {openSubMenu2 ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />}
                            </ListItemButton>
                            <Collapse in={openSubMenu2} timeout="auto" unmountOnExit>
                                <List sx={{ color: "#fff" }}>
                                    <ListItemButton onClick={() => navigate('/admin/customer-request')} sx={{ backgroundColor: path === "customer-request" ? "tertiary.main" : "", borderRadius: "10px" }}>
                                        <ListItemText sx={{ marginLeft: "3.5rem" }} primary={t('admindashboard.sidenav.customerrequest')} />
                                    </ListItemButton>
                                </List>

                                <List sx={{ color: "#fff" }}>
                                    <ListItemButton onClick={() => navigate('/admin/dsar-request')} sx={{ backgroundColor: path === "enterprise-search" ? "tertiary.main" : "", borderRadius: "10px" }}>
                                        <ListItemText sx={{ marginLeft: "3.5rem" }} primary={t('admindashboard.sidenav.dsarrequests')} />
                                    </ListItemButton>
                                </List>
                            </Collapse>
                        </List>
                    </Box>
                </Hidden>

                {/* Top navbar */}
                <div className="navbar-position">
                    <Container maxWidth='xl' sx={{ height: '100%', display: "flex", justifyContent: "space-between" }}>
                        <div className="flex items-center">
                            <div className="navitems-breakpoint:hidden mr-3">
                                <IconButton onClick={handleOpenMenu}>
                                    <MenuOutlined />
                                </IconButton>
                            </div>
                            <Box>
                                {
                                    pathname.startsWith('/admin') ?
                                        <Typography variant='h6' color={'secondary'} sx={{ fontWeight: 600, marginLeft: { xs: '0px', sm: '11rem', md: '18.6rem', lg: "18rem" } }}>{_.startCase(path === 'users' ? "Users" : path === 'properties' ? "Properties" : path)}</Typography> :
                                        null
                                }
                            </Box>
                        </div>

                        <div className="navItems">
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

                            <Avatar alt="" src={rate.thumbnail(userData?.avatar)} onClick={handleClick} className="cursor-pointer" />

                            <IconButton onClick={handleSettingsClick}><Tune fontSize='small' sx={{ cursor: 'pointer' }} /></IconButton>

                            <Popover open={openSettings}
                                anchorEl={anchorEl3} onClose={closeSettings}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            >
                                <Box sx={{ bgcolor: 'tertiary.main', color: '#fff', padding: "8px", display: "flex", flexDirection: "column" }}>
                                    <span style={{ marginBottom: "10px" }}>
                                        <LanguageSelection language={language} setLanguage={setLanguage} />
                                    </span>
                                    <CurrencySelection currency={currency} setCurrency={setCurrency} />
                                </Box>
                            </Popover>

                        </div>
                    </Container>
                </div>

                {/* Page Content */}
                <Box sx={{ padding: { xs: "1.4rem 1rem 6rem 1rem" }, height: "100%", width: { xs: "100%", sm: "72%", lg: "81%" }, float: "right", overflow: "auto" }}>
                    <Box >
                        {path === 'dashboard' && <Dashboard />}
                        {path === 'users' && <AdminUsers />}
                        {path.startsWith('user-profile') && <UserProfile />}
                        {path === 'discount' && <Discount />}
                        {path === 'location' && <Location />}
                        {path === 'customer-search' && <SalesDB />}
                        {path === 'customer-request' && <CustomerRequestListing />}
                        {path === 'giveaway' && <Giveaway />}
                        {path === 'dsar-request' && <AdminDSARForm />}
                        {path === 'add-customer-search' && <AddToSalesDB />}
                        {path === 'edit-customer-search' && <AddToSalesDB />}
                        {path === 'enterprise-search' && <EnterpriseDB />}
                        {path === 'add-enterprise-search' && <AddToEnterpriseDB />}
                        {path === 'edit-enterprise-search' && <AddToEnterpriseDB />}
                        {path === 'newlisting' && <AddListing />}
                        {path === 'edit-listing' && <AddListing />}
                        {path === 'off-plan-listing' && <DevListing />}
                        {path === 'edit-off-plan' && <DevListing />}
                    </Box>
                </Box>

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

                <Dialog
                    open={mobileMenu}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleCloseMenu}
                >
                    <DialogContent style={{
                        position: "fixed",
                        left: "0",
                        top: "0px",
                        height: "100%",
                        width: "20rem",
                        backgroundColor: "#03254C",
                        padding: "10px 15px",
                        overflow: "hidden"
                    }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} mt={2}>
                            <NavLink to='/admin/users' onClick={() => setMobileMenu(false)}>
                                <Box sx={{ cursor: "pointer" }}>
                                    <img src={loginLogo} width={145} alt="logo" />
                                </Box>
                            </NavLink>

                            <IconButton onClick={() => setMobileMenu(false)}>
                                <Close fontSize='medium' sx={{ color: "#fff" }} />
                            </IconButton>
                        </Box>

                        <Box sx={{ height: "100vh" }}>
                            <Box sx={{ height: "100vh", width: { sm: "28%", lg: "19%" }, padding: "1.6rem 1.4rem", position: "fixed", zIndex: "41" }}>
                                <List sx={{ color: "#fff", marginTop: "1.5rem" }}>
                                    <ListItemButton onClick={() => navigate('/admin/dashboard')} sx={{ backgroundColor: path === "dashboard" ? "tertiary.main" : "", borderRadius: "10px" }}>
                                        <ListItemIcon>
                                            <GridView sx={{ color: "#fff" }} />
                                        </ListItemIcon>
                                        <ListItemText primary={t('admindashboard.sidenav.dashboard')} />
                                    </ListItemButton>
                                </List>

                                <List sx={{ color: "#fff" }}>
                                    <ListItemButton onClick={() => navigate('/admin/users')} sx={{ backgroundColor: path === "users" ? "tertiary.main" : "", borderRadius: "10px" }}>
                                        <ListItemIcon>
                                            <PeopleAltOutlined sx={{ color: "#fff" }} />
                                        </ListItemIcon>
                                        <ListItemText primary={t('admindashboard.sidenav.users')} />
                                    </ListItemButton>
                                </List>

                                <List sx={{ color: "#fff" }}>
                                    <ListItemButton onClick={handleClickOpenSubMenu1}>
                                        <ListItemIcon>
                                            <SettingsOutlined sx={{ color: "#fff" }} />
                                        </ListItemIcon>
                                        <ListItemText primary="Settings" />
                                        {openSubMenu1 ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />}
                                    </ListItemButton>
                                    <Collapse in={openSubMenu1} timeout="auto" unmountOnExit>
                                        <List sx={{ color: "#fff" }}>
                                            <ListItemButton onClick={() => navigate('/admin/location')} sx={{ backgroundColor: path === "location" ? "tertiary.main" : "", borderRadius: "10px" }}>
                                                <ListItemText sx={{ textAlign: "right" }} primary={t('admindashboard.sidenav.location')} />
                                            </ListItemButton>
                                        </List>
                                        <List sx={{ color: "#fff" }}>
                                            <ListItemButton onClick={() => navigate('/admin/discount')} sx={{ backgroundColor: path === "discount" ? "tertiary.main" : "", borderRadius: "10px" }}>
                                                <ListItemText sx={{ textAlign: "right" }} primary={t('admindashboard.sidenav.discount')} />
                                            </ListItemButton>
                                        </List>
                                        <List sx={{ color: "#fff" }}>
                                            <ListItemButton onClick={() => navigate('/admin/giveaway')} sx={{ backgroundColor: path === "giveaway" ? "tertiary.main" : "", borderRadius: "10px" }}>
                                                <ListItemText sx={{ textAlign: "right" }} primary={t('admindashboard.sidenav.giveaway')} />
                                            </ListItemButton>
                                        </List>
                                    </Collapse>
                                </List>

                                <List sx={{ color: "#fff" }}>
                                    <ListItemButton onClick={handleClickOpenSubMenu}>
                                        <ListItemIcon>
                                            <ManageSearchOutlined sx={{ color: "#fff" }} />
                                        </ListItemIcon>
                                        <ListItemText primary="Search" />
                                        {openSubMenu ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />}
                                    </ListItemButton>
                                    <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
                                        <List sx={{ color: "#fff" }}>
                                            <ListItemButton onClick={() => navigate('/admin/customer-search')} sx={{ backgroundColor: path === "customer-search" ? "tertiary.main" : "", borderRadius: "10px" }}>
                                                <ListItemText sx={{ textAlign: "right" }} primary={t('admindashboard.sidenav.salesdb')} />
                                            </ListItemButton>
                                        </List>

                                        <List sx={{ color: "#fff" }}>
                                            <ListItemButton onClick={() => navigate('/admin/enterprise-search')} sx={{ backgroundColor: path === "enterprise-search" ? "tertiary.main" : "", borderRadius: "10px" }}>
                                                <ListItemText sx={{ textAlign: "right" }} primary={t('admindashboard.sidenav.enterprisedb')} />
                                            </ListItemButton>
                                        </List>
                                    </Collapse>
                                </List>

                                <List sx={{ color: "#fff" }}>
                                    <ListItemButton onClick={handleClickOpenSubMenu2}>
                                        <ListItemIcon>
                                            <Campaign sx={{ color: "#fff" }} />
                                        </ListItemIcon>
                                        <ListItemText primary={t('admindashboard.sidenav.requests')} />
                                        {openSubMenu2 ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />}
                                    </ListItemButton>
                                    <Collapse in={openSubMenu2} timeout="auto" unmountOnExit>
                                        <List sx={{ color: "#fff" }}>
                                            <ListItemButton onClick={() => navigate('/admin/customer-request')} sx={{ backgroundColor: path === "customer-request" ? "tertiary.main" : "", borderRadius: "10px" }}>
                                                <ListItemText sx={{ marginLeft: "3.5rem" }} primary={t('admindashboard.sidenav.customerrequest')} />
                                            </ListItemButton>
                                        </List>

                                        <List sx={{ color: "#fff" }}>
                                            <ListItemButton onClick={() => navigate('/admin/dsar-request')} sx={{ backgroundColor: path === "enterprise-search" ? "tertiary.main" : "", borderRadius: "10px" }}>
                                                <ListItemText sx={{ marginLeft: "3.5rem" }} primary={t('admindashboard.sidenav.dsarrequests')} />
                                            </ListItemButton>
                                        </List>
                                    </Collapse>
                                </List>
                            </Box>
                        </Box>
                    </DialogContent>
                </Dialog>
            </Box>
        </motion.div>
    )
}

export default AdminDashboard