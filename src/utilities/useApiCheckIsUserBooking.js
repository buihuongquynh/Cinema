
import { useEffect, useState } from 'react'
import Axios from "axios";
import PropTypes from 'prop-types';

CheckIsUserBookTicket.propTypes = {
  taiKhoan: PropTypes.string.isRequired,
};
export default function CheckIsUserBookTicket(taiKhoan) {
  const [isUserBookTicket, setisUserBookTicket] = useState(true)
  const url = "https://movie0706.cybersoft.edu.vn/api/QuanLyNguoiDung/ThongTinTaiKhoan"
  useEffect(() => {
    let cancel = Axios.CancelToken.source(); 
    const loadData = async () => {
      try { 
        const response = await Axios.post(url, { taiKhoan }, { cancelToken: cancel.token })
        const isUserBookTicket = response.data.thongTinDatVe.length > 0 ? true : false
        setisUserBookTicket(isUserBookTicket);
      } catch (error) { 
        if (Axios.isCancel(error)) { 
          console.log("AxiosCancel: caught cancel");
        } else {
          throw error;
        }
      }
    };
    loadData();
    setTimeout(() => cancel.cancel(), 5000)
    return () => {
      cancel.cancel(); 
    };
  }, [])

  return isUserBookTicket
}
