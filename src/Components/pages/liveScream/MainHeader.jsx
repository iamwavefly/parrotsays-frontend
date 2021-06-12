import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import SecondaryHeader from './SecondaryHeader';

// TO HEADER STYLE
const HeaderContainer = styled.div`
  width: 100%;
  height: auto;
`;

const TopHeader = styled.nav`
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  background-color: #39394d;
`;

const ListContainer = styled.ul`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 60px;
  width: 100%;
  height: 100%;
`;

const List = styled.li`
  display: flex;
  list-style-type: none;
  margin: 0 10px;
`;
const NavLink = styled.a`
  color: #f1f1f1;
  text-decoration: none;
  font-size: 14px;
  text-transform: uppercase;
  opacity: 1;
  transition: all 0.4s ease;
  &:hover {
    opacity: 0.8;
  }
`;
export default class MainHeader extends Component {
  render() {
    return (
      <HeaderContainer>
        <TopHeader>
          <ListContainer>
            <List>
              <NavLink href="/">Request Demo</NavLink>
            </List>
            <List>
              <NavLink href="/">+234-parrotsays</NavLink>
            </List>
            <List>
              <NavLink href="/">Support</NavLink>
            </List>
            <List>
              <NavLink href="/">Privacy Policy</NavLink>
            </List>
          </ListContainer>
        </TopHeader>
        <SecondaryHeader />
      </HeaderContainer>
    );
  }
}
