import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  getAdminStats, getAdminUsers, toggleAdminRole, toggleModeratorRole, adminDeleteUser,
  getGames, deleteGame, createGame,
  getCategories, createCategory, deleteCategory,
  getPlatforms, createPlatform, deletePlatform,
  getTags, createTag, deleteTag,
  syncGameCommunities
} from '../api'

const TABS = ['Dashboard', 'Games', 'Categories', 'Platforms', 'Tags', 'Users']

export default function AdminPanel() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Dashboard')

  // Dashboard
  const [stats, setStats] = useState(null)

  // Games
  const [games, setGames] = useState([])
  const [gameForm, setGameForm] = useState({ open: false })
  const [gameFormOptions, setGameFormOptions] = useState({ categories: [], platforms: [], tags: [] })
  const [selectedPlatformIds, setSelectedPlatformIds] = useState([])
  const [selectedTagIds, setSelectedTagIds] = useState([])

  // Categories
  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')

  // Platforms
  const [platforms, setPlatforms] = useState([])
  const [newPlatformName, setNewPlatformName] = useState('')

  // Tags
  const [tags, setTags] = useState([])
  const [newTagName, setNewTagName] = useState('')

  // Users
  const [users, setUsers] = useState([])

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.isAdmin) {
      loadTab(activeTab)
    }
  }, [activeTab, user])

  if (!user?.isAdmin) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>⛔ Access Denied</h2>
        <p>You must be an admin to access this page.</p>
      </div>
    )
  }

  const loadTab = async (tab) => {
    setError('')
    setSuccess('')
    try {
      if (tab === 'Dashboard') {
        const res = await getAdminStats(user.id)
        setStats(res.data)
      } else if (tab === 'Games') {
        const res = await getGames(1, 100)
        setGames(res.data)
      } else if (tab === 'Categories') {
        const res = await getCategories(1, 100)
        setCategories(Array.isArray(res.data) ? res.data : res.data.items ?? [])
      } else if (tab === 'Platforms') {
        const res = await getPlatforms(1, 100)
        setPlatforms(Array.isArray(res.data) ? res.data : res.data.items ?? [])
      } else if (tab === 'Tags') {
        const res = await getTags()
        setTags(res.data)
      } else if (tab === 'Users') {
        const res = await getAdminUsers(user.id)
        setUsers(res.data)
      }
    } catch (err) {
      setError('Failed to load data')
    }
  }

  const flash = (msg, isError = false) => {
    isError ? setError(msg) : setSuccess(msg)
    setTimeout(() => { setError(''); setSuccess('') }, 3000)
  }

  // -- Games --
  const loadGameFormOptions = async () => {
    try {
      const [catRes, platRes, tagRes] = await Promise.all([
        getCategories(1, 100),
        getPlatforms(1, 100),
        getTags()
      ])
      setGameFormOptions({
        categories: Array.isArray(catRes.data) ? catRes.data : catRes.data.items ?? [],
        platforms: Array.isArray(platRes.data) ? platRes.data : platRes.data.items ?? [],
        tags: tagRes.data
      })
    } catch {
      flash('Failed to load form options', true)
    }
  }

  const toggleGameForm = () => {
    const opening = !gameForm.open
    setGameForm({ open: opening })
    if (opening) {
      loadGameFormOptions()
      setSelectedPlatformIds([])
      setSelectedTagIds([])
    }
  }

  const togglePlatformId = (id) => {
    setSelectedPlatformIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const toggleTagId = (id) => {
    setSelectedTagIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleDeleteGame = async (id) => {
    if (!confirm('Delete this game?')) return
    try {
      await deleteGame(id)
      setGames(prev => prev.filter(g => g.id !== id))
      flash('Game deleted')
    } catch { flash('Failed to delete game', true) }
  }

  const handleCreateGame = async (e) => {
    e.preventDefault()
    const form = e.target
    const fd = new FormData(form)
    fd.delete('platformIds')
    fd.delete('tagIds')
    selectedPlatformIds.forEach(id => fd.append('platformIds', id))
    selectedTagIds.forEach(id => fd.append('tagIds', id))
    fd.append('userId', user.id)

    try {
      setLoading(true)
      await createGame(fd)
      flash('Game created')
      form.reset()
      setGameForm({ open: false })
      setSelectedPlatformIds([])
      setSelectedTagIds([])
      loadTab('Games')
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to create game', true)
    } finally { setLoading(false) }
  }

  // -- Categories --
  const handleCreateCategory = async (e) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    try {
      await createCategory({ name: newCategoryName.trim() })
      setNewCategoryName('')
      flash('Category created')
      loadTab('Categories')
    } catch { flash('Failed to create category', true) }
  }

  const handleDeleteCategory = async (id) => {
    if (!confirm('Delete this category?')) return
    try {
      await deleteCategory(id)
      setCategories(prev => prev.filter(c => c.id !== id))
      flash('Category deleted')
    } catch { flash('Failed to delete category', true) }
  }

  // -- Platforms --
  const handleCreatePlatform = async (e) => {
    e.preventDefault()
    if (!newPlatformName.trim()) return
    try {
      await createPlatform({ name: newPlatformName.trim() })
      setNewPlatformName('')
      flash('Platform created')
      loadTab('Platforms')
    } catch { flash('Failed to create platform', true) }
  }

  const handleDeletePlatform = async (id) => {
    if (!confirm('Delete this platform?')) return
    try {
      await deletePlatform(id)
      setPlatforms(prev => prev.filter(p => p.id !== id))
      flash('Platform deleted')
    } catch { flash('Failed to delete platform', true) }
  }

  // -- Tags --
  const handleCreateTag = async (e) => {
    e.preventDefault()
    if (!newTagName.trim()) return
    try {
      await createTag({ name: newTagName.trim() })
      setNewTagName('')
      flash('Tag created')
      loadTab('Tags')
    } catch (err) {
      flash(err.response?.data?.message || 'Failed to create tag', true)
    }
  }

  const handleDeleteTag = async (id) => {
    if (!confirm('Delete this tag?')) return
    try {
      await deleteTag(id)
      setTags(prev => prev.filter(t => t.id !== id))
      flash('Tag deleted')
    } catch { flash('Failed to delete tag', true) }
  }

  // -- Users --
  const handleToggleAdmin = async (userId) => {
    try {
      const res = await toggleAdminRole(userId, user.id)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isAdmin: res.data.isAdmin } : u))
      flash('Admin status updated')
    } catch { flash('Failed to update admin status', true) }
  }

  const handleToggleModerator = async (userId) => {
    try {
      const res = await toggleModeratorRole(userId, user.id)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isModerator: res.data.isModerator } : u))
      flash('Moderator status updated')
    } catch { flash('Failed to update moderator status', true) }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Delete this user?')) return
    try {
      await adminDeleteUser(userId, user.id)
      setUsers(prev => prev.filter(u => u.id !== userId))
      flash('User deleted')
    } catch { flash('Failed to delete user', true) }
  }

  if (!user?.isAdmin) return null

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>⚙️ Admin Panel</h1>
        <p>Welcome, {user.username}</p>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="admin-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`admin-tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {/* DASHBOARD */}
        {activeTab === 'Dashboard' && stats && (
          <>
            <div className="admin-stats-grid">
              {[
                { label: 'Games', value: stats.totalGames, icon: '🎮' },
                { label: 'Users', value: stats.totalUsers, icon: '👥' },
                { label: 'Comments', value: stats.totalComments, icon: '💬' },
                { label: 'Categories', value: stats.totalCategories, icon: '📂' },
                { label: 'Platforms', value: stats.totalPlatforms, icon: '🖥️' },
                { label: 'Tags', value: stats.totalTags, icon: '🏷️' },
                { label: 'Communities', value: stats.totalCommunities, icon: '👥' },
                { label: 'Positive Comments', value: stats.positiveComments, icon: '👍' },
                { label: 'Negative Comments', value: stats.negativeComments, icon: '👎' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="admin-stat-card">
                  <span className="stat-icon">{icon}</span>
                  <span className="stat-value">{value}</span>
                  <span className="stat-label">{label}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <button
                className="admin-btn success"
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
                onClick={async () => {
                  try {
                    const res = await syncGameCommunities(user.id)
                    flash(res.data.message)
                    loadTab('Dashboard')
                  } catch { flash('Failed to sync communities', true) }
                }}
              >
                🔄 Sync Games → Communities
              </button>
            </div>
          </>
        )}

        {/* GAMES */}
        {activeTab === 'Games' && (
          <div>
            <div className="admin-section-header">
              <h2>Games ({games.length})</h2>
              <button onClick={toggleGameForm}>
                {gameForm.open ? '✕ Cancel' : '+ New Game'}
              </button>
            </div>

            {gameForm.open && (
              <form className="admin-form" onSubmit={handleCreateGame} encType="multipart/form-data">
                <h3>Create Game</h3>
                <div className="admin-form-grid">
                  <div className="form-group">
                    <label>Name *</label>
                    <input name="name" required />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select name="categoryName" required>
                      <option value="">-- Select Category --</option>
                      {gameFormOptions.categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Developer *</label>
                    <input name="developer" required />
                  </div>
                  <div className="form-group">
                    <label>Publisher *</label>
                    <input name="publisher" required />
                  </div>
                  <div className="form-group">
                    <label>Rating (0–100) *</label>
                    <input name="rating" type="number" min="0" max="100" required />
                  </div>
                  <div className="form-group">
                    <label>Release Date *</label>
                    <input name="releaseDate" type="date" required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Platforms</label>
                  <div className="checkbox-group">
                    {gameFormOptions.platforms.map(p => (
                      <label key={p.id} className={`checkbox-item ${selectedPlatformIds.includes(p.id) ? 'selected' : ''}`}>
                        <input
                          type="checkbox"
                          checked={selectedPlatformIds.includes(p.id)}
                          onChange={() => togglePlatformId(p.id)}
                        />
                        {p.name}
                      </label>
                    ))}
                    {gameFormOptions.platforms.length === 0 && <span className="no-options">No platforms yet</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Tags</label>
                  <div className="checkbox-group">
                    {gameFormOptions.tags.map(t => (
                      <label key={t.id} className={`checkbox-item ${selectedTagIds.includes(t.id) ? 'selected' : ''}`}>
                        <input
                          type="checkbox"
                          checked={selectedTagIds.includes(t.id)}
                          onChange={() => toggleTagId(t.id)}
                        />
                        {t.name}
                      </label>
                    ))}
                    {gameFormOptions.tags.length === 0 && <span className="no-options">No tags yet</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea name="description" rows={3} required />
                </div>
                <div className="form-group">
                  <label>About This Game</label>
                  <textarea name="aboutThisGame" rows={4} />
                </div>
                <div className="admin-form-grid">
                  <div className="form-group">
                    <label>Main Image (file)</label>
                    <input name="mainImage" type="file" accept="image/*" />
                  </div>
                  <div className="form-group">
                    <label>Additional Images (files)</label>
                    <input name="additionalImages" type="file" accept="image/*" multiple />
                  </div>
                </div>
                <button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Game'}
                </button>
              </form>
            )}

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Name</th><th>Developer</th><th>Rating</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map(g => (
                    <tr key={g.id}>
                      <td>{g.id}</td>
                      <td>{g.name}</td>
                      <td>{g.developer}</td>
                      <td><img src="/assets/icons/star.png" alt="" className="inline-icon" /> {g.rating}</td>
                      <td>
                        <button className="admin-btn danger" onClick={() => handleDeleteGame(g.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CATEGORIES */}
        {activeTab === 'Categories' && (
          <div>
            <div className="admin-section-header">
              <h2>Categories ({categories.length})</h2>
            </div>
            <form className="admin-inline-form" onSubmit={handleCreateCategory}>
              <input
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                placeholder="New category name"
              />
              <button type="submit">+ Add</button>
            </form>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Name</th><th>Actions</th></tr></thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.name}</td>
                      <td><button className="admin-btn danger" onClick={() => handleDeleteCategory(c.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PLATFORMS */}
        {activeTab === 'Platforms' && (
          <div>
            <div className="admin-section-header">
              <h2>Platforms ({platforms.length})</h2>
            </div>
            <form className="admin-inline-form" onSubmit={handleCreatePlatform}>
              <input
                value={newPlatformName}
                onChange={e => setNewPlatformName(e.target.value)}
                placeholder="New platform name"
              />
              <button type="submit">+ Add</button>
            </form>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Name</th><th>Actions</th></tr></thead>
                <tbody>
                  {platforms.map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td><button className="admin-btn danger" onClick={() => handleDeletePlatform(p.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAGS */}
        {activeTab === 'Tags' && (
          <div>
            <div className="admin-section-header">
              <h2>Tags ({tags.length})</h2>
            </div>
            <form className="admin-inline-form" onSubmit={handleCreateTag}>
              <input
                value={newTagName}
                onChange={e => setNewTagName(e.target.value)}
                placeholder="New tag name"
              />
              <button type="submit">+ Add</button>
            </form>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Name</th><th>Actions</th></tr></thead>
                <tbody>
                  {tags.map(t => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>{t.name}</td>
                      <td><button className="admin-btn danger" onClick={() => handleDeleteTag(t.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === 'Users' && (
          <div>
            <div className="admin-section-header">
              <h2>Users ({users.length})</h2>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`admin-badge ${u.isAdmin ? 'admin' : u.isModerator ? 'moderator' : ''}`}>
                          {u.isAdmin ? <><img src="/assets/icons/star.png" alt="" className="inline-icon" /> Admin</> : u.isModerator ? '🛡️ Moderator' : 'User'}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="admin-actions">
                        {u.id !== user.id && (
                          <>
                            <button
                              className={`admin-btn ${u.isAdmin ? 'warning' : 'success'}`}
                              onClick={() => handleToggleAdmin(u.id)}
                            >
                              {u.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                            </button>
                            <button
                              className={`admin-btn ${u.isModerator ? 'warning' : 'info'}`}
                              onClick={() => handleToggleModerator(u.id)}
                            >
                              {u.isModerator ? 'Revoke Mod' : 'Make Mod'}
                            </button>
                            <button className="admin-btn danger" onClick={() => handleDeleteUser(u.id)}>
                              Delete
                            </button>
                          </>
                        )}
                        {u.id === user.id && <span style={{ color: '#999', fontSize: '0.85rem' }}>You</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
