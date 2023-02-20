import search from './../../assets/images/Search.svg';
import './_search.scss';

interface ISearch {
}

function Search(props: ISearch) {

    return (
        <div className='search'>
            <input type='text'
                className='search'
                placeholder='Type country or region'
            />
            <img src={search} />
        </div>
    )
}

export default Search;