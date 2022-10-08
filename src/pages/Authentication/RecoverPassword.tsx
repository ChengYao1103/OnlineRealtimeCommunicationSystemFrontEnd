import React from "react";
import { Alert, Row, Col, Form, Button } from "reactstrap";

// hooks
import { useRedux } from "../../hooks/index";

// router
import { Link, Redirect } from "react-router-dom";

// validations
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

// hooks
import { useProfile } from "../../hooks";

//actions
import { userForgetPassword } from "../../redux/actions";

// components
import NonAuthLayoutWrapper from "../../components/NonAutnLayoutWrapper";
import AuthHeader from "../../components/AuthHeader";
import FormInput from "../../components/FormInput";
import Loader from "../../components/Loader";
import { ErrorMessages } from "../../repository/Enum";

interface RecoverPasswordProps {}
const RecoverPassword = (props: RecoverPasswordProps) => {
  // global store
  const { dispatch, useAppSelector } = useRedux();

  const { forgetError, forgetSuccessMsg, forgetPassLoading } = useAppSelector(
    state => ({
      forgetError: state.Auth.forgetError,
      forgetSuccessMsg: state.Auth.forgetSuccessMsg,
      forgetPassLoading: state.Auth.loading,
    })
  );

  const resolver = yupResolver(
    yup.object().shape({
      email: yup
        .string()
        .email(ErrorMessages["email format wrong"])
        .required(ErrorMessages["required"]),
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
    dispatch(userForgetPassword(values));
  };

  const { userProfile, loading } = useProfile();
  if (userProfile && !loading) {
    return <Redirect to={{ pathname: "/dashboard" }} />;
  }

  return (
    <NonAuthLayoutWrapper>
      <Row className=" justify-content-center my-auto">
        <Col sm={8} lg={6} xl={5} className="col-xxl-4">
          <div className="py-md-5 py-4">
            <AuthHeader title="重設密碼" />

            {forgetError && <Alert color="danger">{forgetError}</Alert>}
            {forgetSuccessMsg && (
              <Alert color="success">{forgetSuccessMsg}</Alert>
            )}
            {!forgetError && !forgetSuccessMsg && (
              <Alert color="info" className="text-center my-4">
                輸入Email以重設密碼
              </Alert>
            )}

            <Form
              onSubmit={handleSubmit(onSubmitForm)}
              className="position-relative"
            >
              {forgetPassLoading && <Loader />}
              <div className="mb-3">
                <FormInput
                  label="Email"
                  type="text"
                  name="email"
                  register={register}
                  errors={errors}
                  control={control}
                  labelClassName="form-label"
                  placeholder="Enter Email"
                  className="form-control"
                />
              </div>
              <div className="text-center mt-4">
                <Button color="primary" className="w-100" type="submit">
                  發送
                </Button>
              </div>
            </Form>
            <div className="mt-5 text-center text-muted">
              <p>
                想起密碼了嗎?{" "}
                <Link
                  to="/auth-login"
                  className="fw-medium text-decoration-underline"
                >
                  {" "}
                  登入
                </Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </NonAuthLayoutWrapper>
  );
};

export default RecoverPassword;
