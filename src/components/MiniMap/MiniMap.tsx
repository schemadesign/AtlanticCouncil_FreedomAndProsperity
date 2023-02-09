import { useEffect, useRef } from 'react'
import * as d3 from 'd3';
import geojson from '../../data/world.geo.json';
import { colorProsperous, colors, getFeatureByISO, positionCentroid } from '../../data/d3-util';
import { getFreedomCategory, getProsperityCategory } from '../../data/data-util';
import { GeoGeometryObjects } from 'd3';

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
        const height = 140;
        const width = 200;
        const country = getFeatureByISO(iso)

        let geoGenerator = d3.geoPath()
            .projection(projection);

        d3.select(svg.current)
            .attr('viewBox', `0 0 ${width} ${height}`)

        const b = geoGenerator.bounds(country),
            s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
            t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

        // projection = projection 
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
            .selectAll('rect')
            .data([country].filter(d => getFreedomCategory(d.properties.adm0_iso)))
            .join('rect')
            .attr('data-country', d => d.properties.adm0_iso)
            .each(function (d) {
                positionCentroid(d3.select(svg.current), d3.select(this), d, projection, 10)
            })
            .style('fill', d => {
                return colorProsperous(getProsperityCategory(d.properties.adm0_iso))
            })
            .style('stroke', 'var(--neutral---black)')
            .style('stroke-width', 0.5)
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