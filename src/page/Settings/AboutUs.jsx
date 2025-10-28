import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import PageHeading from "../../shared/PageHeading";
import { message } from "antd";
import { useGetAdminAboutUsQuery, useUpdateAdminAboutUsMutation } from "../../redux/Api/settingApi";

function AboutUs() {
  const [content, setContent] = useState("");
  const { data: about, isLoading } = useGetAdminAboutUsQuery();
  const [updateAbout, { isLoading: saving }] = useUpdateAdminAboutUsMutation();

  useEffect(() => {
    if (about) {
      const initial =
        typeof about === "string" ? about : about?.content || about?.text || about?.html || "";
      setContent(initial);
    }
  }, [about]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file);
    }
  };

  // 🔹 Save Handler
  const handleSave = async () => {
    try {
      await updateAbout({ content }).unwrap();
      message.success("About Us updated successfully");
    } catch (err) {
      const data = err?.data;
      const msg =
        typeof data === "string" && data.trim()
          ? data
          : data?.message || err?.error || "Failed to update About Us";
      message.error(msg);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="rounded-t-lg mt-5 bg-[#6033E4] text-white py-3 flex flex-row justify-between items-center mx-5 px-5">
        <PageHeading title="About Us" />
      </div>

      {/* Editor */}
      <div className="mx-5 bg-white rounded-b-lg shadow p-5 h-full">
        {isLoading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : null}
        <ReactQuill
          style={{ minHeight: "400px", fontSize: "18px" }}
          theme="snow"
          value={content}
          onChange={setContent}
        />
      </div>

      {/* Upload + Save */}
      <div className="text-center mx-5 py-5">
        <div className="mt-6 flex items-center gap-3 justify-center">
          {/* Upload Button */}
          <label
            htmlFor="file-upload"
            className="flex items-center px-4 py-2 bg-gray-100 border rounded-lg cursor-pointer hover:bg-gray-200"
          >
            Upload your image
            <input
              id="file-upload"
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#6033E4] text-white font-semibold px-6 py-2 rounded transition duration-200 hover:bg-[#0250a3] disabled:opacity-60"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
