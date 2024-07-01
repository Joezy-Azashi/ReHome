import React from 'react'
import { useTranslation } from "react-i18next";
import config from "../../../../public/config";
import { Button } from '@mui/material';
import { FacebookRounded } from '@mui/icons-material';

function SignupWithFacebook() {
    const { t } = useTranslation();

    return (
        <a href={`${config.api}/auth/thirdparty/facebook`} target="_blank" rel="noreferrer">
            <Button fullWidth disableElevation
                sx={{
                    borderRadius: "5px",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    fontWeight: "400",
                    display: "flex",
                    justifyContent: "space-evenly",
                    textTransform: "none",
                    border: "1px solid #C3C3C3",
                    boxShadow: "none",
                    backgroundColor: "#1877F2",
                    ':hover': { backgroundColor: "#1877F2", },
                }}
                variant="contained"
                size="medium"
                startIcon={<FacebookRounded sx={{fontSize: '18rem'}} />}
            >
                {t("createaccount.signInFacebook")}
            </Button>
        </a>
    )
}

export default SignupWithFacebook