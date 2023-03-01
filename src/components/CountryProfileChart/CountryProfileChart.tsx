// @ts-nocheck
import * as d3 from 'd3';
import _, { update } from 'lodash';
import { useEffect, useRef, useState } from "react"
import { IndexType } from '../../@enums/IndexType';
import { TRANSITION_TIMING, PADDING, getHeight, getWidth, getLabelPositions } from '../../data/d3-util';
import { formatData, FLATTENED_INDICATORS, getSelectedFlattenedIndicators, getYDomain } from '../../data/data-util';
import Tooltip from '../FreedomAndProsperityMap/Tooltip/Tooltip';

import './_country-profile-chart.scss';

interface ICountryProfile {
    selectedCountry: FPData[],
    panelOpen: boolean,
    selectedIndicators: Array<string>,
}

function CountryProfile(props: ICountryProfile) {
    const { panelOpen, selectedCountry, selectedIndicators } = props;
    const [init, setInit] = useState(false);
    const [data, setData] = useState([])
    const [hoverData, setHoverData] = useState(null)
    const [hoverIndicator, setHoverIndicator] = useState([])
    const svg = useRef(null);
    const tooltipNode = useRef(null);

    const selectedISO = () => _.get(selectedCountry, '[0].ISO3', null);

    // useEffect(() => {
    //     window.addEventListener("resize", drawChart);

    //     drawChart()

    //     // remove on unmount
    //     return () => window.removeEventListener("resize", drawChart);
    // }, [])

    useEffect(() => {
        const iso = selectedISO();
        if (iso) {
            import(`./../../data/processed/by-country/${iso}.csv`).then(res => {
                const data = formatData(res.default);
                setData(data);
            }).catch((reason) => {
                console.error(reason)
            })
        }
    }, [selectedCountry])

    useEffect(() => {
        drawChart()
    }, [data, panelOpen, selectedIndicators])

    const selectedChartIndicators = () => getSelectedFlattenedIndicators(selectedIndicators);

    const drawChart = () => {
        const { panelOpen, selectedIndicators } = props;
        const height = getHeight()
        const width = getWidth(panelOpen)

        const chart = d3.select(svg.current);

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
            .transition()
            .duration(init ? TRANSITION_TIMING : 0)
            .style('transform', 'translate(-10px, 0)')

        chart.select('.x-axis .axis__label')
            .transition()
            .duration(init ? TRANSITION_TIMING : 0)
            .attr('x', width / 2)
            .attr('y', 50)

        chart.select('.y-axis .axis__label')
            .style('transform', `translate(-40px, ${height / 2 - PADDING.t + 5}px) rotate(-90deg)`)

        const line = d3.line()
            .x(d => x(d['Index Year']))
            .y(d => y(d['field']))
            .curve(d3.curveCardinal.tension(0.85));

        const labelConnector = (d) => {
            if (data.length > 0) {
                return `M${getLabelX()},${getLabelY(d.key)} L${x(data[0]['Index Year']) + (d.subindicator ? 5 : 2)},${getLabelY(d.key)} L${x(data[0]['Index Year']) + (d.subindicator ? 5 : 2)},${y(data[0][d.key])}`
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
                , update => update.style('opacity', d => selectedChartIndicators().findIndex(x => x.key === d.key) > -1 ? 1 : 0)
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
        } else {
            chart.selectAll('.country-path')
                .attr('d', null)

            chart.selectAll('.label')
                .style('opacity', 0)

            chart.selectAll('.label-connector')
                .attr('d', null)
        }

        const positionHoverPoint = (d: FPData, key: string) => `translate(${x(d['Index Year'])}px, ${y(d[key])}px)`

        const handleTooltipHover = (e, d, indicator) => {
            chart.selectAll('.hover-points-g > g')
                .filter(g => g['Index Year'] === d['Index Year'])
                .selectAll('circle')
                .transition()
                .duration(TRANSITION_TIMING / 2)
                .attr('r', 6)

            setHoverData(d)
            setHoverIndicator([indicator])

            const tooltipWidth = 180; 
            const tooltipHeight = 150;
            let tooltipX = x(d['Index Year']) + 30;
            let tooltipY = y(d[indicator.key]) + 20;
            
            if (tooltipX > width - tooltipWidth) {
                tooltipX -= tooltipWidth
            }

            if (tooltipY > height/2) {
                tooltipY -= tooltipHeight;
            }

            tooltipNode.current.style.left = tooltipX + 'px';
            tooltipNode.current.style.top = tooltipY + 'px';
        }

        const hoverPointSize = () => {
            return width / data.length
        }

        const styleHoverPoint = (selection, indicator) => {
            selection.style('fill', 'rgba(0,0,0,0)')
                .attr('width', hoverPointSize())
                .attr('height', 30)
                .attr('y', hoverPointSize() * -0.5)
                .attr('x', 30 * -0.5)
                .on('mouseover', function (e, d) {
                    handleTooltipHover(e, d, indicator)
                })
                .on('mouseleave', () => {
                    setHoverData(null);
                    chart.selectAll('.hover-points-g')
                        .selectAll('circle')
                        .transition()
                        .duration(TRANSITION_TIMING / 2)
                        .attr('r', 0)
                })
        }

        chart.select('.hover-points')
            .selectAll('.hover-points-g')
            .data(selectedChartIndicators())
            .join(
                enter => enter.append('g')
                    .attr('class', 'hover-points-g'),
                update => update,
                exit => exit.remove(),
            )
            .each(function (indicator) {
                d3.select(this)
                    .selectAll('g')
                    .data(data)
                    .join(
                        enter => enter
                            .append('g')
                            .style('transform', (d: FPData) => positionHoverPoint(d, indicator.key))
                            .each(function (d, i) {
                                // stagger entry to prevent hover before first draw
                                setTimeout(() => {
                                    const rect = d3.select(this)
                                        .append('rect')
                                    styleHoverPoint(rect, indicator)
                                }, ((TRANSITION_TIMING * 3) / data.length) * (data.length - i))

                                d3.select(this)
                                    .append('circle')
                                    .style('fill', indicator.color)
                                    .style('pointer-events', 'none')
                            }),
                        update => update.style('transform', (d: FPData) => positionHoverPoint(d, indicator.key))
                            .each(function (d) {
                                styleHoverPoint(d3.select(this).select('rect'), indicator)

                                d3.select(this)
                                    .select('circle')
                                    .style('fill', indicator.color)
                            }),
                        exit => exit.remove(),
                    )
            })

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
                </g>
            </svg>
            <div ref={tooltipNode} className='tooltip__container'>
                <Tooltip
                    data={hoverData}
                    indicators={hoverIndicator}
                    mode={IndexType.COMBINED}
                    countryProfile={true}
                />
            </div>
        </div>
    )
}

export default CountryProfile
