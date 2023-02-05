import { MediaQueries } from "@/styles/MediaQueries";
import { useSession } from "next-auth/react";
import Head from "next/head";
import styled from "styled-components";

import { Message_data } from "../contexts/role";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const { data: session, status } = useSession();
  const { message, setMessage } = useContext(Message_data);

  return (
    <AlternateHomePageWrapper>
      <div>
        <h1>StrongMind Pizza</h1>

        <div className="top-card">
          <h4>If you are a </h4>

          <div className="card-container">
            <div onClick={(e) => setMessage("Manager")}>
              <h5>Manager</h5>

              {message === "Manager" && <div>YEEE</div>}
            </div>

            <div onClick={(e) => setMessage("Chef")}>
              <h5>Chef</h5>

              {message === "Chef" && <div>YEEE</div>}
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
