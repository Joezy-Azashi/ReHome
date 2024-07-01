import { Dashboard, PieChart, Window, Home, Email, Handshake, WindowOutlined, HomeOutlined, DashboardOutlined, PieChartOutline, EmailOutlined, ReceiptOutlined, BusinessOutlined,  Receipt } from '@mui/icons-material'
import { Box, Button, Dialog, Container, Divider, Hidden, IconButton, styled, Typography, Backdrop, alpha } from '@mui/material'
import { grey } from '@mui/material/colors'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import AddListing from './AddListing'
import EditProfile from './EditProfile'
import GetHelp from './GetHelp'
import HomePage from './Home'
import Listings from './Listings'
import Stats from './Stats'
import Subscriptions from './Subscriptions'
import Api from '../../api/api'
import DevListing from './DevListing'
import RoundButton from '../../components/Buttons/RoundButton';
import { motion } from "framer-motion";
import VerifyEmail from '../../components/VerifyEmail/VerifyEmail'
import SalesDB from './SalesDB'
import EnterpriseDB from './EnterpriseDB'
import { getUserType } from '../../services/auth'

const menuWidth = 140

const SideBar = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
}))

const AgentDashboard = () => {
    const { t } = useTranslation();
    const path = useLocation().pathname.split('/')[2]

    const navigate = useNavigate()
    const menu = [
        { title: t('agentdashboard.sidebar.home'), icon: path === 'dashboard' ? <Home sx={{ fontSize: '2.8rem' }} /> : <HomeOutlined sx={{ fontSize: '2.8rem' }} />, path: '/broker/dashboard' },
        { title: t('agentdashboard.sidebar.listings'), icon: path === 'listings' || path === 'newlisting' || path === 'devlisting' ? <Window sx={{ fontSize: '2.8rem' }} /> : <WindowOutlined sx={{ fontSize: '2.8rem' }} />, path: '/broker/listings' },
        // { title: t('agentdashboard.sidebar.subscription'), icon: path === 'subscription' ? <Dashboard sx={{ fontSize: '2.8rem' }} /> : <DashboardOutlined sx={{ fontSize: '2.8rem' }} />, path: '/broker/subscription' },
        { title: t('agentdashboard.sidebar.stats'), icon: path === 'stats' ? <PieChart sx={{ fontSize: '2.8rem' }} /> : <PieChartOutline sx={{ fontSize: '2.8rem' }} />, path: '/broker/stats' },
        { title: t('agentdashboard.sidebar.messages'), icon: path === 'messages' ? <Email sx={{ fontSize: '2.8rem' }} /> : <EmailOutlined sx={{ fontSize: '2.8rem' }} />, path: '/coming-soon' },
        // { title: t('agentdashboard.sidebar.salesdb'), icon: path === 'customer-search' ? <Receipt sx={{ fontSize: '2.8rem' }} /> : <ReceiptOutlined sx={{ fontSize: '2.8rem' }} />, path: '/broker/customer-search' },
        // { title: t('agentdashboard.sidebar.enterprisedb'), icon: path === 'enterprise-search' ? <Receipt sx={{ fontSize: '2.8rem' }} /> : <BusinessOutlined sx={{ fontSize: '2.8rem' }} />, path: '/broker/enterprise-search' }
    ];

    const [user, setUser] = useState()
    const [isOnboardComplete, setIsOnboardComplete] = useState(false)
    const [openVerificationPrompt, setOpenVerificationPrompt] = useState(false)

    const handleCloseVerificationPrompt = () => {
        setOpenVerificationPrompt(false)
    }

    const getMyProfile = () => {
        Api().get("/me")
        .then((response) => {
            setUser(response?.data)
            if (!response?.data?.onboardingComplete || !response?.data?.company?.onboardingComplete || response?.data?.subscription?.status === 'disabled') {
                setIsOnboardComplete(true)
            }else{
                if(getUserType() !== 'agent'){
                    // setMenu([...menu, { title: t('agentdashboard.sidebar.salesdb'), icon: path === 'customer-search' ? <Receipt sx={{ fontSize: '2.8rem' }} /> : <ReceiptOutlined sx={{ fontSize: '2.8rem' }} />, path: '/broker/customer-search' }])
                }
            }

            if (response?.data?.onboardingComplete && response?.data?.company?.onboardingComplete && response?.data?.subscription?.status !== 'disabled' && !response?.data?.emailVerified) {
                setOpenVerificationPrompt(true)
            }
        })
        .catch((error) => { })
}

    useEffect(() => {
        getMyProfile()
    }, [])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })

        var el = document.getElementById("top");

        // To set the scroll
        el.scrollTop = 0;
        el.scrollLeft = 0;
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box bgcolor={'#000'}>

                {/* SideBar & Contents */}
                <Box bgcolor={grey[200]} sx={{ py: '2rem', height: '100%' }}>
                    <Container maxWidth='xl'>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '1rem',
                            height: '100%',
                        }}>
                            {/* sidebar */}
                            <Hidden mdDown>
                                <SideBar sx={{ minHeight: '35rem', bgcolor: 'tertiary.main', padding: '1rem', borderRadius: '15px', width: `${menuWidth}px` }}>
                                    <Box>
                                        {
                                            menu.map((el, index) => {
                                                return (
                                                    <Box onClick={() => navigate(el.path)} key={index} textAlign={'center'} sx={{ color: '#fff', mb: '1.5rem', cursor: 'pointer' }}>
                                                        {el.icon}
                                                        <Typography noWrap sx={{ fontSize: '.9rem' }}>{el.title}</Typography>
                                                    </Box>
                                                )
                                            })
                                        }
                                    </Box>
                                    {
                                        !user?.onboardingComplete && !user?.company?.onboardingComplete && !user?.subscription?.status === 'disabled' ?
                                            <Box textAlign={'center'} sx={{ mt: 'auto', color: '#fff' }}>
                                                <NavLink to="/broker/onboard" style={{ cursor: "pointer" }}>
                                                    <IconButton sx={{ border: '1px solid #8FE800' }}><Handshake sx={{ color: '#8FE800' }} /></IconButton>
                                                    <Typography mt={'5px'} textAlign={'center'} sx={{ fontSize: '.8rem', color: '#8FE800' }} dangerouslySetInnerHTML={{ __html: t('agentdashboard.sidebar.continueonboading') }} />
                                                </NavLink>
                                            </Box> :
                                            null
                                    }
                                    <Divider sx={{ my: '1rem', mt: 'auto', background: '#ffffff90' }} />
                                    <Button size='small' variant='contained' disableElevation onClick={() => navigate('/broker/help')} disableRipple sx={{ textTransform: 'none', fontSize: '.7rem', color: '#fff', borderRadius: '50px' }}>{t('agentdashboard.sidebar.gethelp')}</Button>

                                </SideBar>
                            </Hidden>

                            {/* Content Area */}
                            <Box id="top" sx={{ flex: 1, width: `calc(100% - ${menuWidth}px)`, }}>
                                {path === 'dashboard' && <HomePage />}
                                {path === 'profile' && <EditProfile user={user} getMyProfile={getMyProfile} />}
                                {path === 'subscription' && <Subscriptions />}
                                {path === 'listings' && <Listings />}
                                {path === 'newlisting' && <AddListing />}
                                {path === 'edit-listing' && <AddListing />}
                                {path === 'off-plan-listing' && <DevListing />}
                                {path === 'edit-off-plan' && <DevListing />}
                                {path === 'stats' && <Stats />}
                                {/* {path === 'customer-search' && getUserType() !== 'agent' && <SalesDB />} */}
                                {/* {path === 'enterprise-search' && <EnterpriseDB />} */}
                                {path === 'help' && <GetHelp />}
                            </Box>
                        </Box>
                    </Container>
                </Box>

                {/* ONBORDING INCOMPLETE */}
                <Backdrop open={isOnboardComplete} sx={{ bgcolor: alpha('#03254C', .9), zIndex: 20 }}>

                    <Box sx={{ bgcolor: '#fff', borderRadius: '20px', width: { xs: "90%", md: '50%', lg: "35%" }, display: 'flex', overflow: 'hidden' }}>
                        <Box sx={{ padding: '3rem' }}>
                            <Typography variant='h5' gutterBottom color={'primary'} sx={{ fontWeight: 600, textAlign: "center" }} textAlign='left'>{t('agentdashboard.onboardingincomplete.title')}</Typography>
                            <Typography paragraph >
                                {t('agentdashboard.onboardingincomplete.paragraph1')}
                            </Typography>
                            <Typography paragraph dangerouslySetInnerHTML={{ __html: t('agentdashboard.onboardingincomplete.paragraph2') }} />

                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <RoundButton onClick={() => { navigate('/broker/onboard'); setIsOnboardComplete(false) }} text={t('agentdashboard.onboardingincomplete.button')} variant='contained' color={'primary'} disableElevation sx={{ marginTop: '1rem' }} />
                            </Box>
                        </Box>
                    </Box>

                </Backdrop>

            </Box>

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
        </motion.div>
    )
}

export default AgentDashboard