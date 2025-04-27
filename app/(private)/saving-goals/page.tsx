import { Metadata } from "next";
import SavingGoalsClient from "./SavingGoalsClient";

export const metadata: Metadata = {
  title: "Saving Goals",
};

const SavingGoalsPage = () => {
  return <SavingGoalsClient />;
};

export default SavingGoalsPage;
