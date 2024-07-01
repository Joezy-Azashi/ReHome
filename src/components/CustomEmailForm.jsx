import React, { useState, useEffect } from 'react'
import { alpha, Dialog, DialogContent, Box, Typography, TextField, CircularProgress, Grid, styled, MenuItem, FormLabel } from '@mui/material';
import RoundButton from './Buttons/RoundButton';
import { useTranslation } from "react-i18next";
import { useSnackbar } from 'notistack'
import { getCurrentUser } from '../services/auth';
import moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Api from '../api/api';

function CustomEmailForm({ showPopup, executeRecaptcha, setShowPopup, recipientData }) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);
    const [tone, setTone] = useState("casual");
    const [intention, setIntention] = useState("general_introduction");
    const [language, setLanguage] = useState("english");
    const [length, setLength] = useState("medium");
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [properties, setProperties] = useState([]);
    const [propertyId, setPropertyId] = useState("");
    const [content, setContent] = useState("");
    const [token, setToken] = useState(10);


    const tones = [
        'casual', 'formal', 'entrepreneurial', 'informative', 'professional', 'friendly', 'urgent', 'direct', 'personal'
    ]

    const intentions = [
        'general_introduction', 'property_proposal', 'property_invitation', 'seasonal_greetings', 'event_recap', 'custom'
    ]

    const languages = ['english', 'french', 'spanish', 'portuguese']

    const lengths = ['short', 'medium', 'long']

    const sendCustomEmailForm = async () => {
        if (!tone || !intention || !language || !length) {
            enqueueSnackbar(t('dashboard.customemail.form_incomplete'), { variant: 'error' });
            return
        }

        if (['property_proposal', 'property_invitation'].includes(intention) && !propertyId) {
            enqueueSnackbar(t('dashboard.customemail.form_incomplete'), { variant: 'error' });
            return
        }

        if (['seasonal_greetings', 'event_recap', 'custom'].includes(intention) && !additionalInfo) {
            enqueueSnackbar(t('dashboard.customemail.form_incomplete'), { variant: 'error' });
            return
        }

        const token = await executeRecaptcha('customEmailForm')

        setLoading(true)

        Api().post(`/enterprises/${getCurrentUser().id}/generate-email`, {
            tone: tone,
            intention: intention,
            language: language,
            length: length,
            additional_info: additionalInfo,
            recipient_data: recipientData,
            propertyId: propertyId,
            recaptcha: token
        })
            .then((res) => {
                setLoading(false)
                setContent(res?.data)
                Api().get("/me")
                    .then(response => {
                        const openai = response?.data?.openai;

                        if (!openai || !openai.date || !openai.count) {
                            setToken(10);
                            return
                        }

                        if (moment(openai.date).add(1, 'day') < moment()) {
                            setToken(10);
                            return
                        }

                        setToken(10 - openai.count);
                    })
            })
            .catch((error) => {
                enqueueSnackbar(error?.response?.data?.error?.message, { variant: 'warning' });
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {

        setLoading(true)

        Api().get("/me")
            .then((response) => {
                Api().get(`/users/${response.data.id}/rehome-properties`, {
                    params: {
                        filter: {
                            where: { published: true }
                        }
                    }
                })
                    .then((res) => {
                        setLoading(false)
                        setProperties(res.data)
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            })
            .catch(() => { })
    }, [])

    const StyledLabel = styled(FormLabel)(({ theme }) => ({
        fontSize: '.9rem',
        marginBottom: '10px'
    }))

    const StyledInput = styled(TextField)(({ theme }) => ({
        marginBottom: '1rem'
    }))

    return (
        <>
            <Dialog
                open={showPopup}
                keepMounted
                onClose={() => setShowPopup(false)}
                fullWidth
                maxWidth="lg"
                sx={{
                    '& .MuiPaper-root': {borderRadius: '30px' },
                    border: '1px solid #707070',
                    backgroundColor: 'rgb(3,42,100, 60%)',
                    borderRadius: '0',
                    scrollbarWidth: "none",
                }}
                PaperProps={{
                    sx: {
                        overflow: "visible"
                    },
                }}
            >

                <DialogContent sx={{ padding: "0" }}>
                    <Box>
                        <Box padding={"1.7rem"} sx={{ background: alpha('#1267B1', .05), borderBottom: '1px solid lighgrey' }}>
                            <Typography fontSize={"18px"} fontWeight={600}>{t('dashboard.customemail.title')}</Typography>
                            <Typography fontSize={"12px"}>{t('dashboard.customemail.description')}</Typography>
                            <Typography color={"red"} fontWeight={500} fontSize={"12px"}>{token} {t('dashboard.customemail.token')}</Typography>
                        </Box>

                        <Box padding={"1.7rem"}>
                            <Grid container spacing={2}>

                                {/* Form */}
                                <Grid item xs={12} md={5}>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <StyledLabel>{t('dashboard.customemail.tone')}</StyledLabel>
                                            <StyledInput
                                                select
                                                value={tone}
                                                onChange={(e) => { setTone(e.target.value); }}
                                                variant='standard'
                                                fullWidth
                                                placeholder={''}
                                            >
                                                {tones.map((tn, index) => (
                                                    <MenuItem key={index} value={tn}> {t('dashboard.customemail.' + tn)}</MenuItem>
                                                ))}
                                            </StyledInput>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <StyledLabel>{t('dashboard.customemail.intention')}</StyledLabel>
                                            <StyledInput
                                                select
                                                value={intention}
                                                onChange={(e) => { setIntention(e.target.value); }}
                                                variant='standard'
                                                fullWidth
                                                placeholder={''}
                                            >
                                                {intentions.map((tn, index) => (
                                                    <MenuItem key={index} value={tn}> {t('dashboard.customemail.' + tn)}</MenuItem>
                                                ))}
                                            </StyledInput>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={6}>
                                            <StyledLabel>{t('dashboard.customemail.language')}</StyledLabel>
                                            <StyledInput
                                                select
                                                value={language}
                                                onChange={(e) => { setLanguage(e.target.value); }}
                                                variant='standard'
                                                fullWidth
                                                placeholder={''}
                                            >
                                                {languages.map((tn, index) => (
                                                    <MenuItem key={index} value={tn}> {t('dashboard.customemail.' + tn)}</MenuItem>
                                                ))}
                                            </StyledInput>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={6}>
                                            <StyledLabel>{t('dashboard.customemail.length')}</StyledLabel>
                                            <StyledInput
                                                select
                                                value={length}
                                                onChange={(e) => { setLength(e.target.value); }}
                                                variant='standard'
                                                fullWidth
                                                placeholder={''}
                                            >
                                                {lengths.map((tn, index) => (
                                                    <MenuItem key={index} value={tn}> {t('dashboard.customemail.' + tn)}</MenuItem>
                                                ))}
                                            </StyledInput>
                                        </Grid>

                                        {/* Property Select */}
                                        {
                                            ['property_proposal', 'property_invitation'].includes(intention)
                                                ?
                                                <Grid item xs={12}>
                                                    <StyledLabel>{t('dashboard.customemail.property')}</StyledLabel>
                                                    <StyledInput
                                                        select
                                                        value={propertyId}
                                                        onChange={(e) => { setPropertyId(e.target.value); }}
                                                        variant='standard'
                                                        fullWidth
                                                        placeholder={''}
                                                    >
                                                        {properties.map((tn, index) => (
                                                            <MenuItem key={index} value={tn.id}> {tn.name}</MenuItem>
                                                        ))}
                                                    </StyledInput>
                                                </Grid>
                                                :
                                                <></>
                                        }

                                        {/* Additional Information */}
                                        <Grid item xs={12}>
                                            <StyledLabel>{t('dashboard.customemail.additional_info')}</StyledLabel>
                                            <TextField
                                                sx={{
                                                    marginBottom: '1rem',
                                                    '& .MuiOutlinedInput-root': {
                                                        background: '#fff',
                                                        borderRadius: '25px'
                                                    }
                                                }}
                                                size="small"
                                                value={additionalInfo}
                                                onChange={(e) => setAdditionalInfo(e.target.value)}
                                                fullWidth
                                                multiline
                                                rows={4}
                                                placeholder={intention === 'seasonal_greetings' ? t('dashboard.customemail.describe_season') : intention === 'event_recap' ? t('dashboard.customemail.describe_event') : t('dashboard.customemail.additional_info')}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <RoundButton
                                                onClick={() => sendCustomEmailForm()}
                                                text={t('dashboard.customemail.generate')}
                                                disableElevation
                                                variant={'contained'}
                                                sx={{ padding: '.5rem 1.5rem', minWidth: "18rem" }}
                                                progress={loading && (
                                                    <CircularProgress
                                                        size={20}
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            color: "#fff",
                                                            margin: "3px 0"
                                                        }}
                                                    />
                                                )}
                                            />

                                        </Grid>


                                    </Grid>
                                </Grid>

                                {/* WYSIWYG */}
                                <Grid item xs={12} md={7} >
                                    <ReactQuill
                                        theme="snow"
                                        value={content}
                                        onChange={setContent} />
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CustomEmailForm