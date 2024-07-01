import { RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material'
import { Box, Button, CircularProgress, Dialog, DialogContent, DialogActions, Divider, Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import Developer from "../assets/images/developer01.png"
import Realtor from "../assets/images/realtor01.png"
import AgentLight from "../assets/images/agent01.png"
import Api from '../api/api'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import { useSnackbar } from 'notistack';
import RoundButton from './Buttons/RoundButton'
import PageLoader from './PageLoader'
import moment from 'moment'

const PackageItem = ({ userType }) => {
    const navigate = useNavigate()
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const [active, setActive] = useState()
    const [currentPlan, setCurrentPlan] = useState()
    const [currentSub, setCurrentSub] = useState()
    const [discount, setDiscount] = useState('')
    const [packageSelect, setPackageSelect] = useState({ code: '', price: '' })
    const [amountPayable, setAmountPayable] = useState("")
    const [loading, setLoading] = useState(false)
    const [cardUpdateLoad, setCardUpdateLoad] = useState(false)
    const [prompt, setPrompt] = useState(false)
    const [plan, setPlan] = useState()
    const [loadPlans, setLoadPlans] = useState(false)

    const onSelect = (code, price) => {
        setActive(code)
        setPackageSelect({ code, price })
        postSubscription(code, true)
    }

    const postSubscription = (code, state) => {
        const data = {
            planCode: code,
            discountCode: discount,
            summary: state
        }
        setLoading(true)
        Api().post('subscriptions/subscribe', data)
            .then((res) => {
                setLoading(false)
                setPrompt(false)
                if (state === true) {
                    setAmountPayable(res?.data?.data?.subscription_amount / 100)
                } else if (amountPayable > 0) {
                    navigate("//" + res?.data?.data?.authorization_url.replace(/^https?:\/\//, ''));
                } else {
                    enqueueSnackbar(t('agentdashboard.subscription.packagecards.subscriptionchange'), { variant: 'success' });
                    setAmountPayable("")
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000)
                }
            })
            .catch((error) => {
                enqueueSnackbar(error?.response?.data?.error?.message, { variant: 'warning' });
                setAmountPayable("")
                setLoading(false)
            })
    }

    useEffect(() => {
        Api().get('/me')
            .then((res) => {
                setCurrentPlan(res?.data?.subscription?.plan_code)
                setCurrentSub(res?.data?.subscription)
            })
    }, [])

    const updateCard = () => {
        setCardUpdateLoad(true)
        Api().get('/subscriptions/update-card')
            .then((res) => {
                setCardUpdateLoad(false)
                navigate("//" + res?.data?.data?.link.replace(/^https?:\/\//, ''));
            })
            .catch((error) => {
                setCardUpdateLoad(false)
            })
    }

    useEffect(() => {
        setLoadPlans(true)
        Api().get('subscriptions/plans')
            .then((res) => {
                setPlan(res?.data)
                setLoadPlans(false)
            })
            .catch((error) => {
                setLoadPlans(false)
            })
    }, [])

    return (
        <>
            {loadPlans ? <Box mt={10}><PageLoader /></Box> :
                <>
                    {
                        userType === 'agent' &&
                        <Grid container spacing={2}>
                            <Grid item sm={6}>
                                <Box onClick={() => {
                                    if (currentPlan === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code) {
                                        return
                                    }
                                    onSelect(plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code, plan?.find((fd) => fd?.name === 'Agent Light')?.amount / 100)
                                }}
                                    sx={{
                                        color: active === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? '#fff' : null,
                                        borderRadius: '10px',
                                        overflow: 'hidden', width: '100%',
                                        padding: '1.5rem', cursor: 'pointer',
                                        bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? 'primary.main' : '#ededed',
                                        height: "100%"
                                    }} >
                                    <Box sx={{
                                        height: '3.5rem',
                                        mt: '-2.2rem',
                                        padding: "6px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <Typography textAlign={'center'} sx={{
                                            padding: '10px', borderRadius: '3px',
                                            border: '1px solid #fff',
                                            fontSize: '.65rem',
                                            fontWeight: 600,
                                            bgcolor: 'secondary.main',
                                            color: '#fff',
                                            lineHeight: 1,
                                            display: currentPlan === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? "flex" : "none",
                                        }}>{t('agentdashboard.subscription.packagecards.currentplan')}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: "center", display: 'flex', gap: '.5rem', alignItems: 'flex-end', mb: '.5rem' }}>
                                        <img src={AgentLight} alt='agent-package' width={'20%'} height={'fit-content'} />
                                        <Typography sx={{ whiteSpace: "nowrap", fontSize: '1.3rem', fontWeight: 600 }} variant='h6'>{t('agentdashboard.subscription.packagecards.agentlight.title')}</Typography>
                                    </Box>
                                    <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? '#fff' : null }} />
                                    <Typography variant='body2' sx={{ fontSize: '.8rem' }} my={'1rem'}>
                                        {t('agentdashboard.subscription.packagecards.agentlight.note')}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '1rem' }}>
                                        <Stack >
                                            <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? '#fff' : null }} />
                                            <Typography variant='h6' mt={.5} mb={.5} sx={{
                                                fontWeight: 400, '& span': {
                                                    fontSize: '.8rem'
                                                }
                                            }}><span>{t('agentdashboard.subscription.packagecards.agentlight.amount')}</span></Typography>
                                            <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? '#fff' : null }} />
                                        </Stack>

                                        {currentPlan !== plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? <RadioButtonUnchecked /> : <RadioButtonChecked color='secondary' />}
                                    </Box>
                                    <Box sx={{
                                        height: '3.5rem',
                                        mb: '-2.2rem',
                                        padding: "6px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <Typography textAlign={'center'} sx={{
                                            padding: '10px', borderRadius: '3px',
                                            fontSize: '.65rem',
                                            fontWeight: 600,
                                            color: 'primary.main',
                                            lineHeight: 1,
                                            display: currentPlan === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? "flex" : "none",
                                        }}>{t('agentdashboard.subscription.packagecards.expires')}: {currentSub && moment(currentSub.next_payment_date).format('LL')}</Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item sm={6}>
                                <Box onClick={() => {
                                    if (currentPlan === plan?.find((fd) => fd?.name === 'Agent Plus')?.plan_code) {
                                        return
                                    }
                                    onSelect(plan?.find((fd) => fd?.name === 'Agent Plus')?.plan_code, plan?.find((fd) => fd?.name === 'Agent Plus')?.amount / 100)
                                }}
                                    sx={{
                                        color: active === plan?.find((fd) => fd?.name === 'Agent Plus')?.plan_code ? '#fff' : null,
                                        borderRadius: '10px',
                                        overflow: 'hidden', width: '100%',
                                        padding: '1.5rem', cursor: 'pointer',
                                        bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Plus')?.plan_code ? 'primary.main' : '#ededed',
                                        height: "100%"
                                    }} >
                                    <Box sx={{
                                        height: '3.5rem',
                                        mt: '-2.2rem',
                                        padding: "6px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <Typography textAlign={'center'} sx={{
                                            padding: '10px', borderRadius: '3px',
                                            border: '1px solid #fff',
                                            fontSize: '.65rem',
                                            fontWeight: 600,
                                            bgcolor: 'secondary.main',
                                            color: '#fff',
                                            lineHeight: 1,
                                            display: currentPlan === plan?.find((fd) => fd?.name === 'Agent Plus')?.plan_code ? "flex" : "none",
                                        }}>{t('agentdashboard.subscription.packagecards.currentplan')}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: "center", display: 'flex', gap: '.5rem', alignItems: 'flex-end', mb: '.5rem' }}>
                                        <img src={AgentLight} alt='agent-package' width={'20%'} height={'fit-content'} />
                                        <Typography sx={{ whiteSpace: "nowrap", fontSize: '1.3rem', fontWeight: 600 }} variant='h6'>{t('agentdashboard.subscription.packagecards.agentplus.title')}</Typography>
                                    </Box>
                                    <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Plus')?.plan_code ? '#fff' : null }} />
                                    <Typography variant='body2' sx={{ fontSize: '.8rem' }} my={'1rem'}>
                                        {t('agentdashboard.subscription.packagecards.agentplus.note')}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'flex-end' }}>
                                        <Stack >
                                            <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Plus')?.plan_code ? '#fff' : null }} />
                                            <Typography variant='h6' mt={.5} mb={.5} sx={{
                                                fontWeight: 400, '& span': {
                                                    fontSize: '.8rem'
                                                }
                                            }}><span>GHS</span>{plan?.find((fd) => fd?.name === 'Agent Plus')?.amount / 100}<span>/{t('agentdashboard.subscription.packagecards.month')}</span></Typography>
                                            <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Plus')?.plan_code ? '#fff' : null }} />
                                        </Stack>

                                        {currentPlan !== plan?.find((fd) => fd?.name === 'Agent Plus')?.plan_code ? <RadioButtonUnchecked /> : <RadioButtonChecked color='secondary' />}
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    }

                    {
                        userType === 'realtor' &&
                        <Grid container spacing={2}>
                            <Grid item sm={6}>
                                <Box onClick={() => {
                                    if (currentPlan === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code) {
                                        return
                                    }
                                    onSelect(plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code, plan?.find((fd) => fd?.name === 'Agent Light')?.amount / 100)
                                }}
                                    sx={{
                                        color: active === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? '#fff' : null,
                                        borderRadius: '10px',
                                        overflow: 'hidden', width: '100%',
                                        padding: '1.5rem', cursor: 'pointer',
                                        bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? 'primary.main' : '#ededed',
                                        height: "100%"
                                    }} >
                                    <Box sx={{
                                        height: '3.5rem',
                                        mt: '-2.2rem',
                                        padding: "6px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <Typography textAlign={'center'} sx={{
                                            padding: '10px', borderRadius: '3px',
                                            border: '1px solid #fff',
                                            fontSize: '.65rem',
                                            fontWeight: 600,
                                            bgcolor: 'secondary.main',
                                            color: '#fff',
                                            lineHeight: 1,
                                            display: currentPlan === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? "flex" : "none",
                                        }}>{t('agentdashboard.subscription.packagecards.currentplan')}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: "center", display: 'flex', gap: '.5rem', alignItems: 'flex-end', mb: '.5rem' }}>
                                        <img src={AgentLight} alt='agent-package' width={'20%'} height={'fit-content'} />
                                        <Typography sx={{ whiteSpace: "nowrap", fontSize: '1.3rem', fontWeight: 600 }} variant='h6'>{t('agentdashboard.subscription.packagecards.agentlight.title')}</Typography>
                                    </Box>
                                    <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? '#fff' : null }} />
                                    <Typography variant='body2' sx={{ fontSize: '.8rem' }} my={'1rem'}>
                                        {t('agentdashboard.subscription.packagecards.agentlight.note')}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '1rem' }}>
                                        <Stack >
                                            <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? '#fff' : null }} />
                                            <Typography variant='h6' mt={.5} mb={.5} sx={{
                                                fontWeight: 400, '& span': {
                                                    fontSize: '.8rem'
                                                }
                                            }}><span>{t('agentdashboard.subscription.packagecards.agentlight.amount')}</span></Typography>
                                            <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? '#fff' : null }} />
                                        </Stack>

                                        {currentPlan !== plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? <RadioButtonUnchecked /> : <RadioButtonChecked color='secondary' />}
                                    </Box>
                                    <Box sx={{
                                        height: '3.5rem',
                                        mb: '-2.2rem',
                                        padding: "6px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <Typography textAlign={'center'} sx={{
                                            padding: '10px', borderRadius: '3px',
                                            fontSize: '.65rem',
                                            fontWeight: 600,
                                            color: 'primary.main',
                                            lineHeight: 1,
                                            display: currentPlan === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? "flex" : "none",
                                        }}>{t('agentdashboard.subscription.packagecards.expires')}: {currentSub && moment(currentSub.next_payment_date).format('LL')}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item sm={6}>
                                <Box onClick={() => {
                                    if (currentPlan === plan?.find((fd) => fd?.name === 'Realtor')?.plan_code) {
                                        return
                                    }
                                    onSelect(plan?.find((fd) => fd?.name === 'Realtor')?.plan_code, plan?.find((fd) => fd?.name === 'Realtor')?.amount / 100)
                                }}
                                    sx={{
                                        color: active === plan?.find((fd) => fd?.name === 'Realtor')?.plan_code ? '#fff' : null,
                                        borderRadius: '10px',
                                        overflow: 'hidden', width: '100%',
                                        padding: '1.5rem', cursor: 'pointer',
                                        bgcolor: active === plan?.find((fd) => fd?.name === 'Realtor')?.plan_code ? 'primary.main' : '#ededed',
                                        height: "100%"
                                    }} >
                                    <Box sx={{
                                        height: '3.5rem',
                                        mt: '-2.2rem',
                                        padding: "6px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <Typography textAlign={'center'} sx={{
                                            padding: '10px', borderRadius: '3px',
                                            border: '1px solid #fff',
                                            fontSize: '.65rem',
                                            fontWeight: 600,
                                            bgcolor: 'secondary.main',
                                            color: '#fff',
                                            lineHeight: 1,
                                            display: currentPlan === plan?.find((fd) => fd?.name === 'Realtor')?.plan_code ? "flex" : "none",
                                        }}>{t('agentdashboard.subscription.packagecards.currentplan')}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: "center", display: 'flex', gap: '.5rem', alignItems: 'flex-end', mb: '.5rem' }}>
                                        <img src={Realtor} alt='realtor-package' width={'20%'} height={'fit-content'} />
                                        <Typography sx={{ whiteSpace: "nowrap", fontSize: '1.3rem', fontWeight: 600 }} variant='h6'>{t('agentdashboard.subscription.packagecards.realtor.title')}</Typography>
                                    </Box>
                                    <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Realtor')?.plan_code ? '#fff' : null }} />
                                    <Typography variant='body2' sx={{ fontSize: '.8rem' }} my={'1rem'}>
                                        {t('agentdashboard.subscription.packagecards.realtor.note')}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '1rem' }}>
                                        <Stack >
                                            <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Realtor')?.plan_code ? '#fff' : null }} />
                                            <Typography variant='h6' mt={.5} mb={.5} sx={{
                                                fontWeight: 400, '& span': {
                                                    fontSize: '.8rem'
                                                }
                                            }}><span>GHS</span>{plan?.find((fd) => fd?.name === 'Realtor')?.amount / 100}<span>/{t('agentdashboard.subscription.packagecards.month')}</span></Typography>
                                            <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Realtor')?.plan_code ? '#fff' : null }} />
                                        </Stack>

                                        {currentPlan !== plan?.find((fd) => fd?.name === 'Realtor')?.plan_code ? <RadioButtonUnchecked /> : <RadioButtonChecked color='secondary' />}
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    }

                    {
                        userType === 'developer' &&
                        <Grid container spacing={2}>
                            <Grid item sm={6}>
                                <Box onClick={() => {
                                    if (currentPlan === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code) {
                                        return
                                    }
                                    onSelect(plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code, plan?.find((fd) => fd?.name === 'Agent Light')?.amount / 100)
                                }}
                                    sx={{
                                        color: active === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? '#fff' : null,
                                        borderRadius: '10px',
                                        overflow: 'hidden', width: '100%',
                                        padding: '1.5rem', cursor: 'pointer',
                                        bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? 'primary.main' : '#ededed',
                                        height: "100%"
                                    }} >
                                    <Box sx={{
                                        height: '3.5rem',
                                        mt: '-2.2rem',
                                        padding: "6px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <Typography textAlign={'center'} sx={{
                                            padding: '10px', borderRadius: '3px',
                                            border: '1px solid #fff',
                                            fontSize: '.65rem',
                                            fontWeight: 600,
                                            bgcolor: 'secondary.main',
                                            color: '#fff',
                                            lineHeight: 1,
                                            display: currentPlan === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? "flex" : "none",
                                        }}>{t('agentdashboard.subscription.packagecards.currentplan')}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: "center", display: 'flex', gap: '.5rem', alignItems: 'flex-end', mb: '.5rem' }}>
                                        <img src={AgentLight} alt='agent-package' width={'20%'} height={'fit-content'} />
                                        <Typography sx={{ whiteSpace: "nowrap", fontSize: '1.3rem', fontWeight: 600 }} variant='h6'>{t('agentdashboard.subscription.packagecards.agentlight.title')}</Typography>
                                    </Box>
                                    <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? '#fff' : null }} />
                                    <Typography variant='body2' sx={{ fontSize: '.8rem' }} my={'1rem'}>
                                        {t('agentdashboard.subscription.packagecards.agentlight.note')}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '1rem' }}>
                                        <Stack >
                                            <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? '#fff' : null }} />
                                            <Typography variant='h6' mt={.5} mb={.5} sx={{
                                                fontWeight: 400, '& span': {
                                                    fontSize: '.8rem'
                                                }
                                            }}><span>{t('agentdashboard.subscription.packagecards.agentlight.amount')}</span></Typography>
                                            <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? '#fff' : null }} />
                                        </Stack>

                                        {currentPlan !== plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? <RadioButtonUnchecked /> : <RadioButtonChecked color='secondary' />}
                                    </Box>
                                    <Box sx={{
                                        height: '3.5rem',
                                        mb: '-2.2rem',
                                        padding: "6px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <Typography textAlign={'center'} sx={{
                                            padding: '10px', borderRadius: '3px',
                                            fontSize: '.65rem',
                                            fontWeight: 600,
                                            color: 'primary.main',
                                            lineHeight: 1,
                                            display: currentPlan === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? "flex" : "none",
                                        }}>{t('agentdashboard.subscription.packagecards.expires')}: {currentSub && moment(currentSub.next_payment_date).format('LL')}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item sm={6}>
                                <Box onClick={() => onSelect(plan?.find((fd) => fd?.name === 'Developer')?.plan_code, plan?.find((fd) => fd?.name === 'Developer')?.amount / 100)}
                                    sx={{
                                        color: active === plan?.find((fd) => fd?.name === 'Developer')?.plan_code ? '#fff' : null,
                                        borderRadius: '10px',
                                        overflow: 'hidden', width: '100%',
                                        padding: '1.5rem', cursor: 'pointer',
                                        bgcolor: active === plan?.find((fd) => fd?.name === 'Developer')?.plan_code ? 'primary.main' : '#ededed'
                                    }}
                                >
                                    <Box sx={{ textAlign: "center", display: 'flex', gap: '.5rem', alignItems: 'flex-end', mb: '.5rem' }}>
                                        <img src={Developer} alt='agent-package' width={'20%'} height={'fit-content'} />
                                        <Typography sx={{ whiteSpace: "nowrap", fontSize: '1.3rem', fontWeight: 600 }} variant='h6'>{t('agentdashboard.subscription.packagecards.developer.title')}</Typography>
                                    </Box>
                                    <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Developer')?.plan_code ? '#fff' : null }} />
                                    <Typography variant='body2' sx={{ fontSize: '.8rem' }} my={'1rem'}>
                                        {t('agentdashboard.subscription.packagecards.developer.note')}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '1rem' }}>
                                        <Stack >
                                            <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Developer')?.plan_code ? '#fff' : null }} />
                                            <Typography variant='h6' mt={.5} mb={.5} sx={{
                                                fontWeight: 400, '& span': {
                                                    fontSize: '.8rem'
                                                }
                                            }}><span>GHS</span>{plan?.find((fd) => fd?.name === 'Developer')?.amount / 100}<span>/{t('agentdashboard.subscription.packagecards.month')}</span></Typography>
                                            <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Developer')?.plan_code ? '#fff' : null }} />
                                        </Stack>

                                        {active !== plan?.find((fd) => fd?.name === 'Developer')?.plan_code ? <RadioButtonUnchecked /> : <RadioButtonChecked color='secondary' />}
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    }

                    {
                        userType === 'all' &&
                        <Grid container spacing={2}>
                            <Grid item sm={6}>
                                <Box 
                                    sx={{
                                        color: active === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? '#fff' : currentPlan === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? null : "#afafaf",
                                        borderRadius: '10px',
                                        overflow: 'hidden', width: '100%',
                                        padding: '1.5rem', cursor: 'pointer',
                                        bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? 'primary.main' : "#ededed",
                                        height: "100%"
                                    }} >
                                    <Box sx={{
                                        height: '3.5rem',
                                        mt: '-2.2rem',
                                        padding: "6px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <Typography textAlign={'center'} sx={{
                                            padding: '10px', borderRadius: '3px',
                                            border: '1px solid #fff',
                                            fontSize: '.65rem',
                                            fontWeight: 600,
                                            bgcolor: 'secondary.main',
                                            color: '#fff',
                                            lineHeight: 1,
                                            display: currentPlan === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? "flex" : "none",
                                        }}>{t('agentdashboard.subscription.packagecards.currentplan')}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: "center", display: 'flex', gap: '.5rem', alignItems: 'flex-end', mb: '.5rem' }}>
                                        <img src={AgentLight} alt='agent-package' width={'20%'} height={'fit-content'} />
                                        <Typography sx={{ whiteSpace: "nowrap", fontSize: '1.3rem', fontWeight: 600 }} variant='h6'>{t('agentdashboard.subscription.packagecards.agentlight.title')}</Typography>
                                    </Box>
                                    <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? '#fff' : null }} />
                                    <Typography variant='body2' sx={{ fontSize: '.8rem' }} my={'1rem'}>
                                        {t('agentdashboard.subscription.packagecards.agentlight.note')}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '1rem' }}>
                                        <Stack >
                                            <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? '#fff' : null }} />
                                            <Typography variant='h6' mt={.5} mb={.5} sx={{
                                                fontWeight: 400, '& span': {
                                                    fontSize: '.8rem'
                                                }
                                            }}><span>{t('agentdashboard.subscription.packagecards.agentlight.amount')}</span></Typography>
                                            <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? '#fff' : null }} />
                                        </Stack>

                                        {currentPlan !== plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? <RadioButtonUnchecked /> : <RadioButtonChecked color='secondary' />}
                                    </Box>
                                    <Box sx={{
                                        height: '3.5rem',
                                        mb: '-2.2rem',
                                        padding: "6px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <Typography textAlign={'center'} sx={{
                                            padding: '10px', borderRadius: '3px',
                                            fontSize: '.65rem',
                                            fontWeight: 600,
                                            color: 'primary.main',
                                            lineHeight: 1,
                                            display: currentPlan === plan?.find((fd) => fd?.name === 'Agent Light')?.plan_code ? "flex" : "none",
                                        }}>{t('agentdashboard.subscription.packagecards.expires')}: {currentSub && moment(currentSub.next_payment_date).format('LL')}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item sm={6}>
                                <Box onClick={() => {
                                    if (currentPlan === plan?.find((fd) => fd?.name === 'Agent Plus')?.plan_code) {
                                        return
                                    }
                                    onSelect(plan?.find((fd) => fd?.name === 'Agent Plus')?.plan_code, plan?.find((fd) => fd?.name === 'Agent Plus')?.amount / 100)
                                }}
                                    sx={{
                                        color: active === plan?.find((fd) => fd?.name === 'Agent Plus')?.plan_code ? '#fff' : null,
                                        borderRadius: '10px',
                                        overflow: 'hidden', width: '100%',
                                        padding: '1.5rem', cursor: 'pointer',
                                        bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Plus')?.plan_code ? 'primary.main' : '#ededed',
                                        height: "100%"
                                    }} >
                                    <Box sx={{
                                        height: '3.5rem',
                                        mt: '-2.2rem',
                                        padding: "6px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <Typography textAlign={'center'} sx={{
                                            padding: '10px', borderRadius: '3px',
                                            border: '1px solid #fff',
                                            fontSize: '.65rem',
                                            fontWeight: 600,
                                            bgcolor: 'secondary.main',
                                            color: '#fff',
                                            lineHeight: 1,
                                            display: currentPlan === plan?.find((fd) => fd?.name === 'Agent Plus')?.plan_code ? "flex" : "none",
                                        }}>{t('agentdashboard.subscription.packagecards.currentplan')}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: "center", display: 'flex', gap: '.5rem', alignItems: 'flex-end', mb: '.5rem' }}>
                                        <img src={AgentLight} alt='agent-package' width={'20%'} height={'fit-content'} />
                                        <Typography sx={{ whiteSpace: "nowrap", fontSize: '1.3rem', fontWeight: 600 }} variant='h6'>{t('agentdashboard.subscription.packagecards.agentplus.title')}</Typography>
                                    </Box>
                                    <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Plus')?.plan_code ? '#fff' : null }} />
                                    <Typography variant='body2' sx={{ fontSize: '.8rem' }} my={'1rem'}>
                                        {t('agentdashboard.subscription.packagecards.agentplus.note')}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'flex-end' }}>
                                        <Stack >
                                            <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Plus')?.plan_code ? '#fff' : null }} />
                                            <Typography variant='h6' mt={.5} mb={.5} sx={{
                                                fontWeight: 400, '& span': {
                                                    fontSize: '.8rem'
                                                }
                                            }}><span>GHS</span>{plan?.find((fd) => fd?.name === 'Agent Plus')?.amount / 100}<span>/{t('agentdashboard.subscription.packagecards.month')}</span></Typography>
                                            <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Agent Plus')?.plan_code ? '#fff' : null }} />
                                        </Stack>

                                        {currentPlan !== plan?.find((fd) => fd?.name === 'Agent Plus')?.plan_code ? <RadioButtonUnchecked /> : <RadioButtonChecked color='secondary' />}
                                    </Box>
                                    <Box sx={{
                                        height: '3.5rem',
                                        mb: '-2.2rem',
                                        padding: "6px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <Typography textAlign={'center'} sx={{
                                            padding: '10px', borderRadius: '3px',
                                            fontSize: '.65rem',
                                            fontWeight: 600,
                                            color: 'primary.main',
                                            lineHeight: 1,
                                            display: currentPlan === plan?.find((fd) => fd?.name === 'Agent Plus')?.plan_code ? "flex" : "none",
                                        }}>{t('agentdashboard.subscription.packagecards.expires')}: {currentSub && moment(currentSub.next_payment_date).format('LL')}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item sm={6}>
                                <Box onClick={() => {
                                    if (currentPlan === plan?.find((fd) => fd?.name === 'Realtor')?.plan_code) {
                                        return
                                    }
                                    onSelect(plan?.find((fd) => fd?.name === 'Realtor')?.plan_code, plan?.find((fd) => fd?.name === 'Realtor')?.amount / 100)
                                }}
                                    sx={{
                                        color: active === plan?.find((fd) => fd?.name === 'Realtor')?.plan_code ? '#fff' : null,
                                        borderRadius: '10px',
                                        overflow: 'hidden', width: '100%',
                                        padding: '1.5rem', cursor: 'pointer',
                                        bgcolor: active === plan?.find((fd) => fd?.name === 'Realtor')?.plan_code ? 'primary.main' : '#ededed',
                                        height: "100%"
                                    }} >
                                    <Box sx={{
                                        height: '3.5rem',
                                        mt: '-2.2rem',
                                        padding: "6px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <Typography textAlign={'center'} sx={{
                                            padding: '10px', borderRadius: '3px',
                                            border: '1px solid #fff',
                                            fontSize: '.65rem',
                                            fontWeight: 600,
                                            bgcolor: 'secondary.main',
                                            color: '#fff',
                                            lineHeight: 1,
                                            display: currentPlan === plan?.find((fd) => fd?.name === 'Realtor')?.plan_code ? "flex" : "none",
                                        }}>{t('agentdashboard.subscription.packagecards.currentplan')}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: "center", display: 'flex', gap: '.5rem', alignItems: 'flex-end', mb: '.5rem' }}>
                                        <img src={Realtor} alt='realtor-package' width={'20%'} height={'fit-content'} />
                                        <Typography sx={{ whiteSpace: "nowrap", fontSize: '1.3rem', fontWeight: 600 }} variant='h6'>{t('agentdashboard.subscription.packagecards.realtor.title')}</Typography>
                                    </Box>
                                    <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Realtor')?.plan_code ? '#fff' : null }} />
                                    <Typography variant='body2' sx={{ fontSize: '.8rem' }} my={'1rem'}>
                                        {t('agentdashboard.subscription.packagecards.realtor.note')}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '1rem' }}>
                                        <Stack >
                                            <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Realtor')?.plan_code ? '#fff' : null }} />
                                            <Typography variant='h6' mt={.5} mb={.5} sx={{
                                                fontWeight: 400, '& span': {
                                                    fontSize: '.8rem'
                                                }
                                            }}><span>GHS</span>{plan?.find((fd) => fd?.name === 'Realtor')?.amount / 100}<span>/{t('agentdashboard.subscription.packagecards.month')}</span></Typography>
                                            <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Realtor')?.plan_code ? '#fff' : null }} />
                                        </Stack>

                                        {currentPlan !== plan?.find((fd) => fd?.name === 'Realtor')?.plan_code ? <RadioButtonUnchecked /> : <RadioButtonChecked color='secondary' />}
                                    </Box>
                                    <Box sx={{
                                        height: '3.5rem',
                                        mb: '-2.2rem',
                                        padding: "6px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <Typography textAlign={'center'} sx={{
                                            padding: '10px', borderRadius: '3px',
                                            fontSize: '.65rem',
                                            fontWeight: 600,
                                            color: 'primary.main',
                                            lineHeight: 1,
                                            display: currentPlan === plan?.find((fd) => fd?.name === 'Realtor')?.plan_code ? "flex" : "none",
                                        }}>{t('agentdashboard.subscription.packagecards.expires')}: {currentSub && moment(currentSub.next_payment_date).format('LL')}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item sm={6}>
                                <Box onClick={() => {
                                    if (currentPlan === plan?.find((fd) => fd?.name === 'Developer')?.plan_code) {
                                        return
                                    }
                                    onSelect(plan?.find((fd) => fd?.name === 'Developer')?.plan_code, plan?.find((fd) => fd?.name === 'Developer')?.amount / 100)
                                }}
                                    sx={{
                                        color: active === plan?.find((fd) => fd?.name === 'Developer')?.plan_code ? '#fff' : null,
                                        borderRadius: '10px',
                                        overflow: 'hidden', width: '100%',
                                        padding: '1.5rem', cursor: 'pointer',
                                        bgcolor: active === plan?.find((fd) => fd?.name === 'Developer')?.plan_code ? 'primary.main' : '#ededed',
                                        height: "100%"
                                    }} >
                                    <Box sx={{
                                        height: '3.5rem',
                                        mt: '-2.2rem',
                                        padding: "6px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <Typography textAlign={'center'} sx={{
                                            padding: '10px', borderRadius: '3px',
                                            border: '1px solid #fff',
                                            fontSize: '.65rem',
                                            fontWeight: 600,
                                            bgcolor: 'secondary.main',
                                            color: '#fff',
                                            lineHeight: 1,
                                            display: currentPlan === plan?.find((fd) => fd?.name === 'Developer')?.plan_code ? "flex" : "none",
                                        }}>{t('agentdashboard.subscription.packagecards.currentplan')}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: "center", display: 'flex', gap: '.5rem', alignItems: 'flex-end', mb: '.5rem' }}>
                                        <img src={Developer} alt='agent-package' width={'20%'} height={'fit-content'} />
                                        <Typography sx={{ whiteSpace: "nowrap", fontSize: '1.3rem', fontWeight: 600 }} variant='h6'>{t('agentdashboard.subscription.packagecards.developer.title')}</Typography>
                                    </Box>
                                    <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Developer')?.plan_code ? '#fff' : null }} />
                                    <Typography variant='body2' sx={{ fontSize: '.8rem' }} my={'1rem'}>
                                        {t('agentdashboard.subscription.packagecards.developer.note')}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: '1rem' }}>
                                        <Stack >
                                            <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Developer')?.plan_code ? '#fff' : null }} />
                                            <Typography variant='h6' mt={.5} mb={.5} sx={{
                                                fontWeight: 400, '& span': {
                                                    fontSize: '.8rem'
                                                }
                                            }}><span>GHS</span>{plan?.find((fd) => fd?.name === 'Developer')?.amount / 100}<span>/{t('agentdashboard.subscription.packagecards.month')}</span></Typography>
                                            <Divider sx={{ bgcolor: active === plan?.find((fd) => fd?.name === 'Developer')?.plan_code ? '#fff' : null }} />
                                        </Stack>

                                        {currentPlan !== plan?.find((fd) => fd?.name === 'Developer')?.plan_code ? <RadioButtonUnchecked /> : <RadioButtonChecked color='secondary' />}
                                    </Box>
                                    <Box sx={{
                                        height: '3.5rem',
                                        mb: '-2.2rem',
                                        padding: "6px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <Typography textAlign={'center'} sx={{
                                            padding: '10px', borderRadius: '3px',
                                            fontSize: '.65rem',
                                            fontWeight: 600,
                                            color: 'primary.main',
                                            lineHeight: 1,
                                            display: currentPlan === plan?.find((fd) => fd?.name === 'Developer')?.plan_code ? "flex" : "none",
                                        }}>{t('agentdashboard.subscription.packagecards.expires')}: {currentSub && moment(currentSub.next_payment_date).format('LL')}</Typography>
                                    </Box>
                                </Box>
                            </Grid>

                        </Grid>
                    }

                    {window.location.pathname === "/broker/onboard" ? null :
                        <Typography
                            onClick={updateCard}
                            variant='body2'
                            sx={{ mt: '1rem', textDecoration: "underline", cursor: "pointer", display: "flex", justifyContent: "end" }}
                            color={'primary'}
                        >
                            {cardUpdateLoad ?
                                <CircularProgress
                                    size={20}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: "primary"
                                    }}
                                /> :
                                t('agentdashboard.subscription.details.updatecard')}
                        </Typography>
                    }

                    {/* DISCOUNT & PAY */}
                    <Grid container spacing={'1rem'} sx={{ mt: '0.1rem' }}>
                        {/* New Upgrade */}
                        <Grid item sm={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                            <TextField size='small' variant='outlined'
                                value={discount} onChange={(e) => setDiscount(e.target.value)} fullWidth placeholder={t('agentdashboard.subscription.packagecards.discountplaceholder')}
                                InputProps={{
                                    endAdornment: <InputAdornment position='end'>
                                        <Button disableElevation variant='contained' color='secondary'
                                            onClick={() => { discount.length > 0 && postSubscription(packageSelect?.code, true) }}
                                            sx={{
                                                textTransform: 'none', mr: '-.85rem',
                                                height: '2.5rem',
                                                borderRadius: '0 2px 2px 0',
                                                fontSize: '.8rem'
                                            }}
                                            disabled={loading || discount.length < 1}
                                        >
                                            {t('agentdashboard.subscription.packagecards.discountbutton')}
                                        </Button>
                                    </InputAdornment>
                                }} />
                        </Grid>
                        <Grid item sm={6} >
                            <TextField size='small' value={amountPayable} variant='outlined' fullWidth placeholder={t('agentdashboard.subscription.packagecards.payplaceholder')}
                                InputProps={{
                                    endAdornment: <InputAdornment position='end'>
                                        <Button variant='contained' color='primary'
                                            disableElevation sx={{
                                                textTransform: 'none',
                                                height: '2.5rem', mr: '-.8rem',
                                                fontSize: '.8rem',
                                                borderRadius: '0 2px 2px 0'
                                            }}
                                            onClick={() => window.location.pathname === "/broker/onboard" ? postSubscription(packageSelect?.code, false) : setPrompt(true)}
                                            disabled={loading || amountPayable.length < 1}
                                        >
                                            {loading ? <CircularProgress
                                                size={20}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    color: "white"
                                                }}
                                            /> : amountPayable === 0 ? t('agentdashboard.subscription.packagecards.confirm') : t('agentdashboard.subscription.packagecards.paybutton')}
                                        </Button>
                                    </InputAdornment>
                                }} />
                        </Grid>
                    </Grid>

                    <Dialog open={prompt} onClose={() => { setPrompt(false) }} fullWidth maxWidth='xs'>
                        <DialogContent>
                            <Typography sx={{ textAlign: "center", paddingTop: "20px" }}>{t('agentdashboard.addlisting.alerts.changeplan')}</Typography>
                        </DialogContent>
                        <DialogActions sx={{ padding: "0 20px 20px 0" }}>
                            <RoundButton onClick={() => setPrompt(false)} text={t('agentdashboard.addlisting.button.cancel')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
                            <RoundButton
                                onClick={() => loading || postSubscription(packageSelect?.code, false)}
                                text={loading ? (
                                    <CircularProgress
                                        size={20}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: "black"
                                        }}
                                    />
                                )
                                    : t('agentdashboard.addlisting.button.proceed')}
                                disableElevation
                                variant={'outlined'}
                                sx={{ padding: '.5rem 1.5rem' }}
                            />
                        </DialogActions>
                    </Dialog>
                </>
            }
        </>
    )
}

export default PackageItem