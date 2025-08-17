'use client';

import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useUser } from '../context/user_context';
import { DailyStats, Stats } from '../model/stats';
import { HttpService } from '../service/http_service';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function MyStats() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<Stats | undefined>(undefined);
  const httpService = new HttpService();

  const getStats = async () => {
    setLoading(true);
    setError(null);
   

    try {
     
      const res = await httpService.make_get_request(`stats?userId=${user?.userId}`);
     
      if (!res.ok && res.status != 404) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const statsDTO: Stats = await res.json();



      setStats(statsDTO)
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      getStats();
    } else {
      router.replace('/');
    }
  }, [user?.userId]);

  return (
    <div className="justify-self-center w-140 h-90 p-8">
 <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={stats?.dailyStats}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dateStamp" />
        <YAxis allowDecimals={false} />
        <Tooltip cursor={{fill: 'transparent'}}/>
        <Legend />
        <Bar dataKey="numCorrect" stackId="a" fill="#82ca9d" maxBarSize={20}/>
        <Bar dataKey="numIncorrect" stackId="a" fill="#da1818ff" maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>

    Total answered: {stats?.totalAnswered} <br/>
    Total correct: {stats?.totalCorrect} <br/>
    Total inorrect: {stats?.totalIncorrect} <br/>
    % Correct: {stats?.percentCorrect}

    </div>
  );
}
