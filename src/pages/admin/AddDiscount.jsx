import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogActions, Box, Typography, InputAdornment, Tooltip, FormLabel, MenuItem, Grid, TextField, CircularProgress } from '@mui/material';
import { SettingsSuggestOutlined } from '@mui/icons-material'
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import RoundButton from '../../components/Buttons/RoundButton';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Api from '../../api/api';
import dayjs from 'dayjs';
import ShortUniqueId from 'short-unique-id'

function AddDiscount({ openAddDiscount, setOpenAddDiscount, getDiscounts }) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const uid = new ShortUniqueId({ length: 6 });

    const [name, setName] = useState("")
    const [amount, setAmount] = useState("")
    const [type, setType] = useState("percent")
    const [startDate, setStartDate] = useState(dayjs())
    const [endDate, setEndDate] = useState(dayjs().add(30, 'day'))
    const [target, setTarget] = useState("subscription")
    const [code, setCode] = useState(uid())
    const [maxUse, setMaxUse] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (openAddDiscount?.data?.id) {
            setName(openAddDiscount?.data?.name)
            setAmount(openAddDiscount?.data?.amount)
            setType(openAddDiscount?.data?.type)
            setStartDate(dayjs(openAddDiscount?.data?.startDate))
            setEndDate(dayjs(openAddDiscount?.data?.endDate))
            setTarget(openAddDiscount?.data?.target)
            setMaxUse(openAddDiscount?.data?.maxUse)
            setCode(openAddDiscount?.data?.code || uid())
        } else {
            setCode(uid())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openAddDiscount?.data?.id])

    const clearData = () => {
        setName('')
        setAmount('')
        setType('percent')
        setStartDate(dayjs())
        setEndDate(dayjs().add(30, 'day'))
        setTarget("subscription")
        setMaxUse('')
    }

    const onAddDiscount = () => {
        if (name === "" || amount === "" || type === "" || startDate === "" || endDate === "" || target === "" || maxUse === "") {
            setError(true)
            enqueueSnackbar(t('admindashboard.addsupport.error'), { variant: 'error' });
        } else {

            const data = {
                name: name,
                amount: Number(amount),
                type: type,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                target: target,
                active: true,
                maxUse: Number(maxUse),
                code: code
            }

            setLoading(true)

            if (openAddDiscount?.data?.id) {
                Api().patch(`/discounts/${openAddDiscount?.data?.id}`, data)
                    .then((res) => {
                        setLoading(false)
                        setOpenAddDiscount({ open: false })
                        getDiscounts()
                        clearData()
                    })
                    .catch((error) => {
                        setLoading(false)
                    })
            } else {

                Api().post('/discounts', data)
                    .then((res) => {
                        setLoading(false)
                        setOpenAddDiscount({ open: false })
                        getDiscounts()
                        clearData()
                    })
                    .catch((error) => {
                        setLoading(false)
                    })
            }
        }
    }

    return (
        <Dialog open={openAddDiscount?.open} onClose={() => { setOpenAddDiscount({ open: false }); clearData(); setCode("") }} fullWidth maxWidth="sm">
            <DialogContent>
                <Box>
                    <form onSubmit={onAddDiscount}>
                        <Typography variant={"h6"} textAlign={'center'} mb={2}>{openAddDiscount?.data?.id ? t('admindashboard.discount.edit') : t('admindashboard.discount.add')}</Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{t('admindashboard.discount.table.heading.name')}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    size="small"
                                    value={name}
                                    error={name?.length > 0 ? false : error}
                                    onChange={(e) => { setName(e.target.value); setError(false) }}
                                    placeholder={t('admindashboard.discount.table.heading.name')}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{t('admindashboard.discount.table.heading.amount')}</FormLabel>
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
                                    value={amount}
                                    error={amount?.length > 0 ? false : error}
                                    onChange={(e) => { setAmount(e.target.value); setError(false) }}
                                    fullWidth
                                    placeholder={t('admindashboard.discount.table.heading.amount')}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <FormLabel sx={{ color: "#fff", marginLeft: ".8rem" }} >{t('admindashboard.discount.table.heading.type')}</FormLabel>
                                <TextField
                                    select
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    size='small'
                                    value={type}
                                    error={type?.length > 0 ? false : error}
                                    onChange={(e) => { setType(e.target.value); setError(false) }}
                                    fullWidth
                                    placeholder=''
                                >
                                    <MenuItem value={'percent'}>{t('admindashboard.discount.percent')} (%)</MenuItem>
                                    <MenuItem value={'amount'}>{t('admindashboard.discount.table.heading.amount')} (GHS)</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={6}>
                                <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{t('admindashboard.discount.table.heading.start')}</FormLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: "50px" }, marginBottom: '1rem', }}
                                            value={startDate}
                                            error={startDate?.length > 0 ? false : error}
                                            onChange={(newValue) => {
                                                setStartDate(newValue);
                                                setError(false)
                                            }}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={6}>
                                <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{t('admindashboard.discount.table.heading.end')}</FormLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: "50px" }, marginBottom: '1rem', }}
                                            value={endDate}
                                            error={endDate?.length > 0 ? false : error}
                                            onChange={(newValue) => {
                                                setEndDate(newValue);
                                                setError(false)
                                            }}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={6}>
                                <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{t('admindashboard.discount.table.heading.target')}</FormLabel>
                                <TextField
                                    select
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    size='small'
                                    value={target}
                                    error={target?.length > 0 ? false : error}
                                    onChange={(e) => { setTarget(e.target.value); setError(false) }}
                                    fullWidth
                                    placeholder=''
                                    disabled={openAddDiscount?.data?.id}
                                >
                                    <MenuItem value={'subscription'}>{t('admindashboard.discount.table.filter.subscription')}</MenuItem>
                                    <MenuItem value={'sponsorship'}>{t('admindashboard.discount.table.filter.sponsorship')}</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={6}>
                                <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{t('admindashboard.discount.table.heading.code')}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    size="small"
                                    value={code}
                                    error={code?.length > 0 ? false : error}
                                    onChange={(e) => { setCode(e.target.value); setError(false) }}
                                    placeholder={t('admindashboard.discount.table.heading.code')}
                                    fullWidth
                                    InputProps={{
                                        endAdornment: <InputAdornment position='end'>
                                            <Tooltip title={t('admindashboard.discount.generatecode')} arrow>
                                                <SettingsSuggestOutlined onClick={() => {
                                                    if (openAddDiscount?.data?.id) {

                                                    } else {
                                                        setCode(uid())
                                                    }

                                                }
                                                } sx={{ cursor: "pointer" }} />
                                            </Tooltip>
                                        </InputAdornment>
                                    }}
                                    disabled={openAddDiscount?.data?.id}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{t('admindashboard.discount.table.heading.maxuse')}</FormLabel>
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
                                    value={maxUse}
                                    error={maxUse?.length > 0 ? false : error}
                                    onChange={(e) => { setMaxUse(e.target.value); setError(false) }}
                                    fullWidth
                                    placeholder={t('admindashboard.discount.table.heading.maxuse')}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </DialogContent>
            <DialogActions sx={{ padding: "0 20px 20px 0" }}>
                <RoundButton onClick={() => { setOpenAddDiscount({ open: false }); clearData() }} text={t('admindashboard.addsupport.cancel')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
                <RoundButton
                    onClick={() => onAddDiscount()}
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

export default AddDiscount