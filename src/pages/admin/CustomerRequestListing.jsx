import React, { useEffect, useState } from 'react'
import { Paper, Box, IconButton, Radio, RadioGroup, FormControlLabel, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Menu, MenuItem, Grid } from '@mui/material';
import { EditOutlined } from '@mui/icons-material'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'
import Api from '../../api/api';
import PageLoader from '../../components/PageLoader';
import { getUserType } from '../../services/auth';
import RoundButton from '../../components/Buttons/RoundButton';
import AddCustomerRequest from './AddCustomerRequest';

const pageLimit = 50

function CustomerRequestListing() {
    const { t } = useTranslation();
    const navigate = useNavigate()

    const columns = [
        { id: 'name', label: t('admindashboard.users.table.heading.name'), width: 50 },
        { id: 'email', label: t('admindashboard.users.table.heading.email'), width: 50 },
        { id: 'phone', label: t('admindashboard.users.table.heading.phone'), width: 50 },
        { id: 'type', label: t('admindashboard.users.table.heading.type'), width: 10 },
        { id: 'location', label: t('admindashboard.users.table.heading.locations'), width: 10 },
        { id: 'budget', label: t('admindashboard.users.table.heading.budget'), width: 50 },
        { id: 'status', label: t('admindashboard.users.table.heading.status'), width: 10 },
        { id: 'menu', label: '', width: 10 },
    ];

    const [pageNumber, setpageNumber] = useState(1)
    const [customerRequests, setCustomerRequests] = useState([])
    const [selectedCustomerRequest, setSelectedCustomerRequest] = useState(false)
    const [loading, setLoading] = useState(false)
    const [openAddCustomerRequest, setOpenAddCustomerRequest] = useState(false)
    const [count, setCount] = useState(1)
    const [status, setStatus] = useState('')

    const getCustomerRequests = () => {
        setLoading(true)

        let whereQuery = {}
        if (status)
            whereQuery.status = status

        Api().get('customer-property-requests', {
            params: {
                filter: {
                    limit: pageLimit, skip: (pageNumber - 1) * pageLimit,
                    order: 'createdAt DESC',
                    where: whereQuery
                }
            }
        })
            .then((res) => {
                setCustomerRequests(res?.data)
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
            })
    }

    useEffect(() => {
        getCustomerRequests()

    }, [pageNumber, status])

    useEffect(() => {
        if (!openAddCustomerRequest) {
            getCustomerRequests();
        }
    }, [openAddCustomerRequest])


    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: '73vh' }}>
                <Box sx={{ display: { xs: "block", md: 'flex' }, justifyContent: 'space-between', alignItems: 'center' }} my={4} mx={2.1}>
                    <Grid container spacing={3} mb={'3rem'}>
                        <Grid item xs={12} md={10} mb={2} sx={{ display: "flex", alignItems: "center" }}>
                            <RadioGroup
                                name="controlled-radio-buttons-group"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                row
                            >
                                <FormControlLabel
                                    value=""
                                    control={
                                        <Radio
                                            size="small"
                                        />
                                    }
                                    label={t('admindashboard.addcustomerrequest.all')}
                                />
                                <FormControlLabel
                                    value="open"
                                    control={
                                        <Radio
                                            size="small"
                                        />
                                    }
                                    label={t('admindashboard.addcustomerrequest.open')}
                                />
                                <FormControlLabel
                                    value="broadcast"
                                    control={
                                        <Radio
                                            size="small"
                                        />
                                    }
                                    label={t('admindashboard.addcustomerrequest.broadcasted')}
                                />
                                <FormControlLabel
                                    value="complete"
                                    control={
                                        <Radio
                                            size="small"
                                        />
                                    }
                                    label={t('admindashboard.addcustomerrequest.completed')}
                                />
                            </RadioGroup>
                        </Grid>
                        <Grid item xs={12} md={2} mb={2}>
                            {getUserType() === "admin" ?
                                <Box sx={{ display: "flex", justifyContent: "end" }}>
                                    <RoundButton onClick={() => { setSelectedCustomerRequest(null); setOpenAddCustomerRequest(true) }} text={t('admindashboard.addcustomerrequest.addbtn')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
                                </Box>
                                : ""}
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
                                customerRequests?.length < 1 ?
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
                                                        </span>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {customerRequests.map((cus, index) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={index} sx={{ '& .MuiTableCell-root': { borderLeft: "1px solid rgba(224, 224, 224, 1)" } }}>
                                                        <TableCell>
                                                            {cus?.first_name + " " + cus?.last_name}
                                                        </TableCell>

                                                        <TableCell sx={{ textTransform: "lowercase" }}>
                                                            <Typography variant='body2' noWrap>{cus?.email}</Typography>
                                                        </TableCell>

                                                        <TableCell sx={{ textTransform: "lowercase" }}>
                                                            <Typography variant='body2' noWrap>{cus?.phone}</Typography>
                                                        </TableCell>

                                                        <TableCell sx={{ textTransform: "lowercase" }}>
                                                            <Typography variant='body2' noWrap>{cus?.property_type}</Typography>
                                                        </TableCell>

                                                        <TableCell sx={{ textTransform: "lowercase" }}>
                                                            <Typography variant='body2' noWrap>{cus?.location?.join(', ')}</Typography>
                                                        </TableCell>

                                                        <TableCell>
                                                            <Typography variant='body2' noWrap>{`${cus?.currency} ${cus?.min_budget} - ${cus?.currency} ${cus?.max_budget}`}</Typography>
                                                        </TableCell>

                                                        <TableCell sx={{ textTransform: "lowercase" }}>
                                                            <Typography variant='body2' noWrap>{cus?.status}</Typography>
                                                        </TableCell>

                                                        <TableCell sx={{ textAlign: "center" }}>
                                                            <IconButton
                                                                aria-label="more"
                                                                id="long-button"
                                                                aria-haspopup="true"
                                                                onClick={(event) => { setSelectedCustomerRequest(cus); setOpenAddCustomerRequest(true) }}
                                                            >
                                                                <EditOutlined />
                                                            </IconButton>
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
                    customerRequests?.length > 0 && !loading ?
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

            {/* Add customer request */}
            <AddCustomerRequest openAddCustomerRequest={openAddCustomerRequest} setOpenAddCustomerRequest={setOpenAddCustomerRequest} customerRequest={selectedCustomerRequest} />

            {/* <Popover sx={{ pointerEvents: 'none' }} open={openSuspendInfo} anchorEl={suspendInfoAnchorEl} anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }} transformOrigin={{ vertical: 'top', horizontal: 'left', }} onClose={handleSuspendPopoverClose} disableRestoreFocus>
                <SuspendInfo />
            </Popover> */}
        </Paper >
    )
}

export default CustomerRequestListing