import axiosClient from "./axiosClient";
const theatersApi = {
  getThongTinHeThongRap: () => {
    const path = "/QuanLyRap/LayThongTinHeThongRap";
    return axiosClient.get(path);
  },
  getThongTinLichChieuHeThongRap: () => {
    const path = "/QuanLyRap/LayThongTinLichChieuHeThongRap?maNhom=GP09";
    return axiosClient.get(path);
  },
  getThongTinLichChieuPhim: (maPhim) => {
    const path = `/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${maPhim}`;
    return axiosClient.get(path);
  },
  getListCumRapTheoHeThong: (maHeThongRap) => {
    const path = `/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`;
    return axiosClient.get(path);
  },

};

export default theatersApi;
