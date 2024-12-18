import { useMany } from "@refinedev/core";
import { EditButton, List, useDataGrid } from "@refinedev/mui";
import React, { useEffect, useRef, useState } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { IAthlete } from "../../interfaces";
import { useExcelUpload } from "../../utils/excelUpload";
import Report from "../report/Report";
import * as XLSX from "xlsx";

export const AthleteList: React.FC = () => {
  const { dataGridProps } = useDataGrid<IAthlete>();
  const { handleFileUpload, data } = useExcelUpload();
  const [updatedExcelData, setUpdatedExcelData] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState<IAthlete | null>(null); // Karnesi çıkartılacak sporcu

  const fixPercentage = (value: number) => {
    return value.toFixed(2);
  };

  const exportToExcel = () => {
    const formattedData = updatedExcelData.map((athlete: IAthlete) => ({
      // "Sporcu ID": athlete.id,
      "Adı Soyadı": athlete.athleteName,
      "Doğum Tarihi": athlete.athleteBirthDate,
      Boy: athlete.height,
      Kilo: athlete.weight,
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
        valueFormatter: ({ value }) => `${value.toFixed(2)}%`,
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

  const calculatePerformanceScores = (data: IAthlete[]) => {
    const normalize = (
      value: number,
      min: number,
      max: number,
      reverse: boolean = false
    ) => {
      if (value === undefined || min === undefined || max === undefined) {
        console.error("Normalize error: undefined value found", {
          value,
          min,
          max,
        });
        return 0;
      }
      if (max === min) return 0.5;
      const normalized = (value - min) / (max - min);
      return reverse ? 1 - normalized : normalized;
    };

    const validValues = (data: number[]) =>
      data.filter((v) => v !== null && v !== undefined);

    const minMaxValues = {
      height: {
        min: Math.min(...validValues(data.map((d) => d.height))),
        max: Math.max(...validValues(data.map((d) => d.height))),
      },
      weight: {
        min: Math.min(...validValues(data.map((d) => d.weight))),
        max: Math.max(...validValues(data.map((d) => d.weight))),
      },
      flexibility: {
        min: Math.min(...validValues(data.map((d) => d.flexibility))),
        max: Math.max(...validValues(data.map((d) => d.flexibility))),
      },
      speedRun: {
        min: Math.min(...validValues(data.map((d) => d.speedRun))),
        max: Math.max(...validValues(data.map((d) => d.speedRun))),
      },
      secondSpeedRun: {
        min: Math.min(...validValues(data.map((d) => d.secondSpeedRun))),
        max: Math.max(...validValues(data.map((d) => d.secondSpeedRun))),
      },
      agilityRun: {
        min: Math.min(...validValues(data.map((d) => d.agilityRun))),
        max: Math.max(...validValues(data.map((d) => d.agilityRun))),
      },
      jumping: {
        min: Math.min(...validValues(data.map((d) => d.jumping))),
        max: Math.max(...validValues(data.map((d) => d.jumping))),
      },
    };

    const weights = {
      height: 0.1,
      weight: 0.1,
      flexibility: 0.15,
      speedRun: 0.2,
      secondSpeedRun: 0.2,
      agilityRun: 0.2,
      jumping: 0.15,
    };

    const scoredData = data.map((athlete) => {
      const score =
        normalize(
          athlete.height,
          minMaxValues.height.min,
          minMaxValues.height.max
        ) *
          weights.height +
        normalize(
          athlete.weight,
          minMaxValues.weight.min,
          minMaxValues.weight.max
        ) *
          weights.weight +
        normalize(
          athlete.flexibility,
          minMaxValues.flexibility.min,
          minMaxValues.flexibility.max
        ) *
          weights.flexibility +
        normalize(
          athlete.speedRun,
          minMaxValues.speedRun.min,
          minMaxValues.speedRun.max,
          true
        ) *
          weights.speedRun +
        normalize(
          athlete.secondSpeedRun,
          minMaxValues.secondSpeedRun.min,
          minMaxValues.secondSpeedRun.max,
          true
        ) *
          weights.secondSpeedRun +
        normalize(
          athlete.agilityRun,
          minMaxValues.agilityRun.min,
          minMaxValues.agilityRun.max,
          true
        ) *
          weights.agilityRun +
        normalize(
          athlete.jumping,
          minMaxValues.jumping.min,
          minMaxValues.jumping.max
        ) *
          weights.jumping;

      console.log("user score", score);

      return { ...athlete, score };
    });

    const sortedData = scoredData.sort((a, b) => b.score - a.score);

    const totalAthletes = sortedData.length;
    const rankedData = sortedData.map((athlete, index) => ({
      ...athlete,
      percentile: ((index + 1) / totalAthletes) * 100,
    }));

    return rankedData;
  };

  const uploadExcel = async (event: any) => {
    await handleFileUpload(event);
  };

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
      const rankedAthletes = calculatePerformanceScores(updatedData);

      console.log("rankedAthletes", rankedAthletes);
      setUpdatedExcelData(rankedAthletes);
    }
  }, [data]);

  return (
    <List>
      <h1>Excel Yükleyici</h1>
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
