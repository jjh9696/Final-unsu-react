import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { loginIdState } from "../../utils/RecoilData";
import axios from "../../utils/CustomAxios";
import { useNavigate } from "react-router-dom";

const ChangePasswordPage = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const loginId = useRecoilValue(loginIdState);

    const pwRegx = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$])[A-Za-z0-9!@#$]{8,15}$/;

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        if (!pwRegx.test(newPassword)) {
            setError("새 비밀번호는 8-15자 사이이며, 대문자, 소문자, 숫자, 특수문자(!@#$)를 포함해야 합니다.");
            return;
        }

        try {
            const response = await axios.patch(`/member/pw`, {
                memberId: loginId,
                currentPassword: currentPassword,
                newPassword: newPassword
            });
            navigate("/mypage"); // 비밀번호 변경 후 원하는 페이지로 리디렉션
            alert("변경에 성공하였습니다");
        } catch (error) {
            console.error("비밀번호 변경 실패:", error);
            setError(error.response ? error.response.data : "서버 오류");
        }
    };

    return (
        <div className="container mt-5">
            <h3>비밀번호 변경</h3>
            <div className="mb-3">
                <input 
                    type="password" 
                    placeholder="현재 비밀번호를 입력하세요" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <input 
                    type="password" 
                    placeholder="새 비밀번호를 입력하세요" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className="form-control"
                />
            </div>
            <div className="mb-3">
                <input 
                    type="password" 
                    placeholder="새 비밀번호를 다시 입력하세요" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className="form-control"
                />
            </div>
            <button onClick={handleChangePassword} className="btn btn-primary">변경</button>
            {error && (
                <div className="text-danger mt-3">
                    {typeof error === "object" ? (
                        <pre>{JSON.stringify(error, null, 2)}</pre>
                    ) : (
                        <p>{error}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChangePasswordPage;
