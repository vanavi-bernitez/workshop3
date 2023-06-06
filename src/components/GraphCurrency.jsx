import React, { useState, useEffect } from "react";
import { getQueriedCrypto } from "../helpers/getQueriedCrypto";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLine } from "victory";

const GraphCurrency = ({ initialData, idGraph }) => {
  const [idCoinData, setIdCoinData] = useState([]);
  const [minY, setMinY] = useState(25000);
  const [maxY, setMaxY] = useState(28000);
  const [averageY, setAverageY] = useState(27050);

  let formatedData;
  idGraph === null
    ? (formatedData = initialData[0])
    : (formatedData = idCoinData);

  const fillGraph = async (idCoinToGraph) => {
    const coinQueryData = await getQueriedCrypto(idCoinToGraph);
    setIdCoinData(coinQueryData[0]);
    setMinY(coinQueryData[0].minY);
    setMaxY(coinQueryData[0].maxY);
    setAverageY(coinQueryData[0].averageY);
  };

  useEffect(() => {
    if (idGraph) {
      fillGraph(idGraph);
    }
  }, [idGraph]);

  return (
    <div className="graphicContainer">
      <VictoryChart
        domain={{ x: [0, 35], y: [minY, maxY] }}
        width={750}
        height={400}
        events={[
          {
            childName: ["barChart"],
            target: "data",
            eventHandlers: {
              onMouseOver: () => {
                return [
                  {
                    childName: "barChart",
                    mutation: (props) => {
                      return {
                        style: Object.assign({}, props.style, {
                          fill: "#c1ee14",
                        }),
                      };
                    },
                  },
                ];
              },
              onMouseOut: () => {
                return [
                  {
                    childName: ["barChart"],
                    mutation: () => {
                      return null;
                    },
                  },
                ];
              },
            },
          },
        ]}
      >
        <VictoryAxis
          orientation="top"
          tickValues={[0, 7, 14, 21, 28, 35]}
          tickFormat={["+ w1", "+ w2", "+w3", "+w4", "+ w5"]}
          style={{ axis: { stroke: "#757575", strokeDasharray: "4" } }}
        />
        <VictoryBar
          name="barChart"
          barWidth={5}
          style={{ data: { fill: "#5f606c" } }}
          data={formatedData?.sparkline}
          animate={{
            onExit: {
              duration: 1000,
            },
          }}
        />
        <VictoryLine
          data={[
            { x: formatedData?.sparkline[0].x, y: averageY },
            { x: formatedData?.sparkline[35].x, y: averageY},
          ]}
          style={{ data: { stroke: "#c1ee14", strokeDasharray: "4" } }}
        />
      </VictoryChart>

      <h6 id="graphPrice">{formatedData?.price} USD</h6>
    </div>
  );
};

export { GraphCurrency };
