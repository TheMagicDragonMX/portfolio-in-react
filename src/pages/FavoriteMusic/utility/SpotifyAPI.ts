import axios from "axios"

const CLIENT_ID = "777ca20501164302add21cb113e0fca5"
const CLIENT_SECRET = "81f8455023474fa2afb8fa8f18a75223"

const REFRESH_TOKEN = "AQApqZqhRn4c6uV8o_pzljxQGMuTjScqVcqXpw_sWXVPDj1DspOilD9A-SgvYsvqjJ3vo2prtDUWvjyLwMfIRu5OpcQf8b2AEeMhEXWRcsmeT2orrzVIeDAZAvFg7ACK3vE"
let token = ""

/**
 * Requests a new token to the Spotify Web API
 */
async function requestRefreshedToken () {

	const newTokenParams = new URLSearchParams({ 
		grant_type: "refresh_token",
		refresh_token: REFRESH_TOKEN
	})

	const newTokenResponse = await axios.post("https://accounts.spotify.com/api/token", newTokenParams.toString(), {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Authorization": `Basic ${ window.btoa(CLIENT_ID + ":" + CLIENT_SECRET) }`
		}
	})

	return newTokenResponse.data
}

/**
 * Makes a request to get an artist's data
 * 
 * @param artistID Spotify ID of the wanted artist
 */
async function requestArtistData (artistID: string) {
	const artistDataResponse = await axios.get(`https://api.spotify.com/v1/artists/${ artistID }`, {
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${ token }`
		}
	})

	return artistDataResponse		
}

/**
 * Retrieves the data of the given artist
 * 
 * It'll refresh the token if necessary
 * 
 * @param artistID Spotify ID of the wanted artist
 */
export async function fetchArtistData (artistID: string) {	
	let artistDataResponse = await requestArtistData(artistID)

	while (artistDataResponse.status === 401) {
		token = await requestRefreshedToken()
		artistDataResponse = await requestArtistData(artistID)
	}

	const artistData = await artistDataResponse.data as SpotifyApi.SingleArtistResponse
	return artistData
}