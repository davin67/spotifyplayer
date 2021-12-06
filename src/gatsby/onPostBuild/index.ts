import buildWizard from "./buildWizard";
import checkLinks from "./checkLinks";

export default async function(params) {
  const promises: Promise<void>[] = [buildWizard(params), checkLinks(params)];
  await Promise.all(promises);
}
