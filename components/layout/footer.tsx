import { MediaQueries } from "@/styles/MediaQueries";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaInstagramSquare,
} from "react-icons/fa";

/**
 *
 * @returns Footer component below pages
 */
const Footer = () => {
  const router = useRouter();
  // const { data: session, status } = useSession();

  //@ts-ignore: next-auth issue v3
  // let id = session?.user?.id;

  const routerToProfile = (manage) => {
    // if (id && manage) {
    //   router.push(`/user/${id}?view=edit_user`);
    // } else if (id) {
    //   router.push(`/user/${id}`);
    // } else {
    //   router.push("/auth?path=SignUp");
    // }
  };

  return (
    <FooterContainer>
      <div className="text-column">
        <InfoColumnsContainer>
          <div className="info-column">
            <h4>News & Info</h4>

            <Link href="/news" passHref legacyBehavior>
              <a>
                <h6>Newsfeed</h6>
              </a>
            </Link>

            <Link href="/terms-of-service" passHref legacyBehavior>
              <a>
                <h6>Terms of Service</h6>
              </a>
            </Link>
          </div>
          <div className="info-column">
            <h4>Resources</h4>

            <Link href="/assets">
              <h6>Assets</h6>
            </Link>

            <Link href="/education">
              <h6>Education</h6>
            </Link>
          </div>
          <div className="info-column">
            <h4>Users</h4>
            <h6 onClick={() => routerToProfile(false)}>Profile</h6>
            <h6 onClick={() => routerToProfile(true)}>Manage Account</h6>
          </div>
        </InfoColumnsContainer>
      </div>
    </FooterContainer>
  );
};

const InfoColumnsContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  gap: 3rem;
  justify-content: center;
  padding-top: 2rem;

  @media ${MediaQueries.MD} {
    gap: 9rem;
  }

  .info-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const FooterContainer = styled.div`
  width: 100%;
  background: rgb(0, 0, 0);
  background: linear-gradient(
    131deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(46, 46, 46, 1) 48%,
    rgba(0, 0, 0, 1) 100%
  );

  color: white;
  padding: 2rem 2rem;
  border-top: 2px solid gray;

  .text-column {
    display: flex;
    flex-direction: column;
    width: 100%;
    text-align: center;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    h4 {
      font-weight: bold;
    }
  }
`;

export default Footer;
