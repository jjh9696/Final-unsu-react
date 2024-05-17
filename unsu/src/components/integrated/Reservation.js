import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from '../utils/CustomAxios';
import { useNavigate } from "react-router";
import { SeatGroup } from "hacademy-cinema-seat";

import { FaBus } from "react-icons/fa";

import Seat1 from "../../images/seat1.png";
import Seat2 from "../../images/seat2.png";
import Seat3 from "../../images/seat3.png";
import Seat4 from "../../images/seat4.png";
import bus from "../../images/bus.png";
  

const Reservation = () => {
    const [startRegion, setStartRegion] = useState('');
    const [endRegion, setEndRegion] = useState('');
    const [selectedId, setSelectedId] = useState('');
    const [startTerminals, setStartTerminals] = useState([]);
    const [endTerminals, setEndTerminals] = useState([]);
    const [selectedStartTerminal, setSelectedStartTerminal] = useState('');
    const [selectedEndTerminal, setSelectedEndTerminal] = useState('');
    const [showDetails, setShowDetails] = useState(false); // 화면 전환을 관리하는 상태
    const [selectedBus, setSelectedBus] = useState(null); // 선택된 버스의 상세 정보
    const [formData, setFormData] = useState({
        routeStart: "",
        routeEnd: "",
        routeStartTime: "",
        gradeType: ""
    });
    // 버스예약 전송날릴 데이터
    const [reservationData, setReservationData] = useState({
        gradeType: '',
        routeNo: '',
        busNo: '',
        seatNo: '',
        reservationCount: '1',
        reservationType: ''
    });


    /////////////////////////// 예매창에서 인원 선택관련 내용/////////////////////////////////
    // const [adultCount, setAdultCount] = useState(0);  // 초기값을 0으로 설정
    // const [teenCount, setTeenCount] = useState(0);  // 초기값을 0으로 설정
    // const [kidCount, setKidCount] = useState(0);  // 초기값을 0으로 설정

    // 결제 금액을 관리할 상태 추가
    const [fare, setFare] = useState(null);

    // 요금 계산을 위해 백엔드로 데이터를 전송하는 함수
    const calculateFare = async (chargeType, routeNo) => {
        const url = '/charge/calculateFare';
        const payload = {
            chargeType: chargeType,
            routeNo: routeNo,
            count: 1 // 여기에 고정된 값을 사용하거나 필요에 따라 동적으로 설정할 수 있습니다.
        };
        try {
            const response = await axios.post(url, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                return response.data; // 결제 금액 반환
            } else {
                throw new Error('Failed to fetch fare');
            }
        } catch (error) {
            console.error('Error fetching fare data:', error);
            throw error;
        }
    };


    // 요금 정보를 '/member/memberPoint'로 전송하는 함수
    const sendMemberPoint = async (chargeType, routeNo) => {
        const url = '/member/memberPoint';
        const payload = {
            chargeType: chargeType,
            routeNo: routeNo,
            count: 1 // 여기에 고정된 값을 사용하거나 필요에 따라 동적으로 설정할 수 있습니다.
        };
        try {
            const response = await axios.post(url, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                console.log('Member point updated:', response.data);
            } else {
                throw new Error('Failed to update member point');
            }
        } catch (error) {
            console.error('Error updating member point:', error);
        }
    };
    // 승객 타입 변경 핸들러
    const handleReservationTypeChange = async (e) => {
        const value = e.target.value;
        setReservationData(prevData => ({
            ...prevData,
            reservationType: value
        }));

        try {
            // 요금 계산
            const fareData = await calculateFare(value, reservationData.routeNo);
            console.log('요금 정보:', fareData);

            // 요금을 상태로 설정
            setFare(fareData);

            // 요금 정보를 '/member/memberPoint'로 전송
            // await sendMemberPoint(value, reservationData.routeNo);
        } catch (error) {
            console.error('Error fetching fare data:', error);
        }
    };


    /////////////////////////////////////////////////////////////////////////////////
    // 지역은 미리 지정해둠 아래에 regions에 셀렉트로 보이게 설정해둠
    const regions = [
        { key: "2", value: "광주/전남", name: "광주/전남" },
        { key: "3", value: "전북", name: "전북" },
        { key: "4", value: "부산/경남", name: "부산/경남" },
        { key: "5", value: "대구/경북", name: "대구/경북" },
        { key: "6", value: "인천/경기", name: "인천/경기" },
        { key: "7", value: "서울", name: "서울" }
    ];
    const [submissionSuccess, setSubmissionSuccess] = useState(false); // 버스조회가 정상적으로 이루어 지면 사용자가 조회한 내용을 바탕으로 다른 컴포넌트를 보여주기 위한 상태

    const [selectedStartTerminalName, setSelectedStartTerminalName] = useState('');
    const [selectedEndTerminalName, setSelectedEndTerminalName] = useState('');
    const [busResults, setBusResults] = useState([]);
    // 좌석띄우는 부분 
    const [seats, setSeats] = useState([]); // 좌석 정보를 담을 state
    const [selectedSeat, setSelectedSeat] = useState(null); // 선택된 좌석 번호를 담을 state

    // 버스번호에 대한 좌석정보가져오는 비동기에 넣을거
    const [seatBusNo, setSeatBusNo] = useState('');

    //예약된 좌석
    const [reservedSeats, setReservedSeats] = useState([])

    //const [routeNo,setRouteNo]= useState([]);

    // 좌석을 선택했을 때 선택된 좌석만 추출
    const [selectedSeats, setSelectedSeats] = useState([])

    //예약된 좌석을 가져 오는 함수
    const loadReservedDate = async (routeNo) => {
        const resp = await axios.get(`/seat/reservation/${routeNo}`);
        // setRouteNo(resp.data);
    };

    // 좌석 선택 가능 여부를 확인하는 함수
    const isSeatSelectable = (seatNo) => {
        // 예약된 좌석 목록에서 선택된 좌석 번호를 검색
        return !reservedSeats.includes(seatNo);
    };

    // 좌석을 클릭할 때 실행되는 함수
    const handleSeatClicks = (seat) => {
        // 선택된 좌석이 이미 예약된 좌석이라면 선택 취소
        if (!isSeatSelectable(seat.seatNo)) {
            return;
        }
        // 그 외의 경우에는 선택된 좌석으로 설정
        setSelectedSeat(seat);
        setSelectedSeats(prevSeats => [...prevSeats, seat]);
    };

    // useMemo 훅을 사용하여 체크된 좌석 목록 불러온다
    const checkedSeats = useMemo(() => {
        // seats 배열에서 seatChecked가 true인 좌석만 필터링하여 새로운 배열을 생성
        // 즉, 체크된 좌석만 포함하는 새로운 배열이 생성
        return seats.filter(seat => seat.seatChecked === true)
            // 좌석을 정렬합니다. 정렬 기준은 좌석이 속한 행과 열
            .sort((a, b) => a.seat_column === b.seat_column ? a.seat_row - b.seat_row : a.seat_column - b.seat_column);
    }, [seats]); // seats 배열이 변경될 때마다 캐싱된 값이 업데이트됩니다.

    // 버스 클릭 이벤트 핸들러
    const handleBusClick = (e) => {
        setSeatBusNo(e.target.value);

    };
    // const handleCombinedClick = (bus) => {
    //     openModalCreate();
    //     console.log(bus.busNo);
    //     setSeatBusNo(bus.busNo);
    // };
    // 버스 클릭 이벤트 핸들러
    const handleCombinedClick = async (bus) => {
        // 데이터를 불러온 후에 모달을 열도록 선택
        await loadSeatData(bus.routeNo);
    
        // reservationData 업데이트 후 로그 찍기
        const updatedReservationData = {
            ...reservationData,
            routeNo: bus.routeNo,
            busNo: bus.busNo,
            gradeType: bus.gradeType
        };
        setReservationData(updatedReservationData);
        console.log("Updated reservationData:", updatedReservationData);  // 변경된 상태 로깅
    
        handleSelectBus();
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 500);
    };
    

     // 좌석 정보를 가져오는 함수
     const loadSeatData = async (routeNo) => {
        try {
            //const resp = await axios.get(`/seat/${routeNo}/seat`);
            const resp = await axios.get(`/seat/reservation/${routeNo}`);

            //여기서 잠깐! 이대로 설정하면 예약좌석을 좌석 라이브러리에서 인지를 못함
            //reservationSeatNo에 들어있는 숫자를 논리로 수정하는 코드를 작성
            const convert = resp.data.map(seat => {
                return {
                    ...seat,
                    reservationSeatNo: seat.reservationSeatNo !== 0
                }
            });

            setSeats(convert); // 가져온 좌석 정보를 state에 설정
            //console.log(resp.data);
        } catch (error) {
            console.error("Error fetching seats:", error);
        }
    };


    // 좌석 클릭 이벤트 핸들러
    // const handleSeatClick = (seatNumber) => {
    //     setSelectedSeat(seatNumber); // 선택한 좌석 번호를 state에 설정
    //     setReservationData(prevData => {
    //         const newData = {
    //             ...prevData,
    //             seatNo: checkedSeat.seatNo
    //         };
    //         return newData;
    // })
    // };
    //좌석을 선택했을 때 선택된 좌석만 추출
    const checkSeats = useMemo(() => {
        return seats.filter(seat => seat.seatChecked === true);
    }, [seats]);


    useEffect(() => {
        if (seatBusNo) {
            loadSeatData();
        }
    }, [seatBusNo]);

    // useEffect(() => {
    //     loadSeatData();
    // }, []);





    ///////////////////////좌석관련 핸들러끝////////////////////////////
    // useEffect(() => {
    //     loadReservedDate();
    // }, []);






    // 사용자가 원하는 버스노선 정보를 얻기 위한 백엔드로 정보 전달
    const handleSubmit = async () => {
        // 폼 데이터에서 gradeType이 "전체" 또는 빈 문자열인 경우 제거
        const dataToSend = formData.gradeType === "" || formData.gradeType === "전체" ?
            (({ gradeType, ...rest }) => rest)(formData) : formData; // 이렇게 하면 등급을 전체로 하면 데이터 전송시 등급이 빠지고 백엔드에서 where절에 등급 조건이 빠지게 함

        // console.log('전송되는 정보:', dataToSend);

        try {
            const response = await axios.post('/search/', dataToSend);
            const price =
                console.log('Server Response:', response.data);
            setBusResults(response.data);
            setSubmissionSuccess(true);  // 제출 성공 상태를 true로 설정
            setError(null);  // 에러 상태 초기화
        } catch (error) {
            console.error('전송 오류:', error.response ? error.response.data : error.message);
            setSubmissionSuccess(false);  // 에러 발생 시 제출 성공 상태를 false로 설정
            setError('Submission failed');  // 에러 메시지를 상태에 저장
        }
    };
    /////////////////////요금관련/////////////////////////////////////////
    const [fares, setFares] = useState({
        standard: null,
        business: null,
        premium: null
    });
    const [error, setError] = useState(null);
    const [chargeNo, setChargeNo] = useState();
    useEffect(() => {
        const fetchFares = async (routeNo) => {
            try {
                const premiumFare = await fetchFare(1, routeNo);
                const standardFare = await fetchFare(3, routeNo);
                const businessFare = await fetchFare(2, routeNo);
                setFares({ standard: standardFare, business: businessFare, premium: premiumFare });
            } catch (error) {
                console.error('에러발생:', error);
                setError('에러발생');
            }
        };

        if (busResults.length > 0) {
            fetchFares(busResults[0].routeNo);
        }
    }, [busResults]);

    const fetchFare = async (chargeNo, routeNo) => {
        try {
            const response = await axios.get(`/charge/${chargeNo}/${routeNo}`);
            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error(`Server responded with status: ${response.status}`);
            }
        } catch (error) {
            console.error('API Error:', error.response ? error.response.data : error.message);
            throw error;  // 상위 호출자에게 에러를 전파하여 적절히 처리할 수 있도록 합니다.
        }
    };
    const fetchFareDetails = async (routeNo) => {
        try {
            const [standard, business, premium] = await Promise.all([
                fetchFare(1, routeNo),
                fetchFare(2, routeNo),
                fetchFare(3, routeNo)
            ]);
            setFares({
                standard: standard,
                business: business,
                premium: premium
            });
        } catch (error) {
            console.error('요금 계산 중 에러 발생:', error);
            setFares({ standard: '에러', business: '에러', premium: '에러' });
        }
    };



    ////////////////////////요금관련 끝//////////////////////////////////////

    const navigate = useNavigate(); // 폼이 전송되면 페이지 리다이렉트
    // 출발 터미널을 보여주기 위한 통신
    useEffect(() => {
        const fetchData = async () => {
            if (startRegion) {
                try {
                    const response = await axios.post("/reservation/", { terminalRegion: startRegion });
                    setStartTerminals(response.data);
                    if (response.data.length > 0) {
                        setSelectedStartTerminal(response.data[0].id);
                    } else {
                        setSelectedStartTerminal('');
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                setStartTerminals([]);
                setSelectedStartTerminal('');
            }
        };
        fetchData();

    }, [startRegion]);

    // 출발 터미널 변경하는거 관리
    const handleStartTerminalChange = (e) => {
        const selectedId = parseInt(e.target.value, 10);  // 선택된 터미널 ID를 숫자로 변환
        const selectedTerminal = startTerminals.find(terminal => terminal.terminalId === selectedId);
        // console.log(selectedId);
        setSelectedStartTerminal(selectedId);
        if (selectedTerminal) {
            setSelectedStartTerminalName(selectedTerminal.terminalName);
            // 출발 터미널 선택 시 도착 터미널도 같은 터미널로 설정
            setSelectedEndTerminal(selectedId);
            setSelectedEndTerminalName(selectedTerminal.terminalName);
            setFormData({ ...formData, routeStart: selectedId, routeEnd: selectedId });
        } else {
            setSelectedStartTerminalName('터미널 선택');
            setSelectedEndTerminal('');
            setSelectedEndTerminalName('');
        }
    };

    // 도착 터미널을 보여주기 위한 통신
    useEffect(() => {
        const fetchData = async () => {
            if (endRegion) {
                try {
                    // console.log("선택됐나?",selectedStartTerminal);
                    const response = await axios.post("/reservation/end", {
                        terminalId: selectedStartTerminal,
                        terminalRegion: endRegion
                    });
                    setEndTerminals(response.data);
                    if (response.data.length > 0) {
                        setSelectedEndTerminal(response.data[0].id);
                    } else {
                        setSelectedEndTerminal('');
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                setEndTerminals([]);
                setSelectedEndTerminal('');
            }
        };
        fetchData();
    }, [endRegion]);

    // 출발 지역 선택
    const handleStartRegionChange = (e) => {
        setStartRegion(e.target.value);
    };

    // 도착 지역선택
    const handleEndRegionChange = (e) => {
        setEndRegion(e.target.value);
    };


    // 도착 터미널 변경하는거 관리
    const handleEndTerminalChange = (e) => {
        const selectedId = parseInt(e.target.value, 10);  // 선택된 터미널 ID를 숫자로 변환
        const selectedTerminal = endTerminals.find(terminal => terminal.terminalId === selectedId);

        setSelectedEndTerminal(selectedId);
        if (selectedTerminal) {
            setSelectedEndTerminalName(selectedTerminal.terminalName);
        } else {
            setSelectedEndTerminalName('터미널 선택');
        }
        setFormData({ ...formData, routeEnd: selectedId });
    };
    useEffect(() => {
        if (selectedStartTerminal) {
            setSelectedEndTerminal(selectedStartTerminal);  // 출발 터미널이 선택되면 도착 터미널도 해당 터미널로 설정
        }
    }, [selectedStartTerminal]);
    // 시간을 폼데이터에 넣기 사용자가 맨첨에 달력에서 선택한 데이터를 저장해서 아래에 창에 보여주려고 만들었음
    const handleStartDateChange = (e) => {
        setFormData({ ...formData, routeStartTime: e.target.value });
    };

    // 등급을 폼데이터에 넣기 전체라는 컬럼은 없기때문에 등급 선택바에서 전체를 선택하면 전송할때 아예 제거하고 보냄
    const handleGradeTypeChange = (e) => {
        if (e.target.value !== "전체") {
            setFormData({ ...formData, gradeType: e.target.value });
        } else {
            // 'gradeType' 필드를 폼 데이터에서 완전히 제거
            const { gradeType, ...newFormData } = formData;
            setFormData(newFormData);
        }
    };




    ///////////////////////////////////////////// 버스 눌러서 예약 하는 모달 ////////////////////////////////////////////
    const handleSelectBus = (bus) => {
        setSelectedBus(bus);
        setShowDetails(true); // 상세 화면으로 전환
    };

    // '이전' 버튼 클릭 핸들러
    const handleGoBack = () => {
        setShowDetails(false); // 초기 화면으로 돌아가기
        setFare('');
    };
    const [input, setInput] = useState({
        // 버스 예약 인서트 할것 넣기
    });
    const bsModal = useRef(); //등록



    //입력값 초기화
    const clearInput = useCallback(() => {
        setInput({
            // 버스 예약 인서트 할것 넣기
        });
    }, [input]);


    ////////////////////////////////////예약 비동기/////////////////////////////////////////////////////////
    // // 예약을 서버로 전송
    // const saveInput = useCallback(async () => {
    //     try {
    //         const resp = await axios.post("/reservation/save", reservationData, {
    //             headers: {
    //                 Authorization: axios.defaults.headers.common['Authorization']
    //             }
    //         });
    //         alert('예약이 완료되었습니다');
    //     } catch (error) {
    //         console.log('저기요');
    //         console.error('Error creating reservation:', error);
    //         alert(`띠로리: ${error.response ? error.response.data.message : error.message}`);
    //     }
    // }, [reservationData]);



    // 예약 저장 함수
    const saveInput = useCallback(async () => {
        try {
            // 버스 예약 데이터에 선택된 좌석 정보를 추가하여 업데이트
            const updatedData = {
                ...reservationData,
                seatNo: checkedSeats.map(checkedSeat => checkedSeat.seatNo).join(','), // 여러 좌석을 선택할 경우를 고려하여 좌석 번호들을 쉼표로 구분하여 문자열로 결합
            };
            // 요금 정보를 '/member/memberPoint'로 전송
            await sendMemberPoint(reservationData.reservationType, reservationData.routeNo);
            // 업데이트된 예약 데이터를 서버로 전송
            const resp = await axios.post("/reservation/save", updatedData, {
                headers: {
                    Authorization: axios.defaults.headers.common['Authorization']
                }
            });
            // alert('예약이 완료되었습니다');
            navigate('/orderEnd')
        } catch (error) {
            console.error('Error creating reservation:', error);
            alert(`좌석을 선택해주세요`);
        }
    }, [checkedSeats, reservationData]);
    

    /////////////////////////////////////////////////////////////////////////////////////////////



    ///////////////////////////////////////////////// 아래부터 리턴 화면 /////////////////////////////////////////////////////
    return (
        <>
            {!showDetails ? (
                <>
                    <>
                    <div className="container mt-5">
                            <div className="row border-bottom border-3 border-dark pb-5">   
                            <h1 className="text-center">
                            <FaBus />
                               <br></br> 버스 조회
                                </h1>
                            <hr />
                            <div className="row">
                                <div className="col-md-3">
                                    <label htmlFor="startRegion" className="form-label">출발 지역</label>
                                    <select id="startRegion" className="form-select" onChange={handleStartRegionChange} value={startRegion}>
                                        <option value="">지역을 선택하세요</option>
                                        {regions.map(region => (
                                            <option key={region.key} value={region.value}>{region.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="startTerminal" className="form-label">출발 터미널</label>
                                    <select id="startTerminal" className="form-select" onChange={handleStartTerminalChange} value={selectedStartTerminal}>
                                        <option value="">터미널 선택</option>
                                        {startTerminals.map(terminal => (
                                            <option key={terminal.terminalId} value={terminal.terminalId}>{terminal.terminalName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="endRegion" className="form-label">도착 지역</label>
                                    <select id="endRegion" className="form-select" onChange={handleEndRegionChange} value={endRegion}>
                                        <option value="">지역을 선택하세요</option>
                                        {regions.map(region => (
                                            <option key={region.key} value={region.value}>{region.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="endTerminal" className="form-label">도착 터미널</label>
                                    <select id="endTerminal" className="form-select" onChange={handleEndTerminalChange} value={selectedEndTerminal}>
                                        <option value="">터미널 선택</option>
                                        {endTerminals.map(terminal => (
                                            <option key={terminal.terminalId} value={terminal.terminalId}>{terminal.terminalName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="row mt-5 justify-content-center"> {/* 중앙 정렬 */}
                                <div className="col-md-3">
                                    <label htmlFor="gradeType" className="form-label">등급</label>
                                    <select id="gradeType" className="form-select" onChange={handleGradeTypeChange}>
                                        <option value="">전체</option>
                                        <option value="일반">일반</option>
                                        <option value="우등">우등</option>
                                        <option value="프리미엄">프리미엄</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="startDate" className="form-label">출발 날짜</label>
                                    <input type="date" id="startDate" className="form-control" onChange={handleStartDateChange} />
                                </div>

                                <div className="row justify-content-center mt-3"> {/* 조회 버튼 */}
                                    <div className="col-md-6 text-center"> {/* 버튼을 중앙 정렬 */}
                                    <br></br><br></br><br></br><br></br>
                                        <button className="btn btn-info btn-lg " onClick={handleSubmit}>조회</button>
                                    </div>
                                </div>
                                        </div>
                                        </div>
                                        </div>
                            </>
                            {submissionSuccess && (
                                <>
                                    <div className="container d-flex justify-content-end">
                                        <div className="row mt-5 w-25 text-center me-5">
                                            <div className="col">
                                                <label>출발터미널</label><div><strong>{selectedStartTerminalName || '선택되지 않음'}</strong></div><br /><br />
                                                <label>도착터미널</label><div><strong>{selectedEndTerminalName || '선택되지 않음'}</strong></div>
                                                {busResults.length > 0 && (
                                                    <div key={busResults[0].routeNo} className='mt-3'>
                                                        <div><label>소요시간</label>{busResults[0].routeTime}</div>
                                                        <div>{busResults[0].routeKm}<label>Km</label></div>
                                                        <div className="col mt-4">
                                                            <hr />
                                                            요금
                                                        </div>
                                                        <div className="col mt-2">
                                                            <p>프리미엄: {fares.premium}원</p>
                                                            <p>우등: {fares.business}원</p>
                                                            <p>일반: {fares.standard}원</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="row mt-2 w-75 text-center">
                                            <div className="col">
                                                <h3>{formData.routeStartTime || "날짜를 선택하세요"}</h3>
                                                <hr />
                                                <div className="row mt-4">
                                                    <div className="col col-3">출발시각</div>
                                                    <div className="col col-3">등급</div>
                                                    <div className="col col-3">잔여석</div>
                                                    <div className="col col-3">선택</div>
                                                </div>
                                                {busResults.map((bus, index) => (
                                                    <div key={index} className="row mt-4">
                                                        <div className="col col-3">{new Date(bus.routeStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                        {/* YYYY-MM-DD HH24:MI 형식에서 시간만 출력하게 설정함 */}
                                                        <div className="col col-3">{bus.gradeType}</div>
                                                        <div className="col col-3">{bus.busSeat}석</div>
                                                        <div className="col col-3"><button className="btn btn-primary" onClick={e => handleCombinedClick(bus)}>선택{bus.busNo}</button></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>

                            )}
                            {/* <div className='row mt-5'>
                        <div className='col'>
                            <SeatGroup map={seats} setMap={setSeats}
                                                            fields={{
                                                            no:'seatNo', 
                                                            row:'seatColumn', 
                                                            col:'seatRow', 
                                                            price:'seatPrice', 
                                                            grade:'seatGrade',
                                                            reserved:'seatReserved', 
                                                            disabled:'seatDisabled',
                                                            checked:'seatChecked',
                                                            }}
                                                            rows={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                                                            cols={[1, 2, ' ', 3, 4]}
                                                            showNames
                                                        />
                        </div>
                    </div> */}
                        </>
                        ) : (
                        <>
                            <div className="container d-flex justify-content-end">
                                <div className="row mt-5 w-25 text-center me-5">
                                    <div className="col">
                                        <label>출발터미널</label><div><strong>{selectedStartTerminalName || '선택되지 않음'}</strong></div><br /><br />
                                        <label>도착터미널</label><div><strong>{selectedEndTerminalName || '선택되지 않음'}</strong></div>
                                        <div className="col mt-4">
                                            요금
                                        </div>
                                        <div className="row" >
                                            <div className="col w-50 text-center mb-4">
                                                <div className="col mt-2">
                                                    <p>프리미엄: {fares.premium}원</p>
                                                    <p>우등: {fares.business}원</p>
                                                    <p>일반: {fares.standard}원</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mt-2 w-100 text-center">
                                    <div className="col">
                                        <h3>{formData.routeStartTime || "날짜를 선택하세요"}</h3>
                                        <hr />
                                        <div className="row mt-4"  >
                                            <div className="col " >
                                                {/* {seats.map((seat) => (

                        <div className="row mt-2 w-100 text-center">
                            <div className="col">
                                <h3>{formData.routeStartTime || "날짜를 선택하세요"}</h3>
                                <hr />
                                <div className="row mt-4"  >
                                    <div className="col " style={{ backgroundImage: `url(${bus})`, backgroundSize: 'cover' }}>
                                        {/* {seats.map((seat) => (

                                                            <button
                                                                key={seat.seatNo}
                                                                (seat.seatNo)}
                                                                style={{
                                                                    backgroundColor:
                                                                        selectedSeat === seat.seatNo ? "green" : "lightgray",
                                                                    margin: "5px",
                                                                    padding: "10px",
                                                                    border: "1px solid black",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                <p>{seat.seatRow}행</p>
                                                                <p>{seat.seatColumn}열</p>
                                                                <p>버스번호:{seat.busNo}</p>
                                                            </button>
                                                        ))} */}


                                                {/* 좌석 라이브러리 */}
                                                <SeatGroup map={seats} setMap={setSeats}
                                                    fields={{
                                                        no: 'seatNo',
                                                        row: 'seatColumn',
                                                        col: 'seatRow',
                                                        reserved: 'reservationSeatNo',
                                                        disabled: 'seatDisabled',
                                                        checked: 'seatChecked',
                                                    }}
                                                    rows={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                                                    cols={[1, 2, '통로', 3, 4]}
                                                    showNames
                                                    onSeatClick={handleSeatClicks}
                                                />
                                            </div>
                                        </div>
                                        {checkedSeats.map(checkedSeat => (
                                            <td>{checkedSeat.seatNo}</td>
                                        ))}
                                        <div className="row mt-4">
                                            <div className="bus-details">
                                                <button className='btn btn-primary' onClick={handleGoBack}>이전화면</button>&nbsp;&nbsp;&nbsp;
                                            </div>
                                        </div>

                                        {/* 좌석 라이브러리 */}
                                        <SeatGroup map={seats} setMap={setSeats}
                                            fields={{
                                                no: 'seatNo',
                                                row: 'seatColumn',
                                                col: 'seatRow',
                                                reserved: 'reservationSeatNo',
                                                disabled: 'seatDisabled',
                                                checked: 'seatChecked',
                                            }}
                                            rows={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                                            cols={[1, 2, '통로', 3, 4]}
                                            showNames
                                            onSeatClick={handleSeatClicks}
                                            images={{
                                                defaultState : Seat3,
                                                checkedState : Seat2,
                                                reservedState : Seat4,
                                                disabledState : Seat1
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="row mt-4">
                                    <div className="bus-details">
                                        <button className='btn btn-primary' onClick={handleGoBack}>이전화면</button>&nbsp;&nbsp;&nbsp;

                                    </div>
                                </div>
                                <div className='row mt-5 mb-5'>
                                    <h3>예약하기</h3>
                                    <div className='col'>
                                        <select id="reservationCount" className="form-select w-50"  >
                                            <option value="">예약인원</option>
                                            <option value="1">1</option>
                                        </select>
                                    </div>
                                    <div className='col text-center'>
                                        <select id="reservationType" className="form-select w-50" onChange={handleReservationTypeChange}>
                                            <option value="">승객타입</option>
                                            <option value="성인">성인</option>
                                            <option value="청소년">청소년</option>
                                            <option value="어린이">어린이</option>
                                        </select>
                                    </div>
                                    <div className='row mt-4'>
                                        <div className='col'>
                                            <button className='btn'>결제하러가기</button>
                                        </div>
                                    </div>
                                    <div className='row mt-4 mb-5'>
                                        <div className='col'>
                                            {checkedSeats.map(checkedSeat => (<td>선택한좌석 : {checkedSeat.seatNo} 번 좌석</td>))}
                                        </div>
                                        <div className='col text-center'>
                                            <label>결제금액 : {fare !== null ? `${fare}원` : '선택된 승객 타입이 없습니다'}</label>
                                        </div>
                                    </div>
                                    <div className='row mt-4 mb-5'>
                                        <div className='col'>
                                        </div>
                                    </div>
                                    <div className='row mt-4 mb-5'>
                                        <div className='col'>
                                            <button className='btn btn-primary w-25' onClick={saveInput} >예약</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <>
                                <h1>여기에 예약관련 만들거임</h1>
                                <button className='btn btn-primary' onClick={saveInput} >예약</button>
                            </>
                        </>

                        </div>
                    </div>
                </>

            )}
                    </>
                    );
};

                    export default Reservation;
