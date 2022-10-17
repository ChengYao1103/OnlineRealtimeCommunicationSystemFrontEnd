import React from "react";
import { Button, Col, Row } from "reactstrap";
import icon from "../../../assets/images/icon.png";

const Welcome = () => {
  return (
    <React.Fragment>
      <div className="chat-welcome-section">
        <Row className="w-100 justify-content-center">
          <Col xxl={5} md={7}>
            <div className="p-4 text-center">
              <div className="avatar-xl mx-auto pt-3 mb-3">
                <div className="mt-2">
                  <img src={icon} width="80%" alt="ORCS"></img>
                </div>
              </div>
              <h4>歡迎使用網路即時通訊系統！</h4>
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Welcome;
