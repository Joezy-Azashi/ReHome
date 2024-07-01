import { Close, HomeOutlined, Tune } from '@mui/icons-material'
import { alpha, Avatar, Backdrop, Box, Button, ButtonGroup, styled, FormLabel, TextField, Card, CardContent, Divider, Grid, IconButton, MenuItem, Popover, Typography, Pagination } from '@mui/material'
import { grey } from '@mui/material/colors'
import React, { useEffect, useState } from 'react'
import Api from '../../api/api'
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment/moment'
import PageLoader from '../../components/PageLoader'
import NoList from '../../assets/images/noListing.png'

const radius = '10px'

const StyledLabel = styled(FormLabel)(({ theme }) => ({
    fontSize: '.9rem'
}))

const Stats = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false)
    const [leadType, setLeadType] = useState()
    const [anchorEl, setAnchorEl] = useState(null);
    const openLead = Boolean(anchorEl);
    const [pageNumber, setpageNumber] = useState(1);
    const [stat, setStat] = useState()
    const [leads, setLeads] = useState()
    const [leadStatus, setLeadStatus] = useState(false)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const viewLead = (val) => {
        setLeadType(val)
        setOpen(true)
    }

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget)
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const closeSingleLead = (data) => {
        Api().patch(`leads/${data?.id}`, { closed: !data?.closed })
            .then((res) => {
                setLeads(leads.map(x => x.id === data.id ? { ...x, closed: !data?.closed } : { ...x }))
            })
            .catch((error) => {
            })
    }

    const getLeads = (id) => {
        Api().get(`users/${id}/leads`, { params: { filter: { order: "createdAt desc" } } })
            .then((res) => {
                setLeads(res?.data)
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
            })
    }

    const getChartData = (id) => {
        Api().get(`users/${id}/statistics`, {
            params:
            {
                filter:
                {
                    where:
                    {
                        and: [
                            { date: { gte: moment().year(selectedYear).startOf('year').toISOString() } },
                            { date: { lte: moment().year(selectedYear).endOf('year').toISOString() } },
                        ]
                    }
                }
            }
        })
            .then((res) => {
                setData(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((mon, i) => ({
                    name: mon,
                    [t('agentdashboard.stats.chartreach')]: res?.data.reduceRight((t, stat) => moment(stat.date) > moment().year(selectedYear).month(i).startOf('month') && moment(stat.date) < moment().month(i).endOf('month') ? t + stat.views : t, 0),
                    [t('agentdashboard.stats.chartclicks')]: res?.data.reduceRight((t, stat) => moment(stat.date) > moment().year(selectedYear).month(i).startOf('month') && moment(stat.date) < moment().month(i).endOf('month') ? t + stat.clicks : t, 0),
                })))
            })
            .catch((error) => {
            })
    }

    useEffect(() => {
        Api().get("/me")
            .then((response) => {
                //get summary
                Api().get(`/users/${response?.data?.id}/statistics/summary`)
                    .then((res) => {
                        setStat(res?.data)
                    })

                getChartData(response?.data?.id)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedYear])

    useEffect(() => {
        setLoading(true)
        Api().get("/me")
            .then((response) => {
                getLeads(response?.data?.id)
            })
    }, [pageNumber])

    const generateArrayOfYears = () => {
        var max = new Date().getFullYear()
        var min = max - 63
        var years = []

        for (var i = max; i >= min; i--) {
            years.push(i)
        }
        return years
    }

    const formatMessage = (data) =>{
        try{
            const jsonVal = JSON.parse(data.message);
            return jsonVal
        }catch(e){
            return data.message;
        }
    }

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6} lg={2}>
                        <Card elevation={0} sx={{ borderRadius: radius, height: "100%" }}>
                            <CardContent sx={{ padding: '0 !important', display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <Box sx={{ background: '#fff', padding: '30px 0 17px 0 ', textAlign: 'center', color: '#fff' }}>
                                    <HomeOutlined color='primary' sx={{ fontSize: '5rem', padding: '1rem', border: '1px solid #599902', borderRadius: '50px' }} />
                                    <Typography color='primary' mt={1} variant='h6'>{t('agentdashboard.stats.myproperties')}</Typography>
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    borderTop: `1px solid ${grey[200]}`,
                                    '& span': {
                                        flex: 1,
                                        padding: '1rem',
                                        textAlign: 'center',
                                        background: '#fff',
                                    }
                                }}>
                                    <span>
                                        <Typography variant='h5' sx={{ fontWeight: 600 }}>{stat?.forRent ? stat?.forRent : 0}</Typography>
                                        <Typography sx={{ fontSize: '.8rem', whiteSpace: "nowrap" }}>{t('agentdashboard.stats.forrent')}</Typography>
                                    </span>
                                    <Divider orientation='vertical' flexItem />
                                    <span>
                                        <Typography variant='h5' sx={{ fontWeight: 600 }}>{stat?.forSale ? stat?.forSale : 0}</Typography>
                                        <Typography sx={{ fontSize: '.8rem', whiteSpace: "nowrap" }}>{t('agentdashboard.stats.forsale')}</Typography>
                                    </span>
                                </Box>

                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={3}>
                        <Box sx={{ height: '100%', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: 2 }}>
                            <Card elevation={0} sx={{ borderRadius: radius, width: '100%' }}>
                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', padding: '0 !important' }}>
                                    <Box sx={{ padding: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <Typography sx={{ fontWeight: 600 }}>{t('agentdashboard.stats.clicksthisweek')}</Typography>
                                    </Box>
                                    <Box sx={{ width: '6rem', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1.4rem', bgcolor: 'primary.main', color: '#fff', marginLeft: 'auto' }}>
                                        <Typography sx={{ fontWeight: 600 }} variant='h5'>{stat?.clicksWeek ? stat?.clicksWeek : 0}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                            <Card elevation={0} sx={{ borderRadius: radius, width: '100%' }}>
                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', padding: '0 !important' }}>
                                    <Box sx={{ padding: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <Typography sx={{ fontWeight: 600 }}>{t('agentdashboard.stats.viewsthisweek')}</Typography>
                                    </Box>
                                    <Box sx={{ width: '6rem', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1.4rem', bgcolor: 'secondary.main', color: '#fff', marginLeft: 'auto' }}>
                                        <Typography sx={{ fontWeight: 600 }} variant='h5'>{stat?.viewsWeek ? stat?.viewsWeek : 0}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                            <Card elevation={0} sx={{ borderRadius: radius, width: '100%' }}>
                                <CardContent sx={{ display: 'flex', padding: '0 !important' }}>
                                    <Box sx={{ padding: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <Typography sx={{ fontWeight: 600 }}>{t('agentdashboard.stats.allleads')}</Typography>
                                    </Box>
                                    <Box sx={{ width: '6rem', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1.4rem', bgcolor: '#000', color: '#fff', marginLeft: 'auto' }}>
                                        <Typography sx={{ fontWeight: 600 }} variant='h5'>{stat?.allLeads ? stat?.allLeads : 0}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={3.5}>
                        <Card elevation={0} sx={{ borderRadius: radius, height: '100%' }}>
                            <CardContent sx={{ padding: '0 !important' }}>
                                <Box mt={1}>
                                    <StyledLabel sx={{ paddingLeft: "15px" }} mt={10}>{t('agentdashboard.stats.year')}: </StyledLabel>
                                    <TextField
                                        select
                                        value={selectedYear}
                                        onChange={(e) => { setSelectedYear(e.target.value) }}
                                        InputProps={{ disableUnderline: true }}
                                        sx={{ paddingLeft: "10px", '& .MuiSelect-select': { paddingTop: '2px' }, '& .MuiInputBase-root': { fontSize: "0.9rem" } }}
                                        variant='standard'
                                    >
                                        {generateArrayOfYears().map((el) => {
                                            return (
                                                <MenuItem key={el} value={el}>{el}</MenuItem>
                                            )
                                        })}
                                    </TextField>
                                </Box>

                                <Box>
                                    <ResponsiveContainer width="95%" height={220}>
                                        <BarChart
                                            data={data}
                                            margin={{
                                                top: 20,
                                                right: 14,
                                                left: 0,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey={t('agentdashboard.stats.chartclicks')} stackId="a" fill="#5B9C00" />
                                            <Bar dataKey={t('agentdashboard.stats.chartreach')} stackId="a" fill="#C8C8C8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={3.5}>
                        <Card elevation={0} sx={{ borderRadius: radius, height: '100%' }}>
                            <CardContent sx={{ padding: '0 !important' }}>
                                <Box>
                                    <Box sx={{ bgcolor: 'tertiary.main', color: '#fff', padding: '20px' }}>
                                        <Typography textAlign={'center'} variant='h6'>{t('agentdashboard.stats.alltimestat')}</Typography>
                                    </Box>
                                    <Grid container spacing={1} mt={.01} sx={{ padding: ".5rem" }}>
                                        <Grid item xs={4}>
                                            <Box sx={{ bgcolor: '#F0F0F0', borderRadius: '8px', padding: "15px 5px" }}>
                                                <Typography textAlign={'center'} variant='h5' color={'tertiary.main'}>CPC</Typography>
                                                <Typography textAlign={'center'} variant='body2' sx={{ fontSize: '.7rem' }} dangerouslySetInnerHTML={{ __html: t('agentdashboard.stats.click') }} />
                                                <Divider sx={{ bgcolor: grey[200], my: '10px' }} />
                                                <Typography textAlign={'center'} variant='h5'>&#x20B5;{stat?.CPC ? (stat?.CPC)?.toFixed() : 0}</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Box sx={{ bgcolor: '#F0F0F0', borderRadius: '8px', padding: "15px 5px" }}>
                                                <Typography textAlign={'center'} variant='h5' color={'tertiary.main'}>CPL</Typography>
                                                <Typography textAlign={'center'} variant='body2' sx={{ fontSize: '.7rem' }} dangerouslySetInnerHTML={{ __html: t('agentdashboard.stats.lead') }} />
                                                <Divider sx={{ bgcolor: grey[200], my: '10px' }} />
                                                <Typography textAlign={'center'} variant='h5'>&#x20B5;{stat?.CPL ? (stat?.CPL)?.toFixed() : 0}</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Box sx={{ bgcolor: '#F0F0F0', borderRadius: '8px', padding: "15px 5px" }}><Typography textAlign={'center'} variant='h5' color={'tertiary.main'}>CPR</Typography>
                                                <Typography textAlign={'center'} variant='body2' sx={{ fontSize: '.7rem' }} dangerouslySetInnerHTML={{ __html: t('agentdashboard.stats.view') }} />
                                                <Divider sx={{ bgcolor: grey[200], my: '10px' }} />
                                                <Typography textAlign={'center'} variant='h5'>&#x20B5;{stat?.CPV ? (stat?.CPV)?.toFixed() : 0}</Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Leads */}
                <Card sx={{ mt: '3rem !important', borderRadius: radius, height: 'auto' }} elevation={0}>
                    <CardContent sx={{ padding: '2rem', position: 'relative' }}>
                        <Box mb={3} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant='h6' sx={{ fontWeight: 600 }}>{!leadStatus ? t('agentdashboard.stats.leads.newleads') : t('agentdashboard.stats.leads.closedleads')} {leads?.length === undefined ? '-' : `(${leads?.filter((el) => el.closed === leadStatus)?.length})`}</Typography>
                            <IconButton sx={{ borderRadius: '5px', border: `1px solid ${grey[300]}` }} onClick={handleClick}><Tune fontSize='small' /></IconButton>
                        </Box>
                        <Popover open={openLead} anchorEl={anchorEl} onClose={handleClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right', }}
                        >
                            <Box sx={{ padding: '10px' }}>
                                <MenuItem sx={{ borderRadius: '5px' }} onClick={() => { setLeadStatus(false); handleClose() }}><Typography variant='body2'>{t('agentdashboard.stats.leads.newleads')} {leads?.length === undefined ? '-' : `(${leads?.filter((el) => el.closed === false)?.length})`}</Typography></MenuItem>
                                <MenuItem sx={{ borderRadius: '5px' }} onClick={() => { setLeadStatus(true); handleClose() }}><Typography variant='body2'>{t('agentdashboard.stats.leads.closedleads')} {leads?.length === undefined ? '-' : `(${leads?.filter((el) => el.closed === true)?.length})`}</Typography></MenuItem>
                            </Box>
                        </Popover>

                        <Grid container spacing={3}>
                            {
                                loading ?
                                    <Grid item xs={12}>
                                        <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }} mb={15}>
                                            <PageLoader />
                                        </Box>
                                    </Grid>
                                    :
                                    leads?.filter((el) => el.closed === leadStatus) < 1 ?
                                        <Grid item xs={12}>
                                            <Box sx={{ padding: '2rem 5rem' }}>
                                                <img src={NoList} width='15%' style={{ margin: '0 auto', marginTop: '3rem', display: 'block' }} alt='no-listing' />
                                                <Typography mt={3} mb={3} textAlign={'center'}>{t('agentdashboard.stats.noleads')}</Typography>
                                            </Box>
                                        </Grid>
                                        :
                                        leads?.filter((el) => el.closed === leadStatus)?.map((el, index) => {
                                            return (
                                                <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
                                                    <Box sx={{ borderRadius: radius, border: `1px solid ${grey[300]}`, mt: '2rem' }}>
                                                        <Box sx={{ padding: '3rem' }}>
                                                            <Avatar src={el?.avatar} sx={{ width: '5.5rem', height: '5.5rem', margin: '0 auto', mt: '-5rem', mb: '1.5rem' }} />
                                                            <Typography noWrap textAlign={'center'} sx={{ fontWeight: 600, fontSize: '1.2rem' }}>{(el?.firstName || el?.data?.firstName) + " " + (el?.lastName || el?.data?.lastName)}</Typography>
                                                            <Typography sx={{ width: "100%", height: "2.5rem", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflowWrap: "break-word" }} textAlign={'center'} variant='body2' color='GrayText'>{localStorage.getItem('i18nextLng') === 'en' ? el?.body?.en : el?.body?.fr}</Typography>
                                                        </Box>

                                                        <ButtonGroup disableElevation fullWidth size='medium'>
                                                            <Button variant='contained'
                                                                color='primary' fullWidth
                                                                sx={{ textTransform: 'none', borderRadius: '0 0 0 10px', padding: '1rem 0' }}
                                                                onClick={() => viewLead(el)}
                                                            >
                                                                {t('agentdashboard.stats.leads.view')}
                                                            </Button>

                                                            <Button variant='contained'
                                                                color='secondary' fullWidth
                                                                sx={{ textTransform: 'none', borderRadius: '0 0 10px 0' }}
                                                                onClick={() => { closeSingleLead(el) }}
                                                            >
                                                                {el.closed ? t('agentdashboard.stats.leads.open') : t('agentdashboard.stats.leads.close')}
                                                            </Button>
                                                        </ButtonGroup>

                                                    </Box>
                                                </Grid>
                                            )
                                        })
                            }

                        </Grid>
                    </CardContent>
                </Card>
            </Box>

            {/* LEADS BACKDROPS */}
            <Backdrop open={open} sx={{ bgcolor: alpha('#03254C', .9) }}>
                {
                    <Box sx={{ padding: '1rem 2rem 2rem 2rem', bgcolor: '#fff', borderRadius: '20px', width: { xs: "85%", md: '40%' }, position: 'relative', maxHeight: "30rem", overflowY: "auto", overflowX: "hidden" }}>
                        <Box sx={{ display: "flex", justifyContent: 'end' }}>
                            <IconButton onClick={() => setOpen(false)}><Close sx={{ color: '#000' }} /></IconButton>
                        </Box>
                        <Typography variant='h5' gutterBottom color={'secondary'} sx={{ fontWeight: 600 }} textAlign='center'>{localStorage.getItem('i18nextLng') === 'en' ? leadType?.title?.en : leadType?.title?.fr}</Typography>

                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={5} mb={2}>
                                <Typography color={'textSecondary'}>{t('agentdashboard.stats.leads.backdrop.fullname')}:</Typography>
                            </Grid>
                            <Grid item xs={12} sm={7} mb={2}>
                                <Typography sx={{ textOverflow: "ellipsis", width: "100%", whiteSpace: "nowrap", overflow: "hidden" }}>{(leadType?.firstName || leadType?.data?.firstName) + " " + (leadType?.lastName || leadType?.data?.lastName)}</Typography>
                            </Grid>

                            <Grid item xs={12} sm={5} mb={2}>
                                <Typography color={'textSecondary'}>{t('agentdashboard.stats.leads.backdrop.email')}:</Typography>
                            </Grid>
                            <Grid item xs={12} sm={7} mb={2}>
                                <Typography sx={{ textOverflow: "ellipsis", width: "100%", whiteSpace: "nowrap", overflow: "hidden" }}>{leadType?.data?.email}</Typography>
                            </Grid>

                            <Grid item xs={12} sm={5} mb={2}>
                                <Typography color={'textSecondary'}>{t('agentdashboard.stats.leads.backdrop.phone')}:</Typography>
                            </Grid>
                            <Grid item xs={12} sm={7} mb={2}>
                                <Typography>{leadType?.phone || leadType?.data?.phone_number}</Typography>
                            </Grid>

                            {['property_request'].includes(leadType?.type) ? 
                            <>
                                <Grid item xs={12} sm={5} mb={2}>
                                    <Typography color={'textSecondary'}>{t('agentdashboard.stats.leads.backdrop.location')}:</Typography>
                                </Grid>
                                <Grid item xs={12} sm={7} mb={2}>
                                    <Typography sx={{ textOverflow: "ellipsis", width: "100%", whiteSpace: "nowrap", overflow: "hidden" }}>
                                        {formatMessage(leadType?.data).location}
                                    </Typography>
                                </Grid>
                            </>: 
                            <></>}

                            <Grid item xs={5} mb={2}>
                                <Typography color={'textSecondary'}>{t('agentdashboard.stats.leads.backdrop.message')}:</Typography>
                            </Grid>

                            <Grid item xs={7} mb={2}>
                                <Typography>{['property_request', 'find_an_agent'].includes(leadType?.type) 
                                ? formatMessage(leadType?.data).note
                                : localStorage.getItem('i18nextLng') === 'en' ? leadType?.body?.en : leadType?.body?.fr}</Typography>
                                <Typography>{}</Typography>
                            </Grid>


                            {['property_request'].includes(leadType?.type) && (formatMessage(leadType?.data)?.availability || 
                            formatMessage(leadType?.data)?.payment_plan || formatMessage(leadType?.data)?.tour) ? 
                            <>
                                <Grid item xs={12} sm={12} mb={12}>
                                    <ul class='flex items-center' style={{flexDirection: 'column'}}>
                                        <li><Typography color={'textSecondary'}>{t('agentdashboard.stats.leads.backdrop.question')}</Typography></li>
                                        <li><Typography>{formatMessage(leadType?.data).availability ? t('offplan.singleoffplan.sidebar.contact.p6') : ''}</Typography></li>
                                        <li><Typography>{formatMessage(leadType?.data).payment_plan ? t('offplan.singleoffplan.sidebar.contact.p7') : ''}</Typography></li>
                                        <li><Typography>{formatMessage(leadType?.data).tour ? t('offplan.singleoffplan.sidebar.contact.p8') : ''}</Typography></li>
                                    </ul>
                                </Grid>
                            </>: 
                            <></>}
                        </Grid>
                    </Box>
                }
            </Backdrop>
        </>


    )
}

export default Stats