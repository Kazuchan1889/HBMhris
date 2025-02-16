import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Modal,
  Dialog,
  DialogContent,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NavbarUser from "../feature/NavbarUser";
import Swal from "sweetalert2";
import ip from "../ip";
import DownloadIcon from "@mui/icons-material/Download";

function FormReimburst() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading] = useState(false);
  const [uploadInProgress] = useState(false);
  const [uploadedFileBase64, setUploadedFileBase64] = useState("");
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [uploadedFileBase64s, setUploadedFileBase64s] = useState([]);

  const [formData, setFormData] = useState({
    keterangan: "",
    biaya: "Rp. ",
    tanggal: "",
  });

  //Untuk menghubungkan melalui accessToken
  useEffect(() => {
    const apiUrl = `${ip}/api/karyawan/get/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    setLoading(true);

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        fetchTableData();
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const handleFileUpload = async (acceptedFiles) => {
    const maxSizeInBytes = 5000000; // 5 MB
    const newUploadedFiles = [...acceptedFiles];
    const oversizedFiles = acceptedFiles.filter(
      (file) => file.size > maxSizeInBytes
    );

    if (oversizedFiles.length > 0) {
      // Display a SweetAlert for oversized files using async function
      await Swal.fire({
        icon: "error",
        title: "File Too Big",
        text: "File size exceeds the limit of 5 MB",
      });
      return;
    }

    await setUploadedFile(acceptedFiles[0]);
    const newFileBase64s = acceptedFiles.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return reader;
    });

    setUploadedFileBase64s(newFileBase64s[0]);

    console.log(acceptedFiles[0].path);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
      "file/xlxs": [".xlxs"],
      "file/zip": [".zip"],
      "file/rar": [".rar"],
    },
    onDrop: (acceptedFiles) => {
      // Untuk melakukan Filter acceptedFiles hanya  png, jpg, and jpeg files
      const allowedExtensions = ["png", "jpg", "jpeg", "xlxs", "zip", "rar"];
      const filteredFiles = acceptedFiles.filter((file) => {
        const fileExtension = file.name.split(".").pop().toLowerCase();
        return allowedExtensions.includes(fileExtension);
      });

      if (filteredFiles.length === 1) {
        handleFileUpload(filteredFiles);
      }
    },
    multiple: false,
  });

  // Untuk membuat biaya menggunakan template (Rp.) dan setiap 3 angka akan memunculkan dots (.)
  const handleBiayaChange = (event) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/[^\d]/g, "");
    const dotlessValue = numericValue.replace(/\./g, "");

    let formattedValue = "Rp. ";
    for (let i = 0; i < dotlessValue.length; i++) {
      formattedValue += dotlessValue[i];
      if (
        (dotlessValue.length - i - 1) % 3 === 0 &&
        i !== dotlessValue.length - 1
      ) {
        formattedValue += ".";
      }
    }

    setFormData({
      ...formData,
      biaya: formattedValue,
    });
  };

  const fetchTableData = () => {
    // Untuk Fetch updated data
    const apiUrl = `${ip}/api/reimburst/get/data/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const data = response.data;
        console.log(response.data);
        setTableData(data);
        console.log(tableData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    // Untuk mengecek field yang kosong
    const requiredFields = ["keterangan", "biaya", "tanggal", "image"];
    const isAnyFieldEmpty = requiredFields.some((field) => {
      if (field === "image") {
        // Untuk mengecek image sudah terisi
        return !uploadedFile;
      }
      return !formData[field];
    });

    // Untuk memastikan semua field terisi
    setIsFormValid(!isAnyFieldEmpty);
  }, [formData, uploadedFile]);

  // Untuk melakukan Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(uploadedFile);
    const requestBody = {
      keterangan: formData.keterangan,
      biaya: formData.biaya,
      tanggal: formData.tanggal,
      image: uploadedFileBase64s.result,
    };

    if (!uploadedFile) {
      console.log("b");
      return;
    }

    // Untuk post menggunakan axios
    const apiSubmit = `${ip}/api/reimburst/post`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };

    console.log(requestBody);

    try {
      const response = await axios.post(apiSubmit, requestBody, { headers });
      fetchTableData();
      console.log(response.data);

      await Swal.fire({
        icon: "success",
        title: "Submit Sukses",
        text: response.data,
        customClass: {
          container: "z-30",
        },
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error(error);

      await Swal.fire({
        icon: "error",
        title: "Submit Gagal",
        text: "Terjadi kesalahan saat memproses permintaan Anda.",
        customClass: {
          container: "z-30",
        },
      });
    }
  };

  useEffect(() => {
    const apiUrl = `${ip}/api/reimburst/get/self`;
    const headers = {
      Authorization: localStorage.getItem("accessToken"),
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        const data = response.data;
        console.log(response.data);
        fetchTableData();
        console.log(tableData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Untuk pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Untuk mengganti input pada field form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Untuk membuat responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024); // Adjust the breakpoint as needed
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-primary overflow-y-hidden">
      <NavbarUser />
      {loading ? (
        <div className="w-screen h-screen flex justify-center items-center overflow-x-hidden mx-auto">
          <CircularProgress />
        </div>
      ) : (
        <div className="w-full flex h-fit">
          <div className="h-full w-full mx-auto">
            <div className="flex flex-col justify-between items-center mt-3">
              <div className="w-[90%] mb-4 flex justify-between items-center">
                <Typography variant="h5">Form Reimburse</Typography>
              </div>
              <form
                onSubmit={handleSubmit}
                className="w-[90%] h-8/12 rounded-md bg-card p-5"
              >
                <Grid container spacing={2}>
                  {/* Keterangan */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="keterangan"
                      label="Keterangan"
                      size="small"
                      variant="outlined"
                      fullWidth
                      className="mb-2"
                      value={formData.keterangan}
                      onChange={handleInputChange}
                    />
                  </Grid>

                  {/* Biaya */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="biaya"
                      label="Biaya"
                      size="small"
                      variant="outlined"
                      fullWidth
                      className="mb-2"
                      value={formData.biaya}
                      onChange={handleBiayaChange}
                    />
                  </Grid>

                  {/* Tanggal */}
                  <Grid item xs={12} sm={6}>
                    <div className="mb-2">
                      <TextField
                        name="tanggal"
                        label="Tanggal"
                        type="date"
                        size="small"
                        variant="outlined"
                        fullWidth
                        value={formData.tanggal}
                        onChange={handleInputChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          placeholder: "",
                        }}
                      />
                    </div>
                  </Grid>

                  {/* Image */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" className="text-left">
                      Upload File
                    </Typography>
                    <div {...getRootProps()} className="mb-2">
                      <input {...getInputProps()} />
                      {uploading ? (
                        <div className="flex items-center">
                          <CircularProgress color="primary" size={24} />
                          <p className="ml-2">Uploading...</p>
                        </div>
                      ) : uploadedFile ? (
                        <div className="flex items-center">
                          <CheckCircleIcon color="primary" />
                          <p className="ml-2">
                            Upload successful: {uploadedFile.name}
                          </p>
                        </div>
                      ) : (
                        <Button
                          size="small"
                          variant="outlined"
                          color="secondary"
                        >
                          <Typography variant="body2">
                            Drop file here
                          </Typography>
                        </Button>
                      )}
                    </div>
                  </Grid>
                </Grid>
                <div className="mt-5">
                  <Button
                    type="submit"
                    size="small"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={!isFormValid}
                  >
                    Submit
                  </Button>
                </div>
              </form>

              {!isMobile && (
                <div className="w-screen">
                  <div className="w-[90%] flex flex-col justify-center items-center mx-auto mt-3 rounded-md bg-card p-5">
                    <div className="w-full">
                      <div className="flex justify-between">
                        <Typography variant="h6" id="history-modal-title">
                          History Table
                        </Typography>
                        <div className="mt-1">
                          <Typography
                            variant="h7"
                            id="history-modal-title"
                          ></Typography>
                        </div>
                      </div>
                      <TableContainer
                        className="rounded-md max-h-56 overflow-y-auto"
                        component={Paper}
                      >
                        <Table size="small">
                          <TableHead style={{ backgroundColor: "#204684" }}>
                            <TableRow>
                              <TableCell className="w-[30%]">
                                <Typography
                                  className="font-semibold text-white text-center"
                                  style={{ fontWeight: "bold" }}
                                  variant="body2"
                                >
                                  Keterangan
                                </Typography>
                              </TableCell>
                              <TableCell className="w-[10%]">
                                <Typography
                                  className="font-semibold text-white text-center"
                                  style={{ fontWeight: "bold" }}
                                  variant="body2"
                                >
                                  Biaya
                                </Typography>
                              </TableCell>
                              <TableCell className="w-[10%]">
                                <Typography
                                  className="font-semibold text-white text-center"
                                  style={{ fontWeight: "bold" }}
                                  variant="body2"
                                >
                                  Tanggal
                                </Typography>
                              </TableCell>
                              <TableCell className="w-[10%]">
                                <Typography
                                  className="font-semibold text-white text-center"
                                  style={{ fontWeight: "bold" }}
                                  variant="body2"
                                >
                                  Bukti
                                </Typography>
                              </TableCell>
                              <TableCell className="w-[10%]">
                                <Typography
                                  className="font-semibold text-white text-center"
                                  style={{ fontWeight: "bold" }}
                                  variant="body2"
                                >
                                  Status
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {tableData
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((row, index) => (
                                <TableRow key={index}>
                                  <TableCell className="w-1/5">
                                    <Typography
                                      className="text-center"
                                      variant="body2"
                                    >
                                      {row.keterangan}
                                    </Typography>
                                  </TableCell>
                                  <TableCell className="w-1/5">
                                    <Typography
                                      className="text-center"
                                      variant="body2"
                                    >
                                      {row.biaya}
                                    </Typography>
                                  </TableCell>
                                  <TableCell className="w-1/5">
                                    <Typography
                                      className="text-center"
                                      variant="body2"
                                    >
                                      {row.date}
                                    </Typography>
                                  </TableCell>
                                  <TableCell className="text-center w-1/5 flex justify-center mx-auto">
                                    <div className="flex justify-center">
                                      <a
                                        href={row.dokumen}
                                        target="_blank "
                                        download
                                        className="cursor-pointer"
                                      >
                                        <DownloadIcon />
                                      </a>
                                    </div>
                                  </TableCell>
                                  <TableCell className="w-1/5">
                                    <Typography
                                      className="text-center"
                                      variant="body2"
                                      style={{
                                        color:
                                          row.progress === "sudah ditransfer"
                                            ? "#22c55e"
                                            : row.progress === "rejected"
                                            ? "#ef4444"
                                            : "grey",
                                      }}
                                    >
                                      {row.progress.charAt(0).toUpperCase() +
                                        row.progress.slice(1)}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </div>
                </div>
              )}
              {!isMobile && (
                <div className="flex w-11/12 items-end justify-end">
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    variant="body2"
                    component="div"
                    count={tableData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </div>
              )}
              <Dialog
                open={Boolean(selectedImage)}
                onClose={() => setSelectedImage(null)}
                maxWidth="lg"
              >
                <DialogContent>
                  <img
                    src={selectedImage}
                    alt="Selected"
                    style={{ maxWidth: "100%", maxHeight: "80vh" }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormReimburst;
