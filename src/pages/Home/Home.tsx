import { useState } from 'react';
import homeImg1 from './../../assets/images/geran-de-klerk-qzgN45hseN0-unsplash.jpg';
import homeImg2 from './../../assets/images/jan-antonin-kolar-LuBJ1GSvBl4-unsplash.jpg';
import homeImg3 from './../../assets/images/sherise-van-dyk-i95OeceNUeo-unsplash.jpg';
import homeImg4 from './../../assets/images/cory-schadt-Hhcn6yy3Uo8-unsplash.jpg';
import preview1 from './../../assets/images/preview-freedom.png';
import preview2 from './../../assets/images/preview-prosperity.png';
import Button from '../../components/Button/Button';
import Logo from './Logo/Logo';

import './_home.scss';
import FreedomAndProsperityTable from '../../components/FreedomAndProsperityTable/FreedomAndProsperityTable';

interface IHome {
}

function Home(props: IHome) {
    const [active, setActive] = useState<string | null>(null)

    const sections = [
        {
            label: 'Freedom',
            image: homeImg1,
            preview: <div className='page--home__main__preview'>
                <div>
                    <p>
                        <strong>The Freedom Index measures</strong> economic, political, and legal freedoms for nearly every country in the world, using the latest available data when the index was constructed at the end of 2021.
                    </p>
                </div>
                <div>
                    <img style={{ maxWidth: 565 }} src={preview1} />
                </div>
            </div>
        },
        {
            label: 'Prosperity',
            image: homeImg2,
            preview: <div className='page--home__main__preview'>
                <div>
                    <p>
                        <strong>The Prosperity Index</strong> measures economic wellbeing and human flourishing for the same countries and time period. In addition, we collected historical data to allow us to track and analyze change over time.
                    </p>
                </div>
                <div>
                    <img style={{ maxWidth: 400 }} src={preview2} />
                </div>
            </div>
        },
        {
            label: 'Explore',
            image: homeImg3,
            preview: <div className='page--home__main__preview page--home__main__preview--explore'>
                <div>
                    <p>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore,
                    </p>
                    <p>
                        Map, Rankings, Country Profiles and Library
                    </p>
                </div>
                <div>
                    <FreedomAndProsperityTable columns={['Name', 'Freedom score', 'Freedom rank', 'Freedom category']}
                        preview={true}
                    />
                </div>
            </div>
        },
        {
            label: 'About',
            image: homeImg4,
            preview: <div className='page--home__main__preview'>
                <div>
                    <p>
                        <strong>The Freedom and Prosperity Center</strong> aims to increase the prosperity of the poor and marginalized in developing countries and to explore the nature of the relationship between freedom and prosperity in both developing and developed nations.
                    </p>
                    <p>
                        We constructed the same indexes going back in five-year increments for the years 2006, 2011, and 2016.
                    </p>
                </div>
                <div>

                </div>
            </div>
        },
    ]

    const activeSection = sections.find(section => section.label === active);

    return (
        <div className={`page--home ${active ? 'section-in-focus' : ''}`}>
            <Logo setActive={(label) => setActive((prev: string | null) => {
                if (prev === label) {
                    return null
                } else {
                    const section = sections.find(section => section.label === label);

                    if (section) {
                        return section.label
                    }
                    return null;
                }}
             )} />
            <div className={`page--home__main`}>
                {sections.map((section) => (
                    <div key={section.label}
                        className={`page--home__image ${section.label === active ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${section.image})` }}>
                        <Button onClick={() => setActive(prev => prev === section.label ? null : section.label)}>
                            {section.label}
                        </Button>
                    </div>
                ))}
                <div className={`page--home__main__content`}>
                    {activeSection ? activeSection.preview : null}
                </div>
            </div>
        </div>
    )
}

export default Home
