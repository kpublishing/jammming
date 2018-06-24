import React,{Component} from 'react';
import './SearchBar.css';

class SearchBar extends Component {

    constructor(props) {
        super(props);
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }
    render() {
        return ( 
            <div className="SearchBar">
                <input onChange={this.handleTermChange} placeholder="Enter A Song, Album, or Artist" />
                <a onClick={this.handleTermChange}>SEARCH</a>
            </div>
        );
    }


    search(term) {
        if (term) 
          this.props.onSearch(term);
    }

    handleTermChange(event) { 
        this.search(event.target.value);
    }

}

export default SearchBar;