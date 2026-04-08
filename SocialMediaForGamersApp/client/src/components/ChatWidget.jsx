import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  getChatConversations, getChatMessages, sendChatMessage, getChatUsers, getChatUnreadCount,
  getFriends, getPendingFriendRequests, sendFriendRequest, acceptFriendRequest, declineFriendRequest, getFriendshipStatus,
  blockChatUser, unblockChatUser, getChatBlockStatus
} from '../api'

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

export default function ChatWidget() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  // views: 'conversations' | 'chat' | 'findFriends' | 'requests'
  const [view, setView] = useState('conversations')
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [msgText, setMsgText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [totalUnread, setTotalUnread] = useState(0)
  const [loading, setLoading] = useState(false)
  const [friends, setFriends] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [friendStatuses, setFriendStatuses] = useState({})
  const [blockStatus, setBlockStatus] = useState({ blockedByMe: false, blockedByThem: false })
  const messagesEndRef = useRef(null)
  const pollRef = useRef(null)
  const searchTimerRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Fetch total unread count + pending requests periodically
  useEffect(() => {
    if (!user) return
    const fetchCounts = () => {
      getChatUnreadCount(user.id)
        .then(res => setTotalUnread(res.data.count))
        .catch(() => setTotalUnread(0))
      getPendingFriendRequests(user.id)
        .then(res => setPendingRequests(res.data))
        .catch(() => setPendingRequests([]))
    }
    fetchCounts()
    const interval = setInterval(fetchCounts, 10000)
    return () => clearInterval(interval)
  }, [user])

  // Fetch data when widget opens
  useEffect(() => {
    if (!user || !open) return
    loadConversations()
    loadFriends()
    loadRequests()
  }, [user, open])

  // Poll messages when in chat view
  useEffect(() => {
    if (!user || !activeChat || view !== 'chat') {
      if (pollRef.current) clearInterval(pollRef.current)
      return
    }
    const fetchMessages = () => {
      getChatMessages(user.id, activeChat.userId)
        .then(res => {
          setMessages(res.data)
          getChatUnreadCount(user.id)
            .then(r => setTotalUnread(r.data.count))
            .catch(() => setTotalUnread(0))
        })
        .catch(() => {})
    }
    fetchMessages()
    pollRef.current = setInterval(fetchMessages, 5000)
    return () => clearInterval(pollRef.current)
  }, [user, activeChat, view])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // User search for finding friends
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    if (!searchQuery.trim() || !user) {
      setSearchResults([])
      setFriendStatuses({})
      return
    }
    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await getChatUsers(user.id, searchQuery.trim())
        setSearchResults(res.data)
        const statuses = {}
        await Promise.all(res.data.map(async (u) => {
          try {
            const s = await getFriendshipStatus(user.id, u.id)
            statuses[u.id] = s.data
          } catch { statuses[u.id] = { status: 'None' } }
        }))
        setFriendStatuses(statuses)
      } catch {
        setSearchResults([])
        setFriendStatuses({})
      }
    }, 300)
    return () => clearTimeout(searchTimerRef.current)
  }, [searchQuery, user])

  const loadConversations = async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await getChatConversations(user.id)
      setConversations(res.data)
    } catch { }
    setLoading(false)
  }

  const loadFriends = async () => {
    if (!user) return
    try {
      const res = await getFriends(user.id)
      setFriends(res.data)
    } catch { }
  }

  const loadRequests = async () => {
    if (!user) return
    try {
      const res = await getPendingFriendRequests(user.id)
      setPendingRequests(res.data)
    } catch { }
  }

  const openChat = (chatUser) => {
    setActiveChat(chatUser)
    setView('chat')
    setMessages([])
    setBlockStatus({ blockedByMe: false, blockedByThem: false })
    if (user) {
      getChatBlockStatus(user.id, chatUser.userId)
        .then(res => setBlockStatus(res.data))
        .catch(() => setBlockStatus({ blockedByMe: false, blockedByThem: false }))
    }
  }

  const handleSend = async () => {
    if (!msgText.trim() || !activeChat) return
    try {
      await sendChatMessage({
        senderId: user.id,
        receiverId: activeChat.userId,
        content: msgText.trim()
      })
      setMsgText('')
      const res = await getChatMessages(user.id, activeChat.userId)
      setMessages(res.data)
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const goBack = () => {
    setView('conversations')
    setActiveChat(null)
    setSearchQuery('')
    setSearchResults([])
    setFriendStatuses({})
    loadConversations()
    loadFriends()
    loadRequests()
  }

  const handleAddFriend = async (otherUserId) => {
    try {
      await sendFriendRequest(user.id, otherUserId)
      setFriendStatuses(prev => ({ ...prev, [otherUserId]: { status: 'Pending', isRequester: true } }))
    } catch (err) {
      console.error('Failed to send friend request:', err)
    }
  }

  const handleAccept = async (requestId) => {
    try {
      await acceptFriendRequest(requestId, user.id)
      loadRequests()
      loadFriends()
    } catch (err) {
      console.error('Failed to accept request:', err)
    }
  }

  const handleDecline = async (requestId) => {
    try {
      await declineFriendRequest(requestId, user.id)
      loadRequests()
    } catch (err) {
      console.error('Failed to decline request:', err)
    }
  }

  const handleBlock = async () => {
    if (!activeChat) return
    try {
      await blockChatUser(user.id, activeChat.userId)
      setBlockStatus(prev => ({ ...prev, blockedByMe: true }))
    } catch (err) {
      console.error('Failed to block user:', err)
    }
  }

  const handleUnblock = async () => {
    if (!activeChat) return
    try {
      await unblockChatUser(user.id, activeChat.userId)
      setBlockStatus(prev => ({ ...prev, blockedByMe: false }))
    } catch (err) {
      console.error('Failed to unblock user:', err)
    }
  }

  if (!user) return null

  const avatarColor = (name) => `hsl(${(name || '').length * 40}, 60%, 45%)`

  return (
    <div className="cw-container">
      {/* Toggle button */}
      <button className="cw-toggle" onClick={() => setOpen(o => !o)}>
        <img src="/assets/icons/comment.png" alt="Chat" className="cw-toggle-icon" />
        {(totalUnread > 0 || pendingRequests.length > 0) && (
          <span className="cw-badge">{(() => { const t = totalUnread + pendingRequests.length; return t > 9 ? '9+' : t })()}</span>
        )}
      </button>

      {open && (
        <div className="cw-panel">
          {/* Header */}
          <div className="cw-header">
            {view !== 'conversations' && (
              <button className="cw-back" onClick={goBack}>←</button>
            )}
            <span className="cw-header-title">
              {view === 'conversations' && 'Chat'}
              {view === 'findFriends' && 'Find Friends'}
              {view === 'requests' && 'Friend Requests'}
              {view === 'chat' && activeChat && (
                <span className="cw-header-user">
                  <span className="cw-mini-avatar" style={{ background: avatarColor(activeChat.username) }}>
                    {activeChat.username.charAt(0).toUpperCase()}
                  </span>
                  {activeChat.username}
                </span>
              )}
            </span>
            <div className="cw-header-actions">
              {view === 'chat' && activeChat && (
                blockStatus.blockedByMe ? (
                  <button className="cw-unblock-btn" onClick={handleUnblock} title="Unblock user">
                    Unblock
                  </button>
                ) : (
                  <button className="cw-block-btn" onClick={handleBlock} title="Block user">
                    Block
                  </button>
                )
              )}
              {view === 'conversations' && (
                <button className="cw-new-btn" onClick={() => setView('findFriends')} title="Find friends">
                  <img src="/assets/icons/search.png" alt="Find" className="cw-header-icon" />
                </button>
              )}
              <button className="cw-close" onClick={() => setOpen(false)}>✕</button>
            </div>
          </div>

          {/* Conversations view with sub-tabs */}
          {view === 'conversations' && (
            <div className="cw-body">
              <div className="cw-subtabs">
                <button className="cw-subtab active" disabled>Messages</button>
                <button className="cw-subtab" onClick={() => setView('requests')}>
                  Requests {pendingRequests.length > 0 && <span className="cw-req-count">{pendingRequests.length}</span>}
                </button>
              </div>
              {loading ? (
                <div className="cw-empty">Loading...</div>
              ) : friends.length === 0 ? (
                <div className="cw-empty">
                  <p>Add friends to start chatting</p>
                  <button className="cw-start-btn" onClick={() => setView('findFriends')}>Find Friends</button>
                </div>
              ) : conversations.length === 0 ? (
                <div className="cw-empty">
                  <p>No messages yet</p>
                  <p style={{ fontSize: '0.75rem', color: '#555' }}>Pick a friend below to start chatting</p>
                  <div className="cw-conv-list" style={{ width: '100%', marginTop: '8px' }}>
                    {friends.map(f => (
                      <button key={f.userId} className="cw-conv-item" onClick={() => openChat(f)}>
                        <span className="cw-avatar" style={{ background: avatarColor(f.username) }}>
                          {f.username.charAt(0).toUpperCase()}
                        </span>
                        <div className="cw-conv-body">
                          <span className="cw-conv-name">{f.username}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="cw-conv-list">
                  {conversations.map(c => (
                    <button
                      key={c.userId}
                      className={`cw-conv-item ${c.unreadCount > 0 ? 'unread' : ''}`}
                      onClick={() => openChat(c)}
                    >
                      <span className="cw-avatar" style={{ background: avatarColor(c.username) }}>
                        {c.username.charAt(0).toUpperCase()}
                      </span>
                      <div className="cw-conv-body">
                        <div className="cw-conv-top">
                          <span className="cw-conv-name">{c.username}</span>
                          <span className="cw-conv-time">{timeAgo(c.lastMessageAt)}</span>
                        </div>
                        <span className="cw-conv-preview">{c.lastMessage}</span>
                      </div>
                      {c.unreadCount > 0 && <span className="cw-unread-dot">{c.unreadCount}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Friend requests view */}
          {view === 'requests' && (
            <div className="cw-body">
              <div className="cw-subtabs">
                <button className="cw-subtab" onClick={goBack}>Messages</button>
                <button className="cw-subtab active" disabled>
                  Requests {pendingRequests.length > 0 && <span className="cw-req-count">{pendingRequests.length}</span>}
                </button>
              </div>
              {pendingRequests.length === 0 ? (
                <div className="cw-empty">No pending requests</div>
              ) : (
                <div className="cw-conv-list">
                  {pendingRequests.map(r => (
                    <div key={r.id} className="cw-conv-item cw-request-item">
                      <span className="cw-avatar" style={{ background: avatarColor(r.username) }}>
                        {r.username.charAt(0).toUpperCase()}
                      </span>
                      <div className="cw-conv-body">
                        <span className="cw-conv-name">{r.username}</span>
                        <span className="cw-conv-preview">{timeAgo(r.createdAt)}</span>
                      </div>
                      <div className="cw-request-actions">
                        <button className="cw-accept-btn" onClick={() => handleAccept(r.id)}>✓</button>
                        <button className="cw-decline-btn" onClick={() => handleDecline(r.id)}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Find friends search */}
          {view === 'findFriends' && (
            <div className="cw-body">
              <div className="cw-search-wrap">
                <input
                  className="cw-search-input"
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="cw-conv-list">
                {searchResults.map(u => {
                  const fs = friendStatuses[u.id] || { status: 'None' }
                  return (
                    <div key={u.id} className="cw-conv-item cw-search-item">
                      <span className="cw-avatar" style={{ background: avatarColor(u.username) }}>
                        {u.username.charAt(0).toUpperCase()}
                      </span>
                      <div className="cw-conv-body">
                        <span className="cw-conv-name">{u.username}</span>
                        {(u.firstName || u.lastName) && (
                          <span className="cw-conv-preview">{u.firstName} {u.lastName}</span>
                        )}
                      </div>
                      {(fs.status === 'None' || fs.status === 'Declined') && (
                        <button className="cw-add-friend-btn" onClick={() => handleAddFriend(u.id)}>Add</button>
                      )}
                      {fs.status === 'Pending' && fs.isRequester && (
                        <span className="cw-status-tag pending">Pending</span>
                      )}
                      {fs.status === 'Pending' && !fs.isRequester && (
                        <button className="cw-accept-btn" onClick={() => handleAccept(fs.friendshipId)}>Accept</button>
                      )}
                      {fs.status === 'Accepted' && (
                        <button className="cw-msg-friend-btn" onClick={() => openChat({ userId: u.id, username: u.username })}>Chat</button>
                      )}
                    </div>
                  )
                })}
                {searchQuery.trim() && searchResults.length === 0 && (
                  <div className="cw-empty">No users found</div>
                )}
              </div>
            </div>
          )}

          {/* Chat messages */}
          {view === 'chat' && (
            <>
              <div className="cw-messages">
                {messages.length === 0 ? (
                  <div className="cw-empty">
                    {blockStatus.blockedByMe || blockStatus.blockedByThem
                      ? 'Messages are unavailable'
                      : 'Send the first message!'}
                  </div>
                ) : (
                  messages.map(m => (
                    <div
                      key={m.id}
                      className={`cw-msg ${m.senderId === user.id ? 'sent' : 'received'}`}
                    >
                      <div className="cw-msg-bubble">
                        <p className="cw-msg-text">{m.content}</p>
                        <span className="cw-msg-time">{timeAgo(m.createdAt)}</span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              {blockStatus.blockedByMe ? (
                <div className="cw-blocked-bar">
                  You have blocked this user.
                  <button className="cw-unblock-inline" onClick={handleUnblock}>Unblock</button>
                </div>
              ) : blockStatus.blockedByThem ? (
                <div className="cw-blocked-bar">
                  You cannot send messages to this user.
                </div>
              ) : (
                <div className="cw-input-bar">
                  <input
                    className="cw-msg-input"
                    type="text"
                    placeholder="Type a message..."
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                  <button
                    className="cw-send-btn"
                    onClick={handleSend}
                    disabled={!msgText.trim()}
                  >
                    ➤
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
