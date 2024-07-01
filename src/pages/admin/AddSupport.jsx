import React, { useState } from 'react'
import { Dialog, DialogContent, DialogActions, Box, Typography, FormLabel, Grid, TextField, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import RoundButton from '../../components/Buttons/RoundButton';
import Api from '../../api/api';

function AddSupport({ openAddSupport, setOpenAddSupport }) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const onAddSupport = () => {

        if (firstName === "" || lastName === "" || phone === "" || email === "") {
            setError(true)
            enqueueSnackbar(t('admindashboard.addsupport.error'), { variant: 'error' });
        } else {
            const data = {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email,
                userType: "support"
            }
            setLoading(true)
            Api().post('/users', data)
                .then((res) => {
                    Api().post("/request-password", { email: email.toLowerCase() })
                        .then((response) => {
                            setLoading(false)
                            enqueueSnackbar(t('admindashboard.addsupport.success'), { variant: 'success' });
                            setOpenAddSupport(false)
                            setFirstName("")
                            setLastName("")
                            setPhone("")
                            setEmail("")
                        })
                        .catch((error) => {
                            setLoading(false)
                        })
                })
                .catch((error) => {
                    setLoading(false)
                })
        }
    }

    return (
        <Dialog open={openAddSupport} onClose={() => setOpenAddSupport(false)} fullWidth maxWidth="xs">
            <DialogContent>
                <Box>
                    <form onSubmit={onAddSupport}>
                        <Typography variant={"h6"} textAlign={'center'}>{t('admindashboard.addsupport.title')}</Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('admindashboard.addsupport.firstname')}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    size="small"
                                    value={firstName}
                                    error={firstName?.length > 0 ? false : error}
                                    onChange={(e) => { setFirstName(e.target.value); setError(false) }}
                                    placeholder={t('admindashboard.addsupport.firstname')}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('admindashboard.addsupport.lastname')}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    size="small"
                                    value={lastName}
                                    error={lastName?.length > 0 ? false : error}
                                    onChange={(e) => { setLastName(e.target.value); setError(false) }}
                                    fullWidth
                                    placeholder={t('admindashboard.addsupport.lastname')}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('admindashboard.addsupport.phone')}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    size="small"
                                    type="number"
                                    onKeyDown={(e) => {
                                        if (e.keyCode === 38 || e.keyCode === 40) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onWheel={(e) => e.target.blur()}
                                    value={phone}
                                    error={phone?.length > 0 ? false : error}
                                    onChange={(e) => { setPhone(e.target.value); setError(false) }}
                                    fullWidth
                                    placeholder={t('admindashboard.addsupport.phone')}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('admindashboard.addsupport.email')}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    size="small"
                                    type="email"
                                    value={email}
                                    error={email?.length > 0 ? false : error}
                                    onChange={(e) => { setEmail(e.target.value); setError(false) }}
                                    fullWidth
                                    placeholder={t('admindashboard.addsupport.email')}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </DialogContent>
            <DialogActions sx={{ padding: "0 20px 20px 0" }}>
                <RoundButton onClick={() => setOpenAddSupport(false)} text={t('admindashboard.addsupport.cancel')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
                <RoundButton
                    onClick={() => onAddSupport()}
                    progress={loading && (
                        <CircularProgress
                            size={20}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: "primary",
                                margin: "3px 0"
                            }}
                        />
                    )}
                    text={loading || t('admindashboard.addsupport.add')}
                    disableElevation
                    variant={'outlined'}
                    sx={{ padding: '.5rem 1.5rem' }}
                />
            </DialogActions>
        </Dialog>
    )
}

export default AddSupport