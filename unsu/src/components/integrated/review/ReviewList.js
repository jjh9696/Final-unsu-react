
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "../../utils/CustomAxios";
import { throttle } from "lodash";
import moment from "moment";
import { Rating } from "react-simple-star-rating";
import { Modal } from "bootstrap";
import { IoMdAdd } from "react-icons/io";



const ReviewList = () => {

    //state
    const [reviews, setReviews] = useState([]);//초기 목록
    const [page, setPage] = useState(1);//현재 페이지 번호
    const [size, setSize] = useState(10);//가져올 데이터 개수
    const [count, setCount] = useState(0);
    const [last, setLast] = useState(false);
    const [input, setInput] = useState({
        reviewTitle:"", reviewContent:"", reviewStar: "0"
    });

    //ref 변형 사용
    const loading = useRef(false);

    //callback
    const loadData = useCallback(async () => {
        const resp = await axios.get(`/review/page/${page}/size/${size}`);
        setReviews([...reviews, ...resp.data.list]);
        setCount(resp.data.count);
        setLast(resp.data.last);
    }, [reviews, page]);

    //effect
    useEffect(() => {
        loading.current = true;//로딩 시작
        //console.log("로딩 시작 기록");
        loadData();
        loading.current = false; //로딩 종료
        //console.log("로딩 종료 기록")
    }, [page]);

    const listener = useCallback(throttle((e) => {
        ////console.log("우와 스크롤이 굴러가요");
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollTop = window.scrollY;
        const scrollPercent = (scrollTop / scrollableHeight) * 100;
        //console.log(`last = ${last} , 퍼센트 = ${scrollPercent.toFixed(2)}%`);

        //조건 
        // - 마지막 데이터가 아닐 것 (last === false)
        // - 스크롤이 75% 이상 내려갔을 것 (scrollPercent >= 75)
        if (last === false && scrollPercent >= 75) {
            //console.log("더보기 작업을 시작합니다");
            setPage(page + 1);//페이지1증가 --> effect 발생 --> loadData 실행
        }
    }, 350), [page]);

    useEffect(() => {
        if (loading.current === true) {//로딩이 진행중이라면
            return;//이벤트 설정이고 뭐고 때려쳐!
        }

        //로딩중이 아니라면
        window.addEventListener("scroll", listener);//미리 준비한 이벤트 설정
        //console.log("스크롤 이벤트 설정 완료!");

        //화면 해제 시 진행할 작업
        return () => {
            window.removeEventListener("scroll", listener);//이벤트 제거
            //console.log("스크롤 이벤트 제거 완료!");
        };
    });

    //ref + modal
    const bsModal = useRef();
    const openModal = useCallback(()=>{
        const modal = new Modal(bsModal.current);
        modal.show();
    }, [bsModal]);
    const closeModal = useCallback(()=>{
        const modal = Modal.getInstance(bsModal.current);
        modal.hide();
    }, [bsModal]);

    //입력값 초기화
    const clearInput = useCallback(()=>{
        setInput({
            reviewTitle:"", reviewContent:"", reviewStar: "0"
        });
    }, [input]);

    //신규 등록 화면 입력값 변경
    const changeInput = useCallback((e)=>{
        setInput({
            ...input,
            [e.target.name] : e.target.value
        });
    }, [input]);

    //등록
    const saveInput = useCallback(async ()=>{
        //입력값에 대한 검사 코드가 필요하다면 이자리에 추가하고 차단!
        //if(검사결과 이상한 데이터가 입력되어 있다면) return;

        //input에 들어있는 내용을 서버로 전송하여 등록한 뒤 목록 갱신 + 모달 닫기
        const resp = await axios.post("/review/", input);
        loadData();
        clearInput();
        closeModal();
    }, [input]);

    //등록 취소
    const cancelInput = useCallback(()=>{
        const choice = window.confirm("작성을 취소하시겠습니까?");
        if(choice === false) return;
        clearInput();
        closeModal();
    }, [input]);

    //화면
    return (
        <>
            <div className="row mt-4">
                <div className="col">
                    <h2>이용후기</h2>
                </div>
            </div>
            <hr />

            {/* 추가 버튼 */}
            <div className="row mt-4">
                <div className="col text-end">
                    <button className="btn btn-primary"
                        onClick={e => openModal()}>
                        <IoMdAdd />
                        후기 작성
                    </button>
                </div>
            </div>

            {/* Modal */}
            <div ref={bsModal} className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">이용 후기 작성</h1>
                        <button type="button" className="btn-close" aria-label="Close"
                                onClick={e=>cancelInput()}></button>
                    </div>
                    <div className="modal-body">
                        {/* 등록 화면 */}
                        
                        <div className="row">
                            <div className="col">
                                <label>제목</label>
                                <input type="text" name="reviewTitle" 
                                    value={input.reviewTitle} 
                                    onChange={e=>changeInput(e)}
                                    className="form-control"/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <label>내용</label>
                                <textarea type="text" name="reviewContent" 
                                    value={input.reviewContent} 
                                    onChange={e=>changeInput(e)}
                                    className="form-control"/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <label>별점</label>
                                <input type="text" value={input.reviewStar} onChange={e=>setInput({...input, reviewStar:e.target.value})}/>
                                <Rating 
                                    initialValue={input.reviewStar}// 입력 값
                                    size={22} // 별 크기
                                    transition // 애니메이션 효과
                                    // 변경된 별점 값을 state에 업데이트
                                    onChange={(value) => setInput({ ...input, reviewStar: value })} 
                                />
                            </div>
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button className='btn btn-success me-2' onClick={e=>saveInput()}>
                            등록
                        </button>
                        <button className='btn btn-danger' onClick={e=>cancelInput()}>
                            취소
                        </button>
                    </div>
                    </div>
                </div>
            </div>


            <div className="row mt-4">
                <div className="col">
                    <table className="table">
                        <thead className="text-center">
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>작성시간</th>
                                <th>별점</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {reviews.map(review => (
                                <tr key={review.reviewNo}>
                                    <td>{review.reviewNo}</td>
                                    <td>{review.reviewTitle}</td>
                                    <td>{review.reviewWriter}</td>
                                    <td>{moment(review.reviewWtime).format("YYYY-MM-DD HH:mm")}</td>
                                    <td>
                                        <Rating
                                            initialValue={review.reviewStar} // 리뷰의 별점을 표시
                                            size={22} //별 크기 조정(선택가능)
                                            transition //애니메이션 효과(선택가능)
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 더보기 버튼 */}
            <div className="row mt-2">
                <div className="col">
                    {last === false &&
                        <button className="btn btn-primary btn-lg w-100"
                            onClick={e => setPage(page + 1)}>
                            더보기
                        </button>
                    }
                </div>
            </div>

        </>
    );
};


export default ReviewList;

