'use client';

import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useUser } from '../context/user_context';
import { DailyStats, Stats } from '../model/stats';
import { HttpService } from '../service/http_service';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';


export default function MyStats() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<Stats | undefined>(undefined);
  const [masteryStats, setMasteryStats] = useState<any>(undefined)
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

      const colors = [
        "#ff0000", "#ff8400ff", "#fbff00ff", "#a2ff00ff", "#00ff33ff"
      ]

      setStats(statsDTO)
      var ms = []
      for (const  [i,lvl] of statsDTO.deckStats.cardsByMastery.entries()){
        ms.push({
          "level": i,
          "num": lvl,
          "color": colors[i]
        })
      }
      setMasteryStats(ms)
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
    <div>
      <h2>Statistics for {user?.username}</h2>
      <div className="flex flex-row w-full h-full gap-5 pr-20 pl-20">
        <div className="mt-12 divide-y divide-gray-200 dark:divide-gray-700 flex-1 grow">

          Daily Trends
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
        </div>
        <div className="flex flex-col w-100 h-full justify-center">
          <p>Key Indicators</p> 
          <br/>
                      <hr />
            # decks: {stats?.deckStats.numDecks} <br />
            # cards: {stats?.deckStats.numCards} <br />
            Total answered: {stats?.totalAnswered} <br/>
            Total correct: {stats?.totalCorrect} <br/>
            Total incorrect: {stats?.totalIncorrect} <br/>
            % Correct: {stats?.percentCorrect} <br />
            <hr />
            Mastery Level
          <BarChart width={250} height={150} data={masteryStats}>        
            <YAxis allowDecimals={false} />
            <Tooltip cursor={{fill: 'transparent'}}/>
            <Legend />
            <Bar dataKey="num" fill="#8884d8" >
              {masteryStats?.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </div>
      </div>
    </div>
  );
}
