/*
 * @Author: zhangyanbin
 * @Date: 2021-06-04 08:43:28
 * @LastEditors: zhangyanbin
 * @LastEditTime: 2021-06-07 17:17:36
 * @Description: file content
 */

import React, { useEffect, memo } from "react";
import { Card, Col, Row, Popconfirm, message, Empty } from "antd";
import {
  EditOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { connect } from "umi";
import moment from "moment";
import styles from "./index.less";

const SignList = (props) => {
  const currentDate = moment().format("YYYY-MM-DD");

  useEffect(() => {
    getSignList();
  }, []);

  const getSignList = () => {
    props.dispatch({
      type: "global/getSignList",
    });
  };

  const handleSign = (item, index) => {
    let res = window.ipcRenderer.sendSync("sign", item);
    if (res == "success") {
      props.dispatch({
        type: "global/signItem",
        payload: index,
        callback: (res) => {
          res == "success"
            ? message.success("签到成功！")
            : message.fail("签到失败！");
        },
      });
    } else {
      message.fail("签到失败！");
    }
  };

  const handleDelete = (item, index) => {
    props.dispatch({
      type: "global/deleteSignItem",
      payload: index,
      callback: (res) => {
        res == "success"
          ? message.success("删除成功！")
          : message.fail("删除失败！");
      },
    });
  };

  const renderSignTips = (item) => {
    if (!item.latestSignInTime) {
      return "今日未签到";
    } else {
      if (item.latestSignInTime.includes(currentDate)) {
        return "今日已签到";
      } else {
        return "今日未签到";
      }
    }
  };

  return (
    <div className={styles.signListWrap}>
      <div className="site-card-wrapper">
        {props.signList && props.signList.length == 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
        ) : (
          <Row gutter={[16, 16]}>
            {props.signList &&
              props.signList.map((item, index) => (
                <Col span={12} key={index}>
                  <Card
                    title={item.name}
                    actions={[
                      <EditOutlined
                        key="sign"
                        onClick={() => handleSign(item, index)}
                      />,
                      <SettingOutlined key="edit" />,
                      <Popconfirm
                        title="Are you sure？"
                        icon={
                          <QuestionCircleOutlined style={{ color: "red" }} />
                        }
                        onConfirm={() => handleDelete(item, index)}
                      >
                        <DeleteOutlined key="delete" />
                      </Popconfirm>,
                    ]}
                  >
                    {renderSignTips(item)}
                    {/* {item.latestSignInTime.include} */}
                    {/* {item.latestSignInTime ? item.latestSignInTime : "今日未签到"} */}
                  </Card>
                </Col>
              ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default connect(({ global }) => ({
  ...global,
}))(memo(SignList));
