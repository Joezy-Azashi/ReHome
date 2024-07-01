import React, { useState, useEffect } from 'react'
import Api from '../../api/api'
import PageLoader from '../../components/PageLoader'
import { useTranslation } from 'react-i18next';
import moment from "moment";
import { useSnackbar } from 'notistack';
import { Paper, Box, Menu, MenuItem, IconButton, InputAdornment, Checkbox, Radio, TextField, FormControlLabel, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Close, MoreVertOutlined, CheckCircle } from '@mui/icons-material'
import Deactivate from './ActionDialogs/Deactivate';
import DeleteUser from './ActionDialogs/DeleteUser';
import RoundButton from '../../components/Buttons/RoundButton';
import AddDiscount from './AddDiscount';

const ITEM_HEIGHT = 48

function Discount() {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const columns = [
        { id: 'name', label: t('admindashboard.discount.table.heading.name'), width: 170 },
        { id: 'amount', label: t('admindashboard.discount.table.heading.amount'), width: 10 },
        { id: 'code', label: t('admindashboard.discount.table.heading.code'), width: 70 },
        { id: 'start', label: t('admindashboard.discount.table.heading.start'), width: 10 },
        { id: 'end', label: t('admindashboard.discount.table.heading.end'), width: 10 },
        { id: 'target', label: t('admindashboard.discount.table.heading.target'), width: 10 },
        { id: 'active', label: t('admindashboard.discount.table.heading.active'), width: 10 },
        { id: 'menu', label: '', width: 10 },
    ];

    const [discounts, setDiscounts] = useState([])
    const [value, setValue] = useState('subscription')
    const [active, setActive] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [timeoutMulti, setTimeoutMulti] = useState(null)
    const [openDeactivate, setOpenDeactivate] = useState({ open: false, state: '', id: '', name: '' })
    const [openDelete, setOpenDelete] = useState({ open: false, state: '', id: '', name: '' })
    const [openAddDiscount, setOpenAddDiscount] = useState({ open: false, data: {} })
    const [loading, setLoading] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const open = Boolean(anchorEl);

    const handleClick = (event, index) => {
        setAnchorEl(event.currentTarget);
        setCurrentIndex(index)
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    // const debouncedSearch = debounce(async () => {
    //     getDiscounts()
    // }, 2000);

    // async function handleSearchChange(e) {
    //     setSearchTerm(e.target.value);
    //     debouncedSearch();
    // }

    const handleSearchChange = (e) => {
        try {
            clearTimeout(timeoutMulti)
        }
        catch {

        }
        setSearchTerm(e.target.value);
        setTimeoutMulti(setTimeout(() => {
            getDiscounts("", e.target.value)
        }, 2000))
    }

    const getDiscounts = (clear, term) => {
        setLoading(true)

        let wherequery = { and: [{ target: { inq: [value] } }, { active: active }] }

        if (clear) {

        } else
            if (term || searchTerm) {
                let pattern = { like: ".*" + term || searchTerm + ".*", options: "i" };
                wherequery.and.push({
                    or: [
                        { name: pattern },
                        { code: pattern }
                    ]
                })
            }
        Api().get('/discounts', {
            params: {
                filter: {
                    where: wherequery
                }
            }
        })
            .then((res) => {
                setDiscounts(res?.data)
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
            })
    }

    useEffect(() => {
        getDiscounts()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, active])

    const clearSearch = () => {
        getDiscounts("clear")
    }

    const UpdateActivation = (state, id) => {
        handleClose()
        setActionLoading(true)
        Api().patch(`discounts/${id}`, { active: !state })
            .then((res) => {
                setDiscounts(discounts?.filter((obj) => obj?.id !== id));
                setOpenDeactivate({ open: false })
                setActionLoading(false)
            })
            .catch((error) => {
                setActionLoading(false)
            })
    }

    const UpdateDeletion = (state, id) => {
        handleClose()
        setActionLoading(true)
        Api().delete(`discounts/${id}`)
            .then((res) => {
                getDiscounts()
                setOpenDelete({ open: false })
                setActionLoading(false)
            })
            .catch((error) => {
                setActionLoading(false)
            })
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: '73vh' }}>
                <Box>
                    <Box my={4} mx={2.1} sx={{ display: "flex", justifyContent: "end" }}>
                        <RoundButton onClick={() => setOpenAddDiscount({ open: true })} text={t('admindashboard.discount.add')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
                    </Box>
                </Box>

                <Box sx={{ display: { xs: "block", lg: 'flex' }, justifyContent: 'space-between', alignItems: 'center' }} my={4} mx={2.1}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <RadioGroup
                            name="controlled-radio-buttons-group"
                            value={value}
                            onChange={(e) => handleChange(e)}
                            row
                        >
                            <FormControlLabel
                                value="subscription"
                                control={
                                    <Radio
                                        size="small"
                                    />
                                }
                                label={t('admindashboard.discount.table.filter.subscription')}
                            />
                            <FormControlLabel
                                value="sponsorship"
                                control={
                                    <Radio
                                        size="small"
                                    />
                                }
                                label={t('admindashboard.discount.table.filter.sponsorship')}
                            />
                        </RadioGroup>
                    </Box>

                    <Box>
                        <FormControlLabel control={<Checkbox value={active} checked={active} onChange={() => { setActive(!active) }} />} label={t('admindashboard.discount.table.filter.active')} />
                    </Box>

                    <TextField fullWidth sx={{
                        width: { xs: '100%', sm: '80%', lg: '35%' },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '50px'
                        }
                    }}
                        value={searchTerm}
                        size='small'
                        onChange={(e) => { handleSearchChange(e) }}
                        variant='outlined'
                        placeholder={t('admindashboard.discount.table.filter.search')}
                        InputProps={{
                            endAdornment: <InputAdornment position='end'>
                                {searchTerm.length > 0 && <IconButton size='small' onClick={() => { clearSearch(); setSearchTerm("") }}><Close fontSize='small' /></IconButton>}

                            </InputAdornment>
                        }}
                    />
                </Box>
                <TableContainer>
                    <Table stickyHeader size='small' aria-label="sticky table">
                        {
                            loading ?
                                <Box my={15}>
                                    <PageLoader />
                                </Box>
                                :
                                discounts?.length < 1 ?
                                    <Box my={15}>
                                        <Typography textAlign={"center"}>{t('admindashboard.norecord')}</Typography>
                                    </Box>
                                    :
                                    <>
                                        <TableHead>
                                            <TableRow>
                                                {columns.map((column) => (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                        style={{ width: column.width }}
                                                    >
                                                        <span style={{ display: "flex", alignItems: "center", justifyContent: column?.id === "code" || column?.id === "start" || column?.id === "end" || column?.id === "target" || column?.id === "active" ? "center" : "" }}>
                                                            {column.label}
                                                        </span>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {discounts?.map((discount, index) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={index} sx={{ '& .MuiTableCell-root': { borderLeft: "1px solid rgba(224, 224, 224, 1)" } }}>
                                                        <TableCell>
                                                            {discount?.name}
                                                        </TableCell>

                                                        <TableCell>
                                                            <Typography variant='body2' noWrap>{discount?.amount} {discount?.type === "percent" ? "%" : "GHS"}</Typography>
                                                        </TableCell>

                                                        <TableCell sx={{ textTransform: "capitalize", textAlign: "center" }}>
                                                            {discount?.code}
                                                        </TableCell>

                                                        <TableCell sx={{ textAlign: "center" }}>
                                                            {moment(`${discount?.startDate}`).format("DD/MM/YYYY")}
                                                        </TableCell>

                                                        <TableCell sx={{ textAlign: "center" }}>
                                                            {moment(`${discount?.endDate}`).format("DD/MM/YYYY")}
                                                        </TableCell>

                                                        <TableCell sx={{ textAlign: "center" }}>
                                                            {discount?.target}
                                                        </TableCell>

                                                        <TableCell sx={{ textAlign: "center" }}>
                                                            {discount?.active ? <CheckCircle sx={{ fontSize: '2rem' }} color='primary' /> : ""}
                                                        </TableCell>

                                                        <TableCell sx={{ textAlign: "center" }}>
                                                            <IconButton
                                                                aria-label="more"
                                                                id="long-button"
                                                                // aria-controls={open ? 'long-menu' : undefined}
                                                                // aria-expanded={open ? 'true' : undefined}
                                                                aria-haspopup="true"
                                                                onClick={(event) => handleClick(event, index)}
                                                            >
                                                                <MoreVertOutlined />
                                                            </IconButton>

                                                            <Menu
                                                                id="long-menu"
                                                                MenuListProps={{
                                                                    'aria-labelledby': 'long-button',
                                                                }}
                                                                anchorEl={anchorEl}
                                                                open={index === currentIndex ? open : null}
                                                                onClose={handleClose}
                                                                PaperProps={{
                                                                    style: {
                                                                        maxHeight: ITEM_HEIGHT * 4.5,
                                                                        width: '15ch'
                                                                    },
                                                                }}
                                                            >
                                                                <MenuItem onClick={() => {
                                                                    if (!discount?.active && moment(discount?.endDate) < moment()) {
                                                                        enqueueSnackbar(t('admindashboard.discount.table.heading.activateerror'), { variant: 'error' });
                                                                    } else {
                                                                        setOpenDeactivate({ open: true, state: discount?.active, id: discount?.id, name: discount?.name }); handleClose()
                                                                    }
                                                                }}>
                                                                    {discount?.active ? t('admindashboard.discount.table.menu.deactivate') : t('admindashboard.discount.table.menu.activate')}
                                                                </MenuItem>
                                                                <MenuItem onClick={() => { setOpenAddDiscount({ open: true, data: discount }); handleClose() }}>
                                                                    {t('admindashboard.discount.table.menu.edit')}
                                                                </MenuItem>
                                                                <MenuItem onClick={() => { setOpenDelete({ open: true, state: !discount?.delete, id: discount?.id, name: discount?.name }); handleClose() }}>
                                                                    {t('admindashboard.discount.table.menu.delete')}
                                                                </MenuItem>
                                                            </Menu>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </>
                        }
                    </Table>
                </TableContainer>
            </TableContainer>

            {/* Deactivate Account dialog */}
            <Deactivate openDeactivate={openDeactivate} setOpenDeactivate={setOpenDeactivate} UpdateActivation={UpdateActivation} actionLoading={actionLoading} />

            {/* Delete Account dialog */}
            <DeleteUser openDelete={openDelete} setOpenDelete={setOpenDelete} UpdateDeletion={UpdateDeletion} actionLoading={actionLoading} />

            {/* Add discount */}
            <AddDiscount openAddDiscount={openAddDiscount} setOpenAddDiscount={setOpenAddDiscount} getDiscounts={getDiscounts} />
        </Paper >
    )
}

export default Discount