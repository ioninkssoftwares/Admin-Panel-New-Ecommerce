import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import PeopleIcon from "@mui/icons-material/People";
import Box from "@mui/material/Box";
import LogoutIcon from "@mui/icons-material/Logout";
import Cookies from "js-cookie";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import Button from "@mui/material/Button";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PaymentIcon from "@mui/icons-material/Payment";
import BorderHorizontalIcon from "@mui/icons-material/BorderHorizontal";
import UsbIcon from "@mui/icons-material/Usb";
import StorefrontIcon from "@mui/icons-material/Storefront";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import { useNavigate, useLocation } from "react-router-dom";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const AlertDialog = ({ open, setOpen, title, description, onConfirm }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <>
      {open && (
        <div className="delete-confirmation-modal">
          <div className="modal-content">
            <h2>{title}</h2>
            <p>{description}</p>
            <div className="delete-confirmation-buttons">
              <button onClick={handleConfirm}>Confirm</button>

              <button onClick={() => handleClose()}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const drawerWidth = 270;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function SideBar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleLogout = () => {
    // Delete the token from cookies
    Cookies.remove("token");

    // Redirect to the login page
    navigate("/loginadmin");
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Toolbar
          sx={{
            background: "white",
            color: "black",
            display: "flex",
            justifyContent: "space-between",
            ...(open && { justifyContent: "flex-end" }),
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                ...(open && {
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }),
              }}
            >
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                className="buttonSideBarIssue"
                sx={{
                  p: "10px 0px",
                }}
              >
                <PersonIcon sx={{ color: "black" }} />
                <span
                  style={{
                    padding: "0px 10px",
                    color: "black",
                  }}
                >
                  Admin Dashboard
                </span>
              </Button>
              <IconButton
                onClick={() => setShowLogoutDialog(true)}
                color="inherit"
              >
                <LogoutIcon />
              </IconButton>
              <AlertDialog
                open={showLogoutDialog}
                setOpen={setShowLogoutDialog}
                title="Logout"
                description="Are you sure you want to logout?"
                onConfirm={handleLogout}
              />
            </Box>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{ background: "orange", color: "white" }}
      >
        <DrawerHeader sx={{ background: "orange" }}>
          <IconButton onClick={handleDrawerClose} sx={{ color: "white" }}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List sx={{ background: "orange", color: "white", height: "100vh" }}>
          {[
            { text: "Dashboard", route: "/" },
            { text: "Order Management", route: "/ordermanagement" },
            { text: "Product Management", route: "/productmanagement" },

            { text: "Service Management", route: "/servicemanagement" },
            { text: "Banner Management", route: "/inventorymanagement" },
            { text: "User Management", route: "/usermanagement" },
            // { text: "Coupon Codes", route: "/couponcodes" },
            { text: "Staff Management", route: "/staffmanagement" },
            { text: "Admin Management", route: "/adminManagement" },
            { text: "Subscription  Management", route: "/subscription" },
            { text: "Vendor Management", route: "/vendormanagement" },

            { text: "Payment Management", route: "/paymentsmanagement" },
          ].map((item) => (
            <ListItem
              key={item.text}
              disablePadding
              sx={{ display: "block" }}
              onClick={() => {
                navigate(item.route);
              }}
              selected={location.pathname === item.route}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.text === "Dashboard" && (
                    <DashboardIcon sx={{ color: "white" }} />
                  )}
                  {item.text === "Order Management" && (
                    <ListAltIcon sx={{ color: "white" }} />
                  )}
                  {item.text === "Product Management" && (
                    <ViewInArIcon sx={{ color: "white" }} />
                  )}
                  {item.text === "Banner Management" && (
                    <BorderHorizontalIcon sx={{ color: "white" }} />
                  )}
                  {item.text === "User Management" && (
                    <UsbIcon sx={{ color: "white" }} />
                  )}
                  {/* {item.text === "Coupon Codes" && (
                    <LocalOfferIcon sx={{ color: "white" }} />
                  )} */}
                  {item.text === "Staff Management" && (
                    <PeopleIcon sx={{ color: "white" }} />
                  )}
                  {item.text === "Admin Management" && (
                    <AdminPanelSettingsIcon sx={{ color: "white" }} />
                  )}
                  {item.text === "Subscription  Management" && (
                    <CardMembershipIcon sx={{ color: "white" }} />
                  )}
                  {item.text === "Vendor Management" && (
                    <LocalGroceryStoreIcon sx={{ color: "white" }} />
                  )}
                  {item.text === "Service Management" && (
                    <LocalGroceryStoreIcon sx={{ color: "white" }} />
                  )}
                  {item.text === "Payment Management" && (
                    <PaymentIcon sx={{ color: "white" }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
