import React, { Component } from 'react';
import './App.css';


class ProductRow extends React.Component {
  render() {
    var drink = this.props.drink;
	const rating= 5-(drink.preferability/10);
	const price= drink.pricerange/10;
	var ratingStr='';;
	var priceStr='';
	var i;
	for (i=0; i<rating; i++){
		ratingStr = '*'+ratingStr;
	}
	for (i=0; i<price; i++){
		priceStr = '€'+priceStr;
	}	
	
    return (
      <tr>
        <td>{drink.title}</td>
        <td>{priceStr}</td>
		<td>{ratingStr}</td>
	  </tr>
    );
  }
}
// ------------ ProductTableHeader: täällä filtteröidään ja päivitetään Data -------------
class ProductTableHeader extends React.Component {
	constructor(props){
		super(props)
		this.handleFilterChange=this.handleFilterChange.bind(this);
		
	} // constructor
	
handleFilterChange(e){
	var temppi;
	switch (e.target.innerText){
		case "Name":
			temppi='?_sort=title';
			break;
		case "Price":
			temppi='?_sort=pricerange&_order=desc';
			break;
		case "Rating":
			temppi='?_sort=preferability';
			break;
		default:
			temppi= this.props.oldFilter;
		}
	console.log('Filter changed from  '+this.props.filterStr +' to '+temppi);
	this.props.onFilterChange(temppi);
			
		console.log('GET: http://localhost:3000/'+this.props.category+temppi)   			
		fetch ('http://localhost:3000/'+this.props.category+temppi).then((response) => { 	
			response.json().then((data)=> {
				this.props.onDataChange(data);
			}); //response.json
		});	// response
		
} 
  render() {
    return (
     <table>
        <thead>
          <tr>
            <th><button type="button" onClick={this.handleFilterChange}>Name</button></th>
            <th><button type="button" onClick={this.handleFilterChange}>Price</button></th>
			<th><button type="button" onClick={this.handleFilterChange}>Rating</button></th>
          </tr>
        </thead>     
     </table>
	);
  }
}

// --------------- ProductTable: ProductTableHeader + ProductCategoryRows -------------
class ProductTable extends React.Component {
  
  render() {
	const rows = []; 
	const searchText=this.props.searchText;
	const category = this.props.category; 
	if(typeof this.props.data !== 'undefined'){
		this.props.data.forEach((drink) => {
			if (drink.title.indexOf(searchText) === -1){
				return;
			}
			
			rows.push(
			<ProductRow drink={drink} key={drink.title} />
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
		
		<table>
			<tbody>{rows}</tbody>
		</table> 
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
	this.props.onCategoryChange(e.target.innerText);
	fetch ('http://localhost:3000/'+e.target.innerText).then((response) => { 	
			response.json().then((data)=> {
				this.props.onDataChange(data);
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
	  this.handleSeachTextChange=this.handleSearchTextChange.bind(this);
	  this.handleCategoryChange=this.handleCategoryChange.bind(this);
	  this.handleFilterChange=this.handleFilterChange.bind(this);   
	  this.handleDataChange=this.handleDataChange.bind(this);   
	  
	} // App constructor
	
	// update states:
	handleSearchTextChange(searchText){
			//console.log('searchText: '+searchText);
			this.setState({searchText:searchText});
	}
    handleCategoryChange(category){
			//console.log('handlecategoryChange triggered: '+category);
			this.setState({category:category});	
	}
	handleFilterChange(filterStr) {
			this.setState({filterStr:filterStr});
	}
	handleDataChange(data) {
			//console.log('State changed for Data!');
			//console.dir(data);
			this.setState({data:data});
	}

  render() {
	return (
			<div>
				<SearchBar 
				searchText={this.state.searchText}
				onSearchTextChange={this.handleSeachTextChange}
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