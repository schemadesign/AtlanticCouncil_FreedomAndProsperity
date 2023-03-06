import * as d3 from 'd3';
import { ChartLabelPosition, IChartIndicator } from '../@types/chart';

export const TRANSITION_TIMING = 500;
export const PADDING = {
    t: 30,
    b: 50,
    l: 50,
    r: 150,
}

export const getHeight = () => window.innerHeight - 200;
export const getWidth = (panelOpen: boolean) => window.innerWidth < 1440 ? window.innerWidth - (panelOpen ? 480 : 0)
    : 1440 - (panelOpen ? 480 - (window.innerWidth - 1440) / 2 : 0)

export const lineGenerator = (x: (val: number) => number, y: (val: number) => number) => d3.line()
    .x((d: any) => x(d['Index Year']))
    .y((d: any) => y(d['field']))
    .curve(d3.curveMonotoneX);

/*
 * calculate non-overlapping y positions of labels 
*/
export const handleCollisionDetection = (labels: Array<ChartLabelPosition>) => {
    // if label is overlapping another, shift up or down
    let overlap = false;
    const diff = 24;
    labels = labels.sort((a, b) => a.y - b.y)
    do {
        overlap = false;
        labels.forEach((label: any, i) => {
            labels.forEach((other: any, j) => {
                if (i > j && label.y !== 0) {
                    if (Math.abs(label.y - other.y) < diff) {
                        if (label.initialY > 300) {
                            label.y += 1
                        } else {
                            other.y -= 1
                        }

                        overlap = true;
                    }
                }
            })
        })

    } while (overlap)

    // if any label is above chart, shift labels down as needed 
    let shift = false;
    do {
        shift = false;
        labels.forEach((label, i) => {
            if (label.y < PADDING.t / 2) {
                shift = true;
                labels.forEach((other, i) => {
                    if (Math.abs(other.y - label.y) < diff) {
                        label.y += 1;
                        other.y += 1;
                    }
                })
            }
        })
    } while (shift)

    return labels;
}

export const getLabelY = (labelPositions: Array<ChartLabelPosition>, key: string, initial = false) => {
    const label = labelPositions.find(d => d.key === key);
    if (label) {
        return label[initial ? 'initialY' : 'y']
    }

    return -30
}

export const getLabelX = (x: any) => {
    return x(x.domain()[1]) + 20
}

/*
*   draw path from line to label
*/
export const labelConnectorPathGenerator = (d: any, labelPositions: Array<ChartLabelPosition>, x: (val: number) => number) => {
    try {
        return `M${getLabelX(x)},${getLabelY(labelPositions, d.key)} L${getLabelX(x) - 20},${getLabelY(labelPositions, d.key)} L${getLabelX(x) - 20},${getLabelY(labelPositions, d.key, true)}`
    } catch {
        return ''
    }
}

/*
 * position elements that shouldn't animate on initialization
*/
export const initChart = (chart: any, width: number) => {
    chart.select('.x-axis .axis__label')
        .attr('x', width / 2)
        .attr('y', 50)
}

/*
 * add axes etc
*/
export const setUpChart = (chart: any, height: number, width: number, x: any, y: any) => {

    chart.attr('viewBox', `0 0 ${width} ${height}`)
        .style('max-height', height)

    const x_axis = d3.axisBottom(x)
        .tickSize(0)

    // @ts-expect-error
    x_axis.tickFormat(d => d)

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
        .filter((tick: number) => Number.isInteger(tick));

    const y_axis = d3.axisLeft(y)
        .tickValues(yAxisTicks)
        .tickSize(-width + PADDING.l + PADDING.r)

    // @ts-expect-error
    y_axis.tickFormat(d3.format('d'))

    chart.select('.y-axis')
        .attr(`transform`, `translate(${PADDING.l},0)`)
        .transition()
        .duration(TRANSITION_TIMING)
        .call(y_axis);

    chart.selectAll('.y-axis .tick text')
        .transition()
        .duration(TRANSITION_TIMING)
        .style('transform', 'translate(-10px, 0)')

    chart.select('.x-axis .axis__label')
        .transition()
        .duration(TRANSITION_TIMING)
        .attr('x', width / 2)
        .attr('y', 50)

    chart.select('.y-axis .axis__label')
        .style('transform', `translate(-40px, ${height / 2 - PADDING.t + 5}px) rotate(-90deg)`)
}

/*
*   animate path drawing from left to right
*/
export function animatePath(selection: any, delay: number, duration: number, rightToLeft?: boolean, dashed?: boolean) {
    const length = selection.node().getTotalLength();

    let dashArray = length + " " + length;

    if (dashed) {
        const dashing = '5, 3'

        let dashLength = dashing
                .split(/[\s,]/)
                .map(function (a) { return parseFloat(a) || 0 })
                .reduce(function (a, b) { return a + b });

        let dashCount = Math.ceil(length / dashLength);

        let newDashes = new Array(dashCount).join(dashing + " ");
        dashArray = newDashes + " 0, " + length;
    }

    selection.attr("stroke-dashoffset", length * (rightToLeft ? 1 : -1))
        .attr("stroke-dasharray", dashArray)
        .transition()
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .delay(delay)
        .duration(duration)
}

/*
*
*/
export function setUpHoverZones(chart: any, x: any, y: any, handleHover: any) {
    let years = [x.domain()[0]];
    while (years[years.length - 1] < x.domain()[1]) {
        years.push(years[years.length - 1] + 1)
    }

    const positionHoverZone = (selection: any, year: number) => {
        const increment = (x.range()[1] - x.range()[0]) / (years.length - 1);
        selection.attr('width', increment)
            .attr('height', y.range()[0])
            .attr('transform', `translate(${-increment / 2}, 0)`)
            .attr('x', x(year))
            .on('mouseenter', (e: any, d: number) => {
                handleHover(e, d)
            })
            .on('mouseleave', () => {
                handleHover(null)
            })
    }

    chart.select('.hover-zones')
        .selectAll('.hover-zones-g')
        .data(years)
        .join(
            // @ts-expect-error
            enter => enter.append('g')
                .attr('class', 'hover-zones-g')
                .attr('data-year', (d: number) => d)
                .each(function (d: number) {
                    // @ts-expect-error
                    const rect = d3.select(this)
                        .append('rect')
                        .style('fill', 'rgb(0,0,0,0)')
                    positionHoverZone(rect, d)
                }),
            // @ts-expect-error
            update => update.each(function (d, i) {

                // @ts-expect-error
                const rect = d3.select(this)
                    .select('rect')

                positionHoverZone(rect, d)
            })
            ,

            // @ts-expect-error
            exit => exit.remove(),
        )
}

/*
*
*/
export const positionTooltip = (tooltipNode: any, x: any, year: number, height: number, midY: number) => {
    const bbox = tooltipNode.current.getBoundingClientRect();
    const tooltipWidth = bbox.width;
    const tooltipHeight = bbox.height;
    let tooltipX = x(year as number) + 40;
    let tooltipY = (midY as number) - tooltipHeight / 2; //y(minY); //y(d[indicator.key]) + 20;

    if (tooltipX + tooltipWidth > window.innerWidth) {
        tooltipX = window.innerWidth - (tooltipWidth * 2) - 40
    }

    if (tooltipY + tooltipHeight > height - PADDING.b) {
        tooltipY = height - tooltipHeight - 40;
    }

    if (tooltipNode.current) {
        tooltipNode.current.style.left = tooltipX + 'px';
        tooltipNode.current.style.top = tooltipY + 'px';
    }
}