import { AccountCircle, Edit, EmailOutlined, FavoriteBorder, Logout, NotificationsOutlined, WindowOutlined } from '@mui/icons-material'
import { alpha, Avatar, Dialog, Box, Button, Card, CardActions, Container, Divider, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, styled, Typography, Backdrop, Hidden } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useTranslation } from "react-i18next";
import React, { useEffect } from 'react'
import { useState } from 'react'
import Api from '../../api/api';
import { logoutUser } from '../../services/auth';
import UploadProfileImage from './UploadProfileImage';
import ChangePassword from './ChangePassword';
import VerifyEmail from '../../components/VerifyEmail/VerifyEmail';
import Profile from './Profile';
import Wishlist from './Wishlist';
import Listings from './Listings';
import Messages from './Messages';
import Notifications from './Notifications';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import AddListing from '../agents/AddListing';

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '20px',
    height: '100%'
}))

const Dashboard = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    const navigate = useNavigate()
    const path = useLocation().pathname.split('/')[2]
    const [openDelete, setOpenDelete] = useState(false)
    const [openChangePassword, setOpenChangePassword] = useState(false)
    const [edit, setEdit] = useState(false)

    const menuLinks = [
        { title: t('dashboard.profile.profile'), icon: <AccountCircle />, path: '/client/profile' },
        // { title: t('agentdashboard.sidebar.listings'), icon: <WindowOutlined />, path: '/client/listings' },
        { title: t('dashboard.wishlist.wishlist'), icon: <FavoriteBorder />, path: '/client/wishlist' },
        { title: t('dashboard.messages.messages'), icon: <EmailOutlined />, path: '/client/messages' },
        { title: t('dashboard.notifications.notifications'), icon: <NotificationsOutlined />, path: '/client/notifications' }
    ]

    const [user, setUser] = useState({})
    const [avatar, setAvatar] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [contact, setContact] = useState("")
    const [gender, setGender] = useState("")
    const [city, setCity] = useState("")
    const [loading, setLoading] = useState(false);
    const [profilePicture] = useState();
    const [openPicUpload, setOpenPicUpload] = useState(false);

    const handleOpenImgUpload = () => {
        setOpenPicUpload(true);
    };
    const handleCloseImgUpload = () => {
        setOpenPicUpload(false);
    };

    const toggleMode = () => {
        setEdit(!edit)
    }

    //function to access profile edit api
    const editProfile = (e) => {
        e.preventDefault()
        const data = {
            firstName: firstName,
            lastName: lastName,
            phone: contact,
            gender: gender,
            address: city
        }

        setLoading(true)
        Api().patch(`/me`, data)
            .then((response) => {

                enqueueSnackbar(t('dashboard.profile.updatesuccess'), { variant: 'success' });
                setLoading(false)
                setEdit(!edit)
                getMyProfile()
            })
            .catch((error) => {
                enqueueSnackbar(error.message, { variant: 'error' });
                setLoading(false)
                setEdit(!edit)
            })
    }

    //function to get profile data
    const getMyProfile = async () => {
        Api().get("/me")
            .then((response) => {
                setAvatar(response.data.avatar)
                setUser(response?.data)
                setFirstName(response.data.firstName)
                setLastName(response.data.lastName)
                setContact(response.data.phone)
                setGender(response.data.gender)
                setCity(response.data.address)
                if (!response?.data?.emailVerified) {
                    setOpenVerificationPrompt(true)
                }
            })
            .catch((error) => { })
    }

    useEffect(() => {
        getMyProfile()
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [edit])

    const logout = () => {
        logoutUser();
        window.location.assign("/")
    }

    const [openVerificationPrompt, setOpenVerificationPrompt] = useState(false)

    const handleCloseVerificationPrompt = () => {
        setOpenVerificationPrompt(false)
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box py={'4rem'} bgcolor='#F7F7F7'>
                <Container maxWidth='xl'>
                    <Grid container spacing={4}>
                        <Hidden mdDown>
                            <Grid item md={4} lg={3}>
                                <StyledCard sx={{ height: '43.8rem' }} variant='outlined'>
                                    <Box sx={{ padding: '1.8rem 2rem', background: alpha('#1267B1', .05), display: 'flex', gap: '2rem', alignItems: 'center', width: '100%', borderBottom: '1px solid lighgrey' }}>
                                        <Box sx={{ position: 'relative' }}>
                                            <Box sx={{display: "flex"}}>
                                                <Avatar src={avatar} sx={{ width: '5rem', height: '5rem', margin: '' }} />
                                                <Typography mb={3} textAlign={'center'} sx={{ fontWeight: 500, paddingTop: "20px", width: "170px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} variant='h7'>{firstName} {lastName}</Typography>
                                            </Box>
                                            <div onClick={() => { handleOpenImgUpload() }}>
                                                <IconButton sx={{ position: 'absolute', bgcolor: '#5B9D00', '&:hover': { bgcolor: "#8ee615" }, top: '55%', right: '65%' }}><Edit fontSize='small' sx={{ color: "white" }} /></IconButton>
                                            </div>

                                            <Dialog
                                                open={openPicUpload}
                                                onClose={handleCloseImgUpload}
                                                fullWidth
                                                maxWidth="xs"
                                            >
                                                <UploadProfileImage
                                                    existingProfilePic={profilePicture}
                                                    getMyProfile={getMyProfile}
                                                    handleCloseImgUpload={handleCloseImgUpload}
                                                    setToggleDialog={setOpenPicUpload}
                                                />
                                            </Dialog>
                                        </Box>
                                    </Box>
                                    <Box sx={{ height: '69%' }}>
                                        <List sx={{ paddingLeft: '2.5rem' }}>
                                            {
                                                menuLinks.map((menu, index) => {
                                                    return (
                                                        <ListItem key={index} sx={{ cursor: 'pointer', margin: '1rem 0' }} onClick={() => navigate(menu.path)}>
                                                            <ListItemIcon sx={{ minWidth: '45px', color: (path === menu.path.split("/")[2]) && 'primary.main' }}>{menu.icon}</ListItemIcon>
                                                            <ListItemText sx={{ color: (path === menu.path.split("/")[2]) && 'primary.main' }}><Typography>{menu.title}</Typography></ListItemText>
                                                        </ListItem>
                                                    )
                                                })
                                            }
                                        </List>
                                    </Box>
                                    <Divider />
                                    <CardActions sx={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
                                        <div onClick={logout}><Button sx={{ textTransform: 'none' }} color='secondary' startIcon={<Logout />}>{t('dashboard.logout')}</Button></div>
                                    </CardActions>
                                </StyledCard>
                            </Grid>
                        </Hidden>

                        <Grid item xs={12} md={8} lg={9}>
                            <StyledCard variant='outlined' >
                                {path === 'profile' &&
                                    <Profile
                                        firstName={firstName}
                                        lastName={lastName}
                                        setFirstName={setFirstName}
                                        setLastName={setLastName}
                                        city={city}
                                        setCity={setCity}
                                        gender={gender}
                                        setGender={setGender}
                                        editProfile={editProfile}
                                        contact={contact}
                                        setContact={setContact}
                                        edit={edit}
                                        loading={loading}
                                        user={user}
                                        setOpenChangePassword={setOpenChangePassword}
                                        toggleMode={toggleMode}
                                    />
                                }
                                {/* {path === 'listings' && <Listings firstName={firstName} lastName={lastName} />}
                                {path === 'add-listing' && <AddListing />}
                                {path === 'edit-listing' && <AddListing />} */}
                                {path === 'wishlist' && <Wishlist />}
                                {path === 'messages' && <Messages />}
                                {path === 'notifications' && <Notifications />}

                            </StyledCard>
                        </Grid>
                    </Grid>

                </Container>
            </Box>

            {/* CHANGE PASSWORD */}
            <ChangePassword openChangePassword={openChangePassword} setOpenChangePassword={setOpenChangePassword} />

            <Dialog
                open={openVerificationPrompt}
                keepMounted
                onClose={handleCloseVerificationPrompt}
                fullWidth
                sx={{
                    '& .MuiPaper-root': { maxWidth: '400px', borderRadius: '30px' },
                    border: '1px solid #707070',
                    backgroundColor: 'rgb(3,42,100, 60%)',
                    borderRadius: '0',
                    scrollbarWidth: "none",
                }}
                PaperProps={{
                    sx: {
                        overflow: "visible"
                    },
                }}
            >
                <VerifyEmail handleCloseVerificationPrompt={handleCloseVerificationPrompt} />
            </Dialog>

            {/* ACCOUNT DELETE */}
            <Backdrop open={openDelete} sx={{ bgcolor: alpha('#03254C', .9), zIndex: 20 }}>

                <Box sx={{ bgcolor: '#fff', borderRadius: '20px', width: '30%' }}>
                    <Box sx={{ bgcolor: '#AC0000', color: '#fff', textAlign: 'center', padding: '2rem' }}>
                        <Typography variant='h5' mb={3} pt={'1rem'} sx={{ fontWeight: 600 }}>DELETE ACCOUNT</Typography>
                        <Typography>
                            By deleting your account, you will not be able to access your Account nor all data related to it. Do you wish to proceed?
                        </Typography>
                    </Box>
                    <Box sx={{ padding: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Button size='large' variant='outlined' onClick={() => setOpenDelete(false)}>Cancel</Button>
                        <Button size='large' variant='contained' color='secondary' disableElevation>Delete</Button>
                    </Box>
                </Box>
            </Backdrop>
        </motion.div>
    )
}

export default Dashboard