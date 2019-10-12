(() => {
    let greenBgline = {};
    greenBgline.draw = (args) => {
        let dataset = args.dataset,
            padding = args.padding,
            width = args.width,
            height = args.height;

        let svg = d3.select(`#${args.id}`);

        let maxValue = d3.max(dataset, (d) => {
            return Number(d.value);
        });

        let data = [];

        dataset.forEach(v => {
            data.push(v.name);
        });

        let xScale = d3.scale.ordinal().domain(data).rangeRoundBands([0, width - padding.left - padding.right], 0, 0);

        let yScale = d3.scale.linear()
            .domain([0, maxValue * 1.2])
            .range([height - padding.top - padding.bottom, 0]);
        svg.selectAll('*').remove(); // 清空画布 

        let grid = svg.selectAll(".grid").data(yScale.ticks()).enter().append("g"); // 定义网格线

        let afterPath = svg.append('g').attr('id', 'afterPath'); // 横截面后面区域

        let rectPath = svg.append('g').attr('id', 'rectPath');; // 横截面后面区域

        let frontPath = svg.append('g').attr('transform', `translate(${(padding.left+106)}, ${padding.top})`).attr('id', 'frontPath'); // 横截面前面区域

        let coverArea = svg.append('g').attr('id', 'coverArea');

        // 创建一个区域生成器
        let areaPath = d3.svg.area()
            .x((d) => {
                return xScale(d.name);
            })
            .y0((d) => {
                return height - padding.bottom - 55;
            })
            .y1((d) => {
                return yScale(d.value);
            });

        // 创建一个直线生成器
        let frontlinePath = d3.svg.line()
            .x((d) => {
                return xScale(d.name);
            })
            .y((d) => {
                return yScale(d.value);
            });

        let afterlinePath = d3.svg.line()
            .x((d) => {
                return xScale(d.name) - barWidth / 13.06;
            })
            .y((d) => {
                return yScale(d.value) - barWidth / 15;
            });

        let barWidth = xScale.rangeBand();

        // 后区域面积
        afterPath.append('path')
            .attr('transform', `translate(${(padding.left + barWidth/2.15)}, ${padding.top - barWidth/15})`)
            .attr('d', areaPath(dataset));

        // 前区域面积
        frontPath.append('path')
            .attr('d', areaPath(dataset))
            .attr('fill', '#164c30');

        // 前区域路径
        frontPath.append('path')
            .attr('d', frontlinePath(dataset))
            .attr('fill', 'none')
            .attr('stroke-width', 3)
            .attr('stroke', '#38ff76');

        // 添加横截面
        // 开始横截面坐标
        let x1 = xScale(dataset[0].name),
            y1 = yScale(dataset[0].value),
            x2 = xScale(dataset[0].name) - barWidth / 13.06,
            y2 = yScale(dataset[0].value) - barWidth / 15,
            x3 = xScale(dataset[0].name) - barWidth / 13.06,
            y3 = yScale(0) - barWidth / 15,
            x4 = xScale(dataset[0].name),
            y4 = yScale(0) - 5;

        // 结束横截面坐标
        let len = dataset.length;
        ex1 = xScale(dataset[len - 1].name),
            ey1 = yScale(dataset[len - 1].value),
            ex2 = xScale(dataset[len - 1].name) - barWidth / 13.06,
            ey2 = yScale(dataset[len - 1].value) - barWidth / 15,
            ex3 = xScale(dataset[len - 1].name) - barWidth / 13.06,
            ey3 = yScale(0) - barWidth / 15,
            ex4 = xScale(dataset[len - 1].name),
            ey4 = yScale(0)- 5;

        // 开始横截面
        rectPath.append('path')
            .attr('transform', `translate(${(padding.left + 106)}, ${padding.top})`)
            .attr('d', ['M', x1, y1, 'L', x2, y2, 'L', x3, y3, 'L', x4, y4, 'z'].join(' '))
            .attr('fill', '#135b2a');

        // 结束横截面
        rectPath.append('path')
            .attr('transform', `translate(${(padding.left+106)}, ${padding.top})`)
            .attr('d', ['M', ex1, ey1, 'L', ex2, ey2, 'L', ex3, ey3, 'L', ex4, ey4, 'z'].join(' '))
            .attr('fill', '#135b2a');

        // 顶部横截面路径
        let topPath = `${frontlinePath(dataset)}L${ex2},${ey2}${afterlinePath(dataset.slice(0).reverse())}L${x1},${y1}`;

        // 顶部横截面
        rectPath.append('path')
            .attr('transform', `translate(${(padding.left+106)}, ${padding.top})`)
            .attr('d', topPath)
            .attr('fill', '#47855e');

        // 前区域
        frontPath.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .style('fill', "#38ff76")
            .style("stroke", "#38ff76")
            .attr("cx", function (d, i) {
                return xScale(d.name);
            })
            .attr("cy", function (d, i) {
                return yScale(d.value);
            })
            .attr('r', 4);

        // 动画
        coverArea.append('rect')
            .attr('x', padding.left + 30)
            .attr('y', padding.top)
            .attr('width', xScale(dataset[len - 1].name) + 200)
            .attr('height', yScale(0) + 20)
            .attr('fill', '#000')
            .transition()
            .duration(2000)
            .attr('x', padding.left + xScale(dataset[len - 1].name) + 230)
            .attr('width', 0);

        let xAxis = d3.svg.axis().scale(xScale).orient('top');

        let yAxis = d3.svg.axis().scale(yScale).orient('left');

        let gxAxis = svg.append('g').attr('fill', '#808080').attr('font-size', '30').attr('transform', `translate(${padding.left}, ${padding.top})`).call(xAxis);

        let gyAxis = svg.append('g').attr('fill', '#808080').attr('font-size', '30').attr('transform', `translate(${padding.left}, ${padding.top})`).call(yAxis);

        gyAxis.select('.domain').remove();
        gxAxis.select('.domain').remove();

        // y轴网格线
        grid.append("line")
            .attr("x1", padding.left)
            .attr("y1", (d) => {
                return height - padding.bottom - yScale(d) + 10;
            })
            .attr("x2", width - 120)
            .attr("y2", (d) => {
                return height - padding.bottom - yScale(d)+ 10;
            })
            .attr("stroke", '#35424a')
            .attr("opacity", '1');
    }
    this.greenBgline = greenBgline;
})()