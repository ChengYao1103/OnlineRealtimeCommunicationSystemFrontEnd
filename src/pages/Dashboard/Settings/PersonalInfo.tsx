import React, { useState } from "react";
import { Button, Modal, ModalFooter, ModalHeader, Form } from "reactstrap";

// form
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import FormInput from "../../../components/FormInput";

// interface
import { BasicDetailsTypes } from "../../../data/settings";
import { userModel } from "../../../redux/profile/types";

interface PersonalInfoProps {
  basicDetails: BasicDetailsTypes;
  user: userModel;
}
const PersonalInfo = ({ basicDetails, user }: PersonalInfoProps) => {
  const fullName = user && user.name ? user.name : "-";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editName, setEditName] = useState("");

  // form setting
  const resolver = yupResolver(
    yup.object().shape({
      newName: yup.string().required("Please Enter E-mail."),
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
    formState: { errors },
  } = methods;
  const onSubmitForm = (values: object) => {
    console.log(values);
    console.log(editName);
  };

  //modal setting
  const openModal = () => {
    setEditName(fullName);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setEditName(fullName);
    setIsModalOpen(false);
  };

  return (
    <div className="accordion-body">
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
        <p className="text-muted mb-1">Name</p>
        <h5 className="font-size-14">{fullName}</h5>
      </div>

      <div className="mt-4">
        <p className="text-muted mb-1">Email</p>
        <h5 className="font-size-14">
          {user && user.email ? user.email : "-"}
        </h5>
      </div>

      <div className="mt-4">
        <p className="text-muted mb-1">Location</p>
        <h5 className="font-size-14 mb-0">
          {/*user && user.location ? user.location : "-"*/}
          現在還沒有
        </h5>
      </div>
      {/* begin::修改姓名的modal */}
      <Modal
        id={"editNameModal"}
        isOpen={isModalOpen}
        toggle={() => closeModal()}
        tabIndex={-1}
        centered
        className="w-100"
      >
        <Form
          onSubmit={handleSubmit(onSubmitForm)}
          className="position-relative"
        >
          <ModalHeader className="w-100">Edit User Name</ModalHeader>

          <div className="m-3">
            <FormInput
              label="Name"
              type="text"
              name="newName"
              value={editName}
              onChange={e => {
                setEditName(e.target.value);
              }}
              register={register}
              errors={errors}
              control={control}
              labelClassName="form-label"
              placeholder="Enter New Name"
              className="form-control"
            />
          </div>
          <ModalFooter>
            <Button color="Secondary" onClick={() => closeModal()}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Save
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* end::修改姓名的modal */}
    </div>
  );
};

export default PersonalInfo;
