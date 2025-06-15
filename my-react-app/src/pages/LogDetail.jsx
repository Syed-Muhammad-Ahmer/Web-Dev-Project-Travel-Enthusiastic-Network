import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaHeart, FaRegHeart, FaComment, FaBookmark, 
  FaArrowLeft, FaMapMarkerAlt, FaPaperPlane,
  FaUser, FaEdit, FaTrash, FaImage
} from 'react-icons/fa';
import { travelLogs } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const LogDetail = () => {
  // State declarations
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [log, setLog] = useState(location.state?.log || null);
  const [loading, setLoading] = useState(!location.state?.log);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');

  const fetchLogDetails = async () => {
    try {
      setLoading(true);
      const response = await travelLogs.getById(id);
      setLog(response.data);
      setLiked(response.data.likes?.includes(localStorage.getItem('userId')));
      setLikesCount(response.data.likes?.length || 0);
    } catch (err) {
      setError('Failed to load travel log');
      console.error('Error fetching log:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/default-image.jpg';
    if (imagePath.includes('unsplash.com')) {
      const baseUrl = imagePath.split('?')[0];
      return `${baseUrl}?auto=format&fit=crop&w=1200&q=80`;
    }
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const response = await travelLogs.like(id);
      setLog(response.data);
      setLiked(response.data.likes.includes(currentUserId));
      setLikesCount(response.data.likes.length);
    } catch (err) {
      console.error('Error liking travel log:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const response = await travelLogs.addComment(id, newComment);
      if (response.data) {
        setLog(response.data);
        setNewComment('');
        setError(null);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setError(error.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;
    try {
      setIsSubmitting(true);
      const response = await travelLogs.editComment(id, commentId, editText);
      if (response.data) {
        setLog(response.data);
        setEditingComment(null);
        setEditText('');
        setError(null);
      }
    } catch (error) {
      console.error('Error editing comment:', error);
      setError(error.response?.data?.message || 'Failed to edit comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      setIsSubmitting(true);
      const response = await travelLogs.deleteComment(id, commentId);
      if (response.data) {
        setLog(response.data);
        setError(null);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError(error.response?.data?.message || 'Failed to delete comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (comment) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setEditingComment(comment._id);
    setEditText(comment.content);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditText('');
    setError(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    setIsAuthenticated(!!token);
    setCurrentUserId(userId);
    if (!location.state?.log) fetchLogDetails();
  }, [id, location.state]);

  if (loading) return <div className="loading">Loading travel log...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!log) return <div className="not-found">Travel log not found</div>;

 return (
  <div className={`log-detail-container ${isDarkMode ? 'dark' : ''}`}>
    <style>{`
      .log-detail-container {
        min-height: 100vh;
        padding: 20px;
        background-color: ${isDarkMode ? '#0f0f1a' : '#f8f9fa'};
        color: ${isDarkMode ? '#f0f0f0' : '#333'};
        transition: all 0.3s ease;
      }
      .log-detail-wrapper {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        background-color: ${isDarkMode ? '#1a1a2e' : '#fff'};
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      }
      .log-detail-header {
        margin-bottom: 30px;
        text-align: center;
      }
      .back-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 20px;
        color: ${isDarkMode ? '#6b8cae' : '#4a6fa5'};
        text-decoration: none;
        font-weight: 500;
      }
      .log-detail-header h1 {
        font-size: 2.5rem;
        margin-bottom: 10px;
        color: ${isDarkMode ? '#f0f0f0' : '#333'};
      }
      .log-meta {
        display: flex;
        justify-content: center;
        gap: 20px;
        color: ${isDarkMode ? '#a0a0a0' : '#666'};
        font-size: 0.9rem;
      }
      .log-image-container {
        width: 100%;
        max-height: 500px;
        overflow: hidden;
        border-radius: 8px;
        background-color: ${isDarkMode ? '#2a2a3a' : '#f0f0f0'};
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .log-detail-image {
        width: 100%;
        height: auto;
        object-fit: cover;
        border-radius: 8px;
      }
      .image-fallback {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        color: ${isDarkMode ? '#a0a0a0' : '#666'};
      }
      .log-description {
        line-height: 1.8;
        font-size: 1.1rem;
        color: ${isDarkMode ? '#f0f0f0' : '#333'};
      }
      .log-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .tag {
        background-color: ${isDarkMode ? '#6b8cae' : '#4a6fa5'};
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
      }
      .log-actions {
        display: flex;
        gap: 15px;
        padding: 15px 0;
        border-top: 1px solid ${isDarkMode ? '#2a2a3a' : '#e0e0e0'};
        border-bottom: 1px solid ${isDarkMode ? '#2a2a3a' : '#e0e0e0'};
      }
      .action-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        padding: 8px 16px;
        border-radius: 8px;
        transition: all 0.2s ease;
        color: ${isDarkMode ? '#f0f0f0' : '#333'};
      }
      .action-btn:hover {
        background-color: ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
      }
      .action-btn.liked {
        color: #ff4757;
      }
      .author-info {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 15px 0;
        color: ${isDarkMode ? '#ccc' : '#333'};
      }
      .author-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }
      .comments-section {
        margin-top: 30px;
      }
      .comments-section h3 {
        margin-bottom: 20px;
        font-size: 1.5rem;
        color: ${isDarkMode ? '#f0f0f0' : '#333'};
      }
      .comment {
        background-color: ${isDarkMode ? '#1a1a2e' : '#fff'};
        border: 1px solid ${isDarkMode ? '#2a2a3a' : '#e0e0e0'};
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        color: ${isDarkMode ? '#f0f0f0' : '#333'};
      }
      .comment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      .comment-author {
        display: flex;
        align-items: center;
        gap: 10px;
        color: ${isDarkMode ? '#ccc' : '#333'};
      }
      .comment-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
      }
      .comment-actions {
        display: flex;
        gap: 10px;
      }
      .comment-content {
        margin: 10px 0;
        line-height: 1.5;
        color: ${isDarkMode ? '#f0f0f0' : '#333'};
      }
      .comment-date {
        font-size: 0.8em;
        color: ${isDarkMode ? '#a0a0a0' : '#666'};
      }
      .comment-form {
        margin-top: 30px;
      }
      .comment-form textarea,
      .edit-comment-form textarea {
        width: 100%;
        min-height: 100px;
        padding: 12px;
        border: 1px solid ${isDarkMode ? '#2a2a3a' : '#e0e0e0'};
        border-radius: 8px;
        background-color: ${isDarkMode ? '#2a2a3a' : '#fff'};
        color: ${isDarkMode ? '#f0f0f0' : '#333'};
        margin-bottom: 12px;
        resize: vertical;
      }
      .comment-form button,
      .edit-buttons button {
        background-color: ${isDarkMode ? '#6b8cae' : '#4a6fa5'};
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        margin-right: 8px;
      }
      .comment-form button:hover,
      .edit-buttons button:hover {
        background-color: ${isDarkMode ? '#4a6fa5' : '#3a5f95'};
      }
      .login-prompt {
        margin-top: 20px;
        text-align: center;
        color: ${isDarkMode ? '#f0f0f0' : '#333'};
      }
      .login-prompt a {
        color: ${isDarkMode ? '#6b8cae' : '#4a6fa5'};
        text-decoration: none;
      }

      @media (max-width: 768px) {
        .log-detail-wrapper {
          padding: 15px;
        }
        .log-detail-header h1 {
          font-size: 2rem;
        }
      }
    `}</style>


      <div className="log-detail-wrapper">
        <div className="log-detail-header">
          <Link to="/logs" className="back-button">
            <FaArrowLeft /> Back to Logs
          </Link>
          <h1>{log.title}</h1>
          <div className="log-meta">
            <span className="location">
              <FaMapMarkerAlt /> {log.location}
            </span>
            <span className="date">
              {new Date(log.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="log-detail-content">
          <div className="log-image-container">
            {imageError ? (
              <div className="image-fallback">
                <FaImage className="fallback-icon" />
                <p>Image not available</p>
              </div>
            ) : (
              <img
                src={getImageUrl(log.image)}
                alt={log.title}
                className="log-detail-image"
                onError={() => setImageError(true)}
              />
            )}
          </div>

          <div className="log-description">
            <p>{log.description}</p>
          </div>

          <div className="log-tags">
            {log.tags?.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>

          <div className="log-actions">
            <button 
              className={`action-btn ${liked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              {liked ? <FaHeart /> : <FaRegHeart />} 
              <span>{likesCount}</span>
            </button>
            <button className="action-btn">
              <FaBookmark /> Save
            </button>
          </div>

          {log.author && (
            <div className="author-info">
              <img 
                src={log.author.profilePicture || '/default-avatar.jpg'} 
                alt={log.author.username} 
                className="author-avatar" 
              />
              <span>Posted by {log.author.username}</span>
            </div>
          )}

          <div className="comments-section">
            <h3>Comments ({log.comments?.length || 0})</h3>
            
            {log.comments?.map((comment) => (
              <div key={comment._id} className="comment">
                <div className="comment-header">
                  <div className="comment-author">
                    <img 
                      src={comment.author.profilePicture || '/default-avatar.jpg'} 
                      alt={comment.author.username} 
                      className="comment-avatar"
                    />
                    <span>{comment.author.username}</span>
                  </div>
                  {currentUserId === comment.author._id && (
                    <div className="comment-actions">
                      <button onClick={() => startEditing(comment)}>
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteComment(comment._id)}>
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
                
                {editingComment === comment._id ? (
                  <div className="edit-comment-form">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="edit-buttons">
                      <button onClick={() => handleEditComment(comment._id)}>
                        Save
                      </button>
                      <button onClick={cancelEditing}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="comment-content">{comment.content}</p>
                )}
                
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                required
              />
              <button type="submit">Post Comment</button>
            </form>
          ) : (
            <p className="login-prompt">
              Please <Link to="/login">log in</Link> to add a comment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogDetail;