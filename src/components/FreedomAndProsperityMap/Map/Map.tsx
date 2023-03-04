// @ts-nocheck
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3';
// import geojsonLow from '../../../data/world-100.geo.json';
import geojson from '../../../data/world.geo.json';

import './_map.scss';
import { getDataByISO, getFreedomCategory, getProsperityCategory } from '../../../data/data-util';
import { IndexType } from '../../../@enums/IndexType';
import Tooltip from '../../Tooltip/Tooltip';
import { positionCentroid, colors, fillByProsperity } from '../../../data/d3-map-util';
import { FreedomCategory } from '../../../@enums/FreedomCategory';

interface IMap {
    mode: IndexType,
    setPanelData: (data: FPData) => void,
}

const height = 1400;
const width = 2000;

let projection = d3.geoMercator()
    .center([-40, 80])
    .rotate([-10.5, 0, 0])
    .translate([800, 150])
    .fitSize([width, height], geojson)

// const MIN_SCALE = 308;

function Map(props: IMap) {
    const { mode, setPanelData } = props;
    const svg = useRef(null);
    const tooltipNode = useRef(null);
    const [tooltip, setTooltip] = useState(null);

    // .fitExtent([[0, 0], [900, 500]], geojson)

    const sensitivity = 120;
    const initialScale = projection.scale();

    let geoGenerator = d3.geoPath()
        .projection(projection);

    useEffect(() => {
        d3.select(svg.current)
            .call(d3.drag()
                .on('drag', (e) => {
                    if (e.defaultPrevented) return;

                    const rotate = projection.rotate();
                    const translate = projection.translate();
                    const scale = projection.scale();
                    let k = sensitivity / scale;
                    projection.rotate([
                        rotate[0] + e.dx * (k / 2),
                        rotate[1]
                    ])
                    projection.translate([
                        translate[0],
                        translate[1] + e.dy * (k * 5)
                    ])

                    geoGenerator = d3.geoPath().projection(projection)

                    d3.select(svg.current)
                        .attr('class', 'dragging')

                    updateCountries(true);

                    d3.select(svg.current)
                        .selectAll('.map__centroids circle')
                        .each(function (d) {
                            positionCentroid(d3.select(svg.current), d3.select(this), d, projection)
                        })
                })
                .on('end', (e) => {
                    updateCountries(false);

                    setTimeout(() => {
                        d3.select(svg.current)
                            .attr('class', '')
                    }, 10)
                })
            )
            .call(d3.zoom().on('zoom', (e) => {
                if (e.transform.k > 0.85) {
                    projection.scale(initialScale * e.transform.k)
                    geoGenerator = d3.geoPath().projection(projection)
                    d3.select(svg.current)
                        .selectAll('.map__countries path')
                        .attr('d', geoGenerator)

                    d3.select(svg.current)
                        .selectAll('.map__centroids circle')
                        .each(function (d) {
                            positionCentroid(d3.select(svg.current), d3.select(this), d, projection)
                        })
                }
                else {
                    e.transform.k = 0.85
                }
            }))
    }, [svg, mode])

    useEffect(() => {
        drawMap()
    }, [svg])

    useEffect(() => {
        updateFreedomColor();
    }, [mode])

    const updateFreedomColor = (init = false) => {
        d3.select(svg.current)
            .select('.map__countries')
            .selectAll('path')
            .transition()
            .duration(init ? 0 : 150)
            .style('fill', d => {
                const category: FreedomCategory = getFreedomCategory(d.properties.adm0_iso);
                if (!category) {
                    return '#F2F2F2'
                }
                if (mode === IndexType.FREEDOM) {
                    return colors[category];
                } else if (mode === IndexType.PROSPERITY) {
                    return '#ffffff'
                }
                return colors[category];
            })
            .style('stroke', mode !== IndexType.PROSPERITY ? '#ffffff' : 'rgba(179, 179, 179, 1)')
    }

    const positionTooltip = (x: number, y: number) => {
        x += 20
        y += 20 + document.documentElement.scrollTop

        if (tooltipNode.current) {
            if (y + tooltipNode.current.offsetHeight > document.documentElement.offsetHeight - 60) {
                y = document.documentElement.offsetHeight - (tooltipNode.current.offsetHeight * 2)
            }

            if (x + tooltipNode.current.offsetWidth > document.documentElement.offsetWidth - 60) {
                x = document.documentElement.offsetWidth - (tooltipNode.current.offsetWidth * 2) - 10
            }

            tooltipNode.current.style.left = x + 'px';
            tooltipNode.current.style.top = y + 'px';
        }
    }

    const updateCountries = (lowRes = false) => {
        const features = getFeatures(lowRes);

        d3.select(svg.current)
            .select('.map__countries')
            .selectAll('path')
            .data(features)
            .join('path')
            .attr('d', geoGenerator)
            .attr('data-country', d => d.properties.adm0_iso)
        // .attr('data-freedom', d => getFreedomCategory(d.properties.adm0_iso))

        updateFreedomColor(true)
    }

    const getFeatures = (lowRes = false) => {
        const allCountries = geojson.features.sort((a, b) => a.properties.adm0_iso.localeCompare(b.properties.adm0_iso));
        // if (lowRes) {
        //     let lowResCountries = geojsonLow.features;

        //     const missing = allCountries.filter((country) => {
        //         return !lowResCountries.find(c => c.properties.adm0_iso === country.properties.adm0_iso)
        //     })
        //     return [...missing, ...geojsonLow.features].sort((a, b) => a.properties.adm0_iso.localeCompare(b.properties.adm0_iso))
        // } 
        return allCountries;
    }

    const drawMap = () => {
        d3.select(svg.current)
            .attr('viewBox', `0 0 ${width} ${height}`)

        d3.select(svg.current)
            .on('mousemove', e => {
                positionTooltip(e.clientX, e.clientY)
            })

        updateCountries(mode, false);

        d3.select(svg.current)
            .select('.map__countries')
            .selectAll('path')
            .on('mouseenter', (e, d) => {
                setTooltip(getDataByISO(d.properties.adm0_iso));
                // positionTooltip(e.clientX, e.clientY);
            })
            .on('mouseleave', (e, d) => {
                setTooltip(null)
            })
            .on('click', (e, d) => {
                setPanelData(getDataByISO(d.properties.adm0_iso))
            })

        d3.select(svg.current)
            .select('.map__centroids')
            .selectAll('circle')
            .data(getFeatures(false).filter(d => getProsperityCategory(d.properties.adm0_iso) !== ''))
            .join('circle')
            .attr('data-country', d => d.properties.adm0_iso)
            .style('stroke', mode === IndexType.PROSPERITY ? 'var(--neutral---white)' : '')
            .each(function (d) {
                positionCentroid(d3.select(svg.current), d3.select(this), d, projection)
            })
            .style('fill', d => {
                return fillByProsperity(getProsperityCategory(d.properties.adm0_iso))
            })
            .on('mouseenter', (e, d) => {
                setTooltip(getDataByISO(d.properties.adm0_iso));
                // positionTooltip(e.clientX, e.clientY);
            })
            .on('click', (e, d) => {
                setPanelData(getDataByISO(d.properties.adm0_iso))
            })
    }

    return (
        <div className={`freedom-prosperity-map ${mode ? `freedom-prosperity-map--${mode.toLowerCase()}-only` : ''}`}>
            <svg ref={svg}>
                <g className='map__paths'>
                    <g className='map__countries'>

                    </g>
                    <g className='map__centroids'>

                    </g>
                </g>
            </svg>
            <div ref={tooltipNode} className='tooltip__container'>
                <Tooltip mode={mode}
                    data={tooltip} />
            </div>
        </div>
    )
}

export default Map