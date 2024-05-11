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
        { label: '경기', name: '의정부', address: '의정부시 금오동 369-5', phone: '1688-0314' },
        { label: '경기', name: '용인', address: '용인시 김량장동 23-1', phone: '031)339-3181' },
        { label: '경기', name: '용인유방', address: '용인시 처인구 유방동 310-12번지', phone: '031)338-2510' },
        { label: '경기', name: '이천', address: '이천시 중리동 219-1', phone: '031)634-3183' },
        { label: '경기', name: '평택', address: '평택시 평택동 55-5', phone: '031)655-2453' },
        { label: '경기', name: '평택대', address: '평택시 소사동 4-3', phone: '031)658-1850' },
        { label: '경기', name: '광명', address: '광명시 광명역로 51', phone: '02)899-8110' },
        { label: '경기', name: '오산', address: '경기 오산시 역광장로 59', phone: '031)377-3215' },
        { label: '경기', name: '시흥시화', address: '경기 시흥시 정왕동 1745-6', phone: '031)434-8686' },
        { label: '인천', name: '인천', address: '인천광역시 미추홀구 연남로 35', phone: '1666-7114' },
        { label: '강원', name: '원주', address: '원주시 서원대로 171', phone: '033)734-4114' },
        { label: '강원', name: '강릉', address: '강릉시 홍제동 992-2', phone: '033)641-3184' },
        { label: '강원', name: '속초', address: '속초시 조양동 1418', phone: '033)631-3181' },
        { label: '강원', name: '동해', address: '동해시 부곡동 88', phone: '033)531-3400' },
        { label: '강원', name: '삼척', address: '삼척시 남양동 334-1', phone: '033)572-7444' },
        { label: '강원', name: '춘천', address: '춘천시 온의동 111-2', phone: '033)256-1571' },
        { label: '강원', name: '양양', address: '양양군 양양읍 동해대로 2700', phone: '033)672-4100 ' },
        { label: '충남', name: '공주', address: '공주시 신관동 609', phone: '041)855-2319' },
        { label: '충남', name: '금산', address: '금산군 금산읍 상리 34-10', phone: '041)754-2100' },
        { label: '충남', name: '논산', address: '논산시 논산읍 취암동 599-3', phone: '041)735-3678' },
        { label: '충남', name: '온양', address: '아산시 모종동 557-3', phone: '041)544-4880' },
        { label: '충남', name: '연무대', address: '논산시 연무읍 안심8동 1125', phone: '041)741-6670' },
        { label: '충남', name: '조치원', address: '연기군 조치원읍 상리 96', phone: '044)850-0225' },
        { label: '충남', name: '세종시', address: '세종특별자치시 대평동 269-19', phone: '070-4904-3262' },
        { label: '충남', name: '천안', address: '천안시 신부동 354-1', phone: '041)551-4933' },
        { label: '충남', name: '예산', address: '예산군 예산읍 산성리 647', phone: '041)333-2911' },
        { label: '충남', name: '홍성', address: '홍성군 홍성읍 고암리 1042', phone: '041)632-2425' },
        { label: '충남', name: '보령', address: '보령시 궁촌동 347', phone: '041)936-5757' },
        { label: '충남', name: '당진', address: '당진군 당진읍 수청리 979', phone: '041)355-1129' },
        { label: '충남', name: '서산', address: '서산시 동문동 309-3', phone: '041)665-0465' },
        { label: '충남', name: '태안', address: '태안군 태안읍 남문리 701', phone: '041)674-2009' },
        { label: '충남', name: '대천욕장', address: '보령시 신흑동 10단지 아-10', phone: '' },
        { label: '충남', name: '안면도', address: '태안군 안면읍 승언리 1243-3', phone: '041)943-2681' },
        { label: '충남', name: '덕산스파', address: '예산군 덕산면 사동리 361', phone: '' },
        { label: '충남', name: '청양', address: '청양군 청양읍 읍내리 208-4', phone: '041)943-2681' },
        { label: '대전', name: '대전', address: '대전시 동구 용전동 63-3', phone: '042)625-8791' },
        { label: '대전', name: '대전청사(샘머리)', address: '대전시 서구 둔산2동 908', phone: '042)485-0181' },
        { label: '대전', name: '유성', address: '대전시 유성구 장대동 281-23', phone: '042)822-0386' },
        { label: '충북', name: '제천', address: '제천시 의림동 25-24', phone: '043)648-3182' },
        { label: '충북', name: '청주', address: '충북 청주시 흥덕구 강서동 531', phone: '043)230-1657' },
        { label: '충북', name: '충주', address: '충주시 칠금동 849', phone: '043)856-7000' },
        { label: '충북', name: '황간(상행)', address: '충북 영동군 황간면 신촌 2길 7-5 인근 경부고속도로 간이 정류장', phone: '' },
        { label: '충북', name: '황간(하행)', address: '충북 영동군 황간면 신촌 3길 7-6 인근 경부고속도로 간이 정류장', phone: '' },
        { label: '전북', name: '전주공용', address: '전주시 덕진구 금암동 767-2', phone: '063)277-1572' },
        { label: '전북', name: '고창', address: '고창군 고창읍 읍내리 629', phone: '063)563-3388' },
        { label: '전북', name: '군산', address: '군산시 경암동 612-7', phone: '063)445-3824' },
        { label: '전북', name: '김제', address: '김제시 요촌동 47-28', phone: '063)544-0075' },
        { label: '전북', name: '남원', address: '남원시 용성로 109', phone: '063)625-5391' },
        { label: '전북', name: '부안', address: '부안군 부안읍 봉덕리 574-13', phone: '063)584-2098' },
        { label: '전북', name: '순창', address: '순창군 순창읍 순화리 114-9', phone: '063)653-2186' },
        { label: '전북', name: '익산', address: '익산시 익산대로 52', phone: '063)855-0345' },
        { label: '전북', name: '정읍', address: '정읍시 연지동 312-12', phone: '063)535-4240' },
        { label: '경북', name: '구미', address: '구미시 원평1동1073-1', phone: '054)452-5750' },
        { label: '경북', name: '김천', address: '김천시 성내동 38-1', phone: '054)432-7600' },
        { label: '경북', name: '경주', address: '경주시 노서동 243-5', phone: '054)741-4000' },
        { label: '경북', name: '상주', address: '상주시 무양동 291', phone: '054)534-9002' },
        { label: '경북', name: '영주', address: '영주시 대학로 352(가흥동)', phone: '054)631-3264' },
        { label: '경북', name: '영천', address: '영천시 금노동 584-3', phone: '054)334-2556' },
        { label: '경북', name: '안동', address: '안동시 송현동 713-6', phone: '1688-8228' },
        { label: '경북', name: '점촌', address: '문경시 모전로 54', phone: '054)556-7707' },
        { label: '경북', name: '포항(천일)', address: '포항시 남구 해도동 33-7', phone: '054)272-1001' },
        { label: '대구', name: '대구금호', address: '대구시 동구 신천4동 329-3', phone: '053)743-4787' },
        { label: '대구', name: '대구동양', address: '대구시 동구 신천4동 328-2', phone: '053)743-3950' },
        { label: '대구', name: '대구중앙', address: '대구시 동구 신천4동 327-1', phone: '053)743-2662' },
        { label: '대구', name: '대구한진', address: '대구시 동구 신천4동 328-1', phone: '053)743-3701' },
        { label: '대구', name: '서대구', address: '대구시 북구 노원3가 685', phone: '1666-2600' },
        { label: '광주', name: '광주', address: '광주시 서구 광천동 49-1', phone: '	062)360-8114' },
        { label: '부산', name: '부산', address: '부산시 금정구 노포동 133', phone: '1577-9956' },
        { label: '부산', name: '서부산(사상)', address: '부산시 사상구 괘법동 533번지', phone: '1577-8301' },
        { label: '울산', name: '울산', address: '울산시 남구 삼산동 1480-4', phone: '1688-7797' },
        { label: '울산', name: '울산신북', address: '울산시 남구 무거동 327-21번지', phone: '052)249-5777' },
        { label: '경남', name: '마산', address: '마산시 양덕2동 154-1', phone: '055)255-2576' },
        { label: '경남', name: '내서', address: '마산시 내서읍 중리 895-1 농수산물 도매시장내', phone: '055)231-0113' },
        { label: '경남', name: '진주', address: '진주시 칠암동 489-2', phone: '1688-0091' },
        { label: '경남', name: '창원', address: '창원시 팔용동 용원상업지구 35', phone: '055)288-3355' },
        { label: '경남', name: '김해', address: '김해시 외동 1264', phone: '055)327-7898' },
        { label: '경남', name: '통영', address: '통영시 광도면 죽림리 1569번지', phone: '055)644-0018' },
        { label: '전남', name: '강진', address: '강진군 강진읍 평동리 167-1', phone: '061)434-2053' },
        { label: '전남', name: '고흥', address: '고흥군 고흥읍 소문리 218-11', phone: '061)833-0009' },
        { label: '전남', name: '광양', address: '광양시 광양읍 인동리 413', phone: '061)762-3030' },
        { label: '전남', name: '동광양', address: '광양시 중동 1691', phone: '061)795-8289' },
        { label: '전남', name: '나주', address: '나주시 중앙동 95-2', phone: '061)333-1323' },
        { label: '전남', name: '녹동', address: '고흥군 도양읍 봉암리 1613-1', phone: '061)842-2706' },
        { label: '전남', name: '담양', address: '담양군 담양읍 지침리 132-17', phone: '061)381-3233' },
        { label: '전남', name: '목포', address: '목포시 상동 220', phone: '061)276-0220' },
        { label: '전남', name: '문장', address: '함평군 해보면 문장리 822-24', phone: '061)323-0068' },
        { label: '전남', name: '무안', address: '무안군 무안읍 성동리 873-11', phone: '061)453-2518' },
        { label: '전남', name: '보성', address: '보성군 보성읍 원봉리 5-1', phone: '061)852-2777' },
        { label: '전남', name: '벌교', address: '보성군 벌교읍 회정리 432', phone: '061)857-2150' },
        { label: '전남', name: '순천', address: '순천시 장천동 18-22', phone: '061)744-4296' },
        { label: '전남', name: '여수', address: '여수시 오림동 390', phone: '061)652-6977' },
        { label: '전남', name: '여천', address: '여수시 무선로 200', phone: '061)686-7666' },
        { label: '전남', name: '영광', address: '영광군 영광읍 신하리 10-1', phone: '061)353-3360' },
        { label: '전남', name: '영산포', address: '나주시 이창동 191', phone: '061)332-2345' },
        { label: '전남', name: '영암', address: '영암군 영암읍 남풍리 4-1', phone: '061)473-3355' },
        { label: '전남', name: '완도', address: '완도군 완도읍 군내리 1230', phone: '061)552-1500' },
        { label: '전남', name: '장흥', address: '장흥군 장흥읍 건산리 382', phone: '061)863-9036' },
        { label: '전남', name: '진도', address: '진도군 진도읍 남동리 782-1', phone: '061)544-2141' },
        { label: '전남', name: '함평', address: '함평군 함평읍 기각리 88-1', phone: '061)322-0660' },
        { label: '전남', name: '해남', address: '해남군 해남읍 해리 401', phone: '061)534-0884' },
        { label: '전남', name: '삼호', address: '영암군 삼호읍 삼호중앙로 246', phone: '061)461-6333' }
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
                            <option value="강원">강원</option>
                            <option value="충남">충남</option>
                            <option value="대전">대전</option>
                            <option value="충북">충북</option>
                            <option value="전북">전북</option>
                            <option value="경북">경북</option>
                            <option value="대구">대구</option>
                            <option value="광주">광주</option>
                            <option value="전남">전남</option>
                            <option value="경남">경남</option>
                            <option value="울산">울산</option>
                            <option value="부산">부산</option>
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
