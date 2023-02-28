import { Typeahead } from 'react-bootstrap-typeahead';
import { sortedData } from '../../data/data-util';
import SearchIcon from './../../assets/images/Search.svg';
import './_search.scss';

interface ISearch {
    selected: Array<any>,
    setSelected: (selected: Array<any>) => void,
}

function Search(props: ISearch) {
    const { selected, setSelected } = props;

    return (
        <div className='search'>
            <Typeahead
                id='country-search'
                labelKey='Name'
                onChange={setSelected}
                className='search'
                options={sortedData({col: 'Name', direction: 1})}
                placeholder='Type country or region'
                selected={selected}
                />
            <img src={SearchIcon} />
        </div>
    )
}

export default Search;