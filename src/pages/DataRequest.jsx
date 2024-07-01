import React from 'react'
import { motion } from "framer-motion";
import { Box, Container, Typography, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DSARForm from '../components/DSARForm';

const Banner = styled(Box)(({ theme }) => (
    {
        //padding: '5rem 0',
        height: '15rem',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundImage: `linear-gradient( 180deg, rgba(3,37,76, 60%), rgba(3,37,76, 80%)), url('https://images.pexels.com/photos/6476260/pexels-photo-6476260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
        color: '#fff',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    }
));

function DataRequest() {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Banner>
                <Container maxWidth='md'>
                    <Typography variant='h5' sx={{ fontSize: '2rem', fontWeight: 600, mb: '2rem' }}>{t('dsar.title')}</Typography>
                </Container>
            </Banner>

            <DSARForm/>
        </motion.div>
    )
}

export default DataRequest