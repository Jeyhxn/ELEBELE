import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTopRatedGames, getMostPositiveGames, getCommentsByGame } from '../api'
import { useFavorites } from '../context/FavoriteContext'

function getImageUrl(imageURL, gameName) {
  if (!imageURL) return getPlaceholder(gameName)
  if (imageURL.startsWith('http')) return imageURL
  return `https://localhost:7271/images/${imageURL}`
}

function getPlaceholder(name) {
  const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E2']
  const color = colors[(name?.charCodeAt(0) ?? 0) % colors.length]
  return `https://via.placeholder.com/600x340/${color}/FFFFFF?text=${encodeURIComponent(name || 'Game')}`
}

function CommunityRecommends({ games }) {
  const [idx, setIdx] = useState(0)
  const [reviews, setReviews] = useState({})
  const navigate = useNavigate()
  const timerRef = useRef(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (!games.length) return
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % games.length), 6000)
  }, [games.length])

  useEffect(() => {
    if (!games.length) return
    games.forEach(game => {
      getCommentsByGame(game.id)
        .then(res => {
          const positive = res.data.filter(c => c.isPositive)
          const pick = positive[0] || res.data[0]
          if (pick) setReviews(prev => ({ ...prev, [game.id]: pick }))
        })
        .catch(() => {})
    })
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [games, startTimer])

  const go = useCallback((newIdx) => {
    setIdx(newIdx)
    startTimer()
  }, [startTimer])

  const scrollToDiscover = useCallback(() => {
    const target =
      document.getElementById('discover-filters') ||
      document.querySelector('.filter-sidebar') ||
      document.querySelector('.home-layout')

    if (!target) return false

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return true
  }, [])

  const handleExploreClick = useCallback(() => {
    if (scrollToDiscover()) return

    navigate('/')
    window.setTimeout(() => {
      scrollToDiscover()
    }, 160)
  }, [navigate, scrollToDiscover])

  if (!games.length) return null

  const game = games[idx]
  const review = reviews[game.id]

  return (
    <div className="cr-wrap">
      <div className="cr-header">
        <div>
          <div className="cr-title">THE COMMUNITY RECOMMENDS</div>
          <div className="cr-subtitle">THESE GAMES TODAY</div>
        </div>
        <button type="button" className="cr-explore-btn" onClick={handleExploreClick}>
          CUSTOMIZE, EXPLORE BY TAG, &amp; MORE
        </button>
      </div>

      <div className="cr-carousel">
        <button className="cr-nav" onClick={() => go((idx - 1 + games.length) % games.length)}>‹</button>

        <div className="cr-slide" onClick={() => navigate(`/game/${game.id}`)}>
          <div className="cr-image">
            <img
              src={getImageUrl(game.imageURL, game.name)}
              alt={game.name}
              onError={e => { e.target.src = getPlaceholder(game.name) }}
            />
          </div>
          <div className="cr-review">
            {review ? (
              <>
                <p className="cr-quote">"{review.content}"</p>
                <div className="cr-reviewer">
                  <span className="cr-reviewer-avatar">
                    {review.username?.charAt(0).toUpperCase()}
                  </span>
                  <div className="cr-reviewer-info">
                    <span className="cr-reviewer-name">{review.username}</span>
                    <span className="cr-reviewer-sub">
                      {review.isPositive ? 'Recommended' : 'Reviewed'} this game
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="cr-quote cr-no-review">
                Highly recommended by the community
              </p>
            )}
          </div>
        </div>

        <button className="cr-nav" onClick={() => go((idx + 1) % games.length)}>›</button>
      </div>

      <div className="cr-dots">
        {games.map((_, i) => (
          <button key={i} className={`cr-dot${i === idx ? ' active' : ''}`} onClick={() => go(i)} />
        ))}
      </div>
    </div>
  )
}

function GameRow({ title, icon, games }) {
  const navigate = useNavigate()
  const { toggleFavorite, isFavorite } = useFavorites()

  const handleFavoriteClick = (game, e) => {
    e.stopPropagation()
    toggleFavorite(game)
  }

  if (!games.length) return null

  return (
    <div className="featured-section">
      <h2>{icon} {title}</h2>
      <div className="featured-scroll">
        {games.map(game => {
          const fav = isFavorite(game.id)

          return (
            <div
              key={game.id}
              className="featured-card"
              onClick={() => navigate(`/game/${game.id}`)}
            >
              <button
                type="button"
                className={`fc-wishlist ${fav ? 'active' : ''}`}
                onClick={e => handleFavoriteClick(game, e)}
                title={fav ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-label={fav ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <img src="/assets/icons/heart.png" alt="" className="fc-wishlist-icon" />
              </button>
              <div className="fc-img">
                <img
                  src={getImageUrl(game.imageURL, game.name)}
                  alt={game.name}
                  onError={e => { e.target.src = getPlaceholder(game.name) }}
                />
              </div>
              <div className="fc-content">
                <div className="fc-top">
                  <h4>{game.name}</h4>
                </div>
                <div className="fc-tags">
                  {game.category?.name && <span className="fc-tag">{game.category.name}</span>}
                </div>
                <span className="fc-date">
                  {game.releaseDate ? new Date(game.releaseDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : 'Coming Soon'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CommunityRecommendsSkeleton() {
  return (
    <div className="cr-wrap cr-skeleton-wrap">
      <div className="cr-header">
        <div>
          <div className="cr-title">THE COMMUNITY RECOMMENDS</div>
          <div className="cr-subtitle">THESE GAMES TODAY</div>
        </div>
        <button type="button" className="cr-explore-btn" disabled>
          CUSTOMIZE, EXPLORE BY TAG, &amp; MORE
        </button>
      </div>
      <div className="cr-carousel">
        <button className="cr-nav" disabled>‹</button>
        <div className="cr-slide cr-slide-skeleton">
          <div className="cr-image cr-skeleton-block"></div>
          <div className="cr-review">
            <span className="cr-skeleton-line long"></span>
            <span className="cr-skeleton-line mid"></span>
            <span className="cr-skeleton-line short"></span>
            <div className="cr-reviewer">
              <span className="cr-reviewer-avatar"> </span>
              <div className="cr-reviewer-info">
                <span className="cr-skeleton-line tiny"></span>
                <span className="cr-skeleton-line tiny short"></span>
              </div>
            </div>
          </div>
        </div>
        <button className="cr-nav" disabled>›</button>
      </div>
      <div className="cr-dots">
        <button className="cr-dot active" disabled />
        <button className="cr-dot" disabled />
        <button className="cr-dot" disabled />
      </div>
    </div>
  )
}

function GameRowSkeleton({ title }) {
  return (
    <div className="featured-section">
      <h2>{title}</h2>
      <div className="featured-scroll">
        {[1, 2].map(i => (
          <div key={`featured-skeleton-${title}-${i}`} className="featured-card featured-card-skeleton">
            <div className="fc-img cr-skeleton-block"></div>
            <div className="fc-content">
              <span className="cr-skeleton-line mid"></span>
              <span className="cr-skeleton-line short"></span>
              <span className="cr-skeleton-line tiny"></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function FeaturedSections() {
  const [topRated, setTopRated] = useState([])
  const [mostPositive, setMostPositive] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getTopRatedGames(10), getMostPositiveGames(10)])
      .then(([ratedRes, positiveRes]) => {
        setTopRated(ratedRes.data)
        setMostPositive(positiveRes.data)
      })
      .catch(err => console.error('Failed to load featured:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="featured-sections">
      {loading ? (
        <>
          <CommunityRecommendsSkeleton />
          <GameRowSkeleton title="Top Rated Games" />
          <GameRowSkeleton title="Most Loved by Community" />
        </>
      ) : (
        <>
          <CommunityRecommends games={mostPositive.slice(0, 6)} />
          <GameRow title="Top Rated Games" games={topRated} />
          <GameRow title="Most Loved by Community" games={mostPositive} />
        </>
      )}
    </div>
  )
}
