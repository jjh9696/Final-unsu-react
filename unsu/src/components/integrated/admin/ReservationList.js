import axios from "../../utils/CustomAxios";
import { useCallback, useEffect, useState } from "react";
import Jumbotron from "../../../Jumbotron";


const ReservationtList = () => {
    const [reservationTime, setReservationTime] = useState([]);
    

    useEffect(() => {
        loadData();
    }, []);
    //
    const loadData = useCallback(async () => {
        const resp = await axios.get("/reservation/timeStats");
        setReservationTime(resp.data);
    }, [reservationTime]);

    return (
        <>
            <Jumbotron title="통계" />

            <div className="row mt-4">
                <div className="col">
                    
                </div>
            </div>
        </>
    );
};

export default ReservationtList;
