import { CheckCircle } from "lucide-react";

const DoctorConfirmationModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Blurred Background */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-lg"></div>

      {/* Modal Box */}
      <div className="relative bg-white p-6 rounded-xl shadow-lg flex flex-col items-center w-96">
        <CheckCircle className="text-green-600 w-14 h-14" />
        <p className="text-xl font-semibold text-gray-800 mt-3">
          Already Registered!
        </p>
        <p className="text-gray-600 text-sm text-center mt-1">
          Click below to update your information.
        </p>
        <button
          onClick={onClose}
          className="mt-4 bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-all"
        >
          Update Details
        </button>
      </div>
    </div>
  );
};

export default DoctorConfirmationModal;
