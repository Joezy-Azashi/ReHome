import { Close, Help, SupportAgent, Verified } from '@mui/icons-material'
import { Backdrop, Button, Card, CardContent, CircularProgress, Grid, Hidden, IconButton, styled, TextField, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import { alpha, Box } from '@mui/system'
import React, { useState, useEffect } from 'react'
import HELP from '../../assets/images/customer-service.png'
import SUPPORT from '../../assets/images/support.png'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Api from '../../api/api'
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack'
import { isLoggedIn } from '../../services/auth'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useNavigate } from 'react-router-dom'

const WrapCard = styled(Card)(({ theme }) => ({
    borderRadius: '10px',
    height: '100%'
}))

const InputField = styled(TextField)(({ theme }) => ({
    marginBottom: '1.5rem',
    '& .MuiOutlinedInput-root': {
        background: '#fff'
    }
}))

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));



const GetHelp = () => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState()
    const [expanded, setExpanded] = React.useState('panel1');
    const [loading, setLoading] = useState(false)
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState('')
    const [user, setUser] = useState()
    const [error, setError] = useState(false)

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const helpLinks = [
        { title: 'FAQs', img: <Help color='primary' fontSize='large' />, },
        { title: t('appealforfraud.title'), img: <SupportAgent color='primary' fontSize='large' />, },
        { title: t('accountverification.title'), img: <Verified color='primary' fontSize='large' />, }
    ]

    useEffect(() => {
        if (isLoggedIn()) {
            Api().get("/me")
                .then((response) => {
                    setUser(response?.data)
                })
                .catch(() => { })
        }
    }, []);

    const contactUs = async (e) => {
        e.preventDefault();

        if (subject.length <= 0 || message.length <= 0) {
            enqueueSnackbar(t('gethelp.contactus.emptyfields'), { variant: 'error' })
            setError(true)
        } else {
            setLoading(true)

            const token = await executeRecaptcha('getHelpForm')

            if (token.length > 0) {
                const contactData = {
                    subject: subject,
                    message: message,
                    userId: user?.id,
                    recaptcha: token
                }

                Api().post('/emails/contact-us', contactData)
                    .then((res) => {
                        setLoading(false)
                        enqueueSnackbar(t('gethelp.contactus.messagesent'), { variant: 'success' })
                        setMessage('')
                        setSubject("")
                    })
                    .catch((error) => {
                        setLoading(false)
                        enqueueSnackbar(t('gethelp.contactus.messagenotsent'), { variant: 'error' })
                    })
            }
        }
    }


    return (
        <WrapCard elevation={0}>
            <CardContent sx={{ padding: { xs: '2rem', sm: '2rem', lg: '3rem' }, height: '100%' }}>

                <Grid container spacing={'2rem'} sx={{ height: '100%' }}>
                    {/* Forms */}
                    <Grid item xs={12} sm={7} md={6} lg={4} order={{ md: 1, sm: 1, xs: 1 }}
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <form id="getHelpForm">
                            <Box sx={{ padding: { xs: '2rem', sm: '3rem', lg: '4.5rem 3rem' }, bgcolor: grey[200], borderRadius: '10px', mt: { xs: '1.5rem' } }}>
                                <Typography mb={4}>{t('gethelp.contactus.title')}</Typography>
                                <InputField
                                    value={subject}
                                    error={subject?.length > 0 ? false : error}
                                    onChange={(e) => { setSubject(e.target.value); setError(false) }}
                                    size='small'
                                    variant='outlined'
                                    fullWidth
                                    placeholder={t('gethelp.contactus.subject')}
                                />

                                <InputField
                                    value={message}
                                    error={message?.length > 0 ? false : error}
                                    onChange={(e) => { setMessage(e.target.value); setError(false) }}
                                    multiline
                                    rows={5}
                                    variant='outlined'
                                    fullWidth
                                    placeholder={t('gethelp.contactus.message')}
                                />
                                <Button disabled={loading} onClick={contactUs} variant='contained' fullWidth color='primary' disableElevation sx={{ textTransform: 'none' }}>
                                    {loading ? <CircularProgress
                                        size={20}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: "white",
                                            margin: "3px 0"
                                        }}
                                    /> : t('gethelp.contactus.send')
                                    }
                                </Button>
                            </Box>
                        </form>
                        <Hidden smUp>
                            <Grid sx={{ mt: '1rem' }} container spacing={3}>
                                {
                                    helpLinks.map((el, index) => {
                                        return (
                                            <Grid item xs={12} sm={12} md={12} lg={12} key={index}>
                                                <Card variant='outlined' onClick={() => {
                                                    setActive(el.title);
                                                    el?.title === "FAQs" ? navigate("/help") : setOpen(true)
                                                }}
                                                    sx={{
                                                        borderRadius: '15px',
                                                        cursor: 'pointer',
                                                        transition: 'all .2s ease-in',
                                                        '&:hover': {
                                                            borderColor: 'primary.main',
                                                            bgcolor: 'secondary.main',
                                                            color: '#fff'
                                                        }
                                                    }}>
                                                    <CardContent sx={{ display: 'flex', padding: { sm: '2rem', lg: '3rem 2rem !important' }, justifyContent: 'flex-start', alignItems: 'center', gap: '1rem' }}>
                                                        {el.img}
                                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem', lg: '1.4rem' } }}>{el.title}</Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </Hidden>
                    </Grid>

                    {/* FAQs */}
                    <Hidden smDown>
                        <Grid item xs={12} sm={5} md={6} lg={4} order={{ md: 2, sm: 2, xs: 2 }}
                            sx={{ display: 'flex', flexDirection: { sm: 'row', md: 'column', lg: 'column' }, alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Grid container spacing={3}>
                                {
                                    helpLinks.map((el, index) => {
                                        return (
                                            <Grid item xs={12} sm={12} md={12} lg={12} key={index}>
                                                <Card variant='outlined' onClick={() => {
                                                    setActive(el.title);
                                                    el?.title === "FAQs" ? navigate("/help") : setOpen(true)
                                                }}
                                                    sx={{
                                                        borderRadius: '15px',
                                                        cursor: 'pointer',
                                                        transition: 'all .2s ease-in',
                                                        '&:hover': {
                                                            borderColor: 'primary.main',
                                                            bgcolor: 'secondary.main',
                                                            color: '#fff'
                                                        }
                                                    }}>
                                                    <CardContent sx={{ display: 'flex', padding: { sm: '2rem', lg: '3rem 2rem !important' }, justifyContent: 'flex-start', alignItems: 'center', gap: '1rem' }}>
                                                        {el.img}
                                                        <Typography variant='h6' sx={{ fontWeight: 500, fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem', lg: '1.4rem' } }}>{el.title}</Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={6} lg={4} order={{ md: 3, sm: 3, xs: 3 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <img src={HELP} width='70%' style={{ display: 'block', margin: '0 auto' }} alt='help' />
                        </Grid>
                    </Hidden>
                </Grid>
            </CardContent>

            {/* BackDrop */}
            <Backdrop open={open} sx={{ bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.97) }}>
                <Box sx={{ width: { xs: '80%', sm: '80%', md: '80%', lg: '50%' }, position: 'relative' }}>
                    <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', top: 0, right: { xs: '-10%', sm: '-6%', lg: '-5%' } }}><Close color='paper' fontSize='small' /></IconButton>
                    <Card elevation={0} sx={{ borderRadius: '15px', }}>
                        <CardContent sx={{ padding: { xs: '1.5rem', sm: '2rem' }, background: '#fff', margin: '0 auto', height: '30rem', overflowY: 'scroll' }}>
                            {
                                active === 'FAQs' &&
                                <>
                                    <Typography textAlign={'center'} sx={{ fontWeight: 600, fontSize: { xs: '1.1rem', lg: '1.6rem' } }} mb={3} variant='h5'>{t('faq.title')}</Typography>
                                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                            <Typography sx={{ fontSize: { xs: '.9rem', lg: '1.1rem' } }}>{t('faq.tab1.title')}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography sx={{ fontSize: { xs: '.9rem', lg: '1.1rem' } }}>
                                                {t('faq.tab1.note')}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                                        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                                            <Typography sx={{ fontSize: { xs: '.9rem', lg: '1.1rem' } }}>{t('faq.tab2.title')}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography sx={{ fontSize: { xs: '.9rem', lg: '1.1rem' } }}>
                                                {t('faq.tab2.note')}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                                        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                                            <Typography sx={{ fontSize: { xs: '.9rem', lg: '1.1rem' } }}>{t('faq.tab3.title')}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography sx={{ fontSize: { xs: '.9rem', lg: '1.1rem' } }}>
                                                {t('faq.tab3.note')}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                                        <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
                                            <Typography sx={{ fontSize: { xs: '.9rem', lg: '1.1rem' } }}>{t('faq.tab4.title')}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography sx={{ fontSize: { xs: '.9rem', lg: '1.1rem' } }}>
                                                {t('faq.tab4.note')}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </>
                            }

                            {
                                active === t('accountverification.title') &&
                                <>
                                    <Typography textAlign={'center'} sx={{ fontWeight: 600, fontSize: { xs: '1.3rem', lg: '1.6rem' } }} mb={3} variant='h5'>{t('accountverification.title')}</Typography>
                                    <Typography variant='body1' paragraph sx={{ fontSize: { xs: '.9rem', lg: '1.1rem' } }} dangerouslySetInnerHTML={{ __html: t('accountverification.note1') }} />
                                    <Typography variant='body1' paragraph sx={{ fontSize: { xs: '.9rem', lg: '1.1rem' } }} dangerouslySetInnerHTML={{ __html: t('accountverification.note2') }} />

                                </>
                            }
                            {
                                active === t('appealforfraud.title') &&
                                <>
                                    <img src={SUPPORT} width='40%' style={{ margin: '0 auto' }} alt='support' />
                                    <Typography textAlign={'center'} sx={{ fontWeight: 600, fontSize: { xs: '1.3rem', lg: '1.6rem' } }} mb={3} variant='h5'>{t('appealforfraud.title')}</Typography>
                                    <Typography textAlign={'left'} variant='body1' sx={{ width: '80%', margin: '0 auto', fontSize: { xs: '.9rem', lg: '1.1rem' } }} dangerouslySetInnerHTML={{ __html: t('appealforfraud.note1') }} />
                                    {/* <Typography textAlign={'left'} className="unorderedList" variant='body1' sx={{ width: '80%', margin: '0 auto', fontSize: { xs: '.9rem', lg: '1.1rem' } }} dangerouslySetInnerHTML={{ __html: t('appealforfraud.note2') }} /> <br />
                                    <Typography textAlign={'left'} variant='body1' sx={{ width: '80%', margin: '0 auto', fontSize: { xs: '.9rem', lg: '1.1rem' } }} dangerouslySetInnerHTML={{ __html: t('appealforfraud.note3') }} /> <br />
                                    <Typography textAlign={'left'} variant='body1' sx={{ width: '80%', margin: '0 auto', fontSize: { xs: '.9rem', lg: '1.1rem' } }} dangerouslySetInnerHTML={{ __html: t('appealforfraud.note4') }} /> <br />
                                    <Typography textAlign={'left'} variant='body1' sx={{ width: '80%', margin: '0 auto', fontSize: { xs: '.9rem', lg: '1.1rem' } }} dangerouslySetInnerHTML={{ __html: t('appealforfraud.note5') }} /> */}

                                </>
                            }
                        </CardContent>
                    </Card>

                </Box>
            </Backdrop>
        </WrapCard>
    )
}

export default GetHelp