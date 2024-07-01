import React, { useState } from 'react'
import { Typography, CircularProgress, Box, Grid, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab'
import { useTranslation } from "react-i18next";
import buyerrenter from "../../assets/images/buyer01.png"
import individualSeller from "../../assets/images/developer01.png"
import realtor from "../../assets/images/realtor01.png"
import agent from "../../assets/images/agent01.png"
import { motion } from "framer-motion";
import { useSnackbar } from 'notistack';
import Api from '../../api/api';

function SelectUserType() {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const [userType, setUserType] = useState("")
    const [background, setBackground] = useState("")
    const [loading, setLoading] = useState(false);

    const getType = (string) => {
        setUserType(string)
        setBackground(string)
    }

    const onUserTypeSelect = () => {
        if (userType === "") {
            enqueueSnackbar(t('createaccount.validation.choosetype'), { variant: 'error' });
        } else {
            setLoading(true)
            Api().patch('/me', { userType: userType })
                .then((response) => {
                    setLoading(false)

                    if ((response?.data?.userType === "agent" || response?.data?.userType === "developer" || response?.data?.userType === "realtor") && !response?.data?.onboardingComplete) {
                        window.location.assign("/broker/onboard")
                    } else if (response?.data?.userType === "agent" || response?.data?.userType === "developer" || response?.data?.userType === "realtor") {
                        window.location.assign("/broker/dashboard")
                    } else {
                        window.location.assign("/")
                    }
                })
                .catch((error) => {
                    setLoading(false)
                })
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Container maxWidth='xl' sx={{ height: '100%' }}>
                <div className='py-24 px-8'>
                    <div className=''>
                        <Typography variant='h3' mb={5} textAlign={'center'}>{t('signuptype.choosetype')}</Typography>
                        <Grid container spacing={4}>
                            <Grid item xs={6} lg={3} className="w-full">
                                <div onClick={() => { getType("customer") }} className="cursor-pointer w-full">
                                    <div className='border border-[#bfbfbf]  rounded-xl' style={{ backgroundColor: background === "customer" ? "#bfbfbf" : "" }}>
                                        <img src={buyerrenter} style={{ margin: '.8rem auto', display: 'block' }} alt="buyer" width={'50%'} className='md:m-3 m-1' />
                                    </div>
                                    <p className='mt-2 text-[14px] font-semibold text-center'>{t('signuptype.buyerRenter')}</p>
                                </div>
                            </Grid>

                            <Grid item xs={6} lg={3} className="w-full">
                                <div onClick={() => { getType("agent") }} className="cursor-pointer" >
                                    <div className='border border-[#bfbfbf]  rounded-xl' style={{ backgroundColor: background === "agent" ? "#bfbfbf" : "" }}>
                                        <img src={agent} style={{ margin: '.8rem auto', display: 'block' }} alt="agent" width={'50%'} className='md:m-3 m-1' />
                                    </div>
                                    <p className='mt-2 text-[14px] font-semibold text-center'>{t('signuptype.agent')}</p>
                                </div>
                            </Grid>

                            <Grid item xs={6} lg={3} className="w-full">
                                <div onClick={() => { getType("realtor") }} className="cursor-pointer">
                                    <div className='border border-[#bfbfbf]  rounded-xl' style={{ backgroundColor: background === "realtor" ? "#bfbfbf" : "" }}>
                                        <img src={realtor} style={{ margin: '.8rem auto', display: 'block' }} alt="realtor" width={'50%'} className='md:m-3 m-1' />
                                    </div>
                                    <p className='mt-2 text-[14px] font-semibold text-center'>{t('signuptype.realtorBroker')}</p>
                                </div>
                            </Grid>

                            <Grid item xs={6} lg={3} className="w-full">
                                <div onClick={() => { getType("developer") }} className="cursor-pointer w-full">
                                    <div className='border border-[#bfbfbf] rounded-xl' style={{ backgroundColor: background === "developer" ? "#bfbfbf" : "" }}>
                                        <img src={individualSeller} style={{ margin: '.8rem auto', display: 'block' }} alt="developer" width={'50%'} className='md:m-3 m-1' />
                                    </div>
                                    <p className='mt-2 text-[14px] font-semibold text-center'>{t('signuptype.developer')}</p>
                                </div>
                            </Grid>
                        </Grid>

                        <Box mt={5} sx={{ display: "flex", justifyContent: "center" }}>
                            <LoadingButton
                                size='large'
                                width={200}
                                disableElevation
                                variant='contained'
                                color='secondary'
                                sx={{ textTransform: 'none', borderRadius: '10px' }}
                                onClick={onUserTypeSelect}
                                disabled={loading}
                            >
                                {loading ? (
                                    <CircularProgress
                                        size={20}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: "white",
                                            margin: "4px 0"
                                        }}
                                    />
                                ) : t("signuptype.apply")}
                            </LoadingButton>
                        </Box>
                    </div>
                </div>
            </Container>
        </motion.div>
    )
}

export default SelectUserType