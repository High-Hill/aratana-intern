var BasicBarChart = (function(){
  function BasicBarChart(d3, chartData){
    this.d3 = d3;
    this.chartData = chartData;
    this.initChart();

  }
  //class内の関数宣言 prototype
  BasicBarChart.prototype.initChart = function(){
    this.width = this.chartData.width - this.chartData.margin.left -this.chartData.margin.right;
    this.height = this.chartData.height - this.chartData.margin.bottom -this.chartData.margin.top;;
    this.chartData.x = this.d3.scale.ordinal().rangeRoundBands([0,this.width],.1);
    this.chartData.y0 = this.d3.scale.linear().range([this.height, 0]);
    this.chartData.y1 = this.d3.scale.linear().range([this.height, 0]);
    //memory領域
    this.chartData.xAxis = this.d3.svg.axis().scale(this.chartData.x).orient("bottom");
    this.chartData.yAxis0 = this.d3.svg.axis().scale(this.chartData.y0).orient("left");
    this.chartData.yAxis1 = this.d3.svg.axis().scale(this.chartData.y1).orient("right");
    this.chartData.svg = this.d3.select("#" + this.chartData.id).append("svg")
    .attr("width", this.chartData.width)
    .attr("height", this.chartData.height)
    .append("g")
    .attr("transform","translate(" + this.chartData.margin.left + "," + this.chartData.margin.top + ")");
  }
  BasicBarChart.prototype.viewChart = function(){
    var chartData = this.chartData;
    var width = this.width;
    var height = this.height;
    this.d3.json(chartData.file, function(error, data){
      if (error) throw error;

      //domain = レンジを決める
      //リテラル値　= 定数などを取らずに直接とる
      /*レンジをきめる*/
      chartData.x.domain(data.map(function(d){ return d.year;}));
      chartData.y0.domain([0,this.d3.max(data, function(d){ return d.money;})]);
      chartData.y1.domain([0,this.d3.max(data, function(d){ return d.number;})]);
      /*レンジをきめる*/

      /*メモリを表示*/
      chartData.svg.append("g")
      .attr("class","x axis")
      .attr("transform","translate(0," + height + ")").call(chartData.xAxis);
      chartData.svg.append("g")
      .attr("class","y axis axisLeft")
      .attr("transform","translate(0,0)").call(chartData.yAxis0);
      chartData.svg.append("g")
      .attr("class","y axis axisRight")
      .attr("transform","translate(" + width + ",0)").call(chartData.yAxis1);
      /*メモリを表示*/

      //enter = 繰り返し処理
      /*バーを表示*/
      var bars = chartData.svg.selectAll(".bar").data(data).enter()

      bars.append("rect").attr("class","bar1")
      .attr("x",function(d){ return chartData.x(d.year);})
      .attr("width",chartData.x.rangeBand() /2 )
      .attr("y",function(d){ return chartData.y0(d.money);})
      .attr("height",function(d){ return height - chartData.y0(d.money);});

      bars.append("rect").attr("class","bar2")
      .attr("x",function(d){ return chartData.x(d.year) + chartData.x.rangeBand() / 2;})
      .attr("width",chartData.x.rangeBand() /2 )
      .attr("y",function(d){ return chartData.y1(d.number);})
      .attr("height",function(d){ return height - chartData.y1(d.number);});
      /*バーを表示*/
    });
  }
  return BasicBarChart;
})();
var chartData = {
  //margin のグループ化 shorthand property
  "margin": {"top": 20,"right":20 ,"bottom": 20, "left": 40},
  "width":960,
  "height":500,
  "x":"",
  "y0":"",
  "y1":"",
  "xAxis": "",
  "yAxis0": "",
  "yAxis1":"",
  "id" : "chart1",
  "svg" : "",
  "file":"data.json"
};
var chart = new BasicBarChart(d3, chartData);

document.getElementById("view").onclick = function(){
  console.log("わーい");
  chart.viewChart();
};
