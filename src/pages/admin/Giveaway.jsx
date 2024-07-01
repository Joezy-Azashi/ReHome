import { Box, IconButton, InputAdornment, Menu, MenuItem, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react'
import PageLoader from '../../components/PageLoader';
import { useTranslation } from 'react-i18next';
import RoundButton from '../../components/Buttons/RoundButton';
import { Close, MoreVertOutlined, CheckCircle } from '@mui/icons-material'
import AddGiveaway from './AddGiveaway';
import Api from '../../api/api';
import DeleteUser from './ActionDialogs/DeleteUser';
import { useSnackbar } from 'notistack';
import { CSVLink } from 'react-csv';

const ITEM_HEIGHT = 48

function Giveaway() {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const columns = [
        { id: 'title', label: t('admindashboard.giveaway.table.heading.title'), width: 50 },
        { id: 'code', label: t('admindashboard.giveaway.table.heading.code'), width: 50 },
        { id: 'description', label: t('admindashboard.giveaway.table.heading.description'), width: 200 },
        { id: 'responses', label: t('admindashboard.giveaway.table.heading.responses'), width: 20 },
        { id: 'menu', label: '', width: 10 },
    ];

    const [giveaways, setGiveaways] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)
    const [timeoutMulti, setTimeoutMulti] = useState(null)
    const [openDelete, setOpenDelete] = useState({ open: false, state: '', id: '', label: '' })
    const [openAddGiveaway, setOpenAddGiveaway] = useState({ open: false, data: {} })
    const [actionLoading, setActionLoading] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const open = Boolean(anchorEl);


    useEffect(() => {
        getGiveaways()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
            getGiveaways("", e.target.value)
        }, 2000))
    }

    const getGiveaways = (clear, term) => {
        setLoading(true)

        let wherequery = {}

        if (clear) {

        } else
            if (term || searchTerm) {
                let pattern = { like: ".*" + term || searchTerm + ".*", options: "i" };
                wherequery = {
                    or: [
                        { 'title.en': pattern },
                        { 'title.fr': pattern },
                        { code: pattern },
                        { 'description.en': pattern },
                        { 'description.fr': pattern },
                    ]
                }
            }
        Api().get('/giveaways', {
            params: {
                filter: {
                    where: wherequery,
                    include: [
                        {
                            relation: 'rehomeProperty',
                            scope: {
                                include: [
                                    {
                                        relation: 'user',
                                    },
                                ],
                            },
                        }, {
                            relation: 'giveawayResponses'
                        }, {
                            relation: 'user',
                            scope: {
                                include: [
                                    {
                                        relation: 'agencies',
                                    },
                                ],
                            },
                        }
                    ]
                }
            }
        })
            .then((res) => {
                setGiveaways(res?.data)
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
            })
    }

    const UpdateDeletion = (state, id) => {
        handleClose()
        setActionLoading(true)
        Api().delete(`giveaways/${id}`)
            .then((res) => {
                getGiveaways()
                setOpenDelete({ open: false })
                setActionLoading(false)
            })
            .catch((error) => {
                setActionLoading(false)
            })
    }

    const handleExportResponses = (giveaway) => {
        if (giveaway.giveawayResponses?.length > 0) {
            const data = giveaway.giveawayResponses.map(gr => ({
                firstName: gr.firstName,
                lastName: gr.lastName,
                email: gr.email,
                location: gr.location,
                phone: gr.phone,
                nights: gr.duration
            }))
            return {data: data, filename: `${giveaway.title[t('lang_code')]}`}
        }
        return {data: '', filename: ``}
        // return enqueueSnackbar(t('admindashboard.giveaway.popup.exporterror'), { variant: 'error' });
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: '73vh' }}>
                <Box>
                    <Box my={4} mx={2.1} sx={{ display: "flex", justifyContent: "end" }}>
                        <RoundButton onClick={() => { setOpenAddGiveaway({ open: true }) }} text={t('admindashboard.giveaway.add')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
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
                        placeholder={t('admindashboard.giveaway.search')}
                        InputProps={{
                            endAdornment: <InputAdornment position='end'>
                                {searchTerm.length > 0 && <IconButton size='small' onClick={() => { setSearchTerm(""); getGiveaways(true); }}><Close fontSize='small' /></IconButton>}

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
                                giveaways?.length < 1 ?
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
                                                        <span style={{ display: "flex", justifyContent: column?.id === "code" || column?.id === "description" || column?.id === "responses" ? "center" : "", alignItems: "center" }}>
                                                            {column.label}
                                                        </span>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {giveaways.map((data, index) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={index} sx={{ '& .MuiTableCell-root': { borderLeft: "1px solid rgba(224, 224, 224, 1)" } }}>
                                                        <TableCell>
                                                            {data.title[t('lang_code')]}
                                                        </TableCell>

                                                        <TableCell sx={{ textAlign: "center" }}>
                                                            {data.code}
                                                        </TableCell>

                                                        <TableCell sx={{ textAlign: "center" }}>
                                                            {data.description[t('lang_code')]}
                                                        </TableCell>

                                                        <TableCell sx={{ textAlign: "center" }}>
                                                            {data.giveawayResponses?.length || 0}
                                                        </TableCell>

                                                        <TableCell sx={{ textAlign: "center" }}>
                                                            <IconButton
                                                                aria-label="more"
                                                                id="long-button"
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
                                                                <MenuItem onClick={() => { setOpenAddGiveaway({ open: true, data: data }); handleClose() }}>
                                                                    {t('admindashboard.giveaway.menu.edit')}
                                                                </MenuItem>
                                                                <MenuItem onClick={() => { setOpenDelete({ open: true, id: data?.id, name: data?.title[t('lang_code')] }); handleClose() }}>
                                                                    {t('admindashboard.giveaway.menu.delete')}
                                                                </MenuItem>
                                                                <MenuItem onClick={() => { handleExportResponses(data); handleClose() }}>
                                                                    <CSVLink data={ handleExportResponses(data).data} filename={ handleExportResponses(data).filename}>{t('admindashboard.giveaway.menu.export')}</CSVLink>
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

            {/* <Box my={'1rem'} display='flex' justifyContent={'flex-end'}>
                {
                    [...Array(10)]?.length > 0 && !loading ?
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
            </Box> */}

            {/* Add Giveaway */}
            <AddGiveaway openAddGiveaway={openAddGiveaway} setOpenAddGiveaway={setOpenAddGiveaway} getGiveaways={getGiveaways} />

            {/* Delete Giveaway */}
            <DeleteUser openDelete={openDelete} setOpenDelete={setOpenDelete} actionLoading={actionLoading} UpdateDeletion={UpdateDeletion} />
        </Paper >
    )
}

export default Giveaway