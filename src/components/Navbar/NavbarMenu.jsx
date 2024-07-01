import React, {useContext} from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { Avatar, Box, Divider, Grid, Hidden, MenuItem, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTranslation } from 'react-i18next';
import PillButton from '../Buttons/PillButton';
import { getUserType } from '../../services/auth'
import { Language } from '@mui/icons-material';
import RateContext from '../../contexts/rateContext';

function NavbarMenu({ logout, handleCloseNavbarMenu, userData }) {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const ExContext = useContext(RateContext);

    return (
        <>
            <Box sx={{ p: { xs: '.5rem', sm: '.5rem 1rem', md: '1rem', lg: '1rem' } }} >
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={4} sx={{ display: "flex", justifyContent: "center" }}>
                        <Avatar alt="" src={ExContext.thumbnail(userData.avatar)} sx={{ width: 70, height: 70 }} />
                    </Grid>

                    <Grid item xs={12} sm={8} display="flex" justifyContent="center">
                        <div>
                            <p className='text-[#032A64] text-center mb-1'>{userData?.firstName} {userData?.lastName}</p>
                            <p className='text-slate-600 text-center text-[12px] mb-2'>{t('signuptype.'+(getUserType() === 'realtor' && !userData?.NAR ? 'broker' : getUserType()))}</p>
                            <NavLink to={getUserType() === "agent" || getUserType() === "developer" || getUserType() === "realtor" ? "/broker/dashboard" : getUserType() === "admin" || getUserType() === "support" ? "/admin/dashboard" : "/client/profile"} onClick={() => { handleCloseNavbarMenu() }}>
                                <PillButton
                                    text={t('menu.manageAccount')}
                                    size="small"
                                    width="140px"
                                    borderColor=""
                                    color="#FFFFFF"
                                    backgroundColor="#1267B1"
                                    variant="contained"
                                />
                            </NavLink>
                        </div>
                    </Grid>
                </Grid>

            </Box>
            {
                getUserType() === "agent" || getUserType() === "developer" || getUserType() === "realtor" ?
                    <Hidden mdUp>
                        <>
                            <Divider sx={{ my: '1rem' }} />
                            <Box>
                                <MenuItem onClick={() => {
                                    navigate('/broker/dashboard')
                                    handleCloseNavbarMenu()
                                }} sx={{ fontSize: '1rem' }}>{t('agentdashboard.sidebar.home')}</MenuItem>
                                <MenuItem onClick={() => {
                                    navigate('/broker/listings')
                                    handleCloseNavbarMenu()
                                }} sx={{ fontSize: '1rem' }}>{t('agentdashboard.sidebar.listings')}</MenuItem>
                                {/* <MenuItem onClick={() => { navigate('/broker/subscription'); handleCloseNavbarMenu() }} sx={{ fontSize: '1rem' }}>{t('agentdashboard.sidebar.subscription')}</MenuItem> */}
                                <MenuItem onClick={() => { navigate('/broker/stats'); handleCloseNavbarMenu() }} sx={{ fontSize: '1rem' }}>{t('agentdashboard.sidebar.stats')}</MenuItem>
                                <MenuItem sx={{ fontSize: '1rem' }}>{t('agentdashboard.sidebar.messages')}</MenuItem>
                                {/* <MenuItem onClick={() => { navigate('/broker/customer-search'); handleCloseNavbarMenu() }} sx={{ fontSize: '1rem' }}>{t('agentdashboard.sidebar.salesdb')}</MenuItem> */}
                            </Box>
                            <Divider sx={{ my: '1rem' }} />
                            {!userData?.onboardingComplete && !userData?.company?.onboardingComplete && !userData?.subscription?.status === 'disabled' ?
                            <MenuItem onClick={() => { navigate('/broker/onboard'); handleCloseNavbarMenu() }} sx={{ fontSize: '1rem' }} dangerouslySetInnerHTML={{ __html: t('agentdashboard.sidebar.continueonboading') }}/>
                            : null}
                            <MenuItem onClick={() => { navigate('/broker/help'); handleCloseNavbarMenu() }} sx={{ fontSize: '1rem' }}>{t('agentdashboard.sidebar.gethelp')}</MenuItem>
                        </>
                    </Hidden>
                    :
                    <Hidden mdUp>
                        <>
                            <Divider sx={{ my: '1rem' }} />
                            <Box>
                                <MenuItem onClick={() => navigate('/client/profile')} sx={{ fontSize: '1rem' }}>{t('dashboard.profile.profile')}</MenuItem>
                                <MenuItem onClick={() => navigate('/client/wishlist')} sx={{ fontSize: '1rem' }}>{t('dashboard.wishlist.wishlist')}</MenuItem>
                                <MenuItem onClick={() => navigate('/client/messages')} sx={{ fontSize: '1rem' }}>{t('dashboard.messages.messages')}</MenuItem>
                                <MenuItem onClick={() => navigate('/client/notifications')} sx={{ fontSize: '1rem' }}>{t('dashboard.notifications.notifications')}</MenuItem>
                            </Box>

                        </>
                    </Hidden>
            }


            <Box sx={{
                bgcolor: 'secondary.main', alignItems: 'center',
                mt: '1rem', mb: '-8px'
            }} className='p-5 flex justify-between'>
                <NavLink to='/' onClick={() => { handleCloseNavbarMenu() }}>
                    <span style={{ display: 'flex', gap: '7px', color: '#fff', cursor: 'pointer' }}>
                    <Language fontSize='small' />
                    <Typography variant='body2'>{t('menu.mainsite')}</Typography>
                </span>
                </NavLink>
                <div onClick={logout} style={{ display: 'flex', gap: '7px', color: '#fff', cursor: 'pointer' }}>
                    <LogoutIcon fontSize='small' />
                    <Typography variant='body2'>{t('logout')}</Typography>
                </div>
            </Box>
        </>
    )
}

export default NavbarMenu