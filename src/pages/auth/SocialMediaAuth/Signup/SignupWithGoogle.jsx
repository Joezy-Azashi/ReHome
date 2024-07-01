import React from "react";
import google from "../../../../assets/images/google.svg"
import { useTranslation } from "react-i18next";
import config from "../../../../public/config";
import { Button } from '@mui/material';

const SignupWithGoogle = () => {
    const { t } = useTranslation();

    return (
        <a href={`${config.api}/auth/thirdparty/google`} target="_blank" rel="noreferrer">
            <Button fullWidth disableElevation
                sx={{
                    borderRadius: "5px",
                    color: "#000000",
                    fontSize: "12px",
                    fontWeight: "400",
                    display: "flex",
                    justifyContent: "space-evenly",
                    textTransform: "none",
                    border: "1px solid #C3C3C3",
                    boxShadow: "none",
                    backgroundColor: "#FFFFFF",
                    ':hover': { backgroundColor: "#FFFFFF" },
                }}
                variant="contained"
                size="medium"
            >
                <img src={google} style={{width: '28%', marginRight: '5px'}} className="" alt="" />
                {t("createaccount.signInGoogle")}
            </Button>
        </a>
    );
};

export default SignupWithGoogle;
