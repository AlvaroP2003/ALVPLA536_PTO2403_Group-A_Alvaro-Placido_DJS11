import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAudio } from "./AudioContext";

const EpisodeContext = createContext()

export const EpisodeProvider = ({children}) => {
    const [podcast, setPodcast] = useState([])
    const [season, setSeason] = useState([])
    const [seasonInput, setSeasonInput] = useState(0)
    const [episode, setEpisode] = useState(null)

    const [favourite, setFavourite] = useState([])
    const [episodeFinished , setEpisodeFinished] = useState([])


    useEffect(() => {
        const storedFavs = localStorage.getItem('favourites')
        if(storedFavs) setFavourite(JSON.parse(storedFavs))

        const storedEpisodes = localStorage.getItem('completed_episodes')
        if(storedEpisodes) setEpisodeFinished(JSON.parse(storedEpisodes))

    },[])

    useEffect(() => {
        localStorage.setItem('favourites', JSON.stringify(favourite))

    }, [favourite])


    useEffect(() => {
        localStorage.setItem('completed_episodes', JSON.stringify(episodeFinished))

    }, [episodeFinished])


    // Episode Finished Function
    const addToCompleted = (podcast, se, ep) => {
        const item = {
            'podcast' : podcast,
            'title' : podcast.title,
            'season' : se,
            'image' : podcast.seasons[seasonInput].image,
            'episode' : ep,
            'date' : new Date().toLocaleString(),
            'updated' : podcast.updated
        }

        setEpisodeFinished(prev => [...prev, item])
        console.log('Finished episode added')
    }

    const isCompletedEpisode = (castId, se, ep) => {
        return episodeFinished.some(item =>
            item.podcast.id === castId &&
            item.season === se &&
            item.episode.episode === ep.episode
        )
    }

    // Favourites Function
    const addFavourite = (podcast, se, ep) => {
        const item  = {
            'podcast' : podcast,
            'title' : podcast.title,
            'season' : se,
            'image' : podcast.seasons[seasonInput].image,
            'episode' : ep,
            'date' : new Date().toLocaleString(),
            'updated' : podcast.updated
        }

        setFavourite(prev => [...prev, item])
        console.log('added!')
    }

    const removeFavourite = (podcast, se , ep) => {
        setFavourite(prev => 
            prev.filter(item => 
            !(item.id === podcast.id && item.season === se && item.episode.episode === ep.episode)
          )
        );
        console.log('removed')      
    }

    const isFavourite = (castId, se, ep) => {
        return favourite.some(item =>
            item.podcast.id === castId &&
            item.season === se &&
            item.episode.episode === ep.episode
        )
    }

    return (
        <EpisodeContext.Provider
        value={{
            podcast,
            episode, setEpisode, 
            season, setSeason,
            podcast, setPodcast,
            seasonInput, setSeasonInput,
            favourite, setFavourite,
            addFavourite,
            removeFavourite,
            isFavourite,
            addToCompleted,
            isCompletedEpisode,
            }} >
            {children}
        </EpisodeContext.Provider>
    )
}


export const useEpisode = () => useContext(EpisodeContext)