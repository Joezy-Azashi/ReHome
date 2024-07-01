import React from 'react'
import { useTranslation } from "react-i18next";
import { Button } from '@mui/material';
import config from "../../../../public/config";
import { Apple } from '@mui/icons-material';

function SignupWithApple() {
    const { t } = useTranslation();

    return (
        <a href={`${config.api}/auth/thirdparty/apple`} target="_blank" rel="noreferrer">
            <Button disableElevation fullWidth sx={{
                borderRadius: "5px",
                color: "#fff",
                fontSize: "12px",
                fontWeight: "400",
                display: "flex",
                justifyContent: "space-evenly",
                textTransform: "none",
                border: "1px solid #C3C3C3",
                width: "100%",
                boxShadow: "none",
                backgroundColor: "#000",
                ':hover': { backgroundColor: "#000", },
            }}
                variant="contained"
                size="medium"
                startIcon={<Apple sx={{color: '#fff'}} />}
            >
                {t("login.signInApple")}
            </Button>
        </a>
    )
}

export default SignupWithApple