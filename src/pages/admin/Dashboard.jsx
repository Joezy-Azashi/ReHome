import React, { useEffect, useState, useContext } from 'react'
import { Card, styled, Box, Typography, CircularProgress, Dialog, DialogContent, DialogActions, FormControlLabel, Checkbox, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Autocomplete, Chip, TextField, FormLabel, } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import PageLoader from '../../components/PageLoader';
import { useTranslation } from 'react-i18next';
import RoundButton from '../../components/Buttons/RoundButton';
import Api from '../../api/api';
import RateContext from '../../contexts/rateContext';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { CSVLink } from 'react-csv';

const WrapCard = styled(Card)(({ theme }) => ({
    borderRadius: '10px',
    marginBottom: "30px"
}))

const TextInput = styled(TextField)(({ theme }) => ({
    marginBottom: '1rem',
    '& .MuiOutlinedInput-root': {
        background: '#fff',
        borderRadius: '15px'
    }
}))

function Dashboard() {
    const { t } = useTranslation();
    const [chartData, setChartData] = useState()
    const [tableData, setTableData] = useState([])
    const [lineData, setLineData] = useState([])
    const ExContext = useContext(RateContext);

    const propertyTypes = [
        {
            name: t('filter.propertytype.apartments'),
            Properties: chartData?.number_of_apartments
        },
        {
            name: t('filter.propertytype.houses'),
            Properties: chartData?.number_of_houses
        },
        {
            name: t('filter.propertytype.commercial'),
            Properties: chartData?.number_of_commercials
        },
        {
            name: t('filter.propertytype.lands'),
            Properties: chartData?.number_of_lands
        },
        {
            name: t('filter.propertytype.development'),
            Properties: chartData?.number_of_development_units
        }
    ];

    const users = [
        { name: t('admindashboard.users.usertypes.agent'), value: chartData?.number_of_agents, color: '#0088FE' },
        { name: t('admindashboard.users.usertypes.realtor'), value: chartData?.number_of_realtors, color: '#00C49F' },
        { name: t('admindashboard.users.usertypes.developer'), value: chartData?.number_of_developers, color: '#FFBB28' }
    ];

    const availableprops = [
        { name: t('agentdashboard.home.forrent'), value: chartData?.number_of_for_rent, color: '#DE4C8A' },
        { name: t('agentdashboard.home.forsale'), value: chartData?.number_of_for_sale, color: '#4A192C' }
    ];

    const unavailableprops = [
        { name: t('agentdashboard.home.rented'), value: chartData?.number_of_rented, color: '#57A639' },
        { name: t('agentdashboard.home.sold'), value: chartData?.number_of_sold, color: '#6C6874' }
    ];

    const RADIAN = Math.PI / 180;

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, index }) => {
        const radius = (outerRadius) * 0.4;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="13px">
                {value}
            </text>
        );
    };

    const [loading, setLoading] = useState(false)
    const [messageLoading, setMessageLoading] = useState(false)
    const [agentLoading, setAgentLoading] = useState(false)
    const { enqueueSnackbar } = useSnackbar();
    const [openSendEmail, setOpenSendEmail] = useState(false)
    const [openSendMessage, setOpenSendMessage] = useState(false)
    const [sureDelete, setSureDelete] = useState(false)
    const [agents, setAgents] = useState([])
    const [agentFilter, setAgentFilter] = useState("")
    const [messageData, setMessageData] = useState({
        agentIds: [],
        message: { en: "", fr: "" }
    })
    const [error, setError] = useState(false)

    const [leadsReportData, setLeadsReportData] = useState([]);
    const [reportloading, setReportLoading] = useState(false);
    const [leadsFilter, setLeadsFilter] = useState({
        name: '',
        from: dayjs().startOf('month'),
        to: dayjs().endOf('month')
    })
    const [csv,setCSV] = useState({
        filename: 'test.csv',
        data: [
            [t("admindashboard.dashboard.leadsreport.agentleads")],
            [],[],
            [t("admindashboard.dashboard.leadsreport.table.name"), t("admindashboard.dashboard.leadsreport.table.propertyform"), t("admindashboard.dashboard.leadsreport.table.caller"), t("admindashboard.dashboard.leadsreport.table.contactform")],
            ["Lorem", 0, 1, 0],
            [t("admindashboard.dashboard.leadsreport.totals"), 0, 4, 0],
            [],[],
            [t("admindashboard.dashboard.leadsreport.propertyleads")],
            [],[],
            [t("admindashboard.dashboard.leadsreport.table.name"), t("admindashboard.dashboard.leadsreport.table.propertyform"), t("admindashboard.dashboard.leadsreport.table.caller"), t("admindashboard.dashboard.leadsreport.table.contactform")],
            ["Ipsum (Lorem)", 0, 1, 0],
            [t("admindashboard.dashboard.leadsreport.totals"), 0, 4, 0],
          ]
    })

    const postEmail = () => {
        setLoading(true)
        Api().post('/notifications/notify/terms_and_conditions')
            .then((res) => {
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
            })
    }

    const generateThumbnails = () => {
        setLoading(true)
        Api().post('/files/thumbnail/all')
            .then(() => {
                enqueueSnackbar('Thumbnails successfully generated', { variant: 'success' });

                Api().post('/files/thumbnail/delete')
                    .then((res) => {
                        setLoading(false)
                        enqueueSnackbar('Thumbnails temp files successfully deleted', { variant: 'success' });
                    })
                    .catch((error) => {
                        setLoading(false)
                        console.log(error)
                        enqueueSnackbar('failed to delete thumbnails temp files', { variant: 'error' });
                    })
            })
            .catch((error) => {
                setLoading(false)
                console.log(error)
                enqueueSnackbar('failed to generate thumbnails', { variant: 'error' });
            })
    }

    const getChartData = () => {
        setLoading(true)
        Api().get('/statistics/summary')
            .then((res) => {
                setChartData(res?.data)
                setTableData([
                    { amount_on_for_rent: res.data.amount_on_for_rent },
                    { amount_on_for_sale: res.data.amount_on_for_sale },
                    { amount_on_developments: res.data.amount_on_developments },
                    { amount_on_commercials: res.data.amount_on_commercials },
                    { amount_on_lands: res.data.amount_on_lands },
                    { amount_on_houses: res.data.amount_on_houses },
                    { amount_on_apartments: res.data.amount_on_apartments },
                    { amount_on_sold: res.data.amount_on_sold },
                    { amount_on_rented: res.data.amount_on_rented }
                ])
            })
            .finally(() => {
                setLoading(false);
            })
        Api().get('/admin-statistics/', {
            filter: {
                params: {
                    createdAt: {gt: moment().startOf('year').toISOString()}
            }}})
            .then((res) => {
                const mappedData =  res?.data.map(x=>{
                    return {
                        name: moment(x.createdAt).format('MMMM'),
                        value: x.number_of_properties_total || (x.number_of_apartments +
                        x.number_of_houses +
                        x.number_of_commercials +
                        x.number_of_lands +
                        (x.number_of_development_units || x.number_of_developments))
                    }
                })

                const newLinedata = []
                mappedData.forEach(x=>{
                    if (!newLinedata.find(y=>y.name === x.name)) {
                        newLinedata.push(x);
                      }
                })

                setLineData(newLinedata);                
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const getLeadsReportData = () => {

        setReportLoading(true)
        Api().get('/lead-statistics',{
            params: {
                filter: {
                    name: leadsFilter.name,
                    from: leadsFilter.from.toISOString(),
                    to: leadsFilter.to.toISOString()
                },
            }
        })
        .then(res => {
            setLeadsReportData(res.data);

            let new_csv = {
                filename: `LEADS REPORT ${leadsFilter.name ? '('+leadsFilter.name+')': ''}: ${leadsFilter.from.format('LLL')} - ${leadsFilter.to.format('LLL')}.csv`,
                data: [
                    [t("admindashboard.dashboard.leadsreport.agentleads")],
                    [],[],
                    [t("admindashboard.dashboard.leadsreport.table.name"), t("admindashboard.dashboard.leadsreport.table.propertyform"), t("admindashboard.dashboard.leadsreport.table.caller"), t("admindashboard.dashboard.leadsreport.table.contactform")],
                

                    [],[],

                    [t("admindashboard.dashboard.leadsreport.propertyleads")],
                    [],[],
                    [t("admindashboard.dashboard.leadsreport.table.name"), t("admindashboard.dashboard.leadsreport.table.propertyform"), t("admindashboard.dashboard.leadsreport.table.caller"), t("admindashboard.dashboard.leadsreport.table.contactform")],
                    
                ]
            }

            let agent_data = res.data.filter(lr => lr.type === 'agent').map(lr => [lr.name, lr.propertyFormCount, lr.callCount, lr.contactFormCount])
            agent_data.push([t("admindashboard.dashboard.leadsreport.totals"), res.data.filter(lrd => lrd.type === 'agent').reduceRight((t,l) => t+l.propertyFormCount, 0), res.data.filter(lrd => lrd.type === 'agent').reduceRight((t,l) => t+l.callCount, 0), res.data.filter(lrd => lrd.type === 'agent').reduceRight((t,l) => t+l.contactFormCount, 0),])
            let property_data = res.data.filter(lr => lr.type === 'property').map(lr => [lr.name, lr.propertyFormCount, lr.callCount, lr.contactFormCount])
            property_data.push([t("admindashboard.dashboard.leadsreport.totals"), res.data.filter(lrd => lrd.type === 'property').reduceRight((t,l) => t+l.propertyFormCount, 0), res.data.filter(lrd => lrd.type === 'property').reduceRight((t,l) => t+l.callCount, 0), res.data.filter(lrd => lrd.type === 'property').reduceRight((t,l) => t+l.contactFormCount, 0),])

            Array.prototype.splice.apply(new_csv.data, [10, 0].concat(property_data));
            Array.prototype.splice.apply(new_csv.data, [4, 0].concat(agent_data));

            setCSV(new_csv);            
        })
        .finally(() => {
            setReportLoading(false);
        })
    }

    const clearMessageData = () => {
        setMessageData({
            agentIds: [],
            message: { en: "", fr: "" }
        });
        setLoading(false);
        setError(false);
    }

    const submitMessage = () => {
        if (messageData.agentIds.length < 1 || messageData.message.fr === "" || messageData.message.en === "") {
            setError(true)
            enqueueSnackbar(t('admindashboard.addsupport.error'), { variant: 'error' });
        } else {

            setMessageLoading(true)

            Api().post('/emails/broadcast', messageData)
                .then((res) => {
                    setMessageLoading(false)
                    setOpenSendMessage(false)
                    clearMessageData()
                    enqueueSnackbar(res?.data, { variant: 'success' });
                })
                .catch((error) => {
                    setMessageLoading(false)
                })

        }
    }

    const updateMessageDataAgentIds = (value) => {
        setMessageData({ ...messageData, agentIds: value.map(agent => agent.id) })
    }

    useEffect(() => {
        if (agentFilter.length > 3) {
            setAgentLoading(true)
            let pattern = { like: ".*" + agentFilter + ".*", options: "i" };
            Api().get(`/users`, {
                params: {
                    filter: {
                        where: {
                            or: [
                                { firstName: pattern },
                                { lastName: pattern }
                            ],
                            userType: { inq: ['agent', 'developer', 'realtor'] }
                        },
                        include: ["agencies"]
                    }
                }
            })
                .then((res) => {
                    setAgents(res.data);
                    setAgentLoading(false)
                })
                .catch((error) => {
                    setAgentLoading(false)
                    setAgents([]);
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [agentFilter])

    useEffect(() => {
        getChartData();
    }, [])

    useEffect(() => {
        getLeadsReportData();
    }, [leadsFilter])

    return (
        <Box>
            {/* Statistics */}
            <WrapCard elevation={0} sx={{ height: '100%', padding: "2rem" }}>
                <Box padding={'.9rem 0rem'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='h6' sx={{ fontSize: '1.2rem' }}>{t('admindashboard.dashboard.statistics.title')}</Typography>
                </Box>

                <Grid container spacing={3} alignItems={"end"}>

                    {/* Bar chart */}
                    <Grid item xs={12} lg={7}>
                        <Box>
                            <ResponsiveContainer width="95%" height={400}>
                                <BarChart
                                    data={propertyTypes}
                                    margin={{
                                        top: 20,
                                        right: 14,
                                        left: 0,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Properties" fill="#1267B1" />
                                </BarChart>
                            </ResponsiveContainer>
                            <Box sx={{ display: { xs: 'block', md: 'flex' }, flexDirection: 'row', justifyContent: 'space-between', paddingRight: '30px' }}>
                                <Typography fontWeight={'400'} mt={2} fontSize={'1.2rem'}>{t('admindashboard.dashboard.statistics.totalprops')}: <span style={{ fontWeight: "500" }}>{
                                    chartData?.number_of_properties_total
                                }</span>
                                </Typography>
                                <Typography fontWeight={'400'} mt={2} fontSize={'1.2rem'}>{t('admindashboard.dashboard.statistics.totalpubprops')}: <span style={{ fontWeight: "500" }}>{
                                    chartData?.number_of_apartments +
                                    chartData?.number_of_houses +
                                    chartData?.number_of_commercials +
                                    chartData?.number_of_lands +
                                    (chartData?.number_of_development_units || chartData?.number_of_developments)
                                }</span>
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Pie chart */}
                    <Grid item xs={12} lg={5}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sx={{ justifyContent: "center" }}>
                                <Box>
                                    <ResponsiveContainer width="95%" height={175}>
                                        <PieChart width={800} height={800}>
                                            <Pie
                                                data={users}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={renderCustomizedLabel}
                                                outerRadius={80}
                                                innerRadius={10}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {users.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "15px" }}>
                                        {
                                            users?.map((el, index) => {
                                                return (
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                        <Box style={{ height: "10px", width: "15px", backgroundColor: el?.color }} />
                                                        <Typography variant='body2'>{el?.name}</Typography>
                                                    </Box>
                                                )
                                            })
                                        }
                                        <Typography variant='body2'>{t('admindashboard.dashboard.statistics.total')}: <span style={{ fontWeight: "500" }}>{
                                            chartData?.number_of_agents +
                                            chartData?.number_of_realtors +
                                            chartData?.number_of_developers
                                        }</span></Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box>
                                    <ResponsiveContainer width="95%" height={175}>
                                        <PieChart width={800} height={800}>
                                            <Pie
                                                data={availableprops}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={renderCustomizedLabel}
                                                outerRadius={80}
                                                innerRadius={10}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {availableprops.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}>
                                        {
                                            availableprops?.map((el, index) => {
                                                return (
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                        <Box style={{ height: "10px", width: "15px", backgroundColor: el?.color }} />
                                                        <Typography variant='body2'>{el?.name}</Typography>
                                                    </Box>
                                                )
                                            })
                                        }
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box>
                                    <ResponsiveContainer width="95%" height={175}>
                                        <PieChart width={800} height={800}>
                                            <Pie
                                                data={unavailableprops}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={renderCustomizedLabel}
                                                outerRadius={80}
                                                innerRadius={10}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {unavailableprops.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}>
                                        {
                                            unavailableprops?.map((el, index) => {
                                                return (
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                        <Box style={{ height: "10px", width: "15px", backgroundColor: el?.color }} />
                                                        <Typography variant='body2'>{el?.name}</Typography>
                                                    </Box>
                                                )
                                            })
                                        }
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                    </Grid>

                    {/* Graph chart */}
                    <Grid item xs={12} lg={12} marginTop={'30px'}>
                        <Box>
                            <ResponsiveContainer width="95%" height={400}>
                            <LineChart 
                                margin={{
                                    top: 20,
                                    right: 14,
                                    left: 0,
                                    bottom: 5,
                                }} data={lineData}>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#8884d8" />
                            </LineChart>
                            </ResponsiveContainer>
                            <Box sx={{ display: { xs: 'block', md: 'flex' }, flexDirection: 'row', justifyContent: 'center', }}>
                                <Typography fontWeight={'400'} mt={2} fontSize={'1.2rem'}>{t('admindashboard.dashboard.statistics.propsgrowth')}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>


                    {/* Cash Amount Table*/}
                    <Grid item xs={12} lg={12} marginTop={'30px'} display={"flex"} justifyContent={"center"}>
                        <TableContainer>
                            <Table stickyHeader size='small' aria-label="sticky table">
                                {
                                    loading ?
                                        <Box my={15}>
                                            <PageLoader />
                                        </Box>
                                        :
                                        <>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell
                                                        key={0}
                                                        align={'left'}
                                                        style={{ width: '70%' }}
                                                    >
                                                        <span style={{ display: "flex", alignItems: "center" }}>

                                                        </span>
                                                    </TableCell>

                                                    <TableCell
                                                        key={1}
                                                        align={'right'}
                                                        style={{ width: '30%' }}
                                                    >
                                                        <span style={{ display: "flex", width: '100%', justifyContent: "flex-end" }}>
                                                            {t("admindashboard.dashboard.statistics.table.cash_amount")} ({ExContext?.preferredCurrency})
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {tableData.map((data, index) => {
                                                    return (
                                                        <TableRow key={index} sx={{ '& .MuiTableCell-root': { border: "1px solid rgba(224, 224, 224, 1)" } }}>
                                                            <TableCell>
                                                                {t("admindashboard.dashboard.statistics.table." + Object.keys(data)[0])}
                                                            </TableCell>
                                                            <TableCell style={{ textAlign: "right" }}>
                                                                <span style={{ fontWeight: '500', color: '#03254c' }}>{(ExContext?.convert('GHS', Number(Object.values(data)[0]).toFixed(2)))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}

                                                <TableRow hover role="checkbox" tabIndex={-1} key={10} sx={{ '& .MuiTableCell-root': { border: "1px solid rgba(224, 224, 224, 1)", backgroundColor: 'lightgray' } }}>
                                                    <TableCell style={{ fontWeight: '500', color: '#03254c' }}>
                                                        {t("admindashboard.dashboard.statistics.totalpropsamt")}
                                                    </TableCell>
                                                    <TableCell style={{ textAlign: "right" }}>
                                                        <span style={{ fontWeight: '500', color: '#03254c' }}>{(ExContext?.convert('GHS',
                                                            Number((chartData?.amount_on_apartments +
                                                            chartData?.amount_on_houses +
                                                            chartData?.amount_on_commercials +
                                                            chartData?.amount_on_lands +
                                                            chartData?.amount_on_developments).toFixed(2))
                                                        ))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                        }</span>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </>
                                }
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </WrapCard>


            {/* Leads Report */}
            <WrapCard elevation={0} sx={{ height: '100%', padding: "2rem" }}>
                <Box padding={'.9rem 0rem'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='h6' sx={{ fontSize: '1.2rem' }}>{t('admindashboard.dashboard.leadsreport.title')}</Typography>
                </Box>

                <Grid container spacing={3} alignItems={"end"}>

                    {/* Filters */}
                    <Grid item xs={12} lg={12} marginTop={'30px'} display={"flex"} justifyContent={"flex-start"} gap={2}>
                        
                        <Grid item xs={3}>
                            <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{t('admindashboard.discount.table.heading.start')}</FormLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: "50px" }, marginBottom: '1rem', }}
                                        value={leadsFilter.from}
                                        error={leadsFilter.from?.length > 0 ? false : error}
                                        onChange={(newValue) => {
                                            setLeadsFilter({...leadsFilter, from: newValue});
                                            setError(false)
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>
                        
                        <Grid item xs={3}>
                            <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{t('admindashboard.discount.table.heading.end')}</FormLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: "50px" }, marginBottom: '1rem', }}
                                        value={leadsFilter.to}
                                        error={leadsFilter.to?.length > 0 ? false : error}
                                        onChange={(newValue) => {
                                            setLeadsFilter({...leadsFilter, to: newValue});
                                            setError(false)
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={3}>
                                <FormLabel sx={{ color: "#000", marginLeft: ".8rem"}}>{t('admindashboard.discount.table.heading.name')}</FormLabel>
                                <TextField
                                    sx={{ 
                                        marginTop: '.4rem',
                                        marginBottom: '1rem',
                                        '& .MuiOutlinedInput-root': {
                                            background: '#fff',
                                            borderRadius: '50px'
                                        }
                                    }}
                                    size="small"
                                    value={leadsFilter.name}
                                    error={leadsFilter.name?.length > 0 ? false : error}
                                    onChange={(e) => { setLeadsFilter({...leadsFilter, name: e.target.value}); setError(false) }}
                                    placeholder={t('admindashboard.dashboard.leadsreport.searchplaceholder')}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={3} display={'flex'} justifyContent={'flex-end'}>
                                <Box my={3.5} mx={2.1} sx={{ display: "flex", justifyContent: "end", backgroundColor: '#5b9c00', padding: '10px', paddingLeft: '30px', paddingRight: '30px', borderRadius: '30px', color: 'white', cursor: "pointer" }}>
                                    <CSVLink data={csv.data} filename={csv.filename}>{t('misc.export')}</CSVLink>
                                </Box>
                            </Grid>
                    </Grid>

                    {/* Agent Leads Table*/}
                    <Grid item xs={12} lg={12} marginTop={'30px'} display={"flex"} justifyContent={"center"}>
                        <TableContainer>
                            <Typography variant='h6' sx={{ fontSize: '.9rem' }}>{t('admindashboard.dashboard.leadsreport.agentleads')}</Typography>
                            <Table stickyHeader size='small' aria-label="sticky table">
                                {
                                    reportloading ?
                                        <Box my={15}>
                                            <PageLoader />
                                        </Box>
                                        :
                                        <>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell
                                                        key={0}
                                                        align={'left'}
                                                        style={{ width: '40%' }}
                                                    >
                                                        <span style={{ display: "flex", alignItems: "center" }}>
                                                            {t("admindashboard.dashboard.leadsreport.table.name")}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell
                                                        key={0}
                                                        align={'right'}
                                                        style={{ width: '20%' }}
                                                    >
                                                        <span style={{ display: "flex", justifyContent: "flex-end" }}>
                                                            {t("admindashboard.dashboard.leadsreport.table.propertyform")}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell
                                                        key={0}
                                                        align={'right'}
                                                        style={{ width: '20%' }}
                                                    >
                                                        <span style={{ display: "flex", justifyContent: "flex-end" }}>
                                                            {t("admindashboard.dashboard.leadsreport.table.caller")}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell
                                                        key={0}
                                                        align={'right'}
                                                        style={{ width: '20%' }}
                                                    >
                                                        <span style={{ display: "flex", justifyContent: "flex-end" }}>
                                                            {t("admindashboard.dashboard.leadsreport.table.contactform")}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {leadsReportData.filter(lrd => lrd.type === 'agent').map((data, index) => {
                                                    return (
                                                        <TableRow key={index} sx={{ '& .MuiTableCell-root': { border: "1px solid rgba(224, 224, 224, 1)" } }}>
                                                            <TableCell>
                                                                {data.name}
                                                            </TableCell>
                                                            <TableCell style={{ textAlign: "right" }}>
                                                                <span style={{ fontWeight: '500', color: '#03254c' }}>{data.propertyFormCount}</span>
                                                            </TableCell>
                                                            <TableCell style={{ textAlign: "right" }}>
                                                                <span style={{ fontWeight: '500', color: '#03254c' }}>{data.callCount}</span>
                                                            </TableCell>
                                                            <TableCell style={{ textAlign: "right" }}>
                                                                <span style={{ fontWeight: '500', color: '#03254c' }}>{data.contactFormCount}</span>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}

                                                <TableRow hover role="checkbox" tabIndex={-1} key={10} sx={{ '& .MuiTableCell-root': { border: "1px solid rgba(224, 224, 224, 1)", backgroundColor: 'lightgray' } }}>
                                                    <TableCell style={{ fontWeight: '500', color: '#03254c' }}>
                                                        {t("admindashboard.dashboard.leadsreport.totals")}
                                                    </TableCell>
                                                    <TableCell style={{ textAlign: "right" }}>
                                                        <span style={{ fontWeight: '500', color: '#03254c' }}>
                                                            {leadsReportData.filter(lrd => lrd.type === 'agent').reduceRight((t,l) => t+l.propertyFormCount, 0)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell style={{ textAlign: "right" }}>
                                                        <span style={{ fontWeight: '500', color: '#03254c' }}>
                                                            {leadsReportData.filter(lrd => lrd.type === 'agent').reduceRight((t,l) => t+l.callCount, 0)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell style={{ textAlign: "right" }}>
                                                        <span style={{ fontWeight: '500', color: '#03254c' }}>
                                                            {leadsReportData.filter(lrd => lrd.type === 'agent').reduceRight((t,l) => t+l.contactFormCount, 0)}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </>
                                }
                            </Table>
                        </TableContainer>
                    </Grid>

                    {/* Property Leads Table*/}
                    <Grid item xs={12} lg={12} marginTop={'30px'} display={"flex"} justifyContent={"center"}>
                        <TableContainer>
                            <Typography variant='h6' sx={{ fontSize: '.9rem' }}>{t('admindashboard.dashboard.leadsreport.propertyleads')}</Typography>
                            <Table stickyHeader size='small' aria-label="sticky table">
                                {
                                    reportloading ?
                                        <Box my={15}>
                                            <PageLoader />
                                        </Box>
                                        :
                                        <>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell
                                                        key={0}
                                                        align={'left'}
                                                        style={{ width: '40%' }}
                                                    >
                                                        <span style={{ display: "flex", alignItems: "center" }}>
                                                            {t("admindashboard.dashboard.leadsreport.table.name")}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell
                                                        key={0}
                                                        align={'right'}
                                                        style={{ width: '20%' }}
                                                    >
                                                        <span style={{ display: "flex", justifyContent: "flex-end" }}>
                                                            {t("admindashboard.dashboard.leadsreport.table.propertyform")}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell
                                                        key={0}
                                                        align={'right'}
                                                        style={{ width: '20%' }}
                                                    >
                                                        <span style={{ display: "flex", justifyContent: "flex-end" }}>
                                                            {t("admindashboard.dashboard.leadsreport.table.caller")}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell
                                                        key={0}
                                                        align={'right'}
                                                        style={{ width: '20%' }}
                                                    >
                                                        <span style={{ display: "flex", justifyContent: "flex-end" }}>
                                                            {t("admindashboard.dashboard.leadsreport.table.contactform")}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {leadsReportData.filter(lrd => lrd.type === 'property').map((data, index) => {
                                                    return (
                                                        <TableRow key={index} sx={{ '& .MuiTableCell-root': { border: "1px solid rgba(224, 224, 224, 1)" } }}>
                                                            <TableCell>
                                                                {data.name}
                                                            </TableCell>
                                                            <TableCell style={{ textAlign: "right" }}>
                                                                <span style={{ fontWeight: '500', color: '#03254c' }}>{data.propertyFormCount}</span>
                                                            </TableCell>
                                                            <TableCell style={{ textAlign: "right" }}>
                                                                <span style={{ fontWeight: '500', color: '#03254c' }}>{data.callCount}</span>
                                                            </TableCell>
                                                            <TableCell style={{ textAlign: "right" }}>
                                                                <span style={{ fontWeight: '500', color: '#03254c' }}>{data.contactFormCount}</span>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}

                                                <TableRow hover role="checkbox" tabIndex={-1} key={10} sx={{ '& .MuiTableCell-root': { border: "1px solid rgba(224, 224, 224, 1)", backgroundColor: 'lightgray' } }}>
                                                    <TableCell style={{ fontWeight: '500', color: '#03254c' }}>
                                                        {t("admindashboard.dashboard.leadsreport.totals")}
                                                    </TableCell>
                                                    <TableCell style={{ textAlign: "right" }}>
                                                        <span style={{ fontWeight: '500', color: '#03254c' }}>
                                                            {leadsReportData.filter(lrd => lrd.type === 'property').reduceRight((t,l) => t+l.propertyFormCount, 0)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell style={{ textAlign: "right" }}>
                                                        <span style={{ fontWeight: '500', color: '#03254c' }}>
                                                            {leadsReportData.filter(lrd => lrd.type === 'property').reduceRight((t,l) => t+l.callCount, 0)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell style={{ textAlign: "right" }}>
                                                        <span style={{ fontWeight: '500', color: '#03254c' }}>
                                                            {leadsReportData.filter(lrd => lrd.type === 'property').reduceRight((t,l) => t+l.contactFormCount, 0)}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </>
                                }
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </WrapCard>

            {/* Email */}
            <WrapCard elevation={0} sx={{ height: '100%', padding: "2rem" }}>
                <Box padding={'.9rem 0rem'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='h6' sx={{ fontSize: '1.2rem' }}>{t('admindashboard.dashboard.email.title')}</Typography>
                </Box>
                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                    <Grid item xs={12} md={5}>
                        <RoundButton
                            text={loading || t('admindashboard.dashboard.email.button')}
                            sx={{ padding: '.5rem 1.5rem', display: 'block', m: '2rem 0 1rem 0' }}
                            onClick={() => setOpenSendEmail(true)}
                            variant='contained'
                            color={'primary'}
                            disableElevation
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RoundButton
                            text={loading || t('admindashboard.dashboard.email.broadcast.button')}
                            sx={{ padding: '.5rem 1.5rem', display: 'block', m: '2rem 0 1rem 0' }}
                            onClick={() => setOpenSendMessage(true)}
                            variant='contained'
                            color={'primary'}
                            disableElevation
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <RoundButton
                            text={loading || 'Generate Thumbnails'}
                            sx={{ padding: '.5rem 1.5rem', display: 'block', m: '2rem 0 1rem 0' }}
                            onClick={() => generateThumbnails()}
                            variant='contained'
                            color={'secondary'}
                            disableElevation
                        />
                    </Grid>
                </Grid>
            </WrapCard>

            {/* Send email dialog */}
            <Dialog open={openSendEmail} onClose={() => setOpenSendEmail} fullWidth maxWidth='xs'>
                <DialogContent>
                    <Typography>
                        {t('admindashboard.dashboard.email.dialognote')}
                    </Typography>
                    <Box sx={{ marginTop: "1rem" }}>
                        <FormControlLabel control={<Checkbox value={sureDelete} checked={sureDelete} onChange={() => { setSureDelete(!sureDelete) }} />} label={t('admindashboard.dashboard.email.deletewarning')} />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ padding: "0 20px 20px 0" }}>
                    <RoundButton onClick={() => { setOpenSendEmail(false); setSureDelete(false) }} text={t('admindashboard.dashboard.email.cancel')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
                    <RoundButton
                        onClick={() => { postEmail(); setSureDelete(false) }}
                        progress={loading && (
                            <CircularProgress
                                size={20}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: "primary"
                                }}
                            />
                        )}
                        text={loading || t('admindashboard.dashboard.email.send')}
                        disableElevation
                        variant={'outlined'}
                        sx={{ padding: '.5rem 1.5rem' }}
                        disable={!sureDelete}
                    />
                </DialogActions>
            </Dialog>

            {/* Send message dialog */}
            <Dialog open={openSendMessage} onClose={() => setOpenSendMessage(false)} fullWidth maxWidth='md'>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant={"h6"} textAlign={'center'} mb={2}>{t('admindashboard.dashboard.email.broadcast.title')}</Typography>

                            <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{t('admindashboard.dashboard.email.broadcast.agents')}</FormLabel>
                            <Autocomplete
                                multiple
                                loading={agentLoading}
                                limitTags={3}
                                id="tags-standard"
                                renderOption={(props, option) => {
                                    return (
                                        <li {...props} key={option.id}>
                                            {`${option?.fullname}`}
                                        </li>
                                    );
                                }}
                                options={agents}
                                getOptionLabel={option => `${option?.fullname}`}
                                sx={{
                                    '& .MuiAutocomplete-inputRoot': { flexWrap: "normal" }
                                }}
                                onChange={(event, newValue) => {
                                    updateMessageDataAgentIds(newValue)
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                background: '#fff',
                                                borderRadius: '50px'
                                            },
                                            // padding: "0px 14px !important",
                                        }}
                                        variant="outlined"
                                        size="small"
                                        value={agentFilter}
                                        onChange={(e) => { setAgentFilter(e.target.value) }}
                                        placeholder={t('admindashboard.dashboard.email.broadcast.agents_placeholder')}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{"English"}</FormLabel>
                            <TextInput
                                value={messageData.message.en}
                                error={messageData.message.en?.length > 0 ? false : error}
                                onChange={(e) => {
                                    setMessageData({
                                        ...messageData,
                                        message: { en: e.target.value, fr: messageData.message.fr }
                                    }); setError(false)
                                }}
                                multiline
                                rows={5}
                                fullWidth
                                placeholder={"Type your Message in English"}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <FormLabel sx={{ color: "#000", marginLeft: ".8rem" }}>{"Français"}</FormLabel>
                            <TextInput
                                value={messageData.message.fr}
                                error={messageData.message.fr?.length > 0 ? false : error}
                                onChange={(e) => {
                                    setMessageData({
                                        ...messageData,
                                        message: { fr: e.target.value, en: messageData.message.en }
                                    }); setError(false)
                                }}
                                multiline
                                rows={5}
                                fullWidth
                                placeholder={"Tapez votre message en français"}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ display: "flex", justifyContent: "end" }} mt={2}>
                        <RoundButton onClick={() => { setOpenSendMessage(false); clearMessageData() }} text={t('admindashboard.dashboard.email.broadcast.cancel')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem', marginRight: '1rem' }} />
                        <RoundButton
                            onClick={() => { submitMessage() }}
                            progress={messageLoading && (
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
                            text={loading || t('admindashboard.dashboard.email.broadcast.submit')}
                            disableElevation
                            variant={'outlined'}
                            sx={{ padding: '.5rem 1.5rem' }}
                        />
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default Dashboard