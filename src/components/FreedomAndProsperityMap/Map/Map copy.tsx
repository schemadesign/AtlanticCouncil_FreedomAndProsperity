// @ts-nocheck
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3';
// import geojsonLow from '../../../data/world-100.geo.json';
import geojson from '../../../data/world-50.geo.json';
import centroids from '../../../data/centroids.geo.json';

import './_map.scss';
import { getDataByISO, getFreedomCategory, getProsperityCategory } from '../../../data/data-util';
import { ProsperityCategoryLiterals } from '../../../@enums/ProsperityCategory';
import { IndexType } from '../../../@enums/IndexType';
import Tooltip from '../Tooltip/Tooltip';

const colorScale = ['rgba(71, 148, 75, 1)', 'rgba(177, 216, 120, 1)', 'rgba(225, 143, 106, 1)', 'rgba(198, 50, 42, 1)', '#e6e6e6'];

interface IMap {
    mode: IndexType | null,
}

const MIN_SCALE = 308;

let projection = d3.geoMercator()
    .scale(MIN_SCALE)
    .center([-40, 80])
    .rotate([-10.5, 0, 0])
    .translate([800, 150])
// .fitExtent([[0, 0], [900, 500]], geojson)

const sensitivity = 100;
const initialScale = projection.scale()

let geoGenerator = d3.geoPath()
    .projection(projection);

function Map(props: IMap) {
    const { mode } = props;
    const svg = useRef(null);
    const tooltipNode = useRef(null);
    const [tooltip, setTooltip] = useState(null)

    useEffect(() => {
        d3.select(svg.current)
            .call(d3.drag().on('drag', (e) => {
                const rotate = projection.rotate();
                const translate = projection.translate();
                const scale = projection.scale();
                let k = sensitivity / (scale * 0.9);
                projection.rotate([
                    rotate[0] + e.dx * k,
                    rotate[1]
                ])
                projection.translate([
                    translate[0],
                    translate[1] + e.dy * (k * 10)
                ])

                geoGenerator = d3.geoPath().projection(projection)

                d3.select(svg.current)
                    .selectAll('.map__countries path')
                    .attr('d', geoGenerator)
                d3.select(svg.current)
                    .selectAll('.map__centroids rect')
                    .each(positionCentroid)
            }))
            .call(d3.zoom().on('zoom', (e) => {
                if (e.transform.k > 0.85) {
                    projection.scale(initialScale * e.transform.k)
                    geoGenerator = d3.geoPath().projection(projection)
                    d3.select(svg.current)
                        .selectAll('.map__countries path')
                        .attr('d', geoGenerator)

                    d3.select(svg.current)
                        .selectAll('.map__centroids rect')
                        .each(positionCentroid)
                }
                else {
                    e.transform.k = 0.85
                }
            }))
    }, [])

    useEffect(() => {
        drawMap()
    }, [svg, mode])

    const getBoundingBoxCenter = (selection) => {
        var element = selection.node();
        var bbox = element.getBBox();
        return [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
    }

    const positionTooltip = (x: number, y: number) => {
        // const svgRect = svg.current.getBoundingClientRect();
        // const maxX = document.body.offsetWidth - tooltipNode.current.offsetWidth - 40;
        // const maxY = Math.max(svgRect.height + svg.current.getBBox().y - svgRect.top - 10, window.innerHeight - 40);

        // y -= svgRect.top;
        // y += svg.current.getBBox().y;

        // if (y + tooltipNode.current.offsetHeight > maxY) {
        //     y = maxY - tooltipNode.current.offsetHeight;
        // }

        // if (x > maxX) {
        //     x -= tooltipNode.current.offsetWidth + 20;
        // } else {
        //     x += 20;
        // }
        // x = Math.min(x + 20, maxX);
        // y = Math.min(y, maxY);

        // console.log(svg.current.getBBox(), x, y, tooltipNode.current.offsetHeight)
        // console.log(x, maxX)

        x += 20
        y += 20 + document.documentElement.scrollTop

        if (y + tooltipNode.current.offsetHeight > document.documentElement.offsetHeight - 60) {
            y = document.documentElement.offsetHeight - tooltipNode.current.offsetHeight - 60
        }

        tooltipNode.current.style.left = x + 'px';
        tooltipNode.current.style.top = y + 'px';
    }

    function positionCentroid(d) {
        const size = 20;
        let coords = [0, 0]
        let centroid = centroids.features.find(f => f.properties.ISO === d.properties.iso_a2_eh);

        if (centroid) {
            coords = projection(centroid.geometry.coordinates);
        } else {
            try {
                coords = getBoundingBoxCenter(d3.select(`path[data-country='${d.properties.adm0_iso}']`));
            } catch {
                return;
            }
        }

        d3.select(this)
            .style('transform', `translate(${coords[0] - size / 2}px, ${coords[1] - size / 2}px) rotate(45deg)`)
            .style('transform-origin', `${size / 2}px ${size / 2}px`)
            .attr('height', size)
            .attr('width', size)
    }

    const drawMap = () => {
        const height = 1275;
        const width = 2000;

        const fillByProsperity = d3.scaleOrdinal()
            .domain([...ProsperityCategoryLiterals, ''])
            .range(colorScale)

        const features = geojson.features.sort((a, b) => a.properties.adm0_iso.localeCompare(b.properties.adm0_iso))

        d3.select(svg.current)
            .attr('viewBox', `0 0 ${width} ${height}`)

        // d3.select(svg.current)
        //     .call(d3.drag()
        //         .on('start', dragstarted)
        //         .on('drag', dragged)
        //         .on('end', dragended))

        // d3.select(svg.current)
        //     .call(d3.zoom()
        //         .extent([[0, 0], [width, height]])
        //         .scaleExtent([1, 80])
        //         .on('zoom', zoomed));

        d3.select(svg.current)
            .on('mousemove', e => {
                positionTooltip(e.clientX, e.clientY)
            })

        // var zoom = d3.zoom()
        //     .scaleExtent([1, 8])
        //     .on('zoom', function () {
        //         d3.select(svg.current)
        //             .selectAll('.map__countries path')
        //             .attr('transform', d3.e.transform);
        //     });

        d3.select(svg.current)
            .select('.map__countries')
            .selectAll('path')
            .data(features)
            .join('path')
            .attr('d', geoGenerator)
            .attr('data-country', d => d.properties.adm0_iso)
            .attr('data-freedom', d => getFreedomCategory(d.properties.adm0_iso))
            .on('mouseenter', (e, d) => {
                setTooltip(getDataByISO(d.properties.adm0_iso));
                // positionTooltip(e.clientX, e.clientY);
            })
            .on('mouseleave', (e, d) => {
                setTooltip(null)
            })

        d3.select(svg.current)
            .select('.map__centroids')
            .selectAll('rect')
            .data(features.filter(d => getProsperityCategory(d.properties.adm0_iso) !== ''))
            .join('rect')
            .attr('data-country', d => d.properties.adm0_iso)
            .each(positionCentroid)
            .style('fill', d => {
                return fillByProsperity(getProsperityCategory(d.properties.adm0_iso))
            })
            .on('mouseenter', (e, d) => {
                setTooltip(getDataByISO(d.properties.adm0_iso));
                // positionTooltip(e.clientX, e.clientY);
            })
    }

    // function dragstarted() {
    //     d3.select(svg.current).raise();
    //     d3.select(svg.current)
    //         .select('.map__paths')
    //         .attr('cursor', 'grabbing');
    // }

    // function dragged(e, d) {
    //     // d3.select(svg.current)
    //     //     .select('.map__paths')
    //         // .attr('cx', d.x = e.x).attr('cy', d.y = e.y);

    //     // setRotation(prev => [e.x/2 + prev[0], prev[1], prev[2]])
    // }

    // function dragended() {
    //     d3.select(svg.current)
    //         .select('.map__paths')
    //         .attr('cursor', 'grab');
    // }

    // function zoomed({ transform }) {
    //     // d3.select(svg.current)
    //     //     .select('.map__paths')
    //     //     .attr('transform', transform);

    //     console.log(transform)

    //     setZoom(transform.k * 3)
    //     // setRotation(prev => [transform.x * (zoom/1000), prev[1], prev[2]])
    //     // setTranslate([800 + transform.x * (zoom/1000), 250])
    // }

    return (
        <div className={`freedom-prosperity-map container ${mode ? `freedom-prosperity-map--${mode.toLowerCase()}-only` : ''}`}>
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
//                 return getFreedomCategory(f.properties.adm0_iso) === cat
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


// @ts-nocheck
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3';
// import geojsonLow from '../../../data/world-100.geo.json';
import geojson from '../../../data/world-50.geo.json';
import land50 from '../../../data/world-50.geo.json';
import centroids from '../../../data/centroids.geo.json';

import './_map.scss';
import { getDataByISO, getFreedomCategory, getProsperityCategory } from '../../../data/data-util';
import { ProsperityCategoryLiterals } from '../../../@enums/ProsperityCategory';
import { IndexType } from '../../../@enums/IndexType';
import Tooltip from '../Tooltip/Tooltip';
import versor from 'versor';
import topojson from 'topojson-client';

const colorScale = ['rgba(71, 148, 75, 1)', 'rgba(177, 216, 120, 1)', 'rgba(225, 143, 106, 1)', 'rgba(198, 50, 42, 1)', '#e6e6e6'];

interface IMap {
    mode: IndexType | null,
}

const MIN_SCALE = 308;

let projection = d3.geoMercator()
    .scale(MIN_SCALE)
    .center([-40, 80])
    .rotate([-10.5, 0, 0])
    .translate([800, 150])
// .fitExtent([[0, 0], [900, 500]], geojson)

const sensitivity = 100;
const initialScale = projection.scale()

let geoGenerator = d3.geoPath()
    .projection(projection);

function Map(props: IMap) {
    const { mode } = props;
    const map = useRef(null);
    const tooltipNode = useRef(null);
    const [tooltip, setTooltip] = useState(null)

    const height = window.innerHeight;

    const projection = d3['geoMercator']().precision(0.1);


    useEffect(() => {

    }, [])

    useEffect(() => {
        drawMap()
    }, [map, mode])

    const sphere = ({type: "Sphere"})

    function drawMap() {
        const canvas = map.current
        const context = canvas.getContext('2d')
        const width = 1400;
        const height = 1000;
        // const context = DOM.context2d(width, height);
        const path = d3.geoPath(projection, context);

        console.log(context)

        function render(land) {
            context.clearRect(0, 0, width, height);
            context.beginPath(), path(sphere), context.fillStyle = "#fff", context.fill();
            context.beginPath(), path(land), context.fillStyle = "#000", context.fill();
            context.beginPath(), path(sphere), context.stroke();
        }

        return d3.select(context.canvas)
            .call(drag(projection)
                .on("drag.render", () => render(land50))
                .on("end.render", () => render(land50)))
            .call(() => render(land50))
            .node();
    }

    function drag(projection) {
        let v0, q0, r0, a0, l;

        function pointer(event, that) {
            const t = d3.pointers(event, that);

            if (t.length !== l) {
                l = t.length;
                if (l > 1) a0 = Math.atan2(t[1][1] - t[0][1], t[1][0] - t[0][0]);
                dragstarted.apply(that, [event, that]);
            }

            // For multitouch, average positions and compute rotation.
            if (l > 1) {
                const x = d3.mean(t, p => p[0]);
                const y = d3.mean(t, p => p[1]);
                const a = Math.atan2(t[1][1] - t[0][1], t[1][0] - t[0][0]);
                return [x, y, a];
            }

            return t[0];
        }

        function dragstarted(event) {
            v0 = versor.cartesian(projection.invert(pointer(event, this)));
            q0 = versor(r0 = projection.rotate());
        }

        function dragged(event) {
            const p = pointer(event, this);
            const v1 = versor.cartesian(projection.rotate(r0).invert(p));
            const delta = versor.delta(v0, v1);
            let q1 = versor.multiply(q0, delta);

            // For multitouch, compose with a rotation around the axis.
            if (p[2]) {
                const d = (p[2] - a0) / 2;
                const s = -Math.sin(d);
                const c = Math.sign(Math.cos(d));
                q1 = versor.multiply([Math.sqrt(1 - s * s), 0, 0, c * s], q1);
            }

            projection.rotate(versor.rotation(q1));

            // In vicinity of the antipode (unstable) of q0, restart.
            if (delta[0] < 0.7) dragstarted.apply(this, [event, this]);
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged);
    }



    return (
        <div className={`freedom-prosperity-map container ${mode ? `freedom-prosperity-map--${mode.toLowerCase()}-only` : ''}`}>
            <canvas ref={map}></canvas>
            {/* <svg ref={svg}>
                <g className='map__paths'>
                    <g className='map__countries'>

                    </g>
                    <g className='map__centroids'>

                    </g>
                </g>
            </svg> */}
            <div ref={tooltipNode} className='tooltip__container'>
                <Tooltip mode={mode}
                    data={tooltip} />
            </div>
        </div>
    )
}

export default Map




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
//                 return getFreedomCategory(f.properties.adm0_iso) === cat
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