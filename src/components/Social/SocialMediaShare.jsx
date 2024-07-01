import React from 'react'
import { Box } from '@mui/material'
import { ContentCopyRounded } from '@mui/icons-material';
import { EmailShareButton, EmailIcon, FacebookShareButton, FacebookIcon, LinkedinShareButton, LinkedinIcon, TelegramShareButton, TelegramIcon, TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon } from "react-share";
import { useTranslation } from "react-i18next";
import { useSnackbar } from 'notistack'
import { isLoggedIn } from '../../services/auth';
import Api from '../../api/api';

function SocialMediaShare() {
    const url = window.location.href
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const copyURL = () => {
        const url = window.location.href
        navigator.clipboard.writeText(url).then(function () {
            enqueueSnackbar(t('shareurl'), { variant: 'success' });
        }, function () {
            enqueueSnackbar(t('shareerror'), { variant: 'error' });
        });
    }

    return (
        <Box sx={{ padding: '0.8rem', display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <EmailShareButton
                url={url}
                hashtag="#rehomeafrica"
            >
                <EmailIcon size={32} round />
            </EmailShareButton>

            <WhatsappShareButton
                url={url}
                hashtag="#rehomeafrica"
            >
                <WhatsappIcon size={32} round />
            </WhatsappShareButton>

            <FacebookShareButton
                url={url}
                hashtag="#rehomeafrica"
            >
                <FacebookIcon size={32} round />
            </FacebookShareButton>

            <TwitterShareButton
                url={url}
                hashtag="#rehomeafrica"
            >
                <TwitterIcon size={32} round />
            </TwitterShareButton>

            <LinkedinShareButton
                url={url}
                hashtag="#rehomeafrica"
            >
                <LinkedinIcon size={32} round />
            </LinkedinShareButton>

            <TelegramShareButton
                url={url}
                hashtag="#rehomeafrica"
            >
                <TelegramIcon size={32} round />
            </TelegramShareButton>

            <Box sx={{backgroundColor: "gray", borderRadius: "50%", cursor: "pointer"}} onClick={copyURL}>
                <ContentCopyRounded sx={{color: "#fff", fontSize: "20px", margin: "6px"}}/>
            </Box>
        </Box>
    )
}

export default SocialMediaShare