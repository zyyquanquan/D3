(() => {
    let pictorialcolumnBar = {};
    pictorialcolumnBar.draw = (args) => {
        let dataset = args.dataset,
            padding = args.padding,
            width = args.width,
            height = args.height,
            warning = args.warning;

        let svg = d3.select(`#${args.id}`).append('svg').attr('width', width).attr('height', height);

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


        // 定义绘制顺序 预警后两段 =》 柱子 =》 预警前两段
        let warningBarAfter = svg.append('g').attr('stroke-width', '1');
        let rectBlack = svg.append('g');
        let bar = svg.append('g').attr('stroke-width', '1').attr('stroke', '#31fc71');
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
            let wx1 = xScale(i) + padding.left + barWidth / 2;
            let wx2 = xScale(i) + padding.left - 12;
            let wx3 = xScale(i) + padding.left + barWidth + 12;
            let wx4 = xScale(i) + padding.left - 12;
            let wx5 = xScale(i) + padding.left + barWidth + 12;
            let wx6 = xScale(i) + padding.left + barWidth / 2;
            let wx7 = xScale(i) + padding.left + barWidth / 2;
            let wx8 = xScale(i) + padding.left + barWidth / 2;

            let wy1 = height - padding.bottom + 30;
            let wy2 = height - padding.bottom + 12;
            let wy3 = height - padding.bottom + 12;
            let wy4 = height - padding.bottom - yScale(warning);
            let wy5 = height - padding.bottom - yScale(warning);
            let wy6 = height - padding.bottom - 15 - yScale(warning);
            let wy7 = height - padding.bottom + 15 - yScale(warning);
            let wy8 = height - padding.bottom - 15;

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
                    return ["M", wx1, wy1, "L", wx3, wy3, "L", wx5, wy5, "L", wx7, wy7, "L", wx4, wy4, "L", wx2, wy2, "L", wx8, wy8, "L", wx2, wy2, "z"].join(' ');
                })
                .attr('fill', 'gray')
                .attr('fill-opacity', '0.2');

            // 预警柱体底部黑菱形
            rectBlack.append('path')
                .attr('d', () => {
                    return ["M", wx1, wy1 + yScale(10), "L", wx3, wy3 + yScale(10), "L", wx8, wy8 + yScale(10), "L", wx2, wy2 + yScale(10), "z"].join(' ');
                })
                .attr('fill', '#050605');

            // 添加地区名
            bar.append('text')
                .attr('transform', (d) => {
                    return `translate(${wx2}, ${wy2 + 60})`;
                })
                .attr('text-anchor', 'middle')
                .attr('fill', '#b4ced9')
                .attr('stroke', '#b4ced9')
                .attr('font-size', '30px')
                .text(dataset[i].name);

            // 文字托盘
            bar.append('ellipse')
                .attr('cx', wx2)
                .attr('cy', wy2 + 65)
                .attr('rx', 32)
                .attr('ry', 2)
                .attr('stroke', 'none')
                .attr('fill', '#000');

            // 预警数字
            if (i == 0) {
                warningBar.append('text').attr('transform', `translate(${wx4 - 40}, ${wy4 + 10})`)
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
            let lx4 = xScale(i) + padding.left - 28; // 光照第一个X点
            let x5 = xScale(i) + padding.left + barWidth;
            let lx5 = xScale(i) + padding.left + barWidth + 28; // 光照第二个X点
            let x6 = xScale(i) + padding.left + barWidth / 2;
            let x7 = xScale(i) + padding.left + barWidth / 2;

            let y1 = height - padding.bottom + 15;
            let y2 = height - padding.bottom;
            let y3 = height - padding.bottom;
            let iy4 = height - padding.bottom - yScale(1);
            let ly4 = height - padding.bottom - yScale(1) - 58; // 光照初始化第一个Y点
            let iy5 = height - padding.bottom - yScale(1);
            let ly5 = height - padding.bottom - yScale(1) - 58; // 光照初始化第二个Y点
            let iy6 = height - padding.bottom + 15 - yScale(1);
            let iy7 = height - padding.bottom - yScale(1) - 15;
            let ry4 = height - padding.bottom - yScale(value);
            let rly4 = height - padding.bottom - yScale(value) - 58; // 光照结束第一个Y点
            let ry5 = height - padding.bottom - yScale(value);
            let rly5 = height - padding.bottom - yScale(value) - 58; // 光照结束第二个Y点
            let ry6 = height - padding.bottom + 15 - yScale(value);
            let ry7 = height - padding.bottom - yScale(value) - 15;

            // 左侧柱子
            bar.append('path')
                .attr('d', () => {
                    return ["M", x1, y1, "L", x2, y2, "L", x4, iy4, "L", x6, iy6, "z"].join(' ');
                })
                .attr('fill', () => {
                    if (value > warning) {
                        return '#31fc71';
                    } else {
                        return '#fa3740';
                    }
                })
                .attr('fill-opacity', '0.2')
                .attr('stroke', () => {
                    if (value > warning) {
                        return '#31fc71';
                    } else {
                        return '#fa3740';
                    }
                })
                .transition()
                .duration(1000)
                .delay(i * 500)
                .attr('d', () => {
                    return ["M", x1, y1, "L", x2, y2, "L", x4, ry4, "L", x6, ry6, "z"].join(' ');
                });

            // 右侧柱子   
            bar.append('path')
                .attr('d', () => {
                    return ["M", x1, y1, "L", x3, y3, "L", x5, iy5, "L", x6, iy6, "z"].join(' ');
                })
                .attr('fill', () => {
                    if (value > warning) {
                        return 'url(#' + linearGradient.attr('id') + ')';
                    } else {
                        return '#e2343c';
                    }
                })
                .attr('fill-opacity', '0.8')
                .attr('stroke', () => {
                    if (value > warning) {
                        return '#31fc71';
                    } else {
                        return '#fa3740';
                    }
                })
                .transition()
                .duration(1000)
                .delay(i * 500)
                .attr('d', () => {
                    return ["M", x1, y1, "L", x3, y3, "L", x5, ry5, "L", x6, ry6, "z"].join(' ');
                });

            // 头部菱形 
            bar.append('path')
                .attr('d', () => {
                    return ["M", x6, iy6, "L", x5, iy5, "L", x7, iy7, "L", x4, iy4, "z"].join(" ");
                })
                .attr('fill', () => {
                    if (value > warning) {
                        return '#20e8a0';
                    } else {
                        return '#fa3740';
                    }
                })
                .attr('fill-opacity', '0.2')
                .attr('stroke', () => {
                    if (value > warning) {
                        return '#31fc71';
                    } else {
                        return '#fa3740';
                    }
                })
                .transition()
                .duration(1000)
                .delay(i * 500)
                .attr('d', () => {
                    return ["M", x6, ry6, "L", x5, ry5, "L", x7, ry7, "L", x4, ry4, "z"].join(" ");
                })

            // 光照 
            bar.append('path')
                .attr('d', () => {
                    return ["M", x4, iy4, "L", x6, iy6, "L", x5, iy5, "L", lx5, ly5, "L", lx4, ly4, "z"].join(" ");
                })
                .attr('fill', () => {
                    if (value > warning) {
                        return 'url(#' + lightGreenGradient.attr('id') + ')';
                    } else {
                        return 'url(#' + lightRedGradient.attr('id') + ')';
                    }
                })
                .attr('fill-opacity', '0.9')
                .attr('stroke', 'none')
                .transition()
                .duration(1000)
                .delay(i * 500)
                .attr('d', () => {
                    return ["M", x4, ry4, "L", x6, ry6, "L", x5, ry5, "L", lx5, rly5, "L", lx4, rly4, "z"].join(" ");
                })

            // 添加数值
            bar.append('text')
                .attr('transform', (d) => {
                    return `translate(${x7}, ${iy7 + 15})`;
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
                    return `translate(${x7}, ${ry7 + 15})`;
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
    this.pictorialcolumnBar = pictorialcolumnBar;
})()