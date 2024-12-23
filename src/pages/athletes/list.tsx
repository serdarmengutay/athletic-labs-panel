import { List, useDataGrid } from "@refinedev/mui";
import React, { useEffect, useState } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { IAthlete } from "../../interfaces";
import { useExcelUpload } from "../../utils/excelUpload";
import Report from "../report/Report";
import { calculatePerformanceScoresWithPercentiles } from "../../utils/calculatePerformanceScores";
import { exportToExcel } from "../../utils/exportToExcel";

export const AthleteList: React.FC = () => {
  const { dataGridProps } = useDataGrid<IAthlete>();
  const { handleFileUpload, data } = useExcelUpload();
  const [updatedExcelData, setUpdatedExcelData] = useState([]);
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

      const updatedData = filteredData.map((item, index) => ({
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
      {selectedAthlete && <Report athlete={selectedAthlete} />}
      <button
        onClick={() => exportToExcel(updatedExcelData)}
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
