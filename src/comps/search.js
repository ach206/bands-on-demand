import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by'
import { debounce } from "debounce";


let showingVenues;
class Search extends Component {
    state = {
        query: '',
        toggleIcon: 'fas fa-times fa-2x',
        drawerVis: 'drawerContainer',
        venueList: []
    }
    componentDidMount() {
        showingVenues = this.props.allLocations
        showingVenues.sort(sortBy('title'))
        this.setState({ venueList: showingVenues })
        this.filterList = debounce(this.filterList, 100);
    }

    filterList = (query) => {
        if (query) {
            // @description user typed query is compared to the list of locations 
            // and returns matching locations
            const compare = new RegExp(escapeRegExp(query), 'i')
            showingVenues = this.props.allLocations.filter((v) => compare.test(v.title) || compare.test(v.genre))
            // error handling lets user know no matches were found
            if (showingVenues.length === 0) {
                showingVenues =
                    [{ "title": "Sorry, no matches", "genre": "Sorry, no matches" }]
            }
            this.setState({ query: query, venueList: showingVenues })
            this.props.updateMarkers(showingVenues)
        } else {
            showingVenues = this.props.allLocations
            this.setState({ query: query, venueList: this.props.allLocations })
            this.props.unhideMarkers()
        }
        showingVenues.sort(sortBy('title'))

    }

    buttonClicks = (v) => {
        /* function fires when user clicks
         on the sidebar list of venues. */
        let matching = this.props.allLocations.filter((marker) => marker.id === v.id)
        /*matches evt.target.id to the id of venues from json file
        to get access to basic properities on this venue */
        this.collectActiveMarker(matching)
    }

    collectActiveMarker = (mProps) => {
        /* function passes info on to other functions
        to open the infoWindow on target venue AND display
        only the map markers that match evt.target    */
        let foundPair = this.props.markers.filter((m) => m.id === mProps[0].id)
        this.props.filterMarkers(mProps, foundPair)
        this.props.openInfoW(mProps[0], foundPair[0])
    }

    drawerAni = (e) => {
        if (e.className === "fas fa-times fa-2x") {
            this.setState({
                toggleIcon: 'fas fa-bars fa-2x',
                drawerVis: 'drawerContainer notShowing'
            })
        } else {
            this.setState({
                toggleIcon: 'fas fa-times fa-2x',
                drawerVis: 'drawerContainer'
            })
        }
    }

    render() {


        return (
            <div className={this.state.drawerVis}>
                <div className="searchContainer">

                    <div className="searchInput">
                        <input
                            id="zoom-to-area-text"
                            type="text"
                            placeholder="Search by name or music genre"
                            value={this.state.query}
                            onChange={(evt) => { this.filterList(evt.target.value) }}
                        />
                    </div>
                    <div className="searchList">
                        {this.state.venueList.map((v, index) => (
                            <button
                                key={index}
                                className='venueListItem'
                                onClick={(evt) => { this.buttonClicks(evt.target) }}
                                tabIndex='0'
                                aria-label="button"
                                id={v.id}>{v.title}</button>
                        ))}
                    </div>
                </div>
                <div className="drawer-icon">
                    <i className={this.state.toggleIcon}
                        onClick={(evt) => { this.drawerAni(evt.target) }}></i></div>
            </div>
        );
    }
}

export default Search;