import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const AdminRoute = ({ component: Component, userRole, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      userRole === 'ADMIN' ? (
        <Component {...props} />
      ) : (
        <Navigate
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default AdminRoute;

