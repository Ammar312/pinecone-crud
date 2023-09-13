import React, { useState } from "react";
import { message, Popconfirm } from "antd";

const Post = ({ eachPost, deleteHandle, editPost, index }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const cancel = () => {
    setOpen(false);
    message.error("Cancel");
  };
  const showPopconfirm = () => {
    setOpen(true);
  };
  return (
    <div className=" my-4 max-w-[620px] shadow-lg">
      <div className=" border-2 p-3">
        <h2 className=" text-3xl font-medium">{eachPost.title}</h2>
        <p className=" text-lg my-3">{eachPost.text}</p>
        <div className=" flex gap-x-5">
          <button
            className=" text-white bg- text-lg px-4 bg-green-500"
            onClick={() => editPost(index)}
          >
            Edit
          </button>

          <Popconfirm
            title="Delete The Post"
            description="Are you sure to delete this post?"
            open={open}
            onConfirm={() => {
              deleteHandle(eachPost._id);
              setOpen(false);
            }}
            onCancel={cancel}
            okType="default"
            okText="Yes"
            // okButtonProps={{ loading: confirmLoading }}
            cancelText="No"
          >
            <button
              className=" text-white text-lg px-4 bg-red-400"
              // onClick={() => deleteHandle(eachPost._id)}
              onClick={showPopconfirm}
            >
              Delete
            </button>
          </Popconfirm>
        </div>
      </div>
    </div>
  );
};

export default Post;
