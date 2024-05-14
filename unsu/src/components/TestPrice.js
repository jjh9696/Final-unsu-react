import React, { useState, useCallback } from 'react';
import axios from "./utils/CustomAxios";


const TestPrice = () => {
    const [reservationData, setReservationData] = useState({
        gradeType: '',
        routeNo: '',
        busNo: '',
        seatNo: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReservationData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const saveInput = useCallback(async () => {
        try {
            const resp = await axios.post("/reservation/save", reservationData, {
                headers: {
                    Authorization: axios.defaults.headers.common['Authorization']
                }
            });

            alert('Reservation successfully created!');
        } catch (error) {
            console.error('Error creating reservation:', error);
            alert(`Failed to create reservation: ${error.response.data.message}`);
        }
    }, [reservationData]);

    return (
        <div>
            <h2>Make a Reservation</h2>
            <input
                type="text"
                name="gradeType"
                value={reservationData.gradeType}
                onChange={handleInputChange}
                placeholder="Grade Type"
            />
            <input
                type="text"
                name="routeNo"
                value={reservationData.routeNo}
                onChange={handleInputChange}
                placeholder="Route Number"
            />
            <input
                type="number"
                name="busNo"
                value={reservationData.busNo}
                onChange={handleInputChange}
                placeholder="Bus Number"
            />
            <input
                type="number"
                name="seatNo"
                value={reservationData.seatNo}
                onChange={handleInputChange}
                placeholder="Seat Number"
            />
            <button onClick={saveInput}>Submit Reservation</button>
        </div>
    );
};

export default TestPrice;