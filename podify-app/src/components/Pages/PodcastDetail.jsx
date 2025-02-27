import {React, useRef} from "react";

import { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom'
import AudioPlayer from "../AudioPLayer";
import { useAudio } from "../AudioContext";
import { useEpisode } from "../EpisodeContext";
import EpisodeModal from "../EpisodeModal";


export default function PodcastDetail() {
    const {id} = useParams()
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(null)

    const [modalOpen, setModalOpen] = useState(false)

    const {podcast, setPodcast, season, setSeason, episode, setEpisode, seasonInput, setSeasonInput} = useEpisode() // Episode Context

    const handleChange = (event) => {
        setSeasonInput(Number(event.target.value))
    }

     useEffect(() => {
            async function fetchPodcast() {
                setLoading(true)
                try {
                    const res = await fetch(`https://podcast-api.netlify.app/id/${id}`)
                    if(!res.ok) {
                        throw new Error("Could not get data")
                    }
    
                    const data = await res.json()
                    setPodcast(data)
                    setSeason(data.seasons)
                    setSeasonInput(0)

                } catch(err) {
                    console.error('Error', err)
                    setError(err.message)
    
                } finally {
                    setLoading(false)
                }
            }
    
            fetchPodcast()
        }, [])


        const totalEpisodes = season.map(season => (
           season.episodes.length
        ))

        const sumEpisodes = totalEpisodes.reduce((acc, num) => acc + num, 0);

        if(loading) return <h1>Loading...</h1>

        return (
            <>
                 <section
                    className="podcast-detail"
                    style = {{
                        backgroundImage: podcast ? `url(${podcast.image})` : 'none'
                    }}
                    >
                    <main>
                    <Link className="back-btn" to = '/.'> Back </Link>
    
                        <h1>{podcast.title}</h1>
                        <h3>{podcast.genres?.join(", ")}</h3>
    
                        <div className="main-content">
                            <img src={podcast.image}></img>
                            <div className="side-content">
                                <h3>{season ? `${season.length} Seasons ${sumEpisodes} Episodes` : 0} </h3>
                                <p>{podcast.description}</p>
                            </div>
                        </div>
    
                        <p>Last Updated : {podcast.updated ? podcast.updated.slice(0, 10) : null}</p> // Returns null!
                    </main>
    
                    <div className="seasons-episodes__section"> 
                        <div>
                            <select id="options" value={seasonInput} onChange={handleChange}>
                            {season && season.length > 0 ? (
                                season.map((season, index) => (
                                    <option key={index} value={index}>
                                        Season {season.season}
                                    </option>
                                ))
                            ) : null }
                            </select>
                            <h2>
                               {season && season.length > 0 ? season[seasonInput].episodes.length : 0} Episodes
                            </h2>
                        </div>

                        <div className="episode_container">

                           {season && season.length > 0 ? (
                            season[seasonInput].episodes.map((episode,index) => (

                            <div
                                key={index}
                                className="card"
                                onClick={() => {
                                    setModalOpen(true)
                                    setEpisode(episode ? episode : null)
                                }}
                                >
                                <img src ={season[seasonInput].image}/>
                                <div className="content">
                                    <h1 className="card-title">{episode.title}</h1>
                                    <h2 className="card-episode">Episode {episode.episode}</h2>
                                    <p className="card-description">{episode.description}</p>
                                </div>
                            </div>

                           ))) : null}

                        </div>

                    </div>

                    {podcast && seasonInput !== null && episode ? (
                         <EpisodeModal 
                            podcast = {podcast}
                            seasonInput = {seasonInput}
                            episode = {episode}
                            modalOpen = {modalOpen}
                            setModalOpen = {setModalOpen}
                     />
                    ) : null} 
                   

                </section>
            </>
        )
    }


    // .play() function is interupted by .load() function !!!