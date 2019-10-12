(() => {
    let cylinderpictorialBarTwo = {};
    cylinderpictorialBarTwo.draw = (args) => {
        let dataset = args.dataset,
            padding = args.padding,
            width = args.width,
            height = args.height,
            warning = args.warning;

        let svg = d3.select(`#${args.id}`);
        svg.selectAll('*').remove(); // 清空画布 
        let maxValue = d3.max(dataset, (d) => {
            return Number(d.value)
        });
        if (maxValue < warning) {
            maxValue = warning;
        };
        let xScale = d3.scale.ordinal().domain(d3.range(dataset.length)).rangeRoundBands([0, width - padding.left - padding.right], 0.8, 0.5);

        let yScale = d3.scale.linear()
            .domain([0, maxValue])
            .range([0, height - padding.top - padding.bottom]);
        // 定义绘制顺序 预警后两段 =》 柱子 =》 预警前两段
        let grid = svg.selectAll(".grid").data(yScale.ticks()).enter().append("g"); // 定义网格线
        let warningBarAfter = svg.append('g').attr('stroke-width', '1');
        let circleBlack = svg.append('g');
        let bar = svg.append('g').attr('id', 'bar');
        let warningBarFront = svg.append('g').attr('stroke-width', '1').attr('stroke', '#31fc71');
        let warningBar = svg.append('g');


        let barWidth = xScale.rangeBand();
        let timer = dataset.length * 500;
        // 预警值
        for (let i = 0; i < dataset.length; i++) {
            let wx5 = xScale(i) + padding.left;
            let wx6 = xScale(i) + padding.left + barWidth;
            let wy5 = height - padding.bottom - yScale(warning) - yScale(2.614);
            let wy6 = height - padding.bottom - yScale(warning) - yScale(2.614);
            // 预警柱子后两线段
            warningBarAfter.append('path')
                .attr('d', () => {
                    return ["M", wx5, wy5, "A", barWidth / 1.58, barWidth / 6.3, 0, 0, 1, wx6, wy6].join(' ');
                })
                .attr('fill', 'none')
                .attr('stroke', '#fa3740')
                .attr('stroke-width', '3');

            // 预警柱子前两线段
            warningBarFront.append('path')
                .attr('d', () => {
                    return ["M", wx5, wy5, "A", barWidth / 1.58, barWidth / 6.3, 0, 1, 0, wx6, wy6].join(' ');
                })
                .attr('fill', 'none')
                .attr('stroke', '#fa3740')
                .attr('stroke-width', '3');

            // // 预警柱体底部黑菱形
            // circleBlack.append('ellipse')
            //     .attr('cx', cx)
            //     .attr('cy', cy + 33)
            //     .attr('rx', barWidth / 2)
            //     .attr('ry', barWidth / 7.6)
            //     .attr('stroke', 'none')
            //     .attr('fill', '#000');
        }

        // 预警线
        warningBar.append("line")
            .attr("x1", padding.left + barWidth / 1.5)
            .attr("y1", height - padding.bottom - yScale(warning))
            .attr("x2", width - padding.right - padding.left)
            .attr("y2", height - padding.bottom - yScale(warning))
            .attr("stroke", '#fa3740')
            .attr("stroke-dasharray", '5, 5')
            .attr("stroke-width", '5')
            .attr("opacity", '1');

        warningBar.append('text').attr('transform', `translate(${padding.left + barWidth / 1.5}, ${height - padding.bottom - yScale(warning)})`)
            .attr('text-anchor', 'start')
            .attr('font-size', '30px')
            .attr('font-family', 'MyCustomFont')
            .attr('fill', '#fa3740')
            .attr('font-family', 'MyCustomFont')
            .text(warning);

        for (let i = 0; i < dataset.length; i++) {
            let value = Number(dataset[i].value); // 总数
            let value1 = Number(dataset[i].value1); // 已使用数

            // 急救床位总数X坐标柱子
            let x1 = xScale(i) + padding.left + barWidth / 2;
            let x2 = xScale(i) + padding.left;
            let x3 = xScale(i) + padding.left + barWidth;
            let x4 = xScale(i) + padding.left;
            let x5 = xScale(i) + padding.left + barWidth;
            let x6 = xScale(i) + padding.left + barWidth / 2;

            // 急救床位已使用数X坐标柱子
            let bx1 = xScale(i) + padding.left + barWidth * 1.5 + 26;
            let bx2 = xScale(i) + padding.left + barWidth + 26;
            let bx3 = xScale(i) + padding.left + barWidth * 2 + 26;
            let bx4 = xScale(i) + padding.left + barWidth + 26;
            let bx5 = xScale(i) + padding.left + barWidth * 2 + 26;
            let bx6 = xScale(i) + padding.left + barWidth * 1.5 + 26;

            // 急救床位总数y坐标柱子
            let y1 = height - padding.bottom;
            let y2 = height - padding.bottom;
            let y3 = height - padding.bottom;
            let iy4 = height - padding.bottom - yScale(1);
            let iy5 = height - padding.bottom - yScale(1);
            let iy6 = height - padding.bottom - yScale(1);

            let ry4 = height - padding.bottom - yScale(value);
            let ry5 = height - padding.bottom - yScale(value);
            let ry6 = height - padding.bottom - yScale(value);

            // 急救床位已使用数Y坐标柱子
            let bry4 = height - padding.bottom - yScale(value1);
            let bry5 = height - padding.bottom - yScale(value1);
            let bry6 = height - padding.bottom - yScale(value1);

            // 总数圆柱底座
            bar.append('ellipse')
                .attr('cx', x1)
                .attr('cy', y1)
                .attr('rx', barWidth / 2)
                .attr('ry', barWidth / 6.3)
                .attr('stroke', 'none')
                .attr('fill-opacity', '0')
                .attr('fill', () => {
                    if (value > warning) {
                        return '#32ff72';
                    } else {
                        return '#fa3740';
                    }
                })
                .transition()
                .duration(1000)
                .delay(i * 500)
                .attr('fill-opacity', '0.7');

            // 已使用数数圆柱底座
            bar.append('ellipse')
                .attr('cx', bx1)
                .attr('cy', y1)
                .attr('rx', barWidth / 2)
                .attr('ry', barWidth / 6.3)
                .attr('stroke', 'none')
                .attr('fill-opacity', '0')
                .attr('fill', '#0fd3d1')
                .transition()
                .duration(1000)
                .delay(i * 200 + timer)
                .attr('fill-opacity', '0.7');

            // 总数圆柱
            bar.append('path')
                .attr('d', () => {
                    return ["M", x4, iy4, "L", x2, y2, "A", barWidth / 2, barWidth / 6.3, 0, 1, 0, x3, y3, "L", x5, iy5, "A", barWidth / 2, barWidth / 6.3, 0, 1, 0, x4, iy4].join(' ');
                })
                .attr('fill', () => {
                    if (value > warning) {
                        return '#32ff72';
                    } else {
                        return '#fa3740';
                    }
                })
                .attr('stroke', () => {
                    if (value > warning) {
                        return '#32ff72';
                    } else {
                        return '#fa3740';
                    }
                })
                .attr('fill-opacity', '0')
                .attr('stroke-opacity', '0')
                .transition()
                .duration(1000)
                .delay(i * 500)
                .attr('fill-opacity', '0.4')
                .attr('stroke-opacity', '1')
                .attr('d', () => {
                    return ["M", x4, ry4, "L", x2, y2, "A", barWidth / 2, barWidth / 6.3, 0, 1, 0, x3, y3, "L", x5, ry5, "A", barWidth / 2, barWidth / 6.3, 0, 1, 0, x4, ry4].join(' ');
                });

            // 已使用数圆柱
            bar.append('path')
                .attr('d', () => {
                    return ["M", bx4, iy4, "L", bx2, y2, "A", barWidth / 2, barWidth / 6.3, 0, 1, 0, bx3, y3, "L", bx5, iy5, "A", barWidth / 2, barWidth / 6.3, 0, 1, 0, bx4, iy4].join(' ');
                })
                .attr('fill', '#0fd3d1')
                .attr('stroke', '#0fd3d1')
                .attr('fill-opacity', '0')
                .attr('stroke-opacity', '0')
                .transition()
                .duration(1000)
                .delay(i * 200 + timer)
                .attr('fill-opacity', '0.4')
                .attr('stroke-opacity', '1')
                .attr('d', () => {
                    return ["M", bx4, bry4, "L", bx2, y2, "A", barWidth / 2, barWidth / 6.3, 0, 1, 0, bx3, y3, "L", bx5, bry5, "A", barWidth / 2, barWidth / 6.3, 0, 1, 0, bx4, bry4].join(' ');
                });

            // 总数圆柱顶部大圆
            bar.append('ellipse')
                .attr('cx', x1)
                .attr('cy', y1)
                .attr('rx', barWidth / 2)
                .attr('ry', barWidth / 6.3)
                .attr('stroke', 'none')
                .attr('fill-opacity', '0')
                .attr('fill', () => {
                    if (value > warning) {
                        return '#32ff72';
                    } else {
                        return '#fa3740';
                    }
                })
                .transition()
                .duration(1000)
                .delay(i * 500)
                .attr('fill-opacity', '0.7')
                .attr('cy', ry6);

            // 已使用数数圆柱底座
            bar.append('ellipse')
                .attr('cx', bx1)
                .attr('cy', y1)
                .attr('rx', barWidth / 2)
                .attr('ry', barWidth / 6.3)
                .attr('stroke', 'none')
                .attr('fill-opacity', '0')
                .attr('fill', '#0fd3d1')
                .transition()
                .duration(1000)
                .delay(i * 200 + timer)
                .attr('fill-opacity', '0.7')
                .attr('cy', bry4);


            // 总数圆柱顶部小圆
            bar.append('ellipse')
                .attr('cx', x1)
                .attr('cy', y1)
                .attr('rx', barWidth / 4)
                .attr('ry', 10)
                .attr('stroke', 'none')
                .attr('fill-opacity', '0')
                .attr('fill', () => {
                    if (value > warning) {
                        return '#219a46';
                    } else {
                        return '#ae282e';
                    }
                })
                .transition()
                .duration(1000)
                .delay(i * 500)
                .attr('fill-opacity', '0.7')
                .attr('cy', ry6);

            // 已使用数圆柱顶部小圆
            bar.append('ellipse')
                .attr('cx', bx1)
                .attr('cy', y1)
                .attr('rx', barWidth / 4)
                .attr('ry', 10)
                .attr('stroke', 'none')
                .attr('fill-opacity', '0')
                .attr('fill', '#0c8987')
                .transition()
                .duration(1000)
                .delay(i * 200 + timer)
                .attr('fill-opacity', '0.7')
                .attr('cy', bry6);

            // 总数添加数值
            bar.append('text')
                .attr('transform', (d) => {
                    return `translate(${x6}, ${iy6 - yScale(8.07)})`;
                })
                .attr('text-anchor', 'middle')
                .attr('fill', 'white')
                .attr('font-size', '30px')
                .attr('stroke', 'white')
                .attr('font-family', 'MyCustomFont')
                .transition()
                .duration(1000)
                .delay(i * 500)
                .attr('transform', (d) => {
                    return `translate(${x6}, ${ry6 - 10})`;
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

            // 已使用数添加数值
            bar.append('text')
                .attr('transform', (d) => {
                    return `translate(${bx6}, ${iy6 - yScale(8.07)})`;
                })
                .attr('text-anchor', 'middle')
                .attr('fill', 'white')
                .attr('font-size', '30px')
                .attr('stroke', 'white')
                .attr('font-family', 'MyCustomFont')
                .transition()
                .duration(1000)
                .delay(i * 200 + timer)
                .attr('transform', (d) => {
                    return `translate(${bx6}, ${bry6 - 10})`;
                })
                .tween("text", function () {
                    console.log(value1);
                    var d = value1,
                        i = d3.interpolate(this.textContent, d),
                        prec = (d + "").split("."),
                        round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
                    return function (t) {
                        this.textContent = Math.round(i(t) * round) / round;
                    };
                });

            // 添加地区名
            bar.append('text')
                .attr('transform', (d) => {
                    return `translate(${bx6 + 50}, ${y1 + 100})`;
                })
                .attr('text-anchor', 'middle')
                .attr('fill', '#b4ced9')
                .attr('stroke', '#b4ced9')
                .attr('font-size', '36px')
                .text(dataset[i].name);

            // 文字托盘
            bar.append('ellipse')
                .attr('cx', bx6 + 50)
                .attr('cy', y1 + 120)
                .attr('rx', 60)
                .attr('ry', 4)
                .attr('stroke', 'none')
                .attr('fill', '#000');
        };

        let yAxis = d3.svg.axis().scale(yScale).orient('left');
        yScale.range([height - padding.top - padding.bottom, 0]);
        let gyAxis = svg.append('g').attr('fill', '#808080').attr('font-size', '30').attr('transform', `translate(${padding.left + barWidth*0.6}, ${padding.top})`).call(yAxis);
        gyAxis.select('.domain').remove();
        // y轴网格线
        grid.append("line")
            .attr('id', (d, i) => {
                return `y${i}`;
            })
            .attr("x1", padding.left + barWidth / 1.5)
            .attr("y1", (d) => {
                return height - padding.bottom - yScale(d)
            })
            .attr("x2", width - padding.right - padding.left)
            .attr("y2", (d) => {
                return height - padding.bottom - yScale(d)
            })
            .attr("stroke", '#35424a')
            .attr("opacity", '0.5');
        grid.select('#y8').remove();

    }
    this.cylinderpictorialBarTwo = cylinderpictorialBarTwo;
})()