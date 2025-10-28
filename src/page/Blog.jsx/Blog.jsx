import React, { useState } from "react";
import PageHeading from "../../shared/PageHeading";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import BlogData from "./BlogData";
import CreateBlog from "./CreateBlog";

export default function Blog() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div>
      {/* Header */}
      <div className="rounded-t-lg mt-5 bg-[#6033E4] text-white py-3 flex flex-col md:flex-row justify-between items-start md:items-center mx-5 px-5 gap-4">
        <PageHeading title="Blog" />
        <button
          className="bg-white text-[#6033E4] py-2 px-6 rounded-md hover:bg-gray-100"
          onClick={() => setShowCreate(true)}
        >
          + Create Blog
        </button>
      </div>

      {/* Table or Create Blog */}
      {showCreate ? (
        <CreateBlog onCancel={() => setShowCreate(false)} />
      ) : (
        <BlogData />
      )}
    </div>
  );
}
