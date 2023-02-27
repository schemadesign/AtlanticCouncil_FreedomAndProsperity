// @ts-nocheck

import * as d3 from 'd3';
import _ from 'lodash';
import { useEffect, useRef, useState } from "react"
import { formatData } from '../../data/data-util';

import './_country-profile.scss';

interface ICountryProfile {
    selectedCountry: FPData[],
    panelOpen: boolean,
}

function CountryProfile(props: ICountryProfile) {
    const { panelOpen, selectedCountry } = props;
    const selectedISO = _.get(selectedCountry, '[0].ISO3', null);
    const [init, setInit] = useState(false);
    const svg = useRef(null);

    useEffect(() => {
        if (selectedISO) {
            import(`./../../data/processed/by-country/${selectedISO}.csv`).then(res => {
                const data = formatData(res.default);
                // setData(formatData(data))
                drawChart(data)
            }).catch((reason) => {
                console.error(reason)
            })
        }
    }, [selectedISO, panelOpen])

    const drawChart = (data: Array<FPData>) => {
        const height = window.innerHeight - 200;
        const width = Math.min(1440, window.innerWidth) - (panelOpen ? 480 - (window.innerWidth - 1440)/2 : 0);
        const padding = {
            t: 0,
            b: 50,
            l: 50,
            r: 100,
        }
        const chart = d3.select(svg.current);

        const freedom = d3.extent(data.map(row => row['Freedom score']))
        const prosperity = d3.extent(data.map(row => row['Prosperity score']))

        const x = d3.scaleLinear()
            .domain(d3.extent(data.map(row => row['Index Year'])) as Iterable<number>)
            .range([padding.l, width - padding.r])

        const yDomain = d3.extent([...freedom, ...prosperity]) as Iterable<number>;
        const y = d3.scaleLinear()
            .domain([yDomain[0] * 0.975, yDomain[1] * 1.025])
            .range([height - padding.b, padding.t])

        chart.attr('viewBox', `0 0 ${width} ${height}`)
            .style('max-height', height)

        const x_axis = d3.axisBottom(x)
            .tickFormat(d => d)
            .tickSize(0)

        chart.select('.x-axis')
            .attr(`transform`, `translate(0, ${height - padding.b})`)
            .transition()
            .duration(500)
            .call(x_axis);

        const y_axis = d3.axisLeft(y)
            .tickFormat(d => d)
            .tickSize(-width + padding.l + padding.r)

        chart.select('.y-axis')
            .attr(`transform`, `translate(${padding.l},${padding.t})`)
            .transition()
            .duration(500)
            .call(y_axis);

        const line = d3.line()
            .x(d => x(d['Index Year']))
            .y(d => y(d['field']))
            .curve(d3.curveCardinal.tension(0.5));

        chart.select('.path--freedom')
            .transition()
            .duration(500)
            .attr('d', line(data.map(row => ({ ...row, field: row['Freedom score'] }))))

        chart.select('.path--prosperity')
            .transition()
            .duration(500)
            .attr('d', line(data.map(row => ({ ...row, field: row['Prosperity score'] }))))

        chart.select('.label--freedom')
            .transition()
            .duration(init ? 500 : 0)
            .style('transform', d => `translate(${x(data[0]['Index Year'])}px,${y(data[0]['Freedom score'])}px )`)

        chart.select('.label--prosperity')
            .transition()
            .duration(init ? 500 : 0)
            .style('transform', d => `translate(${x(data[0]['Index Year'])}px,${y(data[0]['Prosperity score'])}px )`)

        const positionHoverPoint = (d: FPData, key: string) => `translate(${x(d['Index Year']) - 25}px, ${y(d[key]) - 40}px)`

        chart.select('.hover-points--freedom')
            .selectAll('rect')
            .data(data)
            .join(
                enter => enter.append('rect')
                    .style('transform', (d: FPData) => positionHoverPoint(d, 'Prosperity score')),
                update => update.style('transform', (d: FPData) => positionHoverPoint(d, 'Prosperity score'))
            )

        chart.select('.hover-points--prosperity')
            .selectAll('rect')
            .data(data)
            .join(
                enter => enter.append('rect')
                    .style('transform', (d: FPData) => positionHoverPoint(d, 'Freedom score')),
                update => update.style('transform', (d: FPData) => positionHoverPoint(d, 'Freedom score'))
            )

        chart.selectAll('.hover-points')
                .selectAll('rect')
                .attr('width', 50)
                .attr('height', 80)
                .on('mouseenter', (e, d) => {
                    console.log(d)
                })

        setInit(true)
    }

    return (
        <div className="container country-profile">
            <svg ref={svg}>
                <g className='axis x-axis'>

                </g>
                <g className='axis y-axis'>

                </g>
                <g className='paths'>
                    <path className='path--freedom'></path>
                    <path className='path--prosperity'></path>
                </g>
                <g className='label label--freedom'>
                    <path d="M8,-12 h40 a10,10 0 0 1 10,10 v4 a10,10 0 0 1 -10,10 h-40 a10,10 0 0 1 -10,-10 v-4 a10,10 0 0 1 10,-10 z" />
                    <text transform="translate(8,3)">Freedom</text>
                </g>
                <g className='label label--prosperity'>
                    <path d="M8,-10 h45 a10,10 0 0 1 10,10 v4 a10,10 0 0 1 -10,10 h-45 a10,10 0 0 1 -10,-10 v-4 a10,10 0 0 1 10,-10 z" />
                    <text transform="translate(8,5)">Prosperity</text>
                </g>

                <g className='hover-points hover-points--freedom'></g>
                <g className='hover-points hover-points--prosperity'></g>
            </svg>
        </div>
    )
}

export default CountryProfile
