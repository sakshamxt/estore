import NProgress from 'nprogress';
import { isPending, isFulfilled, isRejected } from '@reduxjs/toolkit';


// Redux Middleware for NProgress

export const rtkLoadingMiddleware = () => (next) => (action) => {
  if (isPending(action)) {
    NProgress.start();
  } else if (isFulfilled(action) || isRejected(action)) {
    NProgress.done();
  }
  return next(action);
};