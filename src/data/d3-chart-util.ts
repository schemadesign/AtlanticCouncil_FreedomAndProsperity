import * as d3 from 'd3';
import { ChartLabelPosition } from '../@types/chart';

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
    .curve(d3.curveCardinal.tension(0.85));

/*
 * calculate non-overlapping y positions of labels 
*/
export const handleCollisionDetection = (labels: Array<ChartLabelPosition>) => {
    // if label is overlapping another, shift up or down
    let overlap = false;
    const diff = 24;
    labels = labels.sort((a,b) => a.y - b.y)
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


export const labelConnectorPathGenerator = (d, labelPositions: Array<ChartLabelPosition>, x) => {
    try {
        return `M${getLabelX(x)},${getLabelY(labelPositions, d.key)} L${getLabelX(x) - 20 + (d.subindicator ? 5 : 2)},${getLabelY(labelPositions, d.key)} L${getLabelX(x) - 20 + (d.subindicator ? 5 : 2)},${getLabelY(labelPositions, d.key, true)}`
    } catch {
        return ''
    }
}

/*
 * add axes etc
*/
export const setUpChart = (chart: any, height: number, width: number, x: any, y: any, init: boolean) => {

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
        .duration(init ? TRANSITION_TIMING : 0)
        .style('transform', 'translate(-10px, 0)')

    chart.select('.x-axis .axis__label')
        .transition()
        .duration(init ? TRANSITION_TIMING : 0)
        .attr('x', width / 2)
        .attr('y', 50)

    chart.select('.y-axis .axis__label')
        .style('transform', `translate(-40px, ${height / 2 - PADDING.t + 5}px) rotate(-90deg)`)
}