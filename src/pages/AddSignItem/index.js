/*
 * @Author: zhangyanbin
 * @Date: 2021-06-04 10:17:06
 * @LastEditors: zhangyanbin
 * @LastEditTime: 2021-06-04 10:58:40
 * @Description: file content
 */
import React from 'react';
import styles from './index.less';
import { Link } from 'umi';
import { LeftOutlined } from '@ant-design/icons';
import { Button, Modal, Form, Input, Radio } from 'antd';

const AddSignItem = () => {
  const [form] = Form.useForm();

  const onCancel = () => {
    form.resetFields();
    closeModal();
  };

  const onCreate = (values) => {
    createItem(values);
  };

  return (
    <div className={styles.addSignItemWrap}>
      <div className={styles.header}>
        <Link to="/">
          <LeftOutlined style={{ fontSize: 20, color: '#ccc' }} />
        </Link>

        <div className={styles.title}>添加</div>
      </div>
      <div className={styles.content}>
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          // initialValues={{ modifier: 'public' }}
        >
          <Form.Item
            name="url"
            label="url"
            rules={[
              {
                required: true,
                message: '请填写url！',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="cookie"
            label="cookie"
            rules={[
              {
                required: true,
                message: '请填写cookie！',
              },
            ]}
          >
            <Input type="textarea" />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddSignItem;
