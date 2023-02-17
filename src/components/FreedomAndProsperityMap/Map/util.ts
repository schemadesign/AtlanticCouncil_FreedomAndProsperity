import d3 from 'd3';

export const getBoundingBoxCenter = (selection: d3.Selection<SVGSVGElement, {}, SVGElement, any>): [number, number] => {
    const element = selection.node();
    if (element) {
        const bbox = element.getBBox();
        return [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
    } 
    return [-100, -100]
}