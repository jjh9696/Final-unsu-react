import React, { useState } from 'react';
import axios from "../../utils/CustomAxios";


const TestJoin = ()=>{

    const [formData, setFormData] = useState({
        memberId: '',
        memberPw: '',
        memberName: '',
        memberBirth: '',
        memberEmail: '',
        memberPhone: '',
        memberZip: '',
        memberAddr1: '',
        memberAddr2: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/member/join", formData); // 회원가입 API 요청
            console.log(response.data); // API 요청 결과 확인
            // 회원가입 성공 후 다음 작업 수행
        } catch (error) {
            console.error("Error registering member:", error);
            // 회원가입 실패 시 처리
        }
    };

    return (
        <>
        <h1>왜이래</h1>
        <form onSubmit={handleSubmit}>
            <input type="text" name="memberId" value={formData.memberId} onChange={handleChange} placeholder="아이디" />
            <input type="text" name="memberPw" value={formData.memberPw} onChange={handleChange} placeholder="비번" />
            <input type="text" name="memberName" value={formData.memberName} onChange={handleChange} placeholder="이름" />
            <input type="text" name="memberBirth" value={formData.memberBirth} onChange={handleChange} placeholder="생일" />
            <input type="text" name="memberEmail" value={formData.memberEmail} onChange={handleChange} placeholder="이메일" />
            <input type="text" name="memberPhone" value={formData.memberPhone} onChange={handleChange} placeholder="폰번호" />
            <input type="text" name="memberZip" value={formData.memberZip} onChange={handleChange} placeholder="우편번호" />
            <input type="text" name="memberAddr1" value={formData.memberAddr1} onChange={handleChange} placeholder="주소1" />
            <input type="text" name="memberAddr2" value={formData.memberAddr2} onChange={handleChange} placeholder="주소2" />
            <button type="submit">회원가입</button>
        </form>
        </>
    );
};
export default TestJoin;