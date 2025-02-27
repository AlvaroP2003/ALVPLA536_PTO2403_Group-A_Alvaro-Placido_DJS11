import React from "react";
import { NavLink, Link } from "react-router-dom";


export default function Header() {
    const activeStyles = {
        fontWeight: "normal",
        color: "var(--accent-main)",
    }

    return (
        <>
            <header>
                <img className="header-logo" src='#'></img>

                <ul className="navbar">
                    <NavLink className='link ' to='/'
                    style={({ isActive }) => isActive ? activeStyles : null}>
                    <li>HOME</li></NavLink>
                    <NavLink className="link" to='favourites'
                    style={({ isActive }) => isActive ? activeStyles : null}>
                    <li>FAVOURTIES</li></NavLink>
                </ul>
            </header>
        </> 
    )
}