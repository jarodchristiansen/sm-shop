import { MediaQueries } from "@/styles/MediaQueries";
import { useSession } from "next-auth/react";
import Head from "next/head";
import styled from "styled-components";
import Image from "next/image";
import { Message_data } from "../contexts/role";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const { data: session, status } = useSession();
  const { message, setMessage } = useContext(Message_data);

  return (
    <AlternateHomePageWrapper>
      <div>
        <div className="top-card">
          <h1>StrongMind Pizza</h1>
          <h4>Click to select your job title </h4>

          <div className="card-container">
            <div onClick={(e) => setMessage("Manager")} className="role-card">
              <h5>Manager</h5>

              <Image
                src="/assets/manager.svg"
                width={80}
                height={80}
                alt="chef"
              />

              {message === "Manager" && <div className="selected-div" />}
            </div>

            <div onClick={(e) => setMessage("Chef")} className="role-card">
              <h5>Chef</h5>

              <Image
                src="/assets/chefs-hat.svg"
                width={80}
                height={80}
                alt="chef"
              />

              {message === "Chef" && <div className="selected-div" />}
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
      cursor: pointer;

      .role-card {
        display: flex;
        flex-direction: column;
        border: 2px solid black;

        padding: 2rem;
        border-radius: 8px;
        gap: 2rem;

        h5 {
          font-weight: bold;
        }

        .selected-div {
          height: 2rem;
          width: 2rem;
          border-radius: 50%;
          background-color: #32cd32;
          margin: auto;
          border: 1px solid black;
        }
      }
    }
  }
`;
