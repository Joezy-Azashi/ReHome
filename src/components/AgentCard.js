import { CheckCircle, Facebook, Instagram, LinkedIn, Twitter } from '@mui/icons-material'
import { Avatar, Box, Card, CardContent, Typography, styled } from '@mui/material'
import { grey } from '@mui/material/colors'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const StyledCard = styled(Card)(({ theme, userType }) => ({
    border: 'none',
    background: '#fff',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all .2s ease',
    '&:hover': {
        backgroundColor: '#1267B1',
        boxShadow: '0 2px 1rem rgba(0,0,0, 12%)',
        '& #pic': {
            border: `3px solid #fff`
        },
        '& #details p, #icon': {
            color: `#fff`
        },
    }
}))

const ProfilePic = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(16),
    height: theme.spacing(16),
    margin: '1rem auto 2rem auto',
    borderRadius: '0px'
}))


const AgentCard = ({ el, userType }) => {
    const navigate = useNavigate()
    const { t } = useTranslation();
    return (
        <StyledCard variant='outlined' onClick={() => navigate(`/brokers/${el?.firstName.toLowerCase()}/${el?.id}`, { state: { el } })} userType={userType}>
            <Box id='type' mb={'-2rem'} sx={
                {
                    padding: '.6rem',
                    bgcolor: userType === 'agent' ? '#5B9C00' : userType === 'realtor' ? '#03254C' : '#FF0000',
                    width: '7rem'
                }}>
                <Typography variant='body2' textAlign={'center'} sx={{ fontSize: '.9rem', fontWeight: 'bold', textTransform: "capitalize" }} color={'paper.main'}>{userType === 'developer' ? t('signuptype.'+ userType) : t('signuptype.realtor')}</Typography>
            </Box>
            <CardContent style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: "26.5rem" }}>
                <span>
                    <ProfilePic id='pic' src={el?.avatar} />
                    <Box textAlign={'center'} mb={4} id='details'>
                        <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                            <Typography sx={{ fontSize: '1.4rem', color: '#03254C', fontWeight: 500, whiteSpace: "nowrap", width: "100%", overflow: "hidden", textOverflow: "ellipsis" }}>{el?.firstName} {el?.lastName}</Typography>
                            <span>{el?.verified && <CheckCircle id='icon' sx={{ fontSize: '1.2rem' }} color='primary' />}</span>
                        </Box>
                        <Typography sx={{ fontSize: '1rem' }} color={'textSecondary'} noWrap>{el?.agencies[0]?.name}</Typography>
                        <Typography sx={{ fontSize: '1rem' }} color={'textSecondary'} noWrap>{el?.agencies[0]?.location}</Typography>
                    </Box>
                </span>
                <Box display={'flex'} gap='1rem' justifyContent='center' alignItems={'center'}>
                    {el?.socialLinks?.twitter ?
                        <a href={el?.socialLinks?.twitter} target="_blank" rel="noreferrer">
                            <Twitter sx={{ color: grey[400], '&:hover': { color: '#fff' } }} fontSize='medium' />
                        </a> : ""}

                    {el?.socialLinks?.facebook ?
                        <a href={el?.socialLinks?.facebook} target="_blank" rel="noreferrer">
                            <Facebook sx={{ color: grey[400], '&:hover': { color: '#fff' } }} fontSize='medium' />
                        </a> : ""}

                    {el?.socialLinks?.instagram ?
                        <a href={el?.socialLinks?.instagram} target="_blank" rel="noreferrer">
                            <Instagram sx={{ color: grey[400], '&:hover': { color: '#fff' } }} fontSize='medium' />
                        </a> : ""}

                    {el?.socialLinks?.linkedin ?
                        <a href={el?.socialLinks?.linkedin} target="_blank" rel="noreferrer">
                            <LinkedIn sx={{ color: grey[400], '&:hover': { color: '#fff' } }} fontSize='medium' />
                        </a> : ""}
                </Box>
            </CardContent>
        </StyledCard>
    )
}

export default AgentCard