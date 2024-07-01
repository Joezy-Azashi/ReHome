import React, { useState } from "react";
import { DialogContent, DialogActions, Typography, IconButton, CircularProgress, Box, Grid } from "@mui/material";
import FileUploadService from "../../services/FileUpload";
import { useTranslation } from "react-i18next";
import { useSnackbar } from 'notistack'
import CloseIcon from '@mui/icons-material/Close';
import Api from '../../api/api';
import RoundButton from "../../components/Buttons/RoundButton";
import AvatarEditor from 'react-avatar-editor'
import { getUserType } from "../../services/auth";

function ProfileImageUpload({ handleCloseImgUpload, getMyProfile, userId }) {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [imagePreview, setFilePreview] = useState("");
  const [loading, setloading] = useState(false);

  var editor = "";
  const [scale, setScale] = useState()

  const getimage = (event) => {
    if (event?.target?.files?.length < 1) {
      return
    }

    setFilePreview(URL.createObjectURL(event?.target?.files[0]));
  };

  const setEditorRef = (ed) => {
    editor = ed;
  };

  const cancelImage = () => {
    setFilePreview(null);
    handleCloseImgUpload();
  };

  const closeImage = () => {
    setFilePreview(null);
  };

  function dataURLtoFile(dataurl) {

    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    const fileName = new Date().getTime() + '.jpeg';

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime });
  }

  const uploadImage = () => {
    var img = dataURLtoFile(editor.getImageScaledToCanvas().toDataURL());

    let url = "/files/pictures";
    if (!img) {
      enqueueSnackbar(t('dashboard.profileimage.validimage'), { variant: 'error' })
      return;
    } else {
      setloading(true);
      FileUploadService.upload(img, url)
        .then(async (response) => {
          if (userId && ['admin', 'support'].includes(getUserType())) {
            await Api().patch(`/users/` + userId, { avatar: response.data.path })
          } else {
            await Api().patch(`/me`, { avatar: response.data.path })
            setloading(false);
            getMyProfile()
            setTimeout(() => {
              window.location.reload()
            }, 3000)
          }
          handleCloseImgUpload();
          enqueueSnackbar(t('dashboard.profileimage.uploadsuccess'), { variant: 'success' })
        })
        .catch((error) => {
          setloading(false);
          enqueueSnackbar(error.message, { variant: 'error' })
        });
    }
  };

  return (
    <>
      <DialogContent>
        <Typography variant='h6'>{t('dashboard.profileimage.title')}</Typography>

        {imagePreview && (
          <div className="d-flex justify-content-center mt-3 mb-4">
            <IconButton onClick={closeImage} sx={{ position: "absolute", right: "10px", zIndex: "20" }}><CloseIcon /></IconButton>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <AvatarEditor
                  ref={setEditorRef}
                  image={imagePreview}
                  width={250}
                  height={250}
                  border={50}
                  color={[3, 37, 76, 0.7]} // RGBA
                  scale={scale}
                  backgroundColor={"#fff"}
                  rotate={0}
                  style={{ margin: "auto" }}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between" }} my={2}>
                  <Typography>Zoom: </Typography>
                  <input
                    style={{ width: "70%" }}
                    name="scale"
                    type="range"
                    min={'0.1'}
                    max="2"
                    step="0.01"
                    onChange={(e) => setScale(e.target.value)}
                  />
                </Box>
              </Grid>
            </Grid>
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
              onChange={getimage}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: "0 20px 20px 0" }}>
        <RoundButton onClick={cancelImage} text={t('dashboard.profileimage.cancel')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
        <RoundButton
          onClick={() => loading || uploadImage()}
          text={loading ? (
            <CircularProgress
              size={20}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: "black"
              }}
            />
          )
            : t('dashboard.profileimage.upload')}
          disableElevation
          variant={'outlined'}
          sx={{ padding: '.5rem 1.5rem' }}
        />
      </DialogActions>
    </>
  );
}

export default ProfileImageUpload;
