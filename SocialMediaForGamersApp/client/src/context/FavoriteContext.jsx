import { createContext, useContext, useEffect, useState } from 'react'

const FavoriteContext = createContext()

function normalizeId(value) {
  if (value === null || value === undefined) return value
  const parsed = Number(value)
  return Number.isNaN(parsed) ? value : parsed
}

function toIdKey(value) {
  return String(normalizeId(value))
}

function normalizeGame(game) {
  if (!game || game.id === undefined || game.id === null) return game
  return { ...game, id: normalizeId(game.id) }
}

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('gameFavorites')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return Array.isArray(parsed) ? parsed.map(normalizeGame) : []
      } catch (err) {
        console.error('Failed to parse favorites from localStorage:', err)
      }
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem('gameFavorites', JSON.stringify(favorites))
  }, [favorites])

  const addFavorite = (game) => {
    setFavorites(prev => {
      const normalized = normalizeGame(game)
      if (!normalized) return prev
      if (!prev.find(g => toIdKey(g.id) === toIdKey(normalized.id))) {
        return [...prev, normalized]
      }
      return prev
    })
  }

  const removeFavorite = (gameId) => {
    setFavorites(prev => prev.filter(g => toIdKey(g.id) !== toIdKey(gameId)))
  }

  const isFavorite = (gameId) => {
    return favorites.some(g => toIdKey(g.id) === toIdKey(gameId))
  }

  const toggleFavorite = (game) => {
    const normalized = normalizeGame(game)
    if (!normalized) return

    if (isFavorite(normalized.id)) {
      removeFavorite(normalized.id)
    } else {
      addFavorite(normalized)
    }
  }

  return (
    <FavoriteContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoriteContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoriteProvider')
  }
  return context
}
