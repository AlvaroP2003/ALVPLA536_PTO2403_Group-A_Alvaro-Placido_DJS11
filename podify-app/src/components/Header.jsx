import React from "react";
import { NavLink, Link } from "react-router-dom";
import { CircleUserRound } from 'lucide-react'


export default function Header() {
    const activeStyles = {
        fontWeight: "normal",
        color: "var(--accent-main)",
    }

    const clearHistory = () => {
        localStorage.clear()
    }

    return (
        <>
            <header>
                <img className="header-logo" src='#'></img>

                <ul className="navbar">
                    <NavLink className='link ' to='/'
                        style={({ isActive }) => isActive ? activeStyles : null}>
                        HOME
                    </NavLink>

                    <NavLink className="link" to='favourites'
                        style={({ isActive }) => isActive ? activeStyles : null}>
                        FAVOURTIES
                    </NavLink>
                </ul>

                <div className="link user">
                        <p><CircleUserRound size={40} strokeWidth={1} /></p>
                        <button className="delete-btn clear-history" onClick={() => {clearHistory()}}>Reset Account</button>
                </div>


            </header>
        </> 
    )
}