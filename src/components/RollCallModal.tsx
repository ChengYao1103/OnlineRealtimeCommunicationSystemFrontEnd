import React, { useEffect, useState } from "react";
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
  FormFeedback,
} from "reactstrap";
import { useRedux } from "../hooks";
import {
  createRollCall,
  updateRollCall,
  closeRollCall,
  getRollCall,
  doRollCall,
  getRollCallRecordsByID,
  getMyRollCallRecord,
  getChannelRollCalls,
  changeSelectedRollCall,
  getRollCallRecords,
} from "../redux/actions";
import { rollCallModel, rollCallRecordModel } from "../redux/chats/types";
import Loader from "./Loader";

interface RollCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: number;
}
const RollCallModal = ({ isOpen, onClose, role }: RollCallModalProps) => {
  const { dispatch, useAppSelector } = useRedux();
  const {
    channelInfo,
    rollCall,
    rollCallRecords,
    myRollCallRecord,
    selectedRollCall,
    channelRollCalls,
    rollCallLoading,
  } = useAppSelector(state => ({
    channelInfo: state.Chats.selectedChatInfo,
    rollCall: state.Chats.rollCall,
    rollCallRecords: state.Chats.rollCallRecords,
    myRollCallRecord: state.Chats.myRollCallRecord,
    selectedRollCall: state.Chats.selectedRollCall,
    channelRollCalls: state.Chats.channelRollCalls,
    rollCallLoading: state.Chats.rollCallLoading,
  }));

  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [mode, setMode] = useState(0); //0: 查看進行中的點名 1: 編輯進行中點名(老師) 2: 新增點名(老師) 3: 點名總表 4: 查看點名狀況(老師) 5: 查看點名狀況(學生)
  const [startDateInvalid, setStartDateInvalid] = useState(false);
  const [startTimeInvalid, setStartTimeInvalid] = useState(false);
  const [endDateInvalid, setEndDateInvalid] = useState(false);
  const [endTimeInvalid, setEndTimeInvalid] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const IsInvalid = () => {
    if (mode === 1 || mode === 2) {
      setStartDateInvalid(startTime !== "" && startDate === "")
      setEndDateInvalid(endTime !== "" && endDate === "")
    }
  }

  const IsButtonDisabled = () => {
    if (mode === 1) {
      if ((!startDate && !endDate) || startDateInvalid || endDateInvalid) setButtonDisabled(true)
      else setButtonDisabled(false)
    }
    else if (mode === 0) {
      if (role === 2 && (!rollCall || myRollCallRecord)) setButtonDisabled(true)
      else setButtonDisabled(false)
    }
    else setButtonDisabled(false)
  }

  const onLoad = () => {
    onClear();
    dispatch(getRollCall(channelInfo.id));
  };

  const onClear = () => {
    setStartDateTime("");
    setEndDateTime("");
    setStartDate("");
    setEndDate("");
    setStartTime("");
    setEndTime("");
  };

  const onSelectRollCall = (info: rollCallModel | null) => {
    if (selectedRollCall === info) {
      return;
    }
    dispatch(changeSelectedRollCall(info));
    if (info && role !== 2) {
      dispatch(getRollCallRecordsByID(info.id));
    } else if (info && role === 2) {
      dispatch(getMyRollCallRecord(info.id));
    }
  };

  const getChannelRollCallsByID = () => {
    dispatch(getChannelRollCalls(channelInfo.id));
  };

  useEffect(() => {
    IsInvalid()
    IsButtonDisabled()
  }, [mode, startDate, startTime, endDate, endTime]);

  useEffect(() => {
    if (mode === 0) {
      onClear();
      dispatch(getRollCall(channelInfo.id));
      if (role === 2) if (rollCall) dispatch(getMyRollCallRecord(rollCall?.id));
    }
  }, [mode]);

  useEffect(() => {
    onClear();
    dispatch(getRollCall(channelInfo.id));
  }, [channelInfo]);

  useEffect(() => {
    if (rollCall) {
      console.log(rollCall);
      dispatch(getMyRollCallRecord(rollCall?.id));
      if (new Date(rollCall.startTime).toISOString() !== "Invalid Date")
        setStartDateTime(new Date(rollCall.startTime).toLocaleString());
      if (new Date(rollCall.endTime).toLocaleString() !== "Invalid Date")
        setEndDateTime(new Date(rollCall.endTime).toLocaleString());
    }
  }, [rollCall]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => {
        onClose();
        onClear();
      }}
      onOpened={onLoad}
      onClosed={onClear}
      tabIndex={-1}
      centered
      scrollable
    >
      <ModalHeader className="modal-title-custom" toggle={onClose}>
        {(mode === 0 && "進行中的點名") ||
          (mode === 1 && "編輯進行中的點名") ||
          (mode === 2 && "新增點名") ||
          (mode === 3 && "歷史點名紀錄")}
      </ModalHeader>
      {mode === 0 && (
        <ModalFooter>
          {role !== 2 && (
            <>
              <Button disabled={!rollCall} onClick={() => setMode(1)}>
                編輯進行中的點名
              </Button>
              <Button onClick={() => setMode(2)}>新增點名</Button>
            </>
          )}
          <Button
            onClick={() => {
              getChannelRollCallsByID();
              setMode(3);
            }}
          >
            歷史點名紀錄
          </Button>
        </ModalFooter>
      )}
      {mode === 1 && (
        <ModalFooter>
          <Button onClick={() => setMode(0)}>查看進行中的點名</Button>
          <Button onClick={() => setMode(2)}>新增點名</Button>
          <Button
            onClick={() => {
              getChannelRollCallsByID();
              setMode(3);
            }}
          >
            歷史點名紀錄
          </Button>
        </ModalFooter>
      )}
      {mode === 2 && (
        <ModalFooter>
          <Button onClick={() => setMode(0)}>查看進行中的點名</Button>
          <Button
            onClick={() => {
              getChannelRollCallsByID();
              setMode(3);
            }}
          >
            歷史點名紀錄
          </Button>
        </ModalFooter>
      )}
      {mode === 3 && (
        <ModalFooter>
          <Button onClick={() => setMode(0)}>查看進行中的點名</Button>
          {role !== 2 && <Button onClick={() => setMode(2)}>新增點名</Button>}
        </ModalFooter>
      )}
      {(mode === 4 || mode === 5) && (
        <ModalFooter>
          <Button onClick={() => setMode(0)}>查看進行中的點名</Button>
          <Button
            onClick={() => {
              setMode(3);
            }}
          >
            歷史點名紀錄
          </Button>
        </ModalFooter>
      )}
      <ModalBody className="p-4">
        <Form>
          {rollCallLoading && <Loader />}
          <div className="mb-3">
            {(mode === 1 || mode === 2) && (
              <>
                <FormGroup>
                  <Label
                    htmlFor="RollCallStartDate-input"
                    className="form-label"
                  >
                    開始日期:
                  </Label>
                  <Input
                    type="date"
                    className="form-control mb-3"
                    id="RollCallStartDate-input"
                    placeholder="Choose start date"
                    value={startDate}
                    invalid={startDateInvalid}
                    onChange={(e: any) => {
                      setStartDate(e.target.value);
                    }}
                  />
                  {startDateInvalid && <FormFeedback>開始日期不能為空</FormFeedback>}
                </FormGroup>
                <FormGroup>
                  <Label
                    htmlFor="RollCallStartTime-input"
                    className="form-label"
                  >
                    開始時間:
                  </Label>
                  <Input
                    type="time"
                    className="form-control mb-3"
                    id="RollCallStartTime-input"
                    placeholder="Choose start time"
                    value={startTime}
                    onChange={(e: any) => {
                      setStartTime(e.target.value);
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="RollCallEndDate-input" className="form-label">
                    結束日期(選填):
                  </Label>
                  <Input
                    type="date"
                    className="form-control mb-3"
                    id="RollCallEndDate-input"
                    placeholder="Choose end date (optional)"
                    value={endDate}
                    invalid={endDateInvalid}
                    onChange={(e: any) => {
                      setEndDate(e.target.value);
                    }}
                  ></Input>
                  {endDateInvalid && <FormFeedback>結束日期不能為空</FormFeedback>}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="RollCallEndTime-input" className="form-label">
                    結束時間(選填):
                  </Label>
                  <Input
                    type="time"
                    className="form-control mb-3"
                    id="RollCallEndTime-input"
                    placeholder="Choose end time (optional)"
                    value={endTime}
                    onChange={(e: any) => {
                      setEndTime(e.target.value);
                    }}
                  ></Input>
                </FormGroup>
              </>
            )}
            {mode === 0 && (
              <>
                <FormGroup>
                  <Label className="form-label" style={{ color: "red" }}>
                    {(!rollCall || !startDateTime) && "目前沒有點名"}
                  </Label>
                </FormGroup>
                <FormGroup>
                  <Label
                    htmlFor="RollCallStartTime-input"
                    className="form-label"
                  >
                    開始時間:
                  </Label>
                  <Input
                    type="datetime"
                    className="form-control mb-3"
                    id="RollCallStartTime-input"
                    value={startDateTime}
                    disabled={true}
                    onChange={(e: any) => {
                      setStartDateTime(e.target.value);
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="RollCallEndTime-input" className="form-label">
                    結束時間:
                  </Label>
                  <Input
                    type="datetime"
                    className="form-control mb-3"
                    id="RollCallEndTime-input"
                    value={rollCall?.endTime === "0001-01-01T00:00:00Z" ? undefined : endDateTime}
                    disabled={true}
                    onChange={(e: any) => {
                      console.log(endDateTime)
                      if (!Date.parse(e.target.value)) setEndDateTime("");
                      else setEndDateTime(e.target.value);
                    }}
                  ></Input>
                </FormGroup>
              </>
            )}
            {mode === 3 && (
              <FormGroup>
                <Table>
                  <thead>
                    <tr>
                      <th>開始時間</th>
                      <th>結束時間</th>
                      <th>建立時間</th>
                    </tr>
                  </thead>
                  {(channelRollCalls || []).map(
                    (channelRollCall: rollCallModel, key: number) => {
                      return (
                        <tbody key={key}>
                          <tr
                            className="table-primary"
                            onClick={() => {
                              role === 2 ? setMode(5) : setMode(4);
                              onSelectRollCall(channelRollCall);
                            }}
                          >
                            <td>
                              {new Date(
                                channelRollCall.startTime
                              ).toLocaleString()}
                            </td>
                            <td>
                              {channelRollCall.endTime !==
                              "0001-01-01T00:00:00Z"
                                ? new Date(
                                    channelRollCall.endTime
                                  ).toLocaleString()
                                : "無截止時間"}
                            </td>
                            <td>
                              {new Date(
                                channelRollCall.createTime
                              ).toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      );
                    }
                  )}
                </Table>
              </FormGroup>
            )}
            {mode === 4 && (
              <FormGroup>
                <Table>
                  <thead>
                    <tr>
                      <th>學生姓名</th>
                      <th>簽到時間</th>
                    </tr>
                  </thead>
                  {(rollCallRecords || []).map(
                    (rollCallRecord: rollCallRecordModel, key: number) => {
                      return (
                        <tbody key={key}>
                          <tr
                            className="table-primary"
                            onClick={() => {
                              setMode(4);
                            }}
                          >
                            <td>{rollCallRecord.user.name}</td>
                            <td>
                              {new Date(
                                rollCallRecord.timestamp
                              ).toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      );
                    }
                  )}
                </Table>
              </FormGroup>
            )}
            {mode === 5 &&
              (myRollCallRecord ? (
                <FormGroup>
                  <Label
                    htmlFor="RollCallStartTime-input"
                    className="form-label"
                  >
                    簽到時間:
                  </Label>
                  <Input
                    type="datetime"
                    className="form-control mb-3"
                    id="RollCallStartTime-input"
                    value={new Date(
                      myRollCallRecord.timestamp
                    ).toLocaleString()}
                    disabled={true}
                  />
                </FormGroup>
              ) : (
                <FormGroup>
                  <Label className="form-label" style={{ color: "red" }}>
                    無點名紀錄
                  </Label>
                </FormGroup>
              ))}
          </div>
        </Form>
      </ModalBody>
      {mode !== 3 && mode !== 4 && mode !== 5 && (
        <Button
          color="primary"
          className="m-3"
          disabled={buttonDisabled}
          onClick={() => {
            if (role !== 2) {
              if (mode === 0) {
                dispatch(closeRollCall({id: rollCall.id}));
              } else if (mode === 1) {
                dispatch(
                  updateRollCall({
                    id: rollCall.id,
                    startTime: startDate 
                      ? new Date(startDate + " " + startTime).toISOString()
                      : null,
                    endTime: endDate
                      ? new Date(endDate + " " + endTime).toISOString()
                      : null,
                  })
                );
              } else if (mode === 2) {
                let tmpStartDateTime = startDate + " " + startTime;
                let tmpEndDateTime = endDate + " " + endTime;
                dispatch(
                  createRollCall({
                    channelID: channelInfo.id,
                    startTime: startDate
                      ? new Date(tmpStartDateTime).toISOString()
                      : null,
                    endTime: endDate
                      ? new Date(tmpEndDateTime).toISOString()
                      : null,
                  })
                );
              }
            } else {
              dispatch(doRollCall({ rollCallID: rollCall.id, status: 1 }));
            }
          }}
        >
          {(mode === 0 &&
            (role !== 2 ? "關閉點名" : myRollCallRecord ? "已簽到" : "簽到")) ||
            (mode === 1 && "儲存變更") ||
            (mode === 2 && "建立點名")}
        </Button>
      )}
    </Modal>
  );
};

export default RollCallModal;
