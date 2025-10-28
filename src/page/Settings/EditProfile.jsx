import { useEffect, useState } from "react";
import { useGetAdminMeQuery, useUpdateAdminMeMutation } from "../../redux/Api/adminApi";
import { message as toast } from "antd";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const { data: me, isLoading } = useGetAdminMeQuery();
  const [updateAdminMe, { isLoading: isSaving }] = useUpdateAdminMeMutation();
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [localContact, setLocalContact] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (me) {
      setFullname(me.fullname || "");
      setEmail(me.email || "");
      setContactNumber(me.contactNumber || "");
      const raw = me.contactNumber || "";
      const withoutFR = raw.startsWith("+33") ? raw.replace(/^\+33\s?/, "") : raw;
      setLocalContact(withoutFR);
    }
  }, [me]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice("");
    setError("");
    try {
      // Validate French mobile: 06/07xxxxxxxx or +33 6/7xxxxxxxx
      const raw = (localContact || "").trim();
      const cleaned = raw.replace(/[.\-\s]+/g, "");
      const isFRMobile = /^0[67]\d{8}$/.test(cleaned) || /^\+33[67]\d{8}$/.test(cleaned);
      if (!isFRMobile) {
        toast.error("Contact number must be a valid French mobile number (06/07 or +33 6/7 format)");
        return;
      }
      const contactOut = cleaned;
      const payload = {
        fullname: fullname ?? "",
        contactNumber: contactOut,
      };

      const res = await updateAdminMe(payload).unwrap();
      setNotice("Profile updated successfully");
      toast.success("Profile updated successfully");
      if (res) {
        setFullname(res.fullname ?? fullname);
        setContactNumber(res.contactNumber ?? payload.contactNumber);
        const updatedRaw = res.contactNumber ?? payload.contactNumber;
        setLocalContact(updatedRaw);
        navigate("/");
      }
    } catch (err) {
      const apiMsg = err?.data?.message || err?.error || "Failed to update profile";
      setError(apiMsg);
      toast.error(apiMsg);
    }
  };

  return (
    <div className="bg-white px-4 sm:px-8 md:px-12 lg:px-20 w-full max-w-[95%] sm:max-w-[600px] md:max-w-[650px] lg:w-[715px] lg:max-w-none pt-1 rounded-md">
      <form className="space-y-4 sm:space-y-5 md:space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="text-lg sm:text-xl text-[#0D0D0D] mb-2 font-bold">User Name</label>
          <input
            type="text"
            name="fullname"
            className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-[#6A6D76] rounded-md outline-none mt-3 sm:mt-4 md:mt-5 placeholder:text-base sm:placeholder:text-lg md:placeholder:text-xl"
            placeholder="Enter full name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="text-lg sm:text-xl text-[#0D0D0D] mb-2 font-bold">Email</label>
          <input
            type="text"
            name="email"
            className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-[#6A6D76] rounded-md outline-none mt-3 sm:mt-4 md:mt-5 placeholder:text-base sm:placeholder:text-lg md:placeholder:text-xl bg-gray-100"
            placeholder="Email"
            value={email}
            disabled
          />
        </div>

        <div>
          <label className="text-lg sm:text-xl text-[#0D0D0D] mb-2 font-bold">Contact No</label>
          <div className="flex items-stretch gap-0 mt-3 sm:mt-4 md:mt-5">
           
            <input
              type="tel"
              name="contactNumber"
              className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-[#6A6D76] rounded-r-md outline-none placeholder:text-base sm:placeholder:text-lg md:placeholder:text-xl"
              placeholder="Enter phone without country code"
              value={localContact}
              onChange={(e) => setLocalContact(e.target.value)}
              pattern="[0-9\s]*"
              inputMode="numeric"
            />
          </div>
        </div>

        {notice && (
          <div className="text-center text-sm font-medium text-[#6033E4]">{notice}</div>
        )}
        {error && (
          <div className="text-center text-sm font-medium text-red-600">{error}</div>
        )}

        <div className="text-center py-6 sm:py-8 md:py-10">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#6033E4] disabled:opacity-60 text-white font-semibold w-full py-3 sm:py-4 rounded-lg text-base sm:text-lg md:text-xl transition-colors hover:bg-[#002a6b] active:bg-[#001a44]"
          >
            {isSaving ? "Saving..." : "Update profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
