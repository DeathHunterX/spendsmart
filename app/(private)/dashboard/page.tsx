"use client";

import { useSession } from "next-auth/react";

const DashboardPage = () => {
  const { data: session } = useSession();

  return (
    <div>
      <h1>DashboardPage</h1>
      <p>{JSON.stringify(session)}</p>
    </div>
  );
};

export default DashboardPage;
