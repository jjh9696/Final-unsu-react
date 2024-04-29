//CustomAxios.js
//이 파일은 axios를 우리가 원하는 대로 개조하여
//프로그램 전체에서 불러서 사용할 수 있도록 만들기 위한 파일

//라이브러리가 기본적으로 제공하는 axios를 불러온다
import axios from "axios";

//필요한 설정을 추가한다
const instance = axios.create({
    baseURL : "http://localhost:8080",//기본 통신 URL 접두사
    baseURL : process.env.REACT_APP_BASE_URL,
    timeout : 5000,//통신의 최대 지연시간(ms)
});

//외부에서 사용 가능하도록 내보낸다.
export default instance;