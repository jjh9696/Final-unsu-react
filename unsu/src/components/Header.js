import { useCallback, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { loginIdState, loginLevelState, isLoginState } from "./utils/RecoilData";
import axios from "./utils/CustomAxios";
import { NavLink } from "react-router-dom";

const Header = () => {

    // recoil value
    //recoil
    const [loginId, setLoginId] = useRecoilState(loginIdState);
    const [loginLevel, setLoginLevel] = useRecoilState(loginLevelState);
    const isLogin = useRecoilValue(isLoginState);
    const logout = useCallback(() => {

        // recoil 저장소에 대한 정리 + axios의 헤더 제거 + localStorage 청소
        setLoginId('');
        setLoginLevel('');
        delete axios.defaults.headers.common['Authorization'];
        window.localStorage.removeItem("refreshToken");
    }, [loginId, loginLevel]);
    return (
        <div className="row ms-5 ps-5 text-end" >
            <div className="col ms-5 ps-5 bg-light">
            {isLogin ? (
                                <>
                                <div className="col">
                                    {loginId}님
                                    <button className="btn" onClick={e=>logout()}>로그아웃</button>
                                </div>
                                </>
                            ):(
                                <>
                                    <NavLink to="/login" className="btn">회원가입</NavLink>
                                    <NavLink to="/login" className="btn">로그인</NavLink>
                                </>
                            )}
            </div>
        </div>
    );
};

export default Header;