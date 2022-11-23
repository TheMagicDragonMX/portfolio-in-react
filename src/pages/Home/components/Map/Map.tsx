import React from "react"
import "./Map.scss"

import { MapBackground } from "./MapBackground"

const Map : React.FC = () => {
	return <>
		<div className="map">
			<MapBackground />

			<div className="test">Hey!</div>
		</div>
	</>
}

export default Map