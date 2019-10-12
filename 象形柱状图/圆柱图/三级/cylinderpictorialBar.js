(() => {
    let cylinderpictorialBar = {};
    cylinderpictorialBar.draw = (args) => {
        let dataset = args.dataset,
            padding = args.padding,
            width = args.width,
            height = args.height,
            warning = args.warning;

        let svg = d3.select(`#${args.id}`);
        svg.selectAll('*').remove(); // 清空画布 
        // 定义绘制顺序 预警后两段 =》 柱子 =》 预警前两段
        let warningBarAfter = svg.append('g').attr('stroke-width', '1');
        let circleBlack = svg.append('g');
        let bar = svg.append('g').attr('id', 'bar');
        let warningBarFront = svg.append('g').attr('stroke-width', '1').attr('stroke', '#31fc71');
        let warningBar = svg.append('g');
        let maxValue = d3.max(dataset, (d) => {
            return Number(d.value)
        });
        if (maxValue < warning) {
            maxValue = warning;
        };

        let xScale = d3.scale.ordinal().domain(d3.range(dataset.length)).rangeRoundBands([0, width - padding.left - padding.right], 0.5, 0.5);
        
        let yScale = d3.scale.linear()
            .domain([0, maxValue])
            .range([0, height - padding.top - padding.bottom]);

        let barWidth = xScale.rangeBand();

        // 预警值
        for (let i = 0; i < dataset.length; i++) {
            let wx1 = xScale(i) + padding.left - barWidth/9.5;
            let wx2 = xScale(i) + padding.left + barWidth + barWidth/9.5;
            let wx3 = xScale(i) + padding.left - barWidth/9.5;
            let wx4 = xScale(i) + padding.left + barWidth + barWidth/9.5;
            let wx5 = xScale(i) + padding.left;
            let wx6 = xScale(i) + padding.left + barWidth;
            let wx7 = xScale(i) + padding.left - barWidth/9.5;
            let wx8 = xScale(i) + padding.left + barWidth + barWidth/9.5;
            let cx = xScale(i) + padding.left + barWidth/2;
            let cy = height - padding.bottom;

            let wy1 = height - padding.bottom + yScale(8);
            let wy2 = height - padding.bottom + yScale(8);
            let wy3 = height - padding.bottom - yScale(warning);
            let wy4 = height - padding.bottom - yScale(warning);

            let wy5 = height - padding.bottom - yScale(warning) - yScale(6.5);
            let wy6 = height - padding.bottom - yScale(warning) - yScale(6.5);

            let wy7 = height - padding.bottom - yScale(warning) - yScale(21);
            let wy8 = height - padding.bottom - yScale(warning) - yScale(21);


            // 预警柱子后两线段
            warningBarAfter.append('path')
                .attr('d', () => {
                    return ["M", wx5, wy5, "A", barWidth / 1.58, barWidth/6.3, 0, 0, 1, wx6, wy6].join(' ');
                })
                .attr('fill', 'none')
                .attr('stroke', '#fa3740')
                .attr('stroke-width', '1');

            // 预警柱子前两线段
            warningBarFront.append('path')
                .attr('d', () => {
                    return ["M", wx5, wy5, "A", barWidth / 1.58, barWidth/6.3, 0, 1, 0, wx6, wy6].join(' ');
                })
                .attr('fill', 'none')
                .attr('stroke', '#fa3740')
                .attr('stroke-width', '1');

            // 预警柱体下段部分
            warningBar.append('path')
                .attr('d', () => {
                    return ["M", wx3, wy3, "L", wx1, wy1, "A", barWidth / 1.76, barWidth/6.3, 0, 1, 0, wx2, wy2, "L", wx4, wy4].join(' ');
                })
                .attr('fill', 'gray')
                .attr('fill-opacity', '0.2');
            
            // 预警柱体上段部分
            warningBar.append('path')
                .attr('d', () => {
                    return ["M", wx3, wy3, "L", wx7, wy7, "A", barWidth / 1.76, barWidth/6.3, 0, 1, 1, wx8, wy8, "L", wx4, wy4].join(' ');
                })
                .attr('fill', 'gray')
                .attr('fill-opacity', '0.2');


            // 预警柱体底部黑菱形
            circleBlack.append('ellipse')
                .attr('cx', cx)
                .attr('cy', cy + 33)
                .attr('rx', barWidth / 2)
                .attr('ry', barWidth / 7.6)
                .attr('stroke', 'none')
                .attr('fill', '#000');


            // 添加地区名
            bar.append('text')
                .attr('transform', (d) => {
                    return `translate(${wx1}, ${wy1 + 60})`;
                })
                .attr('text-anchor', 'middle')
                .attr('fill', '#b4ced9')
                .attr('stroke', '#b4ced9')
                .attr('font-size', '30px')
                .text(dataset[i].name);

            // 文字托盘
            bar.append('ellipse')
                .attr('cx', wx1)
                .attr('cy', wy1 + 68)
                .attr('rx', 32)
                .attr('ry', 2)
                .attr('stroke', 'none')
                .attr('fill', '#000');

            // 预警数字
            if (i == 0) {
                warningBar.append('text').attr('transform', `translate(${wx3 - barWidth / 1.9}, ${wy3 + yScale(8.07)})`)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '30px')
                    .attr('font-family', 'MyCustomFont')
                    .attr('fill', '#fa3740')
                    .attr('font-family', 'MyCustomFont')
                    .text(warning);
            }
        }


        for (let i = 0; i < dataset.length; i++) {
            let value = Number(dataset[i].value);
            let x1 = xScale(i) + padding.left + barWidth / 2;
            let x2 = xScale(i) + padding.left;
            let x3 = xScale(i) + padding.left + barWidth;
            let x4 = xScale(i) + padding.left;
            let lx4 = xScale(i) + padding.left; // 光照第一个X点
            let x5 = xScale(i) + padding.left + barWidth;
            let lx5 = xScale(i) + padding.left + barWidth; // 光照第二个X点
            let x6 = xScale(i) + padding.left + barWidth / 2;


            let y1 = height - padding.bottom;
            let y2 = height - padding.bottom;
            let y3 = height - padding.bottom;
            let iy4 = height - padding.bottom - yScale(1);
            let ly4 = height - padding.bottom - yScale(1) - yScale(13.72); // 光照初始化第一个Y点
            let iy5 = height - padding.bottom - yScale(1);
            let ly5 = height - padding.bottom - yScale(1) - yScale(13.72); // 光照初始化第二个Y点
            let iy6 = height - padding.bottom - yScale(1);

            let ry4 = height - padding.bottom - yScale(value);
            let rly4 = height - padding.bottom - yScale(value) - yScale(13.72); // 光照结束第一个Y点
            let ry5 = height - padding.bottom - yScale(value);
            let rly5 = height - padding.bottom - yScale(value) - yScale(13.72); // 光照结束第二个Y点
            let ry6 = height - padding.bottom - yScale(value);

            // 圆柱底座
            bar.append('ellipse')
                .attr('cx', x1)
                .attr('cy', y1)
                .attr('rx', barWidth / 2)
                .attr('ry', yScale(9.68))
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

            // 圆柱
            bar.append('path')
                .attr('d', () => {
                    return ["M", x4, iy4, "L", x2, y2, "A", barWidth / 2, barWidth/6.3, 0, 1, 0, x3, y3, "L", x5, iy5, "A", barWidth / 2, 12, 0, 1, 0, x4, iy4].join(' ');
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
                    return ["M", x4, ry4, "L", x2, y2, "A", barWidth / 2, barWidth/6.3, 0, 1, 0, x3, y3, "L", x5, ry5, "A", barWidth / 2, 12, 0, 1, 0, x4, ry4].join(' ');
                });

            // 圆柱顶部大圆
            bar.append('ellipse')
                .attr('cx', x1)
                .attr('cy', y1)
                .attr('rx', barWidth / 2)
                .attr('ry', yScale(9.68))
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


            // 圆柱顶部小圆
            bar.append('ellipse')
                .attr('cx', x1)
                .attr('cy', y1)
                .attr('rx', barWidth / 4)
                .attr('ry', yScale(4.84))
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

            // 添加数值
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


        };

    }
    this.cylinderpictorialBar = cylinderpictorialBar;
})()