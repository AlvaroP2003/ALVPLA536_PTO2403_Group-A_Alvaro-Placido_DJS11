import { use, useEffect, useState } from "react";
import { useAudio } from "./AudioContext";
import { useEpisode } from "./EpisodeContext";
import PodcastDetail from "./Pages/PodcastDetail";

export default function AudioPlayer() {
    const { audioRef, playing, pauseAudio, playAudio, audioState } = useAudio();

    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    
      const handleRangeChange = (e) => {
        audioRef.current.currentTime = e.target.value
        setCurrentTime(e.target.value)
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime)
        setDuration(audioRef.current.duration)
      }

      useEffect(() => {
        if(!audioRef.current) return
        audioRef.current.addEventListener('timeupdate', handleTimeUpdate)

        return () => {
            audioRef.current.removeEventListener('timeupdate', handleTimeUpdate)
        }
      }, [])


    return audioState.activePodcast ? (
         <div className="main-audio">
            <div className="current-episode">
                <img src={audioState.activePodcast.seasons[audioState.activeSeason].image} alt="Season Cover" />
                <div className="content">
                    <h1>{audioState.activeEpisode.title}</h1>
                    <h3>{audioState.activePodcast.title}</h3>
                </div>
            </div>
            <audio ref={audioRef} id="music-bar"></audio>

            <div className="audio-container">
                <div className="audio-btn">
                    <button className="prev-btn">prev</button>
                    <button className="play-pause-btn" onClick={() => {playing ? pauseAudio() :  playAudio(audioState.activePodcast, audioState.activeSeason, audioState.activeEpisode)}}>
                        {playing ? "Pause" : "Play"}
                    </button>
                    <button className="next-btn">next</button>
                </div>

                <div className="progress-container">
                    <p className="current-time">{currentTime ? currentTime.toFixed(0) : '0'}</p>

                    <input
                        type="range"
                        className="progress-bar"
                        min = {0}
                        max = {duration.toString()}
                        value = {currentTime}
                        onChange = {(e) => {
                            handleRangeChange(e)}
                        }
                        />
                    <p className="full-time">{duration ? duration.toFixed(0): '0'}</p>
                </div>
            </div>
        </div>
        ) : null
    }