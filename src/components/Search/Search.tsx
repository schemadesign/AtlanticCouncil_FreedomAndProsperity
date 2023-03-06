import { Typeahead } from 'react-bootstrap-typeahead';
import { sortedData } from '../../data/data-util';
import SearchIcon from './../../assets/images/Search.svg';
import './_search.scss';

interface ISearch {
    selected: Array<any>,
    setSelected: (selected: Array<any>, resetCountries?: boolean) => void,
    multiple?: boolean,
}

function Search(props: ISearch) {
    const { selected, setSelected, multiple = false } = props;

    return (
        <div className='search'>
            <Typeahead
                id='country-search'
                multiple={multiple}
                selected={selected}
                labelKey='Name'
                onChange={setSelected}
                className='search'
                options={sortedData({col: 'Name', direction: 1})}
                placeholder='Type country or region'
                onBlur={(e) => { 
                    if (e.target.value.trim().length === 0) {
                        setSelected([], true)
                    }
                }}
                renderToken={() => <></>}
                />
            <img src={SearchIcon} />
        </div>
    )
}

export default Search;