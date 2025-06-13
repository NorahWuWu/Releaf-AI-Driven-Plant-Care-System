function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Horizon chart</h1><a href="https://d3js.org/">D3</a> › <a href="/@d3/gallery">Gallery</a></div>

# Horizon chart

Horizon charts are an alternative to [ridgeline plots](/@d3/ridgeline-plot) and small-multiple area charts that allow greater precision for a given vertical space by using colored bands. These charts can also be used with diverging color scales to [differentiate positive and negative values](/@d3/horizon-chart-ii). Data: [Christopher Möller](https://gist.github.com/chrtze/c74efb46cadb6a908bbbf5227934bfea).`
)}

function _scheme(Inputs,d3){return(
Inputs.select(
  new Map([
    ["Blues", d3.schemeBlues],
    ["Greens", d3.schemeGreens],
    ["Greys", d3.schemeGreys],
    ["Oranges", d3.schemeOranges],
    ["Purples", d3.schemePurples],
    ["Reds", d3.schemeReds],
    ["BuGn", d3.schemeBuGn],
    ["BuPu", d3.schemeBuPu],
    ["GnBu", d3.schemeGnBu],
    ["OrRd", d3.schemeOrRd],
    ["PuBu", d3.schemePuBu],
    ["PuBuGn", d3.schemePuBuGn],
    ["PuRd", d3.schemePuRd],
    ["RdPu", d3.schemeRdPu],
    ["YlGn", d3.schemeYlGn],
    ["YlGnBu", d3.schemeYlGnBu],
    ["YlOrBr", d3.schemeYlOrBr],
    ["YlOrRd", d3.schemeYlOrRd]
  ]),
  {label: "Color scheme"}
)
)}

function _data(FileAttachment){return(
FileAttachment("polka_dot_plant_growth_data.csv").csv({typed: true})
)}

function _plants(d3,data){return(
d3.group(data, d => d.Plant_ID)
)}

function _transformed(data,variable)
{
  const stageOrder = [
    "Sowing/Cutting",
    "Germination/Rooting",
    "Seedling Stage",
    "Early Vegetative",
    "Mid Vegetative",
    "Late Vegetative",
    "Mature Stage",
    "Light Adjustment",
    "Pre-Flowering",
    "Flowering",
    "Post-Flowering",
    "Growth Stagnation",
    "Decline Stage",
    "Dormant Stage",
    "Post-Pruning Recovery"
  ];

  const stageMap = Object.fromEntries(stageOrder.map((stage, i) => [stage, i]));

 
  const output = [];
  for (const stage of stageOrder) {
    const stageData = data.filter(d => d.Growth_Stage === stage);
    stageData.forEach((d, i) => {
      output.push({
        name: stage,
        date: new Date(2024, 0, 1 + stageMap[stage] * 2 + i), 
        value: d[variable]
      });
    });
  }

  return output;
}


function _bands(Inputs){return(
Inputs.range([1, 10], {step: 1, value: 10, label: "Bands"})
)}

function _variable(Inputs){return(
Inputs.radio(
  [
    "Avg_Temperature_C",
    "Light_Hours_Per_Day",
    "Relative_Humidity_Percent",
    "Fertilizer_Freq_Per_Week"
  ],
  {
    label: "Choose The Dependent Variable",
    value: "Avg_Temperature_C" 
  }
)
)}

function _colors(d3,bands){return(
d3.schemeBuGn[bands] || d3.schemeBuGn[6]
)}

function _chart(d3,transformed,bands,colors)
{

  {
  const style = document.createElement("style");
  style.textContent = `
    @font-face {
      font-family: 'Elastre';
      src: url('https://res.cloudinary.com/dtu3vkxv6/raw/upload/v1746886734/Elastre_HEXP_INKT_vfwhma.ttf') format('truetype');
    }

    label, input[type="range"], span {
      font-family: 'Elastre', sans-serif !important;
      font-size: 10px;
    }
  `;
    
  document.head.appendChild(style);
}

  const series = d3.rollup(transformed, v => d3.sort(v, d => d.date), d => d.name);

  const marginTop = 30;
  const marginRight = 10;
  const marginBottom = 0;
  const marginLeft = 100;
  const width = 928;
  const size = 25;
  const height = series.size * size + marginTop + marginBottom;
  const padding = 1;

  const x = d3.scaleUtc()
    .domain(d3.extent(transformed, d => d.date))
    .range([0, width - marginLeft - marginRight]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(transformed, d => d.value)])
    .range([size, size - bands * (size - padding)]);

  const area = d3.area()
    .defined(d => !isNaN(d.value))
    .x(d => x(d.date))
    .y0(size)
    .y1(d => y(d.value));

  const uid = `O-${Math.random().toString(16).slice(2)}`;

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; font-size: 8px; font-family: Elastre, sans-serif;");

 
  svg.append("style").text(`
    @font-face {
      font-family: 'Elastre';
      src: url('https://res.cloudinary.com/dtu3vkxv6/raw/upload/v1746886734/Elastre_HEXP_INKT_vfwhma.ttf') format('truetype');
    }
  `);

  const g = svg.append("g")
    .selectAll("g")
    .data(series)
    .join("g")
    .attr("transform", (d, i) => `translate(0,${i * size + marginTop})`);

  const defs = g.append("defs");

  defs.append("clipPath")
    .attr("id", (_, i) => `${uid}-clip-${i}`)
    .append("rect")
    .attr("x", marginLeft)
    .attr("y", padding)
    .attr("width", width - marginLeft - marginRight)
    .attr("height", size - padding);

  defs.append("path")
    .attr("id", ([, values], i) => `${uid}-path-${i}`)
    .attr("d", ([, values]) => area(values));

  g.append("g")
    .attr("clip-path", (_, i) => `url(#${uid}-clip-${i})`)
    .selectAll("use")
    .data((_, i) => new Array(bands).fill(i))
    .enter().append("use")
    .attr("xlink:href", i => `#${uid}-path-${i}`)
    .attr("fill", (_, i) => colors[i % colors.length])
    .attr("transform", (_, i) => `translate(${marginLeft},${i * size})`);

  g.append("text")
    .attr("x", 4)
    .attr("y", (size + padding) / 2)
    .attr("dy", "0.35em")
    .text(([name]) => name);

  svg.append("g")
    .attr("transform", `translate(${marginLeft},${marginTop})`)
    .call(d3.axisTop(x).ticks(width / 80).tickSizeOuter(0))
    .call(g => g.selectAll(".tick")
      .filter(d => x(d) < 0 || x(d) >= width - marginLeft - marginRight)
      .remove())
    .call(g => g.select(".domain").remove());

  svg.selectAll(".tick text")
    .style("font-family", "Elastre")
    .style("font-size", "8px");

  return svg.node();
}


function _10(html){return(
html`<style>
@font-face {
  font-family: 'Elastre';
  src: url('https://res.cloudinary.com/dtu3vkxv6/raw/upload/v1746886734/Elastre_HEXP_INKT_vfwhma.ttf') format('truetype');
}

svg {
  font-family: 'Elastre', sans-serif;
}
</style>`
)}

function _11(md){return(
md`To create an horizon chart with Observable Plot’s concise API, see the [Horizon chart example](https://observablehq.com/@observablehq/plot-horizon) in the Plot gallery.`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["polka_dot_plant_growth_data.csv", {url: new URL("./files/996c81133051a7150a4b166e40443841522008a42c7a8262c93fe532b137688bdb93d9610a945823d02af5ab732518fe55a7162bab4638ef950ae91151345b37.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof scheme")).define("viewof scheme", ["Inputs","d3"], _scheme);
  main.variable(observer("scheme")).define("scheme", ["Generators", "viewof scheme"], (G, _) => G.input(_));
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("plants")).define("plants", ["d3","data"], _plants);
  main.variable(observer("transformed")).define("transformed", ["data","variable"], _transformed);
  main.variable(observer("viewof bands")).define("viewof bands", ["Inputs"], _bands);
  main.variable(observer("bands")).define("bands", ["Generators", "viewof bands"], (G, _) => G.input(_));
  main.variable(observer("viewof variable")).define("viewof variable", ["Inputs"], _variable);
  main.variable(observer("variable")).define("variable", ["Generators", "viewof variable"], (G, _) => G.input(_));
  main.variable(observer("colors")).define("colors", ["d3","bands"], _colors);
  main.variable(observer("chart")).define("chart", ["d3","transformed","bands","colors"], _chart);
  main.variable(observer()).define(["html"], _10);
  main.variable(observer()).define(["md"], _11);
  return main;
}
