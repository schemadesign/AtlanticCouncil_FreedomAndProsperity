import * as d3 from 'd3';
import _ from 'lodash';
import { useEffect, useRef, useState } from "react"
import { ChartLabelPosition } from '../../@types/chart';
import { TRANSITION_TIMING, PADDING, getHeight, getWidth, lineGenerator, setUpChart, getLabelX, getLabelY, handleCollisionDetection, labelConnectorPathGenerator, animatePath, initChart, setUpHoverZones, positionTooltip, wrap, drawLabelContainer } from '../../data/d3-chart-util';
import { formatData, getYDomain } from '../../data/data-util';
import CompareTooltip from '../Tooltip/CompareTooltip/CompareTooltip';

import './_country-compare-chart.scss';

interface ICompareChart {
    selectedCountries: FPData[],
    panelOpen: boolean,
    selectedIndicators: Array<string>,
    isAxisScaled: boolean,
}

interface ICompareChartDatasets {
    [key: string]: Array<FPData>,
}

export interface IAssignedColorDictionary {
    [key: string]: string,
}

const COLORS = [1, 2, 3, 4, 5];

function CompareChart(props: ICompareChart) {
    const { panelOpen, selectedCountries, selectedIndicators, isAxisScaled } = props;
    const [data, setData] = useState<ICompareChartDatasets>({})
    const [hoverYear, setHoverYear] = useState<number | null>(null)
    const [assignedColors, setAssignedColors] = useState<IAssignedColorDictionary>({})
    const svg = useRef(null);
    const tooltipNode = useRef(null);

    const onlyIndicator = selectedIndicators[0] || '';

    useEffect(() => {
        const initColors: IAssignedColorDictionary = {}
        selectedCountries.forEach((country, i) => {
            initColors[country.ISO3] = getColorFromIndex(COLORS[i % COLORS.length] + 1)
        })

        setAssignedColors(initColors)

        initChart(d3.select(svg.current), getWidth(panelOpen));

        // window.addEventListener("resize", () => drawChart());

        // // remove on unmount
        // return () => window.removeEventListener("resize", () => drawChart());
    }, [])

    const getColorFromIndex = (i: number) => {
        return `var(--color--chart--${i})`
    }
    
    function getData() {
        setAssignedColors((prev: IAssignedColorDictionary) => {
            const updated: IAssignedColorDictionary = {};
            selectedCountries.forEach(country => {
                if (prev[country.ISO3]) {
                    updated[country.ISO3] = prev[country.ISO3]
                }
            })

            return updated;
        })

        // delete removed countries
        setData(prev => {
            let updated: ICompareChartDatasets = {}

            selectedCountries.forEach((country) => {
                if (prev[country.ISO3]) {
                    updated[country.ISO3] = prev[country.ISO3]
                }
            })

            return updated
        })

        selectedCountries.forEach((country: FPData) => {
            if (!data[country.ISO3]) {
                setAssignedColors((prev: IAssignedColorDictionary) => {
                    const colors = COLORS.filter(d => (
                        !Object.values(prev).includes(getColorFromIndex(d))
                    ))

                    const next = colors[0] || ((Object.keys(prev).length) % COLORS.length) + 1;

                    return {
                        ...prev,
                        [country.ISO3]: getColorFromIndex(next),
                    }
                })

                import(`./../../data/processed/by-country/${country.ISO3}.csv`).then(res => {
                    const hasData = res.default.find((d: FPData) => d[onlyIndicator] > -1)

                    if (hasData) {
                        setData((prev: ICompareChartDatasets) => {
                            const formatted = formatData(res.default, true);
                            let updated: ICompareChartDatasets = {}
        
                            selectedCountries.forEach((country) => {
                                if (prev[country.ISO3]) {
                                    updated[country.ISO3] = prev[country.ISO3]
                                }
                            })
        
                            return {
                                ...updated,
                                [formatted[0].ISO3]: formatted,
                            }
                        })
                    }
                }).catch((reason) => {
                    console.error(reason)
                })
            }
        })
    }

    useEffect(() => {
        getData()
    }, [selectedCountries])

    useEffect(() => {
        drawChart()
    }, [data, panelOpen, selectedIndicators, isAxisScaled])

    const getLabelPositions = (onlyIndicator: string, data: Array<Array<FPData>>, y: (val: number) => number): Array<ChartLabelPosition> => {
        let labelPositions = data.map((countryDataset: Array<FPData>) => {
            const yVal = data.length > 0 ? y(countryDataset[0][onlyIndicator]) : -20;
            return {
                key: countryDataset[0].ISO3,
                label: countryDataset[0].Name,
                y: yVal,
                initialY: yVal,
            }
        })

        return handleCollisionDetection(labelPositions)
    }

    const drawChart = () => {
        const { panelOpen, selectedIndicators } = props;
        const height = getHeight()
        const width = getWidth(panelOpen)

        const chart = d3.select(svg.current);

        let yVals: Array<number> = [];
        let xVals: Array<number> = [];
        Object.values(data).map((dataset: Array<FPData>) => {
            yVals = [...yVals, ...getYDomain(selectedIndicators, dataset)]
            xVals = [...xVals, ...d3.extent(dataset.map(row => row['Index Year'])) as Iterable<number>]
        })

        const yDomain = isAxisScaled ? [d3.min(yVals) || 0, d3.max(yVals) || 100] : [0, 100]
        const xDomain = [d3.min(xVals) || 1995, d3.max(xVals) || 2022]

        const x = d3.scaleLinear()
            .domain(xDomain)
            .range([PADDING.l, width - PADDING.r])

        const y = d3.scaleLinear()
            .domain(yDomain)
            .nice()
            .range([height - PADDING.b, PADDING.t])

        setUpChart(chart, height, width, x, y);

        const line = lineGenerator(x, y)

        const definedData: Array<Array<FPData>> = Object.values(data).filter((dataset: Array<FPData>) => {
            return dataset.findIndex(d => d[onlyIndicator] > -1) > -1
        })

        chart.select('.paths')
            .selectAll('.path-g')
            // @ts-expect-error
            .data(definedData, (d: Array<FPData>) => `${d[0].ISO3 + onlyIndicator}`)
            .join(
                enter => enter.append('g')
                    .attr('class', 'path-g')
                    .attr('data-iso', d => d[0].ISO3)
                    .each(function (thisData, i) {
                        const g = d3.select(this)
                        const generalizedData = thisData.map(row => ({ ...row, field: row[onlyIndicator] || -1 }));

                        const path = g.append('path')
                            .attr('class', 'country-path')
                            .style('stroke', assignedColors[thisData[0].ISO3 as keyof typeof assignedColors])

                        // @ts-expect-error
                        path.attr('d', line(generalizedData))
                            .each(function () {
                                animatePath(d3.select(this), 0, TRANSITION_TIMING * 3)
                            })
                    })
                , update => update.each(function (thisData: Array<FPData>, i) {
                    const g = d3.select(this);
                    const path = g.select('.country-path');
                    const generalizedData = thisData.map(row => ({ ...row, field: row[onlyIndicator] || -1 }));

                    path.attr("stroke-dasharray", null)
                        .transition()
                        .duration(TRANSITION_TIMING)
                        // @ts-expect-error
                        .attr('d', line(generalizedData))
                }),
                exit => exit.remove()
            )

        const labelPositions = getLabelPositions(onlyIndicator, definedData, y);

        chart.select('.labels')
            .selectAll('.label-g')
            .data(labelPositions, (d: any) => d.key)
            .join(
                enter => enter.append('g')
                    .attr('class', 'label-g')
                    .attr('data-iso', d => d.key)
                    .each(function (d, i) {
                        const g = d3.select(this)

                        g.append('path')
                            .attr('class', 'label-connector')
                            .attr('d', d => labelConnectorPathGenerator(d, labelPositions, x))
                            .each(function () {
                                animatePath(d3.select(this), TRANSITION_TIMING * 3, TRANSITION_TIMING / 4, true)
                            })

                        const label = g.append('g')
                            .attr('class', 'label')

                        const labelContainer = label.append('path')
                            .style('fill', assignedColors[d.key])

                        const text = label.append('text')
                            .attr('transform', 'translate(8,3)')
                            .attr('x', 0)
                            .attr('y', 0)
                            .text(d.label)
                            .style('font-weight', 400)
                            .call(wrap)

                        label.attr('transform', `translate(${getLabelX(x)},${getLabelY(labelPositions, d.key)})`)
                            .style('opacity', 0)
                            .transition()
                            .delay(TRANSITION_TIMING * 2)
                            .duration(TRANSITION_TIMING)
                            .style('opacity', 1)

                        drawLabelContainer(text.node(), labelContainer)
                })
                , update => update.each(function (d: any, i) {
                    const g = d3.select(this);

                    g.select('.label')
                        .style('opacity', 1)
                        .transition()
                        .duration(TRANSITION_TIMING)
                        .attr('transform', (d: any) => `translate(${getLabelX(x)},${getLabelY(labelPositions, d.key)})`)
                        .style('opacity', 1)

                    g.select('.label-connector')
                        .attr("stroke-dasharray", null)
                        .transition()
                        .duration(TRANSITION_TIMING)
                        .attr('d', d => labelConnectorPathGenerator(d, labelPositions, x))
                }),
                exit => exit.remove()
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

            if (selectedCountries.length > 0 && onlyIndicator && hoverData) {
                setHoverYear(year)

                let midY = height/2;
                positionTooltip(tooltipNode, x, year, height, midY)

                chart.selectAll('.dot')
                    .each(function (country: any) {
                        const r = 6;

                        const d = hoverData.find(d => d.ISO3 === country.ISO3)

                        if (d) {
                            d3.select(this)
                                .attr('transform', positionDot(d, onlyIndicator))
                                .transition()
                                .duration(TRANSITION_TIMING / 2)
                                .attr('r', r)
                        }
                })

            } else {
                setHoverYear(null)
            }
        }

        chart.select('.dots')
            .selectAll('.dot')
            .data(selectedCountries, (d: any) => d.ISO3)
            .join(
                enter => enter.append('circle')
                    .attr('class', 'dot')
                    .style('fill', d => assignedColors[d.ISO3])
                    .attr('r', 0)
                    .style('pointer-events', 'none'),
                update => update.style('fill', d => assignedColors[d.ISO3])
            )

        setUpHoverZones(chart, x, y, handleHover);
    }

    const getDataByYear = (year: number | null): Array<FPData> | null => {
        if (!year) {
            return null;
        }
        let hoverData: Array<FPData> = []
        Object.keys(data).forEach((iso: string) => {
            const thisYear: FPData | undefined = data[iso].find(d => d['Index Year'] === year);

            if (thisYear) {
                hoverData.push(thisYear)
            }
        })
        
        // TODO
        // follow up about sort order
        // sort by most recent score:
        // hoverData = hoverData.sort((a, b) => data[b.ISO3][0][onlyIndicator] - data[a.ISO3][0][onlyIndicator])
        // or sort by score at hover year:
        hoverData = hoverData.sort((a, b) => b[onlyIndicator] - a[onlyIndicator])

        if (!hoverData) {
            return null;
        }
        return hoverData;
    }

    return (
        <div className="container country-compare-chart">
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
                <g className='labels'>
                </g>
                <g className='paths'>
                </g>
                <g className='dots'>
                </g>
                <g className='hover-zones'>
                </g>
            </svg>
            <div ref={tooltipNode} className='tooltip__container'>
                <CompareTooltip title={hoverYear}
                    data={getDataByYear(hoverYear)}
                    indicator={onlyIndicator}
                    assignedColors={assignedColors}
                    />
            </div>
        </div>
    )
}

export default CompareChart
