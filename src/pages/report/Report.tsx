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
  Gauge,
} from "lucide-react";
import "./ReportCardStyle.css";
import logo from "../../assets/images/athleticlabs_logo.png";
import { getAgeGroupAverages } from "../../utils/calculatePerformanceScores";
import { getEuropeanLeagueAverages } from "../../constants/constants";

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
    ffmi?: number;
    percentile?: number;
    bmi?: number;
    bmiStatus?: string;
    fatigueIndex?: number;
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
        link.download = `${athlete.athleteName}_karne.jpg`;
        link.href = canvas.toDataURL("image/jpeg", 0.9);
        link.click();
      } catch (error) {
        console.error("JPEG export hatası:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Yaş grubu ortalamalarını al
  const ageGroupAverages = getAgeGroupAverages(athlete.athleteBirthDate);

  // Avrupa ligleri karşılaştırma fonksiyonları
  const getEuropeanComparison = (metric: string, athleteValue: number) => {
    const comparisons: Array<{
      country: string;
      average: string;
      difference: string;
      percentage: string;
      status: "above" | "below" | "equal";
    }> = [];

    const europeanAverages = getEuropeanLeagueAverages(
      athlete.athleteBirthDate
    );
    Object.entries(europeanAverages).forEach(([country, averages]) => {
      const metricData = averages[metric as keyof typeof averages];
      if (metricData) {
        const { min, max } = metricData;
        const average = (min + max) / 2;
        const difference = athleteValue - average;
        const percentage = (difference / average) * 100;

        comparisons.push({
          country,
          average: average.toFixed(1),
          difference: difference.toFixed(1),
          percentage: percentage.toFixed(1),
          status: difference > 0 ? "above" : difference < 0 ? "below" : "equal",
        });
      }
    });

    return comparisons;
  };

  const getBestEuropeanLeague = (metric: string, athleteValue: number) => {
    const comparisons = getEuropeanComparison(metric, athleteValue);
    return comparisons.reduce((best, current) => {
      return current.percentage > best.percentage ? current : best;
    });
  };

  // Yorgunluk endeksi hesaplama
  const getFatigueDisplay = () => {
    if (!athlete.fatigueIndex && athlete.fatigueIndex !== 0)
      return "Hesaplanamadı";

    if (athlete.fatigueIndex === 0) {
      return "%0.0";
    } else {
      return `%${athlete.fatigueIndex.toFixed(1)}`;
    }
  };

  const getFatigueColor = () => {
    if (!athlete.fatigueIndex && athlete.fatigueIndex !== 0) return "#6f6f73";

    if (athlete.fatigueIndex <= 3) {
      return "#4caf50"; // Yeşil - düşük yorgunluk
    } else if (athlete.fatigueIndex <= 5) {
      return "#ff9800"; // Turuncu - orta yorgunluk
    } else {
      return "#f44336"; // Kırmızı - yüksek yorgunluk
    }
  };

  // Radar grafik verisi - 6 parametre için (yorgunluk endeksi kaldırıldı)
  const radarData = {
    labels: [
      "VKİ",
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

  // Sütun grafik verisi - 6 parametre için (yorgunluk endeksi kaldırıldı)
  const barData = {
    labels: [
      "VKİ",
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

  // VKİ hesaplama
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
                  <Box className="metricRow">
                    <Typography variant="body2" className="metricLabel">
                      <Activity
                        size={16}
                        style={{ marginRight: 6, verticalAlign: "middle" }}
                      />
                      FFMI:
                    </Typography>
                    <Typography
                      variant="h6"
                      className="metricValue"
                      color={!athlete.ffmi ? "error.main" : "primary.main"}
                    >
                      {athlete.ffmi && !isNaN(Number(athlete.ffmi))
                        ? `${Number(athlete.ffmi).toFixed(1)}`
                        : "Hesaplanamadı"}
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
                      <Gauge
                        size={16}
                        style={{ marginRight: 6, verticalAlign: "middle" }}
                      />
                      Yorgunluk Endeksi:
                    </Typography>
                    <Typography
                      variant="h6"
                      className="metricValue"
                      sx={{ color: getFatigueColor() }}
                    >
                      {getFatigueDisplay()}
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
                <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 3 }}>
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
              <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom className="sectionTitle">
                  <PieChart size={24} style={{ marginRight: 8 }} />
                  PERFORMANS RADAR GRAFİĞİ
                </Typography>
                <Box sx={{ height: 300, position: "relative" }}>
                  <Radar data={radarData} options={radarOptions} />
                </Box>
              </Paper>

              {/* Birleştirilmiş Bilgilendirme Kartı */}
              <Paper elevation={3} sx={{ p: 1.5, borderRadius: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  className="sectionTitle"
                  sx={{ fontSize: "1rem", mb: 1 }}
                >
                  <Gauge size={18} style={{ marginRight: 6 }} />
                  BİLGİLENDİRME
                </Typography>

                {/* Yorgunluk Endeksi Bölümü */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    className="trendItem positive"
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                  >
                    YORGUNLUK ENDEKSİ:
                  </Typography>
                  <Typography
                    variant="caption"
                    className="trendItem positive"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    Düşük (%0–3): Sporcu tekrar sprintlerde yüksek formunu
                    koruyabiliyor, toparlanma ve anaerobik kapasitesi güçlü.
                  </Typography>
                  <Typography
                    variant="caption"
                    className="trendItem improvement"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    Orta (%3–5): Orta düzey toparlanma, dayanıklılık
                    geliştirmeye açık alan var.
                  </Typography>
                  <Typography
                    variant="caption"
                    className="trendItem negative"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    Yüksek (%5+): Sporcunun tekrar sprintlerde hızlı
                    yorgunlaştığını, anaerobik gücün çabuk düştüğünü gösterir.
                  </Typography>
                </Box>

                {/* FFMI Bölümü */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    className="trendItem positive"
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                  >
                    FFMI NEDİR:
                  </Typography>
                  <Typography
                    variant="caption"
                    className="trendItem positive"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    Yağsız Vücut Kitle Endeksi (FFMI), BMI ile
                    karşılaştırıldığında, FFMI yağ faktörünü dışlar ve büyük kas
                    kütlesine sahip insanların fiziksel durumunu daha objektif
                    olarak yansıtabilir. Bu nedenle genellikle insanın vücudunun
                    güçlülük derecesini ölçmek için kullanılır.
                  </Typography>
                </Box>

                {/* 3 Aylık Hedefler Bölümü */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography
                    variant="caption"
                    className="trendItem positive"
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                  >
                    3 AYLIK HEDEFLER:
                  </Typography>
                  <Typography
                    variant="caption"
                    className="exerciseItem"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    • 30m koşu: {(athlete.speedRun * 0.9).toFixed(2)}s hedefi
                  </Typography>
                  <Typography
                    variant="caption"
                    className="exerciseItem"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    • Çeviklik: {(athlete.agilityRun * 0.95).toFixed(2)}s hedefi
                  </Typography>
                  <Typography
                    variant="caption"
                    className="exerciseItem"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    • Dikey sıçrama: {(athlete.jumping * 1.1).toFixed(0)}cm
                    hedefi
                  </Typography>
                  <Typography
                    variant="caption"
                    className="exerciseItem"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    • Esneklik: {(athlete.flexibility * 1.15).toFixed(0)}cm
                    hedefi
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Sağ - Sütun Grafik */}
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom className="sectionTitle">
                  <BarChart3 size={24} style={{ marginRight: 8 }} />
                  YAŞ GRUBU KARŞILAŞTIRMASI
                </Typography>
                <Box sx={{ height: 300, position: "relative" }}>
                  <Bar data={barData} options={barOptions} />
                </Box>
              </Paper>

              {/* Avrupa Ligleri Karşılaştırması */}
              <Paper
                elevation={3}
                sx={{ p: 1.5, mb: 2, borderRadius: 3, height: 516 }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  className="sectionTitle"
                  sx={{ fontSize: "1rem", mb: 1 }}
                >
                  <Trophy size={20} style={{ marginRight: 6 }} />
                  AVRUPA LİGLERİ KARŞILAŞTIRMASI
                </Typography>

                {/* Lig Karşılaştırmaları */}
                <Grid
                  container
                  spacing={1}
                  sx={{
                    height: "calc(100% - 70px)",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignContent: "space-between",
                  }}
                >
                  {/* 30m Koşu */}
                  <Grid item xs={6} sx={{ height: "35%" }}>
                    <Box
                      sx={{
                        p: 1,
                        border: "1px solid rgba(228, 252, 85, 0.3)",
                        borderRadius: 2,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#e4fc55",
                          mb: 0.5,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "0.7rem",
                          flexShrink: 0,
                        }}
                      >
                        30m KOŞU
                      </Typography>
                      <Box sx={{ flex: 1, overflow: "hidden", p: 0.5 }}>
                        {getEuropeanComparison(
                          "speedRun",
                          athlete.speedRun
                        ).map((comp, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 0.5,
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: "#ffffff", fontSize: "0.6rem" }}
                            >
                              {comp.country}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color:
                                  comp.status === "above"
                                    ? "#4caf50"
                                    : comp.status === "below"
                                    ? "#f44336"
                                    : "#6f6f73",
                                fontWeight: "bold",
                                fontSize: "0.6rem",
                              }}
                            >
                              {comp.status === "above" ? "+" : ""}
                              {comp.percentage}%
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Grid>

                  {/* Çeviklik */}
                  <Grid item xs={6} sx={{ height: "35%" }}>
                    <Box
                      sx={{
                        p: 1,
                        border: "1px solid rgba(228, 252, 85, 0.3)",
                        borderRadius: 2,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#e4fc55",
                          mb: 0.5,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "0.7rem",
                          flexShrink: 0,
                        }}
                      >
                        ÇEVİKLİK
                      </Typography>
                      <Box sx={{ flex: 1, overflow: "hidden", p: 0.5 }}>
                        {getEuropeanComparison(
                          "agilityRun",
                          athlete.agilityRun
                        ).map((comp, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 0.5,
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: "#ffffff", fontSize: "0.6rem" }}
                            >
                              {comp.country}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color:
                                  comp.status === "above"
                                    ? "#4caf50"
                                    : comp.status === "below"
                                    ? "#f44336"
                                    : "#6f6f73",
                                fontWeight: "bold",
                                fontSize: "0.6rem",
                              }}
                            >
                              {comp.status === "above" ? "+" : ""}
                              {comp.percentage}%
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Grid>

                  {/* Dikey Sıçrama */}
                  <Grid item xs={6} sx={{ height: "35%" }}>
                    <Box
                      sx={{
                        p: 1,
                        border: "1px solid rgba(228, 252, 85, 0.3)",
                        borderRadius: 2,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#e4fc55",
                          mb: 0.5,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "0.7rem",
                          flexShrink: 0,
                        }}
                      >
                        DİKEY SIÇRAMA
                      </Typography>
                      <Box sx={{ flex: 1, overflow: "hidden", p: 0.5 }}>
                        {getEuropeanComparison("jumping", athlete.jumping).map(
                          (comp, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 0.5,
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ color: "#ffffff", fontSize: "0.6rem" }}
                              >
                                {comp.country}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color:
                                    comp.status === "above"
                                      ? "#4caf50"
                                      : comp.status === "below"
                                      ? "#f44336"
                                      : "#6f6f73",
                                  fontWeight: "bold",
                                  fontSize: "0.6rem",
                                }}
                              >
                                {comp.status === "above" ? "+" : ""}
                                {comp.percentage}%
                              </Typography>
                            </Box>
                          )
                        )}
                      </Box>
                    </Box>
                  </Grid>

                  {/* İkinci 30m */}
                  <Grid item xs={6} sx={{ height: "35%" }}>
                    <Box
                      sx={{
                        p: 1,
                        border: "1px solid rgba(228, 252, 85, 0.3)",
                        borderRadius: 2,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#e4fc55",
                          mb: 0.5,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "0.7rem",
                          flexShrink: 0,
                        }}
                      >
                        İKİNCİ 30M
                      </Typography>
                      <Box sx={{ flex: 1, overflow: "hidden", p: 0.5 }}>
                        {getEuropeanComparison(
                          "secondSpeedRun",
                          athlete.secondSpeedRun
                        ).map((comp, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 0.5,
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: "#ffffff", fontSize: "0.6rem" }}
                            >
                              {comp.country}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color:
                                  comp.status === "above"
                                    ? "#4caf50"
                                    : comp.status === "below"
                                    ? "#f44336"
                                    : "#6f6f73",
                                fontWeight: "bold",
                                fontSize: "0.6rem",
                              }}
                            >
                              {comp.status === "above" ? "+" : ""}
                              {comp.percentage}%
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Grid>

                  {/* Esneklik */}
                  <Grid item xs={6} sx={{ height: "35%" }}>
                    <Box
                      sx={{
                        p: 1,
                        border: "1px solid rgba(228, 252, 85, 0.3)",
                        borderRadius: 2,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#e4fc55",
                          mb: 0.5,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "0.7rem",
                          flexShrink: 0,
                        }}
                      >
                        ESNEKLİK
                      </Typography>
                      <Box sx={{ flex: 1, overflow: "hidden", p: 0.5 }}>
                        {getEuropeanComparison(
                          "flexibility",
                          athlete.flexibility
                        ).map((comp, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 0.5,
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: "#ffffff", fontSize: "0.6rem" }}
                            >
                              {comp.country}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color:
                                  comp.status === "above"
                                    ? "#4caf50"
                                    : comp.status === "below"
                                    ? "#f44336"
                                    : "#6f6f73",
                                fontWeight: "bold",
                                fontSize: "0.6rem",
                              }}
                            >
                              {comp.status === "above" ? "+" : ""}
                              {comp.percentage}%
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Grid>

                  {/* FFMI */}
                  <Grid item xs={6} sx={{ height: "35%" }}>
                    <Box
                      sx={{
                        p: 1,
                        border: "1px solid rgba(228, 252, 85, 0.3)",
                        borderRadius: 2,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#e4fc55",
                          mb: 0.5,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "0.7rem",
                          flexShrink: 0,
                        }}
                      >
                        FFMI
                      </Typography>
                      <Box sx={{ flex: 1, overflow: "hidden", p: 0.5 }}>
                        {getEuropeanComparison("ffmi", athlete.ffmi || 0).map(
                          (comp, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 0.5,
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ color: "#ffffff", fontSize: "0.6rem" }}
                              >
                                {comp.country}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color:
                                    comp.status === "above"
                                      ? "#4caf50"
                                      : comp.status === "below"
                                      ? "#f44336"
                                      : "#6f6f73",
                                  fontWeight: "bold",
                                  fontSize: "0.6rem",
                                }}
                              >
                                {comp.status === "above" ? "+" : ""}
                                {comp.percentage}%
                              </Typography>
                            </Box>
                          )
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Box>

      {/* Loading indicator */}
      {isLoading && (
        <Box className="loadingOverlay">
          <Typography variant="h6" color="white">
            JPG hazırlanıyor...
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default Report;
