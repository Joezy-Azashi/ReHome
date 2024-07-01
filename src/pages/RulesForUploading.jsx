import React from 'react'
import { Box, Container, Typography } from '@mui/material';
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

function RulesForUploading() {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div style={{ backgroundColor: "#F7F7F7F7" }}>
                <Container maxWidth='lg' sx={{ backgroundColor: "#F7F7F7F7", padding: "40px 15px 90px 15px" }}>
                    <Typography variant={'h4'} sx={{ fontSize: { xs: "2rem", sm: "2.8rem" } }} fontWeight={'600'} mb={5}>{t('rulesforuploading.title')}</Typography>
                    <Typography>
                        {t('rulesforuploading.note1')}
                    </Typography>

                    <Typography mt={4}>
                        {t('rulesforuploading.note2')}
                    </Typography>

                    <Box mt={4} ml={2.5}>
                        <Typography>
                            {t('rulesforuploading.p1')}
                        </Typography>

                        <Typography mt={2}>
                            {t('rulesforuploading.p2')}
                        </Typography>

                        <Typography mt={2}>
                            {t('rulesforuploading.p3')}
                        </Typography>

                        <Typography mt={2}>
                            {t('rulesforuploading.p4')}
                        </Typography>

                        <Typography mt={2}>
                            {t('rulesforuploading.p5')}
                        </Typography>

                        <Typography mt={2}>
                            {t('rulesforuploading.p6')}
                        </Typography>

                        <Typography mt={2}>
                            {t('rulesforuploading.p7')}
                        </Typography>

                        <Typography mt={2}>
                            {t('rulesforuploading.p8')}
                        </Typography>

                        <Typography mt={2}>
                            {t('rulesforuploading.p9')}
                        </Typography>
                    </Box>

                    <Typography mt={4}>
                        {t('rulesforuploading.footnote1')} <a href={'mailto:info@rehomeafrica.com'} target="_blank" rel="noreferrer" style={{ color: "blue" }}>info@rehomeafrica.com</a>. 
                        {t('rulesforuploading.footnote2')}
                    </Typography>

                    <Typography mt={5} fontWeight={600}>
                        {t('rulesforuploading.sign')}
                    </Typography>
                </Container>
            </div>
        </motion.div >
    )
}

export default RulesForUploading