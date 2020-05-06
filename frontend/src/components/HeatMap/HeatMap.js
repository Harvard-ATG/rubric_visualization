import * as d3 from 'd3';

export const drawFlatHeatMap = () => 0;


/**
 * Draw heat map visualization for rubric performance.
 * @param {string} id ID of the div to target to draw the vis.
 * @param {array} data The datapoints to iterate over for visualization.
 * @returns {none} Produces side-effect which draws heat map.
 * data = [
 *   [
 *     {criterion: "Bibliography", ratingDescription: "Outstanding", value: 10},
 *     {criterion: "Bibliography", ratingDescription: "Average", value: 20},
 *     {criterion: "Bibliography", ratingDescription: "Poor", value: 70}
 *   ],
 *   [
 *     {...},{...},{...}
 *   ]
 * ]
 */
export const drawHeatMap = (id, data) => {
  const margin = {
    top: 100, right: 50, bottom: 100, left: 150,
  };
  const width = 750 - margin.left - margin.right;
  const height = 750 - margin.top - margin.bottom;

  const widthValue = 800;
  const heightValue = 800;
  const svg = d3.select(`${id}`)
    .append('svg')
    .attr('viewBox', `0 0 ${widthValue} ${heightValue}`)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const criteriaLength = data.length;

  data.forEach((criterion, index) => {
    // Labels of row and columns
    const myVars = [...new Set(criterion.map((d) => d.criterion))];
    const myGroups = [...new Set(criterion.map((d) => d.ratingDescription))];

    // Build y scales and axis:
    const y = d3.scaleBand()
      .range([height / criteriaLength - (3 * criteriaLength), 0])
      .domain(myVars)
      .padding(0.01);

    svg.append('g')
      .style('font-size', '1rem')
      .attr('transform', `translate(0,${y.bandwidth() * (index) + ((index * 3) * criteriaLength)})`)
      .call(d3.axisLeft(y).tickSize(0))
      .call((g) => g.select('.domain').remove());

    // Build X scales and axis:
    const x = d3.scaleBand()
      .range([0, width])
      .domain(myGroups)
      .padding(0.01);

    svg.append('g')
      .style('font-size', '1rem')
      .attr('transform', `translate(0,${y.bandwidth() * (index) + ((index * 3) * criteriaLength) + 10})`)
      .call(d3.axisTop(x).tickSize(0))
      .call((g) => g.select('.domain').remove());

    // Build color scale
    const myColor = d3.scaleLinear()
      .range(['white', '#078EE0'])
      .domain([1, 100]);

    // read to the data from the array of objects declared above.
    svg.selectAll()
      .data(criterion, (d) => `${d.criterion}:${d.ratingDescription}`)
      .enter()
      .append('rect')
      .attr('transform', `translate(0,${y.bandwidth() * (index) + ((index * 3) * criteriaLength)})`)
      .attr('x', (d) => x(d.ratingDescription) + 10)
      .attr('y', (d) => y(d.criterion) + 10)
      .attr('width', x.bandwidth() - 20)
      .attr('height', y.bandwidth() - 20)
      .style('fill', (d) => myColor(d.value));
  });
};
