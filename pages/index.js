import { MediaQueries } from "@/styles/MediaQueries";
import { useSession } from "next-auth/react";
import Head from "next/head";
import styled from "styled-components";
import Image from "next/image";
import { Role_data } from "../contexts/role";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { RoleConsts } from "../helpers/consts/roles";

export default function Home() {
  const { data: session, status } = useSession();
  const { role, setRole } = useContext(Role_data);

  return (
    <HomePageWrapper>
      <div>
        <div className="top-card">
          <h1>Strongmind Pizza</h1>
          <h4>
            Click to select your job title and routes will enable themselves
          </h4>

          <div className="card-container">
            <div onClick={(e) => setRole("Manager")} className="role-card">
              <h5>Manager</h5>

              <Image
                src="/assets/manager.svg"
                width={80}
                height={80}
                alt="chef"
              />

              {role === RoleConsts.Manager && <div className="selected-div" />}
            </div>

            <div onClick={(e) => setRole("Chef")} className="role-card">
              <h5>Chef</h5>

              <Image
                src="/assets/chefs-hat.svg"
                width={80}
                height={80}
                alt="chef"
              />

              {role === RoleConsts.Chef && <div className="selected-div" />}
            </div>
          </div>
        </div>
      </div>
    </HomePageWrapper>
  );
}

const HomePageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  h1 {
    color: rgba(253, 181, 21, 1);
    text-transform: uppercase;
  }

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
