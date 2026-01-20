import  { Suspense } from 'react'
import { InitialLoader } from './InitialLoader';

const LazyComponent = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<InitialLoader />}>{children}</Suspense>
);

export default LazyComponent