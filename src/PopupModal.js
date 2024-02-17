
import React from 'react';

const PopupModal = ({ onClose, onLanguageSelect, list }) => {
    const languagesMap = {"hin":"Hindi", "eng":"English"};

    const handleLanguageSelect = (language) => {
        // Perform action when a language is selected
        // For example: onLanguageSelect(language);
        console.log(`Selected language: ${language}`);
        onLanguageSelect(language);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg relative">
                <button
                    className="absolute top-0 right-0 m-3 text-gray-600 hover:text-gray-800"
                    onClick={onClose}
                >
                    Close
                </button>
                <div className="text-center">
                    <h2 className="text-lg font-semibold mb-4">Select Language</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {list.map((item, index) => (
                            <button
                                key={index}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                                onClick={() => handleLanguageSelect(item.Fid)}
                            >
                                {languagesMap[item.AudioTrack] ? languagesMap[item.AudioTrack] : item.AudioTrack}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupModal;
