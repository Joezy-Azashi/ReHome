import React, { useState } from "react";
import { DialogContent, Button, Typography, IconButton, CircularProgress } from "@mui/material";
import FileUploadService from "../../services/FileUpload"
import { useTranslation } from "react-i18next";
import { useSnackbar } from 'notistack'
import CloseIcon from '@mui/icons-material/Close';
import Api from '../../api/api';

function UploadLogo({ handleCloseLogoUpload, getMyProfile }) {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const [file, setFile] = useState("");
    const [imagePreview, setFilePreview] = useState("");
    const [loading, setloading] = useState(false);

    const getImage = (event) => {
        setFile(event.target.files[0]);
        setFilePreview(URL.createObjectURL(event.target.files[0]));
    };

    const cancelImage = (event) => {
        setFile(null);
        setFilePreview(null);
        handleCloseLogoUpload();
    };

    const closeImage = (event) => {
        setFile(null);
        setFilePreview(null);
    };

    const uploadImage = (event) => {
        if (event?.target?.files?.length < 1) {
            return
        }

        event.preventDefault();
        let url = "/files/pictures";
        if (!file) {
            enqueueSnackbar(t('dashboard.profileimage.validimage'), { variant: 'error' })
            return;
        } else {

            setloading(true);
            FileUploadService.upload(file, url)
                .then((response) => {
                    Api().patch(`/me`, { company: { logo: response.data.path } })
                        .then(() => {
                            setloading(false);
                            enqueueSnackbar(t('dashboard.profileimage.uploadsuccess'), { variant: 'success' })
                            handleCloseLogoUpload();
                            getMyProfile()
                        })
                        .catch(() => {
                            setloading(false);
                        })
                })
                .catch((error) => {
                    setloading(false);
                    enqueueSnackbar(error.message, { variant: 'error' })
                });
        }
    };

    return (
        <DialogContent>
            <Typography variant='h6'>{t('dashboard.profileimage.title')}</Typography>

            {imagePreview && (
                <div className="d-flex justify-content-center mt-3 mb-4">
                    <IconButton onClick={closeImage} sx={{ position: "" }}><CloseIcon /></IconButton>
                    <img className="preview" src={imagePreview} alt="" />
                </div>
            )}

            {imagePreview ? (
                ""
            ) : (
                <div className="my-10">
                    <p className="border-dashed border-2 py-5 border-gray-300 text-center">
                        <label
                            for="image"
                            className="py-5 cursor-pointer"
                        >
                            {t('dashboard.profileimage.instruction')}
                        </label>
                    </p>
                    <input
                        type="file"
                        id="image"
                        className="hidden"
                        accept="image/x-png,image/gif,image/jpeg, image/jpg"
                        onChange={getImage}
                    />
                </div>
            )}

            <div className="md:flex justify-end text-center">
                <div className="mb-3">
                    <Button
                        variant="contained"
                        className="w-full"
                        onClick={cancelImage}
                        sx={{ backgroundColor: "#01153D", ':hover': { backgroundColor: "#01153D" } }}
                    >
                        Cancel
                    </Button>
                </div>
                <div className="mb-2 md:ml-5">
                    <Button variant="outlined" className="w-full" onClick={uploadImage}>
                        {loading && (
                            <CircularProgress
                                size={20}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: "black"
                                }}
                            />
                        )}
                        {loading || t('dashboard.profileimage.upload')}
                    </Button>
                </div>
            </div>
        </DialogContent>
    );
}

export default UploadLogo;
