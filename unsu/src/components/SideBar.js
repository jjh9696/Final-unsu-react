import {
  Menu,
  MenuItem,
  Sidebar,
  SubMenu,
  sidebarClasses,
  menuClasses,
} from "react-pro-sidebar";
import { Link } from 'react-router-dom';
import "./SideBar";
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { isLoginState } from './utils/RecoilData';
import { useRecoilValue } from "recoil";
import Chatbot from './integrated/websocket/chatbot';
import MemberChat from './integrated/websocket/memberChat';

const basicTheme = {
  sidebar: {
    backgroundColor: "#FFFFFF",
    height: "1000px",
  },
  menu: {
    menuContent: "#FFFFFF",
    hover: {
      backgroundColor: "#FFFFFF",
      color: "#848484"
    },
  },
  subMenu: {
    menuContent: "#FFFFFF",
    hover: {
      backgroundColor: "#FFFFFF",
      color: "#848484"
    },
  }
}

const SideBar = () => {

  //websocket
  const [isChatbotModalOpen, setIsChatbotModalOpen] = useState(false);
  const [isMemberChatModalOpen, setIsMemberChatModalOpen] = useState(false);

  const openChatbotModal = () => {
    setIsChatbotModalOpen(true);
  };

  const closeChatbotModal = () => {
    setIsChatbotModalOpen(false);
  };

  const openMemberChatModal = () => {
    setIsMemberChatModalOpen(true);
  };

  const closeMemberChatModal = () => {
    setIsMemberChatModalOpen(false);
  };

  const isLogin = useRecoilValue(isLoginState);

  const sidebarStyles = {
    height: '1000px',

  }
  const menuItemStyles = {
    root: {
      fontSize: '14px',
      backgroundColor: basicTheme.menu.menuContent
    },
    button: {
      '&:hover': {
        backgroundColor: basicTheme.menu.hover.backgroundColor,
        color: basicTheme.menu.hover.color
      }
    }
  }
  const subItemStyles = {
    root: {
      fontSize: '12px',
      backgroundColor: basicTheme.subMenu.menuContent
    },
    button: {
      '&:hover': {
        backgroundColor: basicTheme.subMenu.hover.backgroundColor,
        color: basicTheme.menu.hover.color
      }
    }
  }

  return (
    <>
      <Sidebar rootStyles={sidebarStyles}>
        <div className="text-center py-4">
          <Link to="/"><img src="https://picsum.photos/100/100" /></Link>
        </div>
        <div className="logo-outline" />
        <Menu>
          <SubMenu label="운행정보" >
            <Menu menuItemStyles={subItemStyles}>
              <MenuItem component={<Link to="/" />}> 시간표 조회 </MenuItem>
              <MenuItem component={<Link to="/" />}> 도착시간 안내</MenuItem>
            </Menu>
          </SubMenu>
        </Menu>
        <Menu>
          <SubMenu label="이용안내" >
            <Menu menuItemStyles={subItemStyles}>
              <MenuItem component={<Link to="/reservation" />}> 예매  </MenuItem>
              <MenuItem component={<Link to="/testPrice" />}> 테스트페이지</MenuItem>
              <MenuItem component={<Link to="/payInfo" />}> 결제수단 안내</MenuItem>
              <MenuItem component={<Link to="/refundInfo" />}> 승차권 환불 안내</MenuItem>
              <MenuItem component={<Link to="/terminalInfo" />}> 고속버스터미널 안내</MenuItem>
            </Menu>
          </SubMenu>
        </Menu>
        <Menu>
          <SubMenu label="게시판" >
            <Menu menuItemStyles={subItemStyles}>
              <MenuItem component={<Link to="/notice" />}> 공지사항 </MenuItem>
              <MenuItem component={<Link to="/reviewList" />}> 이용후기 </MenuItem>
            </Menu>
          </SubMenu>
        </Menu>
        <Menu>
          <SubMenu label="고객센터" >
            <Menu menuItemStyles={subItemStyles}>
              <MenuItem component={<Link to="/" />}> 자주하는 질문  </MenuItem>
              <MenuItem component={<Link to="/" />}> 유실물센터 안내</MenuItem>
              <MenuItem component={<Link to="/" />} onClick={openChatbotModal}> 챗봇 </MenuItem>
              {isLogin && (
                <>
                  <MenuItem component={<Link to="/" />} onClick={openMemberChatModal}> 문의채팅 </MenuItem>
                </>
              )}
            </Menu>
          </SubMenu>
        </Menu>
        <Modal show={isChatbotModalOpen} onHide={closeChatbotModal}>
          <Modal.Header closeButton>
            <Modal.Title>운수좋은날 챗봇</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Chatbot />
          </Modal.Body>
        </Modal>

        <Modal show={isMemberChatModalOpen} onHide={closeMemberChatModal}>
          <Modal.Header closeButton>
            <Modal.Title>운수좋은날 문의</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MemberChat />
          </Modal.Body>
        </Modal>
        <div className="logo-outline" />
        <div className="logo-outline" />
      </Sidebar >
    </>
  );
}

export default SideBar;