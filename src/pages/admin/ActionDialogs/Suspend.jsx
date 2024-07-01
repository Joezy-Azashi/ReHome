import React from 'react'
import { Dialog, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import RoundButton from '../../../components/Buttons/RoundButton';
import { useTranslation } from 'react-i18next';

function Suspend({ openSuspend, setOpenSuspend, UpdateSuspended, actionLoading }) {
    const { t } = useTranslation();

    return (
        <Dialog open={openSuspend?.open} onClose={() => setOpenSuspend({ open: false })} fullWidth maxWidth="xs">
            <DialogContent>
                {t('admindashboard.users.table.question')} <span style={{ textTransform: "lowercase" }}>{openSuspend?.state ? t('admindashboard.users.table.menu.restore') : t('admindashboard.users.table.menu.suspend')}</span> "{openSuspend?.name}"?
            </DialogContent>
            <DialogActions sx={{ padding: "0 20px 20px 0" }}>
                <RoundButton onClick={() => setOpenSuspend({ open: false })} text={t('admindashboard.users.table.heading.cancel')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
                <RoundButton
                    onClick={() => UpdateSuspended(openSuspend?.state, openSuspend?.id)}
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
                    text={actionLoading || openSuspend?.state ? t('admindashboard.users.table.menu.restore') : t('admindashboard.users.table.menu.suspend')}
                    disableElevation
                    variant={'outlined'}
                    sx={{ padding: '.5rem 1.5rem' }}
                />
            </DialogActions>
        </Dialog>
    )
}

export default Suspend