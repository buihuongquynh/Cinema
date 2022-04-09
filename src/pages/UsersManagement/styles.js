import { fade, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => {
  return {
    control: {
      height: "fit-content",
      width: "100%",
    },
    rootDataGrid: {
      "& .MuiDataGrid-cellEditing": {
        backgroundColor: "rgb(255,215,115, 0.19)",
        color: "#1a3e72",
      },
      "& .Mui-error": {
        backgroundColor: `rgb(126,10,15,0.1})`,
        color: "#750f0f",
      },
    
      "& .isadmin--true": {
        backgroundColor: "rgb(250, 179, 174)",
        "&:hover": {
          backgroundColor: "rgb(249, 161, 154)",
        },
      },
    },
    button: {
      width: "100%",
      height: "100%",
    },
    userQuanTri: {
      backgroundColor: "rgb(250, 179, 174)",
      "&:hover": {
        backgroundColor: "rgb(249, 161, 154)",
      },
    },
   
    search: {
      verticalAlign: "bottom",
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.info.light, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.info.light, 0.25),
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
      textOverflow: "ellipsis",
      overflow: "hidden",
      display: "flex",
    },
    inputInput: {
      padding: "8.5px 8.5px 8.5px 0px",
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
    },
    addUser:{
      fontSize: "16px",
      borderRadius: "4px",
      background: "0 0",
      padding: "5px 15px",
      transition: "all .2s",
      marginTop: "25px",
      width: '10%',
      marginBottom: "20px",
      backgroundColor: "rgb(238, 130, 59)",
      border: "none",
      color: "#fff",
      fontWeight:'600',
      "&:hover": {
        backgroundColor: "#b42a14",
      }
    }
   
  };
});
export default useStyles;
