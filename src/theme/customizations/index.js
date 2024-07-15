import Card from "./Card";
import Link from "./Link";
import Tabs from "./Tabs";
function customizeComponents(theme) {
  return { ...Link(theme), ...Tabs(theme), ...Card(theme) };
}
export default customizeComponents;
