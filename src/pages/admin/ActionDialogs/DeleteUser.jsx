import React, { useState } from 'react'
import { Dialog, DialogContent, DialogActions, FormControlLabel, Box, Checkbox, CircularProgress } from '@mui/material';
import RoundButton from '../../../components/Buttons/RoundButton';
import { useTranslation } from 'react-i18next';

function DeleteUser({ openDelete, setOpenDelete, UpdateDeletion, actionLoading }) {
  const { t } = useTranslation();
  const [sureDelete, setSureDelete] = useState(false)

  return (
    <Dialog open={openDelete?.open} onClose={() => setOpenDelete({ open: false })} fullWidth maxWidth="xs">
      <DialogContent>
        {t('admindashboard.users.table.question')} <span style={{ textTransform: "lowercase" }}>{t('admindashboard.users.table.menu.delete')}</span> "{openDelete?.name}"? <br />
        <div style={{ color: "red", fontWeight: "500", textAlign: "center", marginTop: "1rem" }}>{t('admindashboard.users.table.deletewarning')}</div>

        <Box sx={{ marginTop: "1rem" }}>
          <FormControlLabel control={<Checkbox value={sureDelete} checked={sureDelete} onChange={() => { setSureDelete(!sureDelete) }} />} label={t('admindashboard.users.table.suredelete') + t('admindashboard.users.table.menu.delete') + " " + openDelete?.name} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: "0 20px 20px 0" }}>
        <RoundButton onClick={() => {setOpenDelete({ open: false }); setSureDelete(false)}} text={t('dashboard.profileimage.cancel')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
        <RoundButton
          onClick={() => {UpdateDeletion(openDelete?.state, openDelete?.id); setSureDelete(false)}}
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
          text={actionLoading || t('admindashboard.users.table.menu.delete')}
          disableElevation
          variant={'outlined'}
          sx={{ padding: '.5rem 1.5rem' }}
          disable={!sureDelete}
        />
      </DialogActions>
    </Dialog>
  )
}

export default DeleteUser