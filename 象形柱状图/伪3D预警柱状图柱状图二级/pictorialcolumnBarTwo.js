(() => {
    let pictorialcolumnBarTwo = {};
    pictorialcolumnBarTwo.draw = (args) => {
        let dataset = args.dataset,
            padding = args.padding,
            width = args.width,
            height = args.height,
            warning = args.warning;

        let svg = d3.select(`#${args.id}`);
        svg.selectAll('*').remove(); // 清空画布 
        //定义一个线性渐变
        let defs = svg.append("defs");

        let linearGradient = defs.append("linearGradient")
            .attr("id", "linearColor")
            .attr("x1", "0%")
            .attr("y1", "100%")
            .attr("x2", "0%")
            .attr("y2", "0%");

        linearGradient.append("stop")
            .attr("offset", "0%")
            .style("stop-color", '#30fb73');

        linearGradient.append("stop")
            .attr("offset", "100%")
            .style("stop-color", '#13d8c6');

        // 光照绿色渐变
        let lightGreenGradient = defs.append("linearGradient")
            .attr("id", "lightGreenColor")
            .attr("x1", "0%")
            .attr("y1", "100%")
            .attr("x2", "0%")
            .attr("y2", "0%");

        lightGreenGradient.append("stop")
            .attr("offset", "0%")
            .style("stop-color", '#0fd3d1');

        lightGreenGradient.append("stop")
            .attr("offset", "100%")
            .style("stop-color", 'transparent');

        // 光照红色渐变
        let lightRedGradient = defs.append("linearGradient")
            .attr("id", "lightRedColor")
            .attr("x1", "0%")
            .attr("y1", "100%")
            .attr("x2", "0%")
            .attr("y2", "0%");

        lightRedGradient.append("stop")
            .attr("offset", "0%")
            .style("stop-color", '#fa3740');

        lightRedGradient.append("stop")
            .attr("offset", "100%")
            .style("stop-color", 'transparent');

        let maxValue = d3.max(dataset, (d) => {
            return Number(d.value) + Number(d.value1) + Number(d.value2);
        });
        if (maxValue < warning) {
            maxValue = warning;
        };

        let xScale = d3.scale.ordinal().domain(d3.range(dataset.length)).rangeRoundBands([0, width - padding.left - padding.right], 0.5, 0.5);

        let yScale = d3.scale.linear()
            .domain([0, maxValue * 1.2])
            .range([0, height - padding.top - padding.bottom]);

        let barWidth = xScale.rangeBand();

        // 定义绘制顺序 预警后两段 =》 柱子 =》 预警前两段
        let grid = svg.selectAll(".grid").data(yScale.ticks()).enter().append("g"); // 定义网格线
        let warningBarAfter = svg.append('g').attr('stroke-width', '1');
        let rectBlack = svg.append('g');
        let bar = svg.append('g').attr('stroke-width', '1').attr('stroke', '#31fc71');
        let warningBarFront = svg.append('g').attr('stroke-width', '1').attr('stroke', '#31fc71');
        let warningBar = svg.append('g');


        // 预警值
        for (let i = 0; i < dataset.length; i++) {
            let value = Number(dataset[i].value);
            let value1 = Number(dataset[i].value1);
            let value2 = Number(dataset[i].value2);
            let value3 = value + value1 + value2;

            let wx1 = xScale(i) + padding.left + barWidth / 2;
            let wx2 = xScale(i) + padding.left - 38;
            let wx3 = xScale(i) + padding.left + barWidth + 38;
            let wx4 = xScale(i) + padding.left - 38;
            let wx5 = xScale(i) + padding.left + barWidth + 38;
            let wx6 = xScale(i) + padding.left + barWidth / 2;
            let wx7 = xScale(i) + padding.left + barWidth / 2;
            let wx8 = xScale(i) + padding.left + barWidth / 2;

            let wy1 = height - padding.bottom + 35;
            let wy2 = height - padding.bottom + 12;
            let wy3 = height - padding.bottom + 12;
            let wy4 = height - padding.bottom - yScale(warning);
            let wy5 = height - padding.bottom - yScale(warning);
            let wy6 = height - padding.bottom - 20 - yScale(warning);
            let wy7 = height - padding.bottom + 20 - yScale(warning);
            let wy8 = height - padding.bottom - 15;

            if (value3 < warning) {
                // 预警柱子后两线段
                warningBarAfter.append('path')
                    .attr('d', () => {
                        return ["M", wx4, wy4, "L", wx6, wy6, "L", wx5, wy5].join(' ');
                    })
                    .attr('fill', 'none')
                    .attr('stroke', '#fa3740')
                    .attr('stroke-width', '1');

                // 预警柱子前两线段
                warningBarFront.append('path')
                    .attr('d', () => {
                        return ["M", wx4, wy4, "L", wx7, wy7, "L", wx5, wy5].join(' ');
                    })
                    .attr('fill', 'none')
                    .attr('stroke', '#fa3740')
                    .attr('stroke-width', '1');

                // 预警柱体
                warningBar.append('path')
                    .attr('d', () => {
                        return ["M", wx1, wy1, "L", wx3, wy3, "L", wx5, wy5, "L", wx7, wy7, "L", wx4, wy4, "L", wx2, wy2, "z"].join(' ');
                    })
                    .attr('fill', 'gray')
                    .attr('fill-opacity', '0.2')
                    .attr('stroke', '#fa3740')
                    .attr('stroke-width', '2');
            }

            // 预警柱体底部黑菱形
            rectBlack.append('ellipse')
                .attr('cx', wx1)
                .attr('cy', wy1 + 40)
                .attr('rx', barWidth / 1.7)
                .attr('ry', barWidth / 7)
                .attr('stroke', 'none')
                .attr('fill', '#000');

            // 添加地区名
            if (dataset[i].name.length <= 7) {
                bar.append('text')
                    .attr('transform', (d) => {
                        return `translate(${wx1}, ${wy1 + 100})`;
                    })
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#b4ced9')
                    .attr('stroke', '#b4ced9')
                    .attr('font-size', '36px')
                    .text(dataset[i].name);
            } else {
                bar.append('text')
                    .attr('transform', (d) => {
                        return `translate(${wx1}, ${wy1 + 100})`;
                    })
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#b4ced9')
                    .attr('stroke', '#b4ced9')
                    .attr('font-size', '36px')
                    .text(dataset[i].name.substring(0, 8));

                bar.append('text')
                    .attr('transform', (d) => {
                        return `translate(${wx1}, ${wy1 + 145})`;
                    })
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#b4ced9')
                    .attr('stroke', '#b4ced9')
                    .attr('font-size', '36px')
                    .text(dataset[i].name.substring(8));
            }

            // 文字托盘
            bar.append('ellipse')
                .attr('cx', wx1)
                .attr('cy', wy1 + 110)
                .attr('rx', 32)
                .attr('ry', 2)
                .attr('stroke', 'none')
                .attr('fill', '#000');
        }

        // 预警线
        warningBarAfter.append("line")
            .attr("x1", padding.left + barWidth / 1.5)
            .attr("y1", height - padding.bottom - yScale(warning))
            .attr("x2", width - padding.right - padding.left)
            .attr("y2", height - padding.bottom - yScale(warning))
            .attr("stroke", '#fa3740')
            .attr("stroke-dasharray", '5, 5')
            .attr("stroke-width", '5')
            .attr("opacity", '1');

        warningBarAfter.append('text').attr('transform', `translate(${padding.left + barWidth / 1.5}, ${height - padding.bottom - yScale(warning)})`)
            .attr('text-anchor', 'start')
            .attr('font-size', '30px')
            .attr('font-family', 'MyCustomFont')
            .attr('fill', '#fa3740')
            .attr('font-family', 'MyCustomFont')
            .text(warning);

        for (let i = 0; i < dataset.length; i++) {
            let value = Number(dataset[i].value);
            let value1 = Number(dataset[i].value1);
            let value2 = Number(dataset[i].value2);
            let value3 = value + value1 + value2;
            let x1 = xScale(i) + padding.left + barWidth / 2;
            let x2 = xScale(i) + padding.left;
            let x3 = xScale(i) + padding.left + barWidth;
            let x4 = xScale(i) + padding.left;
            let x5 = xScale(i) + padding.left + barWidth;
            let x6 = xScale(i) + padding.left + barWidth / 2;
            let x7 = xScale(i) + padding.left + barWidth / 2;

            let y1 = height - padding.bottom + 15;
            let y2 = height - padding.bottom;
            let y3 = height - padding.bottom;



            // 医生数据
            let iy4 = height - padding.bottom - yScale(1);
            let iy5 = height - padding.bottom - yScale(1);
            let iy6 = height - padding.bottom + 20 - yScale(1);
            let iy7 = height - padding.bottom - yScale(1) - 20;
            let ry4 = height - padding.bottom - yScale(value);
            let ry5 = height - padding.bottom - yScale(value);
            let ry6 = height - padding.bottom + 20 - yScale(value);
            let ry7 = height - padding.bottom - yScale(value) - 20;

            // 护士数据
            let ny4 = height - padding.bottom - yScale(value) - yScale(value1);
            let ny5 = height - padding.bottom - yScale(value) - yScale(value1);
            let ny6 = height - padding.bottom + 20 - yScale(value) - yScale(value1);
            let ny7 = height - padding.bottom - yScale(value) - 20 - yScale(value1);

            // 司机数据
            let dy4 = height - padding.bottom - yScale(value) - yScale(value1) - yScale(value2);
            let dy5 = height - padding.bottom - yScale(value) - yScale(value1) - yScale(value2);
            let dy6 = height - padding.bottom + 20 - yScale(value) - yScale(value1) - yScale(value2);
            let dy7 = height - padding.bottom - yScale(value) - 20 - yScale(value1) - yScale(value2);

            // 光照X，Y点
            let lx4 = xScale(i) + padding.left - 50; // 光照第一个X点
            let lx5 = xScale(i) + padding.left + barWidth + 50; // 光照第二个X点
            let ly4 = height - padding.bottom - yScale(1) - 80; // 光照初始化第一个Y点
            let ly5 = height - padding.bottom - yScale(1) - 80; // 光照初始化第二个Y点
            let rly4 = height - padding.bottom - yScale(value3) - 80; // 光照结束第一个Y点
            let rly5 = height - padding.bottom - yScale(value3) - 80; // 光照结束第二个Y点

            // 左侧柱子
            // 医生左侧柱子
            bar.append('path')
                .attr('d', () => {
                    return ["M", x1, y1, "L", x2, y2, "L", x4, iy4, "L", x6, iy6, "z"].join(' ');
                })
                .attr('fill', '#0fd3d1')
                .attr('fill-opacity', '0')
                .attr('stroke-opacity', '0')
                .attr('stroke', '#0fd3d1')
                .attr('stroke-width', '2')
                .transition()
                .duration(500)
                .delay(i * 500)
                .attr('fill-opacity', '0.2')
                .attr('stroke-opacity', '1')
                .attr('d', () => {
                    return ["M", x1, y1, "L", x2, y2, "L", x4, ry4, "L", x6, ry6, "z"].join(' ');
                });

            // 护士左侧柱子
            bar.append('path')
                .attr('d', () => {
                    return ["M", x6, ry6, "L", x4, ry4, "L", x4, ry4, "L", x6, ry6, "z"].join(' ');
                })
                .attr('fill', '#2f79f4')
                .attr('fill-opacity', '0')
                .attr('stroke-opacity', '0')
                .attr('stroke', '#2f79f4')
                .attr('stroke-width', '2')
                .transition()
                .duration(500)
                .delay(i * 500 + 500)
                .attr('fill-opacity', '0.2')
                .attr('stroke-opacity', '0')
                .attr('d', () => {
                    return ["M", x6, ry6, "L", x4, ry4, "L", x4, ny4, "L", x6, ny6, "z"].join(' ');
                });

            // 司机左侧柱子
            bar.append('path')
                .attr('d', () => {
                    return ["M", x6, ny6, "L", x4, ny4, "L", x4, ny4, "L", x6, ny6, "z"].join(' ');
                })
                .attr('fill', '#aa55fa')
                .attr('fill-opacity', '0')
                .attr('stroke-opacity', '0')
                .attr('stroke', '#aa55fa')
                .attr('stroke-width', '2')
                .transition()
                .duration(500)
                .delay(i * 500 + 1000)
                .attr('fill-opacity', '0.2')
                .attr('stroke-opacity', '1')
                .attr('d', () => {
                    return ["M", x6, ny6, "L", x4, ny4, "L", x4, dy4, "L", x6, dy6, "z"].join(' ');
                });

            // 右侧柱子 
            // 右侧医生柱子  
            bar.append('path')
                .attr('d', () => {
                    return ["M", x1, y1, "L", x3, y3, "L", x5, iy5, "L", x6, iy6, "z"].join(' ');
                })
                .attr('fill', '#0fd3d1')
                .attr('fill-opacity', '0')
                .attr('stroke-opacity', '0')
                .attr('stroke', '#0fd3d1')
                .attr('stroke-width', '2')
                .transition()
                .duration(500)
                .delay(i * 500)
                .attr('fill-opacity', '0.8')
                .attr('stroke-opacity', '0')
                .attr('d', () => {
                    return ["M", x1, y1, "L", x3, y3, "L", x5, ry5, "L", x6, ry6, "z"].join(' ');
                });

            // 右侧护士柱子  
            bar.append('path')
                .attr('d', () => {
                    return ["M", x6, ry6, "L", x5, ry6, "L", x5, ry5, "L", x6, ry6, "z"].join(' ');
                })
                .attr('fill', '#2f79f4')
                .attr('fill-opacity', '0')
                .attr('stroke-opacity', '0')
                .attr('stroke', '#2f79f4')
                .attr('stroke-width', '2')
                .transition()
                .duration(500)
                .delay(i * 500 + 500)
                .attr('fill-opacity', '0.8')
                .attr('stroke-opacity', '1')
                .attr('d', () => {
                    return ["M", x6, ry6, "L", x5, ry5, "L", x5, ny5, "L", x6, ny6, "z"].join(' ');
                });

            // 右侧司机柱子  
            bar.append('path')
                .attr('d', () => {
                    return ["M", x6, ny6, "L", x5, ny5, "L", x5, ny5, "L", x6, ny6, "z"].join(' ');
                })
                .attr('fill', '#aa55fa')
                .attr('fill-opacity', '0')
                .attr('stroke-opacity', '0')
                .attr('stroke', '#aa55fa')
                .attr('stroke-width', '2')
                .transition()
                .duration(500)
                .delay(i * 500 + 1000)
                .attr('fill-opacity', '0.8')
                .attr('stroke-opacity', '1')
                .attr('d', () => {
                    return ["M", x6, ny6, "L", x5, ny5, "L", x5, dy5, "L", x6, dy6, "z"].join(' ');
                });

            // 头部菱形 
            // 医生头部菱形
            bar.append('path')
                .attr('d', () => {
                    return ["M", x6, iy6, "L", x5, iy5, "L", x7, iy7, "L", x4, iy4, "z"].join(" ");
                })
                .attr('fill', '#0fd3d1')
                .attr('fill-opacity', '0')
                .attr('stroke-opacity', '0')
                .attr('stroke', '#0fd3d1')
                .attr('stroke-width', '2')
                .transition()
                .duration(500)
                .delay(i * 500)
                .attr('fill-opacity', '0.2')
                .attr('stroke-opacity', '0')
                .attr('d', () => {
                    return ["M", x6, ry6, "L", x5, ry5, "L", x7, ry7, "L", x4, ry4, "z"].join(" ");
                });

            // 护士头部菱形
            bar.append('path')
                .attr('d', () => {
                    return ["M", x6, ry6, "L", x5, ry5, "L", x7, ry7, "L", x4, ry4, "z"].join(" ");
                })
                .attr('fill', '#2f79f4')
                .attr('fill-opacity', '0')
                .attr('stroke-opacity', '0')
                .attr('stroke', '#2f79f4')
                .attr('stroke-width', '2')
                .transition()
                .duration(500)
                .delay(i * 500 + 500)
                .attr('fill-opacity', '0.2')
                .attr('stroke-opacity', '0')
                .attr('d', () => {
                    return ["M", x6, ny6, "L", x5, ny5, "L", x7, ny7, "L", x4, ny4, "z"].join(" ");
                });

            // 司机头部菱形
            bar.append('path')
                .attr('d', () => {
                    return ["M", x6, ny6, "L", x5, ny5, "L", x7, ny7, "L", x4, ny4, "z"].join(" ");
                })
                .attr('fill', '#2f79f4')
                .attr('fill-opacity', '0')
                .attr('stroke-opacity', '0')
                .attr('stroke', '#2f79f4')
                .attr('stroke-width', '2')
                .transition()
                .duration(500)
                .delay(i * 500 + 1000)
                .attr('fill-opacity', '0.2')
                .attr('stroke-opacity', '0')
                .attr('d', () => {
                    return ["M", x6, dy6, "L", x5, dy5, "L", x7, dy7, "L", x4, dy4, "z"].join(" ");
                });

            // 光照 
            bar.append('path')
                .attr('d', () => {
                    return ["M", x4, iy4, "L", x6, iy6, "L", x5, iy5, "L", lx5, ly5, "L", lx4, ly4, "z"].join(" ");
                })
                .attr('fill', 'url(#' + lightGreenGradient.attr('id') + ')')
                .attr('fill-opacity', '0')
                .attr('stroke', 'none')
                .transition()
                .duration(500)
                .delay(i * 500 + 1000)
                .attr('fill-opacity', '0.9')
                .attr('d', () => {
                    return ["M", x4, dy4, "L", x6, dy6, "L", x5, dy5, "L", lx5, rly5, "L", lx4, rly4, "z"].join(" ");
                })

            // 添加数值
            bar.append('text')
                .attr('transform', (d) => {
                    return `translate(${x7}, ${iy7 + 15})`;
                })
                .attr('text-anchor', 'middle')
                .attr('fill', 'white')
                .attr('font-size', '50px')
                .attr('stroke', 'white')
                .attr('font-family', 'MyCustomFont')
                .transition()
                .duration(500)
                .delay(i * 500 + 1000)
                .attr('transform', (d) => {
                    return `translate(${x7}, ${dy7 + 15})`;
                })
                .tween("text", function () {
                    var d = value3,
                        i = d3.interpolate(this.textContent, d),
                        prec = (d + "").split("."),
                        round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
                    return function (t) {
                        this.textContent = Math.round(i(t) * round) / round;
                    };
                });
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
    this.pictorialcolumnBarTwo = pictorialcolumnBarTwo;
})()