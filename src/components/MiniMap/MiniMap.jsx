import { useEffect, useRef } from 'react'
import * as d3 from 'd3';
import { colors, getFeatureByISO, positionCentroid } from '../../data/d3-util';
import { getFreedomCategory } from '../../data/data-util';

import './_mini-map.scss';

function MiniMap(props) {
    const { iso } = props;
    const svg = useRef(null);

    let projection = d3.geoMercator()

    useEffect(() => {
        drawMap()
    }, [svg, iso])

    const drawMap = () => {
        const height = 160;
        const width = 200;
        const country = getFeatureByISO(iso)

        let geoGenerator = d3.geoPath()
            .projection(projection);

        d3.select(svg.current)
            .attr('viewBox', `0 0 ${width} ${height}`)
            
        projection.rotate([iso === 'USA' ? 20 : -20, 0])
            .fitSize([width, height], country)  

        geoGenerator.projection(projection) 

        d3.select(svg.current)
            .select('.map__countries')
            .selectAll('path')
            .data([country])
            .join('path')
            .attr('d', geoGenerator)
            .attr('data-country', d => d.properties.adm0_iso)
            // .attr('data-freedom', d => getFreedomCategory(d.properties.adm0_iso))
            .style('fill', d => {
                const category = getFreedomCategory(d.properties.adm0_iso);

                if (!category) {
                    return '#F2F2F2'
                }
                return colors[category];
            })

        d3.select(svg.current)
            .select('.map__centroids')
            .selectAll('circle')
            .data([country].filter(d => getFreedomCategory(d.properties.adm0_iso)))
            .join('circle')
            .attr('data-country', d => d.properties.adm0_iso)
            .each(function (d) {
                positionCentroid(d3.select(svg.current), d3.select(this), d, projection, 10)
            })
            .style('fill', d => fillByProsperity(getProsperityCategory(d.properties.adm0_iso)))
    }

    return (
        <div className='mini-map'>
            <svg ref={svg}>
                <g className='map__paths'>
                    <g className='map__countries'>

                    </g>
                    <g className='map__centroids'>

                    </g>
                </g>
            </svg>
        </div>
    )
}

export default MiniMap