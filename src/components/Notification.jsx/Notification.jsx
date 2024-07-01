import {Box} from '@mui/system';
import {useSnackbar} from 'notistack';
import React from 'react';

const Notification = ({message, variant}) => {

    const {enqueueSnackbar} = useSnackbar();

    return (
        <Box sx={{display: 'none'}}>
            {enqueueSnackbar(message, {variant: variant})}
        </Box>

    );
};

export default Notification;