import React, { FunctionComponent } from "react";
import SwitchTheme from "./SwitchTheme";

const Navbar: React.FC = () => {
    return (
        <div className="navbar bg-base-100">
            <a className="btn btn-ghost normal-case text-xl">daisyUI</a>
            <SwitchTheme className="flex"/>
        </div>
    )
}

export default Navbar;

