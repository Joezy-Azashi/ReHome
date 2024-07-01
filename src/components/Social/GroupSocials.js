import { Facebook, Instagram, LinkedIn, Twitter } from '@mui/icons-material'
import { Box, Tooltip } from '@mui/material'
import React from 'react'

const GroupSocials = ({ color, hoverColor, gap, user }) => {
  return (
    <Box display={'flex'} gap={gap} justifyContent='center' alignItems={'center'}>
      {user?.socialLinks?.twitter ?
        <Tooltip title={"Twitter"} arrow>
          <a href={"//" + user?.socialLinks?.twitter.replace(/(^\w+:|^)\/\//, '')} target="_blank" rel="noreferrer"><Twitter sx={{ color: color, cursor: 'pointer', '&:hover': { color: hoverColor } }} fontSize='medium' /></a>
        </Tooltip>
        : null}

      {user?.socialLinks?.facebook ?
        <Tooltip title={"Facebook"} arrow>
          <a href={"//" + user?.socialLinks?.facebook.replace(/(^\w+:|^)\/\//, '')} target="_blank" rel="noreferrer"><Facebook sx={{ color: color, cursor: 'pointer', '&:hover': { color: hoverColor } }} fontSize='medium' /></a>
        </Tooltip>
        : null}

      {user?.socialLinks?.instagram ?
        <Tooltip title={"Instagram"} arrow>
          <a href={"//" + user?.socialLinks?.instagram.replace(/(^\w+:|^)\/\//, '')} target="_blank" rel="noreferrer"><Instagram sx={{ color: color, cursor: 'pointer', '&:hover': { color: hoverColor } }} fontSize='medium' /></a>
        </Tooltip>
        : null}

      {user?.socialLinks?.linkedin ?
        <Tooltip title={"LinkedIn"} arrow>
          <a href={"//" + user?.socialLinks?.linkedin.replace(/(^\w+:|^)\/\//, '')} target="_blank" rel="noreferrer"><LinkedIn sx={{ color: color, cursor: 'pointer', '&:hover': { color: hoverColor } }} fontSize='medium' /></a>
        </Tooltip>
        : null}
    </Box>
  )
}

export default GroupSocials