(() => {
    let PieLadderfour3D = {};
    PieLadderfour3D.draw = (args) => {
        let values = args.values, // 数据数组
            names = args.names, // 数据数组
            colors = args.colors, // 颜色数组
            viewAnge = args.tilt, // 视觉
            width = args.width, // 视窗宽度
            height = args.height, // 视窗高度
            sum = 0, // 数组总和
            percentages = [], // 数据占比    
            pie_half_width = width / 2,
            pie_half_height = height,
            pie_radius = (pie_half_width > pie_half_height) ? 1 / 3 * pie_half_height : 1 / 3 * pie_half_width, // 饼图半径
            nos = values.length,
            r1 = pie_radius, // 椭圆rx
            r2 = viewAnge * r1, // 椭圆ry
            cx = pie_half_width / 1,
            cy = pie_half_height / 1.3;
        // 添加svg视窗

        let svg = d3.select(`#${args.id}`)
        svg.selectAll('*').remove(); // 清空画布  
        let bottomside = svg.append('g');
        let heightside = svg.append('g').attr('fill-rule', 'evenodd');
        let scenterside = svg.append('g');
        let ecenterside = svg.append('g');
        let topside = svg.append('g');
        let text = svg.append('g');
        let topcircle = svg.append('g');
        let imghtml = '';

        // 得到数据总和
        for (let i = 0; i < values.length; i += 1) {
            sum += values[i];
        }

        // 得到数据占比数组
        for (let j = 0; j < values.length; j += 1) {
            percentages.push(Math.round((values[j] / sum) * 100));
        }

        let x = cx + r1, // x坐标  cx代表视窗/2， r1饼图半径
            y = cy, // y坐标  cy代表视窗 
            // preAngle = Math.PI*270/180,
            preAngle = 0,
            angles = [Math.PI / 2.25, Math.PI / 1.8, Math.PI / 2.25, Math.PI / 1.8];

        for (let i = 0; i < nos; i++) {
            let startX = x,
                startY = y,
                angle = angles[i], // 得到每一个扇形的结束弧度值 公式 百分比*2π = 弧度值
                largeArc = 0, // 定义椭圆是大角度还是小角度
                percentage = percentages[i],
                name = names[i];

            if (angle > Math.PI) {
                largeArc = 1;
            };
            x = cx + r1 * Math.cos(angle + preAngle); // 得到扇形弧度起点X坐标
            circleX = cx + r1 * Math.cos(angle / 2 + preAngle); // 得到白色椭圆起点X坐标

            y = cy + r2 * Math.sin(angle + preAngle); // 得到扇形弧度起点Y坐标
            circleY = cy + r2 * Math.sin(angle / 2 + preAngle); // 得到白色椭圆起点Y坐标

            // 绘制底部饼图
            bottomside
                .append('path')
                .attr('d', () => {
                    return ["M" + x + "," + y +
                        "A" + r1 + "," + r2 + ",0," + largeArc + ",0," + startX + "," + startY +
                        "L" + cx + "," + cy + "z"
                    ].join(' ');
                })
                .attr('opacity', '0')
                .attr('fill', (d, i) => {
                    return colors[i];
                })
                .transition()
                .duration(1000)
                .delay(nos * 500 - i * 500)
                .attr('opacity', '0.5');

            let dsize = cy * (values[i] / sum);

            // 绘制高度
            heightside
                .append('path')
                .attr('d', () => {
                    return ["M" + startX + "," + startY +
                        "A" + r1 + "," + r2 + ",0," + largeArc + ",1," + x + "," + y +
                        "L" + x + "," + y +
                        "A" + r1 + "," + r2 + ",0," + largeArc + ", 0," + startX + "," + startY + "z"
                    ].join(' ');
                })
                .attr('opacity', '0.7')
                .attr('fill', () => {
                    return colors[i];
                })
                .transition()
                .duration(1000)
                .delay(nos * 500 - i * 500)
                .attr('d', () => {
                    return ["M" + startX + "," + startY +
                        "A" + r1 + "," + r2 + ",0," + largeArc + ",1," + x + "," + y +
                        "L" + x + "," + (y - dsize) +
                        "A" + r1 + "," + r2 + ",0," + largeArc + ", 0," + startX + "," + (startY - dsize) + "z"
                    ].join(' ');
                })

            // 绘制扇形开始中间线条
            scenterside
                .append('path')
                .attr('d', () => {
                    return ["M" + cx + "," + cy +
                        "L" + cx + "," + cy +
                        "L" + startX + "," + startY +
                        "L" + startX + "," + startY + "z"
                    ].join(' ');
                })
                .attr('opacity', '0.7')
                .attr('fill', () => {
                    return colors[i];
                })
                .transition()
                .duration(1000)
                .delay(nos * 500 - i * 500)
                .attr('d', () => {
                    return ["M" + cx + "," + cy +
                        "L" + cx + "," + (cy - dsize) +
                        "L" + startX + "," + (startY - dsize) +
                        "L" + startX + "," + startY + "z"
                    ].join(' ');
                });

            // 绘制扇形结束中间线条
            ecenterside
                .append('path')
                .attr('d', () => {
                    return ["M" + cx + "," + cy +
                        "L" + cx + "," + cy +
                        "L" + x + "," + y +
                        "L" + x + "," + y + "z"
                    ].join(' ');
                })
                .attr('opacity', '0.5')
                .attr('fill', () => {
                    return colors[i];
                })
                .transition()
                .duration(1000)
                .delay(nos * 500 - i * 500)
                .attr('d', () => {
                    return ["M" + cx + "," + cy +
                        "L" + cx + "," + (cy - dsize) +
                        "L" + x + "," + (y - dsize) +
                        "L" + x + "," + y + "z"
                    ].join(' ');
                });

            // 绘制顶部
            topside
                .append('path')
                .attr('d', () => {
                    return ["M" + x + "," + y +
                        "A" + r1 + "," + r2 + ",0," + largeArc + ",0," + startX + "," + startY +
                        "L" + cx + "," + cy + "z"
                    ].join(' ');
                })
                .attr('fill', () => {
                    return colors[i];
                })
                .attr('opacity', '0')
                .transition()
                .duration(1000)
                .delay(nos * 500 - i * 500)
                .attr('opacity', '1')
                .attr('d', () => {
                    return ["M" + x + "," + (y - dsize) +
                        "A" + r1 + "," + r2 + ",0," + largeArc + ",0," + startX + "," + (startY - dsize) +
                        "L" + cx + "," + (cy - dsize) + "z"
                    ].join(' ');
                });

            // 绘制白色小椭圆
            topcircle.append('circle')
                .attr('cx', circleX)
                .attr('cy', circleY)
                .attr('r', 15)
                .attr('fill', 'white')
                .attr('stroke', 'white')
                .attr('opacity', '0')
                .transition()
                .duration(1000)
                .delay(nos * 500 - i * 500)
                .attr('cy', circleY - dsize)
                .attr('fill-opacity', '0.8')
                .attr('opacity', '1');


            // 绘制文字
            text.append('text')
                .attr('x', () => {
                    if (i == 0 || i == 3) {
                        return circleX + 50;
                    } else if (i == 1 || i == 2) {
                        return circleX - 100;
                    }
                })
                .attr('y', () => {
                    return circleY;
                })
                .attr('text-anchor', () => {
                    if (i == 0 || i == 3) {
                        return 'start';
                    } else {
                        return 'end';
                    }
                })
                .attr('fill', () => {
                    return colors[i];
                })
                .attr('font-size', '50')
                .attr('word-spacing', '5px')
                .attr('opacity', '0')
                .transition()
                .duration(1000)
                .delay(nos * 500 - i * 500)
                .attr('opacity', '1')
                .attr('y', () => {
                    return circleY - dsize;
                })
                .tween("text", function () {
                    var d = percentage,
                        i = d3.interpolate(this.textContent, d),
                        prec = (d + "").split("."),
                        round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
                    return function (t) {
                        this.textContent = name + ': ' + Math.round(i(t) * round) / round;
                    };
                });
            // imghtml += `<img src="images/answerThePhone/tel0${i+1}.png" style="position: absolute;left: ${circleX - 54}px; top:${circleY - 54- dsize}px; z-index: 2;" class="answerThePhonedelay"></img>`  
            preAngle += angle;

        }
        // let hospitalDepartureThreeLogo = document.getElementById('hospitalDepartureThreeLogo');
        // hospitalDepartureThreeLogo.innerHTML = imghtml;
    };
    this.PieLadderfour3D = PieLadderfour3D;
})();