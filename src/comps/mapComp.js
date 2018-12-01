import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow } from 'google-maps-react';
import mapStyles from '../data/mapstyles.json';
import Search from './search';
import * as FoursquareApi from '../data/FoursquareApi'


const __API_KEY__ = "AIzaSyAVJX-nedXRZCvCQiScRwO-RNsZyeepD7E";
class mapComp extends Component {
    state = {
        map: null,
        markers: [],
        markerData: [],
        showInfoWindow: false,
        selectedMarker: {},
        selectedMarkerProps: [],
        infoWindowPic: null
    }
    //once react is loaded initialize
    initMap = (props, map) => {
        this.setState({ map });
        this.placeMarkers(this.props.allLocations)
        this.mapError();
    }

    mapError() {
        window.gm_authFailure = () => {
            alert('Unfortunately, Google Maps is unable to load at the moment. Please check your internet connection and try again.')
        };
    }
    //    @description places marker on map by coordinates
    //    and returns data about each marker
    placeMarkers = (venues) => {
        if (!venues) {
            return;
        }
        this.state.markers.map((m) => m.setMap(null));

        let markerData = [];
        let markers = venues.map((location, index) => {
            //for each marker make an object of data
            let markerProps = {
                key: index,
                index: index,
                title: location.title,
                position: location.location,
                id: location.id
            };
            markerData.push(markerProps);
            let animation = this.props.google.maps.Animation.DROP;
            let marker = new this.props.google.maps.Marker({
                position: location.location,
                map: this.state.map,
                id: markerProps.id,
                animation
            });
            marker.addListener('click', () => {
                /*when individual marker clicked will pass
                    marker properties and marker evt data to function */
                this.getEventData(markerProps, marker);
            });
            return marker;
        }) // close markers

        this.setState({ markers: markers, markerData: markerData });
    }

    filterMarkers = (properties, marker) => {
        this.setState({ selectedMarker: marker, selectedMarkerProps: properties })
        this.removeMarkers(properties[0])
    }

    removeMarkers = (p) => {
        let fMarks = this.state.markers.filter((m) => m.id !== p.id)
        fMarks.map((fMarker) =>
            (fMarker.map = (fMarker.setMap(null))));
    }

    getEventData = (properties, marker) => {
        /* @description gets event data from marker and collects properties from
         selected venue then sends param to Foursquare API */
        let prefix = '';
        let suffix = '';
        let size = '';
        let photoURL = '';

        this.setState({
            selectedMarker: marker, selectedMarkerProps: properties,
            infoWindowPic: null
        })
        marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
        FoursquareApi.extendedDetails(properties.id).then((res) => {
            if (res.meta.code === 200) {
                prefix = res.response.venue.bestPhoto.prefix
                suffix = res.response.venue.bestPhoto.suffix
                size = `cap200`
                photoURL = `${prefix}${size}${suffix}`
                this.setState({ showInfoWindow: true, infoWindowPic: photoURL })
                return photoURL
            } else {
                return alert(res.meta.errorDetail);
            }
        })
    }

    closeInfoWindow = () => {
        this.unhideMarkers();
    }

    // @resets markers back on map
    unhideMarkers = () => {
        let venues = this.props.allLocations
        this.placeMarkers(venues)
        //error handling will only fire if marker was selected by user
        if (Object.keys(this.state.selectedMarker).length !== 0) {
            this.state.selectedMarker.setAnimation(null);
        }
    }

    render() {

        const cssStyle = {
            width: '100%',
            height: '100%'
        }

        return (
            <Map role="application"
                aria-label="map"
                onReady={this.initMap}
                initialCenter={{
                    lat: this.props.lat,
                    lng: this.props.long
                }}
                zoom={this.props.zoom}
                style={cssStyle}
                google={this.props.google}
                styles={mapStyles} >
                <Search {...this.props} {...this.state}
                    openInfoW={this.getEventData} filterMarkers={this.filterMarkers} updateMarkers={this.placeMarkers}
                    unhideMarkers={this.unhideMarkers}
                />
                <InfoWindow
                    marker={this.state.selectedMarker}
                    visible={this.state.showInfoWindow}
                    onClose={this.closeInfoWindow}
                >
                    <div className="infoWindowStyles">
                        <h3>{this.state.selectedMarkerProps.title}</h3>
                        <figure>
                            <img src={this.state.infoWindowPic}
                                alt={this.state.selectedMarkerProps.title} />
                            <figcaption>Photo courtesy of Foursquare API</figcaption>
                        </figure>
                    </div>
                </InfoWindow>
            </Map>
        )
    }
}

export default GoogleApiWrapper({ apiKey: __API_KEY__ })(mapComp);