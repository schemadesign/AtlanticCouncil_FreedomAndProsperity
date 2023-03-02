import { useEffect, useRef } from 'react'
import * as d3 from 'd3';
import { fillByProsperity, colors, getFeatureByISO, positionCentroid } from '../../data/d3-map-util';
import { getFreedomCategory, getProsperityCategory } from '../../data/data-util';

import './_mini-map.scss';
import _ from 'lodash';

interface IMiniMap {
    iso: string,
}
    // .center([-40, 80])
    // .rotate([-10.5, 0, 0])
    // .translate([800, 150])
// .fitExtent([[0, 0], [900, 500]], geojson)


function MiniMap(props: IMiniMap) {
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

        if (!country) {
            return null;
        }

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
            .attr('data-country', (d: any) => d.properties.adm0_iso)
            // .attr('data-freedom', d => getFreedomCategory(d.properties.adm0_iso))
            .style('fill', (d: any) => {
                const category = getFreedomCategory(d.properties.adm0_iso);

                if (!category) {
                    return '#F2F2F2'
                }
                return _.get(colors, category);
            })

        d3.select(svg.current)
            .select('.map__centroids')
            .selectAll('circle')
            .data([country].filter((d: any) => getFreedomCategory(d.properties.adm0_iso)))
            .join('circle')
            .attr('data-country', (d: any) => d.properties.adm0_iso)
            .each(function (d) {
                positionCentroid(d3.select(svg.current), d3.select(this), d, projection, 10)
            })
            .style('fill', (d: any) => {
                return fillByProsperity(getProsperityCategory(d.properties.adm0_iso))
            })
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