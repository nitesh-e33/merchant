function QrCodeModal({ isOpen, onClose, qrCodeContent }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">QR Code</h2>
        <div dangerouslySetInnerHTML={{ __html: qrCodeContent }} />
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default QrCodeModal;
  