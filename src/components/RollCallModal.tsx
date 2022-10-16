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
} from "reactstrap";
import { useRedux } from "../hooks";
import { createRollCall, updateRollCall, closeRollCall, getRollCall, doRollCall, getRollCallRecordsByID, getMyRollCallRecord, getChannelRollCalls } from "../redux/actions";
import { rollCallModel } from "../redux/chats/types";

interface RollCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: number;
}
const RollCallModal = ({ isOpen, onClose, role }: RollCallModalProps) => {
  const { dispatch, useAppSelector } = useRedux();
  const { channelInfo, rollCall, rollCallRecords, myRollCallRecord, selectedRollCall, channelRollCalls } = useAppSelector(state => ({
    channelInfo: state.Chats.selectedChatInfo,
    rollCall: state.Chats.rollCall,
    rollCallRecords: state.Chats.rollCallRecords,
    myRollCallRecord: state.Chats.myRollCallRecord,
    selectedRollCall: state.Chats.selectedRollCall,
    channelRollCalls: state.Chats.channelRollCalls,
  }));

  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [mode, setMode] = useState(0); //0: 查看進行中的點名 1: 編輯進行中點名(老師) 2: 新增點名(老師) 3: 點名總表 4: 查看點名狀況(老師) 5: 查看點名狀況(學生)

  const onLoad = () => {
    onClear()
    dispatch(getRollCall(channelInfo.id));
  };

  const onClear = () => {
    setStartDateTime("")
    setEndDateTime("")
    setStartDate("")
    setEndDate("")
    setStartTime("")
    setEndTime("")
  };

  const getRollCallRecordsByRollCallID = () => {
    dispatch(getRollCallRecordsByID(selectedRollCall.id))
  }
  
  const getMyRollCallRecordByRollCallID = () => {
    dispatch(getMyRollCallRecord(selectedRollCall.id))
  }

  const getChannelRollCallsByID = () => {
    dispatch(getChannelRollCalls(channelInfo.id))
  }

  useEffect(() => {
    console.log(channelRollCalls)
  }, [channelRollCalls])

  useEffect(() => {
    if (mode === 0) {
      onClear()
      dispatch(getRollCall(channelInfo.id));
      dispatch(getMyRollCallRecord(rollCall?.id))
    }
  }, [mode]);

  useEffect(() => {
    onClear()
    dispatch(getRollCall(channelInfo.id));
  }, [channelInfo]);

  useEffect(() => {
    if (rollCall) {
      console.log(rollCall)
      dispatch(getMyRollCallRecord(rollCall?.id))
      if (new Date(rollCall.startTime).toISOString() !== "Invalid Date")
        setStartDateTime(new Date(rollCall.startTime).toLocaleString());
      if (new Date(rollCall.end).toLocaleString() !== "Invalid Date")
        setEndDateTime(new Date(rollCall.end).toLocaleString());
    }
  }, [rollCall]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => {onClose(); onClear();}}
      onOpened={onLoad}
      onClosed={onClear}
      tabIndex={-1}
      centered
      scrollable
    >
      <ModalHeader className="modal-title-custom" toggle={onClose}>
        {(mode === 0 && "進行中的點名") || (mode === 1 && "編輯進行中的點名") || (mode === 2 && "新增點名") || (mode === 3 && "歷史點名紀錄")}

      </ModalHeader>
        {mode === 0 &&
          <ModalFooter>
            {role == 0 && (
            <>
            <Button disabled={!rollCall} onClick={() => setMode(1)}>編輯進行中的點名</Button>
            <Button onClick={() => setMode(2)}>新增點名</Button>
            </>
            )}
            <Button onClick={() => {getChannelRollCallsByID(); setMode(3)}}>歷史點名紀錄</Button>
          </ModalFooter>
        }
        {mode === 1 &&
          <ModalFooter>
            <Button onClick={() => setMode(0)}>查看進行中的點名</Button>
            <Button onClick={() => setMode(2)}>新增點名</Button>
            <Button onClick={() => {getChannelRollCallsByID(); setMode(3)}}>歷史點名紀錄</Button>
          </ModalFooter>
        }
        {mode === 2 &&
          <ModalFooter>
            <Button onClick={() => setMode(0)}>查看進行中的點名</Button>
            <Button onClick={() => {getChannelRollCallsByID(); setMode(3)}}>歷史點名紀錄</Button>
          </ModalFooter>
        }
        {mode === 3 &&
          <ModalFooter>
            <Button onClick={() => setMode(0)}>查看進行中的點名</Button>
            {role != 2 && <Button onClick={() => setMode(2)}>新增點名</Button>}
          </ModalFooter>
        }
      {/* {role == 0 && (
        <ModalFooter>
          <Button>歷史點名紀錄</Button>
          <Button disabled={!rollCall && mode === 0 } onClick={()=> mode === 0 ? setMode(1) : setMode(0)}>{mode === 0 ? "編輯進行中的點名" : "查看進行中的點名"}</Button>
          <Button disabled={!rollCall && mode === 2 } onClick={()=> mode === 2 ? setMode(1) : setMode(2)}>{mode === 2 ? "編輯進行中的點名" : "新增點名"}</Button>
        </ModalFooter>
      )} */}
      <ModalBody className="p-4">
        <Form>
          <div className="mb-3">
          {(mode === 1 || mode === 2) &&
          (
          <>
          <FormGroup>
          <Label htmlFor="RollCallStartDate-input" className="form-label">
            開始日期:
          </Label>
          <Input
            type="date"
            className="form-control mb-3"
            id="RollCallStartDate-input"
            placeholder="Choose start date"
            value={startDate}
            onChange={(e: any) => {
              setStartDate(e.target.value);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="RollCallStartTime-input" className="form-label">
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
            onChange={(e: any) => {
              setEndDate(e.target.value);
            }}
          ></Input>
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
        {mode === 0 &&
        (<>
          <FormGroup>
            <Label className="form-label" style={{color: "red"}}>
              {(!rollCall || !startDateTime) && "目前沒有點名"}
            </Label>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="RollCallStartTime-input" className="form-label">
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
              value={endDateTime}
              disabled={true}
              onChange={(e: any) => {
                if (!Date.parse(e.target.value)) setEndDateTime("");
                else setEndDateTime(e.target.value);
              }}
            ></Input>
          </FormGroup>
          </>)
          }
          {mode === 3 &&
            <FormGroup>
              <Table>
                <thead>
                  <tr>
                    <th>
                      開始時間
                    </th>
                    <th>
                      結束時間
                    </th>
                    <th>
                      建立時間
                    </th>
                  </tr>
                </thead>
                {(channelRollCalls || []).map((channelRollCall: rollCallModel, key: number) => {
                  return (
                    <tbody>
                      <tr className="table-primary" onClick={() => {}}>
                      <td>
                      {/* <Input
            type="datetime"
            className="form-control mb-3"
            id="HomeworkStartDate-input"
            placeholder="Choose start date"
            value={new Date(channelRollCall.startTime).toLocaleString()}
            disabled={true}
          /> */}
                        {new Date(channelRollCall.startTime).toLocaleString()}
                      </td>
                      <td>
                      {/* <Input
            type="datetime"
            className="form-control mb-3"
            id="HomeworkStartDate-input"
            placeholder="Choose start date"
            value={ channelRollCall.endTime !== "0001-01-01T00:00:00Z" ? new Date(channelRollCall.endTime).toLocaleString() : "無截止時間"}
            disabled={true}
          /> */}
                        { channelRollCall.endTime !== "0001-01-01T00:00:00Z" ? new Date(channelRollCall.endTime).toLocaleString() : "無截止時間"}
                      </td>
                      <td>
                      {/* <Input
            type="datetime"
            className="form-control mb-3"
            id="HomeworkStartDate-input"
            placeholder="Choose start date"
            value={Date.parse(channelRollCall.createTime).toLocaleString()}
            disabled={true}
          /> */}
                        {new Date(channelRollCall.createTime).toLocaleString()}
                      </td>
                      </tr>
                    </tbody>
                  )
                })}
              </Table>
            </FormGroup>
          }
          </div>
        </Form>
      </ModalBody>
      <Button 
      color="primary" 
      className="m-3"
      disabled={mode === 0 && (!rollCall || myRollCallRecord)}
      onClick={() => {
          if (role === 0) {
            if (mode === 0) {
              dispatch(closeRollCall(rollCall.id))
            }
            else if (mode === 1) {
              dispatch(updateRollCall({id: rollCall.id, startTime: startDate + " " + startTime, endTime: endDate ? endDate + " " + endTime : null}))
            }
            else if (mode === 2) {
              let tmpStartDateTime = startDate + " " + startTime
              let tmpEndDateTime = endDate + " " + endTime
              dispatch(createRollCall({channelID: channelInfo.id, startTime: new Date(tmpStartDateTime).toISOString(), endTime: endDate ? new Date(tmpEndDateTime).toISOString() : null}))
            }
          }
          else {
            dispatch(doRollCall({rollCallID: rollCall.id, status: 1}))
          }
        }
      }
      >
        {role === 0 ? (mode === 0 ? "關閉點名" : (mode === 1 ? "儲存變更" : "建立點名")) : (myRollCallRecord ? "已簽到" : "簽到")}
      </Button>
    </Modal>
  );
};

export default RollCallModal;
