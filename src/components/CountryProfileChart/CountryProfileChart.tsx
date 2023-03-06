import * as d3 from 'd3';
import _ from 'lodash';
import { useEffect, useRef, useState } from "react"
import { IndexType } from '../../@enums/IndexType';
import { ChartLabelPosition, IChartIndicator } from '../../@types/chart';
import { TRANSITION_TIMING, PADDING, getHeight, getWidth, lineGenerator, setUpChart, getLabelX, getLabelY, handleCollisionDetection, labelConnectorPathGenerator, animatePath, initChart, setUpHoverZones, positionTooltip } from '../../data/d3-chart-util';
import { formatData, FLATTENED_INDICATORS, getSelectedFlattenedIndicators, getYDomain } from '../../data/data-util';
import Tooltip from '../Tooltip/Tooltip';

import './_country-profile-chart.scss';

interface ICountryProfileChart {
    selectedCountries: FPData[],
    panelOpen: boolean,
    selectedIndicators: Array<string>,
    isAxisScaled: boolean,
}

function CountryProfileChart(props: ICountryProfileChart) {
    const { panelOpen, selectedCountries, selectedIndicators, isAxisScaled } = props;
    const [data, setData] = useState<Array<FPData>>([])
    const [hoverYear, setHoverYear] = useState<number | null>(null)
    const svg = useRef(null);
    const tooltipNode = useRef(null);

    const selectedISO = () => _.get(selectedCountries, '[0].ISO3', null);

    useEffect(() => {
        initChart(d3.select(svg.current), getWidth(panelOpen));

        // window.addEventListener("resize", () => drawChart());

        // // remove on unmount
        // return () => window.removeEventListener("resize", () => drawChart());
    }, [])

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
    }, [data, panelOpen, selectedIndicators, isAxisScaled])

    const selectedChartIndicators = () => data.length > 0 ? getSelectedFlattenedIndicators(selectedIndicators) : [];

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

        const yDomain = isAxisScaled ? getYDomain(selectedIndicators, data) : [0, 100];
        const xDomain = data.length > 0 ? d3.extent(data.map(row => row['Index Year'])) as Iterable<number> : [1995, 2022];

        const x = d3.scaleLinear()
            .domain(xDomain)
            .range([PADDING.l, width - PADDING.r])

        const y = d3.scaleLinear()
            .domain(yDomain)
            .nice()
            .range([height - PADDING.b, PADDING.t])

        const labelPositions = getLabelPositions(selectedIndicators, data, y);

        setUpChart(chart, height, width, x, y);

        const line = lineGenerator(x, y)

        chart.select('.paths')
            .selectAll('.path-g')
            // @ts-expect-error
            .data(selectedChartIndicators(), d => d.key)
            .join(
                enter => enter.append('g')
                    .attr('class', 'path-g')
                    .each(function (d: IChartIndicator, i) {
                        const g = d3.select(this);

                        g.append('path')
                            .attr('class', 'label-connector')
                            .attr('d', d => labelConnectorPathGenerator(d, labelPositions, x))
                            .each(function () {
                                animatePath(d3.select(this), TRANSITION_TIMING * 3, TRANSITION_TIMING / 4, true)
                            })

                        const path = g.append('path')
                            .attr('class', 'country-path')
                            .style('stroke', d.color)
                            .style('stroke-width', d.subindicator ? 1.5 : 5)
                            // @ts-expect-error
                            .attr('d', d => line(data.map(row => ({ ...row, field: row[d.key] }))))
                            .each(function () {
                                animatePath(d3.select(this), 0, TRANSITION_TIMING * 3, false, d.subindicator)
                            })

                        const label = g.append('g')
                            .attr('class', 'label')

                        label.attr('transform', `translate(${getLabelX(x)},${getLabelY(labelPositions, d.key)})`)
                            .style('opacity', 0)
                            .transition()
                            .duration(TRANSITION_TIMING / 2)
                            .delay(TRANSITION_TIMING * 3)
                            .style('opacity', 1)

                        const labelContainer = label.append('path')
                            .style('fill', d.color)
                            .attr('d', labelConnectorPathGenerator(d, labelPositions, x))

                        const text = label.append('text')
                            .attr('transform', 'translate(8,3)')
                            .text(d.label)
                            .style('fill', d.subindicator ? d.color : '#fff')
                            .style('font-weight', d.subindicator ? 800 : 400)

                        g.select('text, path')

                        if (!d.subindicator) {
                            // @ts-expect-error
                            const dim = text.node().getBBox();
                            labelContainer.attr('d', `M8,-12 h${dim.width} a10,10 0 0 1 10,10 v4 a10,10 0 0 1 -10,10 h-${dim.width} a10,10 0 0 1 -10,-10 v-4 a10,10 0 0 1 10,-10 z`)
                        }
                    })
                , update => update.each(d => {
                    update.select('.country-path')
                        .attr('stroke-dasharray', d.subindicator ? '5 3' : '')
                        .attr('stroke-dashoffset', 0)
                        .transition()
                        .duration(TRANSITION_TIMING)
                        // @ts-expect-error
                        .attr('d', d => line(data.map(row => ({ ...row, field: row[d.key] }))))

                    update.select('.label')
                        .transition()
                        .duration(TRANSITION_TIMING)
                        .attr('transform', (d: any) => `translate(${getLabelX(x)},${getLabelY(labelPositions, d.key)})`)
                        .style('opacity', 1)

                    update.select('.label-connector')
                        .attr("stroke-dasharray", null)
                        .transition()
                        .duration(TRANSITION_TIMING)
                        .attr('d', d => labelConnectorPathGenerator(d, labelPositions, x))
                        .style('opacity', 1)
                })
            )

        const positionDot = (d: FPData, key: string) => `translate(${x(d['Index Year'])}, ${y(d[key])})`

        const handleHover = (e?: any, year?: number) => {
            if (!e || !year) {
                chart.selectAll('.dot')
                    .transition()
                    .duration(TRANSITION_TIMING / 2)
                    .attr('r', 0)

                setHoverYear(null)

                return
            }

            const hoverData = getDataByYear(year);

            if (hoverData) {
                chart.selectAll('.dot')
                    .each(function (indicator: any) {
                        const r = indicator.subindicator ? 4 : 6;

                        d3.select(this)
                            .attr('transform', positionDot(hoverData, indicator.key))
                            .transition()
                            .duration(TRANSITION_TIMING / 2)
                            .attr('r', r)
                })

                setHoverYear(year as number)
                const midY = y(d3.mean(selectedChartIndicators().map(i => hoverData[i.key])) || 0)

                positionTooltip(tooltipNode, x, year as number, height, midY)
            } else {
                setHoverYear(null)
            }
        }

        chart.select('.dots')
            .selectAll('.dot')
            .data(selectedChartIndicators(), (d: any) => d.key)
            .join(
                enter => enter.append('circle')
                    .attr('class', 'dot')
                    .style('fill', d => d.color)
                    .attr('r', 0)
                    .style('pointer-events', 'none')
            )
        
        setUpHoverZones(chart, x, y, handleHover);
    }

    const getDataByYear = (year: number | null): FPData | null => year ? data.find(d => d['Index Year'] === year) || null : null;

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
                <g className='dots'>
                </g>
                <g className='hover-zones'>
                </g>
            </svg>
            <div ref={tooltipNode} className='tooltip__container'>
                <Tooltip
                    data={getDataByYear(hoverYear)}
                    indicators={selectedChartIndicators()}
                    mode={IndexType.COMBINED}
                    countryProfileChart={true}
                />
            </div>
        </div>
    )
}

export default CountryProfileChart
