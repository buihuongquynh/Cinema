import React, { useEffect } from 'react'
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";

export default function AlertCanNotAccess() {
  const history = useHistory();
  useEffect(() => {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'error',
      title: 'Oops...',
      text: 'Vui lòng đăng nhập bằng tài khoản admin!',
      confirmButtonText: `Quay về trang chủ`,
    }).then((result) => {
      if (result.isConfirmed) {
        history.replace('/')
      }
    })
  }, [])
  return (
    <></>
  )
}
