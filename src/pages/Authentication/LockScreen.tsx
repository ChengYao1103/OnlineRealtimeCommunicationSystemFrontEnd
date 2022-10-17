import React from "react";
import { Row, Col, Form, Button } from "reactstrap";

// router
import { Link } from "react-router-dom";

// validations
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

// hooks
import { useProfile } from "../../hooks";
// import { useProfile } from "../../hooks";

// components
import NonAuthLayoutWrapper from "../../components/NonAutnLayoutWrapper";
import AuthHeader from "../../components/AuthHeader";
import FormInput from "../../components/FormInput";

// images
import avatarPlaceHolder from "../../assets/images/users/profile-placeholder.png";
import { ErrorMessages } from "../../repository/Enum";

interface LockScreenProps {}
const LockScreen = (props: LockScreenProps) => {
  const { userProfile } = useProfile();

  const resolver = yupResolver(
    yup.object().shape({
      password: yup.string().required(ErrorMessages["required"]),
    })
  );

  const defaultValues: any = {};

  const methods = useForm({ defaultValues, resolver });
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = methods;

  const onSubmitForm = (values: object) => {
    console.log(values);
  };

  // const { userProfile, loading } = useProfile();

  return (
    <NonAuthLayoutWrapper>
      <Row className=" justify-content-center my-auto">
        <Col sm={8} lg={6} xl={5} className="col-xxl-4">
          <div className="py-md-5 py-4">
            <AuthHeader title="頁面鎖定中" subtitle="輸入密碼以解鎖" />
            <div className="user-thumb text-center mb-4">
              <img
                src={userProfile.photo ? userProfile.photo : avatarPlaceHolder}
                className="rounded-circle img-thumbnail avatar-lg"
                alt="thumbnail"
              />
              <h5 className="font-size-15 mt-3">{userProfile.name}</h5>
            </div>

            <Form
              onSubmit={handleSubmit(onSubmitForm)}
              className="position-relative"
            >
              <div className="mb-3">
                <FormInput
                  label="密碼"
                  type="password"
                  name="password"
                  register={register}
                  errors={errors}
                  control={control}
                  labelClassName="form-label"
                  placeholder="Enter Password"
                  className="form-control"
                  withoutLabel={true}
                  hidePasswordButton={true}
                />
              </div>
              <div className="text-center mt-4">
                <Button color="primary" className="w-100" type="submit">
                  解鎖
                </Button>
              </div>
            </Form>
            <div className="mt-5 text-center text-muted">
              <p>
                不是您嗎?{" "}
                <Link
                  to="/lougout"
                  className="fw-medium text-decoration-underline"
                >
                  {" "}
                  登出
                </Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </NonAuthLayoutWrapper>
  );
};

export default LockScreen;
