import React, { useState } from "react";
import {
  Alert,
  Button,
  Modal,
  ModalFooter,
  ModalHeader,
  Form,
} from "reactstrap";

// hooks
import { useRedux } from "../../../hooks/index";

// form
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import FormInput from "../../../components/FormInput";

// actions
import { userChangeInformation } from "../../../redux/actions";

// interface
import { BasicDetailsTypes } from "../../../data/settings";
import { userModel } from "../../../redux/auth/types";
import { ErrorMessages } from "../../../repository/Enum";

interface PersonalInfoProps {
  user: userModel;
}
const PersonalInfo = ({ user }: PersonalInfoProps) => {
  const { dispatch, useAppSelector } = useRedux();
  const fullName = user && user.name ? user.name : "-";
  const [isModalOpen, setIsModalOpen] = useState(false);
  //const [toastShowed, setToastShowed] = useState(false);
  const { informationChanged, changeInfomationError } = useAppSelector(
    state => ({
      informationChanged: state.Auth.informationChanged,
      changeInfomationError: state.Auth.changeInfomationError,
    })
  );

  //modal setting
  const openModal = () => {
    setValue("newName", fullName);
    setIsModalOpen(true);
  };

  // form setting
  const resolver = yupResolver(
    yup.object().shape({
      newName: yup.string().required(ErrorMessages["required"]),
    })
  );

  const defaultValues: any = {
    newName: fullName,
  };

  const methods = useForm({ defaultValues, resolver });
  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors },
  } = methods;

  const onSubmitForm = async (values: object) => {
    await dispatch(userChangeInformation(values));
    setIsModalOpen(false);
  };

  return (
    <div className="accordion-body">
      <div>
        {informationChanged && <Alert color="success">更改名稱成功</Alert>}
        {changeInfomationError && <Alert color="danger">更改名稱失敗</Alert>}
      </div>
      <div className="float-end">
        <Button
          color="none"
          type="button"
          className="btn btn-soft-primary btn-sm"
          onClick={() => openModal()}
        >
          <i className="bx bxs-pencil align-middle"></i>
        </Button>
      </div>

      <div>
        <p className="text-muted mb-1">名稱</p>
        <h5 className="font-size-14">{fullName}</h5>
      </div>

      <div className="mt-4">
        <p className="text-muted mb-1">Email</p>
        <h5 className="font-size-14">
          {user && user.email ? user.email : "-"}
        </h5>
      </div>

      {/* begin::修改姓名的modal */}
      <Modal
        id={"editNameModal"}
        isOpen={isModalOpen}
        tabIndex={-1}
        centered
        className="w-100"
      >
        <Form
          onSubmit={handleSubmit(onSubmitForm)}
          className="position-relative"
        >
          <ModalHeader className="w-100">修改使用者名稱</ModalHeader>

          <div className="m-3">
            <FormInput
              label="新名稱"
              type="text"
              name="newName"
              register={register}
              errors={errors}
              control={control}
              labelClassName="form-label"
              placeholder="Enter New Name"
              className="form-control"
            />
          </div>
          <ModalFooter>
            <Button
              color="Secondary"
              type="reset"
              onClick={() => setIsModalOpen(false)}
            >
              取消
            </Button>
            <Button color="primary" type="submit">
              儲存
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* end::修改姓名的modal */}
    </div>
  );
};

export default PersonalInfo;
