
import ComHeader from "../../Components/ComHeader/ComHeader";
import ComFooter from "../../Components/ComFooter/ComFooter";
import Pending from "./Pending";
import Processing from "./Processing"
import Transporting from "./Transporting"
import Done from "./Done"
import Cancel from "./Cancel"
import Return from "./Return"
import All from "./All"
import { textApp } from "../../../TextContent/textApp";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import React, { useState } from "react";
const data = [
  {
    label: textApp.OrderHistory.label.status,
    value: textApp.OrderHistory.value.status,
    desc:<Pending/>,
  },
  {
    label: textApp.OrderHistory.label.status1,
    value: textApp.OrderHistory.value.status1,
    desc: <Processing/>,
  },

  {
    label: textApp.OrderHistory.label.status2,
    value: textApp.OrderHistory.value.status2,
    desc: <Transporting/>,
  },

  {
    label: textApp.OrderHistory.label.status3,
    value: textApp.OrderHistory.value.status3,
    desc: <Done/>,
  },

  {
    label: textApp.OrderHistory.label.status4,
    value: textApp.OrderHistory.value.status4,
    desc: <Cancel/>,
  },
  {
    label: textApp.OrderHistory.label.status5,
    value: textApp.OrderHistory.value.status5,
    desc:<Return/>,
  },
  {
    label: textApp.OrderHistory.label.status6,
    value: textApp.OrderHistory.value.status6,
    desc:<All/>,
  },
];
export default function Order() {
  const [activeTab, setActiveTab] = useState(data[0].value);

 

  return (
    <>
      <ComHeader />
      <Tabs value={activeTab}>
        <TabsHeader
          className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
          indicatorProps={{
            className:
              "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
          }}
        >
          {data.map(({ label, value }) => (
            <Tab
              key={value}
              value={value}
              onClick={() => setActiveTab(value)}
              className={activeTab === value ? "text-gray-900 z-0" : "cursor-pointer"}
            >
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {data.map(({ value, desc }) => (
            <TabPanel key={value} value={value}>
            {React.cloneElement(desc, { activeTab })}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
      <ComFooter />
    </>
  );
}