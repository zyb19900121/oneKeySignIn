/*
 * @Author: zhangyanbin
 * @Date: 2021-06-03 15:45:03
 * @LastEditors: zhangyanbin
 * @LastEditTime: 2021-06-04 17:00:58
 * @Description: file content
 */

import React, { memo } from 'react';
import { Modal, Form, Input, Radio } from 'antd';
import styles from './index.less';
const AddModal = (props) => {
  const { visible, createItem, closeModal } = props;

  const [form] = Form.useForm();

  const onCancel = () => {
    form.resetFields();
    closeModal();
  };

  const onCreate = (values) => {
    createItem(values);
  };

  return (
    <Modal
      className={styles.addModal}
      centered={true}
      visible={visible}
      title="Create a new collection"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {});
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        // initialValues={{ modifier: 'public' }}
      >
        <Form.Item
          name="name"
          label="name"
          rules={[
            {
              required: true,
              message: '请填写name！',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="requestType"
          label="请求类型"
          rules={[
            {
              required: true,
              message: '请选择类型！',
            },
          ]}
        >
          <Radio.Group>
            <Radio value="get">GET</Radio>
            <Radio value="post">POST</Radio>
          </Radio.Group>
        </Form.Item>
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
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(AddModal);
