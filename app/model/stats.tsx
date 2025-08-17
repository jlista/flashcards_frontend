export interface Stats{
    userId: number;
    totalAnswered: number;
    totalCorrect: number;
    totalIncorrect: number;
    percentCorrect: number;
    dailyStats: Array<DailyStats>;
}

export interface DailyStats{
    dateStamp: string;
    numCorrect: number;
    numIncorrect: number;
}