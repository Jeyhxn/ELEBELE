import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getPostsByUser, getCommentsByUser, getViewHistory } from '../api'

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

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'posts', label: 'Posts' },
  { key: 'comments', label: 'Comments' },
  { key: 'history', label: 'History' },
]

export default function ProfilePage() {
  const { user } = useAuth()
  const [tab, setTab] = useState('overview')
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])
  const [viewHistory, setViewHistory] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    loadData()
  }, [user, tab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (tab === 'overview') {
        const [postsRes, commentsRes] = await Promise.all([
          getPostsByUser(user.id, 1, 50),
          getCommentsByUser(user.id, 1, 50),
        ])
        setPosts(postsRes.data)
        setComments(commentsRes.data)
      } else if (tab === 'posts') {
        const res = await getPostsByUser(user.id, 1, 50)
        setPosts(res.data)
      } else if (tab === 'comments') {
        const res = await getCommentsByUser(user.id, 1, 50)
        setComments(res.data)
      } else if (tab === 'history') {
        const res = await getViewHistory(user.id, 1, 50)
        setViewHistory(res.data)
      }
    } catch (err) {
      console.error('Failed to load profile data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="pp">
        <div className="pp-empty">Sign in to view your profile.</div>
      </div>
    )
  }

  const showPosts = tab === 'overview' || tab === 'posts'
  const showComments = tab === 'overview' || tab === 'comments'
  const showHistory = tab === 'history'

  const postSkeleton = (
    <div className="pp-items pp-skeleton-list">
      {[1, 2, 3].map((i) => (
        <div key={`pp-post-skeleton-${i}`} className="pp-skeleton-item">
          <span className="pp-skeleton-line pp-skeleton-meta"></span>
          <span className="pp-skeleton-line pp-skeleton-title"></span>
          <span className="pp-skeleton-line pp-skeleton-stat"></span>
        </div>
      ))}
    </div>
  )

  const commentSkeleton = (
    <div className="pp-items pp-skeleton-list">
      {[1, 2, 3, 4].map((i) => (
        <div key={`pp-comment-skeleton-${i}`} className="pp-skeleton-item">
          <span className="pp-skeleton-line pp-skeleton-meta"></span>
          <span className="pp-skeleton-line pp-skeleton-title"></span>
          <span className="pp-skeleton-line pp-skeleton-stat"></span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="pp">
      <div className="pp-header">
        <div className="pp-avatar" style={{ background: `hsl(${user.username.length * 40}, 60%, 45%)` }}>
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="pp-identity">
          <h1 className="pp-name">{user.firstName || user.username}{user.lastName ? ` ${user.lastName}` : ''}</h1>
          <span className="pp-handle">u/{user.username}</span>
        </div>
        {user.isAdmin && <span className="pp-badge">Admin</span>}
      </div>

      <div className="pp-tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`pp-tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={`pp-content${loading ? ' is-loading' : ''}`}>
        {showPosts && (
          <div className="pp-section">
            <h3 className="pp-section-title">Posts</h3>
            {loading ? postSkeleton : posts.length === 0 ? (
              <div className="pp-empty-card">
                <span className="pp-empty-icon"></span>
                <h3>You don't have any posts yet</h3>
                <p>Once you post to a community, it'll show up here.</p>
                <Link to="/community" className="pp-cta">Go to Community</Link>
              </div>
            ) : (
              <div className="pp-items">
                {posts.map(p => (
                  <Link to={`/community/post/${p.id}`} key={p.id} className="pp-post-item">
                    <div className="pp-post-body">
                      <span className="pp-post-meta">c/{p.community.name} - {timeAgo(p.createdAt)}</span>
                      <span className="pp-post-title">{p.title}</span>
                      <span className="pp-post-stats"><img src="/assets/icons/comment.png" alt="" className="action-icon-sm" /> {p.commentCount} comments</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {showComments && (
          <div className="pp-section">
            <h3 className="pp-section-title">Comments</h3>
            {loading ? commentSkeleton : comments.length === 0 ? (
              <div className="pp-empty-card">
                <span className="pp-empty-icon"><img src="/assets/icons/comment.png" alt="" className="action-icon-sm" /></span>
                <h3>You don't have any comments yet</h3>
                <p>Join a conversation on a post and your comments will appear here.</p>
              </div>
            ) : (
              <div className="pp-items">
                {comments.map(c => (
                  <Link to={`/community/post/${c.post.id}`} key={c.id} className="pp-comment-item">
                    <div className="pp-comment-context">
                      <span><img src="/assets/icons/comment.png" alt="" className="action-icon-sm" /> commented on</span>
                      <strong>{c.post.title}</strong>
                      <span className="pp-comment-where">in c/{c.post.community.name} - {timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="pp-comment-text">{c.content}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {showHistory && (
          <div className="pp-section">
            <h3 className="pp-section-title">History</h3>
            {loading ? postSkeleton : viewHistory.length === 0 ? (
              <div className="pp-empty-card">
                <h3>No history yet</h3>
                <p>Posts you view will appear here.</p>
              </div>
            ) : (
              <div className="pp-items">
                {viewHistory.map(v => (
                  <Link to={`/community/post/${v.post.id}`} key={v.id} className="pp-post-item">
                    <div className="pp-post-body">
                      <span className="pp-post-meta">Viewed {timeAgo(v.viewedAt)} - c/{v.post.community.name}</span>
                      <span className="pp-post-title">{v.post.title}</span>
                      <span className="pp-post-stats">by {v.post.author.username} - <img src="/assets/icons/comment.png" alt="" className="action-icon-sm" /> {v.post.commentCount} comments</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
