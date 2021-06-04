/*
 * @Author: zhangyanbin
 * @Date: 2021-06-03 13:59:21
 * @LastEditors: zhangyanbin
 * @LastEditTime: 2021-06-04 17:09:38
 * @Description: file content
 */
import React, { useState, useEffect, useCallback, memo } from 'react';
import { Button, message } from 'antd';
import { connect } from 'umi';
import styles from './index.less';
import AddModal from '../AddModal';

const Header = (props) => {
  const [modalVisible, setModalvisible] = useState(false);

  useEffect(() => {
    window.api.on('createItem', (event, arg) => {
      debugger;
      // prints "pong"
    });
  }, []);

  const handleAddBtnClick = () => {
    setModalvisible(true);
  };

  const handleCloseModal = useCallback(() => {
    setModalvisible(false);
  }, []);

  const handleCreateItem = useCallback((item) => {
    // let isSuccess = window.ipcRenderer.sendSync('createItem', item);
    props.dispatch({
      type: 'global/createSignItem',
      payload: item,
      callback: (res) => {
        res == 'success'
          ? message.success('添加成功！')
          : message.fail('添加失败！');
      },
    });

    setModalvisible(false);
  }, []);

  return (
    <>
      <div className={styles.headerWrap}>
        <div className={styles.title}>一键签到</div>
        <Button type="primary" onClick={handleAddBtnClick}>
          新增
        </Button>
      </div>
      <AddModal
        visible={modalVisible}
        createItem={handleCreateItem}
        closeModal={handleCloseModal}
      />
    </>
  );
};

export default connect(({ global }) => ({
  ...global,
}))(memo(Header));
