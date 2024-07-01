import { alpha, Box, Grid, Typography, Checkbox } from '@mui/material';
import React, { useEffect, useState, useContext } from 'react'
import PropertyItem from '../../components/PropertyItem';
import NoWish from '../../assets/images/wishlist.png'
import { useTranslation } from 'react-i18next';
import Api from '../../api/api';
import PageLoader from '../../components/PageLoader';
import RateContext from '../../contexts/rateContext';
import { useSnackbar } from 'notistack';
import OffPlanItem from '../../components/OffPlanItem';
import RoundButton from '../../components/Buttons/RoundButton'
import WishListEmail from '../../components/WishListEmail';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

const Wishlist = () => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const ExContext = useContext(RateContext);
    const { executeRecaptcha } = useGoogleReCaptcha();

    const [wishlistProperties, setWishlistProperties] = useState([])
    const [load, setLoad] = useState(false)
    const [favs, setFavs] = useState([])
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(false)
    const [showPopup, setShowPopup] = useState(false)
    const [selectedProperties, setSelectedProperties] = useState([])

    useEffect(() => {
        setLoading(true)
        Api().get('/me')
            .then((res) => {
                Api().get(`/wishlists/${res?.data?.wishlist?.id}`, {
                    params: {
                        filter: {
                            include: [{ relation: "rehomeProperties", scope: { include: [{ relation: "user" }] } }]
                        }
                    }
                })
                    .then((res) => {
                        setWishlistProperties(res?.data?.rehomeProperties)
                        setUser(res?.data)
                        setFavs(res?.data?.rehomePropertyIds)
                        setLoading(false)
                    })
                    .catch((error) => {
                        setLoading(false)
                    })
            })
    }, [])

    // Add to wishlist
    const toggleWishlist = (e, id) => {
        e.preventDefault()
        const exists = user?.rehomePropertyIds.includes(id)

        if (exists) {
            const newArray = user?.rehomePropertyIds.filter((item) => item !== id)

            setLoad(true)
            Api().patch(`wishlists/${user?.id}`, { rehomePropertyIds: newArray })
                .then((res) => {
                    setLoad(false)
                    enqueueSnackbar(t('dashboard.wishlist.removed'), { variant: 'success' });
                    const index = favs.indexOf(id)
                    favs.splice(index, 1)

                    setWishlistProperties(wishlistProperties.filter(item => item?.id !== id));
                })
        }
    }

    // Show Wishlist Email popup
    const handleShowPopup = (e) => {
        e.preventDefault()

        if(!selectedProperties?.length){
            enqueueSnackbar(t('dashboard.wishlist.email.no_property_error'), { variant: 'error' });
            return
        }

        setShowPopup(true);
    }

    const getCheckValue = (id) => {
        return selectedProperties.find(x=> x.id.toString() === id.toString())
    }

    // update selected properties
    const handleSelectedProperties = (el) => {
        const property = selectedProperties.find(x=> x.id.toString() === el.id.toString());

        // adding to selected properties
        if(!property){
            setSelectedProperties([...selectedProperties, el]);
        // removing from selected properties
        }else {
            setSelectedProperties(selectedProperties.filter(x=> x.id.toString() !== property.id.toString()));
        }
    }



    return (
        <div>
            <Box sx={{ padding: '2.5rem 2rem', background: alpha('#1267B1', .05), display: 'flex', justifyContent:'space-between', width: '100%', borderBottom: '1px solid lighgrey' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='h6'>{t('dashboard.wishlist.wishlist')}</Typography>
                    <Typography variant='body2'>{t('dashboard.wishlist.manage')}</Typography>
                </Box>
                <Box>
                    <RoundButton onClick={handleShowPopup} text={t('dashboard.wishlist.email.title')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
                </Box>
            </Box>

            <Box>
                <Box sx={{ padding: '2rem', overflowY: 'scroll', height: '33rem' }}>
                    {
                        loading ? <PageLoader /> :
                            wishlistProperties.length < 1 ?
                                <Box sx={{ textAlign: 'center', pt: '6rem' }}>
                                    <img src={NoWish} width='20%' style={{ display: 'block', margin: '0 auto' }} alt='no-notifications' />
                                    <Typography variant='h6' mt={2}>{t('dashboard.wishlist.nowishlist.title')}</Typography>
                                    <Typography>{t('dashboard.wishlist.nowishlist.note')}</Typography>
                                </Box>
                                :
                                <Grid container spacing={2}>
                                    {
                                        wishlistProperties?.map((el, index) => {
                                            return (
                                                <Grid item xs={12} sm={6} lg={4} mb={2} key={index}>
                                                    <Checkbox
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                background: '#fff',
                                                                borderRadius: '50px'
                                                            }
                                                        }}
                                                        checked={getCheckValue(el.id)}
                                                        onChange={()=> handleSelectedProperties(el)}
                                                        size="small"
                                                    />
                                                    {el?.propertyType === "development" ?
                                                        <OffPlanItem el={el} ExContext={ExContext}/>
                                                        :
                                                        <PropertyItem
                                                            el={el}
                                                            name={el?.name}
                                                            address={el?.geoAddress}
                                                            price={el?.price}
                                                            images={el?.pictures}
                                                            wifi
                                                            bed={{ number: el?.bedrooms }}
                                                            bath={{ number: el?.bathrooms }}
                                                            garage={{ number: '1' }}
                                                            agentName={el?.user?.firstName + " " + el?.user?.firstName}
                                                            agentImage={el?.user?.avatar}
                                                            verified
                                                            type={el?.transactionType}
                                                            ExContext={ExContext}
                                                            currency={el?.currency}
                                                            toggleWishlist={toggleWishlist}
                                                            load={load}
                                                            favs={favs}
                                                        // display={'block'}
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

            <WishListEmail executeRecaptcha={executeRecaptcha} showPopup={showPopup} setShowPopup={setShowPopup} selectedProperties={selectedProperties} wishlistId={user?.id} />
        </div>
    )
}

export default Wishlist