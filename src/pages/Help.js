import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, Container, Grid, IconButton, styled, Typography } from '@mui/material';
import Finder from '../assets/images/finder.png';
import Realtor from '../assets/images/realtor01.png'
import HomeSeekers from '../assets/images/property.png'
import HomeOwners from '../assets/images/home_seekers.png'
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import { ExpandMore, PlayArrow, WhatsApp } from '@mui/icons-material';
import { isMobile } from 'react-device-detect';


const Banner = styled(Box)(({ theme }) => (
    {
        //padding: '5rem 0',
        height: '15rem',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundImage: `linear-gradient( 180deg, rgba(3,37,76, 60%), rgba(3,37,76, 80%)), url(${Finder})`,
        color: '#fff',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    }
));

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
    background: 'rgba(0, 0, 0, .05)',
    padding: '.7rem'
}))

const Help = () => {
    const navigate = useNavigate()
    const { t } = useTranslation();
    const [expanded, setExpanded] = React.useState('panel1');
    const [active, setActive] = React.useState('agents');

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    const [code, setCode] = useState('https://www.youtube.com/embed/ikRIfYGJGCU')

    const vidLinks = [
        { link: 'https://www.youtube.com/embed/ikRIfYGJGCU', title: t('help.videos.v1') },
        { link: 'https://www.youtube.com/embed/NUapdefGVoI', title: t('help.videos.v2') },
        { link: 'https://www.youtube.com/embed/1UUFBONcWZw', title: t('help.videos.v3') },
        { link: 'https://www.youtube.com/embed/UTs59hPmZsY', title: t('help.videos.v4') },
        { link: 'https://www.youtube.com/embed/8zpCxj1n-Uo', title: t('help.videos.v5') },
        { link: 'https://www.youtube.com/embed/o9PmLwhDhp8', title: t('help.videos.v6') },
        { link: 'https://www.youtube.com/embed/VtwAXIPUCfk', title: t('help.videos.v7') }]


    const previewVid = (link) => {
        setCode(link)
        const element = document.getElementById(`preview`);
        element.scrollIntoView({ behavior: "smooth", alignToTop: true, block: "center", });
    }

    const categeries = [
        {
            icon: Realtor,
            title: t('help.types.agent.title'),
            copy: t('help.types.agent.note'),
            id: 'agents'
        },
        {
            icon: HomeSeekers,
            title: t('help.types.seekers.title'),
            copy: t('help.types.seekers.note'),
            id: 'seekers'
        },
        {
            icon: HomeOwners,
            title: t('help.types.owners.title'),
            copy: t('help.types.owners.note'),
            id: 'owners'
        },
    ]

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleClick = (val) => {
        setActive(val)
        setExpanded('panel1')
        isMobile ? window.scrollTo({ top: 1300, behavior: 'smooth' }) : window.scrollTo({ top: 600, behavior: 'smooth' })
    }

    return (
        <div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* WhatApp Floating Btn */}
                {/* <IconButton size='large' sx={{ position: 'fixed', bottom: '2.5%', right: {xs: '6%', sm: '6%', lg: '1.5%'}, zIndex: 5, bgcolor: '#5b9c00', '&:hover': { bgcolor: '#03254C'}}}>
            <WhatsApp sx={{color: '#fff', fontSize: '2.1rem'}} />
        </IconButton> */}
                <Banner>
                    <Container maxWidth='md'>
                        <Typography variant='h5' sx={{ fontSize: '2rem', fontWeight: 600, mb: '2rem' }}>{t('help.banner')}</Typography>
                    </Container>
                </Banner>

                <Box sx={{ padding: '4rem 0' }}>
                    <Container sx={{ mb: '3rem' }} maxWidth='xl'>
                        <Typography variant='h5' sx={{ fontSize: { lg: '1.8rem' }, fontWeight: 400, mb: '2rem' }}
                            textAlign={'center'}>{t('help.title')}</Typography>
                        <Grid container spacing={3}>
                            {
                                categeries?.map(el => {
                                    return (
                                        <Grid item xs={12} sm={6} lg={4} key={el.title}>
                                            <Card variant='outlined' elevation={2} onClick={() => handleClick(el.id)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    borderRadius: '15px',
                                                    border: active === el.id ? '2px solid #5b9c00' : null
                                                }}>
                                                <CardContent sx={{
                                                    padding: '2rem',
                                                    textAlign: 'center'
                                                }}>
                                                    <img src={el.icon} width='25%' style={{ margin: '0 auto' }}
                                                        alt='property' />
                                                    <Typography variant='h6' mt={2} sx={{ fontSize: '1.3rem' }}
                                                        mb={2}>{el.title}</Typography>
                                                    <Typography variant='body2'
                                                        color={'GrayText'}>{el.copy}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>

                        <Box mt={3} sx={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <Button variant='text' color='secondary' onClick={() => navigate('/advertise')}
                                sx={{ textTransform: 'none' }}>{t('help.looking')}</Button>
                            <Button href='https://wa.me/233200022057' target={'_blank'} sx={{ textTransform: 'none' }}>
                                <WhatsApp sx={{ fontSize: "25px", marginRight: "6px" }} />
                                {t('help.cantfind')}
                            </Button>
                        </Box>
                    </Container>

                </Box>

                <Box sx={{ padding: '4rem 0', bgcolor: grey[100] }} id='faqs'>
                    <Container>
                        <Typography variant='h5' sx={{ fontSize: { lg: '1.8rem' }, fontWeight: 500, mb: '2rem' }}
                            textAlign={'center'}>FAQs
                            - {active === 'owners' ? t('help.types.owners.title') : active === 'agents' ? t('help.types.agent.title') : t('help.types.seekers.title')}</Typography>

                        {/* HOME OWNERS */}
                        {
                            active === 'owners' &&
                            <Box>
                                <MuiAccordion elevation={0} expanded={expanded === 'panel1'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel1')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.owners.questions.q1.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.owners.questions.q1.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel2'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel2')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.owners.questions.q2.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.owners.questions.q2.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel3'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel3')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.owners.questions.q3.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.owners.questions.q3.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel4'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel4')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.owners.questions.q4.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.owners.questions.q4.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>
                            </Box>

                        }

                        {/* AGENTS */}
                        {
                            active === 'agents' &&
                            <Box>
                                <MuiAccordion elevation={0} expanded={expanded === 'panel1'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel1')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.agent.questions.q1.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.agent.questions.q1.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel2'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel2')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.agent.questions.q2.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.agent.questions.q2.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel3'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel3')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.agent.questions.q3.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.agent.questions.q3.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel4'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel4')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.agent.questions.q4.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.agent.questions.q4.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel5'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel5')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.agent.questions.q5.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.agent.questions.q5.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel6'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel6')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.agent.questions.q6.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.agent.questions.q6.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel7'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel7')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.agent.questions.q7.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.agent.questions.q7.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel8'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel8')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.agent.questions.q8.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.agent.questions.q8.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel9'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel9')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.agent.questions.q9.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.agent.questions.q9.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                            </Box>
                        }

                        {/* HOME BUYERS */}
                        {
                            active === 'seekers' &&
                            <Box>
                                <MuiAccordion elevation={0} expanded={expanded === 'panel1'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel1')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.seekers.questions.q1.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.seekers.questions.q1.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel2'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel2')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.seekers.questions.q2.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.seekers.questions.q2.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel3'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel3')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.seekers.questions.q3.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.seekers.questions.q3.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel4'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel4')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.seekers.questions.q4.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.seekers.questions.q4.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel5'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel5')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.seekers.questions.q5.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.seekers.questions.q5.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel6'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel6')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.seekers.questions.q6.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.seekers.questions.q6.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel7'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel7')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.seekers.questions.q7.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.seekers.questions.q7.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel8'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel8')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.seekers.questions.q8.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.seekers.questions.q8.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel9'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel9')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.seekers.questions.q9.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.seekers.questions.q9.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel10'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel10')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.seekers.questions.q10.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.seekers.questions.q10.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel11'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel11')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.seekers.questions.q11.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.seekers.questions.q11.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel12'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel12')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.seekers.questions.q12.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.seekers.questions.q12.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel13'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel13')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.seekers.questions.q13.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.seekers.questions.q13.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel14'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel14')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.seekers.questions.q14.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.seekers.questions.q14.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel15'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel15')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.seekers.questions.q15.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.seekers.questions.q15.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel16'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel16')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.seekers.questions.q16.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.seekers.questions.q15.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel17'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel17')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.seekers.questions.q17.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.seekers.questions.q17.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                                <MuiAccordion elevation={0} expanded={expanded === 'panel18'}
                                    sx={{ margin: '0 !important' }} onChange={handleChange('panel18')}>
                                    <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }}>
                                            {t('help.types.seekers.questions.q18.title')}
                                        </Typography>
                                    </MuiAccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant='body1' m={2}>
                                            {t('help.types.seekers.questions.q18.answer')}
                                        </Typography>
                                    </AccordionDetails>
                                </MuiAccordion>

                            </Box>
                        }


                    </Container>

                </Box>
                <Box sx={{ padding: '4rem 0' }}>
                    <Container>
                        <Typography textAlign={'center'} variant='h5'
                            sx={{ fontSize: { lg: '1.8rem' }, fontWeight: 500, mb: '2rem' }}>
                              {t('help.videos.title')}
                            </Typography>
                        <Card id='preview' elevation={5}
                            sx={{ mt: '1rem', mb: '2rem', border: '2px solid #1267B1', borderRadius: '10px' }}>
                            <iframe width="100%" height="515" src={`${code}?controls=1`}
                                title="YouTube video player" frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                                allowfullscreen />
                        </Card>

                        <Box sx={{ mb: '5rem' }}>
                            <Grid container spacing={3}>
                                {
                                    vidLinks?.map((vid, index) => {
                                        return (
                                            <Grid item xs={12} sm={6} lg={4} key={index}>
                                                <Card sx={{
                                                    boxShadow: '0 2px 10px rgba(0,0,0, 15%)',
                                                    borderRadius: '15px'
                                                }}>
                                                    <CardContent sx={{
                                                        padding: '0 !important',
                                                        bgcolor: 'tertiary.main',
                                                        color: '#fff',
                                                        minHeight: '240px'
                                                    }}>
                                                        <Box sx={{
                                                            padding: '2.5rem',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Typography mb={1}
                                                                variant='h6' sx={{
                                                                    fontSize: '1rem',
                                                                    textAlign: 'center'
                                                                }}>{vid.title}</Typography>
                                                            <IconButton onClick={() => previewVid(vid.link)}
                                                                sx={{ bgcolor: 'red', color: '#fff' }}><PlayArrow
                                                                    fontSize='large' /></IconButton>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </Box>
                    </Container>
                </Box>

            </motion.div>

        </div>
    )
}

export default Help
