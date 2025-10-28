import { ConfigProvider, Modal, Table } from "antd";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { HiOutlineBarsArrowDown } from "react-icons/hi2";
import { IoIosArrowDown } from "react-icons/io";

import { MdBlockFlipped, MdRestore } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import PageHeading from "../../shared/PageHeading";

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // store clicked user

  const handleOk = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showUserDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const restoreUser = (user) => {
    setUsers((prev) => [...prev, user]);
    setBlockedUsers((prev) => prev.filter((u) => u.key !== user.key));
  };

  const userData = [
    {
      key: "1",
      no: 1,
      userName: "John Doe",
      phoneNumber: "123-456-7890",
      joinedDate: "2023-01-01",
      email: "jdfkfdsaf@gmail.com",
    },
    {
      key: "2",
      no: 2,
      userName: "Jane Smith",
      phoneNumber: "987-654-3210",
      joinedDate: "2023-02-15",
      email: "janesmith@email.com",
    },
    {
      key: "3",
      no: 3,
      userName: "Robert Brown",
      phoneNumber: "555-123-4567",
      joinedDate: "2023-03-10",
      email: "robertbrown@email.com",
    },
    {
      key: "4",
      no: 4,
      userName: "Emily Clark",
      phoneNumber: "444-555-6666",
      joinedDate: "2023-04-20",
      email: "emilyclark@email.com",
    },
    {
      key: "5",
      no: 5,
      userName: "Michael Johnson",
      phoneNumber: "222-333-4444",
      joinedDate: "2023-05-30",
      email: "michaeljohnson@email.com",
    },
    {
      key: "6",
      no: 6,
      userName: "Sarah Williams",
      phoneNumber: "333-444-5555",
      joinedDate: "2023-06-15",
      email: "sarahwilliams@email.com",
    },
    {
      key: "7",
      no: 7,
      userName: "David Lee",
      phoneNumber: "666-777-8888",
      joinedDate: "2023-07-25",
      email: "davidlee@email.com",
    },
    {
      key: "8",
      no: 8,
      userName: "Sophia Martinez",
      phoneNumber: "555-999-0000",
      joinedDate: "2023-08-05",
      email: "sophiamartinez@email.com",
    },
    {
      key: "9",
      no: 9,
      userName: "James Taylor",
      phoneNumber: "777-888-9999",
      joinedDate: "2023-09-15",
      email: "jamestaylor@email.com",
    },
    {
      key: "10",
      no: 10,
      userName: "Olivia Davis",
      phoneNumber: "888-999-0001",
      joinedDate: "2023-10-01",
      email: "oliviadavis@email.com",
    },
    {
      key: "11",
      no: 11,
      userName: "Ethan Wilson",
      phoneNumber: "999-000-1111",
      joinedDate: "2023-11-07",
      email: "ethanwilson@email.com",
    },
    {
      key: "12",
      no: 12,
      userName: "Isabella White",
      phoneNumber: "000-111-2222",
      joinedDate: "2023-12-22",
      email: "isabellawhite@email.com",
    },
    {
      key: "13",
      no: 13,
      userName: "Lucas Harris",
      phoneNumber: "111-222-3333",
      joinedDate: "2024-01-30",
      email: "lucasharris@email.com",
    },
    {
      key: "14",
      no: 14,
      userName: "Mia Young",
      phoneNumber: "444-555-6667",
      joinedDate: "2024-02-10",
      email: "miayoung@email.com",
    },
    {
      key: "15",
      no: 15,
      userName: "Aiden Walker",
      phoneNumber: "555-666-7778",
      joinedDate: "2024-03-14",
      email: "aidenwalker@email.com",
    },
  ];

  const dataSource = userData;

  const columns = [
    { title: "No", dataIndex: "no", key: "no" },
    {
      title: "User Name",
      key: "userName",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img
            src={`https://avatar.iran.liara.run/public/${record.no}`}
            className="w-10 h-10 object-cover rounded-full"
            alt="User Avatar"
          />
          <span>{record.userName}</span>
        </div>
      ),
    },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Joined Date", dataIndex: "joinedDate", key: "joinedDate" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <button
            onClick={showModal}
            className="  text-[#082513] rounded-lg p-2  hover:bg-teal-400 transition duration-200"
          >
            <MdRestore className="w-6 h-6 text-red-400 hover:text-black" />
          </button>
          <button
            onClick={() => showUserDetails(record)} // pass clicked user
            className="  text-blue-500 rounded-lg p-2  hover:bg-blue-400 transition duration-200"
          >
            <FaEye className="w-6 h-6 text-blue-600" />
          </button>
        </div>
      ),
    },
  ];
  const blockedColumns = [
    { title: "No", dataIndex: "no", key: "no" },
    {
      title: "User Name",
      key: "userName",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img
            src={`https://avatar.iran.liara.run/public/${record.no}`}
            className="w-10 h-10 object-cover rounded-full"
            alt="User Avatar"
          />
          <span>{record.userName}</span>
        </div>
      ),
    },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => restoreUser(record)}
            className="border border-green-600 text-green-600 rounded-lg p-2 bg-green-100 hover:bg-green-200 transition duration-200"
          >
            <MdRestore className="w-6 h-6" />
          </button>
          <button
            onClick={() => showUserDetails(record)}
            className="border border-[#14803c] text-[#14803c] rounded-lg p-2 bg-[#d3e8e6] hover:bg-[#b4d9d4] transition duration-200"
          >
            <FaEye className="w-6 h-6" />
          </button>
        </div>
      ),
    },
  ];
  return (
    <>
      <div>
        <div className="rounded-t-lg mt-5 rounded-b-none bg-[#6033E4] text-white py-3 flex flex-col ipad:flex-row justify-between items-start ipad:items-center mx-5 px-5 gap-4 ipad:gap-0">
          <PageHeading title="Blocked User List" />
          <div className="flex items-center gap-4 ipad:gap-[100px] w-full ipad:w-auto">
            <div className="relative w-full ipad:w-[300px]">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search User"
                  className="border-2 py-2 pl-10 pr-4 text-black outline-none w-full rounded-md"
                />
                <span className="text-gray-400 absolute top-0 left-0 h-full px-3 flex items-center justify-center">
                  <IoSearch className="text-[1.3rem]" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-5 ">
          <div className="bg-white py-3 flex flex-col ipad:flex-row justify-between items-start ipad:items-center px-5 border border-t-0 border-x-0 border-gray-300 gap-3 ipad:gap-0">
            <div className="flex gap-3 w-full ipad:w-auto">
              <button className="border border-blue-600/50 text-black hover:text-white bg-white hover:bg-[#6033E4] py-2 px-4 ipad:px-6 rounded-md focus:outline-none text-sm ipad:text-base">
                Clients
              </button>
              <button className="border border-blue-600/50 text-white hover:text-black bg-[#6033E4] hover:bg-white py-2 px-4 ipad:px-6 rounded-md focus:outline-none text-sm ipad:text-base">
                Providers
              </button>
            </div>
            <div className="flex flex-col justify-between items-center text-center ipad:flex-row gap-3 border p-2 border-gray-500 ipad:gap-5">
              <div className="flex items-center justify-between text-center gap-3">
                <HiOutlineBarsArrowDown size={21} />
                <h2 className="mt-2">date</h2>
              </div>
              <div>
                <IoIosArrowDown size={21} />
              </div>
            </div>
          </div>
        </div>
        <div className="mx-5 rounded-b-lg ">
          <ConfigProvider
            theme={
              {
                /* your theme */
              }
            }
          >
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={{ pageSize: 10 }}
              scroll={{ x: "max-content" }}
            />

            <Modal
              open={isModalOpen}
              centered
              onCancel={handleCancel}
              footer={null}
            >
              {selectedUser ? (
                <div className="p-6 w-full max-w-md bg-white rounded-xl shadow-lg text-center">
                  {/* Header */}
                  <h2 className="text-2xl font-bold text-blue-900 mb-1">
                    Distributor Details
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    See all details about {selectedUser.userName}
                  </p>

                  {/* Avatar & Name */}
                  <div className="flex items-center justify-center mb-6">
                    <img
                      src={`https://avatar.iran.liara.run/public/${selectedUser.no}`}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full mr-3"
                    />
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {selectedUser.userName}
                      </h3>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 text-left mb-6">
                    <p>
                      <span className="font-semibold text-gray-800">Name:</span>{" "}
                      {selectedUser.userName}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Email:
                      </span>{" "}
                      {selectedUser.email}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">
                        Phone:
                      </span>{" "}
                      {selectedUser.phoneNumber}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">
                        User ID:
                      </span>{" "}
                      {selectedUser.key}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleOk}
                      className="px-6 py-2 border border-gray-400 rounded-md text-gray-700 hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleOk}
                      className="px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition"
                    >
                      Block
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 text-center">
                  <h1 className="text-4xl text-[#0D0D0D]">
                    Are you sure you want to Restore?
                  </h1>
                  <div className="flex justify-between items-center gap-5 text-center py-5">
                    <button
                      onClick={handleOk}
                      className="text-[#001C54] border-2 border-[#001C54] bg-white font-semibold w-full py-2 rounded transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleOk}
                      className="bg-red-500 text-white fosdfsdnt-semibold w-full py-2 rounded transition duration-200"
                    >
                      Yes, Confirm
                    </button>
                  </div>
                </div>
              )}
            </Modal>
          </ConfigProvider>
        </div>
      </div>
    </>
  );
};

export default Users;
