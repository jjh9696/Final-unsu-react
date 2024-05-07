// import
import React, { useState, useRef } from "react";
import axios from "../../utils/CustomAxios";
import { useNavigate } from "react-router";
// import Post from "../../utils/Post";

const Join = () => {
    const inputRef = useRef();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        memberId: "",
        memberPw: "",
        memberPwCheck: "",
        memberName: "",
        memberBirth: "",
        memberEmail: "",
        memberPhone: "",
        memberLevel: "",
        memberJoinDate: "",
        memberPoint: "",
        memberZip: "",
        memberAddr1: "",
        memberAddr2: "",
        memberPrivacyAgree: "",
        memberPrivacyDate: "",
        memberServiceAgree: "",
        memberBusAgree: "",
    });

    const [result, setResult] = useState({
        memberId: null,
        memberPw: null,
        memberPwCheck: null,
        memberName: null,
        memberBirth: null,
        memberEmail: null,
        memberPhone: null,
        memberLevel: null,
        memberJoinDate: null,
        memberPoint: null,
        memberZip: null,
        memberAddr1: null,
        memberAddr2: null,
        memberPrivacyAgree: null,
        memberPrivacyDate: null,
        memberServiceAgree: null,
        memberBusAgree: null,
    });

    const [duplicateId, setDuplicateId] = useState(false);
    const [certSent, setCertSent] = useState(false);
    const [certCode, setCertCode] = useState("");
    const [validCert, setValidCert] = useState(null);


    // 체크박스 변경 핸들러
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        // 체크된 상태에 따라 'Y' 또는 'N' 값 설정
        setFormData({
            ...formData,
            [name]: checked ? 'Y' : 'N',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "memberId") {
            setDuplicateId(false);
        }


        setFormData({
            ...formData,
            [name]: value
        });
    };
    const [enroll_company, setEnroll_company] = useState({
        address: '',
    });

    const [popup, setPopup] = useState(false);

    const handleInput = (e) => {
        setEnroll_company({
            ...enroll_company,
            [e.target.name]: e.target.value,
        })
    }

    const handleComplete = (data) => {
        setPopup(!popup);
    }

    const checkJoin = () => {
        // 유효성 검사 로직
        const idRegx = /^[a-z][a-z0-9-]{4,19}$/;
        const idMatch = formData.memberId.length === 0 ? null : idRegx.test(formData.memberId);

        const pwRegx = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$])[A-Za-z0-9!@#$]{8,15}$/;
        const pwMatch = formData.memberPw.length === 0 ? null : pwRegx.test(formData.memberPw);

        const pwCheckMatch =
            formData.memberPw.length === 0 ? null : formData.memberPwCheck.length > 0 && formData.memberPw === formData.memberPwCheck;

        const phoneRegex = /^010[1-9][0-9]{7}$/;
        const phoneMatch = formData.memberPhone.length === 0 ? null : phoneRegex.test(formData.memberPhone);

        const emailRegx = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        const emailMatch = formData.memberEmail.length === 0 ? null : emailRegx.test(formData.memberEmail);

        const zipRegx = /^[0-9]{5,6}$/;
        const zipMatch = formData.memberZip.length === 0 ? null : zipRegx.test(formData.memberZip);

        setResult({
            memberId: idMatch,
            memberPw: pwMatch,
            memberPwCheck: pwCheckMatch,
            memberPhone: phoneMatch,
            memberEmail: emailMatch,
            memberZip: zipMatch
        });
    };


    // 이메일 전송
    const handleCertSend = async () => {
        try {
            if (formData.memberEmail) {
                const response = await axios.post("/cert/sendCert/" + formData.memberEmail);
                console.log('이메일이 성공적으로 전송되었습니다.');
            } else {
                console.error('유효하지 않은 이메일입니다.');
            }
        } catch (error) {
            if (error.response) {
                // 서버에서 상태 코드가 제공된 경우
                console.error('이메일 전송 중 오류가 발생했습니다:', error.response.data);
            } else if (error.request) {
                // 요청이 발생하지 않은 경우
                console.error('이메일 전송 요청에 문제가 발생했습니다:', error.request);
            } else {
                // 오류를 발생시킨 요청을 설정하는 데 문제가 있는 경우
                console.error('이메일 전송 요청에 오류가 있습니다:', error.message);
            }
        }
    };
    const handleCertInputChange = (e) => {
        // input에 입력된 인증번호 certCode에 저장
        setCertCode(e.target.value);
    };
    // 인증번호 확인
    const checkCertCode = async () => {
        try {
            const response = await axios.post('/cert/checkCert', {
                certEmail: formData.memberEmail, // 입력창에 기입된 이메일과
                certCode: certCode // 입력된 인증번호를 비동기로 매치검사
            });
            console.log('요청:', response.data);
            // 여기서 인증에 성공했을 때 setIsCertified 상태를 true로 설정합니다.
            setValidCert(true);
        } catch (error) {
            console.error('요청 실패:', error);
        }
    };





    // 모든 입력이 유효한지 확인하는 함수(입력값이 정규검사를 통과했으면!)
    const areAllInputsValid = () => {
        return (
            result.memberId === true &&
            result.memberPw === true &&
            result.memberPwCheck === true &&
            result.memberPhone === true &&
            result.memberEmail === true &&
            validCert === true
        );
    };

    // 중복 아이디 체크
    const checkIdClick = async () => {
        const join = await axios.get(`/member/check/${formData.memberId}`)
            .then((idResponse) => {
                if (idResponse.data.exists) {
                    console.log('중복된 아이디입니다. 다른 아이디를 사용하세요.');
                    setDuplicateId(true); // 중복된 아이디 발견 시 duplicateId를 true로 설정
                    inputRef.current.focus(); // 중복 오류 발생 시 해당 입력 필드로 포커스 이동
                } else {
                    console.log('존재하지 않는 아이디입니다.');
                    setDuplicateId(false);
                    setResult({ ...result, memberId: null }); // 중복 아이디가 없을 때 memberId 관련 상태 초기화
                }
            })
            .catch((idError) => {
                console.error('아이디 중복 확인 실패:', idError);
            });
        const handleComplete = () => {
            setPopup(!popup); // 모달 열기/닫기 토글
        };
    };

    const joinStart = async (e) => {
        e.preventDefault(); // 브라우저의 기본 폼 제출 방지

        // 모든 입력이 유효한지 확인
        if (!areAllInputsValid()) {
            console.error('폼에 유효하지 않거나 누락된 데이터가 있습니다.');
            return;
        }
        console.log('Form Data:', formData);

        try {
            // 비동기로 백엔드에 POST 요청을 보냅니다.
            const response = await axios.post('/member/join', formData);

            // 회원가입 성공 후 처리
            console.log('회원가입 성공:', response.data);
            // 성공적으로 가입했을 경우 리다이렉트하거나 폼 데이터를 초기화할 수 있습니다.
            navigate('/'); // 이동할 페이지가 있으면 이 줄을 사용하세요

        } catch (error) {
            // 회원가입 중 오류 발생 시 처리
            console.error('회원가입 중 오류 발생:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <form onSubmit={joinStart}>
            <div className="container mt-5 ms-5 w-75">
                <div className="row mt-4">
                    <div className="row">
                        <div className="col">
                            <h1> 회원가입</h1>
                            <div className="row">
                                <div className="col">
                                    <div className="accordion" id="accordionExample">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingOne">
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                                    개인정보 수집 및 이용동의(필수)
                                                </button>
                                            </h2>
                                            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample" >
                                                <div className="accordion-body" style={{ fontSize: '10px' }}>
                                                    <strong>[필수] 개인정보 수집 및 이용에 관한 동의</strong> 수집 및 이용목적	수집 및 이용 항목	보유기간
                                                    회원 관리 및 서비스 제공	이메일주소, 비밀번호, 휴대전화번호	동의 철회 또는 회원 탈퇴 시 까지 (단, 관련 법령에 별도의 규정이 있는 경우에는 그 기간을 따름)
                                                    <code>동의를 거부할 경우 회원가입이 불가합니다.</code>
                                                </div>
                                                <div className="row">
                                                    <div className="col pt-2 pb-2 ms-2">
                                                        <input
                                                            type="checkbox"
                                                            name="memberPrivacyAgree"
                                                            checked={formData.memberPrivacyAgree === 'Y'}
                                                            onChange={handleCheckboxChange}
                                                        />
                                                        동의
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingTwo">
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                                                    서비스 이용약관 동의(필수)
                                                </button>
                                            </h2>
                                            <div id="collapseTwo" className="accordion-collapse collapse " aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                <div className="accordion-body" style={{ fontSize: '8px' }}>
                                                    제1장 총칙
                                                    제1조 (목적)
                                                    본 약관은 운수좋은날(이하 ‘회사’라 합니다)가 제공하는 고속버스 운수좋은날/시외버스 운수좋은날 어플리케이션 서비스 및 고속버스통합예매 홈페이지의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 기타 제반 사항을 정함에 그 목적이 있습니다.
                                                    제2조 (약관의 적용)
                                                    ① 서비스 이용자에게는 본 약관과 여객운송 사업자의 운송약관이 적용됩니다.
                                                    ② 본 약관에서 규정되지 않은 사항에 대해서는 여객운송 사업자의 운송약관에 따릅니다.
                                                    제3조 (용어의 정의)
                                                    ① 본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
                                                    1. “서비스”란 이용자가 모바일 어플리케이션 상에서 고속ㆍ시외버스 승차권의 예매 및 예매 확인, 고속ㆍ시외버스 출발시간 확인과 기타 부가 기능을 이용 할 수 있도록 회사가 제공하는 서비스(고속버스 운수좋은날 및 시외버스 운수좋은날 어플리케이션, 고속버스통합예매 홈페이지)를 말합니다.
                                                    2. “모바일 기기”란 어플리케이션의 설치가 가능한 운영체재를 탑재하고 있는 스마트 폰, 태블릿 PC 등의 이동 통신 기기를 말합니다.
                                                    3. “이용자”란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원과 비회원을 말합니다.
                                                    4. “회원”이란 회사가 정한 회원 가입 절차에 따라 계정 등록을 마친 이용자로서 결제 내역 조회, 1:1문의 등의 추가 기능을 사용할 수 있는 자를 말합니다.
                                                    5. “비회원”이란 회원 가입 절차에 따른 계정 등록을 하지 않고 서비스를 이용하는 자를 말합니다.
                                                    6. “모바일 승차권”이란 여객운송 사업자가 발행하는 고속ㆍ시외버스 승차권을 모바일 기기 어플리케이션으로 전송 받은 것을 말합니다.
                                                    7. “결제”란 이용자가 서비스 내에서 제공되는 결제수단으로 고속ㆍ시외버스 승차권의 예매 대금을 지불하는 행위를 말합니다.
                                                    8. “환불”이란 어플리케이션에서 예매한 승차권을 취소할 때 예매 대금을 이용자와 회사 간에 약정된 방법과 절차에 따라 이용자에게 돌려주는 것을 말합니다.
                                                    9. “모바일운수좋은날”란 이동전화, 태블릿, 기타 모바일 기기 내에 장착되는 USIM chip 또는 SE(Secure Element, Embedded SE/Secure Memory card 등, 이하 USIM chip 등이라 함) 등에 회사가 발급하는 선불전자지급수단을 말합니다.
                                                    10. “신용카드”란 서비스 상에서 고속ㆍ시외버스 승차권의 예매 대금을 결제 할 수 있도록 회사와 계약이 체결 된 은행 또는 신용카드사가 발행한 신용카드 및 체크카드를 말합니다.
                                                    ② 본 약관에서 사용하는 용어의 정의는 제1항에서 정하는 것을 제외하고는 여객운송 사업자의 운송약관, 관계 법령 및 서비스 별 안내에서 정하는 바에 의합니다.
                                                    제4조 (약관의 효력 및 변경)
                                                    ① 본 약관은 회사가 본 약관의 내용을 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지하고, 이용자가 이에 동의함으로써 적용됩니다.
                                                    ② 회사는 필요하다고 인정되는 경우, 「약관의 규제에 관한 법률」, 「전자금융거래법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.
                                                    ③ 회사가 약관을 변경할 경우에는 적용일자 및 변경사유를 명시하여 제1항과 같은 방법으로 그 시행일자로부터 14일 전에 공지합니다. 단, 이용자에게 불리한 약관 내용의 변경에 대해서는 30일 전에 공지합니다. 이용자의 연락처 변경 등으로 인하여 회사가 각 이용자에게 개별 통지 하기가 어려운 경우에는 본 항의 공지를 함으로써 개별 통지 한 것으로 간주합니다.
                                                    ④ 이용자가 제3항에 따라 변경된 약관에 동의하지 않을 경우 서비스의 이용을 중단하고 이용 계약을 해지할 수 있습니다. 다만, 변경 약관 시행일의 전날까지 명시적으로 약관 변경 거부 의사를 표시하지 아니할 경우 변경 약관에 동의한 것으로 간주합니다.
                                                    제2장 서비스의 이용
                                                    제5조 (서비스 이용 계약의 체결)
                                                    ① 이용자는 약관 동의 후 서비스의 이용이 가능합니다.
                                                    ② 결제 내역 조회, 1:1문의 등 기타 추가 기능을 사용하기 위해서는 서비스 내 회원가입 절차를 통해 계정을 등록해야 합니다.
                                                    ③ 회원가입 고객은 하나의 아이디와 비밀번호를 통해 본 약관 제3조 1항에 명시되어 있는 서비스를 이용할 수 있습니다.
                                                    ④ 회사는 다음 각 호에 해당하는 회원가입 신청의 경우에는 이를 승낙하지 아니할 수 있습니다.
                                                    1. 기술상 서비스 제공이 불가능한 경우
                                                    2. 다른 사람의 정보를 사용하는 등 허위로 신청하는 경우
                                                    3. 이용자가 본 조 제2항에 따른 계정 등록 시 등록 사항을 누락하거나 잘못 입력 한 경우
                                                    4. 공공질서 또는 미풍양속을 저해하거나 저해할 목적으로 신청한 경우
                                                    5. 기타 회사가 정한 이용 신청 요건이 충족되지 않았을 경우
                                                    제6조(서비스의 제공 및 변경)
                                                    ① 서비스의 제공은 연중무휴 1일 24시간을 원칙으로 하며, 구체적인 종류와 세부내용은 서비스 내 사용방법 FAQ 및 서비스 별 안내에 따릅니다.
                                                    ② 회사는 기술적 사양의 변경 또는 기타 불가피한 여건이나 사정 등이 있는 경우에는 서비스의 내용을 변경 할 수 있습니다. 이 경우 변경된 서비스의 내용 및 제공 일자를 명시하여 이용자에게 공지 합니다.
                                                    제7조 (서비스의 중단)
                                                    ① 회사는 다음 각 호에 해당하는 경우 이용자에 대한 서비스 제공을 중지 할 수 있습니다.
                                                    1. 컴퓨터, 서버 등 서비스 제공을 위한 설비의 보수, 점검, 교체, 고장 등으로 인하여 부득이 한 경우
                                                    2. 정전, 제반 설비의 장애 또는 이용량의 폭주 등으로 정상적인 서비스 제공에 지장이 있는 경우
                                                    3. 서비스 제휴 업체와의 계약 종료 등과 같은 회사의 제반 사정 또는 법률상의 장애 등으로 서비스를 유지할 수 없는 경우
                                                    4. 기타 천재지변, 국가비상사태 등 불가항력적 사유가 있는 경우
                                                    ② 제1항에 의한 사유로 서비스가 일시 중지될 경우 회사는 인터넷 홈페이지 또는 어플리케이션을 통해 이를 사전에 공지합니다. 다만, 운영자의 고의 또는 과실이 없는 서버 장애, 시스템 다운 등 회사가 통제할 수 없는 사유로 인하여 이용자에게 사전 통지가 불가능한 경우에는 사후에 통지 할 수 있습니다.
                                                    제8조 (회원 탈퇴 및 자격 상실 등)
                                                    ① 회원은 언제든지 어플리케이션 내 ‘설정’ 메뉴를 통해 회원 탈퇴를 신청 할 수 있습니다. 단, 승차권 예매 후 탑승이 이루어지지 않은 모바일 승차권을 보유하고 있을 경우에는 해당 승차권의 예매를 취소한 후 회원 탈퇴가 가능 하며, 본 약관 제3조 1항의 서비스에서 예매한 승차권 조회 및 이용이 불가 합니다.
                                                    ② 다음 각 호의 사유에 해당하는 경우 회사는 회원의 자격을 정지 또는 상실 시킬 수 있습니다.
                                                    1. 가입 신청 시 허위의 내용을 등록 한 경우
                                                    2. 타인의 명예를 손상시키거나 불이익을 주는 행위
                                                    3. 서비스와 관련된 설비의 오 동작이나 정보 등의 파괴 및 혼란을 유발시키는 컴퓨터 바이러스 감염 자료를 등록 또는 유포하는 행위
                                                    4. 다른 사람의 개인정보를 도용하거나 서비스 이용을 방해하는 경우
                                                    5. 서비스를 이용하여 법령 또는 이 약관이 금지하는 행위를 하는 경우
                                                    6. 현금 융통, 시세 차익을 노린 승차권 선 예매 등 비정상적인 목적으로 서비스를 이용하는 경우
                                                    7. 서비스의 이용과 관련하여 취득한 타인의 개인정보를 무단으로 유용 또는 유출하는 행위
                                                    제9조 (승차권 예매)
                                                    ① 서비스내에서 승차권 예매 시 이용자에게 부과되는 예매 수수료는 없으며, 이용자는 신용카드, 모바일운수좋은날 또는 기타 회사가 추가로 정의하는 결제수단을 통해 결제 할 수 있습니다.
                                                    ② 결제 수단 또는 예매 수수료와 관련하여 변경 사항이 발생하는 경우 회사는 그 내용을 서비스 내에 사전 고지 합니다.
                                                    제10조 (취소 및 환불)
                                                    ① 서비스를 통한 예매 건의 취소 마감 시간은 서비스 내에 별도로 안내하며 취소 마감 시간은 여객운송 사업자, 터미널 등 관련 기관의 사정에 의해 변경 될 수 있습니다.
                                                    ② 승차권 예매 취소에 따른 따른 환불 수수료는 여객운송 사업자의 운송약관이 정한 바에 따릅니다.
                                                    제3장 회사와 이용자의 권리 및 의무
                                                    제11조 (회사의 의무)
                                                    ① 회사는 법령 또는 이 약관이 금지하는 사항 또는 공공질서ㆍ미풍양속에 반하는 행위를 하지 않으며, 이 약관이 정하는 바에 따라 지속적이고 안정적으로 서비스를 제공하는데 최선을 다 하여야 합니다.
                                                    ② 회사는 이용자가 안전하게 서비스를 이용 할 수 있도록 이용자의 개인정보(신용정보 포함) 보호를 위한 보안 시스템을 갖추어야 하며, 개인정보 처리 방침을 공시하고 준수 합니다.
                                                    ③ 회사는 이용자의 정보 수집 시 서비스 제공에 필요한 최소한의 정보를 수집하며 이용자가 제공한 개인정보를 본인의 승낙 없이 타인에게 누설, 제공 하여서는 안됩니다. 다만 법령에 의하여 허용되는 경우에는 제공 할 수 있습니다.
                                                    제12조 (이용자의 의무)
                                                    ① 이용자는 회원 가입을 위한 개인정보 또는 예매를 위한 결제 정보 입력 등 서비스 이용을 위해 필요한 정보를 입력 할 경우 사실과 일치하는 정확한 정보를 입력해야 하며 이용자가 부정확한 정보를 제공하여 발생하는 불이익에 대하여 회사는 책임을 지지 않습니다.
                                                    ② 이용자는 본 약관 제8조 제2항에 기재된 행위를 하여서는 안됩니다.
                                                    ③ 이용자는 관계 법령 및 이 약관의 규정 또는 이용 안내 등 회사가 통지하는 사항을 준수하여야 하며, 기타 회사의 업무에 방해가 되는 행위를 해서는 안됩니다.
                                                    제4장 기타
                                                    제13조 (이용자에 대한 통지)
                                                    ① 회사가 회원에 대하여 통지를 하는 경우 회원이 회원 가입 시 제공한 이메일 주소 또는 이동전화 번호를 통해 통지할 수 있습니다.
                                                    ② 불특정 다수의 이용자에 대한 통지의 경우 어플리케이션 또는 홈페이지 내의 공지사항에 게시함으로써 개별 통지에 갈음할 수 있습니다.
                                                    제14조 (이용자의 개인정보보호)
                                                    회사는 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령이 정하는 바에 따라 이용자의 개인정보를 보호하기 위해 노력합니다.

                                                    제15조 (정보의 제공 및 광고의 게재)
                                                    ① 회사는 서비스를 운영함에 있어 회사의 서비스 관련 각종 정보 및 광고(회사 및 제휴사 광고 포함)를 서비스 화면에 게재할 수 있습니다.
                                                    ② 이용자가 서비스상에 게재되어 있는 광고를 이용하거나 서비스를 통한 광고주의 판촉 활동에 참여하는 등의 방법으로 교신 또는 거래를 하는 것은 이용자의 선택입니다. 회사는 이용자와 광고주를 연결하는 시스템만 제공할 뿐, 광고주 혹은 이용자를 대변하지 않습니다.
                                                    제16조 (회사의 연락처)
                                                    회사의 상호, 주소, 및 전화번호 등은 다음과 같습니다.

                                                    ① 상호: 주식회사 운수좋은날
                                                    ② 주소: 서울 영등포구 선유동2로 57 이레빌딩 19F
                                                    ④ E-mail : unsulucky@unsu.co.kr
                                                    제17조 (양도금지)
                                                    이용자 및 회사는 이용자의 서비스 사용 및 회원 가입에 따른 본 약관 상의 지위 또는 권리, 의무의 전부 또는 일부를 제3자에게 양도, 위임하거나 담보제공 등의 목적으로 처분할 수 없습니다.

                                                    제18조 (손해배상)
                                                    어느 일방이 본 약관의 규정을 위반함으로써 상대방에게 손해가 발생한 경우, 규정을 위반한 일방이 상대방의 손해에 대해 배상하여야 합니다. 또한 어느 일방의 규정 위반 행위로 인하여 상대방이 제3자로부터 손해배상청구 또는 소송을 비롯한 각종 이의 제기를 받는 경우 귀책 당사자는 자신의 책임과 비용으로 상대방을 면책시켜야 하며, 상대방이 면책되지 못한 경우 그로 인하여 발생한 상대방의 손해에 대해 배상하여야 합니다.

                                                    제19조 (약관 외 준칙)
                                                    본 약관에 명시되지 않은 사항에 대해서는 「전자금융거래법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관계 법령과 회사가 정한 서비스의 세부 이용 지침 등에 따릅니다.

                                                    부칙
                                                    제1조 (시행일)
                                                    본 약관은 2019년 10월 1일부터 시행합니다.
                                                </div>
                                                <div className="row">
                                                    <div className="col pt-2 pb-2 ms-2">
                                                        <input
                                                            type="checkbox"
                                                            name="memberBusAgree"
                                                            checked={formData.memberBusAgree === 'Y'}
                                                            onChange={handleCheckboxChange}
                                                        />
                                                        동의
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="headingThree">
                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                    광고성 메일 수신동의(선택)
                                                </button>
                                            </h2>
                                            <div id="collapseThree" className="accordion-collapse collapse " aria-labelledby="headingThree" data-bs-parent="#accordionExample" >
                                                <div className="accordion-body" style={{ fontSize: '16px' }}>
                                                    메일보낼거에요 스팸메일
                                                </div>
                                                <div className="row">
                                                    <div className="col pt-2 pb-2 ms-2">
                                                        <input
                                                            type="checkbox"
                                                            name="memberServiceAgree"
                                                            checked={formData.memberServiceAgree === 'Y'}
                                                            onChange={handleCheckboxChange}
                                                        />
                                                        동의
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3 mt-4">
                                <label htmlFor="memberId" className="form-label ">
                                    아이디
                                </label>
                                <button className="btn btn-primary" onClick={checkIdClick}>중복검사</button>
                                <div className="col">
                                    <input
                                        type="text"
                                        className={`form-control
                                        ${result.memberId === true ? 'is-valid' : ''}
                                        ${result.memberId === false || duplicateId ? 'is-invalid' : ''}
                                    `}
                                        id="memberId"
                                        name="memberId"
                                        value={formData.memberId} onChange={handleChange}
                                        onBlur={checkJoin}
                                        placeholder="아이디는 영문소문자로 시작하는 영문,숫자 5~20자로 입력하세요"
                                        required
                                        autoComplete="off"
                                        ref={inputRef} // ref 설정
                                    />
                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                        {duplicateId ? '이미 사용중인 아이디 입니다.' : '아이디는 영문소문자로 시작하는 영문,숫자 5~20자로 입력하세요'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="memberPw" className="form-label">
                                    비밀번호
                                </label>
                                <div className="col">
                                    <input
                                        type="password"
                                        className={`form-control
                                    ${result.memberPw === true ? 'is-valid' : ''}
                                    ${result.memberPw === false ? 'is-invalid' : ''}
                                    `}
                                        id="memberPw"
                                        name="memberPw"
                                        onChange={handleChange}
                                        onBlur={checkJoin}
                                        placeholder="비밀번호는 대문자, 소문자, 숫자, 특수 문자를 각각 하나 이상씩 포함하는 8~15자 사이의 문자로 입력하세요"
                                        required
                                    />
                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">비밀번호는 대문자, 소문자, 숫자, 특수 문자를 각각 하나 이상씩 포함하는 8~15자 사이의 문자로 입력하세요</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="memberPw" className="form-label">
                                    비밀번호 확인
                                </label>
                                <div className="col">
                                    <input
                                        type="password"
                                        className={`form-control
                                    ${result.memberPwCheck === true ? "is-valid" : ""}
                                    ${result.memberPwCheck === false ? "is-invalid" : ""}
                                    `}
                                        id="memberPwCheck"
                                        name="memberPwCheck"
                                        onChange={handleChange}
                                        onBlur={checkJoin}
                                        required
                                    />
                                    <div className="valid-feedback">비밀번호가 일치합니다</div>
                                    <div className="invalid-feedback">비밀번호가 일치하지 않습니다</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="memberName" className="form-label">
                                    이름
                                </label>
                                <div className="col">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="memberName"
                                        name="memberName"
                                        autoComplete="off"
                                        onChange={handleChange}
                                        onBlur={checkJoin}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="memberBirth" className="form-label">
                                    생년월일
                                </label>
                                <div className="col">
                                    <input
                                        type="text"
                                        className={`form-control`}
                                        id="memberBirth"
                                        name="memberBirth"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="memberPhone" className="form-label">
                                    전화번호
                                </label>
                                <div className="col">
                                    <input
                                        type="text"
                                        className={`form-control
                                    ${result.memberPhone === true ? 'is-valid' : ''}
                                    ${result.memberPhone === false ? 'is-invalid' : ''}
                                    `}
                                        id="memberPhone"
                                        name="memberPhone"
                                        onChange={handleChange}
                                        onBlur={checkJoin}
                                        autoComplete="off"
                                        placeholder="연락처는 대시 (-) 없이 입력하세요"
                                    />
                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">(-)제외 번호 11자리를 입력하세요</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="memberEmail" className="form-label me-2">
                                    이메일
                                </label>
                                <div className="col">
                                    <input
                                        type="text"
                                        className={`form-control
                                    ${result.memberEmail === true ? 'is-valid' : ''}
                                    ${result.memberEmail === false ? 'is-invalid' : ''}
                                    `}
                                        id="memberEmail"
                                        name="memberEmail"
                                        autoComplete="off"
                                        onChange={handleChange}
                                        onBlur={checkJoin}
                                        required
                                        placeholder="이메일 형식 예시: unsulucky@naver.com"
                                        disabled={validCert === true}
                                    />
                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">
                                        이메일 형식이 맞지 않습니다.
                                    </div>
                                </div>
                                <div className="col">
                                    <button
                                        className="btn btn-secondary mt-2"
                                        type="button"
                                        onClick={handleCertSend}
                                        disabled={certSent}
                                    >
                                        {certSent ? "재전송" : "인증번호 전송"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="certCode" className="form-label me-2">
                                    인증번호
                                </label>
                                <div className="col">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            className={`form-control ${validCert === false ? "is-invalid" : validCert === true ? "is-valid" : ""}`}
                                            id="certCode"
                                            name="certCode"
                                            value={certCode}
                                            onChange={handleCertInputChange}
                                            placeholder="인증번호를 입력하세요"
                                            required
                                        />
                                        {validCert === false && (
                                            <div className="invalid-feedback">인증번호가 일치하지 않습니다.</div>
                                        )}
                                        {validCert === true && (
                                            <div className="valid-feedback">확인완료</div>
                                        )}
                                    </div>
                                    <div className="col">
                                        <button
                                            className="btn btn-secondary mt-2"
                                            type="button"
                                            onClick={checkCertCode} // 입력 확인 
                                            disabled={validCert === true} // 인증 완료 시 버튼 비활성화
                                        >
                                            인증번호 확인
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <div className="col w-50">
                                    <div className="address_search d-flex" >
                                        <button onClick={handleComplete} className="btn btn-secondary">우편번호 찾기</button>
                                    </div>
                                    <input
                                        type="text"
                                        className={`form-control
                                    ${result.memberZip === true ? 'is-valid' : ''}
                                    ${result.memberZip === false ? 'is-invalid' : ''}
                                    `}
                                        id="memberZip"
                                        name="memberZip"
                                        onChange={handleChange}
                                        onBlur={checkJoin}
                                        placeholder="우편번호"
                                        autoComplete="off"
                                    />
                                    <div className="valid-feedback"></div>
                                    <div className="invalid-feedback">우편번호 5~6자리 숫자를 입력하세요 </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="memberAddr1" className="form-label">
                                    기본주소
                                </label>
                                <div className="col">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="memberAddr1"
                                        name="memberAddr1"
                                        onChange={handleChange}
                                        onBlur={checkJoin}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="memberAddr2" className="form-label">
                                    상세주소
                                </label>
                                <div className="col">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="memberAddr2"
                                        name="memberAddr2"
                                        onChange={handleChange}
                                        onBlur={checkJoin}
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <button
                            type="submit"
                            className="btn btn-warning w-100"
                        disabled={!areAllInputsValid()} // 버튼 활성화 여부 설정
                        >
                            {areAllInputsValid() ? '가입하기' : '미입력된 항목 있음'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Join;