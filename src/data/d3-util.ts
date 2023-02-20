import * as d3 from 'd3';
import geojson from './world.geo.json';
import centroids from './centroids.geo.json';
import { ProsperityCategoryLiterals } from '../@enums/ProsperityCategory';
import { FeatureCollection } from 'geojson';

export const colorScale = ['rgba(71, 148, 75, 1)', 'rgba(177, 216, 120, 1)', 'rgba(225, 143, 106, 1)', 'rgba(198, 50, 42, 1)', '#e6e6e6'];
export const colors = { 'Free': 'rgba(71, 148, 75, 1)', 'Mostly Free': 'rgba(177, 216, 120, 1)', 'Mostly Unfree': 'rgba(225, 143, 106, 1)', 'Unfree': 'rgba(198, 50, 42, 1)' };

export function positionCentroid(parent: any, selection: any, d: any, projection: any, size = 12) {
    let coords = [0, 0]
    let centroid = centroids.features.find(f => f.properties.ISO === d.properties.iso_a2_eh);

    if (centroid) {
        coords = projection(centroid.geometry.coordinates);
    } else {
        coords = getBoundingBoxCenter(parent.select(`path[data-country='${d.properties.adm0_iso}']`));
    }

    selection.attr('cx', coords[0] - size / 2 )
        .attr('cy', coords[1] - size / 2 )
        .attr('r', size)
}

export const getBoundingBoxCenter = (selection: d3.Selection<SVGSVGElement, {}, SVGElement, any>): [number, number] => {
    const element = selection.node();
    if (element) {
        const bbox = element.getBBox();
        return [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
    }
    return [-100, -100]
}

export const fillByProsperity = d3.scaleOrdinal()
    .domain([...ProsperityCategoryLiterals, ''])
    .range(colorScale)

export const getFeatureByISO = (iso: string) => {
    return (geojson as FeatureCollection).features.find((feature: any) => feature.properties.adm0_iso === iso) || {}
}