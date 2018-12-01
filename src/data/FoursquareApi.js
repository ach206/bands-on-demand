const CLIENT_ID = 'NLLRCVGJ4BHIN4NUPHFUGV5ENQJTDSTBEW0HQYL0XBYETIPY';
const CLIENT_SECRET = 'VYS1IKENWOYN451CYZV20HN1KHO1PBUM1UA3M1SG2O33QTAK';

const apiPrefix = `https://api.foursquare.com/v2/venues/`
const searchEndpoint = `search?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180323&limit=1`;
const detailsEndpoint = `?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180323&limit=1`

const headers = {}


export const search = (lat, long, query) => {
    fetch(`${apiPrefix}${searchEndpoint}&ll=${lat},${long}&query=${query}`, {
        method: 'GET',
        headers
    })
        .then(res => res.json())

}



export const extendedDetails = (id) =>
    fetch(`${apiPrefix}${id}${detailsEndpoint}`, {
        method: 'GET',
        headers
    })
        .then(res => res.json())
        .then(res => res)

