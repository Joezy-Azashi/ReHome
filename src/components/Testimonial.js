import { FormatQuote } from '@mui/icons-material'
import { Avatar, Box, Typography, styled, Hidden } from '@mui/material'
import { grey } from '@mui/material/colors'
import MD from '../assets/images/md.png'

import React from 'react'

const ProfilePic = styled(Avatar)(({theme})=>({
    height: '8rem',
    width: '8rem',
    margin: '2rem auto 2rem auto'
}))

const LeftQuote = styled(FormatQuote)(({theme})=>({
    position: 'absolute',
    fontSize: '9rem',
    color: grey[300],
    left: '0%',
    transform: 'rotateY(180deg)'
}))

const RightQuote = styled(FormatQuote)(({theme})=>({
    position: 'absolute',
    fontSize: '9rem',
    color: grey[300],
    bottom: '-20%',
    right: '0'
}))


const Testimonial = ({name, content, title}) => {

  return (
    <Box sx={{margin: '3rem 0', textAlign: 'center', position: 'relative'}}>
        
        <Hidden smDown>
            <LeftQuote />
        </Hidden>
        <ProfilePic src={MD} />
        <Box width={'80%'} margin={'0 auto'}>
            <Typography mb={4}>{content}</Typography>
            <Typography variant='h6' gutterBottom>{name}</Typography>
            <Typography variant='body2' color={'textSecondary'}>{title}</Typography> 
        </Box>
        <Hidden smDown>
            <RightQuote  />   
        </Hidden>
    </Box>
  )
}

export default Testimonial