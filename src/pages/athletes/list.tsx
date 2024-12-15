import { useMany } from "@refinedev/core";
import { EditButton, List, useDataGrid } from "@refinedev/mui";
import React, { useEffect, useState } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { IAthlete } from "../../interfaces";
import { useExcelUpload } from "../../utils/excelUpload";

export const AthleteList: React.FC = () => {
  const { dataGridProps } = useDataGrid<IAthlete>();
  const { handleFileUpload, data } = useExcelUpload();

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
        field: "jump",
        headerName: "Dikey Sıçrama",
        type: "number",
      },
      {
        field: "flexibility",
        headerName: "Esneklik",
        type: "number",
      },
      {
        field: "height",
        headerName: "Boy",
        type: "number",
      },
      {
        field: "weight",
        headerName: "Kilo",
        type: "number",
      },
      {
        field: "actions",
        headerName: "Düzenle",
        renderCell: function render({ row }) {
          return <EditButton hideText recordItemId={row.id} />;
        },
        align: "center",
        headerAlign: "center",
        minWidth: 80,
      },
    ],
    []
  );

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
      const updatedData = data.map((item, index) => ({
        ...item,
        id: item?.id || index + 1,
      }));
      console.log("Güncellenmiş veri:", updatedData);
    }
  }, [data]);

  // const sendExcel = async () => {
  //   const response = await fetch("http://localhost:5001/api/excel", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(data),
  //   });
  //   console.log(response);
  // };

  const athletes = localStorage.getItem("athletes");
  console.log("athletes from local storage", JSON.parse(athletes || "[]"));

  return (
    <List>
      <h1>Excel Yükleyici</h1>
      <input type="file" accept=".xlsx, .xls" onChange={uploadExcel} />
      {/* <button onClick={sendExcel}>Yükle</button> */}
      <DataGrid {...dataGridProps} columns={columns} autoHeight rows={data} />
    </List>
  );
};
