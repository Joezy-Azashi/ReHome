import React, { useState } from 'react'
import {alpha, Dialog, DialogContent, Box, Typography,TextField, CircularProgress, Chip } from '@mui/material';
import RoundButton from './Buttons/RoundButton';
import { useTranslation } from "react-i18next";
import { useSnackbar } from 'notistack'
import Api from '../api/api';

function WishListEmail({showPopup, executeRecaptcha, setShowPopup, selectedProperties, wishlistId}) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const sendWishListEmail = async () => {
        if(!message){
            enqueueSnackbar(t('dashboard.wishlist.email.no_message_error'), { variant: 'error' });
            return
        }

        const token = await executeRecaptcha('contactAgentForm')

        setLoading(true)
        Api().post(`/wishlists/${wishlistId}/email`,{
            text: message,
            rehomePropertyIds: selectedProperties.map(x=>x.id),
            recaptcha: token
        })
        .then((res) => {
            setShowPopup(false)
            setLoading(false)
            enqueueSnackbar(res.data, { variant: 'success' });
        })
    }

    return (
        <>
        <Dialog
                open={showPopup}
                keepMounted
                onClose={()=> setShowPopup(false)}
                fullWidth
                sx={{
                    '& .MuiPaper-root': { maxWidth: '500px', borderRadius: '30px' },
                    border: '1px solid #707070',
                    backgroundColor: 'rgb(3,42,100, 60%)',
                    borderRadius: '0',
                    scrollbarWidth: "none",
                }}
                PaperProps={{
                    sx: {
                        overflow: "visible"
                    },
                }}
            >
                
                <DialogContent sx={{ padding: "0" }}>
                    <Box minHeight={'380px'} display={"flex"} flexDirection={'column'}>
                        <Box padding={"10px"} paddingLeft={"20px"} sx={{background: alpha('#1267B1', .05), borderBottom: '1px solid lighgrey' }}>
                            <Typography fontSize={"18px"} fontWeight={600}>{t('dashboard.wishlist.email.title')}</Typography>
                            <Typography fontSize={"12px"} width={"75%"}>{t('dashboard.wishlist.email.description')}</Typography>
                        </Box>

                        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent:'space-between', alignItems: 'flex-end'}} padding={"10px"} px={"20px"} height={"100%"} borderRadius={"0 0 30px 30px"} >
                            <Box marginBottom={'10px'} width={'100%'} display={'box'} gap={'10px'}>
                                {
                                    selectedProperties?.map((el, index) => {
                                        return (
                                            <Chip size='small' sx={{bgcolor: 'lightgrey', color: 'secondary.main', marginRight: '5px'}} label={el?.name} />
                                        )
                                    })
                                }
                            </Box>
                            
                            <TextField
                                sx={{
                                    marginBottom: '1rem',
                                    '& .MuiOutlinedInput-root': {
                                        background: '#fff',
                                        borderRadius: '25px'
                                    }
                                }}
                                size="small"
                                value={message}
                                onChange={(e) => { setMessage(e.target.value) }}
                                fullWidth
                                multiline
                                rows={7}
                                placeholder={t('dashboard.wishlist.email.messageplaceholder')}/>


                          
                            <Box sx={{display: 'flex', alignItems: 'flex-end', gap: '10px'}} >
                                <RoundButton 
                                    onClick={() => sendWishListEmail()} 
                                    text={t('dashboard.wishlist.button.send')} 
                                    disableElevation 
                                    variant={'contained'} 
                                    sx={{ padding: '.5rem 1.5rem', bottom: 0 }} 
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
                                    )}/>
                                <RoundButton 
                                onClick={() => {setMessage(""); setShowPopup(false)}} 
                                text={t('dashboard.wishlist.button.cancel')} 
                                disableElevation variant={'outlined'} sx={{ padding: '.5rem 1.5rem' }} />
                            </Box>
                        </Box>

                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default WishListEmail