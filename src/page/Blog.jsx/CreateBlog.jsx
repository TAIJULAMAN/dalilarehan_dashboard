import React, { useState } from "react";
import { message } from "antd";
import { useCreateBlogMutation } from "../../redux/Api/blogApi";

const CreateBlog = ({ onCancel }) => {
  const [featured, setFeatured] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [coverImg, setCoverImg] = useState(null);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [createBlog] = useCreateBlogMutation();

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImg(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      message.error("Title and content are required");
      return;
    }
    try {
      setSubmitting(true);
      const excerpt = content.trim().slice(0, 140);
      let payload;
      if (coverImg) {
        const fd = new FormData();
        fd.append("title", title.trim());
        fd.append("excerpt", excerpt);
        fd.append("body", content);
        fd.append("featured", String(featured));
        // Use excerpt as category value per requirement
        fd.append("category", excerpt);
        fd.append("image", coverImg);
        payload = fd;
      } else {
        payload = {
          title: title.trim(),
          excerpt,
          body: content,
          image: "",
          // Use excerpt as category value per requirement
          category: excerpt,
          featured,
        };
      }
      const res = await createBlog(payload).unwrap();
      message.success(res?.message || "Blog created successfully");
      // reset form
      setFeatured(false);
      setTitle("");
      setCategory("");
      setCoverImg(null);
      setContent("");
      if (onCancel) onCancel();
    } catch (err) {
      const apiMsg = err?.data?.message || err?.error || "Failed to create blog";
      const lower = String(apiMsg).toLowerCase();
      if (lower.includes("already exists") || lower.includes("duplicate") || lower.includes("slug")) {
        message.error("A blog with this title already exists. Please use a unique title.");
      } else {
        message.error(apiMsg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-b-lg shadow-sm border mx-5 px-5 border-[#E2E8F0] overflow-x-auto ">
      <form
        className="w-[1000px] mx-auto bg-white rounded-lg p-8"
        onSubmit={handleSubmit}
      >
        
        <div className="mb-6">
          <label className="block font-semibold mb-2">Blog Title</label>
          <input
            type="text"
            className="w-full border-2 border-[#f3f3f3] rounded px-3 py-2 bg-[#fafbfc] focus:outline-none focus:border-[#6033E4] text-gray-400"
            placeholder="demo blog name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Category</label>
          <input
            type="text"
            className="w-full border-2 border-[#f3f3f3] rounded px-3 py-2 bg-[#fafbfc] focus:outline-none focus:border-[#6033E4] text-gray-400"
            placeholder="e.g. Health"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Cover Image</label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImgChange}
              className="border px-2 py-1 rounded"
            />
            <span className="text-xs text-gray-500">
              Accepted formats: JPG, PNG
            </span>
          </div>
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Content</label>
          <textarea
            className="w-full border-2 border-[#f3f3f3] rounded px-3 py-2 bg-[#fafbfc] focus:outline-none focus:border-[#6033E4] min-h-[150px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="flex gap-4 mt-8">
          <button
            type="button"
            className="border-2 border-[#6033E4] text-[#6033E4] py-2 px-8 rounded font-medium hover:bg-gray-50"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#6033E4] disabled:opacity-60 text-white py-2 px-8 rounded font-medium hover:bg-[#2d0563]"
          >
            {submitting ? "Publishing..." : "Publish Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
