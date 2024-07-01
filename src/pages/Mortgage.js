import React, { useEffect } from 'react'
import { alpha, Box, Container, Divider, Grid, styled, Typography } from '@mui/material'
import BGImage from '../assets/images/mortgageBg.png'
import RoundButton from '../components/Buttons/RoundButton';
import { grey } from '@mui/material/colors';
// import Insurance from '../assets/images/insurance.svg'
import { motion } from "framer-motion";
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const Banner = styled(Box)(({ theme }) => (
    {
        padding: '5rem 0',
        height: '100%',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundImage: `linear-gradient( 180deg, rgba(0,0,0, 10%), rgba(0,0,0, 10%)), url(${BGImage})`,
    }
));

const Mortgage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Banner>
                <Container maxWidth='xl'>
                    <Box mt={'5rem'} mb={'3rem'} sx={{ width: { xs: '100%', sm: '60%', md: '70%', lg: '40%' }, height: 'inherit', textAlign: 'left', }}>
                        <Typography variant='h4' mb={2}
                            sx={{
                                fontWeight: 600,
                                fontSize: { sm: '2.1rem', lg: '2.5rem' },
                                color: '#fff',
                            }}>{t('mortgage.banner.maintext')}</Typography>
                        <Divider sx={{
                            bgcolor: 'primary.main',
                            height: '3px',
                            border: 'none',
                            width: '45%'
                        }} />
                        <Typography mt={3} mb={4} variant='body1' paragraph sx={{ color: '#fff' }}>
                        {t('mortgage.banner.subtext')}
                        </Typography>
                            <RoundButton onClick={()=> navigate("/mortgage-calculator")} disableElevation={true} color={'primary'} variant='contained' text={t('mortgage.banner.button')} />
                    </Box>
                </Container>
            </Banner>
            <Box bgcolor={'tertiary.main'} sx={{ padding: '5rem 0' }}>
                <Container>
                    <Grid container spacing={5} color={'#fff'}>
                        <Grid item xs={12} sm={4} md={4} lg={4} sx={{ padding: '2rem', borderRight: {sm: `1px solid ${grey[400]}`} }}>
                            <Typography variant='h5' sx={{ fontWeight: 600 }} mb={2}>{t('mortgage.types.tab1.title')}</Typography>
                            <Typography>{t('mortgage.types.tab1.note')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4} sx={{ padding: '2rem', borderRight: {sm: `1px solid ${grey[400]}`} }}>
                            <Typography variant='h5' sx={{ fontWeight: 600 }} mb={2}>{t('mortgage.types.tab2.title')}</Typography>
                            <Typography>{t('mortgage.types.tab2.note')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4} sx={{ padding: '2rem', borderRight: `none` }}>
                            <Typography variant='h5' sx={{ fontWeight: 600 }} mb={2}>{t('mortgage.types.tab3.title')}</Typography>
                            <Typography>{t('mortgage.types.tab3.note')}</Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* <Box bgcolor={'gray'} sx={{ padding: { xs: '3rem 1rem', sm: '4rem 1rem', md: '4rem .5rem', lg: '5rem 0' } }}>
                <Container>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <Typography variant='h3' mb={3} sx={{ fontWeight: 700, color: '#fff', fontSize: { xs: '2rem', sm: '2.2rem', md: '2.5rem', lg: '2.8rem' } }} dangerouslySetInnerHTML={{ __html: t('mortgage.allinone.maintext') }}/>
                            <Typography color='paper.main'>{t('mortgage.allinone.subtext')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <Box sx={{ padding: '4rem 3rem', bgcolor: '#E4EDDA', borderRadius: '50px' }}>
                                <Typography variant='h4' mb={3} sx={{ fontWeight: 600, fontSize: '1.7rem' }}>{t('mortgage.allinone.card.title')}</Typography>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}><Circle sx={{ fontSize: '.8rem' }} /></ListItemIcon>
                                    <ListItemText>{t('mortgage.allinone.card.point1')}</ListItemText>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}><Circle sx={{ fontSize: '.8rem' }} /></ListItemIcon>
                                    <ListItemText>{t('mortgage.allinone.card.point2')}</ListItemText>
                                </ListItem>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box> */}
            <Box bgcolor={'#F7F7F7'} sx={{ padding: '6rem 0' }}>
                <Container>
                    <Box bgcolor={alpha('#5B9C00', 0.14)} sx={{
                        width: { lg: '70%' }, margin: '0 auto',
                        padding: { xs: '3rem', sm: '3rem', md: '3rem', lg: '4rem' }, display: { xs: 'block', sm: 'block', md: 'flex', lg: 'flex' }, borderRadius: '50px',
                        gap: '3rem', justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Typography variant='h6' mb={3} sx={{ fontWeight: 600 }}>{t('mortgage.learnmore.note')}</Typography>
                        <NavLink to="//blog.rehomeafrica.com/" target="_blank" rel="noreferrer">
                            <RoundButton fullWidth size={'large'} text={t('mortgage.learnmore.button')} variant='contained' disableElevation sx={{ marginRight: '-6rem', width: { xs: '10rem', sm: '10rem', lg: '15rem' } }} />
                        </NavLink>
                    </Box>
                </Container>
            </Box>
            {/* <Box sx={{ padding: '6rem 0' }}>
                <Container>
                    <Typography variant='h5' mb={2} sx={{ fontWeight: 600 }} textAlign={'center'}>{t('mortgage.goodthings.title')}</Typography>
                    <Divider sx={{
                        bgcolor: 'primary.main',
                        height: '2px',
                        border: 'none',
                        width: '40%',
                        margin: '0 auto',
                        marginBottom: '3rem'
                    }} />

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <Card variant='outlined'>
                                <Box sx={{ padding: '1rem', bgcolor: 'primary.main', color: '#fff', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <Home />
                                    <Typography variant='h6'>{t('mortgage.goodthings.tab1.title')}</Typography>
                                </Box>
                                <CardContent sx={{ padding: '2rem', '& span': { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' } }}>
                                    <Typography variant='h6' mb={3} sx={{ fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: t('mortgage.goodthings.tab1.note') }}/>
                                    <span>
                                        <img src={Insurance} width='40%' alt='insurance' />
                                        <Button variant='outlined' disableElevation sx={{ textTransform: 'none', borderRadius: '50px' }}>{t('mortgage.goodthings.button')}</Button>
                                    </span>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <Card variant='outlined'>
                                <Box sx={{ padding: '1rem', bgcolor: 'secondary.main', color: '#fff', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <Home />
                                    <Typography variant='h6'>{t('mortgage.goodthings.tab2.title')}</Typography>
                                </Box>
                                <CardContent sx={{ padding: '2rem', '& span': { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' } }}>
                                    <Typography variant='h6' mb={3} sx={{ fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: t('mortgage.goodthings.tab2.note') }} />
                                    <span>
                                        <img src={Insurance} width='40%' alt='insurance' />
                                        <Button variant='outlined' disableElevation sx={{ textTransform: 'none', borderRadius: '50px' }}>{t('mortgage.goodthings.button')}</Button>
                                    </span>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <Card variant='outlined'>
                                <Box sx={{ padding: '1rem', bgcolor: 'tertiary.main', color: '#fff', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <Home />
                                    <Typography variant='h6'>{t('mortgage.goodthings.tab3.title')}</Typography>
                                </Box>
                                <CardContent sx={{ padding: '2rem', '& span': { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' } }}>
                                    <Typography variant='h6' mb={3} sx={{ fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: t('mortgage.goodthings.tab3.note') }} />
                                    <span>
                                        <img src={Insurance} width='40%' alt='insurance' />
                                        <Button variant='outlined' disableElevation sx={{ textTransform: 'none', borderRadius: '50px' }}>{t('mortgage.goodthings.button')}</Button>
                                    </span>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                </Container>
            </Box> */}
        </motion.div>
    )
}

export default Mortgage