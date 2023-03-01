// @ts-nocheck
import * as d3 from 'd3';
import _ from 'lodash';
import { useEffect, useRef, useState } from "react"
import { TRANSITION_TIMING, PADDING, getHeight, getWidth, getLabelPositions } from '../../data/d3-util';
import { formatData, FLATTENED_INDICATORS, getSelectedFlattenedIndicators, getYDomain } from '../../data/data-util';
import manifest from './../../data/processed/manifest_by_country.csv';

interface ICompareChart {
    selectedCountry: FPData[],
    panelOpen: boolean,
    selectedIndicators: Array<string>,
}

function    CompareChart(props: ICompareChart) {
    const { panelOpen, selectedIndicators } = props;
    const [init, setInit] = useState(false);
    const svg = useRef(null);

    useEffect(() => {
        window.addEventListener("resize", () => handleDrawChart());

        handleDrawChart()

        // remove on unmount
        return () => window.removeEventListener("resize", () => handleDrawChart());
    }, [])

    useEffect(() => {
        handleDrawChart()
    }, [panelOpen, selectedIndicators])

    const handleDrawChart = () => {
        // console.log(manifest, getSelectedFlattenedIndicators(selectedIndicators))
        // getSelectedFlattenedIndicators(selectedIndicators).forEach((indicator) => {
        //     import(`./../../data/processed/by-indicator/${indicator.key}.csv`).then(res => {
        //         const data = res.default;
        //         console.log(data)
        //     }).catch((reason) => {
        //         console.error(reason)
        //     })
        // })
        // if (selectedISO) {
        //     import(`./../../data/processed/by-country/${selectedISO}.csv`).then(res => {
        //         const data = formatData(res.default);
        //         drawChart(data)
        //     }).catch((reason) => {
        //         console.error(reason)
        //     })
        // } else {
        //     drawChart([])
        // }
    }

    const drawChart = (data: Array<FPData>) => {
        const height = getHeight()
        const width = getWidth(panelOpen)

        const chart = d3.select(svg.current);

        const selectedChartIndicators = getSelectedFlattenedIndicators(selectedIndicators);
        const yDomain = getYDomain(selectedIndicators, data);

        const x = d3.scaleLinear()
            .domain(data.length > 0 ? d3.extent(data.map(row => row['Index Year'])) as Iterable<number> : [1995, 2022])
            .range([PADDING.l, width - PADDING.r])

        const y = d3.scaleLinear()
            .domain(yDomain)
            .nice()
            .range([height - PADDING.b, PADDING.t])

        const labelPositions = getLabelPositions(selectedIndicators, data, y);

        const getLabelY = (key: string) => {
            return labelPositions.find(d => d.key === key)?.y
        }

        const getLabelX = () => {
            if (data[0]) {
                return x(data[0]['Index Year']) + 20
            }

            return 20;
        }

        chart.attr('viewBox', `0 0 ${width} ${height}`)
            .style('max-height', height)

        const x_axis = d3.axisBottom(x)
            .tickFormat(d => d)
            .tickSize(0)

        chart.select('.x-axis')
            .attr(`transform`, `translate(0, ${height - PADDING.b})`)
            .transition()
            .duration(TRANSITION_TIMING)
            .call(x_axis);

        chart.selectAll('.x-axis .tick text')
            .style('transform', 'translate(0, 14px)')

        chart.selectAll('.x-axis .domain')
            .remove()

        const yAxisTicks = y.ticks()
            .filter(tick => Number.isInteger(tick));

        const y_axis = d3.axisLeft(y)
            .tickValues(yAxisTicks)
            .tickFormat(d3.format('d'))
            .tickSize(-width + PADDING.l + PADDING.r)

        chart.select('.y-axis')
            .attr(`transform`, `translate(${PADDING.l},0)`)
            .transition()
            .duration(TRANSITION_TIMING)
            .call(y_axis);

        chart.selectAll('.y-axis .tick text')
            .style('transform', 'translate(-10px, 0)')

        chart.select('.x-axis .axis__label')
            .attr('x', width / 2)
            .attr('y', 50)

        chart.select('.y-axis .axis__label')
            .style('transform', `translate(-40px, ${height/2 - PADDING.t + 5}px) rotate(-90deg)`)

        const line = d3.line()
            .x(d => x(d['Index Year']))
            .y(d => y(d['field']))
            .curve(d3.curveCardinal.tension(0.5));

        const labelConnector = (d) => {
            if (data.length > 0) {
                return `M${getLabelX()},${getLabelY(d.key)} L${x(data[0]['Index Year']) + 5},${getLabelY(d.key)} L${x(data[0]['Index Year']) + 5},${y(data[0][d.key])}`
            }
            return '';
        }

        chart.select('.paths')
            .selectAll('.path-g')
            .data(FLATTENED_INDICATORS)
            .join(
                enter => enter.append('g')
                    .attr('class', 'path-g')
                    .each(function (d, i) {
                        const g = d3.select(this);

                        g.append('path')
                            .attr('class', 'label-connector')
                            .attr('d', labelConnector)
                            .style('opacity', init ? 1 : 0)

                        const path = g.append('path')
                            .attr('class', 'country-path')
                            .style('stroke', d.color)
                            .style('stroke-dasharray', d.subindicator ? '5 3' : '')
                            .style('stroke-width', d.subindicator ? 1.5 : 5)

                        const label = g.append('g')
                            .attr('class', 'label')
                            .style('opacity', init ? 1 : 0)

                        const labelContainer = label.append('path')
                            .style('fill', d.color)

                        const text = label.append('text')
                            .attr('transform', 'translate(8,3)')
                            .text(d.label)
                            .style('fill', d.subindicator ? d.color : '#fff')
                            .style('font-weight', d.subindicator ? 800 : 400)

                        if (!d.subindicator) {
                            const dim = text.node().getBBox();
                            labelContainer.attr('d', `M8,-12 h${dim.width} a10,10 0 0 1 10,10 v4 a10,10 0 0 1 -10,10 h-${dim.width} a10,10 0 0 1 -10,-10 v-4 a10,10 0 0 1 10,-10 z`)
                        }
                    })
                , update => update.style('opacity', d => selectedChartIndicators.findIndex(x => x.key === d.key) > -1 ? 1 : 0)
            )

        if (data.length > 0) {
            if (!init) {
                chart.selectAll('.country-path')
                    .attr('d', d => line(data.map(row => ({ ...row, field: row[d.key] }))))
                    .each(function () {
                        const length = d3.select(this).node().getTotalLength();

                        d3.select(this).attr("stroke-dasharray", length + " " + length)
                            .attr("stroke-dashoffset", -length)
                            .transition()
                            .ease(d3.easeLinear)
                            .attr("stroke-dashoffset", 0)
                            .duration(TRANSITION_TIMING * 3)
                    })

                chart.selectAll('.label')
                    .attr('transform', d => `translate(${getLabelX()},${getLabelY(d.key)})`)
                    .transition()
                    .duration(TRANSITION_TIMING)
                    .delay(TRANSITION_TIMING * 2)
                    .style('opacity', 1)

                chart.selectAll('.label-connector')
                    .transition()
                    .duration(TRANSITION_TIMING)
                    .delay(TRANSITION_TIMING * 3)
                    .attr('d', labelConnector)
                    .style('opacity', 1)

                setInit(true)
            } else {
                chart.selectAll('.country-path')
                    .attr("stroke-dasharray", null)
                    .transition()
                    .duration(TRANSITION_TIMING)
                    .attr('d', d => line(data.map(row => ({ ...row, field: row[d.key] }))))
                    .style('opacity', 1)

                chart.selectAll('.label')
                    .transition()
                    .duration(TRANSITION_TIMING)
                    .attr('transform', d => `translate(${getLabelX()},${getLabelY(d.key)})`)
                    .style('opacity', 1)

                chart.selectAll('.label-connector')
                    .transition()
                    .duration(TRANSITION_TIMING)
                    .attr('d', labelConnector)
                    .style('opacity', 1)
            }
        }


        // const positionHoverPoint = (d: FPData, key: string) => `translate(${x(d['Index Year']) - 25}px, ${y(d[key]) - 40}px)`

        // chart.select('.hover-points--freedom')
        //     .selectAll('rect')
        //     .data(data)
        //     .join(
        //         enter => enter.append('rect')
        //             .style('transform', (d: FPData) => positionHoverPoint(d, 'Prosperity score')),
        //         update => update.style('transform', (d: FPData) => positionHoverPoint(d, 'Prosperity score'))
        //     )

        // chart.select('.hover-points--prosperity')
        //     .selectAll('rect')
        //     .data(data)
        //     .join(
        //         enter => enter.append('rect')
        //             .style('transform', (d: FPData) => positionHoverPoint(d, 'Freedom score')),
        //         update => update.style('transform', (d: FPData) => positionHoverPoint(d, 'Freedom score'))
        //     )

        // chart.selectAll('.hover-points')
        //     .selectAll('rect')
        //     .attr('width', 50)
        //     .attr('height', 80)
        //     .on('mouseenter', (e, d) => {
        //         console.log(d)
        //     })

    }

    return (
        <div className="container country-profile-chart">
            <svg ref={svg}>
                <g className='axis x-axis'>
                    <text className='axis__label'>
                        Year
                    </text>
                </g>
                <g className='axis y-axis'>
                    <text className='axis__label'>
                        Score
                    </text>
                </g>
                <g className='paths'>
                </g>
                <g className='hover-points'>
                    <g className='hover-points hover-points--freedom'></g>
                    <g className='hover-points hover-points--prosperity'></g>
                </g>
            </svg>
        </div>
    )
}

export default CompareChart
