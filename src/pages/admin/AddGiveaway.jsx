import React, { useState, useEffect, useContext } from 'react'
import { Autocomplete, Box, Chip, CircularProgress, Dialog, DialogContent, Divider, FormLabel, Grid, InputAdornment, MenuItem, TextField, Tooltip, Typography, styled } from '@mui/material'
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { SettingsSuggestOutlined } from '@mui/icons-material';
import Api from '../../api/api';
import ShortUniqueId from 'short-unique-id'
import RoundButton from '../../components/Buttons/RoundButton';
import RateContext from '../../contexts/rateContext';

const TextInput = styled(TextField)(({ theme }) => ({
    marginBottom: '1rem',
    '& .MuiOutlinedInput-root': {
        background: '#fff',
        borderRadius: '15px'
    }
}))

function AddGiveaway({ openAddGiveaway, setOpenAddGiveaway, getGiveaways }) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const uid = new ShortUniqueId({ length: 6 });
    const rate = useContext(RateContext);

    const [title, setTitle] = useState({ en: "", fr: "" })
    const [description, setDescription] = useState({ en: "", fr: "" })
    const [code, setCode] = useState(uid())
    const [propertyId, setPropertyId] = useState("")
    const [properties, setProperties] = useState([])
    const [propertyFilter, setPropertyFilter] = useState("")
    const [propertyLoading, setPropertyLoading] = useState(false)
    const [userId, setUserId] = useState("")
    const [users, setUsers] = useState([])
    const [userFilter, setUserFilter] = useState("")
    const [userLoading, setUserLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (openAddGiveaway?.data?.id) {
            setTitle(openAddGiveaway?.data?.title)
            setDescription(openAddGiveaway?.data?.description)
            setPropertyId(openAddGiveaway?.data?.rehomePropertyId)
            setUserId(openAddGiveaway?.data?.userId)
            setCode(openAddGiveaway?.data?.code || uid())
            if(openAddGiveaway?.data?.rehomeProperty)
                setProperties([openAddGiveaway?.data?.rehomeProperty])
            if(openAddGiveaway?.data?.user)
                setUsers([openAddGiveaway?.data?.user])
        } else {
            setCode(uid())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openAddGiveaway?.data?.id])

    useEffect(() => {
        if (propertyFilter.length > 3) {
            setPropertyLoading(true)
            let pattern = { like: ".*" + propertyFilter + ".*", options: "i" };
            Api().get(`/rehome-properties`, {
                params: {
                    filter: {
                        where: { name: pattern, published: true },
                        limit: 10,
                        include: ["user"]
                    }
                }
            })
                .then((res) => {
                    setProperties(res.data);
                    setPropertyLoading(false)
                })
                .catch((error) => {
                    setPropertyLoading(false)
                    setProperties([]);
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propertyFilter])

    useEffect(() => {
        if (userFilter.length > 3) {
            setUserLoading(true)
            let pattern = { like: ".*" + userFilter + ".*", options: "i" };
            Api().get(`/users`, {
                params: {
                    filter: {
                        where: { or: [
                            { firstName: pattern },
                            { lastName: pattern },
                            { email: pattern },
                        ], userType: {inq: ['agent', 'developer', 'realtor']}, deactivated: false },
                        limit: 10,
                        include: ["agencies"]
                    }
                }
            })
                .then((res) => {
                    setUsers(res.data);
                    setUserLoading(false)
                })
                .catch((error) => {
                    setUserLoading(false)
                    setUsers([]);
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userFilter])

    const onAddGiveaway = () => {
        if (title.en === "" || title.fr === "" || description.en === "" || description.fr === "" || code === "" || (propertyId === "" && userId === "")) {
            setError(true)
            enqueueSnackbar(t('admindashboard.addsupport.error'), { variant: 'error' });
        } else {

            const data = {
                title: title,
                description: description,
                code: code,
                rehomePropertyId: propertyId,
                userId: userId
            }

            setLoading(true)

            if (openAddGiveaway?.data?.id) {
                Api().patch(`/giveaways/${openAddGiveaway?.data?.id}`, data)
                    .then((res) => {
                        setLoading(false)
                        setOpenAddGiveaway({ open: false })
                        getGiveaways()
                        clearData()
                    })
                    .catch((error) => {
                        setLoading(false)
                    })
            } else {

                Api().post('/giveaways', data)
                    .then((res) => {
                        setLoading(false)
                        setOpenAddGiveaway({ open: false })
                        getGiveaways()
                        clearData()
                    })
                    .catch((error) => {
                        setLoading(false)
                    })
            }
        }
    }

    const clearData = () => {
        setTitle({ en: "", fr: "" });
        setDescription({ en: "", fr: "" });
        setCode("");
        setPropertyId("")
        setUserId("")
        setLoading(false);
        setError(false);
    }

    return (
        <Dialog open={openAddGiveaway?.open} onClose={() => {setOpenAddGiveaway({ open: false }); clearData()}} fullWidth maxWidth="md">
            <DialogContent>
                <Box>
                    <form onSubmit={onAddGiveaway}>
                        <Typography variant={"h6"} textAlign={'center'} mb={2}>{openAddGiveaway?.data?.label ? t('admindashboard.giveaway.edit') : t('admindashboard.giveaway.add')}</Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={5.5}>
                                <Typography variant={"h6"} textAlign={'center'} mb={1}>English</Typography>
                                <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{"Title"}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px',
                                            marginBottom: "10px"
                                        }
                                    }}
                                    size="small"
                                    value={title.en}
                                    error={title.en?.length > 0 ? false : error}
                                    onChange={(e) => { setTitle({ en: e.target.value, fr: title.fr }); setError(false) }}
                                    placeholder={"Title"}
                                    fullWidth
                                />

                                <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{"Description"}</FormLabel>
                                <TextInput
                                    value={description.en}
                                    error={description.en?.length > 0 ? false : error}
                                    onChange={(e) => { setDescription({ en: e.target.value, fr: description.fr }); setError(false) }}
                                    multiline
                                    rows={3}
                                    fullWidth
                                    placeholder={"Description"}
                                />
                            </Grid>

                            <Grid item xs={1} sx={{ display: "flex", justifyContent: "center" }}>
                                <Divider orientation='vertical' />
                            </Grid>

                            <Grid item xs={5.5}>
                                <Typography variant={"h6"} textAlign={'center'} mb={1}>Français</Typography>
                                <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{"Titre"}</FormLabel>
                                <TextField
                                    sx={{
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px',
                                            marginBottom: "10px"
                                        }
                                    }}
                                    size="small"
                                    onWheel={(e) => e.target.blur()}
                                    value={title.fr}
                                    error={title.fr?.length > 0 ? false : error}
                                    onChange={(e) => { setTitle({ en: title.en, fr: e.target.value }); setError(false) }}
                                    fullWidth
                                    placeholder={"Titre"}
                                />

                                <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{"Description"}</FormLabel>
                                <TextInput
                                    value={description.fr}
                                    error={description.fr?.length > 0 ? false : error}
                                    onChange={(e) => { setDescription({ fr: e.target.value, en: description.en }); setError(false) }}
                                    multiline
                                    rows={3}
                                    fullWidth
                                    placeholder={"Description"}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Divider orientation='horizontal' />
                            </Grid>

                            <Grid item xs={12}>
                                <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{t('admindashboard.giveaway.properties')}</FormLabel>
                                <Autocomplete
                                    id="combo-box-demo"
                                    loading={propertyLoading}
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option.id}>
                                                {`${option?.user?.fullname} - ${option?.name} ${option.propertyType !== 'development' ? '('+ rate?.preferredCurrency + ' '+ (rate?.convert(option.currency, option.price))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")+')' : ''}`}
                                            </li>
                                        );
                                    }}
                                    getOptionLabel={option => `${option?.user?.fullname} - ${option?.name} `}
                                    onChange={(event, newValue) => {
                                        setPropertyId(newValue?.id);
                                    }}
                                    options={properties}
                                    sx={{ '& .MuiAutocomplete-inputRoot': { flexWrap: "nowrap" } }}
                                    renderInput={(params) => <TextField
                                        value={propertyFilter}
                                        onChange={(e) => { setPropertyFilter(e.target.value) }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                background: '#fff',
                                                borderRadius: '50px',
                                                marginBottom: "10px",
                                                padding: "0px 14px !important"
                                            }
                                        }} placeholder={t('admindashboard.giveaway.properties')} {...params} />}
                                />
                            </Grid>

                            <Typography sx={{ color: "#000",width: '100%', display: "flex", textAlign: 'center', justifyContent: 'center' }}>{t('admindashboard.giveaway.or')}</Typography>

                            <Grid item xs={12}>
                                <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{t('admindashboard.giveaway.users')}</FormLabel>
                                <Autocomplete
                                    id="combo-box-demo"
                                    loading={userLoading}
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option.id}>
                                                {`${option?.fullname} - ${option?.agencies[0].name}`}
                                            </li>
                                        );
                                    }}
                                    getOptionLabel={option => `${option?.fullname} - ${option?.agencies[0].name} `}
                                    onChange={(event, newValue) => {
                                        setUserId(newValue?.id);
                                    }}
                                    options={users}
                                    sx={{ '& .MuiAutocomplete-inputRoot': { flexWrap: "nowrap" } }}
                                    renderInput={(params) => <TextField
                                        value={userFilter}
                                        onChange={(e) => { setUserFilter(e.target.value) }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                background: '#fff',
                                                borderRadius: '50px',
                                                marginBottom: "10px",
                                                padding: "0px 14px !important"
                                            }
                                        }} placeholder={t('admindashboard.giveaway.users')} {...params} />}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Divider orientation='horizontal' />
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
                                                    if (openAddGiveaway?.data?.id) {

                                                    } else {
                                                        setCode(uid())
                                                    }

                                                }
                                                } sx={{ cursor: "pointer" }} />
                                            </Tooltip>
                                        </InputAdornment>
                                    }}
                                    disabled={openAddGiveaway?.data?.id}
                                />
                            </Grid>

                            <Grid item xs={6} sx={{ display: "flex", justifyContent: "end" }}>
                                <Box mt={3.2}>
                                    <RoundButton onClick={() => { setOpenAddGiveaway({ open: false }); clearData() }} text={t('admindashboard.addsupport.cancel')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem', marginRight: '1rem' }} />
                                    <RoundButton
                                        onClick={() => { onAddGiveaway() }}
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
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default AddGiveaway