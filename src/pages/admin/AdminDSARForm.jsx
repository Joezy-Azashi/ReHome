import React, { useState } from 'react'
import { Box, CircularProgress, FormControlLabel, Grid, IconButton, InputAdornment, Paper, Radio, RadioGroup, TextField } from '@mui/material'
import DSARForm from '../../components/DSARForm'
import { Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import RoundButton from '../../components/Buttons/RoundButton';
import Api from '../../api/api';
import { useSnackbar } from 'notistack';

function AdminDSARForm() {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const [dsarId, setDsarId] = useState("")
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState("")

    const handleChange = (event) => {
        setFilter(event.target.value);
        setLoading(true)
        Api().patch(`dsars/${dsarId}`, { status: event.target.value })
            .then((res) => {
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
            })
    };

    const getDsarData = () => {
        if (!dsarId) {
            enqueueSnackbar(t('dsar.admin.placeholder'), { variant: 'error' });
        } else {
            setLoading(true)
            Api().get(`dsars/${dsarId}`)
                .then((res) => {
                    setData(res?.data)
                    setFilter(res?.data?.status)
                    setLoading(false)
                })
                .catch((error) => {
                    if (error?.response?.data?.error?.statusCode === 404) {
                        enqueueSnackbar(t('dsar.admin.notfound'), { variant: 'error' });
                    }
                    setLoading(false)
                })
        }
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Box sx={{ display: { xs: "block", md: 'flex' }, justifyContent: 'space-between', alignItems: 'center' }} mt={4} mx={2.1}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8} mb={2} sx={{ display: "flex", alignItems: "center" }}>
                        <RadioGroup
                            name="controlled-radio-buttons-group"
                            value={filter}
                            onChange={(e) => { handleChange(e) }}
                            row
                        >
                            <FormControlLabel
                                value="pending"
                                control={
                                    <Radio
                                        size="small"
                                    />
                                }
                                label={t('dsar.admin.pending')}
                            />
                            <FormControlLabel
                                value="processing"
                                control={
                                    <Radio
                                        size="small"
                                    />
                                }
                                label={t('dsar.admin.processing')}
                            />
                            <FormControlLabel
                                value="completed"
                                control={
                                    <Radio
                                        size="small"
                                    />
                                }
                                label={t('dsar.admin.completed')}
                            />
                            <FormControlLabel
                                value="paused"
                                control={
                                    <Radio
                                        size="small"
                                    />
                                }
                                label={t('dsar.admin.paused')}
                            />
                        </RadioGroup>
                        {loading &&
                            <CircularProgress
                            size={15}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: "primary"
                            }}
                        />
                        }
                    </Grid>

                    <Grid item xs={12} md={4} mb={2}>
                        <TextField fullWidth sx={{
                            // width: { xs: '100%', sm: '80%', lg: '35%' },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '50px'
                            }
                        }}
                            value={dsarId}
                            size='small'
                            onChange={(e) => setDsarId(e.target.value)}
                            variant='outlined'
                            placeholder={t('dsar.admin.placeholder')}
                            InputProps={{
                                endAdornment: <InputAdornment position='end'>
                                    {dsarId.length > 0 && <IconButton size='small' onClick={() => { setDsarId(""); setData() }}><Close fontSize='small' /></IconButton>}

                                </InputAdornment>
                            }}
                            onKeyDown={(event) => {
                                if (event.keyCode === 13) {
                                    getDsarData()
                                }
                            }
                            }
                        />
                    </Grid>
                </Grid>
            </Box>

            <DSARForm data={data} isAdmin={true} />
        </Paper>
    )
}

export default AdminDSARForm