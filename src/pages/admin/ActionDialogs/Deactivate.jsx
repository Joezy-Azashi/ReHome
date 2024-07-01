import React from 'react'
import { Dialog, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import RoundButton from '../../../components/Buttons/RoundButton';
import { useTranslation } from 'react-i18next';

function Deactivate({ openDeactivate, setOpenDeactivate, UpdateActivation, actionLoading }) {
    const { t } = useTranslation();

    return (
        <Dialog open={openDeactivate?.open} onClose={() => setOpenDeactivate({ open: false })} fullWidth maxWidth="xs">
            <DialogContent>
                {t('admindashboard.users.table.question')} <span style={{ textTransform: "lowercase" }}>{openDeactivate?.state ? t('admindashboard.users.table.menu.activate') : t('admindashboard.users.table.menu.deactivate')}</span> "{openDeactivate?.name}"?
            </DialogContent>
            <DialogActions sx={{ padding: "0 20px 20px 0" }}>
                <RoundButton onClick={() => setOpenDeactivate({ open: false })} text={t('dashboard.profileimage.cancel')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
                <RoundButton
                    onClick={() => UpdateActivation(openDeactivate?.state, openDeactivate?.id)}
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
                    text={actionLoading || openDeactivate?.state ? t('admindashboard.users.table.menu.activate') : t('admindashboard.users.table.menu.deactivate')}
                    disableElevation
                    variant={'outlined'}
                    sx={{ padding: '.5rem 1.5rem' }}
                />
            </DialogActions>
        </Dialog>
    )
}

export default Deactivate