import { useState } from "react";

const ImageUpload = ({
  onLogoUploaded,
  removeLogoImage,
  title,
  imgUrl
}: {
  onLogoUploaded: (image: string) => void;
  removeLogoImage: () => void;
  title?: string;
  imgUrl?: string;
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Store the uploaded image URL

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setImageUrl(dataUrl); // Set the image URL state
        onLogoUploaded(dataUrl); // Pass the image data URL to the parent component
      };
      reader.readAsDataURL(file); // Convert the image to a base64 string
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageUrl(null); // Clear the image and URL states
    removeLogoImage(); // Call the removeLogoImage function from the parent
  };

  return (
    <div className="flex flex-col items-center text-[10px]">
      <h1 className="text-lg pb-2">{title}</h1>
      
      {/* Display image if it's uploaded */}
      {imgUrl ? (
        <div className="w-[80px] h-[80px] mb-2">
          <img src={imgUrl || "/images/lgu-logo.png"} alt="Uploaded" className="w-full h-full object-cover rounded-md" />
        </div>
      ) : (
        <p className="text-sm text-gray-500">No image uploaded</p>
      )}

      {/* File input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-2 rounded p-2 border"
      />

      <div className="flex gap-2">
        <div
          onClick={handleRemoveImage}
          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-400 transition duration-200 cursor-pointer"
        >
          Remove
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
