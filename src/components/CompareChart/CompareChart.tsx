import * as d3 from 'd3';
import _ from 'lodash';
import { useEffect, useRef, useState } from "react"
import { IndexType } from '../../@enums/IndexType';
import { ChartLabelPosition } from '../../@types/chart';
import { TRANSITION_TIMING, PADDING, getHeight, getWidth, lineGenerator, setUpChart, getLabelX, getLabelY, handleCollisionDetection, labelConnectorPathGenerator } from '../../data/d3-chart-util';
import { formatData, getSelectedFlattenedIndicators, getYDomain } from '../../data/data-util';
import Tooltip from '../FreedomAndProsperityMap/Tooltip/Tooltip';

interface ICompareChart {
    selectedCountries: FPData[],
    panelOpen: boolean,
    selectedIndicators: Array<string>,
}

interface ICompareChartDatasets {
    [key: string]: Array<FPData>,
}

function CompareChart(props: ICompareChart) {
    const { panelOpen, selectedCountries, selectedIndicators } = props;
    const [data, setData] = useState<ICompareChartDatasets>({})
    const [hoverData, setHoverData] = useState(null)
    const [hoverIndicator, setHoverIndicator] = useState([])
    const [assignedColors, setAssignedColors] = useState({})
    const svg = useRef(null);
    const tooltipNode = useRef(null);

    const onlyIndicator = selectedIndicators[0] || '';

    // useEffect(() => {
    //     window.addEventListener("resize", drawChart);

    //     drawChart()

    //     // remove on unmount
    //     return () => window.removeEventListener("resize", drawChart);
    // }, [])

    function getData() {
        let files: Array<string> = [];

        setAssignedColors((prev: ICompareChartDatasets) => {
            const updated: ICompareChartDatasets = {};
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
                setAssignedColors(prev => {
                    const colors = [1, 2, 3, 4, 5].filter(d => (
                        !Object.values(prev).includes(d)
                    ))

                    return {
                        ...prev,
                        [country.ISO3]: colors[0] || ((Object.keys(prev).length) % 5 + 1) // `var(--color--chart--${(Object.keys(prev).length + 1) % 5})`
                    }
                })
                files.push(`./../../data/processed/by-country/${country.ISO3}.csv`)
            }
        })

        files.map((file: string) =>
            import(file).then(res => {
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
            }).catch((reason) => {
                console.error(reason)
            })
        )
    }

    useEffect(() => {
        getData()
    }, [selectedCountries])

    useEffect(() => {
        drawChart()
    }, [data, panelOpen, selectedIndicators])

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

    console.log(selectedIndicators)

    const getColorFromIndex = (i: number) => {
        return `var(--color--chart--${i})`
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

        const yDomain = [d3.min(yVals) || 0, d3.max(yVals) || 100]
        const xDomain = [d3.min(xVals) || 1995, d3.max(xVals) || 2022]

        const x = d3.scaleLinear()
            .domain(xDomain)
            .range([PADDING.l, width - PADDING.r])

        const y = d3.scaleLinear()
            .domain(yDomain)
            .nice()
            .range([height - PADDING.b, PADDING.t])

        setUpChart(chart, height, width, x, y, true);

        const line = lineGenerator(x, y)

        const definedData: Array<FPData> = Object.values(data).filter((dataset: Array<FPData>) => {
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
                            .style('stroke', getColorFromIndex(assignedColors[thisData[0].ISO3 as keyof typeof assignedColors]))

                        // @ts-expect-error
                        path.attr('d', line(generalizedData))
                            .each(function () {
                                // @ts-expect-error
                                const length = d3.select(this).node().getTotalLength();

                                d3.select(this)
                                    .attr("stroke-dasharray", length + " " + length)
                                    .attr("stroke-dashoffset", -length)
                                    .transition()
                                    .ease(d3.easeLinear)
                                    .attr("stroke-dashoffset", 0)
                                    .duration(TRANSITION_TIMING * 3)
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
            .data(labelPositions, d => d.key)
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
                                const length = d3.select(this).node().getTotalLength();

                                d3.select(this).attr("stroke-dasharray", length + " " + length)
                                    .attr("stroke-dashoffset", length)
                                    .transition()
                                    .ease(d3.easeLinear)
                                    .attr("stroke-dashoffset", 0)
                                    .delay(TRANSITION_TIMING * 3)
                                    .duration(TRANSITION_TIMING / 4)
                            })

                        const label = g.append('g')
                            .attr('class', 'label')

                        const labelContainer = label.append('path')
                            .style('fill', getColorFromIndex(assignedColors[d.key]))

                        const text = label.append('text')
                            .attr('transform', 'translate(8,3)')
                            .text(d.label)
                            .style('font-weight', 800)

                        label.attr('transform', `translate(${getLabelX(x)},${getLabelY(labelPositions, d.key)})`)
                            .style('opacity', 0)
                            .transition()
                            .delay(TRANSITION_TIMING * 2)
                            .duration(TRANSITION_TIMING)
                            .style('opacity', 1)

                        const dim = text.node().getBBox();
                        labelContainer.attr('d', `M8,-12 h${dim.width} a10,10 0 0 1 10,10 v4 a10,10 0 0 1 -10,10 h-${dim.width} a10,10 0 0 1 -10,-10 v-4 a10,10 0 0 1 10,-10 z`)
                    })
                , update => update.each(function (d: any, i) {
                    const g = d3.select(this);

                    g.select('.label')
                        .style('opacity', 1)
                        .transition()
                        .duration(TRANSITION_TIMING)
                        .attr('transform', d => `translate(${getLabelX(x)},${getLabelY(labelPositions, d.key)})`)

                    g.select('.label-connector')
                        .attr("stroke-dasharray", null)
                        .transition()
                        .duration(TRANSITION_TIMING)
                        .attr('d', d => labelConnectorPathGenerator(d, labelPositions, x))
                }),
                exit => exit.remove()
            )

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
                <g className='labels'>
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
                />
            </div>
        </div>
    )
}

export default CompareChart
