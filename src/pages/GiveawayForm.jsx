import React, { useEffect, useState } from 'react'
import { Box, CircularProgress, Container, DialogContent, Grid, IconButton, TextField, Typography } from '@mui/material'
import RoundButton from '../components/Buttons/RoundButton'
import { useTranslation } from 'react-i18next';
import { Close } from '@mui/icons-material';
import { getCurrentUser } from '../services/auth';
import Api from '../api/api';
import { useSnackbar } from 'notistack'
import PhoneInput from 'react-phone-number-input'
import en from 'react-phone-number-input/locale/en'
import fr from 'react-phone-number-input/locale/fr'

function GiveawayForm({ openGiveaway, setOpenGiveaway, executeRecaptcha }) {

    const { t } = useTranslation();
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [email, setEmail] = useState("")
    const [location, setLocation] = useState("")
    const [phone, setPhone] = useState("")
    const [duration, setDuration] = useState("")
    const [loading, setLoading] = useState(false)
    const { enqueueSnackbar } = useSnackbar();

    useEffect(()=>{
        if(getCurrentUser()?.id){
            setFname(getCurrentUser()?.firstName);
            setLname(getCurrentUser()?.lastName);
            setEmail(getCurrentUser()?.email);
            setPhone(getCurrentUser()?.phone);
        }
    }, [])

    const submitGiveaway = async()=>{
        if(!fname || !lname || !email || !phone || !duration){
            return enqueueSnackbar(t('admindashboard.giveaway.popup.error'), { variant: 'error' });
        }

        if(!openGiveaway?.id) {
            setOpenGiveaway(false);
            return;
        }

        const token = await executeRecaptcha('giveawayForm')
        const data = {
            firstName: fname,
            lastName: lname,
            email: email,
            phone: phone,
            duration: duration,
            location: location, 
            recaptcha: token
        }

        Api().post(`/giveaways/${openGiveaway.id}/responses`, data)
        .then((res) => {
            if(res?.data){
                enqueueSnackbar(res?.data, { variant: 'success' });
                localStorage.setItem("GIVEAWAY_CODES", localStorage.getItem("GIVEAWAY_CODES")+`**${openGiveaway.id}**`);
                setOpenGiveaway(false);
            }
        })
        .catch((e) => {
            enqueueSnackbar(e.message, { variant: 'error' });
            setLoading(false)
        })
    }

    return (
        <DialogContent sx={{ padding: "0", backgroundImage: `linear-gradient( 180deg, rgba(0,0,0, 60%), rgba(0,0,0, 60%)), url(https://images.pexels.com/photos/1303082/pexels-photo-1303082.jpeg?cs=srgb&dl=pexels-george-dolgikh-1303082.jpg&fm=jpg)`, backgroundSize: "cover", backgroundRepeat: "no-repeat" }}>
            <IconButton onClick={() => setOpenGiveaway(false)} sx={{ float: "right" }}><Close color="paper" /></IconButton>
            <Box sx={{ padding: "30px 30px 10px 30px", color: "paper.main" }}>
                <Typography fontSize={"2rem"} fontWeight={"600"} sx={{ textAlign: "center" }} mb={3}>{openGiveaway?.title ? openGiveaway?.title[t('lang_code')] : "test"}</Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Typography variant='body2' width={"70%"} textAlign={"center"}>{openGiveaway?.description ? openGiveaway?.description[t('lang_code')]: ""}</Typography>
                </Box>
            </Box>
            <Box sx={{ padding: "10px 30px 30px 30px" }}>
                <Grid container spacing={2} mb={2.4}>
                    <Grid item xs={6}>
                        <TextField
                            sx={{
                                marginBottom: '',
                                '& .MuiOutlinedInput-root': {
                                    background: '#fff',
                                    borderRadius: '50px'
                                }
                            }}
                            size="small"
                            value={fname}
                            onChange={(e) => setFname(e.target.value)}
                            label={fname?.length > 0 ? "" : t('dashboard.profile.firstname')}
                            InputLabelProps={{ shrink: false }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            sx={{
                                marginBottom: '',
                                '& .MuiOutlinedInput-root': {
                                    background: '#fff',
                                    borderRadius: '50px'
                                }
                            }}
                            size="small"
                            value={lname}
                            onChange={(e) => setLname(e.target.value)}
                            label={lname?.length > 0 ? "" : t('dashboard.profile.lastname')}
                            InputLabelProps={{ shrink: false }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            sx={{
                                marginBottom: '',
                                '& .MuiOutlinedInput-root': {
                                    background: '#fff',
                                    borderRadius: '50px'
                                }
                            }}
                            size="small"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label={email?.length > 0 ? "" : t('admindashboard.users.table.heading.email')}
                            InputLabelProps={{ shrink: false }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <PhoneInput
                            placeholder={t('admindashboard.giveaway.popup.phone')}
                            labels={localStorage.getItem('i18nextLng') === 'en' ? en : fr}
                            international
                            initialValueFormat="national"
                            countryCallingCodeEditable={false}
                            defaultCountry="GH"
                            value={phone}
                            onChange={setPhone}
                            style={{
                                border: "1px solid #0000003b",
                                marginBottom: "1rem",
                                borderRadius: "50px",
                                padding: "8px 14px",
                                background: '#fff'
                            }}
                            className={"input-phone-number"}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            sx={{
                                marginBottom: '',
                                '& .MuiOutlinedInput-root': {
                                    background: '#fff',
                                    borderRadius: '50px'
                                }
                            }}
                            size="small"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            label={location?.length > 0 ? "" : t('admindashboard.giveaway.popup.location')}
                            InputLabelProps={{ shrink: false }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            sx={{
                                marginBottom: '',
                                '& .MuiOutlinedInput-root': {
                                    background: '#fff',
                                    borderRadius: '50px'
                                }
                            }}
                            size="small"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            label={duration?.length > 0 ? "" : t('admindashboard.giveaway.popup.duration')}
                            InputLabelProps={{ shrink: false }}
                            fullWidth
                        />
                    </Grid>
                </Grid>


                <Box sx={{ display: 'flex', justifyContent: "center" }}>
                    <RoundButton
                        onClick={()=> {submitGiveaway()}}
                        size={'small'}
                        disableElevation={true}
                        fullWidth
                        color={'primary'}
                        variant='contained'
                        sx={{ height: "2.6rem" }}
                        text={loading || t('firsttimevisit.button')}
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
                    />
                </Box>
            </Box>
        </DialogContent>
    )
}

export default GiveawayForm