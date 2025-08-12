import React, { useRef, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import { Divider, Box, Typography, Grid, Paper } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Radar, Bar } from "react-chartjs-2";
import {
  User,
  Calendar,
  Ruler,
  Weight,
  Activity,
  Zap,
  Timer,
  Target,
  TrendingUp,
  Trophy,
  BarChart3,
  PieChart,
} from "lucide-react";
import "./ReportCardStyle.css";
import logo from "../../assets/images/athleticlabs_logo.png";
import { getAgeGroupAverages } from "../../utils/calculatePerformanceScores";

// Chart.js kayıt
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
  BarElement
);

interface ReportProps {
  athlete: {
    id: number;
    athleteName: string;
    athleteBirthDate: string;
    height: number;
    weight: number;
    speedRun: number;
    secondSpeedRun: number;
    agilityRun: number;
    flexibility: number;
    jumping: number;
    percentile?: number;
    bmi?: number;
    bmiStatus?: string;
    performanceDetails?: {
      speedRun: number;
      secondSpeedRun: number;
      agilityRun: number;
      flexibility: number;
      jumping: number;
    };
  };
  onClose: () => void;
}

const Report: React.FC<ReportProps> = ({ athlete }) => {
  const reportCardRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (athlete) {
      // Grafiklerin render olması için kısa bir gecikme
      setTimeout(() => {
        downloadAsJPG();
      }, 1000);
    }
  }, [athlete]);

  const downloadAsJPG = async () => {
    if (reportCardRef.current) {
      setIsLoading(true);
      try {
        const canvas = await html2canvas(reportCardRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#070e0e",
        });

        const link = document.createElement("a");
        link.download = `${athlete.athleteName}_karne.png`;
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
      } catch (error) {
        console.error("PNG export hatası:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Yaş grubu ortalamalarını al
  const ageGroupAverages = getAgeGroupAverages(athlete.athleteBirthDate);

  // Radar grafik verisi - 6 parametre için
  const radarData = {
    labels: [
      "BMI",
      "Esneklik",
      "30m Koşu",
      "İkinci 30m",
      "Çeviklik",
      "Dikey Sıçrama",
    ],
    datasets: [
      {
        label: "Sporcu",
        data: [
          athlete.bmi || 0,
          athlete.flexibility || 0,
          athlete.speedRun || 0,
          athlete.secondSpeedRun || 0,
          athlete.agilityRun || 0,
          athlete.jumping || 0,
        ],
        backgroundColor: "rgba(228, 252, 85, 0.2)",
        borderColor: "#e4fc55",
        borderWidth: 3,
        pointBackgroundColor: "#e4fc55",
        pointBorderColor: "#070e0e",
        pointHoverBackgroundColor: "#070e0e",
        pointHoverBorderColor: "#e4fc55",
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: "Yaş Grubu Ortalaması",
        data: [
          ageGroupAverages?.weight
            ? (ageGroupAverages.weight + ageGroupAverages.height / 100) / 2
            : 0,
          ageGroupAverages?.flexibility || 0,
          ageGroupAverages?.speedRun || 0,
          ageGroupAverages?.speedRun || 0, // İkinci koşu için aynı ortalama
          ageGroupAverages?.agilityRun || 0,
          ageGroupAverages?.jumping || 0,
        ],
        backgroundColor: "rgba(111, 111, 115, 0.2)",
        borderColor: "#6f6f73",
        borderWidth: 3,
        pointBackgroundColor: "#6f6f73",
        pointBorderColor: "#070e0e",
        pointHoverBackgroundColor: "#070e0e",
        pointHoverBorderColor: "#6f6f73",
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  // Sütun grafik verisi - 6 parametre için
  const barData = {
    labels: [
      "BMI",
      "Esneklik",
      "30m Koşu",
      "İkinci 30m",
      "Çeviklik",
      "Dikey Sıçrama",
    ],
    datasets: [
      {
        label: "Sporcu",
        data: [
          athlete.bmi || 0,
          athlete.flexibility || 0,
          athlete.speedRun || 0,
          athlete.secondSpeedRun || 0,
          athlete.agilityRun || 0,
          athlete.jumping || 0,
        ],
        backgroundColor: "rgba(228, 252, 85, 0.8)",
        borderColor: "#e4fc55",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: "Yaş Grubu Ortalaması",
        data: [
          ageGroupAverages?.weight
            ? (ageGroupAverages.weight + ageGroupAverages.height / 100) / 2
            : 0,
          ageGroupAverages?.flexibility || 0,
          ageGroupAverages?.speedRun || 0,
          ageGroupAverages?.speedRun || 0,
          ageGroupAverages?.agilityRun || 0,
          ageGroupAverages?.jumping || 0,
        ],
        backgroundColor: "rgba(111, 111, 115, 0.8)",
        borderColor: "#6f6f73",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Radar grafik seçenekleri
  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#ffffff",
          font: {
            size: 12,
            weight: "bold" as const,
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(7, 14, 14, 0.95)",
        titleColor: "#e4fc55",
        bodyColor: "#ffffff",
        borderColor: "#e4fc55",
        borderWidth: 2,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        grid: {
          color: "rgba(111, 111, 115, 0.3)",
          lineWidth: 1,
        },
        angleLines: {
          color: "rgba(111, 111, 115, 0.3)",
          lineWidth: 1,
        },
        pointLabels: {
          color: "#ffffff",
          font: {
            size: 11,
            weight: "bold" as const,
          },
        },
        ticks: {
          color: "#6f6f73",
          backdropColor: "transparent",
          font: {
            size: 10,
          },
        },
        backgroundColor: "rgba(7, 14, 14, 0.1)",
      },
    },
  };

  // Sütun grafik seçenekleri
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#ffffff",
          font: {
            size: 12,
            weight: "bold" as const,
          },
          usePointStyle: true,
          pointStyle: "rect",
        },
      },
      tooltip: {
        backgroundColor: "rgba(7, 14, 14, 0.95)",
        titleColor: "#e4fc55",
        bodyColor: "#ffffff",
        borderColor: "#e4fc55",
        borderWidth: 2,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(111, 111, 115, 0.3)",
          lineWidth: 1,
        },
        ticks: {
          color: "#6f6f73",
          font: {
            size: 10,
          },
        },
        backgroundColor: "rgba(7, 14, 14, 0.1)",
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6f6f73",
          maxRotation: 45,
          font: {
            size: 10,
          },
        },
        backgroundColor: "rgba(7, 14, 14, 0.1)",
      },
    },
  };

  // BMI hesaplama
  const getBMIDisplay = () => {
    if (!athlete.height || !athlete.weight) {
      return "EKSİK VERİDEN DOLAYI HESAPLANAMADI";
    }
    return `${athlete.bmi || "Hesaplanamadı"} (${
      athlete.bmiStatus || "Bilinmiyor"
    })`;
  };

  return (
    <div className="reportCard landscape" ref={reportCardRef}>
      {/* Header - Neon Yeşil */}
      <header className="header neon-green">
        <div className="logoSection">
          <img src={logo} alt="Athletic Labs Logo" className="orgLogo" />
          <div className="logoText">
            <Typography variant="h6" className="logoTitle">
              ATHLETICLABS
            </Typography>
            <Typography variant="caption" className="logoSubtitle">
              SPORCU PERFORMANS ANALİZ SİSTEMİ
            </Typography>
          </div>
        </div>
        <Divider
          orientation="vertical"
          flexItem
          sx={{ opacity: 0.3, backgroundColor: "white" }}
        />
        <div className="headerRight">
          <Typography variant="h4" className="mainTitle">
            ATHLETIC LABS TEST VERİLERİ
          </Typography>
          <div className="athleteInfo">
            <Typography variant="h6">
              <User
                size={20}
                style={{ marginRight: 8, verticalAlign: "middle" }}
              />
              {athlete.athleteName}
            </Typography>
            <Typography variant="h6">
              <Calendar
                size={20}
                style={{ marginRight: 8, verticalAlign: "middle" }}
              />
              {athlete.athleteBirthDate}
            </Typography>
          </div>
        </div>
      </header>

      <Box sx={{ p: 3, backgroundColor: "#070e0e" }}>
        {/* Ana İçerik */}
        <div className="mainContent">
          <Grid container spacing={3}>
            {/* Sol Taraf - Metrikler */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              {/* Fiziksel Ölçümler */}
              <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom className="sectionTitle">
                  <Ruler size={24} style={{ marginRight: 8 }} />
                  FİZİKSEL ÖLÇÜMLER
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <Box className="metricRow">
                    <Typography variant="body2" className="metricLabel">
                      <Ruler
                        size={16}
                        style={{ marginRight: 6, verticalAlign: "middle" }}
                      />
                      Boy:
                    </Typography>
                    <Typography variant="h6" className="metricValue">
                      {athlete.height} cm
                    </Typography>
                  </Box>
                  <Box className="metricRow">
                    <Typography variant="body2" className="metricLabel">
                      <Weight
                        size={16}
                        style={{ marginRight: 6, verticalAlign: "middle" }}
                      />
                      Kilo:
                    </Typography>
                    <Typography variant="h6" className="metricValue">
                      {athlete.weight} kg
                    </Typography>
                  </Box>
                  <Box className="metricRow">
                    <Typography variant="body2" className="metricLabel">
                      <Activity
                        size={16}
                        style={{ marginRight: 6, verticalAlign: "middle" }}
                      />
                      VKİ:
                    </Typography>
                    <Typography
                      variant="h6"
                      className="metricValue bmiValue"
                      color={
                        !athlete.height || !athlete.weight
                          ? "error.main"
                          : "primary.main"
                      }
                    >
                      {getBMIDisplay()}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Performans Testleri */}
              <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom className="sectionTitle">
                  <Zap size={24} style={{ marginRight: 8 }} />
                  PERFORMANS TESTLERİ
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <Box className="metricRow">
                    <Typography variant="body2" className="metricLabel">
                      <Timer
                        size={16}
                        style={{ marginRight: 6, verticalAlign: "middle" }}
                      />
                      30m Koşu:
                    </Typography>
                    <Typography variant="h6" className="metricValue">
                      {athlete.speedRun} s
                    </Typography>
                  </Box>
                  <Box className="metricRow">
                    <Typography variant="body2" className="metricLabel">
                      <Timer
                        size={16}
                        style={{ marginRight: 6, verticalAlign: "middle" }}
                      />
                      İkinci 30m:
                    </Typography>
                    <Typography variant="h6" className="metricValue">
                      {athlete.secondSpeedRun} s
                    </Typography>
                  </Box>
                  <Box className="metricRow">
                    <Typography variant="body2" className="metricLabel">
                      <Target
                        size={16}
                        style={{ marginRight: 6, verticalAlign: "middle" }}
                      />
                      Çeviklik:
                    </Typography>
                    <Typography variant="h6" className="metricValue">
                      {athlete.agilityRun} s
                    </Typography>
                  </Box>
                  <Box className="metricRow">
                    <Typography variant="body2" className="metricLabel">
                      <TrendingUp
                        size={16}
                        style={{ marginRight: 6, verticalAlign: "middle" }}
                      />
                      Esneklik:
                    </Typography>
                    <Typography variant="h6" className="metricValue">
                      {athlete.flexibility} cm
                    </Typography>
                  </Box>
                  <Box className="metricRow">
                    <Typography variant="body2" className="metricLabel">
                      <Target
                        size={16}
                        style={{ marginRight: 6, verticalAlign: "middle" }}
                      />
                      Dikey Sıçrama:
                    </Typography>
                    <Typography variant="h6" className="metricValue">
                      {athlete.jumping} cm
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Genel Performans */}
              {athlete.percentile && (
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    className="sectionTitle"
                  >
                    <Trophy size={24} style={{ marginRight: 8 }} />
                    GENEL PERFORMANS
                  </Typography>
                  <Box
                    sx={{
                      textAlign: "center",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h2" className="percentileValue">
                      %{athlete.percentile.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" className="percentileLabel">
                      Yüzdelik Dilim
                    </Typography>
                  </Box>
                </Paper>
              )}
            </Grid>

            {/* Orta - Radar Grafik */}
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom className="sectionTitle">
                  <PieChart size={24} style={{ marginRight: 8 }} />
                  PERFORMANS RADAR GRAFİĞİ
                </Typography>
                <Box sx={{ height: 300, position: "relative" }}>
                  <Radar data={radarData} options={radarOptions} />
                </Box>

                {/* Divider */}
                <Divider sx={{ my: 2, borderColor: "#6f6f73" }} />

                {/* Performans Trend Analizi */}
                <Typography variant="h6" gutterBottom className="sectionTitle">
                  <TrendingUp size={20} style={{ marginRight: 6 }} />
                  PERFORMANS TREND ANALİZİ
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {/* Güçlü Yönler */}
                  <Box className="trendSection">
                    <Typography
                      variant="subtitle2"
                      className="trendTitle positive"
                    >
                      💪 Güçlü Yönler
                    </Typography>
                    <Box className="trendItems">
                      {athlete.speedRun < (ageGroupAverages?.speedRun || 0) && (
                        <Typography
                          variant="caption"
                          className="trendItem positive"
                        >
                          • 30m koşu performansı yaş grubu ortalamasının
                          üzerinde
                        </Typography>
                      )}
                      {athlete.flexibility >
                        (ageGroupAverages?.flexibility || 0) && (
                        <Typography
                          variant="caption"
                          className="trendItem positive"
                        >
                          • Esneklik seviyesi yüksek
                        </Typography>
                      )}
                      {athlete.bmi &&
                        athlete.bmi >= 18.5 &&
                        athlete.bmi <= 25 && (
                          <Typography
                            variant="caption"
                            className="trendItem positive"
                          >
                            • VKİ normal aralıkta
                          </Typography>
                        )}
                      {(!athlete.speedRun ||
                        !athlete.flexibility ||
                        !athlete.bmi) && (
                        <Typography
                          variant="caption"
                          className="trendItem neutral"
                        >
                          • Veri yetersizliği nedeniyle analiz yapılamadı
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Geliştirilmesi Gereken Alanlar */}
                  <Box className="trendSection">
                    <Typography
                      variant="subtitle2"
                      className="trendTitle improvement"
                    >
                      🎯 Geliştirilmesi Gereken Alanlar
                    </Typography>
                    <Box className="trendItems">
                      {athlete.speedRun > (ageGroupAverages?.speedRun || 0) && (
                        <Typography
                          variant="caption"
                          className="trendItem improvement"
                        >
                          • 30m koşu hızı artırılabilir
                        </Typography>
                      )}
                      {athlete.agilityRun >
                        (ageGroupAverages?.agilityRun || 0) && (
                        <Typography
                          variant="caption"
                          className="trendItem improvement"
                        >
                          • Çeviklik koşusu geliştirilebilir
                        </Typography>
                      )}
                      {athlete.jumping < (ageGroupAverages?.jumping || 0) && (
                        <Typography
                          variant="caption"
                          className="trendItem improvement"
                        >
                          • Dikey sıçrama gücü artırılabilir
                        </Typography>
                      )}
                      {athlete.bmi && athlete.bmi < 18.5 && (
                        <Typography
                          variant="caption"
                          className="trendItem improvement"
                        >
                          • Beslenme programı ile kilo artırımı önerilir
                        </Typography>
                      )}
                      {athlete.bmi && athlete.bmi > 25 && (
                        <Typography
                          variant="caption"
                          className="trendItem improvement"
                        >
                          • Kilo kontrolü ve egzersiz programı önerilir
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Sağ - Sütun Grafik */}
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom className="sectionTitle">
                  <BarChart3 size={24} style={{ marginRight: 8 }} />
                  YAŞ GRUBU KARŞILAŞTIRMASI
                </Typography>
                <Box sx={{ height: 300, position: "relative" }}>
                  <Bar data={barData} options={barOptions} />
                </Box>

                {/* Divider */}
                <Divider sx={{ my: 2, borderColor: "#6f6f73" }} />

                {/* Egzersiz Önerileri */}
                <Typography variant="h6" gutterBottom className="sectionTitle">
                  <Target size={20} style={{ marginRight: 6 }} />
                  EGZERSİZ ÖNERİLERİ
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {/* Hedefler */}
                  <Box className="exerciseSection">
                    <Typography variant="subtitle2" className="exerciseTitle">
                      🎯 3 Aylık Hedefler
                    </Typography>
                    <Box className="exerciseItems">
                      <Typography variant="caption" className="exerciseItem">
                        • 30m koşu: {(athlete.speedRun * 0.9).toFixed(2)}s
                        hedefi
                      </Typography>
                      <Typography variant="caption" className="exerciseItem">
                        • Çeviklik: {(athlete.agilityRun * 0.95).toFixed(2)}s
                        hedefi
                      </Typography>
                      <Typography variant="caption" className="exerciseItem">
                        • Dikey sıçrama: {(athlete.jumping * 1.1).toFixed(0)}cm
                        hedefi
                      </Typography>
                      <Typography variant="caption" className="exerciseItem">
                        • Esneklik: {(athlete.flexibility * 1.15).toFixed(0)}cm
                        hedefi
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Box>

      {/* Loading indicator */}
      {isLoading && (
        <Box className="loadingOverlay">
          <Typography variant="h6" color="white">
            PNG hazırlanıyor...
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default Report;
