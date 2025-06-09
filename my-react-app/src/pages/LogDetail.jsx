// src/pages/LogDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { 
  FaHeart, 
  FaComment, 
  FaBookmark, 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaPaperPlane 
} from 'react-icons/fa';
import '../styles/main.css';

const LogDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [log, setLog] = useState(location.state?.log || null);
  const [loading, setLoading] = useState(!location.state?.log);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize comments from log data or fetch separately
  useEffect(() => {
    if (log?.comments) {
      setComments(log.comments);
    }
  }, [log]);

  // Fetch log if not passed via state
  useEffect(() => {
    if (!location.state?.log) {
      const fetchLog = async () => {
        try {
          setLoading(true);
          // Replace with actual API call
          const mockLogs = [
            {
              _id: '1',
              title: 'Sunset at Santorini',
              description: 'The most beautiful sunset I\'ve ever seen in Santorini, Greece.',
              location: 'Santorini, Greece',
              tags: ['sunset', 'greece', 'island'],
              imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
              createdAt: new Date(),
              author: {
                name: 'Alex Johnson',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
              },
              comments: [
                {
                  user: 'TravelLover22',
                  text: 'Amazing view! Which month did you visit?',
                  date: new Date(Date.now() - 86400000)
                }
              ]
            },
            {
            _id: '2',
            title: 'Hiking in the Swiss Alps',
            description: 'An unforgettable hiking experience in the Swiss Alps with stunning mountain views.',
            location: 'Swiss Alps',
            tags: ['hiking', 'mountains', 'adventure'],
            imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
            createdAt: new Date(),
            author: {
              name: 'Sophie Müller',
              avatar: 'https://randomuser.me/api/portraits/women/45.jpg'
            },
            comments: [
              {
                user: 'MountainGoat99',
                text: 'Wow! The Alps are on my bucket list. Which trail did you take?',
                date: new Date(Date.now() - 2 * 86400000) // 2 days ago
              },
              {
                user: 'AlpineExplorer',
                text: 'Looks like the Eiger trail! Beautiful scenery!',
                date: new Date(Date.now() - 86400000) // 1 day ago
              }
            ]
          }

          ];
          const foundLog = mockLogs.find(log => log._id === id);
          setLog(foundLog);
        } catch (error) {
          console.error('Error fetching log:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchLog();
    }
  }, [id, location.state]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    
    try {
      const comment = {
        user: 'CurrentUser', // Replace with actual user from auth context
        text: newComment,
        date: new Date()
      };

      // Here you would make an actual API call
      // await fetch(`/api/logs/${id}/comments`, {
      //   method: 'POST',
      //   body: JSON.stringify({ text: newComment }),
      //   headers: { 'Content-Type': 'application/json' }
      // });

      setComments([...comments, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading travel log...</div>;
  if (!log) return <div className="not-found">Travel log not found</div>;

  return (
    <div className="log-detail-container">
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
        <div className="log-image">
          <img src={log.imageUrl} alt={log.title} />
        </div>

        <div className="log-description">
          <p>{log.description}</p>
        </div>

        <div className="log-tags">
          {log.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>

        <div className="log-actions">
          <button className="action-btn">
            <FaHeart /> Like
          </button>
          <button className="action-btn">
            <FaBookmark /> Save
          </button>
        </div>

        {log.author && (
          <div className="author-info">
            <img 
              src={log.author.avatar || '/default-avatar.jpg'} 
              alt={log.author.name} 
              className="author-avatar" 
            />
            <span className="author-name">Posted by {log.author.name}</span>
          </div>
        )}

        <div className="comments-section">
          <h3>Comments ({comments.length})</h3>
          
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="comment">
                <div className="comment-header">
                  <img 
                    src={`https://i.pravatar.cc/40?u=${comment.user}`} 
                    alt={comment.user} 
                    className="comment-avatar"
                  />
                  <div className="comment-user">{comment.user}</div>
                </div>
                <div className="comment-text">{comment.text}</div>
                <div className="comment-date">
                  {new Date(comment.date).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          )}

          <form onSubmit={handleCommentSubmit} className="add-comment">
            <textarea 
              placeholder="Add a comment..." 
              rows="3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isSubmitting}
            ></textarea>
            <button 
              type="submit" 
              className="comment-btn"
              disabled={!newComment.trim() || isSubmitting}
            >
              <FaPaperPlane /> 
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogDetail;