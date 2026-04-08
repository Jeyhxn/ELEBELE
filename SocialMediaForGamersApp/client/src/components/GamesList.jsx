import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getGames } from '../api'

export default function GamesList({ filters = {} }) {
  const navigate = useNavigate()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageErrors, setImageErrors] = useState({})

  useEffect(() => {
    fetchGames()
  }, [filters])

  const fetchGames = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getGames(1, 20, filters)
      setGames(response.data)
    } catch (err) {
      console.error('Full error:', err)
      const errorMsg = err.response?.data?.message || err.message || 'Unknown error'
      setError('Failed to load games: ' + errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (imageURL, gameName) => {
    if (!imageURL) {
      console.log(`No imageURL for ${gameName}, using placeholder`)
      return getPlaceholderImage(gameName)
    }

    if (imageURL.startsWith('http')) {
      console.log(`Full URL for ${gameName}:`, imageURL)
      return imageURL
    }

    const fullUrl = `https://localhost:7271/images/${imageURL}`
    console.log(`Constructed URL for ${gameName}:`, fullUrl)
    return fullUrl
  }

  const getPlaceholderImage = (gameName) => {
    const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E2']
    const hash = gameName.charCodeAt(0)
    const color = colors[hash % colors.length]
    return `https://via.placeholder.com/300x400/` + color + `/FFFFFF?text=` + encodeURIComponent(gameName)
  }

  const handleImageError = (gameId, gameName, attemptedUrl) => {
    console.error(`❌ Image failed to load for ${gameName}`)
    console.error(`   Attempted URL: ${attemptedUrl}`)
    setImageErrors(prev => ({
      ...prev,
      [gameId]: true
    }))
  }

  return (
    <div className="games-list-shell">
      {loading ? (
        <div className="steam-list steam-list-skeleton" aria-hidden="true">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={`steam-skeleton-${i}`} className="steam-row steam-row-skeleton">
              <div className="steam-row-img steam-skeleton-block"></div>
              <div className="steam-row-body">
                <span className="steam-skeleton-line lg"></span>
                <span className="steam-skeleton-line md"></span>
                <span className="steam-skeleton-line sm"></span>
              </div>
              <div className="steam-row-meta">
                <span className="steam-skeleton-line tiny"></span>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : games.length === 0 ? (
        <div className="games-empty">
          <p>No games found. Create one to get started!</p>
        </div>
      ) : (
        <div className="steam-list">
          {games.map(game => {
            const imageUrl = getImageUrl(game.imageURL, game.name)
            const hasFailed = imageErrors[game.id]
            const platforms = game.gamePlatforms?.map(gp => gp.platform?.name).filter(Boolean) || []
            const tags = game.gameTags?.map(gt => gt.tag?.name).filter(Boolean) || []

            return (
              <div
                key={game.id}
                className="steam-row"
                onClick={() => navigate(`/game/${game.id}`)}
              >
                <div className="steam-row-img">
                  <img
                    src={hasFailed ? getPlaceholderImage(game.name) : imageUrl}
                    alt={game.name}
                    onError={(e) => {
                      if (!hasFailed) {
                        handleImageError(game.id, game.name, imageUrl)
                        e.target.src = getPlaceholderImage(game.name)
                      }
                    }}
                  />
                </div>
                <div className="steam-row-body">
                  <h3 className="steam-row-title">{game.name}</h3>
                  <div className="steam-row-tags">
                    {game.category?.name && <span className="steam-tag">{game.category.name}</span>}
                    {tags.slice(0, 3).map(t => <span key={t} className="steam-tag">{t}</span>)}
                  </div>
                  {platforms.length > 0 && (
                    <div className="steam-row-platforms">
                      {platforms.map(p => <span key={p} className="steam-platform">{p}</span>)}
                    </div>
                  )}
                </div>
                <div className="steam-row-meta">
                  <span className="steam-row-date">
                    {game.releaseDate
                      ? new Date(game.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                      : 'Coming Soon'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
