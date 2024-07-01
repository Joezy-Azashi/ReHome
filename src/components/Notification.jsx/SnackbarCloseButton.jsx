import React from 'react'
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

function SnackbarCloseButton({ snackbarKey }) {
    const { closeSnackbar } = useSnackbar();

    return (
        <IconButton onClick={() => closeSnackbar(snackbarKey)}>
            <Close color="paper" />
        </IconButton>
    );
}

export default SnackbarCloseButton;