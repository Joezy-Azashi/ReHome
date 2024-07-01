import { Box, Container, Divider, IconButton, Dialog, DialogContent, Card, CardContent, Grid, Typography } from '@mui/material'
import { Close } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import React, { useState, useEffect } from 'react'
import HomeSale from '../assets/images/home.png'
import Homeperson from '../assets/images/homeperson.svg'
import SideHouse from '../assets/images/sidehouse.png'
import Personcheck from '../assets/images/personcheck.svg'
import Persontie from '../assets/images/persontie.svg'
import RoundButton from '../components/Buttons/RoundButton'
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { isLoggedIn } from '../services/auth'
import { useNavigate } from 'react-router-dom'
import login from '../assets/images/loginIcon.png';
import signUp from '../assets/images/signUpIcon.png';
import PillButton from '../components/Buttons/PillButton'
import SellForm from '../components/SellForm'

const Banner = styled(Box)(({ theme }) => (
    {
        height: '17rem',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundImage: `linear-gradient( 180deg, rgba(0,0,0, 70%), rgba(0,0,0, 70%)), url(${HomeSale})`,
        // clipPath: "polygon(25.4% 0%, 75% 0%, 100% 100%, 0% 100%)"
    }
));

const Sell = () => {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const [loginPrompt, setLoginPrompt] = useState(false)
    const [openSellForm, setOpenSellForm] = useState(false)

    const marketing = [
        {
            title: t('sell.marketing.grid1.title'),
            copy: t('sell.marketing.grid1.note')
        },
        // {
        //     title: t('sell.marketing.grid2.title'),
        //     copy: t('sell.marketing.grid2.note')
        // },
        {
            title: t('sell.marketing.grid3.title'),
            copy: t('sell.marketing.grid3.note')
        },
    ]

    useEffect(() => {
        window.scrollTo({ top: 0 })
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Banner>
                <Typography variant='h4' pt={'3.5rem'} sx={{ fontWeight: 600, fontSize: { xs: '2rem', sm: '2rem', md: "2.8rem" }, textAlign: 'center', whiteSpace: "nowrap", color: '#fff' }}>{t('sell.banner.maintext')}</Typography>
                <Divider sx={{ margin: '1rem auto', bgcolor: 'primary.main', height: '5px', border: 'none', width: { xs: "47%", sm: "25%", lg: '20%' } }} />
                <Typography variant='body1' sx={{ color: '#fff', margin: '0 auto', textAlign: "center", width: { sm: "75%", md: "55%", lg: "43%" } }}>{t('sell.banner.subtext')}</Typography>
            </Banner>

            <Box mt={7}>
                <Container maxWidth='sm'>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={4}>
                            <Card variant='outlined' sx={{ borderRadius: '10px' }}>
                                <CardContent sx={{ padding: '.8rem 0', textAlign: 'center', display: "flex", justifyContent: "center", alignItems: "center", '&.MuiCardContent-root': { paddingBottom: ".8rem" } }}>
                                    <Box>
                                        <Box sx={{ backgroundColor: "tertiary.main", padding: "1rem", borderRadius: '50%', width: "4rem", margin: "auto" }}>
                                            <img src={Homeperson} width="50" alt="start1" />
                                        </Box>
                                        <Typography variant='body2' fontWeight={500} color={'secondary'} mt={'1rem'} sx={{ height: "3.6rem" }}>{t('sell.section1.card1.title')}</Typography>
                                        <Divider sx={{ margin: '1rem auto', bgcolor: 'primary.main', height: '5px', border: 'none', width: { xs: '80%' } }} />
                                        <RoundButton onClick={() => navigate("/coming-soon")} text={t('sell.section1.card1.button')} variant='contained' color={'primary'} sx={{ padding: ".8rem 1rem" }} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card variant='outlined' sx={{ borderRadius: '10px' }}>
                                <CardContent sx={{ padding: '.8rem 0', textAlign: 'center', display: "flex", justifyContent: "center", alignItems: "center", '&.MuiCardContent-root': { paddingBottom: ".8rem" } }}>
                                    <Box>
                                        <Box sx={{ backgroundColor: "tertiary.main", padding: "1rem", borderRadius: '50%', width: "4rem", margin: "auto" }}>
                                            <img src={Personcheck} width="50" alt="start1" />
                                        </Box>
                                        <Typography variant='body2' fontWeight={500} color={'secondary'} mt={'1rem'} sx={{ height: "3.6rem" }}>{t('sell.section1.card2.title')}</Typography>
                                        <Divider sx={{ margin: '1rem auto', bgcolor: 'primary.main', height: '5px', border: 'none', width: { xs: '80%' } }} />
                                        <RoundButton onClick={() => { !isLoggedIn() ? setLoginPrompt(true) : setOpenSellForm(true) }} text={t('sell.section1.card2.button')} variant='contained' color={'primary'} sx={{ padding: ".8rem 1rem" }} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Card variant='outlined' sx={{ borderRadius: '10px' }}>
                                <CardContent sx={{ padding: '.8rem 0', textAlign: 'center', display: "flex", justifyContent: "center", alignItems: "center", '&.MuiCardContent-root': { paddingBottom: ".8rem" } }}>
                                    <Box>
                                        <Box sx={{ backgroundColor: "tertiary.main", padding: "1rem", borderRadius: '50%', width: "4rem", margin: "auto" }}>
                                            <img src={Persontie} width="50" alt="start1" />
                                        </Box>
                                        <Typography variant='body2' fontWeight={500} color={'secondary'} mt={'1rem'} sx={{ height: "3.6rem" }}>{t('sell.section1.card3.title')}</Typography>
                                        <Divider sx={{ margin: '1rem auto', bgcolor: 'primary.main', height: '5px', border: 'none', width: { xs: '80%' } }} />
                                        <RoundButton disable={isLoggedIn()} onClick={() => navigate("/signup")} text={t('sell.section1.card3.button')} variant='contained' color={'primary'} sx={{ padding: ".8rem 1rem" }} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box mt={7}>
                <Container maxWidth='md' sx={{ backgroundColor: "tertiary.main", color: '#fff' }}>
                    <Grid container spacing={3} margin={0}>
                        <Grid item xs={12} sm={7} padding={"3rem"} sx={{ display: "flex", alignItems: "center" }}>
                            <Box>
                                <Typography variant='h5' fontWeight={'500'} textAlign={'left'} mb={2}>{t('sell.section2.title')}</Typography>
                                <Typography variant='body2' textAlign={'left'}>{t('sell.section2.note')}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={5} sx={{ "&.MuiGrid-root": { paddingTop: "0" } }}>
                            <img src={SideHouse} alt="sidehouse" />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box mt={4}>
                <Container maxWidth='lg'>
                    <Box mb={6}>
                        <Box textAlign={'center'} sx={{ width: { sm: '80%', md: '60%', lg: '60%' }, margin: '4rem auto' }}>
                            <Typography variant='h5' mb={2} color={'primary'} sx={{ fontWeight: 500 }}>{t('sell.marketing.title')}</Typography>
                            <Typography paragraph>{t('sell.marketing.note')}</Typography>
                        </Box>
                        <Grid container spacing={4}>
                            {
                                marketing?.map((item, index) => {
                                    return (
                                        <Grid key={index} item xs={12} sm={12} md={6} lg={6} sx={{ textAlign: 'center', padding: '2rem !important' }}>
                                            <Typography variant='h6' mb={2}>{item.title}</Typography>
                                            <Typography paragraph variant='body1'>{item.copy}</Typography>
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                    </Box>
                </Container>

                {/* Login prompt */}
                <Dialog open={loginPrompt} onClose={() => { setLoginPrompt(false) }} fullWidth maxWidth='xs'>
                    <DialogContent>
                        <IconButton sx={{ position: "absolute", right: "5px", top: "5px" }} onClick={() => setLoginPrompt(false)}><Close /></IconButton>
                        <Typography textAlign={"center"}>{t('loginprompt.note1')}</Typography>

                        <Box mt={2} sx={{ display: "flex", justifyContent: "center" }} onClick={() => navigate('/login')}>
                            <PillButton
                                text={t('navbar.login')}
                                size="small"
                                width={{ xs: '100px', sm: '140px', md: '140px', lg: "140px" }}
                                borderColor=""
                                color="#FFFFFF"
                                backgroundColor="#1267B1"
                                startIcon={login}
                                variant="contained"
                            />
                        </Box>

                        <Typography mt={1} textAlign={"center"}>{t('loginprompt.note2')}</Typography>

                        <Box mt={1} sx={{ display: "flex", justifyContent: "center" }} onClick={() => navigate('/signup')}>
                            <PillButton
                                text={t('navbar.signup')}
                                size="small"
                                width="140px"
                                borderColor="rgba(0, 0, 0, 0.3)"
                                color="#000000"
                                startIcon={signUp}
                                variant="outlined"
                            />
                        </Box>

                        <Typography mt={1} textAlign={"center"}>{t('loginprompt.note4')}</Typography>
                    </DialogContent>
                </Dialog>

                <Dialog open={openSellForm} onClose={() => { setOpenSellForm(false) }} fullWidth maxWidth='sm'>
                    <DialogContent>
                        <SellForm setOpenSellForm={setOpenSellForm} />
                    </DialogContent>
                </Dialog>

            </Box>
        </motion.div>
    )
}

export default Sell