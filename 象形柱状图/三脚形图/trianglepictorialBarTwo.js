(() => {
    let trianglepictorialBarTwo = {};
    trianglepictorialBarTwo.draw = (args) => {
        let dataset = args.dataset,
            padding = args.padding,
            width = args.width,
            height = args.height,
            fontSize = args.fontSize;

        let svg = d3.select(`#${args.id}`);
		let maxValue = d3.max(dataset, (d) => {
            return Number(d.value)
        });
		let xScale = d3.scale.ordinal().domain(d3.range(dataset.length)).rangeRoundBands([0, width - padding.left - padding.right], 0.4, 0.5);

        let yScale = d3.scale.linear()
            .domain([0, maxValue])
            .range([0, height - padding.top - padding.bottom]);
        svg.selectAll('*').remove(); // 清空画布  
		let grid = svg.selectAll(".grid").data(yScale.ticks()).enter().append("g"); // 定义网格线
        let shadow = svg.append('g').attr('fill', 'white'); // 阴影背景
        let bar = svg.append('g').attr('stroke-width', '1').attr('stroke', '#31fc71'); // 象形柱子
        let topcircle = svg.append('g').attr('fill', 'white'); // 顶部圆形
        let text = svg.append('g').attr('text-anchor', 'middle')
            .attr('fill', '#b4ced9')
            .attr('font-size', `${fontSize.name}px`)
            .attr('stroke', '#b4ced9')
            .attr('font-family', 'MyCustomFont');
        let textTray = svg.append('g').attr('fill', '#000'); // 文字托盘

        let barWidth = xScale.rangeBand();

        for (let i = 0; i < dataset.length; i++) {
            let value = Number(dataset[i].value);
            let x1 = xScale(i) + padding.left + barWidth / 2; // 三角X坐标
            let x2 = xScale(i) + padding.left;
            let x3 = xScale(i) + padding.left + barWidth;
            let x4 = xScale(i) + padding.left + barWidth / 2;
            let sx1 = xScale(i) + padding.left + barWidth / 2; // 阴影X坐标
            let sx2 = xScale(i) + padding.left - 15;
            let sx3 = xScale(i) + padding.left + barWidth + 15;
            let sx4 = xScale(i) + padding.left + barWidth / 2;

            let y1 = height - padding.bottom + 15;
            let sy1 = height - padding.bottom + 15 + 9;
            let y2 = height - padding.bottom;
            let y3 = height - padding.bottom;
            let y4 = height - padding.bottom;
            let wy4 = height - padding.bottom - yScale(value);


            bar.append('path')
                .attr('d', () => {
                    return ["M", sx1, sy1, "L", sx2, y2 + 2, "L", sx4, y4, "L", sx3, y3 + 2, "z"].join(' ');
                })
                .attr('stroke', 'none')
                .attr('fill', '#7dfda5')
                .attr('fill-opacity', 0.1)
                .transition()
                .duration(1000)
                .delay(i * 500)
                .attr('d', () => {
                    return ["M", sx1, sy1, "L", sx2, y2 + 2, "L", sx4, wy4, "L", sx3, y3 + 2, "z"].join(' ');
                });

            // 左侧三角形
            bar.append('path')
                .attr('d', () => {
                    return ["M", x1, y1, "L", x2, y2, "L", x4, y4, "z"].join(' ');
                })
                .attr('stroke', '#0fd3d1')
                .attr('stroke-width', '2px')
                .attr('fill', '#0fd3d1')
                .attr('fill-opacity', 0.3)
                .transition()
                .duration(1000)
                .delay(i * 500)
                .attr('d', () => {
                    return ["M", x1, y1, "L", x2, y2, "L", x4, wy4, "z"].join(' ');
                });

            // 右侧三角形 
            bar.append('path')
                .attr('d', () => {
                    return ["M", x1, y1, "L", x3, y3, "L", x4, y4, "z"].join(' ');
                })
                .attr('stroke', '#0fd3d1')
                .attr('stroke-width', '2px')
                .attr('fill', '#0fd3d1')
                .attr('fill-opacity', 0.9)
                .transition()
                .duration(1000)
                .delay(i * 500)
                .attr('d', () => {
                    return ["M", x1, y1, "L", x3, y3, "L", x4, wy4, "z"].join(' ');
                });


            // 绘制白色小椭圆
            topcircle.append('circle')
                .attr('cx', x4)
                .attr('cy', y4)
                .attr('r', 4)
                .attr('fill', '#38cc6a')
                .attr('opacity', '0')
                .transition()
                .duration(1000)
                .delay(i * 500)
                .attr('cy', wy4)
                .attr('opacity', '1');

            // 绘制绿色小椭圆外圈
            topcircle.append('circle')
                .attr('cx', x4)
                .attr('cy', y4)
                .attr('r', 6)
                .attr('fill', 'transparent')
                .attr('stroke-width', '1')
                .attr('stroke', '#38cc6a')
                .attr('opacity', '0')
                .transition()
                .duration(1000)
                .delay(i * 500)
                .attr('cy', wy4)
                .attr('opacity', '1');

            if (value == maxValue) {
                // 绘制绿色小椭圆外圈
                topcircle.append('circle')
                    .attr('cx', x4)
                    .attr('cy', y4)
                    .attr('r', 10)
                    .attr('fill', '#38cc6a')
                    .attr('stroke-width', '1')
                    .attr('stroke', '#38cc6a')
                    .attr('stroke-opacity', '0')
                    .attr('fill-opacity', '0')
                    .transition()
                    .duration(1000)
                    .delay(i * 500)
                    .attr('cy', wy4)
                    .attr('fill-opacity', '0.5')
                    .attr('stroke-opacity', '1');
            }

            // 阴影三角形
            shadow.append('path')
                .attr('d', () => {
                    return ["M", sx1, sy1 + 10, "L", sx2, y2 + 10, "L", sx3, y3 + 10, "z"].join(' ');
                })
                .attr('fill', '#000');

            // 添加数值
            bar.append('text')
                .attr('transform', (d) => {
                    return `translate(${x4}, ${y4 - 16})`;
                })
                .attr('text-anchor', 'middle')
                .attr('fill', () => {
                    if (value == maxValue) {
                        return '#38cc6a';
                    } else {
                        return 'white';
                    }
                })
                .attr('font-family', 'MyCustomFont')
                .attr('stroke', () => {
                    if (value == maxValue) {
                        return '#38cc6a';
                    } else {
                        return 'white';
                    }
                })
                .attr('font-size', `${fontSize.value}px`)
                .transition()
                .duration(1000)
                .delay(i * 500)
                .attr('transform', (d) => {
                    return `translate(${x4}, ${wy4 - 16})`;
                })
                .tween("text", function () {
                    var d = value,
                        i = d3.interpolate(this.textContent, d),
                        prec = (d + "").split("."),
                        round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
                    return function (t) {
                        this.textContent = Math.round(i(t) * round) / round;
                    };
                });

            // 添加地区名
            text.append('text')
                .attr('transform', (d) => {
                    return `translate(${sx1}, ${y1 + 55})`;
                })
                .text(dataset[i].name);

            // 文字托盘
            textTray.append('ellipse')
                .attr('cx', sx1)
                .attr('cy', y1 + 65)
                .attr('rx', 32)
                .attr('ry', 2)
                .attr('fill', '#000');
        };
        let yAxis = d3.svg.axis().scale(yScale).orient('left');
        yScale.range([ height - padding.top - padding.bottom, 0]);
        let gyAxis = svg.append('g').attr('fill', '#808080').attr('font-size', '30').attr('transform', `translate(${padding.left + barWidth*0.6}, ${padding.top})`).call(yAxis);
        gyAxis.select('.domain').remove();
		
		
grid.append("line")
   .attr("x1", padding.left + barWidth/1.5)
   .attr("y1", (d) => {
	  return height - padding.bottom - yScale(d)
   })
   .attr("x2", width - padding.right - padding.left)
   .attr("y2", (d) => {
	  return height - padding.bottom - yScale(d)
    })
   .attr("stroke", '#35424a')
   .attr("opacity", '0.5');
	}



    this.trianglepictorialBarTwo = trianglepictorialBarTwo;
})()