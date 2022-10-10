import React, { useEffect, useState } from "react";
import classnames from "classnames";
import {
  Form,
  FormGroup,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Table,
} from "reactstrap";
import { useRedux } from "../hooks";
import { getChannelDir, createHomework, updateHomework, closeHomework, getChannelHomeworks, doRollCall, changeSelectedHomework, changeSelectedDir } from "../redux/actions";
import { channelHomeworkModel } from "../redux/chats/types";
import { Link } from "react-router-dom";
import { Icons } from "react-toastify";

interface FileModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: number;
}
const FileModal = ({
  isOpen,
  onClose,
  role,
}: FileModalProps) => {
    const { dispatch, useAppSelector } = useRedux();
    const { channelInfo, channelDir, isDir, dirInfo } = useAppSelector(state => ({
      channelInfo: state.Chats.selectedChatInfo,
      channelDir: state.Chats.channelDir,
      isDir: state.Chats.isDir,
      dirInfo: state.Chats.selectedDir
    }));

    const [path, setPath] = useState(Array<string>)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [mode, setMode] = useState(0); //0: 作業總覽 1: 作業詳細內容 2:編輯作業 3: 新增作業

    const onSelectDir = (
        info: string,
      ) => {
        if (dirInfo === info) {
          return;
        }
        dispatch(changeSelectedDir(info));
        if (info)
            setPath([...path, info])
        let tmp = ([...path, info]).join("/")
        let data = {
            path: tmp,
        }  
        dispatch(getChannelDir(channelInfo.id, data))
      };
      const onBack = () => {
        let tmp = path
        tmp.pop()
        let data = {
            path: tmp.length === 0 ? "" : path.join("/"),
        }  
        dispatch(getChannelDir(channelInfo.id, data))
        setPath([...tmp])
      };

    const onLoad = () => {
        let data = {
            path: "",
        }
        console.log(path)
        dispatch(getChannelDir(channelInfo.id, data))
    }
//   const onClear = () => {
//     setStartDateTime("")
//     setEndDateTime("")
//     setStartDate("")
//     setEndDate("")
//     setStartTime("")
//     setEndTime("")
//   };



  useEffect(() => {
    console.log(channelDir)
  }, [channelDir])

  useEffect(() => {
}, [path])

//   useEffect(() => {
//     console.log(path)
//     dispatch(getChannelDir(channelInfo.id, path.join("/")))
//     console.log(channelDir)
//   }, [path]);

  return (
    <Modal isOpen={isOpen} toggle={onClose} tabIndex={-1} onOpened={onLoad} centered scrollable>
      <ModalHeader className="modal-title-custom" toggle={onClose}>
        檔案
      </ModalHeader>
      {role === 0 && (
        <ModalFooter>
          {role === 0 && (
            <>
            <Button onClick={()=>{}}>新增資料夾</Button>
            <Button onClick={()=>{}}>上傳檔案</Button>
            </>
          )}
        </ModalFooter>
      )}
      <ModalBody className="p-4">
        <FormGroup>
        <Button disabled={path.length === 0 || !path} onClick={onBack}>
          <i className="mdi mdi-arrow-left"></i>
        </Button>   
        <Label htmlFor="RollCallStartTime-input" className="form-label">現在位置: </Label>
        <Input               
          type="datetime"
          className="form-control mb-3"
          id="RollCallStartTime-input"
          value={path.join("/")}
          disabled={true} />
      </FormGroup>
      <Table>
        <thead>
          <tr>
            <th>
              名稱
            </th>
          </tr>
        </thead>
        <FormGroup>
        <Label className="form-label" style={{color: "red"}}>
              {(channelDir.length === 0) && "沒有檔案"}
        </Label>
        </FormGroup>
        {(channelDir || []).map((dir: string, key: number) => {
          return (
            <>
            <tbody>
              <tr className="table-primary" style={{padding: "20px"}} onClick={() => {isDir[key] && onSelectDir(dir)}}>
                <td>
                  {isDir[key] ? (<i className="mdi mdi-folder" style={{margin: "10px"}}></i>) : (<i className="mdi mdi-file" style={{margin: "10px"}}></i>)}
                  {dir}
                </td>
              </tr>
            </tbody>
            </>
          );
        })}
        </Table>
      </ModalBody>
    </Modal>
  );
};

export default FileModal;
