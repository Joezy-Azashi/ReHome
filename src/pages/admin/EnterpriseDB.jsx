import React, { useState, useEffect } from 'react'
import { Box, IconButton, InputAdornment, Pagination, TextField } from '@mui/material'
import { DataGrid, GridToolbar, useGridApiRef } from '@mui/x-data-grid';
import RoundButton from '../../components/Buttons/RoundButton'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { columns } from '../agents/EnterpriseTableHead'
import CustomEmailForm from '../../components/CustomEmailForm';
import Api from '../../api/api';
import { Close } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

const pageLimit = 15

function EnterpriseDB() {
    const { t } = useTranslation();
    const gridRef = useGridApiRef();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const [isExported, setIsExported] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [pageNumber, setpageNumber] = useState(1)
    const [count, setCount] = useState(0)
    const [recipientData, setRecipientData] = useState({})
    const [showPopup, setShowPopup] = useState(false)
    const { executeRecaptcha } = useGoogleReCaptcha();

    useEffect(() => {
        setIsExported(false)
        Api().get(`enterprises/search?filter=${searchTerm}&page=${pageNumber - 1}&size=${pageLimit}`)
            .then((res) => {
                setData(res?.data?.body.map((x, index) => ({
                    ...x._source,
                    id: index,
                    contacts: JSON.stringify(x._source.contacts)
                })))
                setCount(res?.data?.total_count)
            })
    }, [pageNumber, searchTerm])

    const handleExport = async () => {
        gridRef.current.exportDataAsCsv()
        setIsExported(true)
    };

    return (
        <>
            <Box sx={{ display: { xs: 'block', sm: 'flex' }, flexDirection: 'row', justifyContent: 'end' }}>
                <Box mb={4} mx={2.1} sx={{ display: "flex", justifyContent: "end" }}>
                    <RoundButton onClick={() => { isExported ? enqueueSnackbar('Data already exported', { variant: 'info' }) : handleExport() }} text={t('misc.export')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
                </Box>
                <Box mb={4} mx={2.1} sx={{ display: "flex", justifyContent: "end" }}>
                    <RoundButton onClick={() => navigate('/admin/add-enterprise-search')} text={t('admindashboard.enterprisedb.add')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
                </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "end" }} mb={4}>
                <TextField fullWidth sx={{
                    width: { xs: '100%', sm: '80%', lg: '35%' },
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '50px'
                    }
                }}
                    value={searchTerm}
                    size='small'
                    onChange={(e) => { setSearchTerm(e.target.value) }}
                    variant='outlined'
                    placeholder={t('admindashboard.enterprisedb.searchplaceholder')}
                    InputProps={{
                        endAdornment: <InputAdornment position='end'>
                            {searchTerm.length > 0 && <IconButton size='small' onClick={() => { setSearchTerm("") }}><Close fontSize='small' /></IconButton>}

                        </InputAdornment>
                    }}
                />
            </Box>

            <Box
                sx={{
                    width: '100%',
                    '& .shade1': {
                        backgroundColor: '#e7f0f7',
                        color: '#1a3e72',
                    },
                    '& .shade2': {
                        backgroundColor: '#d0e1ef',
                        color: '#1a3e72',
                    },
                    '& .shade3': {
                        backgroundColor: '#b8d1e8',
                        color: '#1a3e72',
                    },
                    '& .shade4': {
                        backgroundColor: '#a0c2e0',
                        color: '#1a3e72',
                    },
                    '& .shade5': {
                        backgroundColor: '#89b3d8',
                        color: '#ffffff',
                    },
                    '& .shade6': {
                        backgroundColor: '#71a4d0',
                        color: '#ffffff',
                    },
                    '& .shade7': {
                        backgroundColor: '#5995c8',
                        color: '#ffffff',
                    },
                    '& .shade8': {
                        backgroundColor: '#4185c1',
                        color: '#ffffff',
                    },
                    '& .shade9': {
                        backgroundColor: '#2a76b9',
                        color: '#ffffff',
                    },
                    '& .shade10': {
                        backgroundColor: '#1267b1',
                        color: '#ffffff',
                    },
                }}
            >
                <DataGrid
                    columns={columns(setShowPopup, setRecipientData)}
                    apiRef={gridRef}
                    rows={data}
                    checkboxSelection
                    disableRowSelectionOnClick
                    slots={{
                        toolbar: GridToolbar,
                    }}
                    componentsProps={{
                        toolbar: {
                            csvOptions: { disableToolbarButton: true },
                            printOptions: { disableToolbarButton: true },
                            showQuickFilter: false,
                            quickFilterProps: { debounceMs: 250 },
                        },
                    }}
                    onRowSelectionModelChange={(ids) => {
                        const selectedIDs = new Set(ids);
                        const selectedRowData = data.filter((row) => selectedIDs.has(row.id));
                        setSelectedRows(selectedRowData)
                        setIsExported(false)
                    }}
                    disableColumnFilter
                    hideFooterPagination
                    sx={{ '& .MuiDataGrid-footerContainer': { display: 'none' } }}

                    getCellClassName={(params) => {
                        if (params.field !== 'rating' || params.value == null) {
                            return '';
                        }
                        return params.value < 10 ? 'shade1' :
                            params.value > 9 && params.value < 20 ? 'shade2' :
                                params.value > 19 && params.value < 30 ? 'shade3' :
                                    params.value > 29 && params.value < 40 ? 'shade4' :
                                        params.value > 39 && params.value < 50 ? 'shade5' :
                                            params.value > 49 && params.value < 60 ? 'shade6' :
                                                params.value > 59 && params.value < 70 ? 'shade7' :
                                                    params.value > 69 && params.value < 80 ? 'shade8' :
                                                        params.value > 79 && params.value < 90 ? 'shade9' :
                                                            params.value > 90 ? 'shade9' : ''
                    }}
                />
            </Box>

            <Box my={'1rem'} display='flex' justifyContent={'flex-end'}>
                {
                    data?.length > 0 ?
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

            <CustomEmailForm executeRecaptcha={executeRecaptcha} showPopup={showPopup} setShowPopup={setShowPopup} recipientData={recipientData} />

        </>
    )
}

export default EnterpriseDB