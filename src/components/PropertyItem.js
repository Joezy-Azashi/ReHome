import { CheckCircle, Collections, FavoriteBorder, AccountBalanceWalletOutlined, PinDropOutlined, Favorite, } from '@mui/icons-material'
import { alpha, Avatar, Box, Card, Tooltip, CardActions, CardContent, CircularProgress, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, Stack, styled, Typography } from '@mui/material'
import Amenities from './Amenities'
import NoImage from '../assets/images/no-image.jpg'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import PhotoPreview from './PhotoPreview'
import Api from '../api/api'

const CardImage = styled(Box)(({ theme, image, display }) => ({
    backgroundImage: `url(${image})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: display ? '10rem' : '13rem',
    width: display && '10rem',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    overflow: 'hidden',
    cursor: 'pointer'
}))

const StyledButton = styled(IconButton)(({ theme }) => ({
    background: alpha('#000', .8),
    borderRadius: '5px',
    '&:hover': {
        background: alpha('#000', .5),
    }
}))

const PropertyItem = ({ el, name, address, price, images, bed, bath, wifi, garage, pool, agentName, agentImage, verified, type, display, currency, ExContext, toggleWishlist, load, favs, clientuser }) => {
    const { t } = useTranslation();
    const [value, setValue] = useState('1');

    const [preview, setPreview] = useState(false)

    const handleShowPreview = (e) => {
        e.preventDefault()
        setPreview(true);
    }

    const postStat = (id) => {
        Api().post(`/views/update/${id}`)
            .then((res) => { })
    }

    return (
        <>
            {/* CARD LISTING */}
            <Link to={el?.propertyType === "development" ? `/development/${el?.id}/details` : `/listing/${el?.id}/details`} target="_blank" rel="noreferrer" onMouseEnter={() => postStat(el?.id)}>
                <Card elevation={0} sx={{
                    display: display,
                    borderRadius: '10px',
                    border: el?.sponsored ? `2px solid #03254C` : "",
                    flex: 1,
                    cursor: 'pointer',
                    boxShadow: display ? null : '0 1px 10px rgba(0,0,0, 12%)',
                    '&:hover': {
                        '#btns': {
                            transform: 'translateY(0px)'
                        }
                    }
                }}>
                    <CardImage image={images?.length < 1 ? NoImage : images[0]} display={display}>
                        <Box sx={{
                            height: '3.5rem',
                            width: '3.7rem',
                            bgcolor: el?.propertyStatus === 'sold' || el?.propertyStatus === 'rented' ? '#FCA510' : type === 'rent' && el?.propertyStatus === 'available' ? '#2C67AB' : 'primary.main',
                            mt: '-1rem', p: 1, display: 'flex',
                            justifyContent: 'center', alignItems: 'end',
                            padding: "6px"
                        }}>
                            <Typography textAlign={'center'} sx={{
                                padding: '5px', borderRadius: '3px',
                                border: el?.propertyStatus === 'sold' || el?.propertyStatus === 'rented' ? '1px solid #fff' : '1px solid #fff',
                                fontSize: '.65rem',
                                minWidth: '3.2rem',
                                fontWeight: 600,
                                color: '#fff',
                                lineHeight: 1
                            }}>{type === 'sale' && el?.propertyStatus === 'available' ? t('agentdashboard.home.forsale') : type === 'sale' && el?.propertyStatus === 'sold' ? t('agentdashboard.home.sold') : type === 'rent' && el?.propertyStatus === 'available' ? t('agentdashboard.home.forrent') : t('agentdashboard.home.rented')}</Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box display={'flex'} gap={'.5rem'} id='btns' sx={{ transform: 'translateY(60px)', transition: 'all .2s ease' }}>
                                <Tooltip title={favs?.includes(el?.id) ? t('dashboard.wishlist.remove') : t('dashboard.wishlist.add')} arrow>
                                    <StyledButton onClick={(e) => { toggleWishlist(e, el?.id) }}>
                                        {load ? <CircularProgress size='1.33rem' color='paper' />
                                            : favs?.includes(el?.id) ? <Favorite color='paper' fontSize='small' /> : <FavoriteBorder color='paper' fontSize='small' />
                                        }
                                    </StyledButton>
                                </Tooltip>

                                <Tooltip title={t('singleproperty.gallery')} arrow>
                                    <StyledButton onClick={(e) => { handleShowPreview(e) }}>
                                        <Collections fontSize='small' color='paper' />
                                    </StyledButton>
                                </Tooltip>

                                {/* <StyledButton>
                                <ViewInAr fontSize='small' color='paper' />
                            </StyledButton> */}
                            </Box>
                            {el?.sponsored ?
                                <Box sx={{
                                    bgcolor: '#03254C',
                                    display: 'flex',
                                    justifyContent: 'center', alignItems: 'center', borderRadius: "12px"
                                }}>
                                    <Typography textAlign={'center'} sx={{
                                        padding: '4px 8px', borderRadius: '3px',
                                        fontSize: '.65rem', fontWeight: 600,
                                        color: '#fff'
                                    }}>{t('buyrent.sponsored')}</Typography>
                                </Box>
                                : ""}
                        </Box>
                    </CardImage>
                    <CardContent sx={{ padding: '1.2rem', height: "10rem" }}>
                        <Typography sx={{ fontWeight: 600, cursor: 'pointer', width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</Typography>
                        <List disablePadding>
                            <ListItem disablePadding>
                                <ListItemIcon sx={{ minWidth: '30px' }}><PinDropOutlined sx={{ fontSize: '1.2rem' }} /></ListItemIcon>
                                <ListItemText><Typography variant='body2' noWrap>{address}</Typography></ListItemText>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemIcon sx={{ minWidth: '30px' }}><AccountBalanceWalletOutlined sx={{ fontSize: '1.2rem' }} /></ListItemIcon>
                                {el?.hidePrice ? <ListItemText><Typography variant='body2' whiteSpace={'noWrap'}>{t('findanagent.singleagent.contactagentforprice')}</Typography></ListItemText> :
                                    <ListItemText><Typography variant='body2' noWrap><b>{ExContext?.preferredCurrency} {(ExContext?.convert(currency, price))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b> {el?.priceInterval ? ` ${t('agentdashboard.addlisting.tab6.'+el?.priceInterval)}` : el?.transactionType === "sale" ? "" : "/" + t('agentdashboard.addoffplan.tab2.month')}</Typography></ListItemText>
                                }
                            </ListItem>
                        </List>
                        <Box mt={1}>
                            <Amenities bed={bed} bath={bath} amenities={el.amenities}/>
                        </Box>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ padding: '0.7rem 1.2rem', backgroundColor: el?.sponsored ? "#03254C" : "", display: "block" }}>
                        <Box sx={{ display: 'flex', gap: "6px" }}>
                            <Avatar src={ExContext.thumbnail(agentImage)} />
                            <Stack sx={{color: el?.sponsored ? "#fff" : "", width: "100%"}}>
                                <Typography sx={{ fontSize: '.7rem' }}>{t(`signuptype.${el?.user?.userType === 'developer' ? 'developer' : 'realtor'}`)} {el?.user?.verified && <span style={{ marginLeft: '5px' }}><CheckCircle sx={{ fontSize: '1rem' }} color='primary' /></span>}</Typography>
                                <Typography width={"78%"} sx={{ fontWeight: 600, fontSize: '.85rem' }} noWrap>
                                    {agentName}
                                </Typography>
                            </Stack>
                        </Box>
                    </CardActions>
                </Card>
            </Link>

            {/* PHOTO PREVIEW */}

            <PhotoPreview data={el?.pictures} preview={preview} setPreview={setPreview} value={value} setValue={setValue} />

        </>
    )
}

export default PropertyItem