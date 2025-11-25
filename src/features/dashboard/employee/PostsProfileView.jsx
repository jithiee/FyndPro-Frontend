import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostsByEmployeeId,
  fetchCommentsByPostId,
  addCommentToPost,

} from "../profileSlice";

import { fetchEmployeeByIDProfile } from '../userprofileSlice'

import { useParams } from "react-router-dom";

const PostsProfileView = () => {
  const dispatch = useDispatch();
  const { profile, posts, loading } = useSelector((state) => state.profile);
  const { userprofile } = useSelector((state) => state.userprofile)


  const { employeeId } = useParams();



  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  const BASE_URL = "http://127.0.0.1:8000";




  const rawImage = profile?.profile_image || userprofile?.profile_image || "";

  const imageUrl = rawImage.startsWith("http") ? rawImage : rawImage ? `${BASE_URL}${rawImage}` : "https://via..com/120";


  useEffect(() => {

    if (profile?.id) {
      dispatch(fetchPostsByEmployeeId(profile.id));
    }
    if (employeeId) {


      dispatch(fetchEmployeeByIDProfile(employeeId))
      dispatch(fetchPostsByEmployeeId(employeeId));

    }
  }, [dispatch, profile]);

  // Selector for comments of selected post (reads from Redux store)
  const commentsForSelectedPost = useSelector((state) =>
    selectedPost ? state.profile.commentsByPost[selectedPost.id] || [] : []
  );

  // Time ago helper
  const timeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    for (let key in intervals) {
      const value = Math.floor(seconds / intervals[key]);
      if (value > 1) return `${value} ${key}s ago`;
      if (value === 1) return `1 ${key} ago`;
    }

    return "just now";
  };

  const hasImage = (post) =>
    post.post &&
    (post.post.startsWith("http") ||
      post.post.startsWith("/media") ||
      post.post.match(/\.(jpg|jpeg|png|gif|webp)$/i));

  const getImageUrl = (post) => {
    if (!post.post)
      return "https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=No+Image";
    if (post.post.startsWith("http")) return post.post;
    if (post.post.startsWith("/media")) return `${BASE_URL}${post.post}`;
    return "https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=Text+Post";
  };

  const handleImageClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
    // load comments for that post from backend -> redux
    dispatch(fetchCommentsByPostId(post.id));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    setCommentText("");
    setAddingComment(false);
  };

  // Extract a safe display name from the comment object
  const getCommentUserName = (comment) => {
    // backend may provide either "user" object, "user_name" or "username"
    if (!comment) return "User";
    if (comment.user?.username) return comment.user.username;
    if (comment.user?.full_name) return comment.user.full_name;
    if (comment.user_name) return comment.user_name;
    if (comment.username) return comment.username;
    // fallback to profile name (owner of the profile page)
    return comment.user || "User";
  };

  const handleAddComment = async () => {
    const text = commentText.trim();
    if (!text || !selectedPost) return;

    setAddingComment(true);

    try {
      // dispatch the thunk that calls POST /posts/:pk/comments/
      await dispatch(addCommentToPost({ postId: selectedPost.id, text })).unwrap();

      // clear input (the Redux reducer will have added the comment to commentsByPost)
      setCommentText("");
    } catch (err) {
      console.error("Failed to post comment:", err);
      // optionally show toast or error UI
    } finally {
      setAddingComment(false);
    }
  };

  // keyboard: send comment on Enter (Shift+Enter for newline)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <div className="text-gray-600 text-lg">Loading posts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative">
            <img
              src={imageUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mt-6 text-gray-900">
            {profile?.full_name || userprofile?.full_name}
          </h2>
          <p className="text-gray-600 text-lg mt-3 text-center max-w-2xl">
            {profile?.employee_profile?.bio || userprofile?.employee_profile?.bio}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12 max-w-md mx-auto">
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
            <div className="text-sm text-gray-500">Posts</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {posts.reduce((acc, p) => acc + (p.likes_count || 0), 0)}
            </div>
            <div className="text-sm text-gray-500">Likes</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {posts.reduce((acc, p) => acc + (p.comments_count || 0), 0)}
            </div>
            <div className="text-sm text-gray-500">Comments</div>
          </div>
        </div>

        {/* Posts grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Posts</h3>

          {posts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="text-gray-400 text-6xl mb-4">📷</div>
              <p className="text-gray-500 text-lg mb-2">No posts yet</p>
              <p className="text-gray-400 text-sm">Start sharing your moments</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 border border-gray-200"
                  onClick={() => handleImageClick(post)}
                >
                  <div className="relative overflow-hidden">
                    {hasImage(post) ? (
                      <img
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105 relative z-10"
                        src={getImageUrl(post)}
                        alt={post.title}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=Image+Error";
                        }}
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4 relative z-10">
                        <div className="text-white text-center">
                          <div className="text-4xl mb-2">📝</div>
                          <p className="text-sm font-medium line-clamp-3">
                            {post.post}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 pointer-events-none"></div>

                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <div className="bg-white bg-opacity-90 rounded-full p-2 backdrop-blur-sm border border-gray-300">
                        <svg
                          className="w-5 h-5 text-gray-700"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                      {post.title}
                    </h4>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          {post.likes_count || 0}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                          </svg>
                          {post.comments_count || 0}
                        </div>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                        View
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedPost && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col lg:flex-row shadow-2xl relative">
            {/* Image Section */}
            <div className="lg:w-2/3 flex items-center justify-center bg-gray-100 min-h-[400px]">
              {hasImage(selectedPost) ? (
                <img
                  src={getImageUrl(selectedPost)}
                  alt="Post"
                  className="max-h-[80vh] w-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-8">
                  <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {selectedPost.title}
                    </h3>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {selectedPost.post}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Content / Comments Section */}
            <div className="lg:w-1/3 p-6 flex flex-col border-l border-gray-200">
              <div className="flex items-center mb-4">
                <img
                  src={imageUrl}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-300"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{profile?.full_name || userprofile?.full_name}</h4>
                  <p className="text-gray-500 text-sm">{timeAgo(selectedPost.created_at)}</p>
                </div>
              </div>

              <hr />

              {/* Post description */}
              <div className="mt-4 mb-3">
                <h5 className="text-sm font-medium text-gray-800 mb-1">{selectedPost.title}</h5>
                <p className="text-sm text-gray-700">{selectedPost.description}</p>
              </div>

              {/* Comments list */}
              <div className="flex-1 overflow-y-auto mt-4 pr-2">
                <h3 className="font-semibold text-gray-900 mb-3">Comments ({commentsForSelectedPost.length})</h3>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {commentsForSelectedPost.length === 0 ? (
                    <p className="text-sm text-gray-500">No comments yet</p>
                  ) : (
                    commentsForSelectedPost.map((c) => (
                      <div key={c.id} className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-700 mr-3">
                              {getCommentUserName(c).slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-700">{getCommentUserName(c)}</p>
                              <p className="text-xs text-gray-400">{timeAgo(c.created_at)}</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-800 mt-2">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add comment input */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={addingComment || commentText.trim() === ""}
                      className={`px-4 py-2 rounded-full text-sm text-white ${addingComment || commentText.trim() === ""
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                    >
                      {addingComment ? "Sending..." : "Send"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white rounded-full w-10 h-10 flex items-center justify-center border border-gray-300 hover:border-gray-400 transition-all duration-200 hover:scale-110 shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsProfileView;




