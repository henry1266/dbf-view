import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("routes/dbf-files.tsx"),
  route("routes/dbf.$fileName.tsx"),
  route("routes/dbf.$fileName.$recordNo.tsx"),
  route("routes/kcstmr.$value.tsx"),
  route("routes/kdrug.$value.tsx")
] satisfies RouteConfig;
