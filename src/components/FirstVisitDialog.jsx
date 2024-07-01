import React, { useEffect, useState } from 'react'
import { Box, CircularProgress, DialogContent, Grid, IconButton, TextField, Typography } from '@mui/material'
import { Close, KeyboardArrowRight } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Api from '../api/api';
import RoundButton from './Buttons/RoundButton';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useSnackbar } from 'notistack';
import validator from "validator";

function FirstVisitDialog({ setOpenVisitDialog }) {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();

    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)

    const subscribeNewsletter = async () => {
        if (!validator.isEmail(email)) {
            enqueueSnackbar(t('createaccount.validation.email'), { variant: 'error' });
        } else if (validator.isEmpty(name)) {
            enqueueSnackbar(t('createaccount.validation.name'), { variant: 'error' });
        } else  {
            setLoading(true);
            const token = await executeRecaptcha('contactusForm')
            if (token.length > 0) {
                Api().post('/newsletter/subscribe', {
                    name: name,
                    email: email,
                    recaptcha: token
                })
                    .then(res => {
                        setLoading(false)
                        setOpenVisitDialog(false)
                    })
                    .catch((error) => {
                        setLoading(false)
                        enqueueSnackbar('Error', { variant: 'error' })
                    })
            }
        }
    }

    const dialogNotes = [t('firsttimevisit.note1'), t('firsttimevisit.note2'), t('firsttimevisit.note3')];
    const [randomNote, setRandomNote] = useState("")
    useEffect(() => {
        setRandomNote(dialogNotes[Math.floor(Math.random() * dialogNotes.length)])
    }, [])

    return (
        <DialogContent sx={{ padding: "0", backgroundImage: `linear-gradient( 180deg, rgba(0,0,0, 60%), rgba(0,0,0, 60%)), url(https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600)`, backgroundSize: "cover", backgroundRepeat: "no-repeat" }}>
            <IconButton onClick={() => setOpenVisitDialog(false)} sx={{ float: "right" }}><Close color="paper" /></IconButton>
            <Box sx={{ padding: "30px 30px 10px 30px", color: "paper.main" }}>
                <Typography fontSize={"2rem"} fontWeight={"600"} sx={{ textAlign: "center" }} mb={3}>{t('firsttimevisit.title')}</Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Typography variant='body2' width={"70%"} textAlign={"center"}>{randomNote}</Typography>
                </Box>
            </Box>
            <Box sx={{ padding: "10px 30px 30px 30px" }}>
                <Typography fontSize={"15px"} color={'paper.main'} fontWeight={'500'} sx={{ textAlign: "left", marginLeft: "17px" }} mb={1.8}><i>{t('firsttimevisit.label')}</i></Typography>
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
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            label={name?.length > 0 ? "" : t('admindashboard.users.table.heading.name')}
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
                </Grid>


                <Box sx={{ display: 'flex', justifyContent: "center" }}>
                    <RoundButton
                        onClick={subscribeNewsletter}
                        size={'small'}
                        disableElevation={true}
                        fullWidth
                        endIcon={!loading && <KeyboardArrowRight />}
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

export default FirstVisitDialog