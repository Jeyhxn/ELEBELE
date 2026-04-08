import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getNotifications, markNotificationRead, markAllNotificationsRead, clearAllNotifications } from '../api'

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

export default function NotificationsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    loadNotifications()
  }, [user])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const res = await getNotifications(user.id)
      setNotifications(res.data)
    } catch (err) {
      console.error('Failed to load notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await markNotificationRead(notif.id, user.id)
        setNotifications(prev =>
          prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n)
        )
        window.dispatchEvent(new Event('notifications-updated'))
      } catch (err) {
        console.error('Failed to mark read:', err)
      }
    }
    if (notif.postId) {
      navigate(`/community/post/${notif.postId}`)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead(user.id)
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      window.dispatchEvent(new Event('notifications-updated'))
    } catch (err) {
      console.error('Failed to mark all read:', err)
    }
  }

  const handleClearAll = async () => {
    if (!confirm('Clear all notifications? This cannot be undone.')) return
    try {
      await clearAllNotifications(user.id)
      setNotifications([])
      window.dispatchEvent(new Event('notifications-updated'))
    } catch (err) {
      console.error('Failed to clear notifications:', err)
    }
  }

  if (!user) {
    return (
      <div className="notif-page">
        <div className="notif-empty">Sign in to see your notifications.</div>
      </div>
    )
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="notif-page">
      <div className="notif-header">
        <h1>Notifications</h1>
        <div className="notif-header-actions">
          {unreadCount > 0 && (
            <button className="notif-mark-all" onClick={handleMarkAllRead}>
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button className="notif-clear-all" onClick={handleClearAll}>
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="notif-list-wrap">
        {loading ? (
          <div className="notif-list notif-list-skeleton" aria-hidden="true">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={`notif-skeleton-${i}`} className="notif-item">
                <div className="notif-icon">
                  <span className="notif-skeleton-dot"></span>
                </div>
                <div className="notif-body">
                  <span className="notif-skeleton-line lg"></span>
                  <span className="notif-skeleton-line md"></span>
                </div>
                <span className="notif-skeleton-dot notif-skeleton-dot-end"></span>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="notif-empty">No notifications yet. Join communities to get notified about new posts!</div>
        ) : (
          <div className="notif-list">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`notif-item ${n.isRead ? '' : 'unread'}`}
                onClick={() => handleClick(n)}
              >
                <div className="notif-icon">
                  {n.type === 'new_post' ? '📢' : '💬'}
                </div>
                <div className="notif-body">
                  <p className="notif-message">{n.message}</p>
                  <span className="notif-time">{timeAgo(n.createdAt)}</span>
                </div>
                {!n.isRead && <span className="notif-dot"></span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
