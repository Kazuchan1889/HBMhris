import React, { useState, useEffect } from "react";
import NavbarUser from "../feature/NavbarUser";
import ChartDataKehadiranUser from "../feature/ChartDataKehadiranUser";
import axios from "axios";
import ip from "../ip";
import LaporanKegiatanDashboard from "../minicomponent/LaporanKegiatanDashboard";
import CheckinDashboard from "../minicomponent/CheckinDashboard";

import StatusApproval from "./StatusApproval";
import ProfileDashboard from "../minicomponent/ProfileDashboard";

function DashboardUser() {
  const [nama, setNama] = useState("");
  const [dokumen, setDokumen] = useState(null);
  const [masuk, setMasuk] = useState("");
  const [keluar, setKeluar] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [uploading, setUploading] = useState(false);

  const [checkInStatus, setCheckInStatus] = useState(
    localStorage.getItem("result")
  );
  const [chekOut, setCheckOut] = useState(null);

  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  let cutimandiri = "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${ip}/api/karyawan/get/data/self`;
        const headers = {
          Authorization: localStorage.getItem("accessToken"),
        };

        const response = await axios.get(apiUrl, { headers });
        setNama(response.data[0].nama);
        cutimandiri = response.data[0].cutimandiri;
        localStorage.setItem("cutimandiri", cutimandiri);
        setDokumen(response.data[0].dokumen);
        setLoading(false);

        const localStorageStatus = localStorage.getItem("result");
        if (localStorageStatus) {
          setCheckInStatus(localStorageStatus);
        }
      } catch (error) {
        console.error("Error", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    <div
      className="w-full h-fit lg:h-screen xl:overflow-y-hidden"
      style={{ backgroundColor: "#F0F0F0" }}
    >
      <NavbarUser />
      <div className="flex h-fit">
        <div className="h-full w-[90%] flex flex-col justify-center items-center mx-auto">
          <div className="h-[40rem]lg:h-[17rem] w-full flex flex-col lg:flex-row justify-between items center">
            <div className="flex justify-between items-center drop-shadow-lg bg-home px-5 lg:px-10 py-10 my-5 rounded-md w-[100%] lg:w-[35%]">
              <ProfileDashboard />
            </div>
            <div className="flex justify-between items-center drop-shadow-lg bg-white px-5 lg:px-0 my-5 rounded-md w-[100%] lg:w-[34%] h-[13rem]">
              <StatusApproval />
            </div>
            <div className="flex flex-col items-center drop-shadow-lg bg-white px-5 lg:px-10  my-5 rounded-md w-[100%] lg:w-[30%] h-[13rem]">
              <CheckinDashboard />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-between items-center w-full h-fit lg:h-1/2">
            {!isMobile && (
              <div className="w-[30%] h-[23rem] lg:m-0 drop-shadow-lg bg-white p-10 rounded-xl border">
                <div className="flex items-center justify-center h-full my-8">
                  <ChartDataKehadiranUser />
                </div>
              </div>
            )}
            <div className="w-[100%] lg:w-[69.5%] h-[39rem] lg:h-[23rem] lg:m-0 drop-shadow-lg bg-white p-10 rounded-xl border mb-3">
              <LaporanKegiatanDashboard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardUser;
