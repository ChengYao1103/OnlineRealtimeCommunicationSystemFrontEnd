import React, { useEffect, useState } from "react";
import classnames from "classnames";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Collapse,
  Form,
} from "reactstrap";

//utils
import { DivideByKeyResultTypes } from "../utils";

// interfaces
import { ContactTypes } from "../data/contacts";
import { useContacts } from "../hooks";
import { CreateChannelPostData } from "../redux/actions";

// components
import AppSimpleBar from "./AppSimpleBar";

interface DataTypes {
  channelName: string;
  description: string;
}
/*  建立群組時勾選邀請人的item::start
interface ContactItemProps {
  contact: ContactTypes;
  selected: boolean;
  onSelectContact: (id: string | number, selected: boolean) => void;
}
const ContactItem = ({
  contact,
  selected,
  onSelectContact,
}: ContactItemProps) => {
  const fullName = `${contact.firstName} ${contact.lastName}`;
  const onCheck = (checked: boolean) => {
    onSelectContact(contact.id, checked);
  };

  return (
    <li>
      <div className="form-check">
        <Input
          type="checkbox"
          className="form-check-input"
          id={`contact-${contact.id}`}
          onChange={(e: any) => onCheck(e.target.checked)}
        />
        <Label className="form-check-label" htmlFor={`contact-${contact.id}`}>
          {fullName}
        </Label>
      </div>
    </li>
  );
};

interface CharacterItemProps {
  letterContacts: DivideByKeyResultTypes;
  index: number;
  totalContacts: number;
  selectedContacts: Array<number | string>;
  onSelectContact: (id: string | number, selected: boolean) => void;
}

const CharacterItem = ({
  letterContacts,
  index,
  totalContacts,
  selectedContacts,
  onSelectContact,
}: CharacterItemProps) => {
  return (
    <div>
      <div className="contact-list-title">{letterContacts.letter}</div>

      <ul
        className={classnames("list-unstyled", "contact-list", {
          "mb-0": index + 1 === totalContacts,
        })}
      >
        {(letterContacts.data || []).map((contact: any, key: number) => {
          const selected: boolean = selectedContacts.includes(contact.id);
          return (
            <ContactItem
              contact={contact}
              key={key}
              selected={selected}
              onSelectContact={onSelectContact}
            />
          );
        })}
      </ul>
    </div>
  );
};
  建立群組時勾選邀請人的item::end  */
interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  founderId: number;
  onCreateChannel: (params: CreateChannelPostData) => void;
}

const AddGroupModal = ({
  isOpen,
  onClose,
  founderId,
  onCreateChannel,
}: AddGroupModalProps) => {
  /*
    collapse handeling
    */
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const toggleCollapse = () => {
    setIsOpenCollapse(!isOpenCollapse);
  };

  /*
    contacts hook
    */
  const { categorizedContacts, totalContacts } = useContacts();

  /*
  select contacts
  */
  const [selectedContacts, setSelectedContacts] = useState<
    Array<string | number>
  >([]);
  const onSelectContact = (id: string | number, selected: boolean) => {
    let modifiedList: Array<string | number> = [...selectedContacts];
    if (selected) {
      modifiedList = [...modifiedList, id];
    } else {
      modifiedList = modifiedList.filter(m => m + "" !== id + "");
    }
    setSelectedContacts(modifiedList);
  };

  /*
    data
    */
  const [data, setData] = useState<DataTypes>({
    channelName: "",
    description: "",
  });
  const onDataChange = (field: "channelName" | "description", value: any) => {
    let modifiedData: DataTypes = { ...data };
    modifiedData[field] = value;
    setData(modifiedData);
  };

  /*
    disale button
    */
  const [valid, setValid] = useState(false);
  useEffect(() => {
    if (
      /*selectedContacts.length === 0 &&
      !data.description &&
      data.description === ""*/
      data.channelName === ""
    ) {
      setValid(false);
    } else {
      setValid(true);
    }
  }, [selectedContacts, data]);

  /*
    submit data
    */
  const onSubmit = () => {
    const params = {
      name: data.channelName,
      founderId: founderId,
    };
    onCreateChannel(params);
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      tabIndex={-1}
      centered
      scrollable
      id="addgroup-exampleModal"
      role="dialog"
    >
      <ModalHeader className="modal-title-custom" toggle={onClose}>
        建立頻道
      </ModalHeader>

      <ModalBody className="p-4">
        <Form>
          <div className="mb-4">
            <Label htmlFor="addgroupname-input" className="form-label">
              頻道名稱
            </Label>
            <input
              type="text"
              className="form-control"
              id="addgroupname-input"
              placeholder="Enter Channel Name"
              value={data.channelName || ""}
              onChange={(e: any) => {
                onDataChange("channelName", e.target.value);
              }}
            />
          </div>
          {/*
    <div className="mb-4">
      <label className="form-label">Channel Members</label>
      <div className="mb-3">
        <Button
          color="light"
          size="sm"
          type="button"
          onClick={toggleCollapse}
        >
          Select Members
        </Button>
      </div>
      <Collapse isOpen={isOpenCollapse} id="groupmembercollapse">
        <div className="card border">
          <div className="card-header">
            <h5 className="font-size-15 mb-0">Contacts</h5>
          </div>
          <div className="card-body p-2">
            <AppSimpleBar style={{ maxHeight: "150px" }}>
              {(categorizedContacts || []).map(
                (letterContacts: DivideByKeyResultTypes, key: number) => (
                  <CharacterItem
                    letterContacts={letterContacts}
                    key={key}
                    index={key}
                    totalContacts={totalContacts}
                    selectedContacts={selectedContacts}
                    onSelectContact={onSelectContact}
                  />
                )
              )}
            </AppSimpleBar>
          </div>
        </div>
      </Collapse>
    </div>
    <div className="mb-3">
      <Label htmlFor="addgroupdescription-input" className="form-label">
        Description
      </Label>
      <textarea
        className="form-control"
        id="addgroupdescription-input"
        rows={3}
        placeholder="Enter Description"
        value={data.description || ""}
        onChange={(e: any) => {
          onDataChange("description", e.target.value);
        }}
      />
        </div>
      */}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="link" type="button" onClick={onClose}>
          取消
        </Button>
        <Button
          type="button"
          color="primary"
          onClick={onSubmit}
          disabled={!valid}
        >
          建立
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddGroupModal;
