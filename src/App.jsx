import React, {Component} from "react";
import Navigation from "./components/Navigation";

/**
 * The idea is the same as that I had before.
 * I will create a launcher that is able to continue the download and unpack (if unsuccessful).
 *
 * This has to be done with the main and the renderer.
 */
export default class App extends Component {
    render() {


        return (
            <>
                <Navigation />
                <h1>Hello World</h1>
            </>
        )
    }
}