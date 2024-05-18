import axios from "../../utils/CustomAxios";
import { useCallback, useEffect, useState } from "react";
import Jumbotron from "../../../Jumbotron";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

const ReservationtStats = () => {
    const [reservationTime, setReservationTime] = useState([]);
    const [reservationYear, setReservationYear] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

    useEffect(() => {
        loadData();
    }, []);

    const loadData = useCallback(async () => {
        try {
            const resp = await axios.get("/reservation/timeStats");
            const respYear = await axios.get("/reservation/yearStats");

            const currentYear = new Date().getFullYear();
            const pastYears = 3;

            // 서버에서 가져온 데이터와 기본 데이터 구조를 결합
            const ymStatsData = resp.data.map(item => ({
                reservationTime: item.reservationTime,
                reservationCount: item.reservationCount,
            }));

            const years = Array.from({ length: pastYears }, (_, i) => currentYear - i);
            const yearStatsData = years.map(year => ({
                reservationYear: year.toString(),
                reservationCount: respYear.data.find(item => item.reservationYear === year.toString())?.reservationCount || 0,
            }));

            const months = years.flatMap(year => {
                return Array.from({ length: 12 }, (_, i) => {
                    const month = (i + 1).toString().padStart(2, '0');
                    const reservationTime = `${year}-${month}`;
                    const reservationCount = ymStatsData.find(item => item.reservationTime === reservationTime)?.reservationCount || 0;
                    return { reservationTime, reservationCount };
                });
            });

            setReservationTime(months);
            setReservationYear(yearStatsData);
        } catch (error) {
            console.error('데이터 에러 발생:', error);
        }
    }, []);

    const filteredData = reservationTime.filter(item => 
        item.reservationTime.startsWith(selectedYear)
    );

    const data = filteredData.map(item => ({
        name: item.reservationTime.slice(5, 7),
        '예약(건)': item.reservationCount,
    }));

    return (
        <>
            <Jumbotron title="통계" />

            <div className="row mt-4">
                <div className="col ms-5">
                    <select 
                        className="form-select rounded" 
                        style={{ width: '30%' }}
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        {reservationYear.map(year => (
                            <option key={year.reservationYear} value={year.reservationYear}>
                                {year.reservationYear}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col">
                    <BarChart width={730} height={250} data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="예약(건)" fill="#8884d8" />
                    </BarChart>
                </div>
            </div>
        </>
    );
};

export default ReservationtStats;
