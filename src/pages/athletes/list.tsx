import { useMany } from "@refinedev/core";
import { EditButton, List, useDataGrid } from "@refinedev/mui";
import React from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { IAthlete } from "../../interfaces";
import { useExcelUpload } from "../../utils/excelUpload";

export const AthleteList: React.FC = () => {
  const { dataGridProps } = useDataGrid<IAthlete>();
  const { handleFileUpload } = useExcelUpload();

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
      // {
      //   field: "category.id",
      //   headerName: "Category",
      //   type: "number",
      //   headerAlign: "left",
      //   align: "left",
      //   minWidth: 250,
      //   flex: 0.5,
      //   renderCell: function render({ row }) {
      //     if (isLoading) {
      //       return "Loading...";
      //     }

      //     const category = categoriesData?.data.find(
      //       (item) => item.id === row.
      //     );
      //     return category?.title;
      //   },
      // },
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

  return (
    <List>
      <h1>Excel Yükleyici</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
};
