import { Fragment, useEffect, useState } from "react";
import Header from "./header";
import styled from "styled-components";
import { useRouter } from "next/dist/client/router";

/**
 *
 * @param
 * @returns Site Layout Wrapper
 */
function Layout(props) {
  const router = useRouter();

  return (
    <LayoutContainer>
      <Header />
      <main>{props.children}</main>
    </LayoutContainer>
  );
}

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  background: linear-gradient(
    180deg,
    rgba(235, 233, 255, 1) 0%,
    rgba(241, 240, 255, 1) 5%,
    rgba(255, 255, 255, 1) 29%
  );
`;

export default Layout;
