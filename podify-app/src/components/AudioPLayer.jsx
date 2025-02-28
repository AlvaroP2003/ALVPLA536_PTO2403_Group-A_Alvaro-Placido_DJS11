import { use, useEffect, useState } from "react";
import { useAudio } from "./AudioContext";
import { useEpisode } from "./EpisodeContext";
import PodcastDetail from "./Pages/PodcastDetail";

import { Pause, Play } from 'lucide-react'

export default function AudioPlayer() {
    const { audioRef, playing, pauseAudio, playAudio, audioState} = useAudio();
    const { isCompletedEpisode, addToCompleted } = useEpisode()

    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    
 
    // Code to determine wether the episode that has finished should be added to local storage or not
      const episodeExist = audioState.activePodcast && audioState.activeSeason && audioState.activeEpisode ? isCompletedEpisode(audioState.activePodcast.id, audioState.activeSeason, audioState.activeEpisode) : null

      function handleEnd(){
        if(episodeExist) return;

        addToCompleted(audioState.activePodcast, audioState.activeSeason, audioState.activeEpisode)
      }

      const handleRangeChange = (e) => {
        audioRef.current.currentTime = Number(e.target.value)
        setCurrentTime(Number(e.target.value))
      };

    useEffect(() => {
        const audio = audioRef.current
        if(!audio) return

        const updateTime = () => setCurrentTime(audio.currentTime)
        const setAudioDuration = () => setDuration(audio.duration)

        audio.addEventListener('loadedmetadata', setAudioDuration)
        audio.addEventListener('timeupdate', updateTime)
        audio.addEventListener('ended', handleEnd)

        return () => {
            audio.removeEventListener('loadedmetadata', setAudioDuration)
            audio.removeEventListener('timeupdate', updateTime)
        }
    } , [audioRef.current] )


    return audioState.activePodcast ? (
         <div className="main-audio">

            <div className="current-episode">
                <img src={audioState.activePodcast.seasons[audioState.activeSeason].image} alt="Season Cover" />
                <div className="content">
                    <h1>{audioState.activeEpisode.title}</h1>
                    <div className="season-episode_container"><p>S:{audioState.activeSeason + 1}</p><p>E:{audioState.activeEpisode.episode}</p></div>
                    <h3>{audioState.activePodcast.title}</h3>
                </div>
            </div>

            <audio ref={audioRef} id="music-bar"></audio>

            <div className="audio-container">
                <div className="audio-btn">
                    <button className="play-pause-btn" onClick={() => {playing ? pauseAudio() :  playAudio(audioState.activePodcast, audioState.activeSeason, audioState.activeEpisode)}}>
                        {playing ? <Pause size={30} strokeWidth={1} fill="black" stroke="white"/> : <Play size={30} strokeWidth={1} fill="black" stroke="white"/> }
                    </button>
                </div>

                <div className="progress-container">
                    <p className="current-time">{currentTime ? currentTime.toFixed(0) : '0'}</p>

                    <input
                        type="range"
                        className="progress-bar"
                        min = {0}
                        max = {duration}
                        value = {currentTime}
                        onChange = {handleRangeChange}
                        />

                    <p className="full-time">{duration ? duration.toFixed(0): '0'}</p>
                </div>
            </div>
        </div>
        ) : null
    }