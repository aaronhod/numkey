import React from "react";
import SwitchTheme from "./SwitchTheme";

const Navbar: React.FC = () => {
    return (
        <div className="navbar bg-base-100 flex flex-row">
            <a className="btn btn-ghost normal-case text-xl">daisyUI</a>

            <div className="ml-auto">
                <SwitchTheme/>
            </div>
        </div>
    )
}

export default Navbar;

