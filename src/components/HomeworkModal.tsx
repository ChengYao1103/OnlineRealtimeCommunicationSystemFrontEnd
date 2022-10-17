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
  Col,
} from "reactstrap";
import { useRedux } from "../hooks";
import {
  createHomework,
  updateHomework,
  closeHomework,
  getChannelHomeworks,
  uploadHomework,
  changeSelectedHomework,
  getAllUpload,
  downloadHomework,
  setHomeworkScore,
  getHomeworkScore,
} from "../redux/actions";
import {
  channelHomeworkModel,
  homeworkUploadModel,
} from "../redux/chats/types";

//images
import imagePlaceholder from "../assets/images/users/profile-placeholder.png";
import { Link } from "react-router-dom";
import { parse } from "date-fns";
import Loader from "./Loader";

interface HomeworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: number;
}
const HomeworkModal = ({ isOpen, onClose, role }: HomeworkModalProps) => {
  const { dispatch, useAppSelector } = useRedux();
  const {
    channelInfo,
    channelHomeworks,
    homeworkInfo,
    homeworkUploads,
    score,
    homeworkLoading,
  } = useAppSelector(state => ({
    channelInfo: state.Chats.selectedChatInfo,
    channelHomeworks: state.Chats.channelHomeworks,
    homeworkInfo: state.Chats.selectedHomework,
    homeworkUploads: state.Chats.homeworkUploads,
    score: state.Chats.score,
    homeworkLoading: state.Chats.homeworkLoading,
  }));

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [mode, setMode] = useState(0); //0: 作業總覽 1: 作業詳細內容 2:編輯作業 3: 新增作業 4:作業繳交情況
  const [file, setFile] = useState<any>();
  const [isEditing, setIsEditing] = useState(false);
  const [inputScore, setInputScore] = useState("");
  const onSelectHomework = (info: channelHomeworkModel | null) => {
    if (homeworkInfo === info) {
      return;
    }
    dispatch(changeSelectedHomework(info));
    if (role === 2) {
      if (info) dispatch(getHomeworkScore(info.id));
    }
  };

  useEffect(() => {
    if (homeworkInfo && mode === 2) {
      setName(homeworkInfo.name);
      setDescription(homeworkInfo.description);
    } else {
      setName("");
      setDescription("");
      setStartDate("");
      setStartTime("");
      setEndDate("");
      setEndTime("");
    }
  }, [homeworkInfo, mode]);

  const onUpload = () => {
    let data = {
      homeworkID: homeworkInfo.id,
      file: file,
    };
    dispatch(uploadHomework(data));
  };

  const onDownload = (upload: homeworkUploadModel) => {
    let data = {
      homeworkID: homeworkInfo.id,
      userID: upload.user.id,
    };
    dispatch(downloadHomework(upload.fileName, data));
  };

  const onSelectFile = (e: any) => {
    setFile(e.target.files[0]);
  };

  const getAllHomewrkUpload = () => {
    dispatch(getAllUpload(homeworkInfo.id));
  };

  useEffect(() => {
    dispatch(getChannelHomeworks(channelInfo.id));
  }, []);

  return (
    <Modal isOpen={isOpen} toggle={onClose} tabIndex={-1} centered scrollable>
      <ModalHeader className="modal-title-custom" toggle={onClose}>
        {(mode === 0 && "作業總覽") ||
          (mode === 1 && "詳細內容") ||
          (mode === 2 && "編輯作業") ||
          (mode === 3 && "新增作業")}
      </ModalHeader>
      <ModalFooter>
        {role !== 2 ? (
          <>
            {mode === 0 && <Button onClick={() => setMode(3)}>新增作業</Button>}
            {mode === 1 && (
              <>
                <Button onClick={() => setMode(2)}>編輯作業</Button>
                <Button onClick={() => setMode(0)}>回到作業總覽</Button>
                <Button
                  onClick={() => {
                    setMode(4);
                    getAllHomewrkUpload();
                  }}
                >
                  繳交情況
                </Button>
              </>
            )}
            {mode === 2 && (
              <>
                <Button onClick={() => setMode(1)}>回到詳細內容</Button>
                <Button onClick={() => setMode(0)}>回到作業總覽</Button>
              </>
            )}
            {(mode === 3 || mode === 4) && (
              <Button onClick={() => setMode(0)}>回到作業總覽</Button>
            )}
          </>
        ) : (
          mode === 1 && <Button onClick={() => setMode(0)}>回到作業總覽</Button>
        )}
      </ModalFooter>
      {homeworkLoading && <Loader />}
      <ModalBody className="p-4">
        {mode === 0 && (
          <Table>
            <thead>
              <tr>
                <th>作業名稱</th>
                <th>截止時間</th>
              </tr>
            </thead>
            {(channelHomeworks || []).map(
              (homework: channelHomeworkModel, key: number) => {
                return (
                  <tbody key={key}>
                    <tr
                      className="table-primary"
                      onClick={() => {
                        setMode(1);
                        onSelectHomework(homework);
                      }}
                    >
                      <td>{homework.name}</td>
                      <td>
                        {homework.endTime !== "0001-01-01T00:00:00Z"
                          ? new Date(homework.endTime).toLocaleString()
                          : "無截止時間"}
                      </td>
                    </tr>
                  </tbody>
                );
              }
            )}
          </Table>
        )}
        {mode === 1 && (
          <Form>
            <FormGroup>
              <Label className="form-label">
                {homeworkInfo ? homeworkInfo.name : "undefined"}
              </Label>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="HomeworkDescription-input" className="form-label">
                敘述:
              </Label>
              <Input
                type="datetime"
                className="form-control mb-3"
                id="HomeworkDescription-inputt"
                value={homeworkInfo.description}
                disabled={true}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="HomeworkCreateTime-input" className="form-label">
                建立時間:
              </Label>
              <Input
                type="datetime"
                className="form-control mb-3"
                id="HomeworkCreateTime-input"
                value={new Date(homeworkInfo.createTime).toLocaleString()}
                disabled={true}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="HomeworkStartTime-input" className="form-label">
                開始時間:
              </Label>
              <Input
                type="datetime"
                className="form-control mb-3"
                id="HomeworkStartTime-input"
                value={new Date(homeworkInfo.startTime).toLocaleString()}
                disabled={true}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="HomeworkEndTime-input" className="form-label">
                結束時間:
              </Label>
              <Input
                type="datetime"
                className="form-control mb-3"
                id="HomeworkEndTime-input"
                value={
                  homeworkInfo.endTime == "0001-01-01T00:00:00Z"
                    ? ""
                    : new Date(homeworkInfo.endTime).toLocaleString()
                }
                disabled={true}
              ></Input>
            </FormGroup>
            {role === 2 && (
              <>
                <FormGroup>
                  <Label htmlFor="HomeworkFile-input" className="form-label">
                    檔案:
                  </Label>
                  <Input
                    type="file"
                    className="form-control mb-3"
                    id="HomeworkFile-input"
                    //value={"test"}
                    onChange={(e: any) => onSelectFile(e)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="HomeworkScore-input" className="form-label">
                    成績:
                  </Label>
                  <Input
                    type="datetime"
                    className="form-control mb-3"
                    id="HomeworkScore-input"
                    value={score != -1 ? score : "尚未批改"}
                    disabled={true}
                  ></Input>
                </FormGroup>
              </>
            )}
          </Form>
        )}
        {(mode === 2 || mode === 3) && (
          <Form>
            <div className="mb-3">
              <FormGroup>
                <Label htmlFor="HomeworkName-input" className="form-label">
                  作業名稱:
                </Label>
                <Input
                  className="form-control mb-3"
                  id="HomeworkName-input"
                  placeholder="請輸入此作業的名稱"
                  value={name}
                  onChange={(e: any) => {
                    setName(e.target.value);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label
                  htmlFor="HomeworkDescription-input"
                  className="form-label"
                >
                  敘述(選填):
                </Label>
                <Input
                  className="form-control mb-3"
                  id="RollCallStartTime-input"
                  placeholder="請輸入關於此作業的敘述"
                  value={description}
                  onChange={(e: any) => {
                    setDescription(e.target.value);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="HomeworkStartDate-input" className="form-label">
                  開始日期:
                </Label>
                <Input
                  type="date"
                  className="form-control mb-3"
                  id="HomeworkStartDate-input"
                  placeholder="Choose start date"
                  value={startDate}
                  onChange={(e: any) => {
                    setStartDate(e.target.value);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="HomeworkStartTime-input" className="form-label">
                  開始時間:
                </Label>
                <Input
                  type="time"
                  className="form-control mb-3"
                  id="HomeworkStartTime-input"
                  placeholder="Choose start time"
                  value={startTime}
                  onChange={(e: any) => {
                    setStartTime(e.target.value);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="HomeworkEndDate-input" className="form-label">
                  結束日期(選填):
                </Label>
                <Input
                  type="date"
                  className="form-control mb-3"
                  id="HomeworkEndDate-input"
                  placeholder="Choose end date (optional)"
                  value={endDate}
                  onChange={(e: any) => {
                    setEndDate(e.target.value);
                  }}
                ></Input>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="HomeworkEndTime-input" className="form-label">
                  結束時間(選填):
                </Label>
                <Input
                  type="time"
                  className="form-control mb-3"
                  id="HomeworkEndTime-input"
                  placeholder="Choose end time (optional)"
                  value={endTime}
                  onChange={(e: any) => {
                    setEndTime(e.target.value);
                  }}
                ></Input>
              </FormGroup>
            </div>
          </Form>
        )}
        {mode === 4 && (
          <Table>
            <thead>
              <tr>
                <th>學生</th>
                <th>檔案</th>
                <th>分數</th>
              </tr>
            </thead>
            {(homeworkUploads || []).map(
              (upload: homeworkUploadModel, key: number) => {
                return (
                  <tbody key={key}>
                    <tr
                      className="table-primary"
                      style={{ padding: "20px" }}
                      onClick={() => {
                        //isDir[key] ? onSelectDir(dir) : onDownload(dir);
                      }}
                    >
                      <td>
                        <Link to="#" className="p-0">
                          <div className="d-flex align-items-center">
                            <div className="chat-avatar me-2">
                              <img
                                src={
                                  upload.user.photo !== ""
                                    ? upload.user.photo
                                    : imagePlaceholder
                                }
                                alt=""
                                width="20"
                                height="20"
                              />
                            </div>
                            <h6 className="m-0">{upload.user.name}</h6>
                          </div>
                        </Link>
                      </td>
                      <td>
                        <Link to="#" onClick={() => onDownload(upload)}>
                          <p className="mb-0 ctext-content">
                            <i className="mdi mdi-download"> </i>
                            {upload.fileName}
                          </p>
                        </Link>
                      </td>
                      <td>
                        {!isEditing ? (
                          <p className="mb-0 ctext-content">
                            {upload.score}

                            <Link to="#" onClick={() => setIsEditing(true)}>
                              <i className="mdi mdi-pen" style={{ margin: 10 }}>
                                {" "}
                              </i>
                            </Link>
                          </p>
                        ) : (
                          <Form inline key={key}>
                            <FormGroup row>
                              <div className="input-group">
                                <Input
                                  className="mr-sm-3"
                                  id="score-input"
                                  value={inputScore ? inputScore : upload.score}
                                  onChange={e =>
                                    setInputScore(
                                      e.target.value.replace(/\D/g, "")
                                    )
                                  }
                                  width={10}
                                ></Input>
                                <Link
                                  to="#"
                                  onClick={() => {
                                    setIsEditing(false);
                                    inputScore &&
                                      dispatch(
                                        setHomeworkScore({
                                          userID: upload.user.id,
                                          homeworkID: homeworkInfo.id,
                                          score: Number(inputScore),
                                        })
                                      );
                                    setInputScore("");
                                  }}
                                >
                                  <i
                                    className="mdi mdi-check"
                                    style={{ margin: 10 }}
                                  >
                                    {" "}
                                  </i>
                                </Link>
                              </div>
                            </FormGroup>
                          </Form>
                        )}
                      </td>
                    </tr>
                  </tbody>
                );
              }
            )}
          </Table>
        )}
      </ModalBody>
      {((role === 2 && mode === 1) || mode === 2 || mode === 3) && (
        <ModalFooter>
          <Button type="button" color="link" className="btn" onClick={onClose}>
            取消
          </Button>
          <Button
            type="button"
            color="primary"
            //disabled={!valid}
            onClick={() => {
              if (mode === 1) {
                if (role === 2) {
                  onUpload();
                } else {
                  dispatch(
                    closeHomework({
                      id: homeworkInfo.id,
                    })
                  );
                }
              }
              if (mode === 2) {
                let tmpStartDateTime = startDate + " " + startTime;
                let tmpEndDateTime = endDate + " " + endTime;
                dispatch(
                  updateHomework({
                    id: homeworkInfo.id,
                    name: name,
                    description: description,
                    startTime: new Date(tmpStartDateTime).toISOString(),
                    endTime: endDate
                      ? new Date(tmpEndDateTime).toISOString()
                      : null,
                    type: false,
                  })
                );
              }
              if (mode === 3) {
                let tmpStartDateTime = startDate + " " + startTime;
                let tmpEndDateTime = endDate + " " + endTime;
                dispatch(
                  createHomework({
                    channelID: channelInfo.id,
                    name: name,
                    description: description,
                    startTime: new Date(tmpStartDateTime).toISOString(),
                    endTime: endDate
                      ? new Date(tmpEndDateTime).toISOString()
                      : null,
                    type: false,
                  })
                );
              }
            }}
          >
            送出
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
};

export default HomeworkModal;
