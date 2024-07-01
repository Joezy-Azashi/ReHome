import { CheckCircle, Place ,AccountBalanceWalletOutlined} from '@mui/icons-material'
import { Avatar, Box, Card, CardActions, CardContent, styled, Divider, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import NoImage from '../assets/images/no-image.jpg'
import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next";
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
    alignItems: "end",
    flexDirection: 'column',
    overflow: 'hidden',
    cursor: 'pointer'
}))

const OffPlanItem = ({ el, ExContext }) => {
    const { t } = useTranslation();

    const postStat = (id) => {
        Api().post(`/views/update/${id}`)
            .then((res) => { })
    }

    const getLowestUnit = (el) => {
        if(!el || !el.units || !el.units.length) return null;

        const filtered_units = el?.units.filter(unit => !unit.hidePrice);
        if(filtered_units.length){
            const res = filtered_units.reduce((min, unit) => ((unit.currency === 'USD' ? unit.priceInGHS : unit.price) < (min.currency === 'USD' ? min.priceInGHS : min.price) ? unit : min), filtered_units[0]) 
            return res;
        }
        return null;
    }

    return (
        <Link to={`/development/${el?.id}/details`} target="_blank" rel="noreferrer" onMouseEnter={() => postStat(el?.id)}>
            <Card elevation={0} sx={{ borderRadius: '15px', position: 'relative', cursor: 'pointer', border: el?.sponsored ? `2px solid #03254C` : "", boxShadow: '0 1px 10px rgba(0,0,0, 12%)', width: "100%"}}>
                {/* <Box sx={{ bgcolor: 'red', color: '#fff', padding: '.8rem', position: 'absolute', top: '0%', right: '0%' }}>
                <Typography sx={{ fontSize: '.7rem' }}>{t('offplan.tag')}</Typography>
            </Box> */}
                <CardImage image={el?.pictures.length < 1 ? NoImage : ExContext?.thumbnail(el?.pictures[0]) || NoImage} sx={{ height: "13rem" }}>
                    <Box sx={{
                        height: '3.5rem',
                        width: '3.7rem',
                        bgcolor: "#5c3cb0",
                        mt: '-1rem', p: 1, display: 'flex',
                        justifyContent: 'center', alignItems: 'end',
                        padding: "6px"
                    }}>
                        <Typography textAlign={'center'} sx={{
                            padding: '5px', borderRadius: '3px',
                            border: '1px solid #fff',
                            minWidth: '3.2rem',
                            fontSize: '.65rem', fontWeight: 600,
                            color: '#fff',
                            lineHeight: 1
                        }} dangerouslySetInnerHTML={{ __html: t('offplan.itemtag') }} />
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
                </CardImage>
                <CardContent sx={{ padding: '1.2rem', height: "10rem" }}>
                    <Typography sx={{ fontWeight: 600 }} noWrap>{el?.name}</Typography>
                    <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: '25px' }}><Place fontSize='small' /></ListItemIcon>
                        <ListItemText><Typography variant='body2'>{el?.geoAddress}</Typography></ListItemText>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemIcon sx={{ minWidth: '30px' }}><AccountBalanceWalletOutlined sx={{ fontSize: '1.2rem' }} /></ListItemIcon>
                        {
                            getLowestUnit(el) ? 
                            <ListItemText>
                                <Typography variant='body2' noWrap>
                                    <b> {t('agentdashboard.addlisting.tab6.from')} {ExContext?.preferredCurrency} {(ExContext?.convert(getLowestUnit(el).currency, getLowestUnit(el).price))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b> 
                                        {el?.priceInterval ? ` ${t('agentdashboard.addlisting.tab6.'+el?.priceInterval)}` : ``}
                                </Typography>
                            </ListItemText>
                            :
                            <ListItemText><Typography variant='body2' whiteSpace={'noWrap'}>{t('findanagent.singleagent.contactagentforprice')}</Typography></ListItemText> 
                        }
                    </ListItem>
                    <Typography mt={2} paragraph sx={{ fontSize: '.8rem', width: "100%", height: "2.3rem", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflowWrap: "break-word" }} color={'GrayText'}>
                        {el?.description}
                    </Typography>
                </CardContent>
                <Divider />
                <CardActions sx={{ padding: '0.7rem 1.2rem', backgroundColor: el?.sponsored ? "#03254C" : "", display: "block" }}>
                    <Box sx={{ display: 'flex', gap: "6px" }}>
                        <Avatar src={ExContext?.thumbnail(el?.user?.avatar)} alt="" />
                        <Stack sx={{color: el?.sponsored ? "#fff" : "", width: "100%"}}>
                            <Typography sx={{ fontSize: '.7rem' }}>{t(`signuptype.${el?.user?.userType === 'developer' ? 'developer' : 'realtor'}`)}  {el?.user?.verified && <span style={{ marginLeft: '5px' }}><CheckCircle sx={{ fontSize: '1rem' }} color='primary' /></span>}</Typography>
                            <Typography width={"78%"} sx={{ fontWeight: 600, fontSize: '.85rem' }} noWrap>
                                {el?.user?.firstName} {el?.user?.lastName}
                            </Typography>
                        </Stack>
                    </Box>
                </CardActions>
            </Card>
        </Link>
    )
}

export default OffPlanItem