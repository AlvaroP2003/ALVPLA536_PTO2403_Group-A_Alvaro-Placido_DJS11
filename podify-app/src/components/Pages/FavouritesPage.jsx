import React, { useState, useEffect } from "react";
import { useEpisode } from "../EpisodeContext";
import {Link} from 'react-router-dom'
import EpisodeModal from "../EpisodeModal";

export default function FavouritesPage() {
    const { favourite, setFavourite, removeFavourite,episode, setEpisode, podcast, setPodcast, seasonInput, setSeasonInput } = useEpisode()
    const [sortValue, setSortValue] = useState('a-z')
    const [modalOpen, setModalOpen] = useState(false)


    const favouriteItems =
        favourite.map((item,index) => (

            <div key = {index} className="card" onClick={() => {
                        setModalOpen(true)
                        setPodcast(item.podcast)
                        setSeasonInput(item.season)
                        setEpisode(item.episode)
                    }
                }>
                <div>
                    <img src = {item.image}></img>

                    <div className="content">
                        <h1>{item.episode.title}</h1>
                        <h2>{item.title}</h2>
                        <h3>{`S:${item.season + 1} E:${item.episode.episode}`}</h3>
                    </div>
                </div>
                
                <div>
                    <div className="date-added__section">
                        <h3>Date Added</h3>
                        <p>{item.date}</p>
                    </div>
                </div>
               
            </div>
            
        ));

    function deleteFavourite(itemId, se, ep) {
        setFavourite(prev => prev.filter(item => !(item.id === itemId && item.season === se && item.episode.episode === ep)))
    }
    

    function clearFavourites() {
        setFavourite([])
    }

      useEffect(() => {
            let sorted = [...favourite];
    
            switch (sortValue) {
                case 'a-z':
                    sorted.sort((a, b) => a.episode.title.localeCompare(b.episode.title));
                    break;
                case 'z-a':
                    sorted.sort((a, b) => b.episode.title.localeCompare(a.episode.stitle));
                    break;
                case 'old-new':
                    sorted.sort((a, b) => new Date(b.updated) - new Date(a.updated));
                    break;
                case 'new-old':
                    sorted.sort((a, b) => new Date(a.updated) - new Date(b.updated));
                    break;
                default:
                    break;
            }
    
            setFavourite(sorted);
        }, [sortValue]);
        
    const handleChange = (event) => {
        setSortValue(event.target.value)
    }

    return (
        <section className="favourites-section">
            <div className='favourites-header'>
                <div>
                    <h1>Your Favourites</h1>
                    <button className="delete-btn" onClick={() => {clearFavourites()}}>Clear Favourites</button>
                </div>

                <select value={sortValue} onChange={handleChange} className="dropdown">
                        <option value="a-z"> A - Z</option>
                        <option value="z-a">Z - A</option>
                        <option value="new-old">Old to new</option>
                        <option value="old-new">New to old</option>
                </select>
            </div>
            
            {favourite && favourite.length !== 0 ? favouriteItems : <h1 className="status-message">No Favourites Yet</h1> }

             {podcast ? (
                <EpisodeModal 
                   podcast = {podcast}
                    seasonInput = {seasonInput}
                    episode = {episode}
                    modalOpen = {modalOpen}
                    setModalOpen = {setModalOpen}
                />
            ) : null} 

        </section>
    );
}


// SeasonInput is not being read

