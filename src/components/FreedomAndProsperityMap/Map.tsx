// @ts-nocheck
import { useEffect, useRef, useState } from "react"
import * as d3 from 'd3';
import geojson from '../../data/world.geo.json';
import centroids from '../../data/centroids.geo.json';
// @ts-expect-error
import f_p_data from './../../data/F&P 2021-Table 1.csv';

import './_map.scss';

const colorScale = ['rgba(71, 148, 75, 1)', 'rgba(177, 216, 120, 1)', 'rgba(225, 143, 106, 1)', 'rgba(198, 50, 42, 1)', '#e6e6e6'];
const freedomCategories = ['Free', 'Mostly Free', 'Mostly Unfree', 'Unfree', ''];

const getFreedom = (iso: string): string => {
    try {
        return f_p_data.find(e => e.ISO3 === iso)['Freedom category 2021']
    } catch {
        return '';
    }
}

const getProsperity = (iso: string): string => {
    try {
        return f_p_data.find(e => e.ISO3 === iso)['Prosperity category 2021']
    } catch {
        return '';
    }
}

// function Map() {
//     const canvas = useRef(null);
//     const [rotation, setRotation] = useState([-10.5, 0, 0])
//     const [zoom, setZoom] = useState(0);

//     useEffect(() => {
//         drawMap()
//     }, [canvas, rotation, zoom])

//     function drawMap() {
//         const width = window.innerWidth;
//         const height = width * 0.7;

//         // @ts-ignore
//         let context = d3.select(canvas.current)
//             .attr('width', width)
//             .attr('height', height)
//             .node()
//             .getContext('2d');

//         let projection = d3.geoMercator()
//             // .scale(320 + (zoom * 2))
//             // .center([-40, 80])
//             .rotate(rotation)
//             // .translate([800, 250])
//             .fitExtent([[0, 0], [width, height]], geojson)

//         let geoGenerator = d3.geoPath()
//             .projection(projection)
//             .context(context);

//         console.log(context)

//         freedomCategories.forEach((cat, i) => {
//             const features = geojson.features.filter(f => {
//                 return getFreedom(f.properties.adm0_iso) === cat
//             })

//             context.fillStyle = colorScale[i];
//             context.lineWidth = 0.5;
//             context.strokeStyle = '#fff';
//             context.beginPath();
//             geoGenerator({ type: 'FeatureCollection', features: features })
//             context.fill();
//             context.stroke();
//         })
//     }

//     return (
//         <div>
//             <input type='range'
//                 min={-360}
//                 max={0}
//                 value={rotation[0]}
//                 onChange={(e) => setRotation(prev => [parseInt(e.target.value), prev[1], prev[2]])}
//             />
//             <input type='range'
//                 min={0}
//                 max={360}
//                 value={rotation[1]}
//                 onChange={(e) => setRotation(prev => [prev[0], parseInt(e.target.value), prev[2]])}
//             />
//             <input type='range'
//                 min={0}
//                 max={360}
//                 value={rotation[2]}
//                 onChange={(e) => setRotation(prev => [prev[0], prev[1], parseInt(e.target.value)])}
//             />
//             <input type='range'
//                 min={0}
//                 max={100}
//                 value={zoom}
//                 onChange={(e) => setZoom(e.target.value)}
//             />
//             <canvas ref={canvas} />
//         </div>
//     )
// }

// export default Map;

function Map() {
    const svg = useRef(null)
    const [rotation, setRotation] = useState([-10.5, 0, 0])
    const [zoom, setZoom] = useState(1);
    const [translate, setTranslate] = useState([800, 250])

    useEffect(() => {
        drawMap()
    }, [svg, rotation, zoom])

    const getBoundingBoxCenter = (selection) => {
        var element = selection.node();
        var bbox = element.getBBox();
        return [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
    }

    const drawMap = () => {
        const height = 1400;
        const width = 2000;
        let projection = d3.geoMercator()
            .scale(300 + (zoom * 3))
            .center([-40, 80])
            .rotate(rotation)
            .translate(translate)
        // .fitExtent([[0, 0], [900, 500]], geojson)

        let geoGenerator = d3.geoPath()
            .projection(projection);

        const colorFreedom = d3.scaleOrdinal()
            .domain(['Free', 'Mostly Free', 'Mostly Unfree', 'Unfree', ''])
            .range(colorScale)
        const colorProsperous = d3.scaleOrdinal()
            .domain(['Prosperous', 'Mostly Prosperous', 'Mostly Unprosperous', 'Unprosperous', ''])
            .range(colorScale)

        const features = geojson.features.sort((a, b) => a.properties.adm0_iso.localeCompare(b.properties.adm0_iso))

        d3.select(svg.current)
            .attr('viewBox', `0 0 ${width} ${height}`)

        // d3.select(svg.current)
        //     .call(d3.drag()
        //         .on("start", dragstarted)
        //         .on("drag", dragged)
        //         .on("end", dragended))

        d3.select(svg.current)
            .call(d3.zoom()
                .extent([[0, 0], [width, height]])
                .scaleExtent([1, 80])
                .on("zoom", zoomed));

        // var zoom = d3.zoom()
        //     .scaleExtent([1, 8])
        //     .on('zoom', function () {
        //         d3.select(svg.current)
        //             .selectAll('.map__countries path')
        //             .attr('transform', d3.event.transform);
        //     });

        d3.select(svg.current)
            .select('.map__countries')
            .selectAll('path')
            .data(features)
            .join('path')
            .attr('d', geoGenerator)
            .attr('data-country', d => d.properties.adm0_iso)
            .attr('data-freedom', d => getFreedom(d.properties.adm0_iso))

        d3.select(svg.current)
            .select('.map__centroids')
            .selectAll('rect')
            .data(features.filter(d => getProsperity(d.properties.adm0_iso) !== ''))
            .join('rect')
            .attr('data-country', d => d.properties.adm0_iso)
            .each(function (d) {
                let coords = [0, 0]
                let centroid = centroids.features.find(f => f.properties.ISO === d.properties.iso_a2);

                if (centroid) {
                    coords = projection(centroid.geometry.coordinates);
                } else {
                    coords = getBoundingBoxCenter(d3.select(`path[data-country="${d.properties.adm0_iso}"]`));
                }

                const size = 20 - (zoom / 1000)

                d3.select(this)
                    .style('transform', `translate(${coords[0] - size / 2}px, ${coords[1] - size / 2}px) rotate(45deg)`)
                    .style('transform-origin', `${size / 2}px ${size / 2}px`)
                    .attr('height', size)
                    .attr('width', size)
            })
            .style('stroke', 'black')
            .style('fill', d => {
                return colorProsperous(getProsperity(d.properties.adm0_iso))
            })
    }

    // function dragstarted() {
    //     d3.select(svg.current).raise();
    //     d3.select(svg.current)
    //         .select('.map__paths')
    //         .attr("cursor", "grabbing");
    // }

    // function dragged(event, d) {
    //     // d3.select(svg.current)
    //     //     .select('.map__paths')
    //         // .attr("cx", d.x = event.x).attr("cy", d.y = event.y);

    //     // setRotation(prev => [event.x/2 + prev[0], prev[1], prev[2]])
    // }

    // function dragended() {
    //     d3.select(svg.current)
    //         .select('.map__paths')
    //         .attr("cursor", "grab");
    // }

    function zoomed({ transform }) {
        // d3.select(svg.current)
        //     .select('.map__paths')
        //     .attr("transform", transform);

        console.log(transform)

        setZoom(transform.k * 3)
        // setTranslate([800 + transform.x, 250 + transform.y])
    }

    return (
        <div className="map container">
            {/* <input type='range'
                min={-360}
                max={0}
                value={rotation[0]}
                onChange={(e) => setRotation(prev => [parseInt(e.target.value), prev[1], prev[2]])}
            />
            <input type='range'
                min={0}
                max={360}
                value={rotation[1]}
                onChange={(e) => setRotation(prev => [prev[0], parseInt(e.target.value), prev[2]])}
            />
            <input type='range'
                min={0}
                max={360}
                value={rotation[2]}
                onChange={(e) => setRotation(prev => [prev[0], prev[1], parseInt(e.target.value)])}
            />
            <input type='range'
                min={1}
                max={1000}
                value={zoom}
                onChange={(e) => setZoom(e.target.value)}
            /> */}
            <svg ref={svg}>
                <g className="map__paths">
                    <g className="map__countries">

                    </g>
                    <g className="map__centroids">

                    </g>
                </g>
            </svg>
        </div>
    )
}

export default Map
