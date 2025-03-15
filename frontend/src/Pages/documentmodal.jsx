import React from "react";
import { X, FileText, ExternalLink, Copy, Check } from "lucide-react";

const Modal = ({ isOpen, onClose, supabaseUrls }) => {
  const [copiedIndex, setCopiedIndex] = React.useState(null);

  if (!isOpen) return null;

  const copyToClipboard = (url, index) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900 dark:to-teal-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <FileText className="text-blue-600 dark:text-blue-300" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Shared Documents</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-96 overflow-y-auto">
          {supabaseUrls?.length > 0 ? (
            <ul className="space-y-3">
              {supabaseUrls.map((url, index) => (
                <li 
                  key={index} 
                  className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
                >
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 truncate">
                      <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-800 rounded">
                        <FileText className="text-blue-500 dark:text-blue-300" size={16} />
                      </div>
                      <span className="text-gray-800 dark:text-gray-200 text-sm truncate max-w-xs">
                        {url}
                      </span>
                    </div>
                    <div className="flex-shrink-0 flex items-center">
                      <button 
                        onClick={() => copyToClipboard(url, index)}
                        className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mr-1"
                        title="Copy URL"
                      >
                        {copiedIndex === index ? (
                          <Check size={16} className="text-green-500" />
                        ) : (
                          <Copy size={16} className="text-gray-500 dark:text-gray-400" />
                        )}
                      </button>
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md bg-teal-500 hover:bg-teal-600 text-white transition-colors"
                        title="Open document"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-8 text-center">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-4">
                <FileText className="text-gray-400 dark:text-gray-500" size={24} />
              </div>
              <p className="text-gray-500 dark:text-gray-400">No shared documents available.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;