import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Collapse,
  Button,
  Menu,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import EventNoteIcon from "@mui/icons-material/EventNote";
import VacationIcon from "@mui/icons-material/FlightTakeoff";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LeaveIcon from "@mui/icons-material/DirectionsWalk";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PaymentIcon from "@mui/icons-material/Payment";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const SettingsDropdown = ({ handleLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const anchorRef = useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Untuk membuka dropdown setting
  const handleToggle = () => {
    setMenuOpen((prevOpen) => !prevOpen);
  };

  // Untuk menutup dropdown setting
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setMenuOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setMenuOpen(false);
    }
  };

  const prevOpen = useRef(menuOpen);
  useEffect(() => {
    if (prevOpen.current === true && menuOpen === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = menuOpen;
  }, [menuOpen]);

  const handleToggleChangePassword = () => {
    console.log(showChangePassword);
    setShowChangePassword(!showChangePassword);
  };

  return (
    <div className="relative">
      <IconButton
        ref={anchorRef}
        aria-controls={menuOpen ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="inherit"
        className="text-black"
      >
        <SettingsIcon />
      </IconButton>
      <Popper
        open={menuOpen}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        style={{ zIndex: 1 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper className="mr-16">
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={menuOpen}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                  className="outline-none"
                  style={{ marginTop: "0.7rem" }}
                >
                  <MenuItem
                    component={Link}
                    to="/setting"
                    className="px-4 py-2"
                  >
                    <Typography variant="button">Settings</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout} className="px-4 py-2">
                    <Typography variant="button">Logout</Typography>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

const NavbarUser = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formulirOpen, setFormulirOpen] = useState(false);
  const [masterOpen, setMasterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [anchorEl, setAnchorEl] = useState(null);
  const isUserAdmin = localStorage.getItem("role");
  const navigate = useNavigate();
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Untuk membuat responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setFormulirOpen(!formulirOpen);
  };

  // Untuk set menu apa saja yang akan ada
  const subItems = [
    { label: "Izin", active: false },
    { label: "Cuti", active: false },
    { label: "Reimburse", active: false },
    { label: "Resign", active: false },
  ];

  // Untuk nge set redirectnya
  const handleMenuItemClick = (item) => {
    if (item.label === "Izin") {
      navigate("/izin");
    } else if (item.label === "Cuti") {
      navigate("/cuti");
    } else if (item.label === "Reimburse") {
      navigate("/reimburst");
    } else if (item.label === "Resign") {
      navigate("/resign");
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setFormulirOpen(false);
  };

  const operation = localStorage.getItem("operation");

  function checkOp(string) {
    return operation.includes(string);
  }
  // Untuk show master apa saja yang ada dengan menggunakan operation
  const masterSubItems = [
    checkOp("READ_ABSENSI")
      ? { label: "Absen", active: false, to: "/masterabsen" }
      : null,
    checkOp("READ_KARYAWAN")
      ? { label: "Data Karyawan", active: false, to: "/masterkaryawan" }
      : null,
    checkOp("READ_IZIN")
      ? { label: "Izin", active: false, to: "/masterizin" }
      : null,
    checkOp("READ_CUTI")
      ? { label: "Cuti", active: false, to: "/mastercuti" }
      : null,
    checkOp("READ_REIMBURST")
      ? { label: "Reimburse", active: false, to: "/masterreimburst" }
      : null,
    checkOp("READ_RESIGN")
      ? { label: "Resign", active: false, to: "/masterresign" }
      : null,
    checkOp("READ_LAPORAN")
      ? { label: "Laporan", active: false, to: "/masterlaporan" }
      : null,
    checkOp("READ_PAYROLL")
      ? { label: "Payroll", active: false, to: "/masterpayroll" }
      : null,
  ].filter((item) => item !== null);

  // Untuk membuka master data
  const handleMasterClick = (event) => {
    setAnchorEl(event.currentTarget);
    setMasterOpen(!masterOpen);
  };

  const handleMasterClose = () => {
    setAnchorEl(null);
    setMasterOpen(false);
  };

  // Untuk logic log out
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center w-full bg-accent">
      <AppBar
        position="static"
        className="border-b bg-accent w-full flex items-center"
        style={{ boxShadow: "none", backgroundColor: "#fefefe" }}
      >
        <Toolbar className="justify-between bg-accent w-[93%]">
          {isMobile && (
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
              className="text-black"
            >
              <MenuIcon />
            </IconButton>
          )}
          {!isMobile && (
            <Typography
              variant="h6"
              component="div"
              className="text-center font-bold ml-4"
            >
              <img
                src="../../public/logo-login.png"
                className="h-10"
                alt="logo"
              ></img>
            </Typography>
          )}
          {!isMobile && (
            <div className="flex justify-between">
              <div className="text-black flex items-center justify-center">
                <ListItem button component={Link} to="/dashboard">
                  <Typography variant="button">Dashboard</Typography>
                </ListItem>
              </div>
              <div className="text-black flex items-center justify-center">
                <Button
                  variant="button"
                  onClick={handleMenuClick}
                  endIcon={
                    <ExpandMoreIcon
                      style={{
                        transform: `rotate(${
                          formulirOpen ? "180deg" : "360deg"
                        })`,
                        transition: "transform 0.3s",
                      }}
                    />
                  }
                >
                  Formulir
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={formulirOpen}
                  onClose={handleClose}
                  style={{ marginTop: "0.7rem" }}
                >
                  <List>
                    {subItems.map((item, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => {
                          handleMenuItemClick(item);
                          handleClose();
                        }}
                        style={{ width: "8.3rem" }}
                        className="flex justify-center items-center text-center"
                      >
                        <Typography
                          variant="button"
                          style={{ color: item.active ? "white" : "black" }}
                        >
                          {item.label}
                        </Typography>
                      </MenuItem>
                    ))}
                  </List>
                </Menu>
              </div>
              {isUserAdmin === "admin" ? (
                <div className="text-black flex items-center justify-center">
                  <Button
                    variant="button"
                    onClick={handleMasterClick}
                    endIcon={
                      <ExpandMoreIcon
                        style={{
                          transform: `rotate(${
                            masterOpen ? "180deg" : "360deg"
                          })`,
                          transition: "transform 0.3s",
                        }}
                      />
                    }
                  >
                    <Typography
                      variant="button"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Master Data
                    </Typography>
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={masterOpen}
                    onClose={handleMasterClose}
                    style={{ marginTop: "0.7rem" }}
                  >
                    <List>
                      {masterSubItems.map((item, index) => (
                        <MenuItem
                          key={index}
                          onClick={() => {
                            // handleMasterItemClick(item);
                            handleMasterClose();
                          }}
                          component={Link}
                          to={item.to}
                          style={{ width: "10rem" }}
                        >
                          <Typography
                            variant="button"
                            style={{ color: item.active ? "white" : "black" }}
                          >
                            {item.label}
                          </Typography>
                        </MenuItem>
                      ))}
                    </List>
                  </Menu>
                </div>
              ) : null}
              <div className="text-black flex items-center justify-center">
                <ListItem button component={Link} to="/payroll">
                  <Typography variant="button">Payroll</Typography>
                </ListItem>
              </div>
              <div className="text-black">
                <SettingsDropdown handleLogout={handleLogout} />
              </div>
              <div className="text-black flex items-center justify-center"></div>
            </div>
          )}
        </Toolbar>
      </AppBar>
      {isMobile && (
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
          <List>
            <ListItem button component={Link} to="/dashboard">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/laporan">
              <ListItemIcon>
                <EventNoteIcon />
              </ListItemIcon>
              <ListItemText primary="Laporan Kegiatan" />
            </ListItem>
            <ListItem button component={Link} to="/izin">
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Izin" />
            </ListItem>
            <ListItem button component={Link} to="/cuti">
              <ListItemIcon>
                <VacationIcon />
              </ListItemIcon>
              <ListItemText primary="Cuti" />
            </ListItem>
            <ListItem button component={Link} to="/reimburst">
              <ListItemIcon>
                <AttachMoneyIcon />
              </ListItemIcon>
              <ListItemText primary="Reimburse" />
            </ListItem>
            <ListItem button component={Link} to="/resign">
              <ListItemIcon>
                <LeaveIcon />
              </ListItemIcon>
              <ListItemText primary="Resign" />
            </ListItem>
            <ListItem button component={Link} to="/payroll">
              <ListItemIcon>
                <PaymentIcon />
              </ListItemIcon>
              <ListItemText primary="Payroll" />
            </ListItem>
            <ListItem button component={Link} to="/setting">
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Drawer>
      )}
    </div>
  );
};

export default NavbarUser;
