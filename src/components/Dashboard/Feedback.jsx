import { useState } from "react";

const demoFeedback = [
  {
    id: 1,
    user: "Emily Johnson",
    message: "Great platform! Very easy to use.",
    date: "2025-08-28",
    time: "10:15 AM",
  },
  {
    id: 2,
    user: "Michael Brown",
    message: "Support team was very helpful.",
    date: "2025-08-28",
    time: "11:00 AM",
  },
  {
    id: 3,
    user: "Anna Lee",
    message: "Would love more features for sellers.",
    date: "2025-08-27",
    time: "09:45 AM",
  },
];

const Feedback = () => {
  const [feedback, setFeedback] = useState(demoFeedback);

  // Example for API integration:
  // useEffect(() => {
  //   fetch("/api/feedback")
  //     .then(res => res.json())
  //     .then(data => setFeedback(data));
  // }, []);

  return (
    <div className="bg-white shadow-lg rounded-2xl w-full-5 min-h-[82vh] overflow-hidden border border-gray-200 mx-5 mt-5">
      {/* Header */}
      <div className="bg-[#6033E4] px-6 py-4">
        <h2 className="text-white text-3xl mt-4 font-bold">Feedback</h2>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-auto mt-6">
        <h2 className="text-2xl font-bold text-[#6033E4] mb-4">
          User Feedback
        </h2>
        <div className="divide-y divide-gray-200">
          {feedback.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No feedback yet.</p>
          ) : (
            feedback.map((fb) => (
              <div key={fb.id} className="py-4 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#6033E4]">
                    {fb.user}
                  </span>
                  <span className="text-xs text-gray-400">
                    {fb.date} • {fb.time}
                  </span>
                </div>
                <p className="text-gray-700 text-base">{fb.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
