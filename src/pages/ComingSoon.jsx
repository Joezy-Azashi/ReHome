import React, { useEffect } from 'react'
import comingsoon from "../assets/images/coming-soon.svg"
import { KeyboardBackspace } from '@mui/icons-material'
import { Button, Container } from '@mui/material';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

function ComingSoon() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth='xl'>
        <Button onClick={() => navigate(-1)} disableRipple sx={{ textTransform: 'none', marginTop: '1rem' }}
          startIcon={<KeyboardBackspace sx={{ color: "white" }} fontSize='small' />} variant='contained' color='secondary'>{t("comingsoon.back")}
        </Button>
        <div className='flex justify-center items-center'>
          <div>
            <img src={comingsoon} alt="" />
            <h2 className='text-center md:mt-[-70px] mb-12'>{t('comingsoon.title')}</h2>
          </div>
        </div>
      </Container>
    </motion.div>
  )
}

export default ComingSoon