import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { DataGrid, GridOverlay } from "@material-ui/data-grid";
import { nanoid } from "nanoid";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import ButtonDelete from "./ButtonDelete";
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import EditIcon from "@material-ui/icons/Edit";
import slugify from "slugify";

import useStyles from "./styles";
import {
  deleteUser,
  getUsersList,
  resetUserList,
  putUserUpdate,
  postAddUser,
  setStatusIsExistUserModified,
} from "../../reducers/actions/UsersManagement";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <CircularProgress style={{ margin: "auto" }} />
    </GridOverlay>
  );
}

export default function UsersManagement() {
  const [editRowsModel, setEditRowsModel] = useState({});
  const classes = useStyles();
  const [usersListDisplay, setUsersListDisplay] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [selectionModel, setSelectionModel] = useState([]);
  const [userListDelete, setUserListDelete] = useState({
    triggerDelete: false,
    userListDelete: [],
    cancel: false,
  });
  const [userListmodified, setUserListmodified] = useState({
    triggerUpdate: false,
    userListmodified: [],
    cancel: false,
  });
  const {
    usersList,
    loadingUsersList,
    errorUsersList,
    successDelete,
    errorDelete,
    loadingDelete,
    successUpdateUser,
    errorUpdateUser,
    loadingAddUser,
    successAddUser,
    errorAddUser,
  } = useSelector((state) => state.usersManagementReducer);
  const dispatch = useDispatch();
  const [btnReFresh, setBtnReFresh] = useState("");
  const [sortBy, setsortBy] = useState({ field: "taiKhoan", sort: "asc" });
  const [valueSearch, setValueSearch] = useState("");
  const clearSetSearch = useRef(0);
  const [addUser, setaddUser] = useState({
    data: [
      {
        id: nanoid(6),
        taiKhoan: "",
        matKhau: "",
        hoTen: "",
        email: "",
        soDt: "",
        maLoaiNguoiDung: false,
      },
    ],
    toggle: false,
    readyAdd: false,
    isFilledIn: false,
  });

  useEffect(() => {
    // get list user l???n ?????u
    if (!usersList) {
      dispatch(getUsersList());
    }
    return () => dispatch(resetUserList());
  }, []);
  useEffect(() => {
    // x??a ho???c update th??nh c??ng th?? refresh list user
    if (successDelete || successUpdateUser || btnReFresh || successAddUser) {
      dispatch(getUsersList());
    }
  }, [successDelete, successUpdateUser, btnReFresh, successAddUser]);
  useEffect(() => {
    if (userListmodified.userListmodified.length || addUser.isFilledIn) {
      dispatch(setStatusIsExistUserModified(true));
    } else {
      dispatch(setStatusIsExistUserModified(false));
    }
  }, [userListmodified.userListmodified, addUser.isFilledIn]);

  useEffect(() => {
    if (usersList?.length) {
      let newUsersListDisplay;
      if (userListmodified.userListmodified.length) {
        const userListmodifiedRest = userListmodified.userListmodified;
        newUsersListDisplay = usersList.map(function (userNew) {
          let userModified = this.find(
            (user) => user.taiKhoan === userNew.taiKhoan
          );
          if (userModified) {
            userModified = { ...userModified };
            delete userModified.maNhom;
            return {
              ...userModified,
              id: userModified.taiKhoan,
              xoa: "",
              maLoaiNguoiDung:
                userModified.maLoaiNguoiDung === "QuanTri" ? true : false,
              ismodify: true,
            };
          }
          return {
            ...userNew,
            xoa: "",
            id: userNew.taiKhoan,
            maLoaiNguoiDung:
              userNew.maLoaiNguoiDung === "QuanTri" ? true : false,
            ismodify: false,
          };
        }, userListmodifiedRest);
      } else {
        newUsersListDisplay = usersList.map((user, i) => ({
          ...user,
          xoa: "",
          id: user.taiKhoan,
          maLoaiNguoiDung: user.maLoaiNguoiDung === "QuanTri" ? true : false,
          ismodify: false,
        })); // id l?? prop b???t bu???c
      }
      setUsersListDisplay(newUsersListDisplay);
    }
  }, [usersList]);

  useEffect(() => {
    // deleteUser xong th?? th??ng b??o
    if (userListDelete.cancel) {
      return;
    }
    if (successDelete) {
      setUserListDelete((data) => ({ ...data, triggerDelete: nanoid(6) })); // k??ch ho???t x??a ti???p user ti???p theo
      enqueueSnackbar(successDelete, { variant: "success" });
      return;
    }
    if (errorDelete) {
      setUserListDelete((data) => ({ ...data, triggerDelete: nanoid(6) }));
      enqueueSnackbar(errorDelete, { variant: "error" });
    }
  }, [successDelete, errorDelete]);

  useEffect(() => {
    if (userListmodified.cancel) {
      return;
    }
    if (successUpdateUser) {
      setUserListmodified((data) => ({ ...data, triggerUpdate: nanoid(6) }));
      enqueueSnackbar("Update th??nh c??ng", { variant: "success" });
      return;
    }
    if (errorUpdateUser) {
      setUserListmodified((data) => ({ ...data, triggerUpdate: nanoid(6) }));
      enqueueSnackbar(errorUpdateUser, { variant: "error" });
    }
  }, [successUpdateUser, errorUpdateUser]);

  useEffect(() => {
    // add user xong th?? th??ng b??o
    if (successAddUser) {
      enqueueSnackbar(
        `???? th??m th??nh c??ng t??i kho???n: ${successAddUser.taiKhoan}`,
        { variant: "success" }
      );
    }
    if (errorAddUser) {
      enqueueSnackbar(errorAddUser, { variant: "error" });
    }
    setaddUser({
      data: [
        {
          id: nanoid(6),
          taiKhoan: "",
          matKhau: "",
          hoTen: "",
          email: "",
          soDt: "",
          maLoaiNguoiDung: false,
        },
      ],
      toggle: false,
      readyAdd: false,
      isFilledIn: false,
    });
  }, [successAddUser, errorAddUser]);

  useEffect(() => {
    if (userListDelete.userListDelete.length) {
      let newUserListDelete = [...userListDelete.userListDelete]; // copy
      const userDelete = newUserListDelete.shift(); 
      setUserListDelete((data) => ({
        ...data,
        userListDelete: newUserListDelete,
      })); // set array
      setSelectionModel(() => newUserListDelete);
      dispatch(deleteUser(userDelete)); // delete
      return;
    }
    if (userListDelete.userListDelete.length === 0) {
      setUserListDelete({
        triggerDelete: false,
        userListDelete: [],
        cancel: false,
      });
      dispatch(resetUserList());
      setSelectionModel([]);
    }
  }, [userListDelete.triggerDelete]); 

  useEffect(() => {
    if (userListmodified.userListmodified.length) {
      let newUserListmodified = [...userListmodified.userListmodified];
      const userUpdate = newUserListmodified.shift();
      setUserListmodified((data) => ({
        ...data,
        userListmodified: newUserListmodified,
      }));
      dispatch(putUserUpdate(userUpdate));
      return;
    }
    if (userListmodified.userListmodified.length === 0) {
      setUserListmodified({
        triggerUpdate: false,
        userListmodified: [],
        cancel: false,
      });
      dispatch(resetUserList());
    }
  }, [userListmodified.triggerUpdate]);

  const handleEditCellChange = useCallback(
    ({ id, field, props }) => {
      if (field === "email") {
        const data = props; 
        const isValid = validateEmail(data.value);
        const newState = {};
        newState[id] = {
          ...editRowsModel[id],
          email: { ...props, error: !isValid },
        };
        setEditRowsModel((state) => ({ ...state, ...newState }));
        if (!validateEmail(props.value)) {
          return;
        }
      }
      if (addUser.toggle) {
        setaddUser((data) => ({
          ...data,
          data: [{ ...data.data[0], [field]: props.value }],
        }));
      }
    },
    [editRowsModel, addUser.toggle]
  );

  const handleEditCellChangeCommitted = useCallback(
    ({ id, field, props: { value } }) => {
      if (addUser.toggle) {
        const isFilledIn =
          addUser.data[0].taiKhoan !== "" ||
          addUser.data[0].matKhau !== "" ||
          addUser.data[0].hoTen !== "" ||
          addUser.data[0].email !== "" ||
          addUser.data[0].soDt !== "" ||
          addUser.data[0].maLoaiNguoiDung === true;
        const readyAdd =
          addUser.data[0].taiKhoan !== "" &&
          addUser.data[0].matKhau !== "" &&
          addUser.data[0].hoTen !== "" &&
          addUser.data[0].email !== "" &&
          addUser.data[0].soDt !== "";
        setaddUser((data) => ({ ...data, readyAdd, isFilledIn }));
        return; 
      }
      const userOriginal = usersList.find((user) => user.taiKhoan === id); 
      const valueDisplay = value;
      let valueModified = value;
      if (field === "maLoaiNguoiDung") {
        valueModified = value ? "QuanTri" : "KhachHang";
      }
      const isChange = userOriginal[field] === valueModified ? false : true; 
      const indexUserExist = userListmodified.userListmodified.findIndex(
        (user) => user.taiKhoan === id
      ); 
      if (isChange) {
       
        const updatedUsersListDisplay = usersListDisplay.map((row) => {
          if (row.id === id) {
            return { ...row, ismodify: true, [field]: valueDisplay };
          }
          return row;
        });
        setUsersListDisplay(updatedUsersListDisplay);
        if (indexUserExist !== -1) {
          const newUserListmodified = userListmodified.userListmodified.map(
            (user) => {
              if (user.taiKhoan === id) {
                return { ...user, [field]: valueModified };
              }
              return user;
            }
          );
          setUserListmodified((data) => ({
            ...data,
            userListmodified: newUserListmodified,
          }));
          return;
        }
        setUserListmodified((data) => ({
          ...data,
          userListmodified: [
            ...userListmodified.userListmodified,
            { ...userOriginal, [field]: valueModified, maNhom: "GP09" },
          ],
        })); 
        return;
      }
      if (indexUserExist !== -1) {
        let userModified = userListmodified.userListmodified[indexUserExist];
        userModified = { ...userModified, [field]: valueModified };
        const isMatKhauChange = userModified.matKhau !== userOriginal.matKhau;
        const isEmailChange = userModified.email !== userOriginal.email;
        const isSoDtChange = userModified.soDt !== userOriginal.soDt;
        const isMaLoaiNguoiDungChange =
          userModified.maLoaiNguoiDung !== userOriginal.maLoaiNguoiDung;
        const isHoTenChange = userModified.hoTen !== userOriginal.hoTen;
        const ismodify =
          isMatKhauChange ||
          isEmailChange ||
          isSoDtChange ||
          isMaLoaiNguoiDungChange ||
          isHoTenChange;
        const updatedUsersListDisplay = usersListDisplay.map((row) => {
          if (row.id === id) {
            return { ...row, ismodify, [field]: valueDisplay };
          }
          return row;
        });
        setUsersListDisplay(updatedUsersListDisplay);
        if (ismodify) {
          const newUserListmodified = userListmodified.userListmodified.map(
            (user) => {
              if (user.taiKhoan === id) {
                return { ...userModified };
              }
              return user;
            }
          );
          setUserListmodified((data) => ({
            ...data,
            userListmodified: newUserListmodified,
          }));
          return;
        }
        const newUserListmodified = userListmodified.userListmodified.filter(
          (user) => user.taiKhoan !== id
        );
        setUserListmodified((data) => ({
          ...data,
          userListmodified: newUserListmodified,
        }));
      }
    },
    [usersListDisplay, usersList, userListmodified, addUser]
  );

  const handleRefreshUserListResetChanged = () => {
    setUserListmodified({
      triggerUpdate: false,
      userListmodified: [],
      cancel: false,
    });
    setBtnReFresh(nanoid(6));
  };

  const handleDeleteOne = (taiKhoan) => {
    if (loadingDelete) {
      return;
    }
    dispatch(deleteUser(taiKhoan));
  };
  // x??a nhi???u user
  const handleDeleteMultiple = () => {
    if (userListDelete.triggerDelete !== false) {
      setUserListDelete((data) => ({
        ...data,
        cancel: true,
        triggerDelete: false,
      }));
      return;
    }
    setUserListDelete((data) => ({
      ...data,
      triggerDelete: nanoid(6),
      cancel: false,
    }));
  };
  // update nhi???u user
  const handleUpdateMultiple = () => {
    if (userListmodified.triggerUpdate !== false) {
      setUserListmodified((data) => ({
        ...data,
        cancel: true,
        triggerUpdate: false,
      }));
      return;
    }
    setUserListmodified((data) => ({
      ...data,
      triggerUpdate: nanoid(6),
      cancel: false,
    }));
  };

  const handleInputSearchChange = (props) => {
    clearTimeout(clearSetSearch.current);
    clearSetSearch.current = setTimeout(() => {
      setValueSearch(props);
    }, 500);
  };

  const handleToggleAddUser = () => {
    if (!addUser.isFilledIn) {
      // n???u ch??a ??i???n th?? toggle
      setaddUser((data) => ({ ...data, toggle: !addUser.toggle }));
      return;
    }
    if (addUser.readyAdd && !loadingAddUser) {
      // n???u ???? ??i???n v?? ???? s??n s??ng
      const userAdd = { ...addUser.data[0] };
      delete userAdd.id;
      dispatch(
        postAddUser({
          ...addUser.data[0],
          maLoaiNguoiDung: userAdd.maLoaiNguoiDung ? "QuanTri" : "KhachHang",
          maNhom: "GP09",
        })
      );
    }
  };

  const onFilter = () => {
    const searchUsersListDisplay = usersListDisplay.filter((user) => {
      const matchTaiKhoan =
        slugify(user.taiKhoan ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      const matchMatKhau =
        slugify(user.matKhau ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      const matchEmail =
        slugify(user.email ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      const matchSoDt =
        slugify(user.soDt ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      const matchHoTen =
        slugify(user.hoTen ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      return (
        matchTaiKhoan || matchMatKhau || matchEmail || matchSoDt || matchHoTen
      );
    });
    return searchUsersListDisplay;
  };

  const sortModel = useMemo(() => {
    return [
      {
        field: sortBy.field,
        sort: sortBy.sort,
      },
    ];
  }, [sortBy]);

  const columns = useMemo(
    () =>
      [
        {
          field: "xoa",
          headerName: "X??a",
          width: 100,
          renderCell: (params) => (
            <ButtonDelete
              onDeleted={handleDeleteOne}
              taiKhoan={params.row.taiKhoan}
            />
          ),
          headerAlign: "center",
          align: "center",
          headerClassName: "custom-header",
          hide: addUser.toggle,
        },
        {
          field: "taiKhoan",
          headerName: "T??i Kho???n",
          width: 250,
          editable: addUser.toggle,
          headerAlign: "center",
          align: "left",
          headerClassName: "custom-header",
        },
        {
          field: "matKhau",
          headerName: "M???t Kh???u",
          width: 300,
          editable: true,
          headerAlign: "center",
          align: "left",
          headerClassName: "custom-header",
        },
        {
          field: "hoTen",
          headerName: "H??? t??n",
          width: 300,
          editable: true,
          headerAlign: "center",
          align: "left",
          headerClassName: "custom-header",
        },
        {
          field: "email",
          headerName: "Email",
          width: 300,
          editable: true,
          headerAlign: "center",
          align: "left",
          headerClassName: "custom-header",
        },
        {
          field: "soDt",
          headerName: "S??? ??i???n tho???i",
          width: 200,
          editable: true,
          type: "number",
          headerAlign: "center",
          align: "left",
          headerClassName: "custom-header",
        },
        {
          field: "maLoaiNguoiDung",
          headerName: "isAdmin",
          width: 145,
          editable: true,
          type: "boolean",
          headerAlign: "center",
          align: "center",
          headerClassName: "custom-header",
        },
        {
          field: "ismodify",
          width: 0,
          type: "boolean",
          headerClassName: "custom-header",
          hide: true,
        },
      ],
    [addUser.toggle]
  );

  const modifySlugify = { lower: true, locale: "vi" };

  if (errorUsersList) {
    return <h1>{errorUsersList}</h1>;
  }

  return (
    <div style={{ height: "100vh", width: "100%", paddingBottom:'100px' }}>
      <div className="container-fluid pb-3">
        <div className="">
          <div className="">
            <button
              variant="contained"
              color="primary"
              className={`${classes.addUser} ${classes.button}`}
              onClick={handleToggleAddUser}
              disabled={
                addUser.toggle
                  ? addUser.isFilledIn
                    ? addUser.readyAdd
                      ? false
                      : true
                    : false
                  : false
              }
              startIcon={
                addUser.toggle ? (
                  addUser.isFilledIn ? (
                    <PersonAddIcon />
                  ) : (
                    <EditIcon />
                  )
                ) : (
                  <PersonAddIcon />
                )
              }
            >
              {addUser.toggle
                ? addUser.isFilledIn
                  ? "th??m user"
                  : "qu???n l?? user"
                : "th??m user"}
            </button>
          </div>
          <div className="">
            <div className={`${classes.search} ${classes.button}`}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search???"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                onChange={(evt) => handleInputSearchChange(evt.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <DataGrid
        className={classes.rootDataGrid}
        rows={addUser.toggle ? addUser.data : onFilter()}
        columns={columns}
        pageSize={25}
        rowsPerPageOptions={[25, 50, 100]}
        getRowClassName={(params) => {
          return `isadmin--${params
            .getValue("maLoaiNguoiDung")
            .toString()} ismodify--${params.getValue("ismodify")?.toString()}`;
        }}
        checkboxSelection={!addUser.toggle}
        disableSelectionOnClick
        onSelectionModelChange={(newSelection) => {
          if (newSelection.selectionModel.length === 0) {
            setUserListDelete({
              triggerDelete: false,
              userListDelete: [],
              cancel: false,
            });
          }
          setUserListDelete((data) => ({
            ...data,
            userListDelete: newSelection.selectionModel,
          }));
          setSelectionModel(newSelection.selectionModel);
        }}
        selectionModel={selectionModel}
        // x??? l?? ch???nh s???a
        editRowsModel={editRowsModel}
        onEditCellChange={handleEditCellChange}
        onEditCellChangeCommitted={handleEditCellChangeCommitted}
        loading={loadingUsersList}
        components={{ LoadingOverlay: CustomLoadingOverlay }}
        // sort
        sortModel={sortModel}
      />
    </div>
  );
}
