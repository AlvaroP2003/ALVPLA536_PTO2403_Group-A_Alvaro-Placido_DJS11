import React, { useState } from "react";
import { useEpisode } from "./EpisodeContext";
import { useAudio } from "./AudioContext";

export default function EpisodeModal({podcast, seasonInput, episode, modalOpen, setModalOpen}) {

    const {playing, pauseAudio, playAudio, sameElement} = useAudio()
    const { isFavourite, addFavourite, removeFavourite} = useEpisode()

     const favourite = isFavourite(podcast.id, seasonInput, episode)
    
        function onFavourite(e) {
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

                <button className="star" onClick ={() => {onFavourite(podcast.id)}}>*</button>
            </div> 

            <div className="audio-container">
                    <div className="audio-btn">
                        <button className="play-pause-btn" onClick={() => {playing ? pauseAudio() :  playAudio(podcast, seasonInput, episode)}}>
                            {playing && sameElement ? 'Pause' : 'Play'}
                        </button>
                    </div>
            </div>
        </div>
    ) : null }
        </>
    )
}