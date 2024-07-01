import { alpha, Box, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next';
import Dev from '../../assets/images/development.png'

const Messages = () => {
    const { t } = useTranslation();
  return (
    <div>
        <Box sx={{ padding: '2.5rem 2rem', background: alpha('#1267B1', .05), alignItems: 'center', width: '100%', borderBottom: '1px solid lighgrey' }}>
            <Typography variant='h6'>{t('dashboard.messages.messages')}</Typography>
            <Typography variant='body2'>{t('dashboard.messages.manage')}</Typography>
        </Box>
        <Box sx={{textAlign: 'center', pt: '6rem' }}>
            <img src={Dev} width='22%' style={{display: 'block', margin: '0 auto'}} alt='no-notifications' />
            <Typography variant='h6' mt={2}>Under Development</Typography>
            <Typography variant='body2' mb={4}>You will have this feature soon</Typography>
        </Box>
    </div>
  )
}

export default Messages