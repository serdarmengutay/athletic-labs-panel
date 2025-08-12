import { List, useDataGrid } from "@refinedev/mui";
import React, { useEffect, useState } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { IAthlete } from "../../interfaces";
import { useExcelUpload } from "../../utils/excelUpload";
import Report from "../report/Report";
import { calculatePerformanceScoresWithPercentiles } from "../../utils/calculatePerformanceScores";
import * as XLSX from "xlsx";

export const AthleteList: React.FC = () => {
  const { dataGridProps } = useDataGrid<IAthlete>();
  const { handleFileUpload, data } = useExcelUpload();
  const [updatedExcelData, setUpdatedExcelData] = useState<IAthlete[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<IAthlete | null>(null); // Karnesi çıkartılacak sporcu

  const uploadExcel = async (event: any) => {
    await handleFileUpload(event);
  };

  const columns = React.useMemo<GridColDef<IAthlete>[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        type: "number",
        width: 50,
      },
      {
        field: "athleteName",
        headerName: "Adı Soyadı",
        minWidth: 200,
        headerAlign: "center",
        align: "center",
        type: "string",
      },
      {
        field: "athleteBirthDate",
        headerName: "Doğum Tarihi",
        align: "center",
        width: 100,
      },
      {
        field: "height",
        headerName: "Boy",
        type: "number",
        width: 80,
      },
      {
        field: "weight",
        headerName: "Kilo",
        type: "number",
        width: 80,
      },
      {
        field: "bmi",
        headerName: "VKİ",
        type: "number",
        width: 80,
        valueGetter: (params) => {
          const row = params.row;
          if (!row.height || !row.weight) {
            return "EKSİK VERİ";
          }
          return row.bmi ? row.bmi.toFixed(1) : "Hesaplanamadı";
        },
        align: "center",
        headerAlign: "center",
      },
      {
        field: "bmiStatus",
        headerName: "VKİ Durumu",
        type: "string",
        width: 100,
        valueGetter: (params) => {
          const row = params.row;
          if (!row.height || !row.weight) {
            return "EKSİK VERİ";
          }
          return row.bmiStatus || "Bilinmiyor";
        },
        align: "center",
        headerAlign: "center",
      },
      {
        field: "flexibility",
        headerName: "Esneklik",
        type: "number",
      },
      {
        field: "speedRun",
        headerName: "30 Metre",
        type: "number",
      },
      {
        field: "secondSpeedRun",
        headerName: "İkinci 30 Metre",
        type: "number",
      },
      {
        field: "agilityRun",
        headerName: "Çeviklik Koşusu",
        type: "number",
      },
      {
        field: "jumping",
        headerName: "Dikey Sıçrama",
        type: "number",
        align: "center",
      },
      {
        field: "percentile",
        headerName: "Yüzdelik Dilim",
        type: "number",
        valueFormatter: ({ value }) => `${value?.toFixed(2)}%`,
        align: "center",
        headerAlign: "center",
        width: 120,
      },
      {
        field: "actions",
        headerName: "Karne",
        flex: 1,
        renderCell: function render({ row }) {
          return (
            <button
              onClick={() => setSelectedAthlete(row)}
              style={{
                padding: "5px 10px",
                backgroundColor: "#FFCA26",
                color: "black",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Karne Çıkar
            </button>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 120,
      },
    ],
    []
  );

  useEffect(() => {
    if (data.length === 0) return;
    const athletes = localStorage.getItem("athletes");
    const athletesData = JSON.parse(athletes || "[]");
    if (athletesData.length > 0) {
      localStorage.setItem("athletes", JSON.stringify(data));
      return;
    }
    localStorage.setItem("athletes", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const filteredData = data
        .slice(1)
        .filter(
          (item: IAthlete) =>
            item.height !== null &&
            item.height !== undefined &&
            item.weight !== null &&
            item.weight !== undefined &&
            item.flexibility !== null &&
            item.flexibility !== undefined &&
            item.speedRun !== null &&
            item.speedRun !== undefined &&
            item.secondSpeedRun !== null &&
            item.secondSpeedRun !== undefined &&
            item.agilityRun !== null &&
            item.agilityRun !== undefined &&
            item.jumping !== null &&
            item.jumping !== undefined
        );

      const updatedData = filteredData.map((item: any, index) => ({
        ...item,
        id: item?.id || index + 1,
      }));

      console.log("updatedData", JSON.stringify(updatedData, null, 2));

      const athletesData =
        calculatePerformanceScoresWithPercentiles(updatedData);

      const sortedAthletes = athletesData.sort(
        (a: any, b: any) => a.percentile - b.percentile
      );

      // console.log("rankedAthletes", rankedAthletes);
      setUpdatedExcelData(sortedAthletes);
    }
  }, [data]);

  const fixPercentage = (value: number | undefined) => {
    return value ? value.toFixed(2) : "0.00";
  };

  const exportToExcel = () => {
    const formattedData = updatedExcelData.map((athlete: IAthlete) => ({
      // "Sporcu ID": athlete.id,
      "Adı Soyadı": athlete.athleteName,
      "Doğum Tarihi": athlete.athleteBirthDate,
      Boy: athlete.height,
      Kilo: athlete.weight,
      "Vücut Kitle Endeksi": athlete.bmi || "EKSİK VERİ",
      "VKİ Durumu": athlete.bmiStatus || "EKSİK VERİ",
      Esneklik: athlete.flexibility,
      "30 Metre Koşusu": athlete.speedRun,
      "İkinci 30 Metre": athlete.secondSpeedRun,
      "Çeviklik Koşusu": athlete.agilityRun,
      "Dikey Sıçrama": athlete.jumping,
      "Yüzdelik Dilim": fixPercentage(athlete.percentile),
    }));
    const ws = XLSX.utils.json_to_sheet(formattedData);
    ws["!cols"] = [
      { width: 25 },
      { width: 10 },
      { width: 10 },
      { width: 10 },
      { width: 15 },
      { width: 15 },
      { width: 10 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sporcu Performans Raporu");
    XLSX.writeFile(wb, "athlete-performance-report.xlsx");
  };
  return (
    <List>
      <h1>Excel Yükle</h1>
      <input type="file" accept=".xlsx, .xls" onChange={uploadExcel} />
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        rows={updatedExcelData}
        getRowId={(row) => row.id}
      />
      {selectedAthlete && (
        <Report
          athlete={selectedAthlete}
          onClose={() => setSelectedAthlete(null)}
        />
      )}
      <button
        onClick={exportToExcel}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          margin: "20px 0",
        }}
      >
        Excel Olarak İndir
      </button>
    </List>
  );
};
