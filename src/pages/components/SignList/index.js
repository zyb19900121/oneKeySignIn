/*
 * @Author: zhangyanbin
 * @Date: 2021-06-04 08:43:28
 * @LastEditors: zhangyanbin
 * @LastEditTime: 2021-06-04 17:07:59
 * @Description: file content
 */

import React, { useEffect, memo } from 'react';
import { Card, Col, Row, Popconfirm, message, Empty } from 'antd';
import {
  EditOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { connect } from 'umi';
import styles from './index.less';

const SignList = (props) => {
  useEffect(() => {
    getSignList();
  }, []);

  const getSignList = () => {
    props.dispatch({
      type: 'global/getSignList',
    });
  };

  const handleSign = (item, index) => {
    let res = window.ipcRenderer.sendSync('sign', item);
  };

  const handleDelete = (item, index) => {
    props.dispatch({
      type: 'global/deleteSignItem',
      payload: index,
      callback: (res) => {
        res == 'success'
          ? message.success('删除成功！')
          : message.fail('删除失败！');
      },
    });
  };
  return (
    <div className={styles.signListWrap}>
      <div className="site-card-wrapper">
        {props.signList.length == 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
        ) : (
          <Row gutter={[16, 16]}>
            {props.signList.map((item, index) => (
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
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      onConfirm={() => handleDelete(item, index)}
                    >
                      <DeleteOutlined key="delete" />
                    </Popconfirm>,
                  ]}
                >
                  {item.latestSignInTime ? item.latestSignInTime : '今日未签到'}
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
