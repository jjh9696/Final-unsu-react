import React from 'react';
import { Carousel } from 'react-bootstrap';
import { Navbar, Container, Nav, Card, Button } from 'react-bootstrap';
import {NavLink} from "react-router-dom";
import unsuMain from '../src/images/page/unsugoodlook.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';



const Home = () => {


    
  
    return (
        <>
        {/* <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="#home">Start Bootstrap</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#about">About</Nav.Link>
                <Nav.Link href="#contact">Contact</Nav.Link>
                <Nav.Link href="#services">Services</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar> */}
        <Container className="my-5">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <img className="img-fluid rounded mb-4 mb-lg-0" src={unsuMain} alt="..." />
            </div>
            <div className="col-lg-5">
              <h1 className="font-weight-light">운수좋은날</h1>
              <div className="neon-sign-container">
      <p className="neon-sign-text"> 
          
      </p>
    </div>
              <Button variant="info" as={NavLink} to="/reservation">고속버스예매</Button>
            </div>
          </div>
        </Container>
        <Card bg="white" text="black" className="text-center my-5 py-4">
          <Card.Body>
            <p className="m-2 ">운수좋은날의 최종목적지는 고객행복 입니다.

</p>
          </Card.Body>
        </Card>
        <Container className="my-5">
          <div className="row">
            <div className="col-md-4 mb-5">
              <Card>
                <Card.Body>
                  <Card.Title>공지사항</Card.Title>
                  <Card.Text>
                    
                  </Card.Text>
                  <Button variant="success" as={NavLink} to="/notice">이동하기</Button>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4 mb-5">
              <Card>
                <Card.Body>
                  <Card.Title>이용후기</Card.Title>
                  <Card.Text>
                  
                  </Card.Text>
                  <Button variant="success" as={NavLink} to="/reviewList">이동하기</Button>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4 mb-5">
              <Card>
                <Card.Body>
                  <Card.Title>문의</Card.Title>
                  <Card.Text>
                    
                  </Card.Text>
                  <Button variant="success" as={NavLink} to="/chatbot">챗봇</Button>
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  
                  <Button variant="success" as={NavLink} to="/memberChat">문의채팅</Button>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Container>
       
      </>
    );
};

export default Home;
