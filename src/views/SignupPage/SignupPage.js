import React from 'react';
// @material-ui/core components
import { makeStyles } from '@mui/styles';
import Container from '@mui/material/Container';
// core components
import Footer from '../../components/Footer/Footer.js';
import GridItem from '../../components/Grid/GridItem.js';
import Card from '../../components/Card/Card.js';
import UserForm from './UserForm';

import styles from '../../assets/jss/material-kit-react/views/loginPage.js';

import image from '../../assets/img/bg9.jpg';

const useStyles = makeStyles(styles);

export default function LoginPage(props) {
  const [cardAnimaton, setCardAnimation] = React.useState('cardHidden');
  setTimeout(function() {
    setCardAnimation('');
  }, 700);
  const classes = useStyles();
  return (
    <div>
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: 'url(' + image + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
        }}
      >
        <div className={classes.container}>
          <Container maxWidth="s">
            <GridItem>
              <Card className={classes[cardAnimaton]}>
                <UserForm
                  categories={props.categories}
                  handleLogin={props.handleLogin}
                  loggedInStatus={props.loggedIn}
                />
              </Card>
            </GridItem>
          </Container>
        </div>
        <Footer whiteFont />
      </div>
    </div>
  );
}
