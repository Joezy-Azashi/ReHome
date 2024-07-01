import React, { useState, useEffect } from 'react'
import Api from '../../api/api'
import PageLoader from '../../components/PageLoader'
import { useTranslation } from 'react-i18next';
import { Paper, Box, Menu, MenuItem, IconButton, Pagination, InputAdornment, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Close, MoreVertOutlined, CheckCircle } from '@mui/icons-material'
import RoundButton from '../../components/Buttons/RoundButton';
import AddLocation from './AddLocation';
import DeleteUser from './ActionDialogs/DeleteUser';
import Deactivate from './ActionDialogs/Deactivate';

const ITEM_HEIGHT = 48
const pageLimit = 50

function Location() {
    const { t } = useTranslation();

    const columns = [
        { id: 'label', label: t('admindashboard.location.table.heading.label'), width: 170 },
        { id: 'longitude', label: t('admindashboard.location.table.heading.longitude'), width: 100 },
        { id: 'latitude', label: t('admindashboard.location.table.heading.latitude'), width: 100 },
        { id: 'country', label: t('admindashboard.location.table.heading.country'), width: 100 },
        { id: 'active', label: t('admindashboard.location.table.heading.active'), width: 10 },
        { id: 'menu', label: '', width: 10 },
    ];

    const [locations, setLocations] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [pageNumber, setpageNumber] = useState(1)
    const [count, setCount] = useState(1)
    const [timeoutMulti, setTimeoutMulti] = useState(null)
    const [openDeactivate, setOpenDeactivate] = useState({ open: false, state: '', id: '', name: '' })
    const [openDelete, setOpenDelete] = useState({ open: false, state: '', id: '', label: '' })
    const [openAddLocation, setOpenAddLocation] = useState({ open: false, data: {} })
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

    const handleSearchChange = (e) => {
        try {
            clearTimeout(timeoutMulti)
        }
        catch {

        }
        setSearchTerm(e.target.value);
        setTimeoutMulti(setTimeout(() => {
            getLocations(e.target.value)
        }, 2000))
    }

    const getLocations = (term) => {
        if (!term) term = searchTerm;
        setLoading(true)

        let wherequery = { active: true }
        //TODO: optimize location search by moving to elastic search or mongo search api.
        if (term || searchTerm) {
            let pattern = { like: "^" + term || searchTerm + ".*", options: "i" };
            wherequery.label = pattern
        }

        Api().get('/constants/locations', {
            params: {
                filter: {
                    limit: pageLimit,
                    skip: (pageNumber - 1) * pageLimit,
                    where: wherequery,
                    order: ["label ASC"]
                }
            }
        })
            .then((res) => {
                setLocations(res?.data)
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
            })

        Api().get('/constants/locations/count', {
            params: {
                where: wherequery
            }
        })
            .then((res) => {
                setCount(res?.data?.count)
            })
            .catch((error) => { })
    }

    const updateCountriesToGhana = () => {

        Api().patch('/constants/locations/', {
            country: 'ghana'
        })
        .then((res) => {
            getLocations();
        })
        .catch((error) => { })

    }

    useEffect(() => {
        getLocations()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber])

    const clearSearch = () => {
        handleSearchChange({ target: { value: "" } })
    }

    const UpdateActivation = (state, id) => {
        handleClose()
        setActionLoading(true)
        Api().patch(`/constants/locations/${id}`, { active: !state })
            .then((res) => {
                const newState = locations.map(obj => {
                    if (obj.id === id) {
                        return { ...obj, active: !state };
                    }
                    return obj;
                });

                setLocations(newState);
                setOpenDeactivate({ open: false })
                setActionLoading(false)
            })
            .catch((error) => {
                setActionLoading(false)
            })
    }

    const UpdateDeletion = (state, id) => {
        setActionLoading(true)
        Api().delete(`/constants/locations/${id}`)
            .then((res) => {
                setOpenDelete({ open: false })
                getLocations()
                setSearchTerm("")
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
                    <Box my={4} gap={1} mx={2.1} sx={{ display: "flex", justifyContent: "end" }}>
                        <RoundButton onClick={() => { setOpenAddLocation({ open: true }) }} text={t('admindashboard.location.add')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'end' }} my={4} mx={2.1}>

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
                        placeholder={t('admindashboard.location.search')}
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
                                locations?.length < 1 ?
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
                                                        <span style={{ display: "flex", justifyContent: column?.id === "longitude" || column?.id === "latitude" || column?.id === "active" ? "center" : "", alignItems: "center" }}>
                                                            {column.label}
                                                        </span>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {locations.map((loc, index) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={index} sx={{ '& .MuiTableCell-root': { borderLeft: "1px solid rgba(224, 224, 224, 1)" } }}>
                                                        <TableCell>
                                                            {loc?.label}
                                                        </TableCell>

                                                        <TableCell sx={{ textAlign: "center" }}>
                                                            {loc?.longitude}
                                                        </TableCell>

                                                        <TableCell sx={{ textAlign: "center" }}>
                                                            {loc?.latitude}
                                                        </TableCell>

                                                        <TableCell sx={{ textAlign: "center" }}>
                                                            { loc?.country ? t('agentdashboard.addlisting.tab1.country.'+loc?.country) : ''}
                                                        </TableCell>

                                                        <TableCell sx={{ textAlign: "center" }}>
                                                            {loc?.active ? <CheckCircle sx={{ fontSize: '2rem' }} color='primary' /> : ""}
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
                                                                <MenuItem onClick={() => { setOpenDeactivate({ open: true, state: loc?.active, id: loc?.id, name: loc?.label }); handleClose() }}>
                                                                    {!loc?.active ? t('admindashboard.location.menu.activate') : t('admindashboard.location.menu.deactivate')}
                                                                </MenuItem>
                                                                <MenuItem onClick={() => { setOpenAddLocation({ open: true, data: loc }); handleClose() }}>
                                                                    {t('admindashboard.location.menu.edit')}
                                                                </MenuItem>
                                                                <MenuItem onClick={() => { setOpenDelete({ open: true, id: loc?.id, name: loc?.label }); handleClose() }}>
                                                                    {t('admindashboard.location.menu.delete')}
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

            <Box my={'1rem'} display='flex' justifyContent={'flex-end'}>
                {
                    locations?.length > 0 && !loading ?
                        <Pagination sx={{
                            '& ul': {
                                marginLeft: 'auto'
                            }
                        }}
                            color='primary'
                            page={pageNumber}
                            count={Math.ceil(count / pageLimit)}
                            onChange={(event, value) => setpageNumber(value)}
                            variant="text"
                            shape="rounded"
                        />
                        :
                        null
                }
            </Box>

            {/* Deactivate Location dialog */}
            <Deactivate openDeactivate={openDeactivate} setOpenDeactivate={setOpenDeactivate} UpdateActivation={UpdateActivation} actionLoading={actionLoading} />

            {/* Add Location */}
            <AddLocation openAddLocation={openAddLocation} setOpenAddLocation={setOpenAddLocation} getLocations={getLocations} />

            {/* Delete Location */}
            <DeleteUser openDelete={openDelete} setOpenDelete={setOpenDelete} UpdateDeletion={UpdateDeletion} actionLoading={actionLoading} />
        </Paper >
    )
}

export default Location