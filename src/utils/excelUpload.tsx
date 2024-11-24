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

      const worksheet = workbook.getWorksheet(1); // İlk sayfayı al
      const rows = [];
      worksheet?.eachRow((row, rowNumber) => {
        rows.push(row.values); // Satırdaki tüm hücre değerlerini al
      });

      const formattedData: any[] = rows?.map((row: any) => {
        return {
          athleteName: row[1],
          athleteBirthDate: row[2],
          speedRun: row[3],
          secondSpeedRun: row[4],
          agilityRun: row[5],
          flexibility: row[6],
          height: row[7],
          weight: row[8],
          jumping: row[9],
        };
      });

      setData(formattedData);
    };

    reader.readAsArrayBuffer(file);
  };

  console.log("data", JSON.stringify(data, null, 2));

  return {
    handleFileUpload,
  };
};
