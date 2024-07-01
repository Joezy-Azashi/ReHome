import { Button, styled } from '@mui/material'
import React from 'react'


const StyledButton = styled(Button)(({theme}) => ({}))


const RoundButton = ({text, variant, disableElevation, size, color, sx, startIcon, endIcon, progress, onClick, disable, fullWidth}) => {
    sx = {
      ...{
        borderRadius: '50px',
        padding: '.8rem 1.5rem',
        textTransform: 'none'
      },
    ...sx}
  
  return (
    <StyledButton fullWidth={fullWidth} disabled={disable} startIcon={startIcon} endIcon={endIcon} onClick={onClick} sx={sx} size={size} color={color} variant={variant} disableElevation={disableElevation} >{progress || text}</StyledButton>
  )
}

export default RoundButton