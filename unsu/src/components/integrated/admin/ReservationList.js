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

const ReservationtList = () => {
    const [reservationTime, setReservationTime] = useState([]);
    

    useEffect(() => {
        loadData();
    }, []);

    const loadData = useCallback(async () => {
        try {
            const resp = await axios.get("/reservation/timeStats");
            // 1월부터 12월까지의 기본 데이터 구조 정의
            const months = Array.from({ length: 12 }, (_, i) => {
                const month = (i + 1).toString().padStart(2, '0');
                const currentYear = new Date().getFullYear();
                return { reservationTime: `${currentYear}-${month}`, reservationCount: 0 };
            });

            // 서버에서 가져온 데이터와 기본 데이터 구조를 결합
            const combinedData = months.map(month => {
                const found = resp.data.find(item => item.reservationTime === month.reservationTime);
                return found ? found : month;
            });

            // 날짜 순서대로 정렬
            const sortedData = combinedData.sort((a, b) => new Date(a.reservationTime) - new Date(b.reservationTime));
            setReservationTime(sortedData);
        } catch (error) {
            console.error('데이터에러났는데요:', error);
        }
    }, []);

    // 데이터 형식 변환
    const data = reservationTime.map(item => ({
        name: item.reservationTime.slice(2, 7), // YY-MM 형식으로 변환하여 x축에 표시할 데이터
        '예약(건)': item.reservationCount, // y축에 표시할 데이터
    }));

    return (
        <>
            <Jumbotron title="통계" />
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

export default ReservationtList;