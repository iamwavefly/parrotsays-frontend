import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import Logo from '../../../img/parrotsays.jpeg';
import Avatar from '../../../img/avatar.png';

// TO HEADER STYLE
const HeaderNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  box-shadow: 0 5px 10px rgba(0, 0, 10, 0.02);
`;

const LeftListContainer = styled.ul`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const RightListContainer = styled.ul`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 40px;
  width: 100%;
  height: 100%;
`;

const List = styled.li`
  display: flex;
  list-style-type: none;
  margin: 0 10px;
`;
const NavLink = styled.a`
  color: #555;
  font-weight: 500;
  text-decoration: none;
  font-size: 15px;
  text-transform: uppercase;
  opacity: 1;
  transition: all 0.4s ease;
  &:hover {
    opacity: 0.8;
  }
`;
const BrandLogo = styled.img`
  width: auto;
  min-width: 40px;
  height: 40px;
  padding-right: 20px;
`;

export default class SecondaryHeader extends Component {
  render() {
    return (
      <HeaderNav>
        <LeftListContainer>
          <List>
            <BrandLogo
              src={Logo || <Skeleton delay={5} duration={20} />}
              alt=""
              srcset=""
            />
          </List>
          <List>
            <NavLink href="/">Solution</NavLink>
          </List>
          <List>
            <NavLink href="/">Plan & Privacy</NavLink>
          </List>
          <List>
            <NavLink href="/">Contact Sale</NavLink>
          </List>
        </LeftListContainer>
        <RightListContainer>
          <List>
            <NavLink href="/">Start a Meeting</NavLink>
          </List>
          <List>
            <NavLink href="/">Join a Meeting</NavLink>
          </List>
        </RightListContainer>
      </HeaderNav>
    );
  }
}
