import { Box, Grid, Hidden, Tab, Typography } from '@mui/material'
import cLogo from '../../assets/images/christmas_newLogoNavbar.png'
import Logo from '../../assets/images/newLogoNavbar.png'
import Auth from '../../assets/images/loginAuth.png'
import LoginBg from '../../assets/images/loginBG.svg'
import { useTranslation } from "react-i18next";
import React from 'react'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import CreateAccount from './CreateAccount'
import Login from './Login'
import { motion } from "framer-motion";
import moment from 'moment'

const AuthPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const [value, setValue] = useState('1')
    const path = useLocation().pathname.split('/')[1]

    useEffect(() => {
        if (path === 'signup') {
            setValue('2')
        } else if (path === 'login') {
            setValue('1')
        }
    }, [path])

    const handleChange = (event, newValue) => {
        if (newValue === '1') {
            setValue(newValue);
            navigate('/login')
        } else {
            navigate('/signup')
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box sx={{ zIndex: 99 }}>
                <Grid container sx={{ height: '100vh' }}>
                    <Hidden smDown>
                        <Grid item sm={6} md={5} lg={6} sx={{ height: '100%' }}>
                            <Box sx={{
                                padding: '6rem 0',
                                height: '100%', width: '70%',
                                margin: '0 auto', textAlign: 'center',
                                display: 'flex', justifyContent: 'center',
                                flexDirection: 'column',
                                backgroundImage: `url(${LoginBg})`,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover'
                            }}>
                                <img onClick={() => navigate('/')} src={moment().month() === 11 ? cLogo : Logo} style={{ margin: '0 auto', display: 'block', cursor: 'pointer', width: '35%' }} alt='logo' />
                                <Typography mt={'5rem'} mb={1} variant='h4' sx={{ fontWeight: 600 }}>{t('authpage.title')}</Typography>
                                <Typography mb={'5rem'} variant='body2' dangerouslySetInnerHTML={{ __html: t('authpage.subtext') }} />

                                <img src={Auth} width='90%' style={{ margin: '0 auto', display: 'block' }} alt='login' />
                            </Box>
                        </Grid>
                    </Hidden>

                    <Grid item xs={12} sm={6} md={7} lg={6} sx={{ height: '100%', overflowY: 'scroll', width: '100%', bgcolor: '#F8F8F8' }}>

                        <Box sx={{
                            width: { xs: '85%', md: '80%', lg: '60%' },
                            margin: '0 auto', display: 'flex',
                            flexDirection: 'column', justifyContent: 'center',
                            py: '5rem'
                        }}>
                            <Hidden smUp>
                                <img onClick={() => navigate('/')} src={Logo} style={{ margin: '0 auto', display: 'block', cursor: 'pointer', width: '35%', marginBottom: '.5rem' }} alt='logo' />
                            </Hidden>
                            <TabContext value={value}>
                                <Box sx={{ padding: '.5rem 0', borderBottom: '1px solid lightgrey', color: '#fff' }}>
                                    <TabList
                                        TabIndicatorProps={{ style: { backgroundColor: '#67B40D', height: '6px', borderRadius: '50px' } }}
                                        variant='fullWidth' indicatorColor='primary' sx={{ marginBottom: '-10px' }} onChange={handleChange}>
                                        <Tab disableRipple sx={{ textTransform: 'none', fontSize: '1.1rem' }} label={t('login.login')} value="1" />
                                        <Tab disableRipple sx={{ textTransform: 'none', fontSize: '1.1rem' }} label={t('login.createAccount')} value="2" />
                                    </TabList>
                                </Box>

                                {/* Login */}
                                <TabPanel value='1' sx={{'&.MuiTabPanel-root': {padding: "0"}}}>
                                    <Login />
                                </TabPanel>

                                {/* SignUp */}
                                <TabPanel value='2' sx={{'&.MuiTabPanel-root': {padding: "0"}}}>
                                    <CreateAccount />
                                </TabPanel>
                            </TabContext>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </motion.div>
    )
}

export default AuthPage