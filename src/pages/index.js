/*
 * @Author: zhangyanbin
 * @Date: 2021-06-03 10:43:08
 * @LastEditors: zhangyanbin
 * @LastEditTime: 2021-06-04 08:54:00
 * @Description: file content
 */
import styles from './index.less';
import React from 'react';
import Header from './components/Header';
import SignList from './components/SignList';

const IndexPage = () => {
  return (
    <div>
      <div className={styles.mainWrap}>
        <Header></Header>
        <SignList></SignList>
      </div>
    </div>
  );
};

export default IndexPage;
