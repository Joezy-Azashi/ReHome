import { useState, useEffect, useContext } from 'react'
import { CallOutlined, Call, CheckCircle, Close, PinDrop } from '@mui/icons-material';
import { Box, Button, alpha, Backdrop, Card, CardContent, Tooltip, CircularProgress, Container, Divider, Grid, Hidden, List, ListItem, ListItemIcon, ListItemText, Pagination, styled, TextField, Typography, Dialog, DialogContent, IconButton } from '@mui/material'
import GroupSocials from '../components/Social/GroupSocials';
import login from '../assets/images/loginIcon.png';
import signUp from '../assets/images/signUpIcon.png';
import PropertyItem from '../components/PropertyItem';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Api from '../api/api';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { isLoggedIn } from '../services/auth';
import { useTranslation } from "react-i18next";
import { useSnackbar } from 'notistack'
import RateContext from '../contexts/rateContext';
import { motion } from "framer-motion";
import OffPlanItem from '../components/OffPlanItem';
import CustomerCompleteProfile from '../components/CustomerCompleteProfile';
import PillButton from '../components/Buttons/PillButton';
import PhoneInput from 'react-phone-number-input'
import en from 'react-phone-number-input/locale/en'
import fr from 'react-phone-number-input/locale/fr'
import GiveawayForm from './GiveawayForm'
import { getCurrentUser } from '../services/auth';
import RoundButton from '../components/Buttons/RoundButton';
import { isMobile } from 'react-device-detect';

const pageLimit = 8

const Banner = styled(Box)(({ theme }) => (
    {
        // padding: '5rem 0',
        // height: '100%',
        backgroundColor: "#03254C"
        // backgroundPosition: 'center',
        // backgroundSize: 'cover',
        // backgroundImage: `linear-gradient( 180deg, rgba(0,0,0, 80%), rgba(0,0,0, 80%)), url(${SingleImage})`,
    }
));

const InputField = styled(TextField)(({ theme }) => (
    {
        marginBottom: '1rem'
    }
));


const SingleAgent = () => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const { executeRecaptcha } = useGoogleReCaptcha();
    const location = useLocation();
    const ExContext = useContext(RateContext);
    const [data, setData] = useState(location?.state?.el || { id: location.pathname.split("/")[3] });
    const navigate = useNavigate()
    const [listing, setlisting] = useState([])
    const [user, setUser] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [pageNumber, setpageNumber] = useState(1);
    const [isProfileComplete, setIsProfileComplete] = useState(false)
    const [count, setCount] = useState(1)
    const [error, setError] = useState(false)
    const [loginPrompt, setLoginPrompt] = useState(false)
    const [openGiveaway, setOpenGiveaway] = useState(false)
    const [giveaway, setGiveaway] = useState()
    const loc = window.location.pathname.split("/");
    const [searchParams] = useSearchParams();


    useEffect(() => {
        (async () => {
            try {
                // check if the code is on the url
                const code = searchParams.get('code')

                const giveaway_response = await Api().get(`/giveaway-codes/${code}`);
                // if we dont have a giveaway that matches the code
                if (!giveaway_response?.data?.id) return;
                // if the giveaway we got isnt of the correct property id
                if (giveaway_response?.data?.userId !== loc[3] ) return;

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

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    useEffect(() => {
        Api().get(`/users/safe/${data?.id}`)
            .then((res) => {
                setData(res.data)
            })
            .catch((error) => {

            })
    }, [])

    useEffect(() => {
        Api().get(`users/${data?.id}/rehome-properties`,
            {
                params: {
                    filter: {
                        limit: pageLimit, skip: (pageNumber - 1) * pageLimit,
                        order: ["createdAt DESC"],
                        include: [{ relation: "user" }],
                        where: { published: true }
                    }
                }
            }
        )
            .then((response) => {
                setlisting(response?.data)
            })
            .catch((error) => { })

        Api().get(`users/${data?.id}/rehome-properties/count`,
            {
                params: {
                    where: { published: true }
                }
            }
        )
            .then((res) => {
                setCount(res?.data?.count)
            })
    }, [data, pageNumber])

    useEffect(() => {
        if (isLoggedIn()) {
            Api().get("/me")
                .then((response) => {
                    setUser(response.data)
                    setFirstName(response?.data?.firstName)
                    setLastName(response?.data?.lastName)
                    setEmail(response?.data?.email)
                    setPhone(response?.data?.phone)
                })
                .catch(() => { })
        }
    }, []);

    const contactAgent = async (e) => {
        e.preventDefault();

        if (user?.userType === "customer" &&
            (firstName === "" || firstName === undefined ||
                lastName === "" || lastName === undefined ||
                phone === "" || phone === undefined)) {
            setIsProfileComplete(true)
        } else if (message.length <= 0) {
            enqueueSnackbar(t('findanagent.singleagent.emptymessage'), { variant: 'error' });
            setError(true)
        } else {
            setLoading(true)

            const token = await executeRecaptcha('contactAgentForm')

            if (token.length > 0) {
                const contactData = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone,
                    message: message,
                    recaptcha: token,
                    agentId: data?.id
                }

                Api().post('emails/find-an-agent', contactData)
                    .then((res) => {
                        setLoading(false)
                        enqueueSnackbar(t('findanagent.singleagent.messagesent'), { variant: 'success' })
                        setMessage('')
                        setFirstName('')
                        setLastName('')
                        setEmail('')
                        setPhone('')
                    })
                    .catch((error) => {
                        setLoading(false)
                        enqueueSnackbar(t('findanagent.singleagent.messagenotsent'), { variant: 'error' })
                    })
            }
        }
    }

    const copyURL = () => {
        const url = window.location.href
        navigator.clipboard.writeText(url).then(function () {
            enqueueSnackbar(t('share'), { variant: 'success' });
        }, function () {
            enqueueSnackbar(t('shareerror'), { variant: 'error' });
        });

        if(isLoggedIn()){
            Api().post(`call/${user?.id}/type/${isMobile ? 'mobile' : 'desktop'}`)
            .then(()=>{
                window.location.href = `tel:${data?.phone}`
            })
        }else{
            Api().post(`call-anonymous/${user?.id}`)
            .then(()=>{
                window.location.href = `tel:${data?.phone}`
            })
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Banner */}
            <Banner>
                <Box sx={{ width: { xs: '100%', sm: '80%', md: '80%', lg: '60%' }, height: '6vh', textAlign: 'center', margin: '0 auto' }}>
                    {/* <Typography variant='h4' mb={4}
                            sx={{
                                fontWeight: 600,
                                fontSize: { xs: '1.8rem', sm: '2.1rem', lg: '2.5rem' },
                                color: '#fff',
                            }}>{t('findanagent.banner.maintext')}</Typography>
                        <Divider sx={{
                            margin: '1rem auto 2rem auto',
                            bgcolor: 'primary.main',
                            height: '5px',
                            border: 'none',
                            width: '45%'
                        }} />
                        <Typography variant='body1' paragraph sx={{ color: '#fff' }}>{t('findanagent.banner.subtext')}</Typography>
                        {
                            isLoggedIn() ? null :
                                <RoundButton size={'large'} disableElevation={true} color={'primary'} variant='contained' text={t('findanagent.banner.button')} />
                        } */}
                </Box>
            </Banner>

            {/* Agent Details */}
            <Box bgcolor={'#F7F7F7'} sx={{ padding: '5rem 0' }}>
                <Container maxWidth='xl'>
                    <Grid container spacing={{ xs: 6, sm: 5, md: 3, lg: 3 }}>
                        <Grid item xs={12} md={6} lg={data?.id !== user?.id ? 8 : 12} sx={{ display: 'flex' }}>
                            <Grid container>
                                <Grid item xs={12} sm={12} md={12} lg={5}>
                                    <Box sx={{ backgroundImage: `url(${data?.avatar})`, backgroundSize: '100%', backgroundRepeat: "no-repeat", height: { xs: '20rem', sm: '20rem', md: '20rem', lg: '37.2rem' }, backgroundPosition: 'center', border: '1px solid #e1e1e1' }}></Box>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={7} sx={{ mb: { sm: '2rem', lg: 0 } }}>
                                    <Box sx={{ height: { md: "80%" } }} padding={'2.5rem'} bgcolor={'#fff'} border={'1px solid #e1e1e1'} borderBottom={'none'}>
                                        <Typography variant='h5' sx={{ fontWeight: 500 }}>{data?.firstName} {data?.lastName && (data?.lastName)[0]}. <span>{data?.verified ? <CheckCircle sx={{ fontSize: '1.2rem' }} color='primary' /> : ""}</span></Typography>
                                        <Typography variant='body2' mb={3} color={'primary'}>{data?.agencies ? data?.agencies[0]?.name : data?.company?.name}</Typography>
                                        <Box style={{ height: "300px", overflowY: "auto" }}>
                                            <Typography>
                                                {data?.agencies ? data?.agencies[0]?.description : data?.company?.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ height: { md: "20%" } }} bgcolor={'#F5F5F5'} border={'1px solid #e1e1e1'} padding={'1.5rem 2rem'} display={'flex'} justifyContent={'space-between'}>
                                        <List disablePadding>
                                            <ListItem disablePadding>
                                                <Box
                                                    style={{ textDecoration: "none", color: "#707070", marginRight: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                                >
                                                    <ListItemIcon sx={{ minWidth: '32px' }}><Call sx={{ fontSize: '1.2rem' }} /></ListItemIcon>
                                                    <ListItemText>{data?.phone}</ListItemText>
                                                </Box>
                                            </ListItem>
                                            <Hidden smDown>
                                                <ListItem disablePadding>
                                                    <ListItemIcon sx={{ minWidth: '32px' }}><PinDrop sx={{ fontSize: '1.4rem' }} /></ListItemIcon>
                                                    <ListItemText>{data?.agencies ? data?.agencies[0]?.location : data?.company?.location}</ListItemText>
                                                </ListItem>
                                            </Hidden>
                                        </List>
                                        <GroupSocials user={data} gap={'.6rem'} color={'primary.main'} hoverColor={'tertiary.main'} />
                                    </Box>
                                </Grid>
                            </Grid>

                        </Grid>

                        {data?.id !== user?.id ?
                            <Grid item xs={12} md={6} lg={4}>
                                <Card sx={{ borderRadius: 0, border: '1px solid #e1e1e1', height: "100%" }} elevation={0}>
                                    <CardContent sx={{ padding: '2rem 3rem' }}>
                                        <form onSubmit={contactAgent} id="contactAgentForm">
                                            <Typography mb={2} variant='h6' sx={{ fontWeight: 500, fontSize: '1.2rem' }} textTransform={"uppercase"}>{t('findanagent.singleagent.contact')} {data?.userType === 'realtor' && !data?.NAR ? t('signuptype.agent') : data?.userType}</Typography>
                                            <Box sx={{ display: "flex", gap: 2.2 }}>
                                                <InputField fullWidth variant='outlined' value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder='First name' />
                                                <InputField fullWidth variant='outlined' value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder='Last name' />
                                            </Box>
                                            <InputField fullWidth variant='outlined' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
                                            <PhoneInput
                                                placeholder="Enter phone number"
                                                labels={localStorage.getItem('i18nextLng') === 'en' ? en : fr}
                                                international
                                                initialValueFormat="national"
                                                countryCallingCodeEditable={false}
                                                defaultCountry="GH"
                                                value={phone}
                                                onChange={setPhone}
                                                style={{
                                                    border: "1px solid #0000003b",
                                                    marginBottom: "1rem",
                                                    borderRadius: "4px",
                                                    padding: "16.5px 14px"
                                                }}
                                                className={"input-phone-number"}
                                            />
                                            <InputField fullWidth variant='outlined' error={message.length > 0 ? false : error} value={message} onChange={(e) => { setMessage(e.target.value); setError(false) }} multiline rows={4} placeholder={t('findanagent.singleagent.message')} />
                                            <Box className="flex">
                                                <Button
                                                    onClick={contactAgent}
                                                    variant='contained' fullWidth disableElevation
                                                    sx={{ textTransform: 'none', borderRadius: '50px', padding: '.8rem 1.5rem', }}
                                                >
                                                    {loading ? <CircularProgress
                                                        size={20}
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            color: "white",
                                                            margin: "3px 0"
                                                        }}
                                                    /> : t('findanagent.singleagent.button')}
                                                </Button>                                                
                                                <RoundButton 
                                                    variant="contained"
                                                    aria-label="delete"
                                                    disable={loading}
                                                    onClick={copyURL}
                                                    size="small"
                                                    disableElevation
                                                    sx={{marginLeft: "5px"}}
                                                    text={(t('offplan.singleoffplan.sidebar.contact.call') ).toUpperCase() }
                                                    startIcon={<CallOutlined size="small" sx={{color: 'white'}} />}>
                                                </RoundButton>
                                            </Box>
                                            
                                        </form>
                                    </CardContent>
                                </Card>
                            </Grid>
                            : null}
                    </Grid>

                    {/* Agent properties */}
                    {listing?.length > 0 ?
                        <Box mt={7}>
                            <Typography mb={1} variant='h6'>{t('findanagent.singleagent.properties')}</Typography>
                            <Divider sx={{ bgcolor: 'primary.main', width: '15rem', height: '5px', border: 'none', mb: '3rem' }} />

                            <Grid container spacing={3}>

                                {
                                    listing && listing?.map((item) => {
                                        return (
                                            <Grid key={item.id} item xs={12} sm={6} md={4} lg={3}>
                                                {item?.propertyType === "development" ?
                                                    <OffPlanItem el={item} ExContext={ExContext}/>
                                                    :
                                                    <PropertyItem key={item?.id}
                                                        name={item?.name}
                                                        address={item?.geoAddress}
                                                        price={item?.price}
                                                        images={item?.pictures}
                                                        wifi
                                                        bed={{ number: item?.bedrooms }}
                                                        bath={{ number: item?.bathrooms }}
                                                        garage={{ number: '1' }}
                                                        agentName={data?.firstName + " " + data?.lastName}
                                                        agentImage={data?.avatar}
                                                        verified
                                                        type={item?.transactionType}
                                                        el={item}
                                                        ExContext={ExContext}
                                                        currency={item?.currency}
                                                    />
                                                }
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                            {/* Pagination */}
                            <Box mt={6} mb={8} display='flex' justifyContent={'flex-end'}>
                                {
                                    listing?.length ?
                                        <Pagination sx={{
                                            '& ul': {
                                                marginLeft: 'auto'
                                            }
                                        }}
                                            color='primary'
                                            page={pageNumber}
                                            count={Math.ceil(count / pageLimit)}
                                            onChange={(event, value) => setpageNumber(value)}
                                            variant="text"
                                            shape="rounded"
                                        />
                                        :
                                        null
                                }
                            </Box>
                        </Box> : ""}
                </Container>
            </Box>

            {/* customer complete profile */}
            <Backdrop open={isProfileComplete} sx={{ bgcolor: alpha('#03254C', .9), zIndex: 20 }}>
                <CustomerCompleteProfile setIsProfileComplete={setIsProfileComplete} />
            </Backdrop>

            {/* Login prompt */}
            <Dialog open={loginPrompt} onClose={() => { setLoginPrompt(false) }} fullWidth maxWidth='xs'>
                <DialogContent>
                    <IconButton sx={{ position: "absolute", right: "5px", top: "5px" }} onClick={() => setLoginPrompt(false)}><Close /></IconButton>
                    <Typography textAlign={"center"}>{t('loginprompt.note1')}</Typography>

                    <Box mt={2} sx={{ display: "flex", justifyContent: "center" }} onClick={() => navigate('/login')}>
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
                    </Box>

                    <Typography mt={1} textAlign={"center"}>{t('loginprompt.note2')}</Typography>

                    <Box mt={1} sx={{ display: "flex", justifyContent: "center" }} onClick={() => navigate('/signup')}>
                        <PillButton
                            text={t('navbar.signup')}
                            size="small"
                            width="140px"
                            borderColor="rgba(0, 0, 0, 0.3)"
                            color="#000000"
                            startIcon={signUp}
                            variant="outlined"
                        />
                    </Box>

                    <Typography mt={1} textAlign={"center"}>{t('loginprompt.note3')}</Typography>
                </DialogContent>
            </Dialog>
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
        </motion.div>
    )
}

export default SingleAgent