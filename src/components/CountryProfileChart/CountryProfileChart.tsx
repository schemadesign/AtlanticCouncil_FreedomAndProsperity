import * as d3 from 'd3';
import _ from 'lodash';
import { useEffect, useRef, useState } from "react"
import { IndexType } from '../../@enums/IndexType';
import { ChartLabelPosition } from '../../@types/chart';
import { TRANSITION_TIMING, PADDING, getHeight, getWidth, lineGenerator, setUpChart, getLabelX, getLabelY, handleCollisionDetection, labelConnectorPathGenerator } from '../../data/d3-chart-util';
import { formatData, FLATTENED_INDICATORS, getSelectedFlattenedIndicators, getYDomain } from '../../data/data-util';
import Tooltip from '../FreedomAndProsperityMap/Tooltip/Tooltip';

import './_country-profile-chart.scss';

interface ICountryProfileChart {
    selectedCountries: FPData[],
    panelOpen: boolean,
    selectedIndicators: Array<string>,
}

function CountryProfileChart(props: ICountryProfileChart) {
    const { panelOpen, selectedCountries, selectedIndicators } = props;
    const [init, setInit] = useState(false);
    const [data, setData] = useState<Array<FPData>>([])
    const [hoverData, setHoverData] = useState(null)
    const [hoverIndicators, setHoverIndicators] = useState([])
    const svg = useRef(null);
    const tooltipNode = useRef(null);

    const selectedISO = () => _.get(selectedCountries, '[0].ISO3', null);

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
    }, [selectedCountries])

    useEffect(() => {
        drawChart()
    }, [data, panelOpen, selectedIndicators])

    const selectedChartIndicators = () => getSelectedFlattenedIndicators(selectedIndicators);

    const getLabelPositions = (selectedIndicators: Array<string>, data: Array<FPData>, y: (val: number) => number): Array<ChartLabelPosition> => {
        let labelPositions = FLATTENED_INDICATORS.map((d) => {
            const yVal = data.length > 0 ? y(data[0][d.key]) : 0;
            return {
                key: d.key,
                y: yVal,
                initialY: yVal,
            }
        })
    
        const visibleIndicators = getSelectedFlattenedIndicators(selectedIndicators);
        const visibleLabels = labelPositions.filter((label: any) => {
            return visibleIndicators.findIndex(d => d.key === label.key) > -1
        })

        handleCollisionDetection(visibleLabels).forEach((d) => {
            const i = labelPositions.findIndex(label => label.key === d.key);
            labelPositions[i] = d;
        })
    
        return labelPositions;
    }

    const drawChart = () => {
        const { panelOpen, selectedIndicators } = props;
        const height = getHeight()
        const width = getWidth(panelOpen)

        const chart = d3.select(svg.current);

        const yDomain = getYDomain(selectedIndicators, data);
        const xDomain = data.length > 0 ? d3.extent(data.map(row => row['Index Year'])) as Iterable<number> : [1995, 2022];

        const x = d3.scaleLinear()
            .domain(xDomain)
            .range([PADDING.l, width - PADDING.r])

        const y = d3.scaleLinear()
            .domain(yDomain)
            .nice()
            .range([height - PADDING.b, PADDING.t])

        const labelPositions = getLabelPositions(selectedIndicators, data, y);

        setUpChart(chart, height, width, x, y, init);

        const line = lineGenerator(x, y)

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
                            .attr('d', d => labelConnectorPathGenerator(d, labelPositions, x))
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
                    .attr('transform', d => `translate(${getLabelX(x)},${getLabelY(labelPositions, d.key)})`)
                    .transition()
                    .duration(TRANSITION_TIMING)
                    .delay(TRANSITION_TIMING * 2)
                    .style('opacity', 1)

                chart.selectAll('.label-connector')
                    .transition()
                    .duration(TRANSITION_TIMING)
                    .delay(TRANSITION_TIMING * 3)
                    .attr('d', d => labelConnectorPathGenerator(d, labelPositions, x))
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
                    .attr('transform', d => `translate(${getLabelX(x)},${getLabelY(labelPositions, d.key)})`)
                    .style('opacity', 1)

                chart.selectAll('.label-connector')
                    .transition()
                    .duration(TRANSITION_TIMING)
                    .attr('d', d => labelConnectorPathGenerator(d, labelPositions, x))
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
            setHoverIndicators([indicator])

            const tooltipWidth = 180; 
            const tooltipHeight = 150;
            let tooltipX = x(d['Index Year']) + 40;
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
                    indicators={hoverIndicators}
                    mode={IndexType.COMBINED}
                    countryProfileChart={true}
                />
            </div>
        </div>
    )
}

export default CountryProfileChart
