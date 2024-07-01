import { AddCircle, Edit, HomeOutlined } from '@mui/icons-material'
import { Avatar, Box, Button, Card, CardContent, Divider, Grid, Hidden, IconButton, Skeleton, styled, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import React, { useContext, useEffect, useState } from 'react'
import GroupSocials from '../../components/Social/GroupSocials'
import PropertyItem from '../../components/PropertyItem'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import Api from '../../api/api'
import NoList from '../../assets/images/noListing.png'
import RoundButton from '../../components/Buttons/RoundButton'
import PageLoader from '../../components/PageLoader'
import RateContext from '../../contexts/rateContext'
import { getUserType, isLoggedIn } from '../../services/auth'
import { useSnackbar } from 'notistack';
import OffPlanItem from '../../components/OffPlanItem'

const radius = '10px'

const WrapCard = styled(Card)(({ theme }) => ({
    borderRadius: '10px'
}))

const Home = () => {
    const navigate = useNavigate()
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const ExContext = useContext(RateContext);

    const [listing, setlisting] = useState([])
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState()
    const [load, setLoad] = useState(false)
    const [favs, setFavs] = useState([])
    const [stat, setStat] = useState()
    let el = user

    useEffect(() => {
        setLoading(true)
        Api().get("/me", {
            params: {
                filter: {
                    include: [
                        {
                            relation: "user",
                            scope: { include: [{ relation: "agencies" }] }
                        }
                    ]
                }
            }
        })
            .then((response) => {
                Api().get(`users/${response?.data?.id}/rehome-properties`, { params: { filter: { include: [{ relation: "user" }], order: "createdAt desc" } } })
                    .then((response) => {
                        setLoading(false)
                        setlisting(response?.data?.splice(0, 4))
                    })
                    .catch((error) => { })

                Api().get(`/users/${response?.data?.id}/statistics/summary`)
                    .then((res) => {
                        setStat(res?.data)
                    })
            })
    }, [])

    const getUserInfo = () => {
        Api().get("/me", {
            params: {
                filter: {
                    include: [
                        {
                            relation: "user",
                            scope: { include: [{ relation: "agencies" }] }
                        }
                    ]
                }
            }
        })
            .then((response) => {
                setUser(response?.data)
                setFavs(response?.data?.wishlist?.rehomePropertyIds)
            })
    }

    useEffect(() => {
        getUserInfo()
    }, [])

    // Add to wishlist
    const toggleWishlist = (e, id) => {
        e.preventDefault()
        const exists = user?.wishlist?.rehomePropertyIds.includes(id)

        if (isLoggedIn()) {
            if (exists) {
                const newArray = user?.wishlist?.rehomePropertyIds.filter((item) => item !== id)

                setLoad(true)
                Api().patch(`wishlists/${user?.wishlist?.id}`, { rehomePropertyIds: newArray })
                    .then((res) => {
                        setLoad(false)
                        enqueueSnackbar(t('dashboard.wishlist.removed'), { variant: 'success' });
                        setFavs(favs.filter(item => item !== e.target.value));
                        getUserInfo()
                    })
            } else {
                user?.wishlist?.rehomePropertyIds.push(id)

                setLoad(true)
                Api().patch(`wishlists/${user?.wishlist?.id}`, { rehomePropertyIds: user?.wishlist?.rehomePropertyIds })
                    .then((res) => {
                        setLoad(false)
                        enqueueSnackbar(t('dashboard.wishlist.added'), { variant: 'success' });
                        setFavs((prevState) => [...prevState, id])
                    })
            }
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: '3rem', padding: 0 }}>
            <Box sx={{ flex: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6} lg={2.5}>
                        <WrapCard elevation={0}>
                            <CardContent sx={{ padding: '2rem', textAlign: 'center', position: 'relative' }}>
                                <IconButton onClick={() => navigate('/broker/profile')} sx={{ position: 'absolute', top: '5%', right: '5%', bgcolor: grey[200] }}><Edit sx={{ fontSize: '1rem' }} /></IconButton>
                                <Avatar src={ExContext?.thumbnail(user?.avatar)} sx={{ width: '6rem', height: '6rem', margin: '0 auto' }} />
                                {
                                    user ?
                                        <Typography mt={1} mb={0} variant='h6' sx={{ fontWeight: 600, fontSize: '1rem' }} noWrap>{user?.firstName || ""} {user?.lastName || ""}</Typography>
                                        :
                                        <Skeleton animation={'wave'} sx={{ mb: 1 }} height={'25px'} />
                                }
                                <Box sx={{ height: "53px", display: "flex", alignItems: "center", justifyContent: "center" }}><GroupSocials user={user} gap={'.5rem'} color={'primary.main'} hoverColor={'tertiary.main'} sx={{ marginBottom: '0' }} /></Box>
                                <span onClick={() => navigate(`/brokers/${user?.firstName?.toLowerCase()}/${el?.id}`, { state: { el } })}>
                                    <RoundButton size={'small'} text={t('agentdashboard.home.viewmyprofile')} variant='contained' disableElevation sx={{ padding: '.3rem 1rem' }} />
                                </span>
                            </CardContent>
                        </WrapCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={2.5}>
                        <WrapCard elevation={0} sx={{ borderRadius: '10px', bgcolor: '#fff', height: '100%' }}>
                            <CardContent sx={{ padding: '0 !important' }}>
                                <Box sx={{ background: '#fff', padding: '2rem', textAlign: 'center', color: '#fff' }}>
                                    <HomeOutlined color='primary' sx={{ fontSize: '5rem', padding: '1rem', border: '1px solid #599902', borderRadius: '50px' }} />
                                    <Typography color='primary' mt={1} variant='h6'>{t('agentdashboard.home.myproperties')}</Typography>
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    gap: '1px',
                                    marginTop: '0px',
                                    borderTop: `1px solid ${grey[200]}`,
                                    '& span': {
                                        flex: 1,
                                        padding: '1rem',
                                        textAlign: 'center',
                                        background: '#fff',
                                        cursor: 'pointer',
                                    }
                                }}>
                                    <span onClick={() => navigate('/broker/listings')}>
                                        <Typography variant='h5' sx={{ fontWeight: 600 }}>{stat?.forRent ? stat?.forRent : 0}</Typography>
                                        <Typography sx={{ fontSize: '.8rem' }}>{t('agentdashboard.home.forrent')}</Typography>
                                    </span>
                                    <Divider orientation='vertical' flexItem />
                                    <span onClick={() => navigate('/broker/listings')}>
                                        <Typography variant='h5' sx={{ fontWeight: 600 }}>{stat?.forSale ? stat?.forSale : 0}</Typography>
                                        <Typography sx={{ fontSize: '.8rem' }}>{t('agentdashboard.home.forsale')}</Typography>
                                    </span>
                                </Box>

                            </CardContent>
                        </WrapCard>
                    </Grid>
                    {/* <Hidden mdDown> */}
                    <Grid item xs={12} sm={6} md={6} lg={3.5}>
                        <Box sx={{ height: '100%', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: 2 }}>
                            <Card elevation={0} sx={{ borderRadius: radius, width: '100%' }}>
                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', padding: '0 !important' }}>
                                    <Box sx={{ padding: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <Typography sx={{ fontWeight: 600 }}>{t('agentdashboard.home.clicksthisweek')}</Typography>
                                    </Box>
                                    <Box sx={{ width: '6rem', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1.4rem', bgcolor: 'primary.main', color: '#fff', marginLeft: 'auto' }}>
                                        <Typography sx={{ fontWeight: 600 }} variant='h5'>{stat?.clicksWeek ? stat?.clicksWeek : 0}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                            <Card elevation={0} sx={{ borderRadius: radius, width: '100%' }}>
                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', padding: '0 !important' }}>
                                    <Box sx={{ padding: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <Typography sx={{ fontWeight: 600 }}>{t('agentdashboard.home.viewsthisweek')}</Typography>
                                    </Box>
                                    <Box sx={{ width: '6rem', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1.4rem', bgcolor: 'secondary.main', color: '#fff', marginLeft: 'auto' }}>
                                        <Typography sx={{ fontWeight: 600 }} variant='h5'>{stat?.viewsWeek ? stat?.viewsWeek : 0}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                            <Card elevation={0} sx={{ borderRadius: radius, width: '100%' }}>
                                <CardContent sx={{ display: 'flex', padding: '0 !important' }}>
                                    <Box sx={{ padding: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <Typography sx={{ fontWeight: 600 }}>{t('agentdashboard.home.allleads')}</Typography>
                                    </Box>
                                    <Box sx={{ width: '6rem', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1.4rem', bgcolor: '#000', color: '#fff', marginLeft: 'auto' }}>
                                        <Typography sx={{ fontWeight: 600 }} variant='h5'>{stat?.allLeads ? stat?.allLeads : 0}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={3.5}>
                        <WrapCard elevation={0} sx={{ borderRadius: '10px', bgcolor: '#fff', height: '100%' }} >
                            <CardContent sx={{ padding: '0 !important' }}>
                                <Box sx={{ bgcolor: 'tertiary.main', color: '#fff', padding: '20px' }}>
                                    <Typography textAlign={'center'} variant='h6'>{t('agentdashboard.home.alltimestat')}</Typography>
                                </Box>
                                <Grid container spacing={1} mt={.2} sx={{ padding: "1rem" }}>
                                    <Grid item xs={4}>
                                        <Box sx={{ bgcolor: '#F0F0F0', borderRadius: '8px', padding: "15px 5px" }}>
                                            <Typography textAlign={'center'} variant='h5' color={'tertiary.main'}>CPC</Typography>
                                            <Typography textAlign={'center'} variant='body2' sx={{ fontSize: '.7rem' }} dangerouslySetInnerHTML={{ __html: t('agentdashboard.home.click') }}/>
                                            <Divider sx={{ bgcolor: grey[200], my: '10px' }} />
                                            <Typography variant='h5' sx={{ textAlign: "center" }}>&#x20B5;{stat?.CPC ? (stat?.CPC)?.toFixed() : 0}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box sx={{ bgcolor: '#F0F0F0', borderRadius: '8px', padding: "15px 5px" }}>
                                            <Typography textAlign={'center'} variant='h5' color={'tertiary.main'}>CPL</Typography>
                                            <Typography textAlign={'center'} variant='body2' sx={{ fontSize: '.7rem' }} dangerouslySetInnerHTML={{ __html: t('agentdashboard.home.lead') }}/>
                                            <Divider sx={{ bgcolor: grey[200], my: '10px' }} />
                                            <Typography variant='h5' sx={{ textAlign: "center" }}>&#x20B5;{stat?.CPL ? (stat?.CPL)?.toFixed() : 0}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box sx={{ bgcolor: '#F0F0F0', borderRadius: '8px', padding: "15px 5px" }}>
                                            <Typography textAlign={'center'} variant='h5' color={'tertiary.main'}>CPV</Typography>
                                            <Typography textAlign={'center'} variant='body2' sx={{ fontSize: '.7rem' }} dangerouslySetInnerHTML={{ __html: t('agentdashboard.home.view') }}/>
                                            <Divider sx={{ bgcolor: grey[200], my: '10px' }} />
                                            <Typography variant='h5' sx={{ textAlign: "center" }}>&#x20B5;{stat?.CPV ? (stat?.CPV)?.toFixed() : 0}</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </WrapCard>
                    </Grid>
                    {/* </Hidden> */}
                </Grid>
            </Box>

            {/* Recent Listings */}
            <Box sx={{ flex: 2, marginTop: 'auto', display: 'flex', flexDirection: 'column' }}>
                <Hidden mdDown>
                    <Box mb={2} sx={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 500 }}>{t('agentdashboard.home.recentlistings')}</Typography>
                        <Button variant='text' disableElevation disableFocusRipple disableRipple sx={{ textTransform: 'none' }} onClick={() => navigate('/broker/newlisting')} startIcon={<AddCircle sx={{ fontSize: '1rem' }} />}>{t('agentdashboard.home.addlisting')}</Button>
                        {getUserType() === 'developer' || getUserType() === 'realtor' ? <Button variant='text' disableElevation disableFocusRipple disableRipple sx={{ textTransform: 'none' }} onClick={() => navigate('/broker/off-plan-listing')} startIcon={<AddCircle sx={{ fontSize: '1rem' }} />}>{t('agentdashboard.home.addoffplan')}</Button> : null}
                    </Box>
                </Hidden>

                <Hidden mdUp>
                    <Box mb={2} sx={{ display: 'block', gap: '3rem', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 500 }}>{t('agentdashboard.home.recentlistings')}</Typography>
                        <Button variant='text' disableElevation disableFocusRipple disableRipple sx={{ textTransform: 'none' }} onClick={() => navigate('/broker/newlisting')} startIcon={<AddCircle sx={{ fontSize: '1rem' }} />}>{t('agentdashboard.home.addlisting')}</Button>
                        {getUserType() === 'developer' || getUserType() === 'realtor' ? <Button variant='text' disableElevation disableFocusRipple disableRipple sx={{ textTransform: 'none' }} onClick={() => navigate('/broker/off-plan-listing')} startIcon={<AddCircle sx={{ fontSize: '1rem' }} />}>{t('agentdashboard.home.addoffplan')}</Button> : null}
                    </Box>
                </Hidden>
                <Box sx={{ height: '100%' }}>
                    {
                        loading ? <Box sx={{ marginTop: "70px" }}><PageLoader /></Box> :
                            listing?.length === 0 ?
                                <Card variant='outlined' sx={{ height: '100%', borderRadius: '10px' }}>
                                    <CardContent sx={{ padding: '3rem 5rem' }}>
                                        <img src={NoList} width='15%' style={{ margin: '0 auto', marginTop: '3rem', display: 'block' }} alt='no-listing' />
                                        <Typography mt={3} mb={3} textAlign={'center'}>{t('agentdashboard.home.nolisting')}</Typography>
                                        <RoundButton text={t('agentdashboard.home.addlisting')} variant='contained' color={'primary'} size='small' disableElevation
                                            sx={{ padding: '.4rem 1rem', display: 'block', margin: '0 auto' }} onClick={() => navigate('/broker/newlisting')} />
                                    </CardContent>
                                </Card>
                                :
                                <Grid container spacing={3}>
                                    {
                                        listing?.map((item) => {
                                            return (
                                                <Grid item xs={12} sm={6} md={3} lg={3} key={item.id}>
                                                    {item?.propertyType === "development" ?
                                                        <OffPlanItem el={item} ExContext={ExContext}/>
                                                        :
                                                        <PropertyItem key={item?.id}
                                                            el={item}
                                                            name={item?.name}
                                                            address={item?.geoAddress}
                                                            price={item?.price}
                                                            images={item?.pictures}
                                                            wifi
                                                            bed={{ number: item?.bedrooms }}
                                                            bath={{ number: item?.bathrooms }}
                                                            garage={{ number: '1' }}
                                                            agentName={user?.firstName + " " + user?.lastName}
                                                            agentImage={user?.avatar}
                                                            verified={item?.user?.verified}
                                                            type={item?.transactionType}
                                                            ExContext={ExContext}
                                                            currency={item?.currency}
                                                            toggleWishlist={toggleWishlist}
                                                            load={load}
                                                            favs={favs}
                                                        />
                                                    }
                                                </Grid>
                                            )
                                        })
                                    }
                                </Grid>
                    }
                </Box>
            </Box>

        </Box>
    )
}

export default Home