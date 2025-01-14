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
  percentile?: number;
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
  };
}

const yearlyStats: IYearlyStats = {
  "2011": {
    speedRun: { min: 4.5, max: 5.0 },
    secondSpeedRun: { min: 4.5, max: 5.0 },
    agilityRun: { min: 17.0, max: 18.5 },
    flexibility: { min: 0, max: 16 },
    jumping: { min: 32, max: 40 },
    height: { min: 154, max: 160 },
    weight: { min: 40, max: 50 },
  },
  "2012": {
    speedRun: { min: 4.6, max: 5.1 },
    secondSpeedRun: { min: 4.6, max: 5.1 },
    agilityRun: { min: 17.5, max: 19.0 },
    flexibility: { min: 0, max: 16 },
    jumping: { min: 30, max: 38 },
    height: { min: 150, max: 156 },
    weight: { min: 38, max: 48 },
  },
  "2013": {
    speedRun: { min: 4.7, max: 5.2 },
    secondSpeedRun: { min: 4.7, max: 5.2 },
    agilityRun: { min: 18.0, max: 19.5 },
    flexibility: { min: 0, max: 16 },
    jumping: { min: 28, max: 36 },
    height: { min: 146, max: 152 },
    weight: { min: 35, max: 45 },
  },
  "2014": {
    speedRun: { min: 4.8, max: 5.3 },
    secondSpeedRun: { min: 4.8, max: 5.3 },
    agilityRun: { min: 18.5, max: 20.0 },
    flexibility: { min: 0, max: 16 },
    jumping: { min: 26, max: 34 },
    height: { min: 142, max: 148 },
    weight: { min: 32, max: 42 },
  },
  "2015": {
    speedRun: { min: 4.9, max: 5.4 },
    secondSpeedRun: { min: 4.9, max: 5.4 },
    agilityRun: { min: 19.0, max: 20.5 },
    flexibility: { min: 0, max: 16 },
    jumping: { min: 24, max: 32 },
    height: { min: 138, max: 144 },
    weight: { min: 30, max: 40 },
  },
  "2016": {
    speedRun: { min: 5.0, max: 5.5 },
    secondSpeedRun: { min: 5.0, max: 5.5 },
    agilityRun: { min: 19.5, max: 21.0 },
    flexibility: { min: 0, max: 16 },
    jumping: { min: 22, max: 30 },
    height: { min: 134, max: 140 },
    weight: { min: 28, max: 38 },
  },
  "2017": {
    speedRun: { min: 5.1, max: 5.6 },
    secondSpeedRun: { min: 5.1, max: 5.6 },
    agilityRun: { min: 20.0, max: 21.5 },
    flexibility: { min: 0, max: 16 },
    jumping: { min: 20, max: 28 },
    height: { min: 130, max: 136 },
    weight: { min: 25, max: 36 },
  },
  "2018": {
    speedRun: { min: 5.3, max: 5.8 },
    secondSpeedRun: { min: 5.3, max: 5.8 },
    agilityRun: { min: 20.5, max: 22.0 },
    flexibility: { min: 0, max: 16 },
    jumping: { min: 18, max: 26 },
    height: { min: 126, max: 132 },
    weight: { min: 23, max: 34 },
  },
  "2019": {
    speedRun: { min: 5.5, max: 6.2 },
    secondSpeedRun: { min: 5.5, max: 6.2 },
    agilityRun: { min: 21.0, max: 23.0 },
    flexibility: { min: 8, max: 12 },
    jumping: { min: 15, max: 22 },
    height: { min: 102, max: 110 },
    weight: { min: 16, max: 22 },
  },
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
