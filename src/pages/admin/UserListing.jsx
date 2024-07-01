import { AddCircle, ArrowCircleLeftOutlined, Close, Publish, FileDownload, RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, CircularProgress, Card, TextField, InputAdornment, Pagination, CardContent, Checkbox, Grid, Stack, styled, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Tooltip, alpha, Backdrop, Button, ButtonGroup, Hidden } from '@mui/material'
import { grey } from '@mui/material/colors'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import Api from '../../api/api'
import RoundButton from '../../components/Buttons/RoundButton'
import moment from "moment";
import { getUserType } from '../../services/auth'
import { EditOutlined } from '@mui/icons-material';
import PageLoader from '../../components/PageLoader'
import cnavLogo from '../../assets/images/christmas_navLogo.png';
import navLogo from '../../assets/images/navLogo.png';
import NoList from '../../assets/images/noListing.png'
import { useSnackbar } from 'notistack'

const WrapCard = styled(Card)(({ theme }) => ({
    borderRadius: '10px',
    height: '85vh'
}))
const FlexBox = styled(Box)(({ theme }) => ({
    background: alpha('#599902', .13),
    margin: '0 auto',
    border: `1px solid ${grey[200]}`,
    borderRadius: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 1.5rem',
    gap: '5px',
    width: { xs: "100%", md: "80%", lg: "100%" },
    cursor: 'pointer',
    minHeight: "55px"
}))

const maxHeight = 600
const pageLimit = 10

function UserListing({ id , user}) {

    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const [listing, setlisting] = useState()
    const [pageNumber, setpageNumber] = useState(1);
    const [count, setCount] = useState(1)
    const [openPromote, setOpenPromote] = useState(false)
    const [drafts, setDrafts] = useState()
    const [selectedIds, setSelectedIds] = useState([])
    const [active, setActive] = useState()
    const [propertySelect, setPropertySelect] = useState([])
    const [tab, setTab] = useState('1')
    const [discount, setDiscount] = useState('')
    const [subTotal, setSubTotal] = useState()
    const [total, setTotal] = useState()
    const [tabIndex, setTabIndex] = useState('1')
    const [loading, setLoading] = useState(false)
    const [pageLoader, setPageLoader] = useState(false)
    const [publishLoading, setPublishLoading] = useState(false)
    const [unpublishLoading, setUnpublishLoading] = useState(false)
    const navigate = useNavigate()

    const tabHandler = (e, val) => {
        setpageNumber(1)
        setTabIndex(val)
    }

    const getSelection = (e, data) => {
        if (e.target.checked) {
            setSelectedIds((prevState) => [...prevState, e.target.value])
            setPropertySelect((prev) => [...prev, data])
        } else {
            setSelectedIds(selectedIds.filter(item => item !== e.target.value));
            setPropertySelect(propertySelect.filter(item => item?.id !== e.target.value))
        }
    }

    const addListing = (user, propertyType) => {
        if (propertyType === "development") {
            navigate('/admin/off-plan-listing', { state: { user } });
        } else {
            navigate('/admin/newlisting', { state: { user } });
        }
    } 

    const editListing = (id, propertyType, draft) => {
        if (draft && propertyType === "development") {
            navigate('/admin/edit-off-plan', { state: { id, mode: "editMode", type: "draft" } });
        } else if (draft && propertyType !== "development") {
            navigate('/admin/edit-listing', { state: { id, mode: "editMode", type: "draft" } });
        } else if (propertyType === "development") {
            navigate('/admin/edit-off-plan', { state: { id, mode: "editMode" } });
        } else {
            navigate('/admin/edit-listing', { state: { id, mode: "editMode" } });
        }
    }

    const getListings = (wherequery = {}) => {
        setlisting()
        Api().get(`users/${id}/rehome-properties`, {
            params: {
                filter: {
                    limit: pageLimit, skip: (pageNumber - 1) * pageLimit,
                    where: wherequery,
                    order: ["createdAt DESC"]
                }
            }
        })
            .then((response) => {
                setlisting(response?.data)
            })
            .catch((error) => { })

        Api().get(`users/${id}/rehome-properties/count`, {
            params: { where: wherequery }
        })
            .then((res) => {
                setCount(res?.data?.count)
            })
    }

    const getDrafts = () => {
        setlisting()
        Api().get("/me")
            .then((response) => {
                Api().get(`users/${response?.data?.id}/drafts`, {
                    params: {
                        filter: {
                            limit: pageLimit, skip: (pageNumber - 1) * pageLimit,
                            where: {
                                modelName: 'rehome_property'
                            },
                            order: ["createdAt DESC"]
                        }
                    }
                })
                    .then((response) => {
                        setDrafts(response?.data)
                    })
                    .catch((error) => { })

                Api().get(`users/${response?.data?.id}/drafts/count`)
                    .then((res) => {
                        setCount(res?.data?.count)
                    })
            })
    }

    const publishProperty = (state) => {
        if (selectedIds.length < 1) {
            enqueueSnackbar(t('agentdashboard.listing.selectitem'), { variant: 'warning' })
        } else {

            if (state) {
                setPublishLoading(true)
            } else {
                setUnpublishLoading(true)
            }
            Api().patch(`users/${id}/rehome-properties`, { published: state }, {
                params: { where: { id: { inq: selectedIds } } }
            })
                .then((res) => {
                    setPublishLoading(false)
                    setUnpublishLoading(false)
                    if (state) {
                        enqueueSnackbar(t('agentdashboard.listing.publishalert'), { variant: 'success' })
                    } else {
                        enqueueSnackbar(t('agentdashboard.listing.removepublish'), { variant: 'success' })
                    }

                    listing.forEach(element => {
                        element.published = selectedIds.includes(element.id) ? state : element.published
                    });
                    setSelectedIds([])
                    setPropertySelect([])
                })
                .catch((error) => {
                    setPublishLoading(false)
                    setUnpublishLoading(false)
                    setSelectedIds([])
                    setPropertySelect([])
                    enqueueSnackbar((error?.response?.data?.error?.message), { variant: 'error' });
                })
        }
    }

    const onSelect = (name) => {
        setActive(name)
    }

    const postPromotion = (state, action) => {
        if (action === "viewCart") {
            setPageLoader(true)
        } else {
            setLoading(true)
        }
        setLoading(true)
        Api().post('/sponsorships/promote', {
            propertyIds: selectedIds,
            promotionType: active,
            summary: state,
            discountCode: discount,
        })
            .then((res) => {
                setLoading(false)
                setPageLoader(false)

                if (action === 'viewCart') {
                    setTab('2')
                } else if (action === "apply") {

                } else {
                    setSelectedIds([])
                    setPropertySelect([])
                }

                if (state === true) {
                    if (action === "apply") {
                        setTotal(res?.data?.data?.promotion_amount / 100)
                    } else {
                        setSubTotal(res?.data?.data?.promotion_amount / 100)
                        setTotal(res?.data?.data?.promotion_amount / 100)
                    }
                } else {
                    navigate("//" + res?.data?.data?.authorization_url.replace(/^https?:\/\//, ''));
                }
            })
            .catch((error) => {
                setLoading(false)
                setPageLoader(false)
                enqueueSnackbar(error?.response?.data?.error?.message, { variant: 'error' })
                setSelectedIds([])
                setPropertySelect([])
            })
    }

    useEffect(() => {
        if (tabIndex === "1") {
            getListings()
        } else if (tabIndex === "2") {
            getListings({ transactionType: "rent", propertyStatus: "available", propertyType: { neq: "development" } })
        } else if (tabIndex === "3") {
            getListings({ transactionType: "sale", propertyStatus: "available", propertyType: { neq: "development" } })
        } else if (tabIndex === "4") {
            getListings({ propertyType: "development" })
        } else if (tabIndex === "5") {
            getListings({ propertyStatus: { nin: ['available'] } })
        } else if (tabIndex === "6") {
            getDrafts()
        } else if (tabIndex === "7") {
            getListings({ sponsored: "true" })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber, tabIndex])

    return (
        <>
            <WrapCard elevation={0} sx={{ height: "100%" }}>
                <CardContent sx={{ height: '100%', padding: '2.5rem' }}>
                    <Hidden mdUp>
                        <Box sx={{ width: '100%', bgcolor: 'tertiary.main', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30 }}>
                            <ButtonGroup variant='text' fullWidth>
                                {(user?.userType === "agent" || user?.userType === "developer" || user?.userType === "realtor") && <Button onClick={() => addListing(user,'apartment')} startIcon={<AddCircle fontSize='small' sx={{ color: '#fff', }} />} fullWidth sx={{ textTransform: 'none', color: '#fff', height: '3.5rem' }}>{t('agentdashboard.home.addlisting')}</Button>}
                                {(user?.userType === "developer" || user?.userType === "realtor") && <Button onClick={() => addListing(user,'development')} variant='contained' disableElevation color='primary' startIcon={<AddCircle fontSize='small' sx={{ color: '#fff', }} />} fullWidth sx={{ textTransform: 'none', color: '#fff', height: '3.5rem' }}>{t('agentdashboard.home.addoffplan')}</Button>}
                            </ButtonGroup>
                        </Box>
                    </Hidden>
                    <Grid container spacing={3} sx={{ height: '100%' }}>
                        <Grid item xs={12} sm={12} md={12} lg={10}>
                            <TabContext value={tabIndex} >
                                <TabList variant='scrollable' style={{
                                    '& > div > div': { justifyContent: 'space-between' }
                                }} onChange={tabHandler} sx={{ borderBottom: '1px solid lightgrey' }}>
                                    <Tab color='primary' sx={{ textTransform: 'none' }} disableRipple label={t('agentdashboard.listing.titles.tab1')} value="1" />
                                    <Tab color='primary' sx={{ textTransform: 'none' }} disableRipple label={t('agentdashboard.listing.titles.tab2')} value="2" />
                                    <Tab color='primary' sx={{ textTransform: 'none' }} disableRipple label={t('agentdashboard.listing.titles.tab3')} value="3" />
                                    {user?.userType === "agent" ? null : <Tab color='primary' sx={{ textTransform: 'none' }} disableRipple label={t('agentdashboard.listing.titles.tab4')} value="4" />}
                                    <Tab color='primary' sx={{ textTransform: 'none' }} disableRipple label={t('agentdashboard.listing.titles.tab5')} value="5" />
                                    <Tab color='primary' sx={{ textTransform: 'none' }} disableRipple label={t('agentdashboard.listing.titles.tab6')} value="6" />
                                    <Tab color='primary' sx={{ textTransform: 'none' }} disableRipple label={t('agentdashboard.listing.titles.tab7')} value="7" />
                                </TabList>

                                {/* All Listings */}
                                <TabPanel sx={{ padding: '2rem 0 0 0' }} value='1'>
                                    {/* Tables */}
                                    <TableContainer sx={{ maxHeight: maxHeight, border: `1px solid ${grey[200]}`, borderRadius: '15px' }} className="noScrollBar">
                                        <Table stickyHeader >
                                            <TableHead>
                                                <TableRow sx={{ whiteSpace: "nowrap" }}>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.date')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.rentedsold')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.name')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.type')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.advertising')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.status')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.edit')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.select')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody id="top">
                                                {
                                                    listing === undefined ?
                                                        <TableRow>
                                                            <TableCell colSpan={7}>
                                                                <PageLoader />
                                                            </TableCell>
                                                        </TableRow>
                                                        :
                                                        listing.length <= 0 ?
                                                            <TableRow>
                                                                <TableCell colSpan={7}>
                                                                    <Box sx={{ padding: '2rem 5rem' }}>
                                                                        <img src={NoList} width='15%' style={{ margin: '0 auto', display: 'block' }} alt='no-listing' />
                                                                        <Typography mt={3} mb={3} textAlign={'center'}>{t('agentdashboard.home.nolisting')}</Typography>
                                                                        <RoundButton text={t('agentdashboard.home.addlisting')} variant='contained' color={'primary'} size='large' disableElevation
                                                                            sx={{ padding: '.4rem 1rem', display: 'block', margin: '0 auto' }} onClick={() => addListing(user,'apartment')} />
                                                                    </Box>
                                                                </TableCell>
                                                            </TableRow>
                                                            :
                                                            listing.map((el) => {
                                                                return (
                                                                    <TableRow key={el?.id}>
                                                                        <TableCell>
                                                                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                                                {moment(`${el?.createdAt}`).format("L")}
                                                                                {el?.published ?
                                                                                    <Box sx={{
                                                                                        bgcolor: 'primary.main',
                                                                                        display: 'flex',
                                                                                        justifyContent: 'center', alignItems: 'center',
                                                                                        height: "16px",
                                                                                        maxWidth: "70px"
                                                                                    }}>
                                                                                        <Typography textAlign={'center'} sx={{
                                                                                            padding: '0 4px', borderRadius: '3px',
                                                                                            fontSize: '.65rem', fontWeight: 600,
                                                                                            color: '#fff'
                                                                                        }}>{t('agentdashboard.listing.published')}</Typography>
                                                                                    </Box> : null}
                                                                            </Box>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                                                {el?.unavailableAt ? moment(`${el?.unavailableAt}`).format("L") : ""}
                                                                            </Box>
                                                                        </TableCell>
                                                                        <TableCell sx={{ display: 'flex', gap: '.6rem' }}>
                                                                            {/* <Avatar src={el?.pictures[0]} alt="" /> */}
                                                                            <Stack sx={{ maxWidth: "15rem" }}>
                                                                                <Typography noWrap sx={{ fontWeight: 600, fontSize: '1rem' }} >{el?.name}</Typography>
                                                                                <Typography noWrap sx={{ fontSize: '.85rem' }} color='GrayText'>{el?.description}</Typography>
                                                                            </Stack>
                                                                        </TableCell>
                                                                        <TableCell sx={{ textTransform: "capitalize" }}>{el?.propertyType}</TableCell>
                                                                        <TableCell>{el?.sponsored === false ? "Organic" : "Sponsored"}</TableCell>
                                                                        <TableCell sx={{ textTransform: "capitalize" }}>{el?.propertyStatus}</TableCell>
                                                                        <TableCell>
                                                                            <Tooltip arrow title={t('agentdashboard.listing.edit')}>
                                                                                <IconButton onClick={() => editListing(el?.id, el?.propertyType)}>
                                                                                    <EditOutlined />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </TableCell>
                                                                        <TableCell><Checkbox value={el?.id} checked={selectedIds.includes(el?.id)} onChange={(e) => getSelection(e, el)} fontSize='small' color='primary' /></TableCell>
                                                                    </TableRow>
                                                                )
                                                            })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </TabPanel>

                                {/* For Rent */}
                                <TabPanel value='2' sx={{ padding: '2rem 0 0 0' }}>
                                    {/* Tables */}
                                    <TableContainer sx={{ maxHeight: maxHeight, border: `1px solid ${grey[200]}`, borderRadius: '15px' }}>
                                        <Table stickyHeader >
                                            <TableHead>
                                                <TableRow sx={{ whiteSpace: "nowrap" }}>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.date')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.name')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.type')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.advertising')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.status')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.edit')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.select')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    listing === undefined ?
                                                        <TableRow>
                                                            <TableCell colSpan={7}>
                                                                <PageLoader />
                                                            </TableCell>
                                                        </TableRow>
                                                        :
                                                        listing.length <= 0 ?
                                                            <TableRow>
                                                                <TableCell colSpan={7}>
                                                                    <Box sx={{ padding: '3rem 5rem' }}>
                                                                        <img src={NoList} width='15%' style={{ margin: '0 auto', marginTop: '3rem', display: 'block' }} alt='no-listing' />
                                                                        <Typography mt={3} mb={3} textAlign={'center'}>{t('agentdashboard.home.nolisting')}</Typography>
                                                                    </Box>
                                                                </TableCell>
                                                            </TableRow>
                                                            :
                                                            listing?.map(el => {
                                                                return (
                                                                    <TableRow key={el?.id}>
                                                                        <TableCell>
                                                                            {moment(`${el?.createdAt}`).format("L")}
                                                                            {el?.published ?
                                                                                <Box sx={{
                                                                                    bgcolor: 'primary.main',
                                                                                    display: 'flex',
                                                                                    justifyContent: 'center', alignItems: 'center',
                                                                                    height: "16px",
                                                                                    maxWidth: "70px"
                                                                                }}>
                                                                                    <Typography textAlign={'center'} sx={{
                                                                                        padding: '0 4px', borderRadius: '3px',
                                                                                        fontSize: '.65rem', fontWeight: 600,
                                                                                        color: '#fff'
                                                                                    }}>{t('agentdashboard.listing.published')}</Typography>
                                                                                </Box> : null}
                                                                        </TableCell>
                                                                        <TableCell sx={{ display: 'flex', gap: '.6rem' }}>
                                                                            {/* <Avatar src={el?.pictures[0]} alt="" /> */}
                                                                            <Stack sx={{ maxWidth: "15rem" }}>
                                                                                <Typography noWrap sx={{ fontWeight: 600, fontSize: '1rem' }} >{el?.name}</Typography>
                                                                                <Typography noWrap sx={{ fontSize: '.85rem' }} color='GrayText'>{el?.description}</Typography>
                                                                            </Stack>
                                                                        </TableCell>
                                                                        <TableCell sx={{ textTransform: "capitalize" }}>{el?.propertyType}</TableCell>
                                                                        <TableCell>{el?.sponsored === false ? "Organic" : "Sponsored"}</TableCell>
                                                                        <TableCell sx={{ textTransform: "capitalize" }}>{el?.propertyStatus}</TableCell>
                                                                        <TableCell>
                                                                            <IconButton onClick={() => editListing(el?.id, el?.propertyType)}>
                                                                                <EditOutlined />
                                                                            </IconButton>
                                                                        </TableCell>
                                                                        <TableCell><Checkbox value={el?.id} checked={selectedIds.includes(el?.id)} onChange={(e) => getSelection(e, el)} fontSize='small' color='primary' /></TableCell>
                                                                    </TableRow>
                                                                )
                                                            })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </TabPanel>

                                {/* For Sale */}
                                <TabPanel value='3' sx={{ padding: '2rem 0 0 0' }}>
                                    {/* Tables */}
                                    <TableContainer sx={{ maxHeight: maxHeight, border: `1px solid ${grey[200]}`, borderRadius: '15px' }}>
                                        <Table stickyHeader >
                                            <TableHead>
                                                <TableRow sx={{ whiteSpace: "nowrap" }}>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.date')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.name')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.type')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.advertising')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.status')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.edit')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.select')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    listing === undefined ?
                                                        <TableRow>
                                                            <TableCell colSpan={7}>
                                                                <PageLoader />
                                                            </TableCell>
                                                        </TableRow>
                                                        :
                                                        listing.length <= 0 ?
                                                            <TableRow>
                                                                <TableCell colSpan={7}>
                                                                    <Box sx={{ padding: '3rem 5rem' }}>
                                                                        <img src={NoList} width='15%' style={{ margin: '0 auto', marginTop: '3rem', display: 'block' }} alt='no-listing' />
                                                                        <Typography mt={3} mb={3} textAlign={'center'}>{t('agentdashboard.home.nolisting')}</Typography>
                                                                    </Box>
                                                                </TableCell>
                                                            </TableRow>
                                                            :
                                                            listing?.map(el => {
                                                                return (
                                                                    <TableRow key={el?.id}>
                                                                        <TableCell>
                                                                            {moment(`${el?.createdAt}`).format("L")}
                                                                            {el?.published ?
                                                                                <Box sx={{
                                                                                    bgcolor: 'primary.main',
                                                                                    display: 'flex',
                                                                                    justifyContent: 'center', alignItems: 'center',
                                                                                    height: "16px",
                                                                                    maxWidth: "70px"
                                                                                }}>
                                                                                    <Typography textAlign={'center'} sx={{
                                                                                        padding: '0 4px', borderRadius: '3px',
                                                                                        fontSize: '.65rem', fontWeight: 600,
                                                                                        color: '#fff'
                                                                                    }}>{t('agentdashboard.listing.published')}</Typography>
                                                                                </Box> : null}
                                                                        </TableCell>
                                                                        <TableCell sx={{ display: 'flex', gap: '.6rem' }}>
                                                                            {/* <Avatar src={el?.pictures[0]} alt="" /> */}
                                                                            <Stack sx={{ maxWidth: "15rem" }}>
                                                                                <Typography noWrap sx={{ fontWeight: 600, fontSize: '1rem' }} >{el?.name}</Typography>
                                                                                <Typography noWrap sx={{ fontSize: '.85rem' }} color='GrayText'>{el?.description}</Typography>
                                                                            </Stack>
                                                                        </TableCell>
                                                                        <TableCell sx={{ textTransform: "capitalize" }}>{el?.propertyType}</TableCell>
                                                                        <TableCell>{el?.sponsored === false ? "Organic" : "Sponsored"}</TableCell>
                                                                        <TableCell sx={{ textTransform: "capitalize" }}>{el?.propertyStatus}</TableCell>
                                                                        <TableCell>
                                                                            <IconButton onClick={() => editListing(el?.id, el?.propertyType)}>
                                                                                <EditOutlined />
                                                                            </IconButton>
                                                                        </TableCell>
                                                                        <TableCell><Checkbox value={el?.id} checked={selectedIds.includes(el?.id)} onChange={(e) => getSelection(e, el)} fontSize='small' color='primary' /></TableCell>
                                                                    </TableRow>
                                                                )
                                                            })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </TabPanel>

                                {user?.userType === "agent" ? null :
                                    <>
                                        {/* off-plan */}
                                        < TabPanel value='4' sx={{ padding: '2rem 0 0 0' }}>
                                            {/* Tables */}
                                            <TableContainer sx={{ maxHeight: maxHeight, border: `1px solid ${grey[200]}`, borderRadius: '15px' }} className="noScrollBar">
                                                <Table stickyHeader >
                                                    <TableHead>
                                                        <TableRow sx={{ whiteSpace: "nowrap" }}>
                                                            <TableCell>{t('agentdashboard.listing.tablehead.date')}</TableCell>
                                                            <TableCell>{t('agentdashboard.listing.tablehead.name')}</TableCell>
                                                            <TableCell>{t('agentdashboard.listing.tablehead.type')}</TableCell>
                                                            <TableCell>{t('agentdashboard.listing.tablehead.advertising')}</TableCell>
                                                            {/* <TableCell>{t('agentdashboard.listing.tablehead.status')}</TableCell> */}
                                                            <TableCell>{t('agentdashboard.listing.tablehead.edit')}</TableCell>
                                                            <TableCell>{t('agentdashboard.listing.tablehead.select')}</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            listing === undefined ?
                                                                <TableRow>
                                                                    <TableCell colSpan={7}>
                                                                        <PageLoader />
                                                                    </TableCell>
                                                                </TableRow>
                                                                :
                                                                listing.length <= 0 ?
                                                                    <TableRow>
                                                                        <TableCell colSpan={7}>
                                                                            <Box sx={{ padding: '3rem 5rem' }}>
                                                                                <img src={NoList} width='15%' style={{ margin: '0 auto', marginTop: '3rem', display: 'block' }} alt='no-listing' />
                                                                                <Typography mt={3} mb={3} textAlign={'center'}>{t('agentdashboard.home.nolisting')}</Typography>
                                                                            </Box>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    :
                                                                    listing?.map(el => {
                                                                        return (
                                                                            <TableRow key={el?.id}>
                                                                                <TableCell>
                                                                                    {moment(`${el?.createdAt}`).format("L")}
                                                                                    {el?.published ?
                                                                                        <Box sx={{
                                                                                            bgcolor: 'primary.main',
                                                                                            display: 'flex',
                                                                                            justifyContent: 'center', alignItems: 'center',
                                                                                            height: "16px",
                                                                                            maxWidth: "70px"
                                                                                        }}>
                                                                                            <Typography textAlign={'center'} sx={{
                                                                                                padding: '0 4px', borderRadius: '3px',
                                                                                                fontSize: '.65rem', fontWeight: 600,
                                                                                                color: '#fff'
                                                                                            }}>{t('agentdashboard.listing.published')}</Typography>
                                                                                        </Box> : null}
                                                                                </TableCell>
                                                                                <TableCell sx={{ display: 'flex', gap: '.6rem' }}>
                                                                                    {/* <Avatar src={el?.pictures[0]} alt="" /> */}
                                                                                    <Stack sx={{ maxWidth: "15rem" }}>
                                                                                        <Typography noWrap sx={{ fontWeight: 600, fontSize: '1rem' }} >{el?.name}</Typography>
                                                                                        <Typography noWrap sx={{ fontSize: '.85rem' }} color='GrayText'>{el?.description}</Typography>
                                                                                    </Stack>
                                                                                </TableCell>
                                                                                <TableCell sx={{ textTransform: "capitalize" }}>{el?.propertyType}</TableCell>
                                                                                <TableCell>{el?.sponsored === false ? "Organic" : "Sponsored"}</TableCell>
                                                                                {/* <TableCell sx={{ textTransform: "capitalize" }}>{el?.propertyStatus}</TableCell> */}
                                                                                <TableCell>
                                                                                    <IconButton onClick={() => editListing(el?.id, el?.propertyType)}>
                                                                                        <EditOutlined />
                                                                                    </IconButton>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Checkbox value={el?.id} checked={selectedIds.includes(el?.id)} onChange={(e) => getSelection(e, el)} fontSize='small' color='primary' />
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        )
                                                                    })
                                                        }
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </TabPanel>
                                    </>
                                }

                                {/* Past Transasctions */}
                                <TabPanel value='5' sx={{ padding: '2rem 0 0 0' }}>
                                    {/* Tables */}
                                    <TableContainer sx={{ maxHeight: maxHeight, border: `1px solid ${grey[200]}`, borderRadius: '15px' }} className="noScrollBar">
                                        <Table stickyHeader >
                                            <TableHead>
                                                <TableRow sx={{ whiteSpace: "nowrap" }}>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.date')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.name')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.type')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.advertising')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.status')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.edit')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.select')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    listing === undefined ?
                                                        <TableRow>
                                                            <TableCell colSpan={7}>
                                                                <PageLoader />
                                                            </TableCell>
                                                        </TableRow>
                                                        :
                                                        listing.length <= 0 ?
                                                            <TableRow>
                                                                <TableCell colSpan={7}>
                                                                    <Box sx={{ padding: '3rem 5rem' }}>
                                                                        <img src={NoList} width='15%' style={{ margin: '0 auto', marginTop: '3rem', display: 'block' }} alt='no-listing' />
                                                                        <Typography mt={3} mb={3} textAlign={'center'}>{t('agentdashboard.home.nolisting')}</Typography>
                                                                    </Box>
                                                                </TableCell>
                                                            </TableRow>
                                                            :
                                                            listing?.map(el => {
                                                                return (
                                                                    <TableRow key={el?.id}>
                                                                        <TableCell>
                                                                            {moment(`${el?.createdAt}`).format("L")}
                                                                            {el?.published ?
                                                                                <Box sx={{
                                                                                    bgcolor: 'primary.main',
                                                                                    display: 'flex',
                                                                                    justifyContent: 'center', alignItems: 'center',
                                                                                    height: "16px",
                                                                                    maxWidth: "70px"
                                                                                }}>
                                                                                    <Typography textAlign={'center'} sx={{
                                                                                        padding: '0 4px', borderRadius: '3px',
                                                                                        fontSize: '.65rem', fontWeight: 600,
                                                                                        color: '#fff'
                                                                                    }}>{t('agentdashboard.listing.published')}</Typography>
                                                                                </Box> : null}
                                                                        </TableCell>
                                                                        <TableCell sx={{ display: 'flex', gap: '.6rem' }}>
                                                                            {/* <Avatar src={el?.pictures[0]} alt="" /> */}
                                                                            <Stack sx={{ maxWidth: "15rem" }}>
                                                                                <Typography noWrap sx={{ fontWeight: 600, fontSize: '1rem' }} >{el?.name}</Typography>
                                                                                <Typography noWrap sx={{ fontSize: '.85rem' }} color='GrayText'>{el?.description}</Typography>
                                                                            </Stack>
                                                                        </TableCell>
                                                                        <TableCell sx={{ textTransform: "capitalize" }}>{el?.propertyType}</TableCell>
                                                                        <TableCell>{el?.sponsored === false ? "Organic" : "Sponsored"}</TableCell>
                                                                        <TableCell sx={{ textTransform: "capitalize" }}>{el?.propertyStatus}</TableCell>
                                                                        <TableCell>
                                                                            <IconButton onClick={() => editListing(el?.id, el?.propertyType)}>
                                                                                <EditOutlined />
                                                                            </IconButton>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Checkbox value={el?.id} checked={selectedIds.includes(el?.id)} onChange={(e) => getSelection(e, el)} fontSize='small' color='primary' />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </TabPanel>

                                {/* Draft */}
                                <TabPanel value='6' sx={{ padding: '2rem 0 0 0' }}>
                                    {/* Tables */}
                                    <TableContainer sx={{ maxHeight: maxHeight, border: `1px solid ${grey[200]}`, borderRadius: '15px' }}>
                                        <Table stickyHeader >
                                            <TableHead>
                                                <TableRow sx={{ whiteSpace: "nowrap" }}>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.date')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.name')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.type')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.advertising')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.status')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.edit')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    drafts === undefined ?
                                                        <TableRow>
                                                            <TableCell colSpan={7}>
                                                                <PageLoader />
                                                            </TableCell>
                                                        </TableRow>
                                                        :
                                                        drafts.length <= 0 ?
                                                            <TableRow>
                                                                <TableCell colSpan={7}>
                                                                    <Box sx={{ padding: '3rem 5rem' }}>
                                                                        <img src={NoList} width='15%' style={{ margin: '0 auto', marginTop: '3rem', display: 'block' }} alt='no-listing' />
                                                                        <Typography mt={3} mb={3} textAlign={'center'}>{t('agentdashboard.home.nolisting')}</Typography>
                                                                    </Box>
                                                                </TableCell>
                                                            </TableRow>
                                                            :
                                                            drafts?.map(el => {
                                                                return (
                                                                    <TableRow key={el?.id}>
                                                                        <TableCell>{moment(`${el?.createdAt}`).format("L")}</TableCell>
                                                                        <TableCell sx={{ display: 'flex', gap: '.6rem' }}>
                                                                            {/* <Avatar src={el?.modelObject?.pictures ? el?.modelObject?.pictures[0] : null} alt="" /> */}
                                                                            <Stack sx={{ maxWidth: "15rem" }}>
                                                                                <Typography noWrap sx={{ fontWeight: 600, fontSize: '1rem' }} >{el?.modelObject?.name}</Typography>
                                                                                <Typography noWrap sx={{ fontSize: '.85rem', height: "18px" }} color='GrayText'>{el?.modelObject?.description}</Typography>
                                                                            </Stack>
                                                                        </TableCell>
                                                                        <TableCell sx={{ textTransform: "capitalize" }}>{el?.modelObject?.propertyType}</TableCell>
                                                                        <TableCell>{el?.sponsored ? "Sponsored" : "Organic"}</TableCell>
                                                                        <TableCell sx={{ textTransform: "capitalize" }}>{el?.modelObject?.propertyStatus}</TableCell>
                                                                        <TableCell>
                                                                            <IconButton onClick={() => editListing(el?.id, el?.modelObject?.propertyType, 'draft')}>
                                                                                <EditOutlined />
                                                                            </IconButton>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </TabPanel>

                                {/* Sponsored Listings */}
                                <TabPanel value='7' sx={{ padding: '2rem 0 0 0' }}>
                                    {/* Tables */}
                                    <TableContainer sx={{ maxHeight: maxHeight, border: `1px solid ${grey[200]}`, borderRadius: '15px' }} className="noScrollBar">
                                        <Table stickyHeader >
                                            <TableHead>
                                                <TableRow sx={{ whiteSpace: "nowrap" }}>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.date')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.name')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.type')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.advertising')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.status')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.edit')}</TableCell>
                                                    <TableCell>{t('agentdashboard.listing.tablehead.select')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    listing === undefined ?
                                                        <TableRow>
                                                            <TableCell colSpan={7}>
                                                                <PageLoader />
                                                            </TableCell>
                                                        </TableRow>
                                                        :
                                                        listing.length <= 0 ?
                                                            <TableRow>
                                                                <TableCell colSpan={7}>
                                                                    <Box sx={{ padding: '3rem 5rem' }}>
                                                                        <img src={NoList} width='15%' style={{ margin: '0 auto', marginTop: '3rem', display: 'block' }} alt='no-listing' />
                                                                        <Typography mt={3} mb={3} textAlign={'center'}>{t('agentdashboard.home.nolisting')}</Typography>
                                                                    </Box>
                                                                </TableCell>
                                                            </TableRow>
                                                            :
                                                            listing?.map(el => {
                                                                return (
                                                                    <TableRow key={el?.id}>
                                                                        <TableCell>{moment(`${el?.createdAt}`).format("L")}</TableCell>
                                                                        <TableCell sx={{ display: 'flex', gap: '.6rem' }}>
                                                                            {/* <Avatar src={el?.pictures[0]} alt="" /> */}
                                                                            <Stack sx={{ maxWidth: "15rem" }}>
                                                                                <Typography noWrap sx={{ fontWeight: 600, fontSize: '1rem' }} >{el?.name}</Typography>
                                                                                <Typography noWrap sx={{ fontSize: '.85rem' }} color='GrayText'>{el?.description}</Typography>
                                                                            </Stack>
                                                                        </TableCell>
                                                                        <TableCell sx={{ textTransform: "capitalize" }}>{el?.propertyType}</TableCell>
                                                                        <TableCell>{el?.sponsored === false ? "Organic" : "Sponsored"}</TableCell>
                                                                        <TableCell sx={{ textTransform: "capitalize" }}>{el?.propertyStatus}</TableCell>
                                                                        <TableCell>
                                                                            <IconButton onClick={() => editListing(el?.id, el?.propertyType)}>
                                                                                <EditOutlined />
                                                                            </IconButton>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Checkbox value={el?.id} checked={selectedIds.includes(el?.id)} onChange={(e) => getSelection(e, el)} fontSize='small' color='primary' />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            })
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </TabPanel>

                                <Box mt={'2rem'} display='flex' justifyContent={'flex-end'}>
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
                            </TabContext>

                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={2} sx={{ height: { xs: '0', md: '70%', lg: '100%' }, display: { xs: 'block', sm: 'flex', lg: 'flex' }, flexDirection: { xs: 'row', sm: 'row', lg: 'column' }, justifyContent: { xs: 'auto', sm: 'auto', lg: 'start' } }}>
                            <Box mb={{ xs: 25, sm: 10, md: 2, lg: 3 }} mt={{ xs: -14, sm: -5, md: 2, lg: 3 }}
                                sx={{ width: '100%', display: { xs: 'block', sm: 'flex', md: 'block', lg: 'block' }, gap: '1rem' }}>
                                {/* Select All */}
                                {/* <FlexBox sx={{ marginTop: "3.6rem" }} onClick={handleSelectAll}>
                                    <CheckCircle color='primary' fontSize='small' />
                                    <Typography variant='body2' textAlign={'center'} sx={{ lineHeight: 1 }}>{t('agentdashboard.listing.selectall')}</Typography>
                                </FlexBox> */}

                                {/* Publish Selected */}
                                <FlexBox sx={{ marginTop: { xs: "1rem", md: "-1.2rem", lg: "3.6rem" } }} onClick={() => publishProperty(true)}>
                                    <Publish color='primary' fontSize='small' />
                                    <Typography variant='body2' textAlign={'center'} sx={{ lineHeight: 1 }}>
                                        {publishLoading ? <CircularProgress
                                            size={20}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                color: "primary",
                                                margin: "3px 0"
                                            }}
                                        /> : t('agentdashboard.listing.publishselected')}
                                    </Typography>
                                </FlexBox>

                                {/* Unpublish Selected */}
                                <FlexBox sx={{ marginTop: "1rem" }} onClick={() => publishProperty(false)}>
                                    <FileDownload color='primary' fontSize='small' />
                                    <Typography variant='body2' textAlign={'center'} sx={{ lineHeight: 1 }}>
                                        {unpublishLoading ? <CircularProgress
                                            size={20}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                color: "primary",
                                                margin: "3px 0"
                                            }}
                                        /> : t('agentdashboard.listing.unpublishselected')}
                                    </Typography>
                                </FlexBox>

                                {/* Promote Selected */}
                                {/* <FlexBox onClick={() => selectedIds.length < 1 ? enqueueSnackbar(t('agentdashboard.listing.selectitem'), { variant: 'warning' }) : propertySelect.filter(p => p.sponsored).length > 0 ? enqueueSnackbar(t('agentdashboard.listing.cantpromote'), { variant: 'warning' }) : setOpenPromote(true)} sx={{ marginTop: "1rem" }}>
                                    <Sell color='primary' fontSize='small' />
                                    <Typography variant='body2' textAlign={'center'} sx={{ lineHeight: 1 }}>{t('agentdashboard.listing.promoteselected')}</Typography>
                                </FlexBox> */}
                            </Box>
                            <Hidden mdDown>
                                <Box mt={5}>
                                    {/* Add Listing Button */}
                                    { (user?.userType === "developer" || user?.userType === "realtor") &&
                                        <span onClick={() => addListing(user, "development")} >
                                            <RoundButton
                                                startIcon={<AddCircle fontSize='small' sx={{ color: '#fff' }} />}
                                                sx={{ color: '#fff', whiteSpace: "nowrap" }}
                                                size={'small'}
                                                fullWidth
                                                text={t('agentdashboard.home.addoffplan')}
                                                color='primary'
                                                variant={'contained'}
                                                disableElevation
                                            />
                                        </span>
                                    }

                                    {/* Add Listing Button */}
                                    {(user?.userType === "agent" || user?.userType === "developer" || user?.userType === "realtor") &&
                                        <span onClick={() => addListing(user, "apartment")}>
                                            <RoundButton
                                                startIcon={<AddCircle fontSize='small' sx={{ color: '#fff', }} />}
                                                sx={{ color: '#fff', marginTop: "1rem" }}
                                                size={'small'}
                                                fullWidth
                                                text={t('agentdashboard.home.addlisting')}
                                                color='tertiary'
                                                variant={'contained'}
                                                disableElevation
                                            />
                                        </span>
                                    }
                                </Box>
                            </Hidden>
                        </Grid>
                    </Grid>
                </CardContent>
            </WrapCard>

            {/* PROMOTE LISTING */}
            <Backdrop open={openPromote} sx={{ bgcolor: alpha('#03254C', .9), zIndex: 90, }}>
                <IconButton onClick={() => { setOpenPromote(false); setDiscount(''); setTotal(); setSubTotal(); setTab('1'); setActive() }} sx={{ position: 'absolute', top: { xs: '8%', sm: '9%', md: '26%', lg: '3%' }, right: { xs: '2%', sm: '2%', md: '5%', lg: '12%' } }}><Close sx={{ color: '#fff' }} /></IconButton>
                <Box my={'2rem'}
                    padding={{ xs: '2rem', sm: '2rem', md: '2rem', lg: '3rem' }}
                    sx={{
                        width: { xs: '80%', sm: '80%', md: '80%', lg: '70%' },
                        height: { xs: '70vh', sm: '80vh', md: 'auto', lg: 'auto' },
                        overflowY: { xs: 'scroll', sm: 'scroll', md: 'unset', lg: 'auto' },
                        overflowX: "hidden", bgcolor: '#fff', borderRadius: '15px', position: 'relative'
                    }}>
                    <Grid container spacing={{ xs: 1, sm: '2rem', md: '4rem', lg: '5rem' }}>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <img src={moment().month() === 11 ? cnavLogo : navLogo} width='32%' alt='nav-logo' />
                            <Typography mb={2} mt={'2.5rem'} variant='h5' color={'secondary'} sx={{ fontWeight: 700 }}>{t('agentdashboard.listing.promotion.title')}</Typography>

                            <Box mt={'1.5rem'}>
                                <Typography>{t('agentdashboard.listing.promotion.paragraph1')}</Typography>
                                <Typography>{t('agentdashboard.listing.promotion.paragraph2')}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            {tab === '1' &&
                                <>
                                    <Card onClick={() => onSelect('starter')} elevation={0} sx={{ border: theme => active === 'starter' ? `2px solid ${theme.palette.primary.main}` : `1px solid ${grey[400]}`, borderRadius: '20px', mb: '1rem', cursor: "pointer" }}>
                                        <CardContent>
                                            <Box sx={{ display: { xs: 'block', sm: 'flex', md: 'flex', lg: 'flex' }, justifyContent: 'flex-start', gap: '1rem' }}>
                                                {active === "starter" ? <RadioButtonChecked color='primary' /> : <RadioButtonUnchecked sx={{ color: grey[500] }} />}
                                                <Typography variant='h6' mt={'-2px'}>{t('agentdashboard.listing.promotion.packages.starter.title')}</Typography>
                                                <span style={{ marginLeft: 'auto' }}>
                                                    <Typography color={'primary'} sx={{ fontWeight: 600 }}>GHS 100/{t('agentdashboard.listing.promotion.packages.per')}</Typography>
                                                </span>
                                            </Box>
                                            <Box mt={2} sx={{ marginLeft: { xs: 0, sm: 0, md: '1.5rem', lg: '2rem' } }}>
                                                <Typography variant='body2' sx={{ fontSize: '.9rem' }} color='GrayText' dangerouslySetInnerHTML={{ __html: t('agentdashboard.listing.promotion.packages.starter.note') }} />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                    <Card onClick={() => onSelect('standard')} elevation={0} sx={{ border: theme => active === 'standard' ? `2px solid ${theme.palette.primary.main}` : `1px solid ${grey[400]}`, mb: '1rem', borderRadius: '20px', cursor: "pointer" }}>
                                        <CardContent>
                                            <Box sx={{ display: { xs: 'block', sm: 'flex', md: 'flex', lg: 'flex' }, justifyContent: 'flex-start', gap: '1rem' }}>
                                                {active === "standard" ? <RadioButtonChecked color='primary' /> : <RadioButtonUnchecked sx={{ color: grey[500] }} />}
                                                <Typography variant='h6' mt={'-2px'}>{t('agentdashboard.listing.promotion.packages.standard.title')}</Typography>
                                                <span style={{ marginLeft: 'auto' }}>
                                                    <Typography color={'primary'} sx={{ fontWeight: 600 }}>GHS 190/{t('agentdashboard.listing.promotion.packages.per')}</Typography>
                                                    <Typography variant='body2' sx={{ fontSize: '.7rem', color: "#EF8408" }}>{t('agentdashboard.listing.promotion.packages.save')} GHS 70</Typography>
                                                </span>
                                            </Box>
                                            <Box mt={2} sx={{ marginLeft: { xs: 0, sm: 0, md: '1.5rem', lg: '2rem' } }}>
                                                <Typography variant='body2' sx={{ fontSize: '.9rem' }} color='GrayText' dangerouslySetInnerHTML={{ __html: t('agentdashboard.listing.promotion.packages.standard.note') }} />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                    <Card onClick={() => onSelect('pro')} elevation={0} sx={{ border: theme => active === 'pro' ? `2px solid ${theme.palette.primary.main}` : `1px solid ${grey[400]}`, borderRadius: '20px', mb: '1rem', cursor: "pointer" }}>
                                        <CardContent>
                                            <Box sx={{ display: { xs: 'block', sm: 'flex', md: 'flex', lg: 'flex' }, justifyContent: 'flex-start', gap: '1rem' }}>
                                                {active === "pro" ? <RadioButtonChecked color='primary' /> : <RadioButtonUnchecked sx={{ color: grey[500] }} />}
                                                <Typography variant='h6' mt={'-2px'}>{t('agentdashboard.listing.promotion.packages.pro.title')}</Typography>
                                                <span style={{ marginLeft: 'auto' }}>
                                                    <Typography color={'primary'} sx={{ fontWeight: 600 }}>GHS 270/{t('agentdashboard.listing.promotion.packages.per')}</Typography>
                                                    <Typography variant='body2' sx={{ fontSize: '.7rem', color: "#EF8408" }} >{t('agentdashboard.listing.promotion.packages.save')} GHS 90</Typography>
                                                </span>
                                            </Box>
                                            <Box mt={2} sx={{ marginLeft: { xs: 0, sm: 0, md: '1.5rem', lg: '2rem' } }}>
                                                <Typography variant='body2' sx={{ fontSize: '.9rem' }} color='GrayText' dangerouslySetInnerHTML={{ __html: t('agentdashboard.listing.promotion.packages.pro.note') }} />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                    <Button onClick={() => { postPromotion(true, 'viewCart') }} disabled={active === undefined} fullWidth disableElevation variant='contained' color='primary' sx={{ textTransform: 'none', color: '#fff', height: '3rem', borderRadius: '10px' }}>{t('agentdashboard.listing.promotion.packages.viewcart')}</Button>
                                </>
                            }

                            {
                                pageLoader ?
                                    <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <PageLoader />
                                    </Box>
                                    :
                                    tab === '2' &&
                                    <Box>
                                        <Typography variant='h6' color={'secondary'} textAlign="center">
                                            {t('agentdashboard.listing.promotion.summary.title')}
                                        </Typography>

                                        <Typography variant='body2' color={'secondary'} mb={2}>{t('agentdashboard.listing.promotion.summary.item')}</Typography>

                                        {propertySelect?.map((el) => {
                                            return (
                                                <Box sx={{ border: "1px solid #C3C3C3", marginBottom: "8px", borderRadius: "15px" }}>
                                                    <Typography variant='body2' sx={{ padding: "10px" }}>{el?.name}</Typography>
                                                </Box>
                                            )
                                        })}

                                        <Grid container mt={3} alignItems={'center'}>
                                            <Grid item xs={12} md={12}>
                                                <Typography variant='body2' sx={{ color: "#FF0808", whiteSpace: "nowrap" }}>{t('agentdashboard.listing.promotion.summary.entercode')}</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={12}>
                                                <TextField
                                                    size='small'
                                                    variant='outlined'
                                                    value={discount}
                                                    onChange={(e) => setDiscount(e.target.value)}
                                                    fullWidth
                                                    placeholder={t('agentdashboard.listing.promotion.summary.promocode')}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position='end'>
                                                            <Button disableElevation variant='contained' color='secondary'
                                                                sx={{
                                                                    textTransform: 'none', mr: '-.85rem',
                                                                    height: '2.5rem',
                                                                    borderRadius: '0 2px 2px 0',
                                                                    fontSize: '.8rem'
                                                                }}
                                                                disabled={loading || discount.length < 1}
                                                                onClick={() => postPromotion(true, 'apply')}
                                                            >
                                                                {loading ? <CircularProgress
                                                                    size={20}
                                                                    sx={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        color: "white"
                                                                    }}
                                                                /> :
                                                                    t('agentdashboard.listing.promotion.summary.apply')
                                                                }
                                                            </Button>
                                                        </InputAdornment>
                                                    }} />
                                            </Grid>
                                        </Grid>

                                        <Grid container mt={3} alignItems={'center'}>
                                            <Grid item xs={12} md={6}>
                                                <Box sx={{ display: "flex", justifyContent: "start", gap: "10px" }}>
                                                    <Typography variant='h7' color={'secondary'} sx={{ whiteSpace: "nowrap", fontWeight: "700" }}>{t('agentdashboard.listing.promotion.summary.subtotal')}</Typography>
                                                    <Typography variant='h7' color={'primary'} sx={{ whiteSpace: "nowrap", fontWeight: "700" }}>GHS {subTotal}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Box sx={{ display: "flex", justifyContent: "end", gap: "10px" }}>
                                                    <Typography variant='h7' color={'secondary'} sx={{ whiteSpace: "nowrap", fontWeight: "700" }}>{t('agentdashboard.listing.promotion.summary.total')}</Typography>
                                                    <Typography variant='h7' color={'primary'} sx={{ whiteSpace: "nowrap", fontWeight: "700" }}>GHS {total}</Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>

                                        <Box mt={3} mb={2} onClick={() => setTab('1')} sx={{ display: "flex", justifyContent: "start", alignItems: "center", cursor: "pointer" }}>
                                            <IconButton><ArrowCircleLeftOutlined color='primary' fontSize='small' /></IconButton>
                                            <Typography variant='body2' color="primary">{t('agentdashboard.listing.promotion.summary.back')}</Typography>
                                        </Box>

                                        <Button
                                            onClick={() => postPromotion(false)}
                                            fullWidth
                                            disableElevation
                                            variant='contained'
                                            color='primary'
                                            sx={{ textTransform: 'none', color: '#fff', height: '3rem', borderRadius: '10px' }}
                                            disabled={loading || total === undefined}
                                        >
                                            {loading ? <CircularProgress
                                                size={20}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    color: "white"
                                                }}
                                            /> :
                                                t('agentdashboard.listing.promotion.summary.proceed')
                                            }
                                        </Button>
                                    </Box>
                            }
                        </Grid>
                    </Grid>
                </Box>
            </Backdrop>
        </>
    )
}

export default UserListing