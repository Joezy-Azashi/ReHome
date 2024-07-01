import React, { useState, useEffect } from 'react'
import { Card, Box, Autocomplete, styled, Checkbox, FormControlLabel, alpha, CircularProgress, CardContent, MenuItem, FormLabel, Avatar, TextField, Typography } from '@mui/material'
import Api from '../api/api';
import ReactOwlCarousel from 'react-owl-carousel'
import NoList from '../assets/images/noListing.png'
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import RoundButton from './Buttons/RoundButton';

const PropertySlider = styled(ReactOwlCarousel)(({ theme }) => ({
    '& .owl-carousel': {
        position: 'relative',
        '&:hover .owl-nav': {
            opacity: 1
        }
    },
    '& .owl-nav': {
        // opacity: 0,
        width: '100%',
        position: 'absolute',
        display: 'flex',
        top: '20%',
        justifyContent: 'space-between',
        transform: 'TranslateY(50%)',
        transition: 'all .2s ease-in'
    },
    '& .owl-prev': {
        padding: '1rem',
        background: alpha('#000', 0.5),
        color: '#fff'

    },
    '& .owl-next': {
        padding: '1rem',
        background: alpha('#000', 0.5),
        color: '#fff'
    }
}))

const StyledCard = styled(Card)(({ theme }) => ({
    border: 'none',
    background: '#fff',
    borderRadius: '20px',
    cursor: 'pointer',
    width: "150px",
    height: "130px",
    transition: 'all .2s ease',
    '&:hover': {
        background: '#F7F7F7',
        boxShadow: '0 2px 1rem rgba(0,0,0, 12%)',
        '& #pic': {
            border: `3px solid #fff`
        },
        '& #details p': {
            color: `#fff`
        },
    }
}))

const ProfilePic = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(8),
    height: theme.spacing(8),
    margin: '0.5rem auto',
    border: `2px solid ${theme.palette.primary.main}`
}))

function SellForm({setOpenSellForm}) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const { executeRecaptcha } = useGoogleReCaptcha();

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const [constantLocation, setConstantLocation] = useState([])
    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [search, setSearch] = useState("")
    const [location, setLocation] = useState('')
    const [propertyAge, setPropertyAge] = useState(0)
    const [propertyType, setPropertyType] = useState()
    const [transactionType, setTransactionType] = useState()
    const [paymentType, setPaymentType] = useState('')
    const [timeline, setTimeline] = useState('')
    const [agentIds, setAgentIds] = useState([])

    const nextPage = () => {
        if (page === 0) {
            if (location === undefined || location === "") {
                enqueueSnackbar(t('sell.form.emptyfield'), { variant: 'error' })
                setError(true)
            } else {
                setPage(1)
                return
            }
        }
        if (page === 1) {
            if (propertyAge === undefined || propertyAge === "") {
                enqueueSnackbar(t('sell.form.emptyfield'), { variant: 'error' })
                setError(true)
            } else {
                setPage(2)
                return
            }
        }
        if (page === 2) {
            if (propertyType === undefined || propertyType === "") {
                enqueueSnackbar(t('sell.form.emptyfield'), { variant: 'error' })
                setError(true)
            } else {
                setPage(3)
                return
            }
        }
        if (page === 3) {
            if (transactionType === undefined || transactionType === "") {
                enqueueSnackbar(t('sell.form.emptyfield'), { variant: 'error' })
                setError(true)
            } else {
                setPage(4)
                return
            }
        }
        if (page === 4) {
            if (paymentType === undefined || paymentType === "") {
                enqueueSnackbar(t('sell.form.emptyfield'), { variant: 'error' })
                setError(true)
            } else {
                setPage(5)
                return
            }
        }
        if (page === 5) {
            if (timeline === undefined || timeline === "") {
                enqueueSnackbar(t('sell.form.emptyfield'), { variant: 'error' })
                setError(true)
            } else {
                setPage(6)
                return
            }
        }
        if (page === 6) {
            if (agentIds.length < 1) {
                enqueueSnackbar(t('sell.form.clickagent'), { variant: 'error' })
                setError(true)
            } else {
                postSell()
                return
            }
        }
        if (page === 7) {
            setPage(0)
            setOpenSellForm(false)
        }
    }

    const stepBack = () => {
        if (page === 1) {
            setPage(0)
            return
        } if (page === 2) {
            setPage(1)
            return
        } if (page === 3) {
            setPage(2)
            return
        } if (page === 4) {
            setPage(3)
            return
        } if (page === 5) {
            setPage(4)
            return
        } if (page === 6) {
            setPage(5)
            return
        } if (page === 7) {
            setPage(6)
            return
        }
    }

    const selectLocation = (event, newValue) => {
        setLocation(newValue?.label)
    }

    const getAgentIds = (e) => {
        if (e.target.checked) {
            agentIds.push(e.target.value);
        } else {
            agentIds.splice(agentIds.indexOf(e.target.value), 1);
        }
    }

    const postSell = async () => {
        setLoading(true)

        const token = await executeRecaptcha('sellForm')

        if (token.length > 0) {

            const sellData = {
                location: location,
                age: propertyAge,
                property_type: propertyType,
                transaction_type: transactionType,
                payment_type: paymentType,
                timeline_of_sale: timeline,
                agentIds: agentIds,
                recaptcha: token
            }

            Api().post('/emails/sell-form', sellData)
                .then((res) => {
                    setLoading(false)
                    setPage(7)
                    setLocation('')
                    setSearch("")
                    setPropertyAge(0)
                    setPropertyType()
                    setTransactionType()
                    setPaymentType('')
                    setTimeline('')
                    setAgentIds([])
                })
                .catch((error) => {
                    setLoading(false)
                })
        }
    }

    const getBrokers = () => {
        if (location === '') {

        } else {
            Api().get(`/users/active-agents/${location}`, {
                params: {
                    filter: {
                        include: ["agencies"]
                    }
                }
            })
                .then((response) => {
                    setData(response?.data)
                })
                .catch((error) => {
                })
        }
    }

    useEffect(() => {
        getBrokers()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])

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

    return (
        <Box sx={{ width: '100%', padding: "1.7rem", borderRadius: "15px", backgroundColor: "tertiary.main", textAlign: "center", margin: 'auto' }}>
            <form id="sellForm">
                {
                    page === 0 &&
                    <Box sx={{ width: '100%', margin: "auto" }}>
                        <Typography variant='h5' mb={6} sx={{ fontWeight: 600, color: "#fff" }}>{t('sell.form.title')}</Typography>
                        <FormLabel sx={{ marginBottom: '1rem', display: 'block', color: '#fff' }}>{t('sell.form.location')}</FormLabel>
                        <Autocomplete
                            disablePortal
                            id="location"
                            getOptionLabel={(option) => option.label}
                            options={constantLocation}
                            loading={searchLoading}
                            renderInput={(params) =>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    variant='outlined' {...params} placeholder={t('filter.search')}
                                    fullWidth
                                    onChange={(e) => { setSearch(e.target.value); setError(false) }}
                                />
                            }
                            onChange={(event, newValue) => { selectLocation(event, newValue) }}
                        />
                    </Box>
                }
                {
                    page === 1 &&
                    <Box sx={{ width: '100%' }}>
                        <Typography variant='h5' mb={6} sx={{ fontWeight: 600, color: "#fff" }}>{t('sell.form.title')}</Typography>
                        <FormLabel sx={{ marginBottom: '1rem', display: 'block', color: '#fff' }}>{t('sell.form.age')}</FormLabel>
                        <TextField
                            type="number"
                            onKeyDown={(e) => {
                                if (e.keyCode === 38 || e.keyCode === 40) {
                                    e.preventDefault();
                                }
                            }}
                            onWheel={(e) => e.target.blur()}
                            sx={{
                                marginBottom: '1rem',
                                '& .MuiOutlinedInput-root': {
                                    background: '#fff',
                                    borderRadius: '50px'
                                }
                            }}
                            value={propertyAge}
                            error={propertyAge !== '' ? false : error}
                            onChange={(e) => { setPropertyAge(Number(e.target.value)); setError(false) }}
                            placeholder='eg. 2'
                            fullWidth
                            autoFocus
                        />
                    </Box>
                }
                {
                    page === 2 &&
                    <Box sx={{ width: '100%' }}>
                        <Typography variant='h5' mb={6} sx={{ fontWeight: 600, color: "#fff" }}>{t('sell.form.title')}</Typography>
                        <FormLabel sx={{ marginBottom: '1rem', display: 'block', color: '#fff' }}>{t('sell.form.propertytype')}</FormLabel>
                        <TextField
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
                        </TextField>
                    </Box>
                }
                {
                    page === 3 &&
                    <Box sx={{ width: '100%' }}>
                        <Typography variant='h5' mb={6} sx={{ fontWeight: 600, color: "#fff" }}>{t('sell.form.title')}</Typography>
                        <FormLabel sx={{ marginBottom: '1rem', display: 'block', color: '#fff' }}>{t('sell.form.transactiontype')}</FormLabel>
                        <TextField
                            select
                            sx={{
                                marginBottom: '1rem',
                                '& .MuiOutlinedInput-root': {
                                    background: '#fff',
                                    borderRadius: '50px'
                                }
                            }}
                            value={transactionType}
                            error={transactionType?.length > 0 ? false : error}
                            onChange={(e) => { setTransactionType(e.target.value); setError(false) }}
                            fullWidth
                            label={transactionType === undefined ? "eg. Rent" : ""}
                            InputLabelProps={{ shrink: false }}
                            autoFocus
                        >
                            <MenuItem value={'rent'}>{t('agentdashboard.addlisting.tab2.rent')}</MenuItem>
                            <MenuItem value={'sale'}>{t('agentdashboard.addlisting.tab2.sale')}</MenuItem>
                        </TextField>
                    </Box>
                }
                {
                    page === 4 &&
                    <Box sx={{ width: '100%' }}>
                        <Typography variant='h5' mb={6} sx={{ fontWeight: 600, color: "#fff" }}>{t('sell.form.title')}</Typography>
                        <FormLabel sx={{ marginBottom: '1rem', display: 'block', color: '#fff' }}>{t('sell.form.paymenttype')}</FormLabel>
                        <TextField
                            sx={{
                                marginBottom: '1rem',
                                '& .MuiOutlinedInput-root': {
                                    background: '#fff',
                                    borderRadius: '50px'
                                }
                            }}
                            value={paymentType}
                            error={paymentType?.length > 0 ? false : error}
                            onChange={(e) => { setPaymentType(e.target.value); setError(false) }}
                            fullWidth
                            placeholder='eg. Mobile money'
                            autoFocus
                        />
                    </Box>
                }
                {
                    page === 5 &&
                    <Box sx={{ width: '100%' }}>
                        <Typography variant='h5' mb={6} sx={{ fontWeight: 600, color: "#fff" }}>{t('sell.form.title')}</Typography>
                        <FormLabel sx={{ marginBottom: '1rem', display: 'block', color: '#fff' }}>{t('sell.form.timeline')}</FormLabel>
                        <TextField
                            sx={{
                                marginBottom: '1rem',
                                '& .MuiOutlinedInput-root': {
                                    background: '#fff',
                                    borderRadius: '50px'
                                }
                            }}
                            value={timeline}
                            error={timeline?.length > 0 ? false : error}
                            onChange={(e) => { setTimeline(e.target.value); setError(false) }}
                            fullWidth
                            placeholder='eg. ASAP or Best offer'
                            autoFocus
                        />
                    </Box>
                }
                {
                    page === 6 &&
                    <Box>
                        <Typography variant='h6' mb={6} sx={{ fontWeight: 600, color: "#fff" }}>{t('sell.form.selectagent')}</Typography>

                        {
                            data?.length <= 0 ?
                                <Box>
                                    <img src={NoList} width='15%' style={{ margin: '0 auto', marginTop: '3rem' }} alt='no-listing' />
                                    <Typography mt={3} mb={3} textAlign={'center'}>{t('findanagent.mainpage.noagent')}</Typography>
                                </Box>
                                :
                                <PropertySlider
                                    items={3} margin={10}
                                    nav={true} navElement="div" navText={[
                                        `<i class='fas fa-arrow-left'></i>`, `<i class='fas fa-arrow-right'></i>`]}
                                    responsive={{ 1400: { items: '2' }, 1200: { items: '2' }, 760: { items: '2' }, 340: { items: '1' } }}
                                >
                                    {data?.map((data) => {
                                        return (
                                            <>
                                                <FormControlLabel key={data?.id} sx={{
                                                    '& span': {
                                                        fontSize: '.9rem'
                                                    }
                                                }} control={<Checkbox sx={{
                                                    display: "none",
                                                    "&.Mui-checked": {
                                                        "&, & + .MuiFormControlLabel-label #card": {
                                                            backgroundColor: "#81c784"
                                                        }
                                                    }
                                                }} value={data?.id} onChange={(e) => getAgentIds(e)} />} label={
                                                    <StyledCard id="card" variant='outlined' sx={{ margin: "auto", marginBottom: "15px" }}>
                                                        <CardContent style={{ padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                            <span>
                                                                <ProfilePic id='pic' src={data?.avatar} />
                                                                <Box textAlign={'center'} mb={4} id='details'>
                                                                    <Typography sx={{ fontWeight: 600, fontSize: '1rem', display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                                                                        <span style={{ width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#03254C" }}>{data?.firstName} {data?.lastName ? data?.lastName[0] + "." : "-"}</span>
                                                                    </Typography>
                                                                    <Typography sx={{ fontSize: '0.7rem', display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                                                                        {/* <span style={{ width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#03254C" }}>{data?.agencies[0]?.name}</span> */}
                                                                    </Typography>
                                                                </Box>
                                                            </span>
                                                        </CardContent>
                                                    </StyledCard>
                                                } />
                                            </>
                                        )
                                    })
                                    }
                                </PropertySlider>
                        }
                    </Box>
                }
                {
                    page === 7 &&
                    <Box sx={{ width: '100%' }}>
                        <Typography variant='h6' mb={6} sx={{ fontWeight: 600, color: "#fff" }}>{t('sell.form.thankyou')}</Typography>
                        <Typography variant='h6' mb={6} sx={{ fontSize: '1rem', color: "#fff" }}>{t('sell.form.endnote')}</Typography>
                    </Box>
                }

                <Box>
                    {page === 0 || page === 7 ? null :
                        <RoundButton onClick={stepBack} color={'primary'} disabled={(page === 0 ? true : false) || loading} text={t('agentdashboard.addlisting.button.back')} disableElevation variant={'contained'} sx={{ marginRight: '0.5rem', color: "#fff" }} />
                    }
                    <RoundButton
                        onClick={() => { nextPage() }}
                        size={'large'}
                        disableElevation={true}
                        color={'primary'}
                        variant='contained'
                        sx={{ marginLeft: '0.5rem' }}
                        text={page === 6 ? t('sell.form.save') : page === 7 ? t('sell.form.close') : t('sell.form.next')}
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
                    />
                </Box>
            </form>
        </Box>

    )
}

export default SellForm