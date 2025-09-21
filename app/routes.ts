import { type RouteConfig } from "@react-router/dev/routes";

export default [
  {
    path: "/",
    file: "routes/home.tsx",
    index: true
  },
  {
    path: "/dashboard",
    file: "routes/dashboard.tsx"
  },
  {
    path: "/search",
    file: "routes/search.tsx"
  },
  {
    path: "/text",
    file: "routes/text.tsx"
  },
  {
    path: "/dbf-files",
    file: "routes/dbf-files.tsx"
  },
  {
    path: "/dbf/:fileName",
    file: "routes/dbf.$fileName.tsx"
  },
  {
    path: "/dbf/:fileName/:recordNo",
    file: "routes/dbf.$fileName.$recordNo.tsx"
  },
  {
    path: "/kcstmr/:value",
    file: "routes/kcstmr.$value.tsx"
  },
  {
    path: "/mpersonid/:value",
    file: "routes/mpersonid.$value.tsx"
  },
  {
    path: "/kdrug/:value",
    file: "routes/kdrug.$value.tsx"
  },
  {
    path: "/dbf-stats/:fileName",
    file: "routes/dbf-stats.$fileName.tsx"
  }
] satisfies RouteConfig;
