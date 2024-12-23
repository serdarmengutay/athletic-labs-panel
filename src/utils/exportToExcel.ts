import { IAthlete } from "../interfaces";
import * as XLSX from "xlsx";

const fixPercentage = (value: number) => {
  return value.toFixed(2);
};

export const exportToExcel = (excelData: any) => {
  const formattedData = excelData.map((athlete: any) => ({
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
    "30 Metre Sürat Yüzdelik Dilimi": fixPercentage(
      athlete.performanceDetails.speedRun
    ),
    "İkinci 30 Metre Sürat Yüzdelik Dilimi": fixPercentage(
      athlete.secondSpeedRun.secondSpeedRun
    ),
    "Çeviklik Yüzdelik Dilimi": fixPercentage(
      athlete.performanceDetails.agilityRun
    ),
    "Dikey Sıçrama Yüzdelik Dilimi": fixPercentage(
      athlete.performanceDetails.jumping
    ),
    "Esneklik Yüzdelik Dilimi": fixPercentage(
      athlete.performanceDetails.flexibility
    ),
    "Genel Yüzdelik Dilim": fixPercentage(athlete.percentile),
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
