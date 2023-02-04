import { MediaQueries } from "@/styles/MediaQueries";
import { useSession } from "next-auth/react";
import Head from "next/head";
import styled from "styled-components";

export default function Home() {
  const { data: session, status } = useSession();

  console.log({ session });

  return (
    <AlternateHomePageWrapper>
      <h1>Home Page</h1>

      {/* {session && session.user.role === "admin" ? (
        <div>
          <h1>Admin</h1>
          <p>Welcome to the Admin Portal!</p>
        </div>
      ) : (
        <div>
          {session?.user}
          <h1>You are not authorized to view this page!</h1>
        </div>
      )} */}
    </AlternateHomePageWrapper>
  );
}

const AlternateHomePageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
