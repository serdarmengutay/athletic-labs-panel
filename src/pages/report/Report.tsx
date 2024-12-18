import React, { useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { Divider } from "@mui/material";
import "./ReportCardStyle.css";
import logo from "../../assets/images/başaksporlogo.png";

interface ReportProps {
  athlete: {
    id: number;
    athleteName: string;
    athleteBirthDate: string;
    // club: string;
    // clubLogo: string;
    height: number;
    weight: number;
    speedRun: number;
    secondSpeedRun: number;
    agilityRun: number;
    flexibility: number;
    jumping: number;
    percentile: number;
  };
  onClose: () => void;
}

const Report: React.FC<ReportProps> = ({ athlete, onClose }) => {
  const reportCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (athlete) {
      downloadAsJPG();
    }
  }, [athlete]);

  const downloadAsJPG = () => {
    if (reportCardRef.current) {
      html2canvas(reportCardRef.current, { scale: 2 }).then((canvas) => {
        const link = document.createElement("a");
        link.download = `${athlete.athleteName}_karne.jpg`;
        link.href = canvas.toDataURL("image/jpeg", 1.0);
        link.click();
      });
    }
  };

  return (
    <div style={{}}>
      <div className="reportCard" ref={reportCardRef}>
        <header className="header">
          <div>
            <h1>Athletic Labs</h1>
          </div>
          <Divider
            orientation="vertical"
            flexItem
            color="#333"
            sx={{ opacity: 0.6 }}
          />
          <div className="headerRight">
            <img src={logo} alt="Kulüp Logosu" className="clubLogo" />
            <div>
              <h1>KÜÇÜKBALIKLI BAŞAKSPOR</h1>
              <p>İsim: {athlete.athleteName}</p>
              <p>Doğum Yılı: {athlete.athleteBirthDate}</p>
            </div>
          </div>
        </header>
        <table className="statsTable">
          <tbody>
            <tr>
              <th>Boy</th>
              <td>{athlete.height} cm</td>
            </tr>
            <tr>
              <th>Kilo</th>
              <td>{athlete.weight} kg</td>
            </tr>
            <tr>
              <th>Esneklik</th>
              <td>{athlete.flexibility} cm</td>
            </tr>
            <tr>
              <th>30 Metre Koşu</th>
              <td>{athlete.speedRun} sn</td>
            </tr>
            <tr>
              <th>İkinci 30 Metre Koşu</th>
              <td>{athlete.secondSpeedRun} sn</td>
            </tr>
            <tr>
              <th>Çeviklik</th>
              <td>{athlete.agilityRun} sn</td>
            </tr>
            <tr>
              <th>Dikey Sıçrama</th>
              <td>{athlete.jumping} cm</td>
            </tr>
            <tr>
              <th>Yüzdelik Dilim</th>
              <td>%{athlete.percentile.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;
