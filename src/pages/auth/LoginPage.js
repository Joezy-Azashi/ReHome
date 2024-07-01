import { Box, Button, FormLabel, Grid, InputAdornment, Tab, TextField, Typography } from '@mui/material'
import cLogo from '../../assets/images/christmas_navLogo.png'
import Logo from '../../assets/images/navLogo.png'
import Auth from '../../assets/images/loginAuth.png'
import LoginBg from '../../assets/images/loginBG.svg'
import GoogleSVG from '../../assets/images/google.svg'
import { useTranslation } from "react-i18next";
import buyerrenter from "../../assets/images/buyerrenter.png"
import individualSeller from "../../assets/images/individualseller.png"
import realtor from "../../assets/images/realtor.png"
import agent from "../../assets/images/agent.png"
import React from 'react'
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab'
import { useState } from 'react'
import { Apple, Facebook, Mail, VisibilityOff } from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import moment from 'moment'

const LoginPage = ({setType}) => {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const [value, setValue] = useState('1')
    const [background, setBackground] = useState("")
    const path = useLocation().pathname.split('/')[1]

    useEffect(()=> {
        if(path === 'signup'){
            setValue('2')
        }
    },[path])

    const getType = (string) => {
        setType(string)
        setBackground(string)
    }
    
    const handleChange = (event, newValue) => {
        if(newValue === '1'){
            setValue(newValue);
            navigate('/login')
        }else{
            navigate('/signup')
        }
      };
  
  return (
    <Box sx={{zIndex: 99}}>
        <Grid container sx={{height: '100vh'}}>
            <Grid item sm={6} sx={{ height: '100%'}}>
                <Box sx={{ 
                        padding: '6rem 0', 
                        height: '100%', width: '70%', 
                        margin: '0 auto', textAlign: 'center', 
                        display: 'flex', justifyContent: 'center', 
                        flexDirection: 'column',
                        backgroundImage: `url(${LoginBg})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                    }}>
                    <img onClick={()=> navigate('/')} src={moment().month() === 0 ? cLogo : Logo} width='30%' style={{margin: '0 auto', display: 'block', cursor: 'pointer'}} alt='logo' />
                    <Typography mt={'5rem'} mb={1} variant='h4' sx={{fontWeight: 600}}>Premium Experience</Typography>
                    <Typography mb={'5rem'} variant='body2'>Seamless experience whiles finding the next big thing, <br/>your own property. It’s easy, fast and affordable</Typography>

                    <img src={Auth} width='90%' style={{margin: '0 auto', display: 'block'}} alt='login' />
                </Box>
            </Grid>
            
            <Grid item sm={6} sx={{ height: '100%', width: '100%', bgcolor: '#F8F8F8' }}>
                <Box height='100%' sx={{width: '50%', margin: '0 auto', display: 'flex',flexDirection: 'column', justifyContent: 'center'}}>
                    <TabContext value={value} sx={{ '& #panel1': {padding: '0 !important'}}}>
                        <Box sx={{ padding: '.5rem 0', borderBottom: '1px solid lightgrey', color: '#fff' }}>
                            <TabList 
                                TabIndicatorProps={{ style: { backgroundColor: '#67B40D', height: '6px', borderRadius: '50px' } }} 
                                variant='fullWidth' indicatorColor='primary' sx={{marginBottom: '-10px'}} onChange={handleChange}>
                                <Tab disableRipple sx={{textTransform: 'none', fontSize: '1.1rem'}} label="Login" value="1" />
                                <Tab disableRipple sx={{textTransform: 'none', fontSize: '1.1rem'}} label="Sign up" value="2" />
                            </TabList>
                        </Box>

                        <TabPanel value='1' id='panel1'>
                            <Box mt={'2rem'}>
                                <FormLabel sx={{mb: '.5rem', display: 'block', fontWeight: 500, color: '#000'}}>Email</FormLabel>
                                <TextField sx={{
                                    mb: '2rem',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '15px',
                                        background: '#fff'
                                    }
                                }} variant='outlined' type={'email'} fullWidth placeholder='Email address' InputProps={{
                                    endAdornment: <InputAdornment position='start'><Mail fontSize='small' /></InputAdornment>
                                }} />
                                <FormLabel  sx={{mb: '.5rem', display: 'block', fontWeight: 500, color: '#000'}}>Password</FormLabel>
                                <TextField sx={{ 
                                    mb: '2rem',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '15px',
                                        background: '#fff'
                                    }
                                    }} variant='outlined' type={'password'} fullWidth placeholder='Password' InputProps={{
                                    endAdornment: <InputAdornment position='start'><VisibilityOff fontSize='small' /></InputAdornment>
                                }} />
                                <LoadingButton size='large' disableElevation fullWidth variant='contained' color='secondary' 
                                sx={{textTransform: 'none', borderRadius: '10px'}}>Login</LoadingButton>
                                <Typography mt={'1rem'} textAlign={'center'} variant='body2'>Forgot Password</Typography>
                            </Box>
                            
                            <Box sx={{mt: '3rem', '& span': {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '1rem'
                            }}}>
                                <Typography mb={'1rem'} mt={'2rem'} textAlign={'center'} variant='body2'>Or connect with</Typography>
                                <span>
                                    <Button variant='contained' disableElevation sx={{bgcolor: '#000', textTransform: 'none'}} startIcon={<Apple fontSize='small' />}>Apple</Button>
                                    <Button variant='outlined' disableElevation sx={{bgcolor: '#fff', textTransform: 'none'}} startIcon={<img src={GoogleSVG} alt='google-auth' />}>Google</Button>
                                    <Button variant='contained' disableElevation sx={{ textTransform: 'none', color: '#fff'}} color='tertiary' startIcon={<Facebook fontSize='small' />}>Facebook</Button>
                                </span>
                            </Box>
                        </TabPanel>

                        {/* SignUp */}
                        <TabPanel value='2' sx={{ padding: '0 !important'}}>
                            <Typography mb={2} textAlign={'center'}>Choose User Type</Typography>
                            <div style={{gap: '10px'}} className="flex justify-between">
                                <div onClick={() => { getType("customer") }} className="cursor-pointer">
                                    <div className='border border-[#1267B1] rounded-xl' style={{ backgroundColor: background === "customer" ? "#1267B1" : "" }}>
                                        <img src={buyerrenter} alt="" width={70} className='md:m-3 m-1' />
                                    </div>
                                    <p className='mt-2 text-[10px] font-semibold text-center'>{t('signuptype.buyerRenter')}</p>
                                </div>
                                <div onClick={() => { getType("agent") }} className="cursor-pointer">
                                    <div className='border border-[#FC0000] rounded-xl' style={{ backgroundColor: background === "agent" ? "#EA0606" : "" }}>
                                        <img src={agent} alt="" width={70} className='md:m-3 m-1' />
                                    </div>
                                    <p className='mt-2 text-[10px] font-semibold text-center'>{t('signuptype.agent')}</p>
                                </div>
                                <div onClick={() => { getType("seller") }} className="cursor-pointer">
                                    <div className='border border-[#03254C] rounded-xl' style={{ backgroundColor: background === "seller" ? "#03254C" : "" }}>
                                        <img src={individualSeller} alt="" width={70} className='md:m-3 m-1' />
                                    </div>
                                    <p className='mt-2 text-[10px] font-semibold text-center'>{t('signuptype.developer')}</p>
                                </div>
                                <div onClick={() => { getType("realtor") }} className="cursor-pointer">
                                    <div className='border border-[#03254C] rounded-xl' style={{ backgroundColor: background === "realtor" ? "#01153D" : "" }}>
                                        <img src={realtor} alt="" width={70} className='md:m-3 m-1' />
                                    </div>
                                    <p className='mt-2 text-[10px] font-semibold text-center'>{t('signuptype.realtorBroker')}</p>
                                </div>
                            </div>
                            <Box mt={'2rem'}>
                                <FormLabel sx={{mb: '.5rem', display: 'block', fontWeight: 500, color: '#000'}}>Email</FormLabel>
                                <TextField sx={{
                                    mb: '1.5rem',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '15px',
                                        background: '#fff'
                                    }
                                }} variant='outlined' type={'email'} fullWidth placeholder='Email address' InputProps={{
                                    endAdornment: <InputAdornment position='start'><Mail fontSize='small' /></InputAdornment>
                                }} />

                                <FormLabel  sx={{mb: '.5rem', display: 'block', fontWeight: 500, color: '#000'}}>Password</FormLabel>
                                <TextField sx={{ 
                                    mb: '1.5rem',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '15px',
                                        background: '#fff'
                                    }}} variant='outlined' type={'password'} fullWidth placeholder='Password' InputProps={{
                                    endAdornment: <InputAdornment position='start'><VisibilityOff fontSize='small' /></InputAdornment>
                                }} />

                                <FormLabel  sx={{mb: '.5rem', display: 'block', fontWeight: 500, color: '#000'}}>Confirm Password</FormLabel>
                                <TextField sx={{ 
                                    mb: '2rem',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '15px',
                                        background: '#fff'
                                    }}} variant='outlined' type={'password'} fullWidth placeholder='Password' InputProps={{
                                    endAdornment: <InputAdornment position='start'><VisibilityOff fontSize='small' /></InputAdornment>
                                }} />

                                <LoadingButton size='large' disableElevation fullWidth variant='contained' color='secondary' 
                                sx={{textTransform: 'none', borderRadius: '10px'}}>Sign up</LoadingButton>
                                <Typography mt={'1rem'} textAlign={'center'} variant='body2'>Forgot Password?</Typography>
                            </Box>
                            
                            <Box sx={{mt: '3rem', '& span': {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '1rem'
                            }}}>
                                <Typography mb={'1rem'} mt={'2rem'} textAlign={'center'} variant='body2'>Or connect with</Typography>
                                <span>
                                    <Button variant='contained' disableElevation sx={{bgcolor: '#000', textTransform: 'none'}} startIcon={<Apple fontSize='small' />}>Apple</Button>
                                    <Button variant='outlined' disableElevation sx={{bgcolor: '#fff', textTransform: 'none'}} startIcon={<img src={GoogleSVG} alt='google-auth' />}>Google</Button>
                                    <Button variant='contained' disableElevation sx={{ textTransform: 'none', color: '#fff'}} color='tertiary' startIcon={<Facebook fontSize='small' />}>Facebook</Button>
                                </span>
                            </Box>
                        </TabPanel>
                    </TabContext>
                </Box>
            </Grid>
        </Grid>
    </Box>
  )
}

export default LoginPage