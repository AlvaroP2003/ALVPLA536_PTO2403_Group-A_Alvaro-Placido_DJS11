import React, { useState } from "react";
import { useEpisode } from "./EpisodeContext";
import { useAudio } from "./AudioContext";

import { Pause, Play, Star } from 'lucide-react'

export default function EpisodeModal({podcast, seasonInput, episode, modalOpen, setModalOpen}) {

    const {playing, pauseAudio, playAudio, sameElement} = useAudio()
    const { isFavourite, addFavourite, removeFavourite} = useEpisode()

     const favourite = isFavourite(podcast.id, seasonInput, episode)

    
        function onFavourite() {
            if(favourite) removeFavourite(podcast.id, seasonInput , episode)
                else addFavourite(podcast, seasonInput, episode)
        }

    return (
    <>
    {modalOpen ? (<div className='modal-overlay'  onClick= {()=> {setModalOpen(false)}}></div>) : null }
                        
        {modalOpen ? (<div className= 'episode-modal'>
            <div className="modal-main">
            <img src = {podcast.seasons[seasonInput ?? 0].image} />

                <div className="content">
                <h1>{episode.title}</h1>
                <h2>Episode {episode.episode}</h2>
                <p>{episode.description}</p>
                <h3>From : {podcast.title}</h3>
                </div>

                <button className="star" onClick ={() => {onFavourite()}}>{favourite ? <Star size={40} strokeWidth={1} stroke = 'none' fill="white" /> : <Star size={40} strokeWidth={1} stroke="white"/> }</button>
            </div> 

            <div className="audio-container">
                    <div className="audio-btn">
                        <button className="play-pause-btn" onClick={() => {playing && sameElement ? pauseAudio() :  playAudio(podcast, seasonInput, episode)}}>
                        {playing && sameElement ? <Pause size={30} strokeWidth={1} fill="292929" stroke="none" /> : <Play size={30} strokeWidth={1} fill="292929" stroke="none" /> }
                        </button>
                    </div>
            </div>
        </div>
    ) : null }
        </>
    )
}