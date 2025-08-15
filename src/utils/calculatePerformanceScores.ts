interface IAthlete {
  id: number;
  athleteName: string;
  athleteBirthDate: string;
  height: number;
  weight: number;
  flexibility: number;
  speedRun: number;
  secondSpeedRun: number;
  agilityRun: number;
  jumping: number;
  ffmi?: number;
  percentile?: number;
  bmi?: number;
  bmiStatus?: string;
  fatigueIndex?: number;
  fatigueIndexPercentile?: number;
}

interface IYearlyStats {
  [year: string]: {
    speedRun: { min: number; max: number };
    secondSpeedRun: { min: number; max: number };
    agilityRun: { min: number; max: number };
    flexibility: { min: number; max: number };
    jumping: { min: number; max: number };
    height: { min: number; max: number };
    weight: { min: number; max: number };
    ffmi: { min: number; max: number };
  };
}

const yearlyStats: IYearlyStats = {
  "2009": {
    speedRun: { min: 4.3, max: 4.8 },
    secondSpeedRun: { min: 4.3, max: 4.8 },
    agilityRun: { min: 16.0, max: 17.5 },
    flexibility: { min: 0, max: 16 },
    jumping: { min: 36, max: 44 },
    height: { min: 162, max: 168 },
    weight: { min: 44, max: 54 },
    ffmi: { min: 16.8, max: 18.2 },
  },
  "2010": {
    speedRun: { min: 4.4, max: 4.9 },
    secondSpeedRun: { min: 4.4, max: 4.9 },
    agilityRun: { min: 16.5, max: 18.0 },
    flexibility: { min: 0, max: 16 },
    jumping: { min: 34, max: 42 },
    height: { min: 158, max: 164 },
    weight: { min: 42, max: 52 },
    ffmi: { min: 16.2, max: 17.6 },
  },
  "2011": {
    speedRun: { min: 4.5, max: 5.0 },
    secondSpeedRun: { min: 4.5, max: 5.0 },
    agilityRun: { min: 17.0, max: 18.5 },
    flexibility: { min: 0, max: 16 },
    jumping: { min: 32, max: 40 },
    height: { min: 154, max: 160 },
    weight: { min: 40, max: 50 },
    ffmi: { min: 15.6, max: 17.0 },
  },
  "2012": {
    speedRun: { min: 4.6, max: 5.1 },
    secondSpeedRun: { min: 4.6, max: 5.1 },
    agilityRun: { min: 17.5, max: 19.0 },
    flexibility: { min: 0, max: 16 },
    jumping: { min: 30, max: 38 },
    height: { min: 150, max: 156 },
    weight: { min: 38, max: 48 },
    ffmi: { min: 15.0, max: 16.4 },
  },
  "2013": {
    speedRun: { min: 4.7, max: 5.2 },
    secondSpeedRun: { min: 4.7, max: 5.2 },
    agilityRun: { min: 18.0, max: 19.5 },
    flexibility: { min: 0, max: 16 },
    jumping: { min: 28, max: 36 },
    height: { min: 146, max: 152 },
    weight: { min: 35, max: 45 },
    ffmi: { min: 14.4, max: 15.8 },
  },
  "2014": {
    speedRun: { min: 4.8, max: 5.3 },
    secondSpeedRun: { min: 4.8, max: 5.3 },
    agilityRun: { min: 18.5, max: 20.0 },
    flexibility: { min: 0, max: 16 },
    jumping: { min: 26, max: 34 },
    height: { min: 142, max: 148 },
    weight: { min: 32, max: 42 },
    ffmi: { min: 13.8, max: 15.2 },
  },
  "2015": {
    speedRun: { min: 4.9, max: 5.4 },
    secondSpeedRun: { min: 4.9, max: 5.4 },
    agilityRun: { min: 19.0, max: 20.5 },
    flexibility: { min: 0, max: 16 },
    jumping: { min: 24, max: 32 },
    height: { min: 138, max: 144 },
    weight: { min: 30, max: 40 },
    ffmi: { min: 13.2, max: 14.6 },
  },
  "2016": {
    speedRun: { min: 5.0, max: 5.5 },
    secondSpeedRun: { min: 5.0, max: 5.5 },
    agilityRun: { min: 19.5, max: 21.0 },
    flexibility: { min: 0, max: 16 },
    jumping: { min: 22, max: 30 },
    height: { min: 134, max: 140 },
    weight: { min: 28, max: 38 },
    ffmi: { min: 12.6, max: 14.0 },
  },
  "2017": {
    speedRun: { min: 5.1, max: 5.6 },
    secondSpeedRun: { min: 5.1, max: 5.6 },
    agilityRun: { min: 20.0, max: 21.5 },
    flexibility: { min: 0, max: 16 },
    jumping: { min: 20, max: 28 },
    height: { min: 130, max: 136 },
    weight: { min: 25, max: 36 },
    ffmi: { min: 12.0, max: 13.4 },
  },
  "2018": {
    speedRun: { min: 5.3, max: 5.8 },
    secondSpeedRun: { min: 5.3, max: 5.8 },
    agilityRun: { min: 20.5, max: 22.0 },
    flexibility: { min: 0, max: 16 },
    jumping: { min: 18, max: 26 },
    height: { min: 126, max: 132 },
    weight: { min: 23, max: 34 },
    ffmi: { min: 11.4, max: 12.8 },
  },
  "2019": {
    speedRun: { min: 5.5, max: 6.2 },
    secondSpeedRun: { min: 5.5, max: 6.2 },
    agilityRun: { min: 21.0, max: 23.0 },
    flexibility: { min: 8, max: 12 },
    jumping: { min: 15, max: 22 },
    height: { min: 102, max: 110 },
    weight: { min: 16, max: 22 },
    ffmi: { min: 10.0, max: 11.4 },
  },
};

// BMI hesaplama fonksiyonu
export const calculateBMI = (
  weight: number,
  height: number
): { bmi: number; status: string } | null => {
  if (!weight || !height || weight <= 0 || height <= 0) {
    return null;
  }

  // Boyu cm'den m'ye çevir
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  let status = "";
  if (bmi < 18.5) {
    status = "Zayıf";
  } else if (bmi < 25) {
    status = "Normal";
  } else if (bmi < 30) {
    status = "Fazla Kilolu";
  } else {
    status = "Obez";
  }

  return { bmi: Number(bmi.toFixed(1)), status };
};

// Yaş grubu ortalamalarını hesaplama fonksiyonu
export const getAgeGroupAverages = (birthYear: string) => {
  const stats = yearlyStats[birthYear];
  if (!stats) return null;

  return {
    speedRun: (stats.speedRun.min + stats.speedRun.max) / 2,
    agilityRun: (stats.agilityRun.min + stats.agilityRun.max) / 2,
    flexibility: (stats.flexibility.min + stats.flexibility.max) / 2,
    jumping: (stats.jumping.min + stats.jumping.max) / 2,
    height: (stats.height.min + stats.height.max) / 2,
    weight: (stats.weight.min + stats.weight.max) / 2,
    ffmi: (stats.ffmi.min + stats.ffmi.max) / 2,
  };
};

// Yorgunluk endeksi hesaplama fonksiyonu
export const calculateFatigueIndex = (
  firstRun: number,
  secondRun: number
): number => {
  if (!firstRun || !secondRun) {
    return 0;
  }

  // İkinci koşu birinciden daha iyi ise (daha düşük süre)
  // Bu durumda ikinci koşuyu birinci koşu olarak kabul et
  if (secondRun < firstRun) {
    // İkinci koşu daha iyi, yorgunluk endeksi 0 (ideal durum)
    return 0;
  } else {
    // Yorgunluk durumu - ikinci koşu daha yavaş
    const fatigue = ((secondRun - firstRun) / firstRun) * 100;
    return fatigue;
  }
};

export const calculatePerformanceScoresWithPercentiles = (
  athletes: IAthlete[]
): IAthlete[] => {
  const calculatePercentile = (
    value: number,
    min: number,
    max: number,
    isBetterLower: boolean
  ) => {
    const average = (min + max) / 2;
    let percentile = ((value - min) / (max - min)) * 100;

    if (isBetterLower) {
      if (value < average) {
        percentile = Math.min(
          100,
          percentile + ((average - value) / average) * 20
        );
      } else if (value > average) {
        percentile = Math.max(
          15,
          percentile - ((value - average) / average) * 20
        );
      }
    } else {
      if (value > average) {
        percentile = Math.min(
          100,
          percentile + ((value - average) / average) * 20
        );
      } else if (value < average) {
        percentile = Math.max(
          15,
          percentile - ((average - value) / average) * 20
        );
      }
    }

    return Math.max(0, Math.min(100, percentile));
  };
  return athletes.map((athlete) => {
    const birthYear = athlete.athleteBirthDate;

    // Hangi istatistik yılına bakılacağına doğrudan karar ver
    const statsYear = yearlyStats[birthYear.toString()];

    if (!statsYear) {
      console.warn(
        `Sporcu ${athlete.athleteName} (${athlete.id}) için uygun istatistik bulunamadı.`
      );
      return {
        ...athlete,
        percentile: undefined, // Yüzdelik bulunamadı
      };
    }

    // BMI hesapla
    const bmiData = calculateBMI(athlete.weight, athlete.height);

    // Yorgunluk endeksi hesapla
    const fatigueData = calculateFatigueIndex(
      athlete.speedRun,
      athlete.secondSpeedRun
    );

    const stats = statsYear;

    const scores = {
      speedRun: calculatePercentile(
        athlete.speedRun,
        stats.speedRun.min,
        stats.speedRun.max,
        true
      ),
      secondSpeedRun: calculatePercentile(
        athlete.secondSpeedRun,
        stats.secondSpeedRun.min,
        stats.secondSpeedRun.max,
        true
      ),
      agilityRun: calculatePercentile(
        athlete.agilityRun,
        stats.agilityRun.min,
        stats.agilityRun.max,
        true
      ),
      flexibility: calculatePercentile(
        athlete.flexibility,
        stats.flexibility.min,
        stats.flexibility.max,
        false
      ),
      jumping: calculatePercentile(
        athlete.jumping,
        stats.jumping.min,
        stats.jumping.max,
        false
      ),
    };

    const averagePercentile =
      (scores.speedRun +
        scores.secondSpeedRun +
        scores.agilityRun +
        scores.flexibility +
        scores.jumping) /
      5;

    return {
      ...athlete,
      percentile: averagePercentile,
      bmi: bmiData?.bmi,
      bmiStatus: bmiData?.status,
      fatigueIndex: fatigueData,
      performanceDetails: {
        speedRun: scores.speedRun,
        secondSpeedRun: scores.secondSpeedRun,
        agilityRun: scores.agilityRun,
        flexibility: scores.flexibility,
        jumping: scores.jumping,
      },
    };
  });
};
