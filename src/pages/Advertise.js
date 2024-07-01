import { Box, Container, Divider, Grid, Hidden, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import React, { useEffect } from 'react'
import RoundButton from '../components/Buttons/RoundButton'
import Leads01 from '../assets/images/leads-management-1.jpg'
import Leads02 from '../assets/images/leads-management-2.jpg'
import Leads03 from '../assets/images/leads-management.jpg'
import Leads04 from '../assets/images/property-manager.jpg'
import Showcase from '../assets/images/showcase2.png'
import { isMobile } from 'react-device-detect'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isLoggedIn } from '../services/auth'

const Advertise = () => {
    const navigate = useNavigate()
    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    return (
        <div>
            {/* Banner */}
            <Box sx={{ bgcolor: 'secondary.main', height: 'auto', padding: '5rem 0' }}>
                <Container>
                    <Grid container spacing={'3rem'}>
                        <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '20rem' }}>
                            <Typography variant='h4' mb={1} sx={{ color: '#fff', fontWeight: 600 }}>{t('advertise.banner.title')}</Typography>
                            <Typography variant='body1' sx={{ color: '#fff' }}>
                                {t('advertise.banner.note')}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ height: '100%' }}>
                            <Box sx={{ height: '20rem', borderRadius: '20px', backgroundImage: `url(${Leads02})`, backgroundSize: 'cover' }} />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ padding: '7rem 0' }}>
                <Container>

                    <Typography variant='h6' sx={{ fontWeight: 600, mb: 2, fontSize: { lg: '1.8rem' } }}>{t('advertise.section1.title')}</Typography>
                    <Grid container>
                        <Hidden smDown>
                            <Grid item xs={12} sm={7}>
                                <Box sx={{ height: '25rem', borderRadius: '30px', backgroundImage: `url(${Leads01})`, backgroundSize: 'cover', border: `25px solid ${grey[200]}`, boxShadow: '0 2px 10px rgba(0,0,0, 15%)' }} />
                                {!isLoggedIn() && <RoundButton disableElevation onClick={() => navigate('/signup')} text={t('advertise.section1.button')} variant='contained' color={'secondary'} sx={{ margin: '0 auto', display: 'block', mt: '2rem' }} />}
                            </Grid>
                        </Hidden>
                        <Grid item xs={12} sm={5}>
                            <Box sx={{
                                padding: { xs: '1rem', md: '3rem' }, bgcolor: '#fff', borderRadius: '30px',
                                border: `35px solid ${grey[200]}`,
                                boxShadow: '0 2px 5px rgba(0,0,0, 5%)',
                                ml: { xs: 0, sm: 0, lg: '-5rem' },
                                mt: { xs: 0, sm: 0, lg: '8rem' }
                            }}>
                                <Typography variant='body1' textAlign={'center'}>
                                    {t('advertise.section1.note')}
                                </Typography>
                                {(isMobile && !isLoggedIn()) &&
                                    <RoundButton onClick={() => navigate('/signup')} disableElevation text={t('advertise.section1.button')} variant='contained' color={'secondary'} sx={{ margin: '0 auto', display: 'block', mt: '2rem' }} />
                                }
                            </Box>

                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ padding: '7rem 0', bgcolor: grey[100], backgroundImage: isMobile ? null : `url(${Showcase})`, backgroundSize: isMobile ? 'cover' : 'contain', backgroundPosition: 'right', backgroundRepeat: 'no-repeat' }}>
                <Container>
                    <Grid container>
                        <Grid item sm={6}>
                            <Typography variant='h5' sx={{ fontWeight: 600, mb: 2, fontSize: { lg: '2rem' } }}>{t('advertise.section2.title')}</Typography>
                            <Typography variant='body1'>{t('advertise.section2.note')}
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ padding: { xs: '2rem 0', sm: '2rem 0', lg: '7rem 0' } }}>
                <Container maxWidth='md'>
                    <Grid container spacing={{ xs: 2, sm: 2, lg: 5 }} sx={{ mb: '3rem' }}>
                        <Hidden smDown>
                            <Grid item sm={6}>
                                <Box sx={{ height: '20rem', borderRadius: '30px', backgroundImage: `url(${Leads03})`, backgroundSize: 'cover' }} />
                            </Grid>
                        </Hidden>
                        <Grid item sm={12} md={6}>
                            <Typography variant='h6' sx={{ fontWeight: 600, mb: 2, fontSize: { lg: '1rem' } }} dangerouslySetInnerHTML={{ __html: t('advertise.section3.title') }} />
                            <Divider sx={{ height: '.5rem', bgcolor: 'secondary.main', width: '6rem', mb: '2rem' }} />
                            <Box sx={{ bgcolor: grey[200], padding: '2rem', borderRadius: '30px' }}>
                                <Typography variant='body1' textAlign={'left'}>
                                    {t('advertise.section3.note')}
                                </Typography>
                            </Box>

                        </Grid>
                    </Grid>
                    <Grid container spacing={5}>

                        <Grid item md={6}>
                            <Typography variant='h6' sx={{ fontWeight: 600, mb: 2, fontSize: { lg: '1rem' } }} dangerouslySetInnerHTML={{ __html: t('advertise.section4.title') }}/>
                            <Divider sx={{ height: '.5rem', bgcolor: 'secondary.main', width: '6rem', mb: '2rem' }} />
                            <Box sx={{ bgcolor: grey[200], padding: '2rem', borderRadius: '30px' }}>
                                <Typography variant='body1' textAlign={'left'}>{t('advertise.section4.note')}</Typography>
                            </Box>

                        </Grid>
                        <Hidden smDown>
                            <Grid item sm={6}>
                                <Box sx={{ height: '20rem', borderRadius: '30px', backgroundImage: `url(${Leads04})`, backgroundSize: 'cover' }} />
                            </Grid>
                        </Hidden>
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ padding: '7rem 0', bgcolor: grey[200] }}>
                <Container maxWidth='sm'>
                    <Typography variant='h5' textAlign={'center'} sx={{ fontWeight: 600, mb: 2, fontSize: { lg: '2rem' } }}>{t('advertise.section5.title')}</Typography>
                    <Typography variant='body1' textAlign={'center'}>
                    {t('advertise.section5.note')}
                    </Typography>
                    <RoundButton onClick={() => {
                        window.location.assign("mailto:advertise@rehomeafrica.com")
                    }} disableElevation text={t('advertise.section5.button')} variant='contained' color={'secondary'} sx={{ margin: '0 auto', display: 'block', mt: '2rem' }} />
                </Container>
            </Box>

        </div>
    )
}

export default Advertise