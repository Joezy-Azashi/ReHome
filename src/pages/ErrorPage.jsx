import React, { useEffect } from 'react'
import error404 from "../assets/images/error404.svg"
import { KeyboardBackspace } from '@mui/icons-material'
import { Button, Container } from '@mui/material';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

function ErrorPage() {

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
      <Container maxWidth='xl' sx={{minHeight: {xs: '50vh', lg: '85vh'}}}>
        <Button onClick={() => navigate("/")} disableRipple sx={{ textTransform: 'none', marginTop: '1rem' }}
          startIcon={<KeyboardBackspace sx={{ color: "white" }} fontSize='small' />} variant='contained' color='secondary'>{t("comingsoon.home")}
        </Button>
        <div className='flex justify-center items-center'>
          <div>
            <img src={error404} width={500} alt="" />
          </div>
        </div>
      </Container>
    </motion.div>
  )
}

export default ErrorPage