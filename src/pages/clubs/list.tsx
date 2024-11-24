import { useMany } from "@refinedev/core";
import { EditButton, List, useDataGrid } from "@refinedev/mui";
import React from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { IClub } from "../../interfaces";

export const ClubList: React.FC = () => {
  const { dataGridProps } = useDataGrid<IClub>();

  const columns = React.useMemo<GridColDef<IClub>[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        type: "number",
      },
      {
        field: "clubName",
        headerName: "Kulüp Adı",
        flex: 1,
      },
      {
        field: "clubLogo",
        headerName: "Kulüp Logosu",
        flex: 1,
      },
      {
        field: "clubTheme1",
        headerName: "Kulüp Tema 1",
        flex: 1,
      },
      {
        field: "clubTheme2",
        headerName: "Kulüp Tema 2",
        flex: 1,
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
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
};
