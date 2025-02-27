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
      
        if(samePodcast && sameSeason && sameEpisode) {
            setSameElement(true)
        } else setSameElement(false)

    }

    }, [podcast, seasonInput, episode, playing])

    const playAudio = (podcast, se, ep) => {

        setAudioState({
            activePodcast : podcast,
            activeSeason : se,
            activeEpisode : ep,
        })

        // PLay new cast
        if(podcast && !sameElement) {
            audioRef.current.src = podcast ? podcast.seasons[se].episodes[ep.episode -1].file : null
            audioRef.current.load()
            console.log('new cast')
        }

        audioRef.current.play()
        setPlaying(true)


        // Setting new active state for song
    }
    const pauseAudio = () => {
        if(audioRef.current) {
            console.log('pause')
            audioRef.current.pause()
            setPlaying(false)
        }
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
