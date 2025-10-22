const Filter = ({filterName,handleSearch})=>{
  return <div>
    filter shown with <input type="text" value={filterName} onChange={handleSearch}/>
  </div>
}

export default Filter;