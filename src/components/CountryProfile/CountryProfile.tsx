// @ts-nocheck

import * as d3 from 'd3';
import _, { over } from 'lodash';
import { useEffect, useRef, useState } from "react"
import { FreedomSubIndicator, IndexType } from '../../@enums/IndexType';
import { drawPath, TRANSITION_TIMING } from '../../data/d3-util';
import { formatData } from '../../data/data-util';

import './_country-profile.scss';

interface ICountryProfile {
    selectedCountry: FPData[],
    panelOpen: boolean,
    selectedIndicators: Array<string>,
}

const possibleIndicators = [
    { key: 'Freedom score', indicator: IndexType.FREEDOM, color: 'var(--color--chart-1)' },
    { key: 'Prosperity score', indicator: IndexType.PROSPERITY, color: 'var(--color--chart-2)' },
    { key: 'Income', color: 'var(--color--chart-2)', style: 'dashed' },
    { key: 'Health', color: 'var(--color--chart-2)', style: 'dashed' },
    { key: 'Inequality', color: 'var(--color--chart-2)', style: 'dashed' },
    { key: 'Environment', color: 'var(--color--chart-2)', style: 'dashed' },
    { key: 'Productivity', color: 'var(--color--chart-2)', style: 'dashed' },
    { key: 'Crime', color: 'var(--color--chart-2)', style: 'dashed' },
    { key: 'Education', color: 'var(--color--chart-2)', style: 'dashed' },
    { key: 'Minority Rights', color: 'var(--color--chart-2)', style: 'dashed' },
    { key: FreedomSubIndicator.ECONOMIC, color: 'var(--color--chart--economic-freedom)' },
    { key: 'Womens Economic Freedom', color: 'var(--color--chart--economic-freedom)', style: 'dashed' },
    { key: 'Investment Freedom', color: 'var(--color--chart--economic-freedom)', style: 'dashed' },
    { key: 'Property Rights', color: 'var(--color--chart--economic-freedom)', style: 'dashed' },
    { key: 'Trade Freedom', color: 'var(--color--chart--economic-freedom)', style: 'dashed' },
    { key: FreedomSubIndicator.POLITICAL, color: 'var(--color--chart--political-freedom)' },
    { key: 'Elections', color: 'var(--color--chart--political-freedom)', style: 'dashed' },
    { key: 'Civil Liberties', color: 'var(--color--chart--political-freedom)', style: 'dashed' },
    { key: 'Political Rights', color: 'var(--color--chart--political-freedom)', style: 'dashed' },
    { key: 'Legislative Constraints on the Executive', color: 'var(--color--chart--political-freedom)', style: 'dashed' },
    { key: 'Bureaucracy', color: 'var(--color--chart--political-freedom)', style: 'dashed' },
    { key: 'Corruption', color: 'var(--color--chart--political-freedom)', style: 'dashed' },
    { key: 'Security', color: 'var(--color--chart--political-freedom)', style: 'dashed' },
    { key: FreedomSubIndicator.LEGAL, color: 'var(--color--chart--legal-freedom)' },
    { key: 'Clarity of the Law', color: 'var(--color--chart--legal-freedom)', style: 'dashed' },
    { key: 'Judicial Independence and Effectiveness', color: 'var(--color--chart--legal-freedom)', style: 'dashed' },
].map((d) => (
    {
        ...d,
        indicator: d.indicator ? d.indicator : d.key,
        label: d.label ? d.label : d.key,
    }
))

function CountryProfile(props: ICountryProfile) {
    const { panelOpen, selectedCountry, selectedIndicators } = props;
    const [init, setInit] = useState(false);
    const svg = useRef(null);

    const padding = {
        t: 20,
        b: 50,
        l: 50,
        r: 150,
    }

    const selectedISO = _.get(selectedCountry, '[0].ISO3', null);

    useEffect(() => {
        window.addEventListener("resize", () => handleDrawChart());

        handleDrawChart()

        // remove on unmount
        return () => window.removeEventListener("resize", () => handleDrawChart());
    }, [])

    useEffect(() => {
        handleDrawChart()
    }, [selectedISO, panelOpen, selectedIndicators])

    const handleDrawChart = () => {
        if (selectedISO) {
            import(`./../../data/processed/by-country/${selectedISO}.csv`).then(res => {
                const data = formatData(res.default);
                drawChart(data)
            }).catch((reason) => {
                console.error(reason)
            })
        } else {
            drawChart([])
        }
    }

    const selectedChartIndicators = () => possibleIndicators.filter((type) => {
        return selectedIndicators.includes(type.indicator)
    })

    const drawChart = (data: Array<FPData>) => {
        const height = window.innerHeight - 200;
        const width = window.innerWidth < 1440 ? window.innerWidth - (panelOpen ? 480 : 0)
            : 1440 - (panelOpen ? 480 - (window.innerWidth - 1440)/2 : 0)

        const chart = d3.select(svg.current);

        let allApplicableScores = []
        selectedChartIndicators().forEach((indicator: string) => {
            const range = d3.extent(data.map(row => row[indicator.key])).filter(d => d > -1);
            allApplicableScores.push(range[0], range[1])
        })

        const x = d3.scaleLinear()
            .domain(data.length > 0 ? d3.extent(data.map(row => row['Index Year'])) as Iterable<number> : [1995, 2022])
            .range([padding.l, width - padding.r])

        const yDomain = data.length > 0 && allApplicableScores.length > 0 ? d3.extent(allApplicableScores) as Iterable<number> : [0, 100]

        const y = d3.scaleLinear()
            .domain(yDomain)
            .nice()
            .range([height - padding.b, padding.t])

        const labelPositions = possibleIndicators.map((d) => {
            return {
                key: d.key,
                y: data.length > 0 ? y(data[0][d.key]) : 0,
            }
        }).sort((a, b) => a.y - b.y)

        let overlap = false;
        do {
            overlap = false;
            labelPositions.forEach((label, i) => {
                if (selectedChartIndicators().findIndex(d => d.key === label.key) > -1) {
                    labelPositions.forEach((other, j) => {
                        if (i > j && label.y !== 0) {
                            if (Math.abs(label.y - other.y) < 24) {
                                label.y += 1
                                other.y -= 2

                                overlap = true;
                            }
                        }
                    })
                }
            })
        } while (overlap)

        const getLabelY = (key: string) => {
            return labelPositions.find(d => d.key === key).y
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
            .attr(`transform`, `translate(0, ${height - padding.b})`)
            .transition()
            .duration(TRANSITION_TIMING)
            .call(x_axis);

        chart.selectAll('.x-axis .tick text')
            .style('transform', 'translate(0, 14px)')

        chart.selectAll('.x-axis .domain')
            .remove()

        const y_axis = d3.axisLeft(y)
            .tickFormat(d => d)
            .tickSize(-width + padding.l + padding.r)

        chart.select('.y-axis')
            .attr(`transform`, `translate(${padding.l},0)`)
            .transition()
            .duration(TRANSITION_TIMING)
            .call(y_axis);

        chart.selectAll('.y-axis .tick text')
            .style('transform', 'translate(-10px, 0)')

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
            .data(possibleIndicators)
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
                            .style('stroke-dasharray', d.style === 'dashed' ? '5 3' : '')
                            .style('stroke-width', d.style === 'dashed' ? 1.5 : 5)

                        const label = g.append('g')
                            .attr('class', 'label')
                            .style('opacity', init ? 1 : 0)

                        const labelContainer = label.append('path')
                            .style('fill', d.color)

                        const text = label.append('text')
                            .attr('transform', 'translate(8,3)')
                            .text(d.label)
                            .style('fill', d.style === 'dashed' ? d.color : '#fff')
                            .style('font-weight', d.style === 'dashed' ? 800 : 400)

                        if (d.style !== 'dashed') {
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
        <div className="container country-profile">
            <svg ref={svg}>
                <g className='axis x-axis'>
                </g>
                <g className='axis y-axis'>
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

export default CountryProfile
