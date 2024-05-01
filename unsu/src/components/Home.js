import React, { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ko from 'date-fns/locale/ko';

import { FaArrowsAltH } from "react-icons/fa";
import { SiRollsroyce } from "react-icons/si";
import { MdOutlineAirlineSeatReclineExtra } from "react-icons/md";
import { BiFont } from "react-icons/bi";
import { MdOutlineAirlineSeatReclineNormal } from "react-icons/md";

const Home = () => {
  const [startDate, setStartDate] = useState(null); // 가는날 상태 추가
  const [endDate, setEndDate] = useState(null); // 오는날 상태 추가
  const [tripType, setTripType] = useState('oneway'); // 편도와 왕복을 구분하기 위한 상태 추가

  // 편도를 선택할 때 가는날 DatePicker만 보이도록 설정
  const handleOneWayClick = () => {
    setTripType('oneway');
  };

  // 왕복을 선택할 때 가는날과 오는날 DatePicker 모두 보이도록 설정
  const handleRoundTripClick = () => {
    setTripType('roundtrip');
  };

  return (
    <>
      <h3 className="">운수좋은날</h3>

      <div className="container-sm border border-5 rounded p-3 mb-3">
        {/* 편도와 왕복 */}
        <div className="row align-items-center ">
          <div className="col text-center border-end border-primary smooth-hover " onClick={handleOneWayClick}>
            <span className="font-style">편도</span>
          </div>
          <div className="col text-center smooth-hover  " onClick={handleRoundTripClick}>
            <span className="font-style">왕복</span>
          </div>
        </div>
      </div>

      <div className="container-sm border border-5 rounded p-5 mb-3">
        {/* 출발지 */}
        <div className="row align-items-center">
          <div className="col-md-2 p-5 text-center border border-5 rounded p-1 mb-3 smooth-hover ">
            <span className="d-inline-block font-style">출발</span>
          </div>
          <div className="col-md-1 p-1 text-center rounded p-1 mb-1">
            <FaArrowsAltH />
          </div>

          <div className="col-md-2 p-5 text-center border border-5 rounded p-1 mb-3 smooth-hover ">
            <span className="d-inline-block font-style">도착</span>
          </div>
          <div className="col-md-1"></div> {/* 빈 컬럼 추가 */}
          {tripType === 'oneway' && (
            <div className="col-md-2 p-3 text-center border border-5 rounded p-4 mb-3 smooth-hover ">
              <span className="d-inline-block font-style">가는날</span>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd (eee)"
                className="form-control"
                locale={ko}
                dayClassName={(date) => (date.getDay() === 0 || date.getDay() === 6 ? 'weekend' : '')}
              />
              {startDate && <div>{startDate.toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>}
            </div>
          )}
          {tripType === 'roundtrip' && (
            <>
              <div className="col-md-2 p-3 text-center border border-5 rounded p-4 mb-3 smooth-hover ">
                <span className="d-inline-block font-style">가는날</span>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd (eee)"
                  className="form-control"
                  locale={ko}
                  dayClassName={(date) => (date.getDay() === 0 || date.getDay() === 6 ? 'weekend' : '')}
                />
                {startDate && <div>{startDate.toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>}
              </div>
              <div className="col-md-1"></div> {/* 빈 컬럼 추가 */}
              <div className="col-md-2 p-3 text-center border border-5 rounded p-4 mb-3 smooth-hover ">
                <span className="d-inline-block font-style">오는날</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="yyyy-MM-dd (eee)"
                  className="form-control"
                  locale={ko}
                  dayClassName={(date) => (date.getDay() === 0 || date.getDay() === 6 ? 'weekend' : '')}
                />
                {endDate && <div>{endDate.toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="container-sm border border-5 rounded p-3">
        <div className="row align-items-center">
          <div className="col-md-1"></div> {/* 빈 컬럼 추가 */}
          <div className="col-md-4 p-5 border border-5 rounded p-4 mb-3 d-flex flex-column">
            <div>등급</div>
            <div className="d-flex justify-content-between">
              <div>
                <SiRollsroyce />
                <span className="smooth-hover md-1">프리미엄</span>
              </div>
              <div>
                <MdOutlineAirlineSeatReclineExtra />
                <span className="smooth-hover md-1">우등</span>
              </div>

              <div>
                <MdOutlineAirlineSeatReclineNormal />
                <span className="smooth-hover md-1">일반</span>
              </div>
              <div>
                <BiFont />
                <span className="smooth-hover md-1">전체</span>
              </div>
            </div>
          </div>

          <div className="col-md-2"></div> {/* 빈 컬럼 추가 */}
          <div className="col-md-4 p-5 text-center border border-5 rounded p-4 mb-3 smooth-hover ">
            <span className="d-inline-block font-style">조회하기</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;