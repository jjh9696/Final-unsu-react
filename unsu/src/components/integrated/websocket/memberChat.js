import React, { useState, useEffect } from 'react';
import { useRecoilState } from "recoil";
import SockJS from 'sockjs-client';
import moment from 'moment';
import axios from "../../utils/CustomAxios";
import { loginIdState } from '../../utils/RecoilData';
import { loginLevelState } from '../../utils/RecoilData';
import './MemberChat.css'; // CSS 파일 임포트

const MemberChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [socket, setSocket] = useState(null);
  const [loginId, setLoginId] = useRecoilState(loginIdState);
  const [loginLevel, setLoginLevel] = useRecoilState(loginLevelState);
  const [selectedMemberId, setSelectedMemberId] = useState(''); // 초기에 빈 문자열로 설정
  const [memberList, setMemberList] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]); // 검색된 회원 목록
  const [recentSender, setRecentSender] = useState([]); // 최근 메시지를 보낸 사람

  useEffect(() => {
    // 페이지에 들어갈 때 웹소켓 연결 생성
    const newSocket = new SockJS(`${process.env.REACT_APP_BASE_URL}/ws/memberChat`);

    // 메세지 표시
    newSocket.onmessage = (e) => {
      const { messageType, data } = JSON.parse(e.data);

      if (messageType === "memberList") {
        setMemberList(data);
        setFilteredMembers(data);
      } else if (messageType === "message") {
        setMessages((prevMessages) => [data, ...prevMessages]);
      } else if (messageType === "recentSenderList") {
        setRecentSender(data);
      }
    };

    setSocket(newSocket);

    // 페이지를 벗어날 때 웹소켓 연결 해제
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []); // 빈 배열을 전달하여 한 번만 실행되도록 함

  const sendMessage = () => {
    if (inputValue.trim().length === 0) return;

    const data = {
      token: axios.defaults.headers.common['Authorization'],
      content: inputValue,
      receiverId: selectedMemberId // 선택된 회원의 ID도 함께 전송
    };

    const json = JSON.stringify(data);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(json);
    }

    setInputValue('');
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // 회원 선택하는 함수
  const handleSelectMember = (e) => {
    setSelectedMemberId(e.target.value);
  };

  // 검색어로 회원 필터링하는 함수
  const handleSearchMember = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = memberList.filter(member => member.memberId.toLowerCase().includes(searchTerm));
    setFilteredMembers(filtered);
  };

  // 클릭 및 키 이벤트 핸들러
  const handleSendMessage = () => {
    sendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div>
      <div>
        {/* 관리자인 경우에만 회원 선택 UI를 표시 */}
        {loginLevel === '관리자' && (
          <div className="member-list">

            {/* 최근 메시지를 보낸 사람 표시 */}
            <div>
              {recentSender && recentSender.length > 0 ? (
                <p>최근 메시지를 보낸 사람: {JSON.stringify(recentSender)}</p>
              ) : (
                <p>최근 메시지를 보낸 사람이 없습니다.</p>
              )}
            </div>

            {/* 회원 검색창 */}
            <input
              type="text"
              className="search-input"
              placeholder="회원 검색"
              onChange={handleSearchMember}
            />
            {/* 회원 선택창 */}
            <select value={selectedMemberId} onChange={handleSelectMember}>
              <option value="">회원을 선택하세요</option>
              {filteredMembers.filter(member => member.memberLevel !== '관리자').map((member) => (
                <option key={member.memberId} value={member.memberId}>{member.memberId}</option>
              ))}
            </select>



          </div>
        )}

        <input
          type="text"
          className="text-input"
          placeholder="메세지 작성"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // 엔터 키 이벤트 핸들러
        />
        <div className="btn-send" onClick={handleSendMessage}>전송</div> {/* 클릭 이벤트 핸들러 */}
      </div>
      <hr />
      <div className="chat-wrapper">
        {messages.map((message, index) => {
          // 관리자인 경우에는 선택된 회원과의 채팅만 보여줌
          if (loginLevel === "관리자" && selectedMemberId && (message.message_sender === selectedMemberId || message.message_receiver === selectedMemberId)) {
            return (
              <div key={index} className={message.message_sender_level === '관리자' ? 'message sent' : 'message received'}>
                <div className="sender">{message.message_sender}</div>
                <div className="content">{message.message_content}</div>
                <div className="time">{moment(message.message_time).format("YY/MM/DD HH:mm")}</div>
              </div>
            );
          }
          // 일반 사용자인 경우에는 자신과 관련된 채팅만 보여줌
          // 관리자가 보낸 채팅은 상담사가 보냈다고 표시
          else if (loginLevel !== "관리자" && (message.message_sender === loginId || message.message_receiver === loginId)) {
            return (
              <div key={index} className={message.message_sender_level === '일반회원' ? 'message sent' : 'message received'}>
                <div className="sender">{message.message_sender === loginId ? loginId : '상담사'}</div>
                <div className="content">{message.message_content}</div>
                <div className="time">{moment(message.message_time).format("YY/MM/DD HH:mm")}</div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default MemberChat;
