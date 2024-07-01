import React from 'react'
import { Dialog, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import RoundButton from '../../../components/Buttons/RoundButton';
import { useTranslation } from 'react-i18next';

function Verify({ openVerify, setOpenVerify, UpdateVerified, actionLoading }) {
    const { t } = useTranslation();

    return (
        <Dialog open={openVerify?.open} onClose={() => setOpenVerify({ open: false })} fullWidth maxWidth="xs">
            <DialogContent>
                {t('admindashboard.users.table.question')} <span style={{ textTransform: "lowercase" }}>{openVerify?.state ? t('admindashboard.users.table.menu.unverify') : t('admindashboard.users.table.menu.verify')}</span> "{openVerify?.name}"?
            </DialogContent>
            <DialogActions sx={{ padding: "0 20px 20px 0" }}>
                <RoundButton onClick={() => setOpenVerify({ open: false })} text={t('dashboard.profileimage.cancel')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
                <RoundButton
                    onClick={() => UpdateVerified(openVerify?.state, openVerify?.id)}
                    progress={actionLoading && (
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
                    text={actionLoading || openVerify?.state ? t('admindashboard.users.table.menu.unverify') : t('admindashboard.users.table.menu.verify')}
                    disableElevation
                    variant={'outlined'}
                    sx={{ padding: '.5rem 1.5rem' }}
                />
            </DialogActions>
        </Dialog>
    )
}

export default Verify