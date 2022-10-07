import React from "react";
import { Container, Row, Col } from "reactstrap";

import { Link } from "react-router-dom";

// images
import authImage from "../assets/images/auth-img.png";
import icon from "../assets/images//icon.png";

interface NonAuthLayoutWrapperProps {
  children: any;
}

const NonAuthLayoutWrapper = (props: NonAuthLayoutWrapperProps) => {
  return (
    <>
      <div className="auth-bg">
        <Container fluid className="p-0">
          <Row className=" g-0">
            <Col xl={3} lg={4}>
              <div className="p-4 pb-0 p-lg-5 pb-lg-0 auth-logo-section">
                <div className="text-white-50">
                  <h3 className="text-white">
                    <img src={icon} width="64px" alt="ORCS"></img>{" "}
                    網路即時通訊系統
                  </h3>
                  <p className="font-size-16">
                    Online Realtime Communication System
                  </p>
                </div>
                <div className="mt-auto">
                  <img src={authImage} alt="auth" className="auth-img" />
                </div>
              </div>
            </Col>

            <Col xl={9} lg={8}>
              <div className="authentication-page-content">
                <div className="d-flex flex-column h-100 px-4 pt-4">
                  {props.children}

                  <Row className="">
                    <Col xl={12}>
                      <div className="text-center text-muted p-4">
                        <p className="mb-0">
                          {new Date().getFullYear()} &copy; Crafted by 何秉育
                          陳琴蓮 廖酉詳 劉程耀
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default NonAuthLayoutWrapper;
