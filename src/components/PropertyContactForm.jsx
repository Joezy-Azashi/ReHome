import React, { useEffect, useState } from 'react'
import { Button, Box, CircularProgress, styled, TextField, Typography, FormControlLabel, Checkbox, FormGroup } from '@mui/material'
import { CallOutlined, EmailOutlined } from '@mui/icons-material'
import { useTranslation } from "react-i18next";
import RoundButton from './Buttons/RoundButton';
import { useSnackbar } from 'notistack'
import Api from '../api/api';
import PhoneInput from 'react-phone-number-input'
import en from 'react-phone-number-input/locale/en'
import fr from 'react-phone-number-input/locale/fr'
import ReactGA from 'react-ga4'
import { isLoggedIn } from '../services/auth';
import { isMobile } from 'react-device-detect';

const InputField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        background: '#fff',
        fontSize: "14px"
    }
}))

function PropertyContactForm({ user, data, executeRecaptcha }) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const [contactMessage, setContactMessage] = useState('')
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [location, setLocation] = useState("")
    const [phone, setPhone] = useState("")
    const [available, setAvailable] = useState(false)
    const [when, setWhen] = useState(false)
    const [payment, setPayment] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const id = window.location.pathname.split("/");

    useEffect(() => {
        setEmail(user?.email)
        setPhone(user?.phone)
        setFirstName(user?.firstName)
        setLastName(user?.lastName)
        setLocation(user?.address)
    }, [user])

    const contactDeveloper = async () => {
        if (email === "") {
            enqueueSnackbar(t('forgotpassword.validation.emptyfield'), { variant: 'error' })
            setError(true)
        } else if (((available === false && when === false && payment === false) && contactMessage === "") ||
            firstName === "" ||
            lastName === "" ||
            location === "" ||
            (phone === "" && email === "")
        ) {
            enqueueSnackbar(t('offplan.singleoffplan.sidebar.contact.checkone'), { variant: 'error' })
            setError(true)
        } else {
            setLoading(true)

            const token = await executeRecaptcha('contactDevForm')

            if (token.length > 0) {
                const contactData = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone,
                    message: JSON.stringify({
                        first_name: firstName,
                        last_name: lastName,
                        location: location,
                        email: email,
                        property: data?.name,
                        phone: phone,
                        availability: available,
                        payment_plan: payment,
                        tour: when,
                        note: contactMessage
                    }),
                    recaptcha: token,
                    agentId: data?.user?.id,
                    propertyId: id[2],
                }

                Api().post('/emails/property-form', contactData)
                    .then((res) => {
                        setContactMessage("")
                        setFirstName("")
                        setLastName("")
                        setLocation("")
                        setPhone("")
                        setEmail("")
                        setAvailable(false)
                        setWhen(false)
                        setPayment(false)
                        enqueueSnackbar(res?.data, { variant: 'success' })
                        setLoading(false)
                        ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Property Contact Form" });
                    })
                    .catch((error) => {
                        if(error?.response?.data?.error?.details.find(d=>d.path === '/phone')){
                            enqueueSnackbar(t('offplan.singleoffplan.sidebar.contact.validphone'), { variant: 'error' })
                        }else if(error?.data){
                            enqueueSnackbar(error?.data, { variant: 'error' })
                        }
                        else{
                            enqueueSnackbar(t('offplan.singleoffplan.sidebar.contact.error'), { variant: 'error' })
                        }
                        setLoading(false)
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
            Api().post(`call/${data?.user?.agencies[0]?.userId}/type/${isMobile ? 'mobile' : 'desktop'}`,{
                propertyId: id[2]
            })
            .then(()=>{
                window.location.href = `tel:${data?.user?.phone}`
            })
        }else{
            Api().post(`call-anonymous/${data?.user?.agencies[0]?.userId}`,{
                propertyId: id[2]
            })
            .then(()=>{
                window.location.href = `tel:${data?.user?.phone}`
            })
        }
    }
    

    return (
        <form id="contactDevForm">
            <Box width={{ lg: '25rem', sm: '34rem' }} sx={{
                padding: '1rem 0 0 0',
                // bgcolor: 'secondary.main',
                zIndex: 10, border: '1px solid #fff',
                transition: 'all .3s ease-in-out',
            }}>
                <RoundButton 
                    variant="contained"
                    aria-label="delete"
                    disable={loading}
                    onClick={copyURL}
                    size="small"
                    disableElevation
                    text={(t('offplan.singleoffplan.sidebar.contact.call') +" " + t('signuptype.'+data?.user?.userType)).toUpperCase() }
                    startIcon={<CallOutlined size="small" sx={{color: 'white'}} />}>
                </RoundButton>

                <Box sx={{ backgroundColor: "#E7F1FB", padding: "1rem", borderRadius: ".5rem", fontSize: "15px", marginTop: "1rem" }}>
                    <EmailOutlined sx={{ marginRight: "7px" }} />
                    <span>
                        <span style={{ fontWeight: '550' }}>{t('offplan.singleoffplan.sidebar.contact.sendto')}</span> {data?.user?.firstName + " " + data?.user?.lastName}
                    </span>

                    <Box sx={{ display: "flex", alignItems: 'center', gap: "10px" }} mt={1}>
                        <Typography sx={{ whiteSpace: "noWrap" }} fontSize="15px">{t('offplan.singleoffplan.sidebar.contact.p1')}</Typography>
                        <InputField
                            size='small'
                            value={firstName}
                            error={firstName?.length > 0 ? false : error}
                            variant='outlined'
                            fullWidth
                            placeholder={t('dashboard.profile.firstname')}
                            onChange={(e) => { setFirstName(e.target.value); setError(false) }}
                        />
                        <InputField
                            size='small'
                            value={lastName}
                            error={lastName?.length > 0 ? false : error}
                            variant='outlined'
                            fullWidth
                            placeholder={t('dashboard.profile.lastname')}
                            onChange={(e) => { setLastName(e.target.value); setError(false) }}
                        />
                    </Box>

                    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: 'center', gap: "5px" }} mt={1}>
                        <Typography sx={{ whiteSpace: "noWrap" }} fontSize="15px">{t('offplan.singleoffplan.sidebar.contact.p2')}</Typography>
                        <Typography fontWeight={"550"} fontSize="15px">{data?.name}.</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: 'center', gap: "5px" }} mt={1}>
                        <Typography sx={{ whiteSpace: "noWrap" }} fontSize="15px">{t('offplan.singleoffplan.sidebar.contact.p3')}</Typography>
                        <InputField
                            size='small'
                            value={location}
                            error={location?.length > 0 ? false : error}
                            variant='outlined'
                            fullWidth
                            placeholder={t('filter.location.title')}
                            onChange={(e) => { setLocation(e.target.value); setError(false) }}
                        />
                    </Box>

                    <Box sx={{ display: { xs: "block", md: "flex" }, alignItems: 'center', gap: "5px" }} mt={1}>
                        <Typography sx={{ whiteSpace: "noWrap" }} fontSize="15px">{t('offplan.singleoffplan.sidebar.contact.p4')}</Typography>
                        {/* <InputField
                            type="number"
                            onKeyDown={(e) => {
                                if (e.keyCode === 38 || e.keyCode === 40) {
                                    e.preventDefault();
                                }
                            }}
                            onWheel={(e) => e.target.blur()}
                            size='small'
                            value={phone}
                            error={phone?.length > 0 ? false : error}
                            variant='outlined'
                            fullWidth
                            placeholder={t('aboutus.contactus.phone')}
                            onChange={(e) => { setPhone(e.target.value); setError(false) }}
                        /> */}
                        <Box sx={{ width: { xs: "100%", md: "47%" } }}>
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
                                    borderRadius: "8px",
                                    padding: "8.5px 14px",
                                    backgroundColor: "#fff",
                                    width: "100%",
                                    fontSize: "13.3px"
                                }}
                                className={"input-phone-number"}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: 'center', gap: "5px" }} mt={1}>
                        <Typography sx={{ whiteSpace: "noWrap" }} fontSize="15px">{t('offplan.singleoffplan.sidebar.contact.p5')}</Typography>
                        <InputField
                            size='small'
                            value={email}
                            error={email?.length > 0 ? false : error}
                            variant='outlined'
                            fullWidth
                            placeholder={t('aboutus.contactus.email')}
                            onChange={(e) => { setEmail(e.target.value); setError(false) }}
                        />
                    </Box>

                    <Box mt={1}>
                        <FormGroup>
                            {data?.propertyType === "development" ? null :
                                <FormControlLabel control={
                                    <Checkbox
                                        checked={available}
                                        size="small"
                                        onChange={(e) => { setAvailable(e.target.checked) }} />}
                                    label={
                                        <Typography
                                            fontSize="15px"
                                        >
                                            {t('offplan.singleoffplan.sidebar.contact.p6')}
                                        </Typography>}
                                />
                            }
                            <FormControlLabel control={
                                <Checkbox
                                    checked={payment}
                                    size="small"
                                    onChange={(e) => { setPayment(e.target.checked) }} />}
                                label={
                                    <Typography
                                        fontSize="15px"
                                    >
                                        {t('offplan.singleoffplan.sidebar.contact.p7')}
                                    </Typography>}
                            />
                            <FormControlLabel control={
                                <Checkbox
                                    checked={when}
                                    size="small"
                                    onChange={(e) => { setWhen(e.target.checked) }} />}
                                label={
                                    <Typography
                                        fontSize="15px"
                                    >
                                        {t('offplan.singleoffplan.sidebar.contact.p8')}
                                    </Typography>}
                            />
                        </FormGroup>
                    </Box>

                    <Box mt={1}>
                        <InputField
                            size='small'
                            value={contactMessage}
                            error={contactMessage?.length > 0 ? false : error}
                            onChange={(e) => { setContactMessage(e.target.value); setError(false) }}
                            variant='outlined'
                            fullWidth multiline rows={2}
                            placeholder='Message'
                        />

                    </Box>

                    <RoundButton
                        disable={loading}
                        onClick={() => { contactDeveloper() }}
                        variant={'contained'}
                        progress={loading && (
                            <CircularProgress
                                size={20}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: "white"
                                }}
                            />
                        )}
                        text={loading || t('offplan.singleoffplan.sidebar.contact.button')}
                        fullWidth
                        disableElevation
                        sx={{ marginTop: "1rem" }}
                    />

                </Box>
            </Box>
        </form >
    )
}

export default PropertyContactForm