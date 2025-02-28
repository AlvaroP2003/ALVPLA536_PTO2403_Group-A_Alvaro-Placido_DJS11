import React, { useMemo } from "react";

import { useState, useEffect } from "react";
import { NavLink,Link, useSearchParams } from "react-router-dom";
import { useEpisode } from "../EpisodeContext";

export default function HomePage() {
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams()
    const typeFilter = searchParams.get('type')

    const [searchValue, setSearchValue] = useState('')

    const [podcast, setPodcast] = useState([])
    const [sortedPodcast, setSortedPodcast] = useState([])
    const [sortValue, setSortValue] = useState('a-z') 

    const [genre,setGenre] = useState([])

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value)
    }

    const handleChange = (event) => {
        setSortValue(event.target.value)
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await fetch('https://podcast-api.netlify.app')
                
                if(!res.ok) {
                    throw new Error('Failed to fetch Data')
                }

                const data = await res.json()

                setPodcast(data)
                setSortedPodcast(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()

    }, [])

    useEffect(() => {
        let sorted = [...podcast];

        switch (sortValue) {
            case 'a-z':
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'z-a':
                sorted.sort((a, b) => b.title.localeCompare(a.title));
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

        setSortedPodcast(sorted);
    }, [sortValue, podcast]);


    useEffect(() => {
        const fetchGenre = async (id) => {
            try {
                setLoading(true)
                const res = await fetch(`https://podcast-api.netlify.app/genre/${id}`)

                if(!res.ok) {
                    throw new Error('Could not fetch genre data')
                }

                const data = await res.json()
                return data
        
            } catch (err) {
                console.error(err.message)
            } finally {
                setLoading(false)
            }
        }

        const fetchAllGenres = async () => {
            const genrePromise = []

            for(let i = 1 ; i <= 9 ; i++) {
                genrePromise.push(fetchGenre(i))
            }

            const results = await Promise.all(genrePromise)

            setGenre(results.filter((result) => result !== null))
        }

        fetchAllGenres()

    }, [])


    // Helper map to retrun only the shows id
    const genreShows = genre.map(item => (
        item.shows
    ))

    // Returns a new object to make rendering, filtering and sorting easier
    const podcastGenre = useMemo(() => sortedPodcast.map(podcast => {
        return {
            'id' : podcast.id,
            'title' : podcast.title,
            'image' : podcast.image,
            'genre' : genreShows
                    .map((show,index) => 
                        show.includes(podcast.id) ? genre[index].title : null
           )
           .filter(Boolean)
           .join('  ·  '),
           'seasons' : podcast.seasons
        }
    }), [sortedPodcast,genre])



    // Filter Functions 

    const filteredPodcast = useMemo(() => {
        return typeFilter
            ? podcastGenre.filter(cast => cast.genre.includes(typeFilter))
            : podcastGenre
    }, [typeFilter, podcastGenre])

    function handleFilterChange(key, value) {
        setSearchParams(prevParams => {
            if (value === null) {
                prevParams.delete(key)
            } else {
                prevParams.set(key, value)
            }
            return prevParams
        })
    }

    const searcFiltertedPodcast = useMemo(() => {
        return searchValue
            ? filteredPodcast.filter(cast => cast.title.toLowerCase().includes(searchValue.toLocaleLowerCase()))
            : filteredPodcast
    }, [searchValue, filteredPodcast])

    const displayedPodcast = searcFiltertedPodcast.length > 0 ? searcFiltertedPodcast.map(podcast => (
        <Link className="card" key={podcast.id} to={podcast.id}>
            <img src={podcast.image} alt={podcast.title}></img>
            <div className="content">
            <h1>{podcast.title}</h1>
            <h2>{podcast.genre}</h2>
            <h3>{podcast.seasons} Seasons</h3>
            </div>
        </Link>
    )) : <h1 className="status-message">No podcast match your search</h1>



    return (
        <section className="homepage__section">
            <div className="search-sort__container">

            <div className="search_container">
                    <input type="text" className="user-search"  placeholder ='Search Podcast...' onChange={handleSearchChange}></input>
                    {/* Research Levenshtein Distance Algorithm for fuzzy search matching */}
            </div>

            <select value={sortValue} onChange={handleChange} className="dropdown">
                    <option value="a-z"> A - Z</option>
                    <option value="z-a">Z - A</option>
                    <option value="new-old">Old to new</option>
                    <option value="old-new">New to old</option>
            </select>
            </div>
            

            <div className="filter-container">
                <ul>
                    <li onClick ={() => handleFilterChange('type', null)}>All</li>

                    {genre.map((item,index) => (
                        <li key = {index} value={item.title}
                            onClick={() => handleFilterChange("type", item.title)}
                        >{item.title}</li>
                    ))}
                </ul>
            </div>

        <div className="homepage-container">
        <h1>{typeFilter ? typeFilter : 'All Podcasts'}</h1>
            <div className="podcast_container">
                {loading ? <div className="loader"></div> : error ? <h1 className="status-message">{error.message}</h1> : displayedPodcast}
            </div>
        </div>
           
        </section>
    )
}