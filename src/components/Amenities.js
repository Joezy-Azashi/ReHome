import { AcUnit, KingBedOutlined, Pool, Shower, Garage, Wifi, LocalParking, Security } from '@mui/icons-material'
import { Box, styled, Typography, Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from "react-i18next";

const FlexWrap = styled(Box)(({theme})=> ({
    display: 'flex',
    gap: '.3rem'
}))

const Amenities = ({ bed, bath, amenities, wifi, garage, pool}) => {
    const { t } = useTranslation();
  return (
    <div>
        <Box sx={{display: 'flex', gap: '1rem'}}>
        {
            bed && 
            <Tooltip title={t('amenities.bed')} arrow>
                <FlexWrap>
                    <KingBedOutlined fontSize='small' />
                    <Typography variant='body2' >{bed.number}</Typography>
                </FlexWrap>
            </Tooltip>
        }
        {
            bath && 
            <Tooltip title={t('amenities.bath')} arrow>
                <FlexWrap>
                    <Shower fontSize='small' />
                    <Typography variant='body2' >{bath.number}</Typography>
                </FlexWrap>
            </Tooltip>
        }
        {
            amenities.length && amenities.find(a=>a.title === 'wifi') ? <Tooltip title={t('amenities.wifi')} arrow><Wifi fontSize='small' /></Tooltip> : <></>
        }
        {
            amenities.length && amenities.find(a=>a.title === 'pool')  ? <Tooltip title={t('amenities.pool')} arrow><Pool fontSize='small' /></Tooltip> : <></>
        }
        {
            amenities.length && amenities.find(a=>a.title === 'air_condition')  ? <Tooltip title={t('amenities.air_condition')} arrow><AcUnit fontSize='small' /></Tooltip> : <></>
        }
        {
            amenities.length && amenities.find(a=>a.title === 'security')  ? <Tooltip title={t('amenities.security')} arrow><Security fontSize='small' /></Tooltip> : <></>
        }

        </Box>
    </div>
  )
}

export default Amenities