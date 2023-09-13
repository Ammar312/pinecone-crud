import React from "react";

const EditPostComp = ({ eachPost, index, cancelEdit, saveEdit }) => {
  return (
    <div className=" my-3 max-w-2xl shadow-2xl">
      <div className=" border-white border-2 p-3">
        <div className=" flex flex-col">
          <input
            className=" text-3xl font-medium p-2 outline-1 outline-gray-300"
            defaultValue={eachPost.title}
            type="text"
            placeholder="title"
          />
          <textarea
            className=" text-lg my-3 p-2 outline-1 outline-gray-300"
            defaultValue={eachPost.text}
            type="text"
            placeholder="What's in your mind"
          ></textarea>
        </div>
        <div className=" flex gap-x-3">
          <button
            className=" text-green-600 border-green-500 border text-lg px-4 hover:bg-green-500 hover:text-white transition-all"
            onClick={(e) => saveEdit(e, eachPost._id)}
          >
            Save
          </button>
          <button
            className=" text-red-500 text-lg border-red-500 border px-4 hover:bg-red-400 transition-all hover:text-white"
            onClick={() => cancelEdit(index)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostComp;
