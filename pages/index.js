import { MediaQueries } from "@/styles/MediaQueries";
import { useSession } from "next-auth/react";
import Head from "next/head";
import styled from "styled-components";

export default function Home() {
  const { data: session, status } = useSession();

  console.log({ session });

  return (
    <AlternateHomePageWrapper>
      <div>
        <h1>StrongMind Pizza</h1>

        <div className="top-card">
          <h4>If you are a </h4>

          <div className="card-container">
            <div>
              <h5>Manager</h5>
            </div>

            <div>
              <h5>Chef</h5>
            </div>
          </div>
        </div>
      </div>
    </AlternateHomePageWrapper>
  );
}

const AlternateHomePageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  .top-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    text-align: center;
    gap: 2rem;

    .card-container {
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 3rem;
    }
  }
`;
