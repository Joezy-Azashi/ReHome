import React, { useState, useEffect, useContext } from 'react'
import { Dialog, DialogContent, Stack, InputAdornment, MenuItem, FormControlLabel, Checkbox, Chip, Autocomplete, styled, DialogActions, Box, Typography, FormLabel, Grid, TextField, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import RoundButton from '../../components/Buttons/RoundButton';
import Api from '../../api/api';
import { getUserType } from '../../services/auth';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import PhoneInput from 'react-phone-number-input'
import en from 'react-phone-number-input/locale/en'
import fr from 'react-phone-number-input/locale/fr'
import RateContext from '../../contexts/rateContext'

const InputField = styled(TextField)(({ theme }) => ({
    margin: '.7rem 0',
}))

function AddCustomerRequest({ openAddCustomerRequest, setOpenAddCustomerRequest, customerRequest }) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const { executeRecaptcha } = useGoogleReCaptcha();
    const ExContext = useContext(RateContext);

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [propertyType, setPropertyType] = useState("apartment")
    const [propertyFeatures, setPropertyFeatures] = useState([])
    const [propertySize, setPropertySize] = useState(0)
    const [bedrooms, setBedrooms] = useState(0)
    const [bathrooms, setBathrooms] = useState(0)
    const [plots, setPlots] = useState(0)
    const [locations, setLocations] = useState([])
    const [uniquefeatures, setUniquefeatures] = useState([])
    const [search, setSearch] = useState("")
    const [note, setNote] = useState("")
    const [shortlet, setShortlet] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const [constantLocation, setConstantLocation] = useState([])
    const [minBudget, setMinBudget] = useState(0)
    const [maxBudget, setMaxBudget] = useState(0)
    const [currency, setCurrency] = useState("GHS")
    const [status, setStatus] = useState("open")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [sendConfirmation, setSendConfirmation] = useState(true)


    useEffect(() => {
        setFirstName(customerRequest?.first_name || "")
        setLastName(customerRequest?.last_name || "")
        setEmail(customerRequest?.email || "")
        setPhone(customerRequest?.phone || "")

        setPropertyType(customerRequest?.property_type || "apartment")
        setPropertyFeatures(customerRequest?.property_features || [])

        if (customerRequest?.property_features) {
            setUniquefeatures(uniquefeatures.map(f => (
                customerRequest.property_features.includes(f.name) ? { name: f.name, active: true } : { name: f.name, active: false })))
        }
        setPropertySize(customerRequest?.property_size || 0)
        setBedrooms(customerRequest?.bedrooms || 0)
        setBathrooms(customerRequest?.bathrooms || 0)
        setPlots(customerRequest?.plots || 0)
        setLocations(customerRequest?.location || [])
        setShortlet(customerRequest?.shortlet)
        setNote(customerRequest?.note || "")
        setMinBudget(customerRequest?.min_budget || 0)
        setMaxBudget(customerRequest?.max_budget || 0)
        setStatus(customerRequest?.status || "open")
        setCurrency(ExContext?.preferredCurrency || "GHS")
    }, [customerRequest, openAddCustomerRequest])

    useEffect(() => {
        //get locations

        if (!search) {
            setConstantLocation([])
            return
        }
        setSearchLoading(true)
        let wherequery = { active: true }
        if (search) {
            let pattern = { like: "^" + search + ".*", options: "i" };
            wherequery.label = pattern
        }

        Api().get('/constants/atlas/locations', {
            params: {
                filter: {
                    text: search,
                    limit: 10
                }
            }
        })
            .then((res) => {
                setConstantLocation(res?.data)
                setSearchLoading(false)
            })
            .catch((error) => {
                setSearchLoading(false)
            })

    }, [search])

    useEffect(() => {
        //get features
        Api().get('constants/features')
            .then((res) => {
                setUniquefeatures(res?.data)
            })
            .catch((error) => {

            })
    }, [])

    const addPropertyFeatures = (el) => {
        setUniquefeatures(uniquefeatures.map(f => (f.name === el.name ? { name: el.name, active: !el.active } : { ...f })))
        const old_el = propertyFeatures.find(name => el.name === name);
        if (old_el) {
            setPropertyFeatures(propertyFeatures.filter(name => name !== el.name))
        } else {
            setPropertyFeatures([...propertyFeatures, el.name])
        }
    }

    const broadCastCustomerRequest = () => {
        Api().post('/customer-property-requests/broadcast/' + customerRequest.id)
            .then((res) => {
                setOpenAddCustomerRequest(false);
            })
            .catch((error) => {
                setLoading(false)
            })
    }

    const completeCustomerRequest = () => {
        Api().patch('/customer-property-requests/' + customerRequest.id, { status: 'completed' })
            .then((res) => {
                setOpenAddCustomerRequest(false);
            })
            .catch((error) => {
                setLoading(false)
            })
    }


    const onAddCustomerRequest = async () => {

        if (firstName === "" || lastName === "" || phone === "" || email === "") {
            setError(true)
            enqueueSnackbar(t('admindashboard.addcustomerrequest.error'), { variant: 'error' });
        } else {
            setLoading(true)
            const token = await executeRecaptcha('customEmailForm')

            if (token.length > 0) {
                const data = {
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone,
                    email: email,
                    property_type: propertyType,
                    property_features: propertyFeatures,
                    property_size: Number(propertySize),
                    bedrooms: Number(bedrooms),
                    bathrooms: Number(bathrooms),
                    plots: Number(plots),
                    location: locations,
                    note: note,
                    min_budget: Number(minBudget),
                    max_budget: Number(maxBudget),
                    currency: currency,
                    status: status,
                    shortlet: shortlet,
                    recaptcha: token
                }
                if (customerRequest?.id) {
                    Api().patch('/customer-property-requests/' + customerRequest.id, data)
                        .then((res) => {
                            // setOpenAddCustomerRequest(false);
                            setLoading(false)
                            enqueueSnackbar(t('admindashboard.addcustomerrequest.savesuccessful'), { variant: 'success' });
                        })
                        .catch((error) => {
                            setLoading(false)
                            enqueueSnackbar(t('admindashboard.addcustomerrequest.savefailed'), { variant: 'error' });
                        })
                } else {
                    Api().post('/customer-property-requests', data)
                        .then((res) => {
                            setOpenAddCustomerRequest(false);
                            setLoading(false)
                            enqueueSnackbar(t('admindashboard.addcustomerrequest.savesuccessful'), { variant: 'success' });
                            if (sendConfirmation) {
                                Api().post(`/customer-property-requests/send-confirmation/${res.data.id}/${ExContext.preferredLanguage}`)
                            }
                        })
                        .catch((error) => {
                            setLoading(false)
                            enqueueSnackbar(t('admindashboard.addcustomerrequest.savefailed'), { variant: 'error' });
                        })
                }
            }
        }
    }

    return (
        <Dialog open={openAddCustomerRequest} onClose={() => setOpenAddCustomerRequest(false)} fullWidth maxWidth="lg">
            <DialogContent>
                <Box>
                    <form onSubmit={onAddCustomerRequest}>
                        <Typography variant={"h5"} textAlign={'start'} color={'#03254c'} marginBottom={'20px'} fontWeight={600}>{t('admindashboard.addcustomerrequest.title')}</Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant={"h7"} textAlign={'center'} fontWeight={600}>{t('admindashboard.addcustomerrequest.contact_info')}</Typography>
                            </Grid>

                            <Grid item md={3} xs={6}>
                                <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('admindashboard.addcustomerrequest.firstname')}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    size="small"
                                    value={firstName}
                                    error={firstName?.length > 0 ? false : error}
                                    onChange={(e) => { setFirstName(e.target.value); setError(false) }}
                                    placeholder={t('admindashboard.addcustomerrequest.firstname')}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item md={3} xs={6}>
                                <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('admindashboard.addcustomerrequest.lastname')}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    size="small"
                                    value={lastName}
                                    error={lastName?.length > 0 ? false : error}
                                    onChange={(e) => { setLastName(e.target.value); setError(false) }}
                                    fullWidth
                                    placeholder={t('admindashboard.addcustomerrequest.lastname')}
                                />
                            </Grid>

                            <Grid item md={3} xs={12}>
                                <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('admindashboard.addcustomerrequest.phone')}</FormLabel>
                                <PhoneInput
                                    placeholder={t('admindashboard.addcustomerrequest.phone')}
                                    labels={localStorage.getItem('i18nextLng') === 'en' ? en : fr}
                                    international
                                    initialValueFormat="national"
                                    countryCallingCodeEditable={false}
                                    defaultCountry="GH"
                                    value={phone}
                                    onChange={setPhone}
                                    style={{
                                        border: "1px solid #0000003b",
                                        borderRadius: "50px",
                                        padding: "10px 14px",
                                        backgroundColor: "#fff",
                                        width: "100%",
                                        fontSize: "13.3px"
                                    }}
                                    className={"input-phone-number"}
                                />
                            </Grid>

                            <Grid item md={3} xs={12}>
                                <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('admindashboard.addcustomerrequest.email')}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    size="small"
                                    type="email"
                                    value={email}
                                    error={email?.length > 0 ? false : error}
                                    onChange={(e) => { setEmail(e.target.value); setError(false) }}
                                    fullWidth
                                    placeholder={t('admindashboard.addcustomerrequest.email')}
                                />
                            </Grid>


                            <Grid item xs={12}>
                                <Typography variant={"h7"} textAlign={'center'} fontWeight={600}>{t('admindashboard.addcustomerrequest.property_info')}</Typography>
                            </Grid>

                            <Grid item md={4} xs={12}>
                                <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('admindashboard.addcustomerrequest.property_type')}</FormLabel>
                                <TextField
                                    size="small"
                                    select
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    value={propertyType}
                                    error={propertyType?.length > 0 ? false : error}
                                    onChange={(e) => { setPropertyType(e.target.value); setError(false) }}
                                    fullWidth
                                    label={propertyType === undefined ? "eg. Apartment" : ""}
                                    InputLabelProps={{ shrink: false }}
                                    autoFocus
                                >
                                    <MenuItem value={'apartment'}>{t('agentdashboard.addlisting.tab1.apartment')}</MenuItem>
                                    <MenuItem value={'house'}>{t('agentdashboard.addlisting.tab1.house')}</MenuItem>
                                    <MenuItem value={'land'}>{t('agentdashboard.addlisting.tab1.land')}</MenuItem>
                                    <MenuItem value={'commercial'}>{t('agentdashboard.addlisting.tab1.commercial')}</MenuItem>
                                    <MenuItem value={'development'}>{t('agentdashboard.addlisting.tab1.development')}</MenuItem>
                                </TextField>
                            </Grid>
                            

                            <Grid item md={2} xs={6}>
                                <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('admindashboard.addcustomerrequest.property_size')}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    size="small"
                                    type="property_size"
                                    value={propertySize}
                                    error={propertySize?.length > 0 ? false : error}
                                    onChange={(e) => { setPropertySize(e.target.value); setError(false) }}
                                    fullWidth
                                    placeholder={t('admindashboard.addcustomerrequest.property_size')}
                                />
                            </Grid>

                            <Grid item md={2} xs={6}>
                                <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('admindashboard.addcustomerrequest.plots')}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    size="small"
                                    type="plots"
                                    value={plots}
                                    error={plots?.length > 0 ? false : error}
                                    onChange={(e) => { setPlots(e.target.value); setError(false) }}
                                    fullWidth
                                    placeholder={t('admindashboard.addcustomerrequest.plots')}
                                />
                            </Grid>

                            <Grid item md={2} xs={6}>
                                <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('admindashboard.addcustomerrequest.bedrooms')}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    size="small"
                                    type="bedrooms"
                                    value={bedrooms}
                                    error={bedrooms?.length > 0 ? false : error}
                                    onChange={(e) => { setBedrooms(e.target.value); setError(false) }}
                                    fullWidth
                                    placeholder={t('admindashboard.addcustomerrequest.bedrooms')}
                                />
                            </Grid>

                            <Grid item md={2} xs={6}>
                                <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('admindashboard.addcustomerrequest.bathrooms')}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    size="small"
                                    type="bathrooms"
                                    value={bathrooms}
                                    error={bathrooms?.length > 0 ? false : error}
                                    onChange={(e) => { setBathrooms(e.target.value); setError(false) }}
                                    fullWidth
                                    placeholder={t('admindashboard.addcustomerrequest.bathrooms')}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('admindashboard.addcustomerrequest.locations')}</FormLabel>
                                <Autocomplete
                                    multiple
                                    limitTags={1}
                                    includeInputInList
                                    id="tags-filled"
                                    getOptionLabel={(option) => option}
                                    loading={searchLoading}
                                    options={constantLocation.map((option) => option.label)}
                                    fullWidth
                                    value={locations || ""}
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#444',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    onChange={(event, newValue) => {
                                        setLocations(newValue);
                                    }}
                                    freeSolo
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <InputField
                                            InputLabelProps={{ shrink: true }}
                                            {...params}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '15px',
                                                    background: '#444',
                                                },
                                                margin: '.1rem 0',
                                            }}
                                            variant="standard"
                                            placeholder={t('admindashboard.addcustomerrequest.locations')}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('admindashboard.addcustomerrequest.property_features')}</FormLabel>
                                <Box sx={{ color: "#000", marginLeft: "1.5rem" }}>
                                    <div id="map" className="h-full hidden" />
                                    <Stack>
                                        <Box mb={'3rem'}>
                                            <Grid container>
                                                {
                                                    uniquefeatures.map((el) => {
                                                        return (
                                                            <Grid item md={6} xs={12} key={el?.name}>
                                                                <FormControlLabel sx={{
                                                                    '& span': {
                                                                        fontSize: '.9rem'
                                                                    }
                                                                }} control={<Checkbox value={el?.name} checked={el?.active} onChange={(e) => { addPropertyFeatures(el) }} />} label={el?.name} />
                                                            </Grid>
                                                        )
                                                    })
                                                }
                                            </Grid>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Grid>



                            <Grid item xs={12}>
                                <Typography variant={"h7"} textAlign={'center'} fontWeight={600}>{t('admindashboard.addcustomerrequest.budget_info')}</Typography>
                            </Grid>

                            <Grid item md={4} xs={6}>
                                <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('admindashboard.addcustomerrequest.min_budget')}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
                                    }}
                                    size="small"
                                    type="min_budget"
                                    value={minBudget}
                                    error={minBudget?.length > 0 ? false : error}
                                    onChange={(e) => { setMinBudget(e.target.value); setError(false) }}
                                    fullWidth
                                    placeholder={t('admindashboard.addcustomerrequest.min_budget')}
                                />
                            </Grid>

                            <Grid item md={4} xs={6}>
                                <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('admindashboard.addcustomerrequest.max_budget')}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    size="small"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
                                    }}
                                    type="max_budget"
                                    value={maxBudget}
                                    error={maxBudget?.length > 0 ? false : error}
                                    onChange={(e) => { setMaxBudget(e.target.value); setError(false) }}
                                    fullWidth
                                    placeholder={t('admindashboard.addcustomerrequest.max_budget')}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('admindashboard.addcustomerrequest.shortlet')}</FormLabel>
                                <TextField
                                    size="small"
                                    select
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    value={shortlet}
                                    onChange={(e) => { setShortlet(e.target.value);}}
                                    fullWidth
                                    InputLabelProps={{ shrink: false }}
                                    autoFocus
                                >
                                    <MenuItem value={true}>{t('agentdashboard.addlisting.tab2.yes')}</MenuItem>
                                    <MenuItem value={false}>{t('agentdashboard.addlisting.tab2.no')}</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('admindashboard.addcustomerrequest.notes')}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '15px'
                                        },
                                    }}
                                    size="small"
                                    rows={6}
                                    multiline
                                    type="notes"
                                    value={note}
                                    error={note?.length > 0 ? false : error}
                                    onChange={(e) => { setNote(e.target.value); setError(false) }}
                                    fullWidth
                                    placeholder={t('admindashboard.addcustomerrequest.notes')}
                                />
                            </Grid>

                            {getUserType() === 'admin' ? <Grid item xs={12}>
                                <FormControlLabel key={sendConfirmation}
                                    control={<Checkbox checked={sendConfirmation} value={sendConfirmation} onChange={(e) => setSendConfirmation(e.target.checked)} size='small' sx={{ fontSize: '1.2rem' }} />}
                                    label={<Typography variant='body2'>{t('admindashboard.addcustomerrequest.sendconfirmation')}</Typography>} />
                            </Grid> : <></>}
                        </Grid>
                    </form>
                </Box>
            </DialogContent>
            <DialogActions sx={{ padding: "0 20px 20px 0" }}>
                {
                    customerRequest?.status === 'open' && getUserType() === 'admin' ?
                        <RoundButton
                            onClick={() => broadCastCustomerRequest()}
                            progress={loading && (
                                <CircularProgress
                                    size={20}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: "primary",
                                        margin: "3px 0"
                                    }}
                                />
                            )}
                            text={loading || t('admindashboard.addcustomerrequest.broadcastbtn')}
                            disableElevation
                            variant={'outlined'}
                            sx={{ padding: '.5rem 1.5rem', marginRight: '120px' }}
                        />
                        :
                        <></>
                }
                {
                    customerRequest?.status === 'broadcasted' && getUserType() === 'admin' ?
                        <RoundButton
                            onClick={() => completeCustomerRequest()}
                            progress={loading && (
                                <CircularProgress
                                    size={20}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: "primary",
                                        margin: "3px 0"
                                    }}
                                />
                            )}
                            text={loading || t('admindashboard.addcustomerrequest.completebtn')}
                            disableElevation
                            variant={'outlined'}
                            sx={{ padding: '.5rem 1.5rem', marginRight: '120px' }}
                        />
                        :
                        <></>
                }
                <RoundButton
                    onClick={() => setOpenAddCustomerRequest(false)}
                    text={t('admindashboard.addcustomerrequest.close')} disableElevation
                    variant={'contained'} sx={{ padding: '.5rem 1.5rem' }}
                />
                <RoundButton
                    onClick={() => onAddCustomerRequest()}
                    progress={loading && (
                        <CircularProgress
                            size={20}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: "primary",
                                margin: "3px 0"
                            }}
                        />
                    )}
                    text={loading || t('admindashboard.addcustomerrequest.submitbtn')}
                    disableElevation
                    variant={'outlined'}
                    sx={{ padding: '.5rem 1.5rem' }}
                />

            </DialogActions>
        </Dialog>
    )
}

export default AddCustomerRequest