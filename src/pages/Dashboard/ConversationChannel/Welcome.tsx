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
              <div className="avatar-xl mx-auto pt-3">
                <div className="mt-2">
                  <img src={icon} width="90%" alt="ORCS"></img>
                </div>
              </div>
              <h4>Welcome to Online Realtime Communication System！</h4>
              {/*<p className="text-muted mb-4">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
                commodo ligula eget dolor. cum sociis natoque penatibus et
              </p>
              <Button type="button" className="btn btn-primary w-lg">
                Get Started
  </Button>*/}
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Welcome;
