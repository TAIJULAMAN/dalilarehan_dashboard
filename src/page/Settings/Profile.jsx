import { Edit } from "lucide-react";
import { useMemo, useState } from "react";
import EditProfile from "./EditProfile";
import { useGetAdminMeQuery, useUpdateAdminMeMutation } from "../../redux/Api/adminApi";
import { message } from "antd";

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("editProfile");
  const { data: me } = useGetAdminMeQuery();
  const [updateAdminMe, { isLoading: uploading }] = useUpdateAdminMeMutation();
  const [imgVersion, setImgVersion] = useState(0);

  const getImgSrc = (p) => {
    if (!p || typeof p !== "string") return "";
    if (/^https?:\/\//i.test(p)) return p;
    const apiBase = (import.meta?.env?.VITE_API_URL) || "https://dalilarehan-backend.onrender.com/api/v1";
    let origin = "";
    try { origin = new URL(apiBase).origin; } catch (_) { origin = typeof window !== "undefined" ? window.location.origin : ""; }
    return `${origin}${p.startsWith("/") ? p : "/" + p}`;
  };

  const avatarSrc = useMemo(() => {
    if (me?.profileImage) return `${getImgSrc(me.profileImage)}${imgVersion ? `?v=${imgVersion}` : ""}`;
    return "https://avatar.iran.liara.run/public/44";
  }, [me, imgVersion]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("profileImage", file);
      await updateAdminMe(fd).unwrap();
      message.success("Profile image updated");
      setImgVersion(Date.now());
    } catch (err) {
      const apiMsg = err?.data?.message || err?.error || "Failed to update image";
      message.error(apiMsg);
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl w-[98%] min-h-[50vh] overflow-hidden border mx-5 max-md:mx-3 mt-3">
      <div className="bg-[#6033E4] px-6 max-md:px-4 py-3">
        <h2 className="text-white text-2xl max-md:text-xl font-bold">
          Profile
        </h2>
      </div>
      <div className="px-3 max-md:px-2">
        <div className="mx-auto flex flex-col justify-center items-center">
          {/* Profile Picture Section */}
          <div className="flex flex-col justify-center items-center mt-2 text-gray-800 w-full max-w-[900px] mx-auto pt-2 gap-0.5 rounded-lg">
            <div className="relative">
              <div className="w-[122px] h-[122px] max-md:w-20 max-md:h-20 bg-gray-300 rounded-full border-4 border-white shadow-xl flex justify-center items-center">
                <img
                  src={avatarSrc}
                  alt="profile"
                  className="w-full h-full rounded-full object-cover"
                />
                {/* Upload Icon */}
                <div className="absolute bottom-0 right-2 max-md:right-0 bg-white p-2 max-md:p-1 rounded-full shadow-md cursor-pointer">
                  <label htmlFor="profilePicUpload" className="cursor-pointer">
                    <Edit className="text-[#FF914C] max-md:w-4 max-md:h-4" />
                  </label>
                  <input type="file" id="profilePicUpload" className="hidden" accept="image/*" onChange={handleProfilePicChange} />
                </div>
              </div>
            </div>
            <div>
              <p className="text-3xl max-md:text-xl font-bold pt-3">DS</p>
            </div>
          </div>

          {/* Tab Navigation Section */}
          <div className="flex justify-center items-center gap-5 text-md md:text-lg font-semibold">
            <p
              onClick={() => setActiveTab("editProfile")}
              className={`cursor-pointer pb-1 ${
                activeTab === "editProfile"
                  ? "text-[#6033E4] border-b-2 border-[#013666]"
                  : "text-[#6A6D76]"
              }`}
            >
              Edit Profile
            </p>
          </div>

          {/* Tab Content Section */}
          <div className="flex justify-center items-center p-2 rounded-md">
            <div className="w-full max-w-full lg:max-w-[1400px]">
              {activeTab === "editProfile" && <EditProfile />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
