import Api from '../api/api';

class FileUploadService {
  upload(file, url) {
    let formData = new FormData();
    const fileName = new Date().getTime()+ '.jpeg';
    formData.append("file", file, fileName)
    return Api().post(`${url}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data;boundary=<calculated when request is sent>",
      },
    });
  }

  uploadGeneral(file, url) {
    let formData = new FormData();
    formData.append("file", file)
    return Api().post(`${url}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data;boundary=<calculated when request is sent>",
      },
    });
  }

}
// eslint-disable-next-line
export default new FileUploadService();