import { Skeleton, Stack } from '@mui/material'
import React from 'react'

const LoadingPropertyItem = () => {
  return (
    <Stack>
        <Skeleton sx={{mb: '-2rem'}} height={'20rem'} animation='wave' />
        <Skeleton  animation='wave' />
        <Skeleton animation='wave' width={'70%'}/>
        <Skeleton animation='wave' height={'1rem'} width={'50%'}/>
    </Stack>
  )
}

export default LoadingPropertyItem