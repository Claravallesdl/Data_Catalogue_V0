import React, { useRef, useCallback, useEffect } from 'react';
import * as d3 from 'd3';
import { DashboardRecord, FilterState, HierarchyNode, HierarchyField } from '../../types';
import './SunburstChart.css';

interface SunburstChartProps {
  data: DashboardRecord[];
  filters: FilterState;
  activeHierarchy: HierarchyField[];
  forceLabels?: boolean;
  onHover?: (node: d3.HierarchyRectangularNode<HierarchyNode> | null) => void;
  onNodeClick?: (filters: Partial<Record<keyof FilterState, string>>) => void;
}

export const SunburstChart: React.FC<SunburstChartProps> = ({ data, activeHierarchy, forceLabels = false, onHover, onNodeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const getDisplayName = (name: string) => {
    if (name === 'Met') return 'Metastatic Tumor Biopsy';
    if (name === 'Prim') return 'Primary Tumor Biopsy';
    return name.replace(/\s*\(.*?\)$/, '').replace(/_/g, ' ');
  };

  const buildHierarchy = useCallback((): HierarchyNode => {
    const root: HierarchyNode = { name: "Root", children: [] };

    data.forEach(patient => {
      let currentNode = root;
      activeHierarchy.forEach((layer) => {
        const val = patient[layer];
        const key = Array.isArray(val) ? (val.length > 0 ? val.join(', ') : 'None') : (val as string || 'Unknown');
        
        if (!currentNode.children) currentNode.children = [];
        
        let child = currentNode.children.find(c => c.name === key);
        if (!child) {
          child = { name: key, children: [] };
          currentNode.children.push(child);
        }
        currentNode = child;
      });
      currentNode.value = (currentNode.value || 0) + 1;
    });

    return root;
  }, [data, activeHierarchy]);

  const drawChart = useCallback(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const margin = 15;
    const maxRadius = Math.min(width, height) / 2 - margin;
    
    const numLayers = activeHierarchy.length;
    const centerRadius = 88; 
    const availableRingSpace = maxRadius - centerRadius;
    const ringWidth = Math.max(30, availableRingSpace / Math.max(1, numLayers || 1));
    
    const hierarchyData = buildHierarchy();
    const root = d3.hierarchy(hierarchyData)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const partition = d3.partition<HierarchyNode>()
      .size([2 * Math.PI, 1]); 

    const arc = d3.arc<d3.HierarchyRectangularNode<HierarchyNode>>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.012))
      .padRadius(centerRadius)
      .innerRadius(d => centerRadius + (d.depth - 1) * ringWidth)
      .outerRadius(d => centerRadius + d.depth * ringWidth - 1);

    const uniquePatientsCount = new Set(data.map(d => d.sap)).size;
    
    const layerColors = [
      'var(--chart-color-1)',
      'var(--chart-color-2)',
      'var(--chart-color-3)',
      'var(--chart-color-4)',
      'var(--chart-color-5)',
      'var(--chart-color-6)',
    ];

    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('font-family', 'Inter, sans-serif')
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Center Display
    const center = svg.append('g')
      .attr('text-anchor', 'middle')
      .attr('class', 'cursor-pointer group')
      .on('click', () => onNodeClick && onNodeClick({}));

    center.append('circle')
      .attr('r', centerRadius)
      .attr('fill', 'transparent');
    
    const currentDate = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    });

    center.append('text')
      .attr('dy', '-3.2em')
      .attr('class', 'center-text-date')
      .text(currentDate);
    center.append('text')
      .attr('dy', '0.4em')
      .attr('class', 'center-text-value')
      .text(uniquePatientsCount.toLocaleString());
    center.append('text')
      .attr('dy', '4.2em')
      .attr('class', 'center-text-label')
      .text('Total Patients');

    svg.append('g')
      .selectAll('path')
      .data(partition(root).descendants().filter(d => d.depth))
      .join('path')
      .attr('fill', (d) => layerColors[(d.depth - 1) % layerColors.length])
      .attr('fill-opacity', (d) => {
        const siblings = d.parent?.children || [];
        const index = siblings.indexOf(d);
        return 0.8 + (index % 4) * 0.05;
      })
      .attr('d', arc)
      .attr('class', 'cursor-pointer transition-all duration-300')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .on('mouseenter', function(event, d: d3.HierarchyRectangularNode<HierarchyNode>) {
        d3.select(this).attr('fill-opacity', 1).attr('stroke-width', 2).attr('stroke', '#fff');
        
        if (onHover) onHover(d);

        const ancestors = d.ancestors().reverse().slice(1);
        const pathString = ancestors
          .map(a => `<span class="px-0.5 py-0.5 rounded bg-surface-muted text-main mx-0.5 whitespace-nowrap leading-none border border-subtle">${getDisplayName(a.data.name)}</span>`)
          .join('<span class="text-slate-300 font-light mx-0.5 text-[8px]">›</span>');

        const layerNameMap: Record<string, string> = {
          type: 'Biopsy Origin',
          omicsData: 'Omics Data',
          molecularInfo: 'Molecular Info',
          primaryTumor: 'Primary Tumor',
          sex: 'Biological Sex',
          rangeAge: 'Age Range',
          treatment: 'Treatment',
          biopsySite: 'Biopsy Site'
        };
        const layerName = layerNameMap[activeHierarchy[d.depth-1]] || activeHierarchy[d.depth-1] || 'Level';

        const tip = d3.select('#tooltip');
        tip.style('opacity', 1)
           .html(`<div class="p-2 bg-white rounded-lg shadow-xl border border-slate-100 min-w-[140px] max-w-[220px]">
                    <div class="flex items-center gap-1.5 mb-1.5">
                       <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${layerColors[(d.depth-1)%layerColors.length]}"></span>
                       <p class="text-[7px] font-black uppercase text-slate-400 tracking-widest">${layerName}</p>
                    </div>
                    <div class="flex flex-wrap items-center text-[8px] font-bold capitalize leading-tight mb-2">
                       ${pathString}
                    </div>
                    <div class="flex items-center justify-between pt-1.5 border-t border-slate-50">
                      <div class="flex flex-col">
                        <span class="text-[6px] font-black text-slate-400 uppercase mb-0.5">Specimens</span>
                        <span class="text-sm font-black text-blue-600 leading-none">${d.value}</span>
                      </div>
                      <span class="px-1 py-0.5 bg-blue-50 text-[8px] font-black text-blue-600 rounded">
                        ${((d.value || 0) / (root.value || 1) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>`);
      })
      .on('mousemove', function(event) {
        d3.select('#tooltip')
          .style('left', (event.pageX + 8) + 'px')
          .style('top', (event.pageY - 8) + 'px');
      })
      .on('click', function(event, d: d3.HierarchyRectangularNode<HierarchyNode>) {
        if (!onNodeClick) return;

        const ancestors = d.ancestors().reverse().slice(1);
        const filterUpdates: Partial<Record<keyof FilterState, string>> = {};
        
        const layerToFilterKey: Record<string, keyof FilterState> = {
          primaryTumor: 'primaryTumors',
          gender: 'sex',
          rangeAge: 'ageRanges',
          biopsySite: 'biopsySites',
          type: 'types',
          treatment: 'treatments',
          omicsData: 'omicsData',
          molecularInfo: 'molecularInfo'
        };

        ancestors.forEach((a, index) => {
          const field = activeHierarchy[index];
          const filterKey = layerToFilterKey[field as string];
          if (filterKey) {
            filterUpdates[filterKey] = a.data.name;
          }
        });

        onNodeClick(filterUpdates);
      })
      .on('mouseleave', function() {
        d3.select(this)
          .attr('fill-opacity', (d: d3.HierarchyRectangularNode<HierarchyNode>) => {
            const siblings = d.parent?.children || [];
            const index = siblings.indexOf(d);
            return 0.8 + (index % 4) * 0.05;
          })
          .attr('stroke-width', 0.5)
          .attr('stroke', '#fff');
        d3.select('#tooltip').style('opacity', 0);
        if (onHover) onHover(null);
      });

    // Labeling with adaptive visibility logic
    svg.append('g')
      .attr('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .style('user-select', 'none')
      .selectAll('text')
      .data(partition(root).descendants().filter(d => d.depth))
      .join('text')
      .each(function(d) {
        const fullLabel = getDisplayName(d.data.name);
        const angle = d.x1 - d.x0;
        const radiusAtCentroid = centerRadius + (d.depth - 0.5) * ringWidth;
        const arcLengthAtCentroid = radiusAtCentroid * angle;
        
        // Very strict threshold for showing labels
        // If the slice is too narrow (angle) or the arc is too short (pixels), skip
        if (!forceLabels && (angle < 0.12 || arcLengthAtCentroid < 25)) {
          d3.select(this).remove();
          return;
        }

        const [x, y] = arc.centroid(d);
        const textElement = d3.select(this)
          .attr('transform', `translate(${x},${y})`)
          .attr('font-size', '8.5px') // Slightly smaller for better fit
          .attr('font-weight', '900')
          .attr('fill', 'white')
          .attr('class', 'drop-shadow-sm uppercase tracking-tighter drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]');

        const words = fullLabel.split(/\s+/);
        const maxCharsSingle = Math.floor(arcLengthAtCentroid / 5.5); // Rough estim. of chars that fit
        
        // Multi-line logic
        if (words.length > 1 && arcLengthAtCentroid > 45) {
          const firstLine = words.slice(0, Math.ceil(words.length / 2)).join(' ');
          const secondLine = words.slice(Math.ceil(words.length / 2)).join(' ');
          const limit = Math.floor(arcLengthAtCentroid / 6);
          
          textElement.append('tspan')
            .attr('x', 0)
            .attr('dy', '-0.3em')
            .text(firstLine.length > limit ? firstLine.slice(0, limit - 1) + '…' : firstLine);
            
          textElement.append('tspan')
            .attr('x', 0)
            .attr('dy', '1.1em')
            .text(secondLine.length > limit ? secondLine.slice(0, limit - 1) + '…' : secondLine);
        } else {
          // Single line display
          textElement.attr('dy', '0.35em')
            .text(fullLabel.length > maxCharsSingle ? fullLabel.slice(0, Math.max(3, maxCharsSingle - 1)) + '…' : fullLabel);
        }

        // Final safety check: if the text width exceeds the arc length significantly, remove it
        // We do this after appending to know the size (roughly) or use the estimate
        if (maxCharsSingle < 4) {
          d3.select(this).remove();
        }
      });

  }, [buildHierarchy, activeHierarchy, data, forceLabels, onHover, onNodeClick]);

  useEffect(() => {
    drawChart();
    const handleResize = () => drawChart();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawChart]);

  return (
    <div className="sunburst-container">
      <div ref={containerRef} className="w-full h-full flex items-center justify-center" />
      <div id="tooltip" className="sunburst-tooltip"></div>
    </div>
  );
};
