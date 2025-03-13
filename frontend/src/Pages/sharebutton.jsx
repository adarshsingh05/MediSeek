import { Share2 } from "lucide-react";

const ShareButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center px-3 py-2 bg-gray-200 hover:bg-gray-300 text-blue-500 rounded-md cursor-pointer"
    >
      <Share2 className="text-blue-500" />
    </button>
  );
};

export default ShareButton;
