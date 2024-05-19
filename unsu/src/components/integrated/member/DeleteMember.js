import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { loginIdState } from "../../utils/RecoilData";
import axios from "../../utils/CustomAxios";
import { useNavigate } from "react-router-dom";

const DeleteAccountPage = () => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const loginId = useRecoilValue(loginIdState);

    const handleDeleteAccount = async () => {
        try {
            const response = await axios.delete(`/member/${loginId}`, {
                params: { providedPw: password } // 쿼리 파라미터로 비밀번호 포함
            });
            console.log("삭제 성공:", response.data);
            // 필요한 후처리 (예: 로그아웃, 리디렉션 등)
            navigate("/"); // 로그인 페이지로 리디렉션
        } catch (error) {
            console.error("삭제 실패:", error);
            setError(error.response ? error.response.data : "서버 오류");
        }
    };

    return (
        <div className="container mt-5">
            <h3>계정 삭제</h3>
            <div>
                <input 
                    type="password" 
                    placeholder="비밀번호를 입력하세요" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button onClick={handleDeleteAccount} className="btn btn-danger">삭제</button>
            </div>
            {error && (
                <div className="text-danger">
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

export default DeleteAccountPage;
