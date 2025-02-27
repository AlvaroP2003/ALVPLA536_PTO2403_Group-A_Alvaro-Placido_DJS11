import React from "react";
import { NavLink, Link } from "react-router-dom";


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

                    <li className="link user">
                        <p>USER</p>
                        <button className="clear-history" onClick={() => {clearHistory()}}>Reset Account</button>
                    </li>
                </ul>
            </header>
        </> 
    )
}