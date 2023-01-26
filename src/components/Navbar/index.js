import BigNumber from "bignumber.js";
import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { LinkContainer } from "react-router-bootstrap";
import "../../App.css";
import { useApplicationContext } from "../../context/applicationContext";
import { networks } from '../../constants/networksInfo';
import * as s from "../../styles/global";
import { Web3Status } from "../Web3Status";
import Loader from "../Loader";

const Navigation = () => {
  const { chainId } = useWeb3React();
  const {
    ETHamount,
    isNativeCoinBalanceFetching,
    FeeTokenAddress,
    FeeTokenamount,
    FeeTokenSymbol,
    isFeeTokenDataFetching,
  } = useApplicationContext();

  const mockCompanyLogo = 'https://wallet.wpmix.net/wp-content/uploads/2020/07/yourlogohere.png';

  return (
    <Navbar collapseOnSelect expand="lg" variant="dark" style={{ margin: 15 }}>
      <Container style={{ maxWidth: "100%" }}>
        {!mockCompanyLogo ? (
          <s.TextTitle style={{ fontSize: "24px" }}>
            <s.Card
              style={{
                padding: 10,
                margin: 0,
                paddingLeft: 20,
                paddingRight: 20,
                fontWeight: 700,
                color: "var(--primary)",
              }}
            >
              YourTextLogo
            </s.Card>
          </s.TextTitle>
        ) : <s.LogoTitle src={mockCompanyLogo} />
        }
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/home">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/launchpad">
              <Nav.Link>Launchpad</Nav.Link>
            </LinkContainer>
            {
              process.env.REACT_APP_ENABLE_LOCKER === 'true' &&
              <LinkContainer to="/locker">
                <Nav.Link>Locker</Nav.Link>
              </LinkContainer>
            }
            <LinkContainer to="/account">
              <Nav.Link>Account</Nav.Link>
            </LinkContainer>
          </Nav>
          <Nav>
            <Nav.Link>{networks[chainId].name}</Nav.Link>
            {isNativeCoinBalanceFetching ?
              <Loader/> :
              (
                <NavDropdown
                  title={
                    `$${networks[chainId].baseCurrency.symbol} ` +
                    BigNumber(ETHamount)
                      .dividedBy(10 ** 18)
                      .toFormat(2)
                  }
                  id="collasible-nav-dropdown"
                >
                  <Nav.Link
                    href={`${networks[chainId].explorer}/address/${FeeTokenAddress}`}
                    target="_blank"
                  >
                    {
                      isFeeTokenDataFetching ?
                        <Loader /> :
                        `$${FeeTokenSymbol} ` +
                          BigNumber(FeeTokenamount)
                            .dividedBy(10 ** 18)
                            .toFormat(0)
                    }
                  </Nav.Link>
                  {/* <NavDropdown.Item href="#action/3.3"></NavDropdown.Item> */}
                  <NavDropdown.Divider />
                </NavDropdown>
              )
            }
          </Nav>
          <Web3Status />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default Navigation;
