export default class testRectangle {
    constructor(g) {
      this.g = g;
    }

    initializeRect(g) {
        this.g.append('rect')
            .attr('width', 500)
            .attr('height', 500)
            .style('fill', 'green');
    }
}