import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { createEmployeePost, resetProfileState } from "../profileSlice";
import { ToastContainer , toast } from "react-toastify";

const CreatePost = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.profile);

  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    post: null,
  });

  // Handle title and description
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFormData({ ...formData, post: uploadedFile });
      setPreview(URL.createObjectURL(uploadedFile));
    }
  };

  // Submit post
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title) {
      toast.error("Please give your post title");
      return;
    }
    if (!formData.description) {
      toast.error("Please give your post description");
      return;
    }
    if (!formData.post) {
      toast.error("Please upload your post image/video");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("post", formData.post);

    dispatch(createEmployeePost(data));
  };

  // Show success/error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetProfileState());
    }
    if (success) {
      toast.success("Post created successfully");
      setFormData({ title: "", description: "", post: null });
      setPreview(null);
      dispatch(resetProfileState());
    }
  }, [error, success, dispatch]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
     
      <ToastContainer position="top-right" autoClose={4000} />
      <motion.div
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Create New Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter post title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Write a short description..."
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            ></textarea>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 flex flex-col items-center justify-center hover:border-indigo-500 transition cursor-pointer">
            <input
              type="file"
              id="file-upload"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center space-y-2 text-gray-500 cursor-pointer"
            >
              <FaCloudUploadAlt size={40} className="text-indigo-500" />
              <span className="text-sm">
                {formData.post ? formData.post.name : "Click to upload image/video"}
              </span>
            </label>
          </div>

          {/* Preview */}
          {preview && (
            <div className="mt-4">
              {formData.post?.type?.startsWith("image/") ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
              ) : (
                <video
                  src={preview}
                  controls
                  className="w-full h-48 rounded-lg border"
                />
              )}
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Now"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePost;
