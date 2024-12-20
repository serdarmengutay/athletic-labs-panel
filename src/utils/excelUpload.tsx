import { useState } from "react";
import ExcelJS from "exceljs";

export const useExcelUpload = () => {
  const [data, setData] = useState([]);

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const workbook = new ExcelJS.Workbook();
    const reader = new FileReader();

    reader.onload = async (e: any) => {
      const buffer = e.target.result;
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.getWorksheet(1);
      const rows = [];
      worksheet?.eachRow((row, rowNumber) => {
        rows.push(row.values);
      });

      const formattedData: any[] = rows?.map((row: any) => {
        return {
          athleteName: row[1],
          athleteBirthDate: row[2],
          height: row[3],
          weight: row[4],
          flexibility: row[5],
          speedRun: row[6],
          secondSpeedRun: row[7],
          agilityRun: row[8],
          jumping: row[9],
        };
      });

      setData(formattedData);
    };

    reader.readAsArrayBuffer(file);
  };

  return {
    handleFileUpload,
    data,
  };
};
