import React, { useEffect, useState } from 'react'
import { Paper, Box, Menu, MenuItem, Popover, IconButton, InputAdornment, Pagination, Radio, TextField, FormControlLabel, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Dialog, Tooltip, DialogContent, Grid } from '@mui/material';
import { Cancel, Close, MoreVertOutlined, InfoOutlined, CheckCircle, Check, TopicOutlined } from '@mui/icons-material'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'
import Api from '../../api/api';
import PageLoader from '../../components/PageLoader';
import Suspend from './ActionDialogs/Suspend';
import Verify from './ActionDialogs/Verify';
import Deactivate from './ActionDialogs/Deactivate';
import DeleteUser from './ActionDialogs/DeleteUser';
import SuspendInfo from './InfoPopover/SuspendInfo';
import VerifyInfo from './InfoPopover/VerifyInfo';
import DeactivateInfo from './InfoPopover/DeactivateInfo';
import { getUserType } from '../../services/auth';
import RoundButton from '../../components/Buttons/RoundButton';
import AddSupport from './AddSupport';
import ReactPanZoom from "react-image-pan-zoom-rotate";
import { CSVLink } from 'react-csv';

const pageLimit = 50
const ITEM_HEIGHT = 48
const token = localStorage.getItem("authToken")

function AdminUsers() {
    const { t } = useTranslation();
    const navigate = useNavigate()

    const columns = [
        { id: 'name', label: t('admindashboard.users.table.heading.name'), width: 170 },
        { id: 'email', label: t('admindashboard.users.table.heading.email'), width: 170 },
        { id: 'suspended', label: t('admindashboard.users.table.heading.suspended'), width: 10 },
        { id: 'verified', label: t('admindashboard.users.table.heading.verified'), width: 10 },
        { id: 'deactivated', label: t('admindashboard.users.table.heading.deactivated'), width: 10 },
        { id: 'documents', label: t('admindashboard.users.table.heading.documents'), width: 10 },
        { id: 'menu', label: '', width: 10 },
    ];

    const [value, setValue] = useState('agent')
    const [openDoc, setOpenDoc] = useState(false)
    const [pageNumber, setpageNumber] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [users, setUsers] = useState([])
    const [docData, setDocData] = useState({ name: "", data: {} })
    const [loading, setLoading] = useState(false)
    const [timeoutMulti, setTimeoutMulti] = useState(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [openAddSupport, setOpenAddSupport] = useState(false)
    const [count, setCount] = useState(1)
    const [openSuspend, setOpenSuspend] = useState({ open: false, state: '', id: '', name: '' })
    const [openVerify, setOpenVerify] = useState({ open: false, state: '', id: '', name: '' })
    const [openDeactivate, setOpenDeactivate] = useState({ open: false, state: '', id: '', name: '' })
    const [openDelete, setOpenDelete] = useState({ open: false, state: '', id: '', name: '' })
    const [suspendInfoAnchorEl, setSuspendInfoAnchorEl] = useState(null)
    const [verifyInfoAnchorEl, setVerifyInfoAnchorEl] = useState(null)
    const [deactivateInfoAnchorEl, setDeactivateInfoAnchorEl] = useState(null)
    const [csvData, setCSVData] = useState([])

    const handleSuspendPopoverOpen = (event) => { setSuspendInfoAnchorEl(event.currentTarget) }
    const handleSuspendPopoverClose = () => { setSuspendInfoAnchorEl(null) }

    const handleVerifyPopoverOpen = (event) => { setVerifyInfoAnchorEl(event.currentTarget) }
    const handleVerifyPopoverClose = () => { setVerifyInfoAnchorEl(null) }

    const handleDeactivatePopoverOpen = (event) => { setDeactivateInfoAnchorEl(event.currentTarget) }
    const handleDeactivatePopoverClose = () => { setDeactivateInfoAnchorEl(null) }

    const openSuspendInfo = Boolean(suspendInfoAnchorEl);
    const openVerifyInfo = Boolean(verifyInfoAnchorEl);
    const openDeactivateInfo = Boolean(deactivateInfoAnchorEl);

    const handleChange = (event) => {
        setpageNumber(1)
        setValue(event.target.value);
    };

    const handleSearchChange = (e) => {
        try {
            clearTimeout(timeoutMulti)
        }
        catch {

        }
        setSearchTerm(e.target.value);
        setTimeoutMulti(setTimeout(() => {
            getUsers("", e.target.value)
        }, 2000))
    }

    const getUsers = (clear, term) => {
        setLoading(true)
        if (!term) term = searchTerm;

        let userTypes = [];
        if(value){
            userTypes = [value];
        }else{
            userTypes = ["agent", "developer", "realtor", "customer"]
        }

        let wherequery = { and: [{ userType: { inq: userTypes} }] }

        if (clear) {

        } else
            if (term || searchTerm) {
                let pattern = { like: ".*" + term || searchTerm + ".*", options: "i" };
                wherequery.and.push({
                    or: [
                        { firstName: pattern },
                        { lastName: pattern },
                        { email: pattern },
                        { phone: pattern }
                    ]
                })
            }
        Api().get('users', {
            params: {
                filter: {
                    order: "createdAt DESC",
                    limit: pageLimit, skip: (pageNumber - 1) * pageLimit,
                    where: wherequery,
                    include: ['agencies', 'rehomeProperties']
                }
            }
        })
            .then((res) => {
                setUsers(res?.data)
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
            })


        Api().get('/users/count', {
            params: {
                where: wherequery
            }
        })
            .then((res) => {
                setCount(res?.data?.count)
            })
            .catch((error) => { })

        // For Export purposes 

        Api().get('users', {
            params: {
                filter: {
                    where: wherequery,
                }
            }
        })
            .then((res) => {
                if (res.data.length) {
                    setCSVData([
                        [
                            t('admindashboard.users.table.heading.email'),
                            t('admindashboard.addsupport.firstname'),
                            t('admindashboard.addsupport.lastname'),
                            t('admindashboard.users.table.heading.verified'),
                            t('admindashboard.users.table.heading.suspended'),
                            t('admindashboard.users.table.heading.deactivated'),
                            t('admindashboard.users.table.heading.deleted')],
                        ...res.data.map(u => [u.email, u.firstName, u.lastName, u.verified, u.suspended, !u.deactivated, u.deleted])])
                }
            })
            .catch((error) => { })
    }

    useEffect(() => {
        getUsers()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber, value])

    const clearSearch = () => {
        getUsers("clear")
    }

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

    const UpdateSuspended = (state, id) => {
        handleClose()
        setActionLoading(true)
        Api().patch(`users/${id}`, { suspended: !state })
            .then((res) => {
                const newState = users.map(obj => {
                    if (obj.id === id) {
                        return { ...obj, suspended: !state };
                    }
                    return obj;
                });
                setUsers(newState);
                setOpenSuspend({ open: false })
                setActionLoading(false)
            })
            .catch((error) => {
                setActionLoading(false)
            })
    }

    const UpdateVerified = (state, id) => {
        handleClose()
        setActionLoading(true)
        Api().patch(`users/${id}`, { verified: !state })
            .then((res) => {
                const newState = users.map(obj => {
                    if (obj.id === id) {
                        return { ...obj, verified: !state };
                    }
                    return obj;
                });

                setUsers(newState);
                setOpenVerify({ open: false })
                setActionLoading(false)
            })
            .catch((error) => {
                setActionLoading(false)
            })
    }

    const UpdateActivation = (state, id) => {
        handleClose()
        setActionLoading(true)
        Api().patch(`users/${id}`, { deactivated: !state })
            .then((res) => {
                const newState = users.map(obj => {
                    if (obj.id === id) {
                        return { ...obj, deactivated: !state };
                    }
                    return obj;
                });

                setUsers(newState);
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
        Api().delete(`users/${id}`)
            .then((res) => {
                getUsers()
                setOpenDelete({ open: false })
                setActionLoading(false)
            })
            .catch((error) => {
                setActionLoading(false)
            })
    }

    const editUser = (id) => {
        navigate('/admin/user-profile/' + id, { state: { id } });
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: '73vh' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>
                    <Box>
                        <Box my={4} mx={2.1} sx={{ display: "flex", justifyContent: "end", backgroundColor: '#5b9c00', padding: '10px', paddingLeft: '30px', paddingRight: '30px', borderRadius: '30px', color: 'white', cursor: "pointer" }}>
                            <CSVLink data={csvData} filename={t(`admindashboard.users.usertypes.${value}`) + ".csv"}>{t('misc.export')}</CSVLink>
                        </Box>
                    </Box>
                    <Box>
                        {getUserType() === "admin" ?
                            <Box my={4} mx={2.1} sx={{ display: "flex", justifyContent: "end" }}>
                                <RoundButton onClick={() => setOpenAddSupport(true)} text={t('admindashboard.addsupport.title')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
                            </Box>
                            : ""}
                    </Box>

                </Box>

                <Box sx={{ display: { xs: "block", md: 'flex' }, justifyContent: 'space-between', alignItems: 'center' }} my={4} mx={2.1}>
                    <Grid container spacing={3} mb={'3rem'}>
                        <Grid item xs={12} md={8} mb={2} sx={{ display: "flex", alignItems: "center" }}>
                            <RadioGroup
                                name="controlled-radio-buttons-group"
                                value={value}
                                onChange={(e) => handleChange(e)}
                                row
                            >
                                <FormControlLabel
                                    value="customer"
                                    control={
                                        <Radio
                                            size="small"
                                        />
                                    }
                                    label={t('admindashboard.users.usertypes.customer')}
                                />
                                <FormControlLabel
                                    value="agent"
                                    control={
                                        <Radio
                                            size="small"
                                        />
                                    }
                                    label={t('admindashboard.users.usertypes.agent')}
                                />
                                <FormControlLabel
                                    value="realtor"
                                    control={
                                        <Radio
                                            size="small"
                                        />
                                    }
                                    label={t('admindashboard.users.usertypes.realtor')}
                                />
                                <FormControlLabel
                                    value="developer"
                                    control={
                                        <Radio
                                            size="small"
                                        />
                                    }
                                    label={t('admindashboard.users.usertypes.developer')}
                                />

                                {getUserType() === "admin" ?
                                    <FormControlLabel
                                        value=""
                                        control={
                                            <Radio
                                                size="small"
                                            />
                                        }
                                        label={t('admindashboard.users.usertypes.all')}
                                    />
                                    : ""
                                }
                            </RadioGroup>
                        </Grid>

                        <Grid item xs={12} md={4} mb={2}>
                            <TextField fullWidth sx={{
                                // width: { xs: '100%', sm: '80%', lg: '35%' },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '50px'
                                }
                            }}
                                value={searchTerm}
                                size='small'
                                onChange={(e) => { handleSearchChange(e); setpageNumber(1) }}
                                variant='outlined'
                                placeholder={t('admindashboard.users.searchplaceholder')}
                                InputProps={{
                                    endAdornment: <InputAdornment position='end'>
                                        {searchTerm.length > 0 && <IconButton size='small' onClick={() => { clearSearch(); setSearchTerm("") }}><Close fontSize='small' /></IconButton>}

                                    </InputAdornment>
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <TableContainer>
                    <Table stickyHeader size='small' aria-label="sticky table">
                        {
                            loading ?
                                <Box my={15}>
                                    <PageLoader />
                                </Box>
                                :
                                users?.length < 1 ?
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
                                                        <span style={{ display: "flex", alignItems: "center", justifyContent: column?.id === "suspended" || column?.id === "verified" || column?.id === "deactivated" || column?.id === "deleted" || column?.id === "documents" ? "center" : "" }}>
                                                            {column.label}
                                                            {column.label === t('admindashboard.users.table.heading.suspended') ? <IconButton onMouseEnter={handleSuspendPopoverOpen} onMouseLeave={handleSuspendPopoverClose}><InfoOutlined sx={{ fontSize: "1.2rem" }} /></IconButton> : ""}
                                                            {column.label === t('admindashboard.users.table.heading.verified') ? <IconButton onMouseEnter={handleVerifyPopoverOpen} onMouseLeave={handleVerifyPopoverClose}><InfoOutlined sx={{ fontSize: "1.2rem" }} /></IconButton> : ""}
                                                            {column.label === t('admindashboard.users.table.heading.deactivated') ? <IconButton onMouseEnter={handleDeactivatePopoverOpen} onMouseLeave={handleDeactivatePopoverClose}><InfoOutlined sx={{ fontSize: "1.2rem" }} /></IconButton> : ""}
                                                            {/* {column.label === t('admindashboard.users.table.heading.deleted') ? <IconButton onMouseEnter={handleDeletePopoverOpen} onMouseLeave={handleDeletePopoverClose}><InfoOutlined sx={{ fontSize: "1.2rem" }} /></IconButton> : ""} */}
                                                        </span>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {users.map((user, index) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={index} sx={{ '& .MuiTableCell-root': { borderLeft: "1px solid rgba(224, 224, 224, 1)" } }}>
                                                        <TableCell>
                                                            {user?.firstName + " " + user?.lastName}
                                                        </TableCell>

                                                        <TableCell sx={{ textTransform: "lowercase" }}>
                                                            <Typography variant='body2' noWrap>{user?.email}</Typography>
                                                        </TableCell>

                                                        <TableCell sx={{ textTransform: "capitalize", textAlign: "center" }}>
                                                            {user?.suspended && <Check sx={{ fontSize: '1.8rem' }} color='#fff' />}
                                                        </TableCell>

                                                        <TableCell sx={{ textAlign: "center" }}>
                                                            {!user?.verified ? <Cancel sx={{ fontSize: '2rem', color: "red" }} /> : <CheckCircle sx={{ fontSize: '2rem' }} color='primary' />}
                                                        </TableCell>

                                                        <TableCell sx={{ textAlign: "center" }}>
                                                            {user?.deactivated ? <Cancel sx={{ fontSize: '2rem', color: "red" }} /> : <CheckCircle sx={{ fontSize: '2rem' }} color='primary' />}
                                                        </TableCell>

                                                        <TableCell sx={{ textAlign: "center" }}>
                                                            {
                                                                user?.identifications?.find(x => x?.identification_type === "ghana_card")?.filename &&
                                                                <Tooltip title={"Ghana Card"}>
                                                                    <IconButton onClick={() => { setOpenDoc(true); setDocData({ name: "ghanacard", data: user?.identifications?.find(x => x?.identification_type === "ghana_card")?.filename }) }}>
                                                                        <TopicOutlined />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            }

                                                            {
                                                                user?.agencies[0]?.documents?.find(x => x?.document_type === "business_registration")?.filename &&
                                                                <Tooltip title={"Business Registration Document"}>
                                                                    <IconButton onClick={() => { setOpenDoc(true); setDocData({ name: "businessdoc", data: user?.agencies[0]?.documents?.find(x => x?.document_type === "business_registration")?.filename }) }}>
                                                                        <TopicOutlined />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            }
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
                                                                <MenuItem onClick={() => { setOpenSuspend({ open: true, state: user?.suspended, id: user?.id, name: user?.firstName + " " + user?.lastName }); handleClose() }}>
                                                                    {user?.suspended ? t('admindashboard.users.table.menu.restore') : t('admindashboard.users.table.menu.suspend')}
                                                                </MenuItem>
                                                                <MenuItem onClick={() => { setOpenVerify({ open: true, state: user?.verified, id: user?.id, name: user?.firstName + " " + user?.lastName }); handleClose() }}>
                                                                    {user?.verified ? t('admindashboard.users.table.menu.unverify') : t('admindashboard.users.table.menu.verify')}
                                                                </MenuItem>
                                                                <MenuItem onClick={() => { setOpenDeactivate({ open: true, state: user?.deactivated, id: user?.id, name: user?.firstName + " " + user?.lastName }); handleClose() }}>
                                                                    {user?.deactivated ? t('admindashboard.users.table.menu.activate') : t('admindashboard.users.table.menu.deactivate')}
                                                                </MenuItem>
                                                                <MenuItem onClick={() => { setOpenDelete({ open: true, state: user?.deleted, id: user?.id, name: user?.firstName + " " + user?.lastName }); handleClose() }}>
                                                                    {!user?.deleted && t('admindashboard.users.table.menu.delete')}
                                                                </MenuItem>

                                                                <MenuItem onClick={() => editUser(user?.id)}>
                                                                    {t('admindashboard.users.table.menu.expand')}
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
                    users?.length > 0 && !loading ?
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

            <Popover sx={{ pointerEvents: 'none' }} open={openSuspendInfo} anchorEl={suspendInfoAnchorEl} anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }} transformOrigin={{ vertical: 'top', horizontal: 'left', }} onClose={handleSuspendPopoverClose} disableRestoreFocus>
                <SuspendInfo />
            </Popover>

            <Popover sx={{ pointerEvents: 'none' }} open={openVerifyInfo} anchorEl={verifyInfoAnchorEl} anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }} transformOrigin={{ vertical: 'top', horizontal: 'left', }} onClose={handleVerifyPopoverClose} disableRestoreFocus>
                <VerifyInfo />
            </Popover>

            <Popover sx={{ pointerEvents: 'none' }} open={openDeactivateInfo} anchorEl={deactivateInfoAnchorEl} anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }} transformOrigin={{ vertical: 'top', horizontal: 'left', }} onClose={handleDeactivatePopoverClose} disableRestoreFocus>
                <DeactivateInfo />
            </Popover>

            {/* <Popover sx={{ pointerEvents: 'none' }} open={openDeleteInfo} anchorEl={deleteInfoAnchorEl} anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }} transformOrigin={{ vertical: 'top', horizontal: 'left', }} onClose={handleDeletePopoverClose} disableRestoreFocus>
                <DeleteUserInfo />
            </Popover> */}

            {/* Suspend Account dialog */}
            <Suspend openSuspend={openSuspend} setOpenSuspend={setOpenSuspend} UpdateSuspended={UpdateSuspended} actionLoading={actionLoading} />

            {/* Verify Account dialog */}
            <Verify openVerify={openVerify} setOpenVerify={setOpenVerify} UpdateVerified={UpdateVerified} actionLoading={actionLoading} />

            {/* Deactivate Account dialog */}
            <Deactivate openDeactivate={openDeactivate} setOpenDeactivate={setOpenDeactivate} UpdateActivation={UpdateActivation} actionLoading={actionLoading} />

            {/* Delete Account dialog */}
            <DeleteUser openDelete={openDelete} setOpenDelete={setOpenDelete} UpdateDeletion={UpdateDeletion} actionLoading={actionLoading} />

            {/* Add support */}
            <AddSupport openAddSupport={openAddSupport} setOpenAddSupport={setOpenAddSupport} />

            <Dialog open={openDoc} onClose={() => { setOpenDoc(false) }} fullWidth maxWidth='md'>
                <DialogContent sx={{ overflow: "hidden" }}>
                    <Typography variant='h6' sx={{ fontWeight: "500" }}>{docData?.name === "ghanacard" ? t('admindashboard.users.table.ghanacard') : t('admindashboard.users.table.businessdoc')}</Typography>
                    <Box sx={{ height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <IconButton sx={{ position: 'absolute', top: "10px", right: "10px" }} onClick={() => setOpenDoc(false)}>
                            <Close color='#000' fontSize='medium' />
                        </IconButton>
                        <div
                            style={{
                                overflow: "hidden",
                                position: "relative",
                                width: "100%",
                                maxWidth: "calc(65vw - 80px)",
                                margin: "30px auto"
                            }}
                        >
                            <ReactPanZoom
                                image={`https://api.rehomeofficial.com/api/files/documents/${docData?.data}/${token}`}
                                alt="test"
                            />
                        </div>
                    </Box>
                </DialogContent>
            </Dialog>
        </Paper >
    )
}

export default AdminUsers