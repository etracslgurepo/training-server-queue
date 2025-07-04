import { useState } from "react";

const ImageUpload = ({
  onLogoUploaded,
  removeLogoImage,
  title,
}: {
  onLogoUploaded: (image: string) => void;
  removeLogoImage: () => void;
  title?: string;
}) => {
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleUpload = () => {
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        onLogoUploaded(dataUrl); // Pass the image data URL to the parent component
      };
      reader.readAsDataURL(image);
    }
  };

  return (
    <div className="flex justify-center items-center text-[10px] p-4">
      <h1 className="text-lg pb-1">{title}</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className=" rounded w-[160px]"
      />
      <div className="flex gap-2">
        <button
          onClick={handleUpload}
          disabled={!image}
          className={`px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-400 transition duration-200 ${
            !image && "opacity-50 cursor-not-allowed"
          }`}
        >
          Upload
        </button>

        {removeLogoImage && (
          <button
            className={`px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-400 transition duration-200`}
            onClick={removeLogoImage}
          >
            remove
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
