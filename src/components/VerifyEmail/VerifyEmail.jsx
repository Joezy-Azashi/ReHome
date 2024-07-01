import React, { useState } from 'react'
import { DialogContent, Box, Typography, CircularProgress } from '@mui/material';
import RoundButton from '../Buttons/RoundButton';
import { useTranslation } from "react-i18next";
import { useSnackbar } from 'notistack'
import Api from '../../api/api';
import Verify from "../../assets/images/verifyemail.svg"

function VerifyEmail({handleCloseVerificationPrompt}) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);

    const getVerificationEmail = () => {
        setLoading(true)
        Api().get("/verify/email")
            .then((res) => {
                handleCloseVerificationPrompt()
                setLoading(false)
                enqueueSnackbar(res.data, { variant: 'success' });
            })
    }

    return (
        <>
            <DialogContent sx={{ padding: "0", textAlign: "center" }}>
                <Box height={'360px'}>
                    <Box height={'40%'} bgcolor={'#EFEFEF'} sx={{ display: "flex", justifyContent: "center"}}>
                        <img src={Verify} alt="" width={240} className='absolute top-[-60px]'/>
                    </Box>
                    <Box sx={{ padding: "12px" }}>
                        <Typography sx={{ fontWeight: 700 }}>{t('verify.title')}</Typography>
                        <Typography sx={{ marginTop: "20px" }}>{t('verify.instruction')}</Typography>

                        <div onClick={getVerificationEmail} style={{ display: "flex", justifyContent: "center" }}>
                            <RoundButton
                                type="submit"
                                sx={{ padding: '.5rem 1.5rem', display: 'flex', mt: '2rem', backgroundColor: "#599902", color: "white", '&:hover': {backgroundColor: "#599902"} }}
                                text={loading || t('verify.button')}
                                progress={loading && (
                                    <CircularProgress
                                        size={20}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: "white"
                                        }}
                                    />
                                )}

                                variant='outlined'
                                disableElevation
                            />
                        </div>
                    </Box>
                </Box>
            </DialogContent>
        </>
    )
}

export default VerifyEmail