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
import {
  getChannelDir,
  createChannelDir,
  uploadChannelFile,
  downloadChannelFile,
  getChannelHomeworks,
  doRollCall,
  changeSelectedHomework,
  changeSelectedDir,
} from "../redux/actions";
import { channelHomeworkModel } from "../redux/chats/types";
import { Link } from "react-router-dom";
import { Icons } from "react-toastify";
import { pathToFileURL } from "url";
import Loader from "./Loader";

interface FileModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: number;
}
const FileModal = ({ isOpen, onClose, role }: FileModalProps) => {
  const { dispatch, useAppSelector } = useRedux();
  const { channelInfo, channelDir, isDir, fileLoading } = useAppSelector(
    state => ({
      channelInfo: state.Chats.selectedChatInfo,
      channelDir: state.Chats.channelDir,
      isDir: state.Chats.isDir,
      fileLoading: state.Chats.fileLoading,
    })
  );
  const [files, setFiles] = useState<Array<any>>([]);
  const [path, setPath] = useState<Array<string>>([]);
  const [isOpenInputName, setIsOpenInputName] = useState(false);
  const [isOpenUploadFile, setIsOpenUploadFile] = useState(false);
  const [dirName, setDirName] = useState("");

  const onSelectDir = (info: string) => {
    dispatch(changeSelectedDir(info));
    if (info) setPath([...path, info]);
    let tmp = [...path, info].join("/");
    let data = {
      path: tmp,
    };
    dispatch(getChannelDir(channelInfo.id, data));
  };
  const onBack = () => {
    let tmp = [...path];
    tmp.pop();
    let data = {
      path: tmp.length === 0 ? "" : tmp.join("/"),
    };
    dispatch(getChannelDir(channelInfo.id, data));
    setPath([...tmp]);
  };

  const onLoad = () => {
    let data = {
      path: "",
    };
    dispatch(getChannelDir(channelInfo.id, data));
  };

  const onAddDir = () => {
    let tmp = [...path];
    tmp.push(dirName);
    setDirName("");
    dispatch(
      createChannelDir({
        id: channelInfo.id,
        path: tmp.length === 0 ? "" : tmp.join("/"),
      })
    );
  };
  const onUpload = () => {
    let tmp = [...path];
    files.forEach(file => {
      let data = {
        channelID: channelInfo.id,
        file: file,
        dirArray: tmp,
      };
      dispatch(uploadChannelFile(data));
    });
  };

  const onDownload = (filename: string) => {
    let tmp = [...path, filename];
    let data = {
      channelID: channelInfo.id,
      dirArray: tmp,
    };
    dispatch(downloadChannelFile(filename, data));
  };

  const onSelectFiles = (e: any) => {
    console.log(e.target.files);
    setFiles([...e.target.files]);
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      tabIndex={-1}
      onOpened={onLoad}
      centered
      scrollable
    >
      <ModalHeader className="modal-title-custom" toggle={onClose}>
        檔案
      </ModalHeader>
      {role !== 2 && (
        <ModalFooter>
          {role !== 2 && (
            <>
              <Button onClick={() => setIsOpenInputName(true)}>
                新增資料夾
              </Button>
              <Button
                className="btn btn-primary"
                onClick={() => setIsOpenUploadFile(true)}
              >
                上傳檔案
              </Button>
            </>
          )}
        </ModalFooter>
      )}
      {fileLoading && <Loader />}
      {isOpenInputName && (
        <ModalBody>
          <Label htmlFor="path-input" className="form-label">
            請輸入資料夾名稱:{" "}
          </Label>
          <Input
            className="form-control mb-3"
            id="path-input"
            value={dirName}
            onChange={(e: any) => {
              setDirName(e.target.value);
            }}
          />
          <Button
            disabled={dirName.trim().length === 0}
            color="primary"
            onClick={onAddDir}
          >
            確認
          </Button>
        </ModalBody>
      )}
      {isOpenUploadFile && (
        <ModalBody>
          <FormGroup>
            <Label htmlFor="file-input" className="form-label">
              檔案:
            </Label>
            <Input
              type="file"
              className="form-control mb-3"
              id="file-input"
              onChange={(e: any) => onSelectFiles(e)}
            />
            <Button
              disabled={files.length == 0}
              color="primary"
              onClick={onUpload}
            >
              確認
            </Button>
          </FormGroup>
        </ModalBody>
      )}
      <ModalBody className="p-4">
        <Form>
          <FormGroup>
            <Link
              to="#"
              style={{pointerEvents: path.length === 0 || !path ?  'none' : undefined}}
              onClick={() => {
                onBack();
              }}
            >
              <i className="bx bx-left-arrow-alt" style={{padding: 10}}></i>
            </Link>
            <Label htmlFor="RollCallStartTime-input" className="form-label">
              現在位置:{" "}
            </Label>
            <Input
              type="datetime"
              className="form-control mb-3"
              id="RollCallStartTime-input"
              value={path.join("/")}
              disabled={true}
            />
          </FormGroup>
        </Form>
        <Table>
          <thead>
            <tr>
              <th>名稱</th>
            </tr>
          </thead>
          {(channelDir || []).map((dir: string, key: number) => {
            return (
              <tbody key={key}>
                <tr className="table-primary" style={{ padding: "20px" }}>
                  <td>
                    <Link
                      to="#"
                      onClick={() => {
                        isDir[key] ? onSelectDir(dir) : onDownload(dir);
                      }}
                    >
                      {isDir[key] ? (
                        <i
                          className="mdi mdi-folder"
                          style={{ margin: "10px" }}
                        ></i>
                      ) : (
                        <i
                          className="mdi mdi-file"
                          style={{ margin: "10px" }}
                        ></i>
                      )}
                      {dir}
                    </Link>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </Table>
        <Form>
          <FormGroup>
            <Label className="form-label" style={{ color: "red" }}>
              {(channelDir.length === 0 || !channelDir) && "沒有檔案"}
            </Label>
          </FormGroup>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default FileModal;
