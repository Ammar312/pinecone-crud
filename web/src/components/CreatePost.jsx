import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Post from "./Post";
import EditPostComp from "./EditPostComp";
import { message } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const CreatePost = () => {
  const baseURL = "http://localhost:3000";
  const [allPosts, setAllPosts] = useState([]);
  const [toggleRefresh, setToggleRefresh] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const titleInput = useRef(null);
  const bodyInput = useRef(null);
  const searchRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/v1/posts`);
        setAllPosts(response.data);
      } catch (error) {}
    };
    fetchData();
  }, [toggleRefresh]);
  const searchHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${baseURL}/api/v1/search?q=${searchRef.current.value}`
      );
      console.log("searchresponse", response);
      setAllPosts([...response.data]);
    } catch (error) {
      console.log(error);
    }
  };
  const submitPost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseURL}/api/v1/post`, {
        title: titleInput.current.value,
        text: bodyInput.current.value,
      });
      console.log(response.data);
      setToggleRefresh(!toggleRefresh);
      // Clear the input fields after successful submission
      titleInput.current.value = "";
      bodyInput.current.value = "";
      message.success(`${response.data}`);
    } catch (error) {
      console.log(error);
      message.error("Error in posting");
    }
  };
  const deleteHandle = async (id) => {
    try {
      const response = await axios.delete(`${baseURL}/api/v1/post/${id}`);
      console.log(response.data);
      setConfirmLoading(true);
      message.success(`${response.data}`);
      setToggleRefresh(!toggleRefresh);
    } catch (error) {
      console.log(error);
    }
  };
  const editPost = (index) => {
    allPosts[index].isEdit = true;
    setAllPosts([...allPosts]);
    console.log("clicked", index);
  };
  const cancelEdit = (index) => {
    allPosts[index].isEdit = false;
    setAllPosts([...allPosts]);
    console.log("canceled", index);
  };
  const saveEdit = async (e, id) => {
    const title =
      e.target.parentElement.previousElementSibling.firstChild.value;
    const text = e.target.parentElement.previousElementSibling.lastChild.value;

    try {
      const response = await axios.put(`${baseURL}/api/v1/post/${id}`, {
        title: title,
        text: text,
      });
      setToggleRefresh(!toggleRefresh);
      console.log(response.data);
      message.success(`${response.data}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form className="" onSubmit={searchHandler}>
        <input type="search" ref={searchRef} placeholder="Search" />
        <button type="submit">
          <SearchOutlined />
        </button>
      </form>
      <div className=" border-2 border-purple-900 max-w-lg bg-[#E9E4F0]">
        <form onSubmit={submitPost} className=" flex flex-col gap-2 p-4">
          <input
            className="border-2 p-2 text-lg outline-none"
            type="text"
            required
            placeholder="Title of the post"
            minLength={3}
            maxLength={70}
            ref={titleInput}
          />
          <textarea
            type="text"
            required
            placeholder="What's in your mind!"
            minLength={3}
            ref={bodyInput}
            rows="3"
            className="border-2 p-2 text-lg outline-none "
          ></textarea>
          <button
            type="submit"
            className="border-2 border-white text-[1.1rem] text-white font-medium w-44 p-3 rounded-xl hover:text-black hover:bg-white transition-all"
          >
            Publish
          </button>
        </form>
      </div>

      {allPosts?.map((eachPost, index) => {
        return (
          <div key={index}>
            {eachPost.isEdit ? (
              <EditPostComp
                eachPost={eachPost}
                cancelEdit={cancelEdit}
                index={index}
                saveEdit={saveEdit}
              />
            ) : (
              <Post
                eachPost={eachPost}
                deleteHandle={deleteHandle}
                editPost={editPost}
                index={index}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CreatePost;
