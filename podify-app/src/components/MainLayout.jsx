import React from "react";
import { Outlet, Link , NavLink} from "react-router-dom";

import Header from "./Header";
import AudioPlayer from "./AudioPLayer";


export default function MainLayout() {
    return (
        <>
        <Header/>
        <Outlet/>
        </>
    )
}