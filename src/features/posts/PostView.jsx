import React, { useState } from 'react';

const PostView = () => {
  // Mock data for posts
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: 'TechReviewer',
      avatar: 'https://picsum.photos/seed/user1/200/200',
      image: 'https://picsum.photos/seed/post1/800/450',
      title: 'Building a Modern Web Application with React and Tailwind CSS',
      description: 'In this comprehensive tutorial, we explore how to create a stunning web application using React and Tailwind CSS. We cover everything from setup to deployment.',
      hashtags: ['react', 'webdev', 'tailwindcss', 'tutorial'],
      likes: 342,
      timestamp: '2 days ago',
      isLiked: false,
      isSaved: false,
      comments: [
        {
          id: 1,
          username: 'DevGuru',
          avatar: 'https://picsum.photos/seed/user2/200/200',
          text: 'This is exactly what I was looking for! Your explanation of state management is crystal clear. Thank you for sharing this valuable content!',
          likes: 45,
          dislikes: 2,
          timestamp: '1 day ago',
          replies: [
            {
              id: 11,
              username: 'TechReviewer',
              avatar: 'https://picsum.photos/seed/user1/200/200',
              text: 'Glad you found it helpful! Feel free to ask if you have any questions.',
              likes: 12,
              dislikes: 0,
              timestamp: '1 day ago'
            }
          ],
          showReplies: true
        },
        {
          id: 2,
          username: 'CodeNinja',
          avatar: 'https://picsum.photos/seed/user3/200/200',
          text: 'Can you make a follow-up video on advanced hooks? Would love to see more complex use cases.',
          likes: 23,
          dislikes: 1,
          timestamp: '12 hours ago',
          replies: [],
          showReplies: true
        }
      ]
    },
    {
      id: 2,
      username: 'DesignMaster',
      avatar: 'https://picsum.photos/seed/user4/200/200',
      image: 'https://picsum.photos/seed/post2/800/450',
      title: 'UI/UX Design Principles Every Developer Should Know',
      description: 'Understanding design fundamentals is crucial for creating user-friendly applications. Learn the key principles that will elevate your design game.',
      hashtags: ['design', 'ui', 'ux', 'principles'],
      likes: 567,
      timestamp: '1 week ago',
      isLiked: true,
      isSaved: false,
      comments: [
        {
          id: 3,
          username: 'CreativeMind',
          avatar: 'https://picsum.photos/seed/user5/200/200',
          text: 'As a designer, I appreciate developers taking the time to understand these principles. Great content!',
          likes: 67,
          dislikes: 3,
          timestamp: '5 days ago',
          replies: [],
          showReplies: true
        }
      ]
    }
  ]);

  // State for comment inputs
  const [commentInputs, setCommentInputs] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  
  // State for showing/hiding comments
  const [showComments, setShowComments] = useState({});

  // Handle like toggle for posts
  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  // Handle save toggle
  const handleSave = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isSaved: !post.isSaved
        };
      }
      return post;
    }));
  };

  // Toggle comments visibility
  const toggleComments = (postId) => {
    setShowComments({
      ...showComments,
      [postId]: !showComments[postId]
    });
  };

  // Handle comment input change
  const handleCommentChange = (postId, value) => {
    setCommentInputs({
      ...commentInputs,
      [postId]: value
    });
  };

  // Handle reply input change
  const handleReplyChange = (commentId, value) => {
    setReplyInputs({
      ...replyInputs,
      [commentId]: value
    });
  };

  // Handle adding a comment
  const handleAddComment = (postId) => {
    const commentText = commentInputs[postId];
    if (!commentText || commentText.trim() === '') return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Date.now(),
              username: 'CurrentUser',
              avatar: 'https://picsum.photos/seed/currentuser/200/200',
              text: commentText,
              likes: 0,
              dislikes: 0,
              timestamp: 'Just now',
              replies: [],
              showReplies: true
            }
          ]
        };
      }
      return post;
    }));

    setCommentInputs({
      ...commentInputs,
      [postId]: ''
    });
  };

  // Handle comment like/dislike
  const handleCommentLike = (postId, commentId, type) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment => {
            if (comment.id === commentId) {
              if (type === 'like') {
                return {
                  ...comment,
                  likes: comment.likes + 1
                };
              } else {
                return {
                  ...comment,
                  dislikes: comment.dislikes + 1
                };
              }
            }
            return comment;
          })
        };
      }
      return post;
    }));
  };

  // Toggle reply section
  const toggleReplies = (postId, commentId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                showReplies: !comment.showReplies
              };
            }
            return comment;
          })
        };
      }
      return post;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* <h1 className="text-3xl font-bold text-gray-900 mb-8">Professional Posts</h1> */}
      
      {posts.map(post => (
        <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          {/* Post Header */}
          <div className="p-6">
            {/* Title and Meta Info */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
              <div className="flex items-center text-sm text-gray-600">
                <div className="flex items-center mr-4">
                  <img 
                    src={post.avatar} 
                    alt={post.username} 
                    className="w-8 h-8 rounded-full object-cover mr-2"
                  />
                  <span className="font-medium">{post.username}</span>
                </div>
                <span>{post.timestamp}</span>
              </div>
            </div>

            {/* Post Image */}
            <div className="w-full mb-4 rounded-lg overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <p className="text-gray-700 mb-2">{post.description}</p>
              <div className="flex flex-wrap gap-2">
                {post.hashtags.map((tag, index) => (
                  <span key={index} className="text-blue-600 hover:text-blue-800 cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between border-t border-b border-gray-200 py-3">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-2 ${post.isLiked ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={post.isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span>{post.likes}</span>
                </button>
                <button 
                  onClick={() => toggleComments(post.id)}
                  className={`flex items-center space-x-2 ${showComments[post.id] ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{post.comments.length}</span>
                </button>
              </div>
              <button 
                onClick={() => handleSave(post.id)}
                className={`flex items-center space-x-2 ${post.isSaved ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={post.isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>Save</span>
              </button>
            </div>

            {/* Comments Section - YouTube Style */}
            {showComments[post.id] && (
              <div className="mt-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{post.comments.length} Comments</h3>
                  
                  {/* Add Comment */}
                  <div className="flex space-x-3 mb-6">
                    <img 
                      src="https://picsum.photos/seed/currentuser/200/200" 
                      alt="Current user" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <input 
                        type="text" 
                        placeholder="Add a public comment..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => handleCommentChange(post.id, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-sm"
                      />
                      {commentInputs[post.id] && (
                        <div className="flex justify-end mt-2 space-x-2">
                          <button 
                            onClick={() => handleCommentChange(post.id, '')}
                            className="px-4 py-1 text-gray-600 hover:text-gray-800 text-sm"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleAddComment(post.id)}
                            className="px-4 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm"
                          >
                            Comment
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="flex space-x-3">
                        <img 
                          src={comment.avatar} 
                          alt={comment.username} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm text-gray-900">{comment.username}</span>
                              <span className="text-xs text-gray-500">{comment.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{comment.text}</p>
                            <div className="flex items-center space-x-4">
                              <button 
                                onClick={() => handleCommentLike(post.id, comment.id, 'like')}
                                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 text-sm"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                                <span>{comment.likes}</span>
                              </button>
                              <button 
                                onClick={() => handleCommentLike(post.id, comment.id, 'dislike')}
                                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 text-sm"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                </svg>
                                <span>{comment.dislikes}</span>
                              </button>
                              <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                                Reply
                              </button>
                            </div>
                          </div>
                          
                          {/* Replies */}
                          {comment.replies.length > 0 && comment.showReplies && (
                            <div className="mt-3 space-y-3 pl-8">
                              {comment.replies.map(reply => (
                                <div key={reply.id} className="flex space-x-3">
                                  <img 
                                    src={reply.avatar} 
                                    alt={reply.username} 
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                  <div className="flex-1">
                                    <div className="bg-gray-50 rounded-lg p-2">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-sm text-gray-900">{reply.username}</span>
                                        <span className="text-xs text-gray-500">{reply.timestamp}</span>
                                      </div>
                                      <p className="text-sm text-gray-700">{reply.text}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostView;