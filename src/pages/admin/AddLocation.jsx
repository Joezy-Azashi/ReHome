import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogActions, Box, Typography, FormLabel, Grid, TextField, CircularProgress, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import RoundButton from '../../components/Buttons/RoundButton';
import Api from '../../api/api';

function AddLocation({ openAddLocation, setOpenAddLocation, getLocations }) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const [label, setLabel] = useState("")
    const [longitude, setLongitude] = useState("")
    const [latitude, setLatitude] = useState("")
    const [country, setCountry] = useState("ghana")
    const [countries, setCountries] = useState(["ghana"])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (openAddLocation?.data?.label) {
            setLabel(openAddLocation?.data?.label)
            setLongitude(openAddLocation?.data?.longitude)
            setLatitude(openAddLocation?.data?.latitude)
            setCountry(openAddLocation?.data?.country ?? 'ghana')
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openAddLocation?.data?.label])

    useEffect(() => {
        Api().get('constants/countries')
            .then((res) => {
                setCountries(res?.data)
            })
            .catch((error) => {

            })
    },[])

    const clearData = () => {
        setLabel('')
        setLongitude('')
        setLatitude('')
        setCountry('ghana')
    }

    const onAddLocation = () => {
        if (label === "" || longitude === "" || latitude === "") {
            setError(true)
            enqueueSnackbar(t('admindashboard.addsupport.error'), { variant: 'error' });
        } else {
            const data = {
                label: label,
                longitude: Number(longitude),
                latitude: Number(latitude),
                country: country,
                active: true
            }

            setLoading(true)

            if (openAddLocation?.data?.label) {
                Api().patch(`/constants/locations/${openAddLocation?.data?.id}`, data)
                    .then((res) => {
                        setLoading(false)
                        setOpenAddLocation({ open: false })
                        clearData()
                        getLocations()
                    })
                    .catch((error) => {
                        setLoading(false)
                    })
            } else {
                Api().post('/constants/locations', data)
                    .then((res) => {
                        setLoading(false)
                        setOpenAddLocation({ open: false })
                        clearData()
                        getLocations()
                    })
                    .catch((error) => {
                        setLoading(false)
                    })
            }
        }
    }

    return (
        <Dialog open={openAddLocation?.open} onClose={() => { setOpenAddLocation({ open: false }); clearData() }} fullWidth maxWidth="xs">
            <DialogContent>
                <Box>
                    <form onSubmit={onAddLocation}>
                        <Typography variant={"h6"} textAlign={'center'} mb={2}>{openAddLocation?.data?.label ? t('admindashboard.location.edit') : t('admindashboard.location.add')}</Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{t('admindashboard.location.table.heading.label')}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    size="small"
                                    value={label}
                                    error={label?.length > 0 ? false : error}
                                    onChange={(e) => { setLabel(e.target.value); setError(false) }}
                                    placeholder={t('admindashboard.location.table.heading.label')}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{t('admindashboard.location.table.heading.longitude')}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    size="small"
                                    type='number'
                                    onKeyDown={(e) => {
                                        if (e.keyCode === 38 || e.keyCode === 40) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onWheel={(e) => e.target.blur()}
                                    value={longitude}
                                    error={longitude?.length > 0 ? false : error}
                                    onChange={(e) => { setLongitude(e.target.value); setError(false) }}
                                    fullWidth
                                    placeholder={t('admindashboard.location.table.heading.longitude')}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{t('admindashboard.location.table.heading.latitude')}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    size="small"
                                    type='number'
                                    onKeyDown={(e) => {
                                        if (e.keyCode === 38 || e.keyCode === 40) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onWheel={(e) => e.target.blur()}
                                    value={latitude}
                                    error={latitude?.length > 0 ? false : error}
                                    onChange={(e) => { setLatitude(e.target.value); setError(false) }}
                                    fullWidth
                                    placeholder={t('admindashboard.location.table.heading.latitude')}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{t('admindashboard.location.table.heading.country')}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    select
                                    size="small"
                                    value={country}
                                    error={country?.length > 0 ? false : error}
                                    onChange={(e) => { setCountry(e.target.value); setError(false) }}
                                    placeholder={t('admindashboard.location.table.heading.label')}
                                    fullWidth
                                >
                                    {countries.map(c => (
                                        <MenuItem key={c.key} value={c.key}>{t('agentdashboard.addlisting.tab1.country.'+c.key)}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </DialogContent>
            <DialogActions sx={{ padding: "0 20px 20px 0" }}>
                <RoundButton onClick={() => { setOpenAddLocation({ open: false }); clearData() }} text={t('admindashboard.addsupport.cancel')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
                <RoundButton
                    onClick={() => onAddLocation()}
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

export default AddLocation