import React from 'react'
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

function Verify() {
  const { t } = useTranslation();

  return (
    <Box p={1} sx={{width: "20rem"}}>{t('admindashboard.users.table.info.verify')}</Box>
  )
}

export default Verify