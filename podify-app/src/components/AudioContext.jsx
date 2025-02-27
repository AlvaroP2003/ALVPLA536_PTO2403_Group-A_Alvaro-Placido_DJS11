import { createContext, useContext, useEffect, useRef, useState } from "react";

import { useEpisode } from "./EpisodeContext";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const audioRef = useRef(new Audio());
    const [playing, setPlaying] = useState(false);

    const { podcast, seasonInput, episode  } = useEpisode()

    const [audioState, setAudioState] = useState({
        activePodcast : null,
        activeSeason : null,
        activeEpisode : null,
    })

    const [sameElement,setSameElement] = useState(false)
 
    // Hook to monitor if the active element (podcast that is playing) matches the element the user is viewing
    useEffect(() => {
        if(audioState.activePodcast) {
            const samePodcast = audioState.activePodcast.id === podcast.id
            const sameSeason = audioState.activeSeason === seasonInput
            const sameEpisode = audioState.activeEpisode.episode === episode.episode
      
        setSameElement(samePodcast && sameSeason && sameEpisode)
    }

    }, [podcast, seasonInput, episode, playing])


    const playAudio = (podcast, se, ep) => {

        // Play new cast
        if(podcast && se >= 0 && ep && !sameElement) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0

            audioRef.current.src = podcast ? podcast.seasons[se].episodes[ep.episode -1].file : null
            audioRef.current.load()
            console.log('new cast')

            audioRef.current.play()
            setPlaying(true)
        }

        setAudioState({
            activePodcast : podcast,
            activeSeason : se,
            activeEpisode : ep,
        })
    }

    const pauseAudio = () => {
            console.log('pause')
            audioRef.current.pause()
            setPlaying(false)
    }
    

    return (
        <AudioContext.Provider value={{
            pauseAudio,
            playAudio,
            audioRef,
            playing,
            setPlaying,
            audioState,
            sameElement,
            }}>

            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => useContext(AudioContext);

// Fix play and pause button/
