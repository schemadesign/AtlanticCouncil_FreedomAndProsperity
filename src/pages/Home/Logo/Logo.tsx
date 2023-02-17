import { ReactNode } from 'react';
import { IndexType } from '../../../@enums/IndexType';
import Button from '../../../components/Button/Button';
import atlanticCouncilLogo from './../../../assets/images/Atlantic Council.svg';
import './_logo.scss';

interface ILogo {
    // children: ReactNode,
    setActive: (section: string) => void,
}

function Logo(props: ILogo) {
    const { setActive } = props;

    return (
        <div className='page--home__logo'>
            <img src={atlanticCouncilLogo} className="logo" alt="Atlantic Council" />
            <div className='page--home__logo__title'>
                <Button onClick={() => setActive('Freedom')}
                    variant={IndexType.FREEDOM}>
                    Freedom
                </Button>
                <div>
                    <span>
                        and
                    </span>
                    <Button onClick={() => setActive('Prosperity')}
                        variant={IndexType.PROSPERITY}>
                        Prosperity
                    </Button>
                </div>
                <span>
                    Indexes
                </span>
            </div>
        </div>
    )
}

export default Logo
