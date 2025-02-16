import { useState, useEffect } from "react";
import axios from "axios";
import NavbarUser from "../feature/NavbarUser";
import SettingHoliday from "../feature/SettingHoliday";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Card, CardContent } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InputBase from "@mui/material/InputBase";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import ip from "../ip";
import PatchStatus from "../feature/PatchStatus";

const TableAbsen = () => {
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isTimeSettingOpen, setIsTimeSettingOpen] = useState(false);
  const [isHolidayOpen, setIsHolidayOpen] = useState(false);
  const [timeMasuk, setTimeMasuk] = useState(null);
  const [timeKeluar, setTimeKeluar] = useState(null);
  const [selectedToleransi, setSelectedToleransi] = useState(null);
  const operation = localStorage.getItem("operation");
  const apiURLAbsenKaryawan = `${ip}/api/absensi/get/data/dated`;
  const apiURLSettingJam = `${ip}/api/absensi/update/seting`;

  const requestBody1 = {
    date: selectedDate,
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("accessToken"),
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          apiURLAbsenKaryawan,
          requestBody1,
          config
        );
        // console.log('Response Data:', response.data);
        setRows(response.data);
        setOriginalRows(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchTime = async () => {
      const url = `${ip}/api/absensi/get/time`;
      try {
        const response = await axios.get(url, config);
        console.log(response.data);
        setTimeMasuk(new Date());
        setTimeKeluar(
          `${response.data.keluar.jam}:${response.data.keluar.menit}`
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    // fetchTime();
    fetchData(); // Call the function when the component mounts
  }, [selectedDate]);

  const handleOpenDateFilter = () => {
    setIsDateFilterOpen(true);
  };

  const handleCloseDateFilter = () => {
    setIsDateFilterOpen(false);
  };

  const handleDateFilterChange = (date) => {
    setSelectedDate(date);
    setIsDateFilterOpen(false);
    setPage(0);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openTimeSetting = () => {
    setIsTimeSettingOpen(true);
    handleClose();
  };

  const openHolidaySetting = () => {
    setIsHolidayOpen(true);
    handleClose();
  };

  const closeHolidaySetting = () => {
    setIsHolidayOpen(false);
  };

  const handleTimeChange = (newVal, bool) => {
    console.log(newVal, bool);
    if (bool) {
      setTimeMasuk(newVal);
    } else setTimeKeluar(newVal);
  };

  const handleToleransiChange = (newTime) => {
    setSelectedToleransi(newTime);
  };

  const handleTimeSave = () => {
    handleTimeChange(timeMasuk, true);
    handleTimeChange(timeKeluar, false);
    handleToleransiChange(selectedToleransi);
    console.log(timeMasuk, timeKeluar, selectedToleransi);
    const requestBody2 = {
      masuk: {
        jam: timeMasuk ? timeMasuk.$H : null,
        menit: timeMasuk ? timeMasuk.$m : null,
        toleransi: selectedToleransi ?? null,
      },
      keluar: {
        jam: timeKeluar ? timeKeluar.$H : null,
        menit: timeKeluar ? timeKeluar.$m : null,
      },
    };
    console.log(requestBody2);
    axios
      .post(apiURLSettingJam, requestBody2, config)
      .then((response) => {
        // console.log('Response Data:', response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    closeTimeSetting();
    handleClose();
  };

  const closeTimeSetting = () => {
    setIsTimeSettingOpen(false);
    handleClose();
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearch(query);
    setPage(0);

    if (query === "" || query === null) {
      // Jika kotak pencarian kosong, kembalikan ke data asli
      setRows(originalRows);
    }
  };

  const searchInRows = (query) => {
    const filteredRows = originalRows.filter((row) => {
      // Sesuaikan dengan kriteria pencarian Anda
      return row.nama.toLowerCase().includes(query.toLowerCase());
    });

    setRows(filteredRows);
    setPage(0);
  };

  const handleSearch = () => {
    searchInRows(search);
    setPage(0);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExcel = () => {
    const api = `${ip}/api/export/data/0`;

    const requestBody = {
      date: selectedDate,
    };

    axios({
      url: api,
      method: "POST",
      responseType: "blob", // Respons diharapkan dalam bentuk blob (file)
      data: requestBody,
      headers: {
        "Content-Type": "application/json", // Sesuaikan dengan tipe konten yang diterima oleh API
        Authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => {
        console.log(response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Data Absen.xlsx"); // Nama file yang ingin Anda unduh
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // if(response.response.status === 400) return alert('gk ada data')
        // else {

        // }
      })
      .catch((error) => {
        if (error.message.includes("400")) alert("Tidak Ada Data");
        console.error("Error downloading Excel file:", error);
      });
  };

  return (
    <div className="w-full h-screen bg-gray-100 overflow-y-hidden">
      <NavbarUser />
      <div className="flex w-full justify-center">
        <div className="flex w-[90%] items-start justify-start my-2">
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            {" "}
            Data Absensi{" "}
          </Typography>
        </div>
      </div>
      <div className="flex justify-center items-center w-screen my-2">
        <Card className="w-[90%]">
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center w-full mx-auto space-x-1">
                <div className="bg-gray-200 rounded-lg flex justify-start items-center w-2/5 border border-gray-400">
                  <SearchIcon style={{ fontSize: 25 }} />
                  <InputBase
                    placeholder="Search..."
                    onKeyPress={handleKeyPress}
                    onChange={handleSearchChange}
                    className="w-full"
                  />
                </div>
                <div className="flex rounded-lg space-x-1">
                  <Button
                    size="small"
                    variant="text"
                    onClick={handleOpenDateFilter}
                  >
                    <CalendarMonthIcon className="text-black" />
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    style={{ backgroundColor: "#204684" }}
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                  <Dialog
                    open={isDateFilterOpen}
                    onClose={handleCloseDateFilter}
                  >
                    <DialogTitle>Pilih Tanggal</DialogTitle>{" "}
                    {/* Judul "Pilih Tanggal" */}
                    <DialogContent>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={selectedDate}
                          onChange={handleDateFilterChange}
                          renderInput={(params) => (
                            <div className="w-64 mt-2">
                              <input
                                {...params.inputProps}
                                className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-400"
                              />
                            </div>
                          )}
                        />
                      </LocalizationProvider>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="flex items-center justify-between mx-auto">
                <div className="flex space-x-1">
                  <Button
                    disabled={!operation.includes("UPDATE_ABSENSI")}
                    size="small"
                    variant="contained"
                    className="bg-blue-500 hover-bg-blue-400 p-1 rounded-lg"
                    onClick={handleClick}
                  >
                    <MoreVertIcon />
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={openTimeSetting} onClose={handleClose}>
                      <SettingsIcon
                        className="text-gray-500"
                        style={{ marginRight: "8px" }}
                      />
                      Setting Jam Absen
                    </MenuItem>
                    <MenuItem
                      onClick={openHolidaySetting}
                      onClose={handleClose}
                    >
                      <CalendarMonthIcon
                        className="text-gray-500"
                        style={{ marginRight: "8px" }}
                      />
                      Setting Tanggal Libur
                    </MenuItem>
                  </Menu>
                  <Dialog open={isTimeSettingOpen} onClose={closeTimeSetting}>
                    <DialogTitle>Atur Jam Absen</DialogTitle>
                    <DialogContent>
                      <div className="flex space-x-1">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <div className="flex my-2">
                            <TimePicker
                              label="Jam Masuk"
                              value={timeMasuk}
                              onChange={(val) => {
                                handleTimeChange(val, true);
                              }}
                              style={{ width: "100%" }}
                            />
                          </div>
                        </LocalizationProvider>
                        <div className="flex my-2">
                          <TextField
                            label="Toleransi (menit)"
                            type="number"
                            value={selectedToleransi}
                            onChange={(event) =>
                              handleToleransiChange(
                                parseInt(event.target.value)
                              )
                            }
                          />
                        </div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <div className="flex my-2">
                            <TimePicker
                              label="Jam Keluar"
                              value={timeKeluar}
                              onChange={(val) => {
                                handleTimeChange(val, false);
                              }}
                              style={{ width: "100%" }}
                            />
                          </div>
                        </LocalizationProvider>
                      </div>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={handleTimeSave}
                        size="small"
                        style={{ backgroundColor: "#204684" }}
                        variant="contained"
                      >
                        <p>Simpan</p>
                      </Button>
                      <Button
                        onClick={closeTimeSetting}
                        style={{ backgroundColor: "#F&FAFC" }}
                        size="small"
                        variant="outlined"
                      >
                        <p className="bg-gray-100">Tutup</p>
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <Button
                    size="small"
                    variant="contained"
                    style={{ backgroundColor: "#1E6D42" }}
                    onClick={handleExcel}
                  >
                    <DescriptionIcon className="text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col justify-between items-center my-2 rounded-xl mx-auto drop-shadow-xl">
        <Card className="w-[90%]">
          <CardContent>
            <div className="max-h-72 rounded-lg overflow-y-auto drop-shadow-lg">
              <TableContainer component={Paper} style={{ width: "100%" }}>
                <Table aria-label="simple table" size="small">
                  <TableHead style={{ backgroundColor: "#204684" }}>
                    <TableRow>
                      <TableCell align="center">
                        <p className="text-white font-semibold">Nama</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-white font-semibold">Jam Masuk</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-white font-semibold">Jam Pulang</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-white font-semibold">Tanggal</p>
                      </TableCell>
                      <TableCell align="center">
                        <p className="text-white font-semibold">Status</p>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="bg-gray-100">
                    {(rowsPerPage > 0
                      ? rows.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : rows
                    )
                      .sort((a, b) => a.nama.localeCompare(b.nama))
                      .map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">{row.nama}</TableCell>
                          <TableCell align="center">{row.masuk}</TableCell>
                          <TableCell align="center">{row.keluar}</TableCell>
                          <TableCell align="center">{row.date}</TableCell>
                          <TableCell
                            align="center"
                            className="flex items-center"
                          >
                            <PatchStatus string={row.status} id={row.id} />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex w-full justify-center">
        <div className="flex w-11/12 items-end justify-end">
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Jumlah Data"
          />
        </div>
      </div>
      {isHolidayOpen && <SettingHoliday onClose={closeHolidaySetting} />}
    </div>
  );
};

export default TableAbsen;
