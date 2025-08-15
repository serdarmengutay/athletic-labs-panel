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

      console.log("rows", JSON.stringify(rows, null, 2));

      const formattedData: any[] = rows?.map((row: any) => {
        return {
          athleteName: row[1],
          athleteBirthDate: row[2],
          height: Number(row[3]) || 0,
          weight: Number(row[4]) || 0,
          flexibility: Number(row[5]) || 0,
          speedRun: Number(row[6]) || 0,
          secondSpeedRun: Number(row[7]) || 0,
          agilityRun: Number(row[8]) || 0,
          jumping: Number(row[9]) || 0,
          ffmi: Number(row[10]) || 0,
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
