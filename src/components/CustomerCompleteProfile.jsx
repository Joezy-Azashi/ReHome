import React from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import RoundButton from './Buttons/RoundButton';

function CustomerCompleteProfile({ setIsProfileComplete }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box sx={{ bgcolor: '#fff', borderRadius: '20px', width: { xs: "90%", md: '50%', lg: "35%" }, display: 'flex', overflow: 'hidden' }}>
      <Box sx={{ padding: '2rem 3rem 3rem 3rem' }}>
        <Box sx={{display: 'flex', justifyContent: 'end'}}>
          <IconButton onClick={() => setIsProfileComplete(false)}><Close fontSize='small' /></IconButton>
        </Box>
        <Typography variant='h5' gutterBottom color={'primary'} sx={{ fontWeight: 600, textAlign: "center" }} textAlign='left'>{t('banner.completeprofile.title')}</Typography>
        <Typography paragraph >
          {t('banner.completeprofile.paragraph1')}
        </Typography>
        <Typography paragraph dangerouslySetInnerHTML={{ __html: t('banner.completeprofile.paragraph2') }} />

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <RoundButton onClick={() => { navigate('/client/profile'); setIsProfileComplete(false) }} text={t('banner.completeprofile.button')} variant='contained' color={'primary'} disableElevation sx={{ marginTop: '1rem' }} />
        </Box>
      </Box>
    </Box>
  )
}

export default CustomerCompleteProfile