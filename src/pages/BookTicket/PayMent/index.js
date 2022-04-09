import React, { useState, useEffect, useRef } from "react";

import { useSelector, useDispatch } from "react-redux";

import useStyles from "./style";
import formatDate from "../../../utilities/formatDate";
import { BookTicket } from "../../../reducers/actions/BookTicket";
import {
  SET_DATA_PAYMENT,
  SET_READY_PAYMENT,
} from "../../../reducers/constants/BookTicket";

const makeObjError = (name, value, dataSubmit) => {
  let newErrors = {
    ...dataSubmit.errors,
    [name]:
      value?.trim() === ""
        ? `${name.charAt(0).toUpperCase() + name.slice(1)} không được bỏ trống`
        : "",
  };
  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const regexNumber =
    /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/;
  if (name === "email" && value) {
    if (!regexEmail.test(value)) {
      newErrors[name] = "Email không đúng định dạng";
    }
  }
  if (name === "phone" && value) {
    if (!regexNumber.test(value)) {
      newErrors[name] = "Phone không đúng định dạng";
    }
  }
  return newErrors;
};

export default function PayMent() {
  const {
    listSeat,
    amount,
    email,
    phone,
    paymentMethod,
    isReadyPayment,
    isMobile,
    danhSachVe,
    danhSachPhongVe: { thongTinPhim },
    maLichChieu,
    taiKhoanNguoiDung,
    isSelectedSeat,
    listSeatSelected,
    loadingBookTicketTicket,
    successBookTicketTicketMessage,
    errorBookTicketMessage,
  } = useSelector((state) => state.BookTicketReducer);
  const dispatch = useDispatch();
  const emailRef = useRef();
  const phoneRef = useRef(); 
  let variClear = useRef(""); 
  const [dataFocus, setDataFocus] = useState({ phone: false, email: false });
  const [dataSubmit, setdataSubmit] = useState({
    values: {
      email: email,
      phone: phone,
      paymentMethod: paymentMethod,
    },
    errors: {
      email: "",
      phone: "",
    },
  });
  const classes = useStyles({
    isSelectedSeat,
    isReadyPayment,
    isMobile,
    dataFocus,
    dataSubmit,
  });

  const onChange = (e) => {
    let { name, value } = e.target;
    let newValues = { ...dataSubmit.values, [name]: value };
    let newErrors = makeObjError(name, value, dataSubmit);
    setdataSubmit((dataSubmit) => ({
      ...dataSubmit,
      values: newValues,
      errors: newErrors,
    }));
  };

  useEffect(() => {
    clearTimeout(variClear);
    variClear.current = setTimeout(() => {
      dispatch({
        type: SET_DATA_PAYMENT,
        payload: {
          email: dataSubmit.values.email,
          phone: dataSubmit.values.phone,
          paymentMethod: dataSubmit.values.paymentMethod,
        },
      });
      if (
        !dataSubmit.errors.email &&
        !dataSubmit.errors.phone &&
        dataSubmit.values.email &&
        dataSubmit.values.phone &&
        dataSubmit.values.paymentMethod &&
        isSelectedSeat
      ) {
        dispatch({
          type: SET_READY_PAYMENT,
          payload: { isReadyPayment: true },
        });
      } else {
        dispatch({
          type: SET_READY_PAYMENT,
          payload: { isReadyPayment: false },
        });
      }
    }, 500);
    return () => clearTimeout(variClear.current);
  }, [dataSubmit, isSelectedSeat]);

  useEffect(() => {
    let emailErrors = makeObjError(emailRef.current.name, email, dataSubmit);
    let phoneErrors = makeObjError(phoneRef.current.name, phone, dataSubmit);
    setdataSubmit((dataSubmit) => ({
      ...dataSubmit,
      values: {
        email: email,
        phone: phone,
        paymentMethod: paymentMethod,
      },
      errors: { email: emailErrors.email, phone: phoneErrors.phone },
    }));
  }, [listSeat]); 

  const handleBookTicket = () => {
    if (
      isReadyPayment &&
      !loadingBookTicketTicket &&
      !successBookTicketTicketMessage &&
      !errorBookTicketMessage
    ) {
      dispatch(BookTicket({ maLichChieu, danhSachVe, taiKhoanNguoiDung }));
    }
  };
  const onFocus = (e) => {
    setDataFocus({ ...dataFocus, [e.target.name]: true });
  };
  const onBlur = (e) => {
    setDataFocus({ ...dataFocus, [e.target.name]: false });
  };

  return (
    <aside className={classes.payMent}>
      <div>
        <p className={`${classes.amount} ${classes.payMentItem}`}>
          {`${amount.toLocaleString("vi-VI")} đ`}
        </p>
        <div className={classes.payMentItem}>
          <p className={classes.tenPhim}>{thongTinPhim?.tenPhim}</p>
          <p>{thongTinPhim?.tenCumRap}</p>
          <p>{`${thongTinPhim && formatDate(thongTinPhim.ngayChieu).dayToday} ${
            thongTinPhim?.ngayChieu
          } - ${thongTinPhim?.gioChieu} - ${thongTinPhim?.tenRap}`}</p>
        </div>

        <div className={`${classes.seatInfo} ${classes.payMentItem}`}>
          <span>{`Ghế ${listSeatSelected?.join(", ")}`}</span>
          <p className={classes.amountLittle}>
            {`${amount.toLocaleString("vi-VI")} đ`}
          </p>
        </div>

        {/* email */}
        <div className={classes.payMentItem}>
          <label className={classes.labelEmail}>E-Mail</label>
          <input
            type="text"
            name="email"
            ref={emailRef}
            onFocus={onFocus}
            onBlur={onBlur}
            value={dataSubmit.values.email}
            className={classes.fillInEmail}
            onChange={onChange}
            autoComplete="off"
          />
          <p className={classes.error}>{dataSubmit.errors.email}</p>
        </div>

        {/* phone */}
        <div className={classes.payMentItem}>
          <label className={classes.labelPhone}>Phone</label>
          <input
            type="number"
            name="phone"
            ref={phoneRef}
            onFocus={onFocus}
            onBlur={onBlur}
            value={dataSubmit.values.phone}
            className={classes.fillInPhone}
            onChange={onChange}
            autoComplete="off"
          />
          <p className={classes.error}>{dataSubmit.errors.phone}</p>
        </div>

        {/* Mã giảm giá */}
        <div className={classes.payMentItem}>
          <label className={classes.label}>Mã giảm giá</label>
          <input
            type="text"
            value="Tạm thời không hỗ trợ..."
            readOnly
            className={classes.fillIn}
          />
          <button className={classes.btnDiscount} disabled>
            Áp dụng
          </button>
        </div>
        {/* đặt vé */}
        <div className="">
          <button
            className={classes.btnDV}
            disabled={!isReadyPayment}
            onClick={handleBookTicket}
          >
            Đặt Vé
          </button>
        </div>
      </div>
    </aside>
  );
}
