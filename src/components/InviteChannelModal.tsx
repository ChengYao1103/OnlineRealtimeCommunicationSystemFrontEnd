import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
} from "reactstrap";
import { RoleTypes, RoleTypesKey } from "../repository/Enum";
import { useRedux } from "../hooks";
import { inviteChannelMembers } from "../redux/actions";

interface InviteContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const InviteChannelModal = ({ isOpen, onClose }: InviteContactModalProps) => {
  const { dispatch, useAppSelector } = useRedux();
  const { channelInfo } = useAppSelector(state => ({
    channelInfo: state.Chats.selectedChatInfo,
  }));

  const [emails, setEmails] = useState([""]);
  const [roles, setRoles] = useState([RoleTypes["Student" as RoleTypesKey]]);
  const [valid, setValid] = useState<boolean>(false);

  const roleTypeAmout = Object.keys(RoleTypes).length / 2;
  const roleOption = Object.keys(RoleTypes).slice(roleTypeAmout);

  const onInvite = () => {
    dispatch(inviteChannelMembers(channelInfo.id, emails, roles));
    onClose();
  };

  const onChangeEmails = (value: string, index: number) => {
    var modyfiedEmail = [...emails];
    modyfiedEmail[index] = value;
    //modyfiedEmail = value;
    setEmails([...modyfiedEmail]);
  };

  const onChangeRoles = (value: RoleTypes, index: number) => {
    var modyfiedRoles = [...roles];
    modyfiedRoles[index] = value;
    //modyfiedRoles = value;
    setRoles([...modyfiedRoles]);
  };

  /*
  validation
  */
  useEffect(() => {
    var result = true;
    emails.forEach(email => {
      if (email === "") {
        result = false;
      }
    });
    setValid(result);
  }, [emails]);

  return (
    <Modal isOpen={isOpen} toggle={onClose} tabIndex={-1} centered scrollable>
      <ModalHeader className="modal-title-custom" toggle={onClose}>
        邀請成員
      </ModalHeader>
      <ModalBody className="p-4">
        <Form>
          <div className="mb-3">
            <Label htmlFor="AddContactModalemail-input" className="form-label">
              Email
            </Label>
            <Input
              type="email"
              className="form-control mb-3"
              id="AddContactModalemail-input"
              placeholder="Enter Email"
              value={emails[0]}
              onChange={(e: any) => {
                onChangeEmails(e.target.value, 0);
              }}
            />
            <Label htmlFor="AddContactModalemail-input" className="form-label">
              身分
            </Label>
            <Input
              type="select"
              className="form-control mb-3"
              id="AddContactModalrole-input"
              value={roles[0]}
              onChange={(e: any) => {
                onChangeRoles(parseInt(e.target.value), 0);
              }}
            >
              {roleOption.map((role, key) => {
                return (
                  <option key={key} value={key}>
                    {role}
                  </option>
                );
              })}
            </Input>
          </div>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button type="button" color="link" className="btn" onClick={onClose}>
          取消
        </Button>
        <Button
          type="button"
          color="primary"
          disabled={!valid}
          onClick={() => onInvite()}
        >
          邀請
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default InviteChannelModal;
