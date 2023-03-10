import { RoleConsts } from "@/helpers/consts/roles";
import { Colors } from "@/styles/Colors";
import { MediaQueries } from "@/styles/MediaQueries";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import styled from "styled-components";
import { Role_data } from "../../contexts/role";

/**
 *
 * @returns Header component above pages
 */
function Header() {
  const { data: session, status } = useSession();
  const [selectedRoute, setSelectedRoute] = useState<string | number>("");

  const { role, setRole } = useContext(Role_data);

  const router = useRouter();
  const { asPath } = router;

  const handleSignout = (e) => {
    e.preventDefault();
    setSelectedRoute("");
    signOut();
  };

  const handleSelect = (selectedKey) => {
    setSelectedRoute(selectedKey);
  };

  const routes = [
    {
      key: 1,
      route: "/manager",
      guarded: role === RoleConsts.Manager,
      text: "Manager",
    },
    {
      key: 2,
      route: `/chef`,
      guarded: role === RoleConsts.Chef || role == RoleConsts.Manager,
      text: "Chef",
    },
    // !session && {
    //   key: 5,
    //   route: "/auth?path=SignIn",
    //   guarded: false,
    //   text: "Sign In",
    // },
  ];

  useEffect(() => {
    setRouterAsPath();
  }, [asPath]);

  const setRouterAsPath = () => {
    let matchingRoute = routes.filter((item) => asPath.includes(item.route));

    if (matchingRoute.length) {
      setSelectedRoute(matchingRoute[0].key);
    } else {
      setSelectedRoute("");
    }
  };

  const routeObjects = useMemo(() => {
    if (!routes?.length) return [];

    return routes.map((route, idx) => {
      if (!route?.key) return;

      return (
        <div key={route?.route}>
          {!!route.guarded && (
            <TextContainer>
              <Link href={route.route}>{route.text}</Link>
              {selectedRoute == route.key && (
                <h6 className="active-underline-span"></h6>
              )}
            </TextContainer>
          )}
        </div>
      );
    });
  }, [routes?.length, selectedRoute, session, role]);

  return (
    <Navbar collapseOnSelect expand="lg" onSelect={handleSelect}>
      <Container>
        <Navbar.Brand onClick={() => setSelectedRoute("")}>
          <Link href={"/"} passHref legacyBehavior>
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [7, 0] }}
              transition={{
                duration: 3,
                damping: 20,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              style={{ cursor: "pointer" }}
            >
              <Image
                src="/assets/retail.svg"
                height={100}
                width={120}
                alt="retail logo"
                priority
              />
            </motion.div>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <RouteRow>
            {routeObjects}
            {session && (
              <Nav.Link
                eventKey={"5"}
                role={"link"}
                onClick={handleSignout}
                className={"pointer-link fw-bold"}
              >
                <SignOutSpan>{"Sign Out"}</SignOutSpan>
              </Nav.Link>
            )}
          </RouteRow>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

const RouteRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  font-weight: bold;

  @media ${MediaQueries.MD} {
    flex-direction: row;
    width: 100%;
  }
`;

const SignOutSpan = styled.h2`
  color: black;

  @media ${MediaQueries.MD} {
    white-space: nowrap;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: black;

  .active-underline-span {
    height: 2px;
    color: black;
    background-color: ${Colors.PrimaryButtonBackground};
  }
`;

export default Header;
