import React, { useState } from 'react';

const TerminalInfo = () => {
    // 선택된 지역 상태 관리
    const [selectedRegion, setSelectedRegion] = useState('전체');

    // 지역 선택 핸들러
    const handleRegionChange = (event) => {
        setSelectedRegion(event.target.value);
    };

    // 데이터는 예시로 사용한 것으로 실제 데이터를 사용해야 합니다.
    const rows = [
        { label: '서울', name: '서울고속 (경부, 영동)', address: '서초구 반포동 19-4', phone: '1688-4700' },
        { label: '서울', name: '센트럴시티(서울)', address: '서초구 반포동 19-3', phone: '02)6282-0600' },
        { label: '서울', name: '동서울', address: '서울특별시 광진구 강변역로 50', phone: '1688-5979' },
        { label: '서울', name: '상봉', address: '중량구상봉동 83-1', phone: '02)490-7751~2' },
        { label: '경기', name: '고양(화정)', address: '	고양시 덕양구 화정동 974', phone: '1577-9884' },
        { label: '경기', name: '성남(분당)', address: '	성남시 분당구 야탑동 341 지상 1층 416호', phone: '1644-2689' },
        { label: '경기', name: '수원', address: '수원시 권선구 권선동 1189', phone: '1688-5455' },
        { label: '경기', name: '안산', address: '안산시 성포동 590', phone: '031)411-1917' },
        { label: '경기', name: '안성', address: '안성시 가사동 182', phone: '1688-1845' },
        { label: '경기', name: '여주', address: '여주시 여주읍 홍문리 269-4', phone: '031)884-3182' },
        { label: '경기', name: '여주종합', address: '여주시 여주읍 홍문리 274-1', phone: '031)885-9598' },
        
    ];

    return (
        <div className="page mt-4">
            <div className="noti_wrap taL mobNone">
                <p className="noti">전국의 고속버스 터미널 안내입니다.</p>
                <p className="desc">지역을 선택하시면 해당 지역에 소재한 고속버스 터미널을 확인할 수 있습니다.</p>
            </div>
            <div className="search_wrap type2 custom_input">
                <div className="box_inputForm click_box inselect">
                    <div className="payment value select-box sel_terminal">
                        <select onChange={handleRegionChange} title="지역 선택">
                            <option value="전체">전체</option>
                            <option value="서울">서울</option>
                            <option value="경기">경기</option>
                            <option value="인천">인천</option>
                            {/* 추가 지역 옵션 */}
                        </select>
                    </div>
                </div>
            </div>

            <div className="pop_gradeinfo marT30">
                <div className="tbl_type1 sort">
                    <table className="table">
                        <caption>고속버스 운송회사 안내</caption>
                        <colgroup>
                            <col style={{ width: "auto" }} />
                            <col style={{ width: "32%" }} />
                            <col style={{ width: "31%" }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col">고속회사</th>
                                <th scope="col">주소</th>
                                <th scope="col">전화번호</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.filter(row => selectedRegion === '전체' || row.label === selectedRegion).map((row, index) => (
                                <tr key={index}>
                                    <th scope="row" className="th_top">{row.name}</th>
                                    <td>{row.address}</td>
                                    <td className="btnR">
                                        {row.phone}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TerminalInfo;
