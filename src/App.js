import React, { Component } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FaSearch, FaBell, FaQuestionCircle } from 'react-icons/fa';

import netflix from './netflix_logo.png';

import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			movies: [],
			loaded: false,
			searchQuery: '',
			showSearch: false
		};
	}
	
	fetchMovies() {
		const api = "http://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc";
		const accessKey = "3f862af037a06680c7bba20ff2ab13e1";
		
		axios.get(
			`${api}?&api_key=${accessKey}`
		).then(res => {
			
			const content = res.data.results.map((image, index) => ({...image, isHovered: false}));
			this.setState((state) => ({
				movies: [...state.movies, ...content],
				loaded: true
			}));
		})
		.catch((err) => {
			console.log('error', err);
		})
		;
	};
	
	onMouseEnter(index, event) {
		const hoveredItem = this.state.movies[index];
		hoveredItem.isHovered = true;
		this.setState((state) => ({
			movies: [...state.movies, hoveredItem ]
		}));
	}
	
	onMouseLeave(index, event) {
		const hoveredItem = this.state.movies[index];
		hoveredItem.isHovered = false;
		this.setState((state) => ({
			movies: [...state.movies, hoveredItem ]
		}));
	}
	
	toggleSearch() {
		this.setState((state) => ({
			showSearch: !state.showSearch
		}));
	}

	handleSearchChange(event) {
		this.setState({
			searchQuery: event.target.value
		});
	}

	getFilteredMovies() {
		if (!this.state.searchQuery) {
			return this.state.movies;
		}
		return this.state.movies.filter((movie) =>
			movie.title.toLowerCase().includes(this.state.searchQuery.toLowerCase())
		);
	}

	componentDidMount() {
		this.fetchMovies();
	}
	
  render() {
    return (
      <div className="app">
		<header>
			<h1><img src={netflix} alt="Netflix" /></h1>
			<div className="nav">
				<FaSearch 
					className="navBar search search-icon" 
					onClick={() => this.toggleSearch()}
				/>
				{this.state.showSearch && (
					<input 
						type="text"
						className="search-input"
						placeholder="Search movies..."
						value={this.state.searchQuery}
						onChange={(e) => this.handleSearchChange(e)}
						autoFocus
					/>
				)}
				<p className="search">BROWSE</p>
				<p className="search">|</p>
				<p className="search">KIDS</p>
			</div>
			<div className="nav notification">
				<FaBell />
				<FaQuestionCircle />
			</div>
		</header>
		<section>
			<h1>POPULAR</h1>
			<InfiniteScroll	
				dataLength={this.state.movies}
				next={() => this.fetchMovies()}
				hasMore={true}
				loader={
					<div className="loader"></div>
				}
			>
				<div className="grid">
					{this.state.loaded
					? this.getFilteredMovies().map((image, index) => (
							<div key={index} 
								className={image.isHovered ? "hoveredImage" : "tile"}
								onMouseEnter={this.onMouseEnter.bind(this, index)} 
								onMouseLeave={this.onMouseLeave.bind(this, index)} >
								<img
									src={` http://image.tmdb.org/t/p/w200/${image.poster_path}`}
									alt={image.title} 
								/>
								<h2>{image.title}</h2>
							</div>
						))
					: ""
					}
				</div>
			</InfiniteScroll>
			<div className="content">
				
			</div>
		</section>
          
      </div>
    );
  }
}



export default App;
