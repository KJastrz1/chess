import { IGameResponse } from '@/types'
import React from 'react'

const RewindGame = (game:IGameResponse) => {
    const { id: gameId } = useParams<{ id: string }>();
    
  return (
    <div>
      
    </div>
  )
}

export default RewindGame
