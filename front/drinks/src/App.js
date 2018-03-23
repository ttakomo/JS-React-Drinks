// Programming excercice by Toni Takomo 23.3.2018
// React implementation
// Improvement ideas:
// Bootstrap to dynamically change the UX depending available screen size.
// Server error handling alert

import React, { Component } from 'react';
import './App.css';
import { Media } from 'react-bootstrap';

class ProductRow extends React.Component {
  render() {
		var category = this.props.category;
		var drink = this.props.drink;
		//console.log(category);
		//console.dir(drink);
		const rating= 5-(drink.preferability/10);
		const price= drink.pricerange/10;
		
		var imageName;
		var ratingStr='	';;
		var priceStr= '';
		var i;
		for (i=0; i<rating; i++){
			ratingStr = '*'+ratingStr;
		}
		for (i=0; i<price; i++){
			priceStr = '€'+priceStr;
		}	
		
		if(drink.images[0] !== ""){
			imageName= drink.images[0];
		} else {imageName="no-image.png"}

		var imageUri='http://localhost:3000/images/'+category+'/thumb/'+imageName;
		//console.log(imageUri);
		return (  
		<Media>
				<Media.Left>
					<img width={90} height={160} src={imageUri} alt="thumbnail" />
				</Media.Left>
				<Media.Body>
					<Media.Heading>{drink.title}</Media.Heading>
					<p>	Rating: {ratingStr} </p> 
					<p>	Price Range: {priceStr} </p>
					<p> {drink.description} </p>
				</Media.Body>
			</Media>

		); // return
  } // render
} //class productRow

// ------------ ProductTableHeader: täällä filtteröidään ja päivitetään Data -------------
class ProductTableHeader extends React.Component {
	constructor(props){
		super(props)
		this.handleFilterChange=this.handleFilterChange.bind(this);
	} // constructor

handleFilterChange(e){
	var sortti;
	switch (e.target.innerText){
		case "Name":
			sortti='?_sort=title';
			break;
		case "Price":
			sortti='?_sort=pricerange&_order=desc';
			break;
		case "Rating":
			sortti='?_sort=preferability';
			break;
		default:
			sortti= this.props.oldFilter;
		}
					
		//console.log('GET: http://localhost:3000/'+this.props.category+sortti)   			
		fetch ('http://localhost:3000/'+this.props.category+sortti).then((response) => { 	
			response.json().then((data)=> {
				this.props.onDataChange(data);
				this.props.onFilterChange(sortti); // filter ja data statet muuttuvat samaan aikaan
			}); //response.json
		});	// response

	} 
	render() {
			if (this.props.category === ""){
				return (
					<h2>Select Category</h2>
								
				);
			} else {
			return (
		<p>
				<button type="submit" onClick={this.handleFilterChange}>Name</button>
				<button type="submit" onClick={this.handleFilterChange}>Rating</button>
				<button type="submit" onClick={this.handleFilterChange}>Price</button>
		</p>
		
		);
		}
	}//render
}// class ProductTableHeader

// --------------- ProductTable: ProductTableHeader + ProductCategoryRows -------------
class ProductTable extends React.Component {

	render() {
	const rows = []; 
	const searchText=this.props.searchText;
	const category = this.props.category; 
	if(typeof this.props.data !== 'undefined') {
		this.props.data.forEach((drink) => {
			if (drink.title.indexOf(searchText) === -1){
				return;
			}		
			rows.push(
				<ProductRow drink={drink} category={this.props.category} key={drink.title} />
			);
		});
	}
  return (
	<div>
		<h1>
			{category}   
		</h1> 
		
			<ProductTableHeader 
			filterStr={this.props.filterStr}
			onFilterChange={this.props.onFilterChange}
			onDataChange={this.props.onDataChange}
			category={this.props.category}
			/>
			{rows}
		
	</div>
	); //return
  } //render
} //ProductTable

// -------  Choose Category  ------------- 
class ProductCategoryRow extends React.Component {
constructor(props){
		super(props)
		this.handleCategoryChange = this.handleCategoryChange.bind(this);
	} // constructor
  
  handleCategoryChange(e) {
	//	this.props.onCategoryChange(e.target.innerText);
	var clicked=e.target.innerText;

	fetch ('http://localhost:3000/'+clicked).then((response) => { 	
			response.json().then((data)=> {
				this.props.onDataChange(data);
				this.props.onCategoryChange(clicked);
			}); //response.json
		});	// response
	// lataa ja vaihda kategoriadata
	
  }
    
  render() {
    return (
		<table>
			<thead>
			<tr>
				<th> <button type="button" onClick={this.handleCategoryChange}>Beers</button></th>			
				<th> <button type="button" onClick={this.handleCategoryChange}>EnergyDrinks</button> </th>
			</tr>
			</thead>
		</table>
	  ); 
  } //render
} //ProductCategoryRow

// -------------- SearchBar -------------------
class SearchBar extends React.Component {
	constructor(props){
		super(props)
		this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
	} // constructor
	
	handleSearchTextChange(e) {
    this.props.onSearchTextChange(e.target.value);
	}

  render() {
    return (
      <form>
		<input
         type="text"
         placeholder="Search..."
         value={this.props.searchText}
         onChange={this.handleSearchTextChange}
        />
      </form>
    );
  }
}

// -----------------   App   ----------------------
class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			searchText:'',
			category:'',
			filterStr:'',
			data: []
		}; //this state	
	  this.handleSearchTextChange=this.handleSearchTextChange.bind(this);
	  this.handleCategoryChange=this.handleCategoryChange.bind(this);
	  this.handleFilterChange=this.handleFilterChange.bind(this);   
	  this.handleDataChange=this.handleDataChange.bind(this);     
	} // App constructor
	
	// Manage states:
	handleSearchTextChange(searchText){
			this.setState({searchText:searchText});
	}
    handleCategoryChange(category){
			this.setState({category:category});	
	}
	handleFilterChange(filterStr) {
			this.setState({filterStr:filterStr});
	}
	handleDataChange(data) {
			this.setState({data:data});
	}

  render() {
	return (
			<div>
				<SearchBar 
				searchText={this.state.searchText}
				onSearchTextChange={this.handleSearchTextChange}
				/>
								
				<ProductCategoryRow category={this.state.category} 
				onCategoryChange={this.handleCategoryChange}
				onDataChange={this.handleDataChange}
				/>
				
				<ProductTable 
				searchText={this.state.searchText}
				data={this.state.data} 
				category={this.state.category}
				filterStr={this.state.filterStr}
				onFilterChange={this.handleFilterChange}
				onDataChange={this.handleDataChange}
				/> 
			</div>
			);	
  } //render App
} //class App

export default App;