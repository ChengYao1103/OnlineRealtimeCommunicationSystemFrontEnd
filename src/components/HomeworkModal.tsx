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
import { createHomework, updateHomework, closeHomework, getChannelHomeworks, doRollCall, changeSelectedHomework } from "../redux/actions";
import { channelHomeworkModel } from "../redux/chats/types";
import { Link } from "react-router-dom";

interface HomeworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: number;
}
const HomeworkModal = ({
  isOpen,
  onClose,
  role,
}: HomeworkModalProps) => {
    const { dispatch, useAppSelector } = useRedux();
    const { channelInfo, channelHomeworks, homeworkInfo } = useAppSelector(state => ({
      channelInfo: state.Chats.selectedChatInfo,
      channelHomeworks: state.Chats.channelHomeworks,
      homeworkInfo: state.Chats.selectedHomework,
    }));

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [mode, setMode] = useState(0); //0: 作業總覽 1: 作業詳細內容 2:編輯作業 3: 新增作業

    const onSelectHomework = (
        info: channelHomeworkModel | null,
      ) => {
        if (homeworkInfo === info) {
          return;
        }
        dispatch(changeSelectedHomework(info));
        console.log(info)
        console.log(homeworkInfo)
      };
    
  const onClear = () => {
    setStartDateTime("")
    setEndDateTime("")
    setStartDate("")
    setEndDate("")
    setStartTime("")
    setEndTime("")
  };

  useEffect(() => {
    //onClear()
    console.log(channelInfo)
    dispatch(getChannelHomeworks(channelInfo.id))
    console.log(channelHomeworks)
  }, []);

  return (
    <Modal isOpen={isOpen} toggle={onClose} tabIndex={-1} centered scrollable>
      <ModalHeader className="modal-title-custom" toggle={onClose}>
        {mode === 0 && "作業總覽" || mode === 1 && "詳細內容" || mode === 2 && "編輯作業" || mode === 3 && "新增作業"}
      </ModalHeader>
      {role === 0 && (
        <ModalFooter>
          {mode === 0 && (
            <Button onClick={()=> setMode(3)}>新增作業</Button>
          )}
          {mode === 1 && (
            <>
              <Button onClick={()=> setMode(2)}>編輯作業</Button>
              <Button onClick={()=> setMode(0)}>回到作業總覽</Button>
            </>
          )}
          {mode === 2 && (
            <>
              <Button onClick={()=> setMode(1)}>回到詳細內容</Button>
              <Button onClick={()=> setMode(0)}>回到作業總覽</Button>
            </>
          )}
          {mode === 3 && (
            <Button onClick={()=> setMode(0)}>回到作業總覽</Button>
          )}
        </ModalFooter>
      )}
      <ModalBody className="p-4">
      {mode === 0 && <Table>
        <thead>
          <tr>
            <th>
              作業名稱
            </th>
            <th>
              截止時間
            </th>
          </tr>
        </thead>
        {(channelHomeworks || []).map((homework: channelHomeworkModel, key: number) => {
          return (
            <>
            <tbody>
              <tr className="table-primary" onClick={() => {setMode(1); onSelectHomework(homework)}}>
                <td>
                  {homework.name}
                </td>
                <td>
                  {homework.endTime !== "0001-01-01T00:00:00Z" ? new Date(homework.endTime).toLocaleString() : "無截止時間"}
                </td>
              </tr>
            </tbody>
            </>
          );
        })}
        </Table>}
        {mode === 1 && <Form>
            <FormGroup>
            <Label htmlFor="RollCallStartTime-input" className="form-label">
              {homeworkInfo ? homeworkInfo.name : "undefined"}
            </Label>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="RollCallStartTime-input" className="form-label">
              敘述:
            </Label>
            <Input
              type="datetime"
              className="form-control mb-3"
              id="RollCallStartTime-input"
              value={homeworkInfo.description}
              disabled={true}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="RollCallStartTime-input" className="form-label">
              建立時間:
            </Label>
            <Input
              type="datetime"
              className="form-control mb-3"
              id="RollCallStartTime-input"
              value={new Date(homeworkInfo.createTime).toLocaleString()}
              disabled={true}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="RollCallStartTime-input" className="form-label">
              開始時間:
            </Label>
            <Input
              type="datetime"
              className="form-control mb-3"
              id="RollCallStartTime-input"
              value={new Date(homeworkInfo.startTime).toLocaleString()}
              disabled={true}
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
              value={homeworkInfo.endTime == "0001-01-01T00:00:00Z" ? "" : new Date(homeworkInfo.endTime).toLocaleString()}
              disabled={true}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="RollCallEndTime-input" className="form-label">
              成績:
            </Label>
            <Input
              type="datetime"
              className="form-control mb-3"
              id="RollCallEndTime-input"
              value={"尚未批改"}
              disabled={true}
            ></Input>
          </FormGroup>
          </Form>
        }
        {(mode === 2 || mode === 3) && <Form>
          <div className="mb-3">
          <FormGroup>
          <Label htmlFor="RollCallStartTime-input" className="form-label">
            作業名稱:
          </Label>
          <Input
            className="form-control mb-3"
            id="RollCallStartTime-input"
            placeholder="請輸入此作業的名稱"
            value={name}
            onChange={(e: any) => {
              setName(e.target.value);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="RollCallStartTime-input" className="form-label">
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
        </div>
        </Form>
      }
      </ModalBody>
      <ModalFooter>
        <Button type="button" color="link" className="btn" onClick={onClose}>
          取消
        </Button>
        <Button
          type="button"
          color="primary"
          //disabled={!valid}
          onClick={() => {
            if(mode === 1) {
              dispatch(closeHomework({
                id: homeworkInfo.id
              }))
            }
            if(mode === 2) {
                let tmpStartDateTime = startDate + " " + startTime
                let tmpEndDateTime = endDate + " " + endTime
                  dispatch(updateHomework({
                    id: homeworkInfo.id,
                    name: name,
                    description: description,
                    startTime: new Date(tmpStartDateTime).toISOString(), 
                    endTime: endDate ? new Date(tmpEndDateTime).toISOString() : null,
                    type: false,
                  }))
            }
            if(mode === 3) {
              let tmpStartDateTime = startDate + " " + startTime
              let tmpEndDateTime = endDate + " " + endTime
                dispatch(createHomework({
                    channelID: channelInfo.id,
                    name: name,
                    description: description,
                    startTime: new Date(tmpStartDateTime).toISOString(), 
                    endTime: endDate ? new Date(tmpEndDateTime).toISOString() : null,
                    type: false,
                }))
            }
          }}
        >
          送出
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default HomeworkModal;
