import { Close } from '@mui/icons-material'
import { Avatar, Box, IconButton, Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import React, { useContext } from 'react'
import moment from "moment";
import RateContext from '../contexts/rateContext';

const NotificationItem = ({width, el, closeSingleNotification, setNotification, index}) => {
  const ExContext = useContext(RateContext);

  const gotoURL = ()=>{
    if(!el?.url)return

    window.open(el.url,"_blank")
  }
  return (
    <Box sx={{display: 'flex', alignItems: 'flex-start', padding: '1rem', gap: '1rem', width: width, cursor: 'pointer',
        '&:hover': {
            bgcolor: grey[200],
            borderRadius: '10px'
        }
    }}
    onClick={gotoURL}>
        <Avatar src={ExContext.thumbnail(el?.sender?.avatar)} sx={{bgcolor: 'primary.main'}} alt={"R"}/>
        <Stack sx={{width: '70%'}}>
            <Typography noWrap>{localStorage.getItem('i18nextLng') === 'en' ? el?.title?.en : el?.title?.fr}</Typography>
            <Typography variant='body2' mb={2} color={'GrayText'} sx={{fontSize: '.8rem'}}>{localStorage.getItem('i18nextLng') === 'en' ? el?.body?.en : el?.body?.fr}</Typography>
            <Typography variant='body2' color={'GrayText'} sx={{fontSize: '.8rem'}}>{moment(`${el?.updatedAt}`).calendar()}</Typography>
        </Stack>
        <IconButton onClick={(e)=>{e.stopPropagation(); closeSingleNotification(el); setNotification(prev => { return prev.filter((n, i) => i !== index) })}} sx={{padding: '.6rem'}}><Close sx={{fontSize: '.9rem'}} /></IconButton>
    </Box>
  )
}

export default NotificationItem