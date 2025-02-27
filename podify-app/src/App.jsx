import React, { useEffect } from 'react'
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from  'react-router-dom'

import MainLayout from './components/MainLayout'
import FavouritesPage from './components/Pages/FavouritesPage'
import HomePage from './components/Pages/HomePage'
import PodcastDetail from './components/Pages/PodcastDetail'
import { EpisodeProvider } from './components/EpisodeContext'
import { AudioProvider } from './components/AudioContext'
import AudioPlayer from './components/AudioPLayer'

function App() {

  return (
    <>
      <EpisodeProvider>
        <AudioProvider>
        <BrowserRouter>
            <Routes>
              <Route path = '/' element = {<MainLayout/>} >
                <Route index element = {<HomePage/>}></Route>
                <Route path = 'favourites' element = {<FavouritesPage/>}></Route>
              </Route>
              <Route path = '/:id' element = {<PodcastDetail/>}></Route>
            </Routes>
          </BrowserRouter>
          <AudioPlayer/>
        </AudioProvider>
      </EpisodeProvider>
    </>
  )
}

export default App
