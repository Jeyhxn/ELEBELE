import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getPostById, votePost, addPostComment, editPostComment, deletePostComment, deletePost, recordPostView } from '../api'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

const COMMENT_SORTS = [
  { key: 'new', label: 'New' },
  { key: 'best', label: 'Best' },
  { key: 'hot', label: 'Hot' },
]

function updateCommentInTree(comments, id, updated) {
  return comments.map(c => {
    if (c.id === id) return { ...updated, replies: c.replies }
    if (c.replies?.length) return { ...c, replies: updateCommentInTree(c.replies, id, updated) }
    return c
  })
}

function removeCommentFromTree(comments, id) {
  return comments
    .filter(c => c.id !== id)
    .map(c => c.replies?.length ? { ...c, replies: removeCommentFromTree(c.replies, id) } : c)
}

function addReplyToTree(comments, parentId, reply) {
  return comments.map(c => {
    if (c.id === parentId) return { ...c, replies: [...(c.replies || []), reply] }
    if (c.replies?.length) return { ...c, replies: addReplyToTree(c.replies, parentId, reply) }
    return c
  })
}

function countAllComments(comments) {
  return comments.reduce((sum, c) => sum + 1 + (c.replies?.length ? countAllComments(c.replies) : 0), 0)
}

function DetailComment({ comment, user, onEdit, onDelete, onReply, depth = 0 }) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(comment.content)
  const [saving, setSaving] = useState(false)
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replying, setReplying] = useState(false)

  const canModify = user && (user.id === comment.author.id || user.isAdmin || user.isModerator)

  const handleSave = async () => {
    if (!editText.trim()) return
    try {
      setSaving(true)
      await onEdit(comment.id, editText.trim())
      setEditing(false)
    } catch (err) {
      console.error('Edit failed:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditText(comment.content)
    setEditing(false)
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim() || !user) return
    try {
      setReplying(true)
      await onReply(comment.id, replyText.trim())
      setReplyText('')
      setShowReply(false)
    } catch (err) {
      console.error('Reply failed:', err)
    } finally {
      setReplying(false)
    }
  }

  return (
    <div className="pd-comment" style={{ '--pd-depth': `${Math.min(depth, 6)}` }}>
      <div className="pd-comment-left">
        <div className="pd-comment-avatar" style={{ background: `hsl(${comment.author.username.length * 40}, 60%, 45%)` }}>
          {comment.author.username.charAt(0).toUpperCase()}
        </div>
        <div className="pd-comment-thread-line"></div>
      </div>
      <div className="pd-comment-body">
        <div className="pd-comment-header">
          <span className="pd-comment-author">{comment.author.username}</span>
          <span className="pd-comment-dot">·</span>
          <span className="pd-comment-time">{timeAgo(comment.createdAt)}</span>
        </div>

        {editing ? (
          <div className="pd-comment-edit">
            <textarea
              className="pd-comment-edit-input"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
              disabled={saving}
            />
            <div className="pd-comment-edit-actions">
              <button className="pd-comment-edit-save" onClick={handleSave} disabled={saving || !editText.trim()}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button className="pd-comment-edit-cancel" onClick={handleCancel} disabled={saving}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="pd-comment-text">{comment.content}</p>
        )}

        <div className="pd-comment-actions">
          {user && !editing && (
            <button className="pd-comment-action-btn" onClick={() => setShowReply(!showReply)}><img src="/assets/icons/comment.png" alt="" className="action-icon-sm" /> Reply</button>
          )}
          {canModify && !editing && (
            <>
              <button className="pd-comment-action-btn" onClick={() => setEditing(true)}><img src="/assets/icons/edit.png" alt="" className="action-icon-sm" /> Edit</button>
              <button className="pd-comment-action-btn pd-comment-delete-btn" onClick={() => onDelete(comment.id)}><img src="/assets/icons/trash.png" alt="" className="action-icon-sm" /> Delete</button>
            </>
          )}
        </div>

        {showReply && user && (
          <form className="pd-reply-form" onSubmit={handleReply}>
            <div className="pd-comment-input-avatar pd-reply-avatar" style={{ background: `hsl(${user.username.length * 40}, 60%, 45%)` }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <input
              className="pd-reply-input"
              placeholder={`Reply to ${comment.author.username}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={replying}
              autoFocus
            />
            {replyText.trim() && (
              <button className="pd-comment-submit pd-reply-submit" type="submit" disabled={replying}>
                {replying ? '...' : 'Reply'}
              </button>
            )}
            <button type="button" className="pd-comment-edit-cancel" onClick={() => { setShowReply(false); setReplyText('') }}>
              Cancel
            </button>
          </form>
        )}

        {/* Render nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="pd-replies">
            {comment.replies.map(r => (
              <DetailComment
                key={r.id}
                comment={r}
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
                onReply={onReply}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [upvotes, setUpvotes] = useState(0)
  const [downvotes, setDownvotes] = useState(0)
  const [userVote, setUserVote] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [commentSort, setCommentSort] = useState('new')

  const viewRecorded = useRef(false)

  useEffect(() => {
    loadPost()
    viewRecorded.current = false
  }, [id])

  useEffect(() => {
    if (user && id && !viewRecorded.current) {
      viewRecorded.current = true
      recordPostView(id, user.id).catch(() => {})
    }
  }, [id, user])

  const loadPost = async () => {
    try {
      setLoading(true)
      const res = await getPostById(id, user?.id || null)
      setPost(res.data)
      setUpvotes(res.data.upvotes)
      setDownvotes(res.data.downvotes)
      setUserVote(res.data.userVote)
      setComments(res.data.comments || [])
    } catch (err) {
      console.error('Failed to load post:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (isUpvote) => {
    if (!user) return
    try {
      const res = await votePost({ postId: post.id, userId: user.id, isUpvote })
      setUpvotes(res.data.upvotes)
      setDownvotes(res.data.downvotes)
      setUserVote(res.data.userVote)
    } catch (err) {
      console.error('Vote failed:', err)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim() || !user) return
    try {
      setSubmitting(true)
      const res = await addPostComment({ postId: post.id, userId: user.id, content: commentText.trim() })
      setComments(prev => [...prev, res.data])
      setCommentText('')
    } catch (err) {
      console.error('Comment failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return
    try {
      await deletePost(post.id, user.id)
      navigate('/community')
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const sortedComments = [...comments].sort((a, b) => {
    if (commentSort === 'new') return new Date(b.createdAt) - new Date(a.createdAt)
    if (commentSort === 'best') return (b.replies?.length || 0) - (a.replies?.length || 0)
    if (commentSort === 'hot') {
      const ageA = (Date.now() - new Date(a.createdAt).getTime()) / 3600000
      const ageB = (Date.now() - new Date(b.createdAt).getTime()) / 3600000
      const scoreA = (a.replies?.length || 0) / Math.max(ageA, 1)
      const scoreB = (b.replies?.length || 0) / Math.max(ageB, 1)
      return scoreB - scoreA
    }
    return 0
  })

  const handleEditComment = async (commentId, newContent) => {
    const res = await editPostComment(commentId, { content: newContent, userId: user.id })
    setComments(prev => updateCommentInTree(prev, commentId, res.data))
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Delete this comment?')) return
    try {
      await deletePostComment(commentId, user.id)
      setComments(prev => removeCommentFromTree(prev, commentId))
    } catch (err) {
      console.error('Delete comment failed:', err)
    }
  }

  const handleReplyComment = async (parentCommentId, content) => {
    const res = await addPostComment({
      postId: post.id,
      userId: user.id,
      content,
      parentCommentId
    })
    setComments(prev => addReplyToTree(prev, parentCommentId, res.data))
  }

  if (loading) {
    return <div className="pd-loading">Loading post...</div>
  }

  if (!post) {
    return <div className="pd-loading">Post not found.</div>
  }

  return (
    <div className="pd-wrapper">
      <div className="pd-container">
        {/* Back button + community header */}
        <div className="pd-top-bar">
          <button className="pd-back-btn" onClick={() => navigate('/community')}>←</button>
          <div className="pd-community-badge">
            <span className="pd-community-icon"></span>
            <span className="pd-community-name">c/{post.community.name}</span>
          </div>
          <span className="pd-header-dot">·</span>
          <span className="pd-header-time">{timeAgo(post.createdAt)}</span>
        </div>

        <div className="pd-author-row">
          <div className="pd-author-avatar" style={{ background: `hsl(${post.author.username.length * 40}, 60%, 45%)` }}>
            {post.author.username.charAt(0).toUpperCase()}
          </div>
          <span className="pd-author-name">{post.author.username}</span>
        </div>

        {/* Post title */}
        <h1 className="pd-title">{post.title}</h1>

        {/* Post media */}
        {post.mediaURL && (
          <div className="pd-image">
            <img src={`https://localhost:7271${post.mediaURL}`} alt="" />
          </div>
        )}
        {!post.mediaURL && post.imageURL && (
          <div className="pd-image">
            <img src={post.imageURL} alt="" />
          </div>
        )}

        {/* Post content */}
        {post.content && (
          <p className="pd-content">{post.content}</p>
        )}

        {/* Action bar: likes, dislikes, comments, delete */}
        <div className="pd-action-bar">
          <div className={`post-vote-pill${userVote === true ? ' voted-up' : ''}${userVote === false ? ' voted-down' : ''}`}>
            <button
              className={`post-vote-btn upvote${userVote === true ? ' active' : ''}`}
              onClick={() => handleVote(true)}
              disabled={!user}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88L14 10h5.83a2 2 0 011.92 2.56l-1.68 7A2 2 0 0118.15 21H7V10l4-9a1 1 0 011 1v4"/></svg>
            </button>
            <span className="post-vote-count">{Math.max(0, upvotes - downvotes)}</span>
            <button
              className={`post-vote-btn downvote${userVote === false ? ' active' : ''}`}
              onClick={() => handleVote(false)}
              disabled={!user}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2"/><path d="M9 18.12L10 14H4.17a2 2 0 01-1.92-2.56l1.68-7A2 2 0 015.85 3H17v11l-4 9a1 1 0 01-1-1v-4"/></svg>
            </button>
          </div>
          <button className="pd-action-pill">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:'5px'}}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            {countAllComments(comments)}
          </button>
          {user && (user.id === post.author.id || user.isAdmin || user.isModerator) && (
            <button className="pd-action-pill pd-delete" onClick={handleDelete}>Delete</button>
          )}
        </div>

        {/* Join the conversation */}
        <div className="pd-comment-input-wrapper">
          {user ? (
            <form className="pd-comment-form" onSubmit={handleComment}>
              <div className="pd-comment-input-avatar" style={{ background: `hsl(${user.username.length * 40}, 60%, 45%)` }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <input
                className="pd-comment-input"
                placeholder="Join the conversation"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={submitting}
              />
              {commentText.trim() && (
                <button className="pd-comment-submit" type="submit" disabled={submitting}>
                  {submitting ? '...' : 'Reply'}
                </button>
              )}
            </form>
          ) : (
            <Link to="/login" className="pd-comment-input pd-comment-login-prompt">
              Sign in to join the conversation
            </Link>
          )}
        </div>

        {/* Sort bar */}
        <div className="pd-comment-controls">
          <div className="pd-sort-row">
            <span className="pd-sort-label">Sort by:</span>
            {COMMENT_SORTS.map(s => (
              <button
                key={s.key}
                className={`pd-sort-btn ${commentSort === s.key ? 'active' : ''}`}
                onClick={() => setCommentSort(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Comments list */}
        <div className="pd-comments-list">
          {sortedComments.length === 0 ? (
            <p className="pd-no-comments">
              No comments yet. Be the first!
            </p>
          ) : (
            sortedComments.map(c => (
              <DetailComment
                key={c.id}
                comment={c}
                user={user}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
                onReply={handleReplyComment}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
