import React, { useEffect, useState } from 'react'
import { Box, Checkbox, CircularProgress, Container, FormControlLabel, FormGroup, FormLabel, MenuItem, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import RoundButton from './Buttons/RoundButton';
import Api from '../api/api';

function DSARForm({ data, isAdmin }) {

    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [submitter, setSubmitter] = useState('as_person');
    const [law, setLaw] = useState('GDPR');
    const [loading, setLoading] = useState(false);
    const [request, setRequest] = useState('');
    const [note, setNote] = useState('');
    const [accurate_information_confirmations, setAccurateInformation] = useState(false);
    const [deletion_risk_confirmations, setDeletionRisk] = useState(false);
    const [validation_confirmations, setValidation] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    useEffect(() => {
        if (data) {
            setName(data?.name)
            setEmail(data?.email)
            setSubmitter(data?.submitter)
            setLaw(data?.law)
            setRequest(data?.request)
            setNote(data?.note)
            setDeletionRisk(data?.deletion_risk_confirmations)
            setValidation(data?.validation_confirmations)
            setAccurateInformation(data?.accurate_information_confirmations)
        }
    }, [data])

    const sendDSAR = () => {
        if (!name || !email || !submitter || !law || !request || !accurate_information_confirmations || !deletion_risk_confirmations || !validation_confirmations) {
            setError(true)
            enqueueSnackbar(t('admindashboard.addsupport.error'), { variant: 'error' });
            return;
        }

        const data = {
            name: name,
            email: email,
            submitter: submitter,
            law: law,
            request: request,
            note: note,
            accurate_information_confirmations: accurate_information_confirmations,
            deletion_risk_confirmations: deletion_risk_confirmations,
            validation_confirmations: validation_confirmations
        }

        setLoading(true)

        Api().post('/dsars', data)
            .then((res) => {
                setLoading(false)
                clearData()
                enqueueSnackbar(t('dsar.submitsuccess'), { variant: 'success' });
            })
            .catch((error) => {
                enqueueSnackbar(error?.response?.data?.error?.message, { variant: 'error' });
                setLoading(false)
            })
    }

    const clearData = () => {
        setName('');
        setEmail("");
        setSubmitter('as_person');
        setLaw('GDPR')
        setRequest('')
        setNote('')
        setAccurateInformation(false)
        setDeletionRisk(false)
        setValidation(false)
        setError(false)
    }

    return (
        <Box sx={{ padding: '4rem 0' }}>
            <Container maxWidth='md'>
                {!isAdmin && <Typography mb={5}>{t('dsar.description')}</Typography>}
                <Box sx={{ border: "1px solid #CCCCCC", padding: { xs: "1rem", sm: "3rem" } }}>
                    <Box mb={2}>
                        <FormLabel sx={{ color: "#000", fontWeight: "600" }}>{t('dsar.form.name')}</FormLabel>
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
                            inputProps={{ readOnly: isAdmin ? true : false }}
                            fullWidth
                            placeholder={t('dsar.form.name_placeholder')}
                        />
                    </Box>

                    <Box mb={2}>
                        <FormLabel sx={{ color: "#000", fontWeight: "600" }}>{t('dsar.form.email')}</FormLabel>
                        <TextField
                            sx={{
                                marginBottom: '1rem',
                                '& .MuiOutlinedInput-root': {
                                    background: '#fff',
                                    borderRadius: '50px'
                                }
                            }}
                            size="small"
                            value={email}
                            error={email?.length > 0 ? false : error}
                            onChange={(e) => { setEmail(e.target.value); setError(false) }}
                            inputProps={{ readOnly: isAdmin ? true : false }}
                            fullWidth
                            placeholder={t('dsar.form.email_placeholder')}
                        />
                    </Box>

                    <Box mb={3}>
                        <FormLabel sx={{ color: "#000", fontWeight: "600" }}>{t('dsar.form.submitter')}</FormLabel>
                        <RadioGroup
                            name="controlled-radio-buttons-group"
                            value={submitter}
                            onChange={(e) => setSubmitter(e.target.value)}
                            inputProps={{ readOnly: isAdmin ? true : false }}
                            sx={{ marginLeft: "1.2rem" }}
                        >
                            <FormControlLabel
                                value="as_person"
                                control={
                                    <Radio
                                        size="small"
                                        disabled={isAdmin}
                                    />
                                }
                                label={t('dsar.form.submitter_as_person')}
                            />
                            <FormControlLabel
                                value="as_entity"
                                control={
                                    <Radio
                                        size="small"
                                        disabled={isAdmin}
                                    />
                                }
                                label={t('dsar.form.submitter_as_entity')}
                            />
                        </RadioGroup>
                    </Box>

                    <Box mb={2}>
                        <FormLabel sx={{ color: "#000", fontWeight: "600" }}>{t('dsar.form.law')}</FormLabel>
                        <TextField
                            select
                            sx={{
                                marginBottom: '1rem',
                                '& .MuiOutlinedInput-root': {
                                    background: '#fff',
                                    borderRadius: '50px'
                                }
                            }}
                            size="small"
                            value={law}
                            error={law?.length > 0 ? false : error}
                            inputProps={{ readOnly: isAdmin ? true : false }}
                            onChange={(e) => { setLaw(e.target.value); setError(false) }}
                            InputLabelProps={{ shrink: false }}
                            fullWidth
                        >
                            <MenuItem value="GDPR">{"GDPR"}</MenuItem>
                            <MenuItem value="CCPA">{"CCPA"}</MenuItem>
                            <MenuItem value="OTHER">{"OTHER"}</MenuItem>
                        </TextField>
                    </Box>

                    <Box mb={3}>
                        <FormLabel sx={{ color: "#000", fontWeight: "600" }}>{t('dsar.form.request')}</FormLabel>
                        <RadioGroup
                            name="controlled-radio-buttons-group"
                            value={request}
                            onChange={(e) => setRequest(e.target.value)}
                            sx={{ marginLeft: "1.2rem" }}
                        >
                            <FormControlLabel
                                value="information_gathering"
                                control={
                                    <Radio
                                        size="small"
                                        disabled={isAdmin}
                                    />
                                }
                                label={t('dsar.form.information_gathering_label')}
                            />
                            <FormControlLabel
                                value="delete_information"
                                control={
                                    <Radio
                                        size="small"
                                        disabled={isAdmin}
                                    />
                                }
                                label={t('dsar.form.delete_information_label')}
                            />
                            <FormControlLabel
                                value="prevent_thirdparty_data_sales"
                                control={
                                    <Radio
                                        size="small"
                                        disabled={isAdmin}
                                    />
                                }
                                label={t('dsar.form.prevent_thirdparty_data_sales_label')}
                            />
                            <FormControlLabel
                                value="accept_data_sales"
                                control={
                                    <Radio
                                        size="small"
                                        disabled={isAdmin}
                                    />
                                }
                                label={t('dsar.form.accept_data_sales_label')}
                            />
                            <FormControlLabel
                                value="access_information"
                                control={
                                    <Radio
                                        size="small"
                                        disabled={isAdmin}
                                    />
                                }
                                label={t('dsar.form.access_information_label')}
                            />
                            <FormControlLabel
                                value="update_information"
                                control={
                                    <Radio
                                        size="small"
                                        disabled={isAdmin}
                                    />
                                }
                                label={t('dsar.form.update_information_label')}
                            />
                            <FormControlLabel
                                value="get_information"
                                control={
                                    <Radio
                                        size="small"
                                        disabled={isAdmin}
                                    />
                                }
                                label={t('dsar.form.get_information_label')}
                            />
                            <FormControlLabel
                                value="prevent_advertisement_purposes"
                                control={
                                    <Radio
                                        size="small"
                                        disabled={isAdmin}
                                    />
                                }
                                label={t('dsar.form.prevent_advertisement_purposes_label')}
                            />
                            <FormControlLabel
                                value="limit_information_disclosure"
                                control={
                                    <Radio
                                        size="small"
                                        disabled={isAdmin}
                                    />
                                }
                                label={t('dsar.form.limit_information_disclosure_label')}
                            />
                            <FormControlLabel
                                value="other"
                                control={
                                    <Radio
                                        size="small"
                                        disabled={isAdmin}
                                    />
                                }
                                label={t('dsar.form.other_label')}
                            />
                        </RadioGroup>
                    </Box>

                    <Box mb={2}>
                        <FormLabel sx={{ color: "#000", fontWeight: "600" }}>{t('dsar.form.note')}</FormLabel>
                        <TextField
                            sx={{
                                marginBottom: '1rem',
                                '& .MuiOutlinedInput-root': {
                                    background: '#fff',
                                    borderRadius: '25px'
                                }
                            }}
                            size="small"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            inputProps={{ readOnly: isAdmin ? true : false }}
                            fullWidth
                            multiline
                            rows={5}
                            placeholder={t('dsar.form.note_placeholder')}
                        />
                    </Box>

                    <Box mb={2}>
                        <FormLabel sx={{ color: "#000", fontWeight: "600" }}>{t('dsar.form.confirm')}</FormLabel>
                        <FormGroup sx={{ marginLeft: "1.2rem" }}>
                            <FormControlLabel sx={{ '&.MuiFormControlLabel-root': { alignItems: "start" } }} control={
                                <Checkbox
                                    sx={{ paddingTop: "4px" }}
                                    checked={accurate_information_confirmations}
                                    disabled={isAdmin}
                                    size="small"
                                    onChange={(e) => { setAccurateInformation(e.target.checked) }} />}
                                label={
                                    <FormLabel sx={{ color: "#000" }}>
                                        {t('dsar.form.accurate_information_confirmations_label')}
                                    </FormLabel>}
                            />
                            <FormControlLabel sx={{ '&.MuiFormControlLabel-root': { alignItems: "start" } }} control={
                                <Checkbox
                                    sx={{ paddingTop: "4px" }}
                                    checked={deletion_risk_confirmations}
                                    disabled={isAdmin}
                                    size="small"
                                    onChange={(e) => { setDeletionRisk(e.target.checked) }} />}
                                label={
                                    <FormLabel sx={{ color: "#000" }} >
                                        {t('dsar.form.deletion_risk_confirmations_label')}
                                    </FormLabel>}
                            />
                            <FormControlLabel sx={{ '&.MuiFormControlLabel-root': { alignItems: "start" } }} control={
                                <Checkbox
                                    sx={{ paddingTop: "4px" }}
                                    checked={validation_confirmations}
                                    disabled={isAdmin}
                                    size="small"
                                    onChange={(e) => { setValidation(e.target.checked) }} />}
                                label={
                                    <FormLabel sx={{ color: "#000" }}>
                                        {t('dsar.form.validation_confirmations_label')}
                                    </FormLabel>}
                            />
                        </FormGroup>
                    </Box>

                    {!isAdmin &&
                        <Box sx={{ display: "flex", justifyContent: "end" }}>
                            <RoundButton
                                onClick={() => sendDSAR()}
                                size={'small'}
                                disableElevation={true}
                                color={'primary'}
                                variant='contained'
                                sx={{ marginLeft: '0.5rem' }}
                                text={loading || t('dsar.form.submit')}
                                progress={loading && (
                                    <CircularProgress
                                        size={20}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: "white"
                                        }}
                                    />
                                )}
                            />
                        </Box>
                    }
                </Box>
            </Container>
        </Box>
    )
}

export default DSARForm