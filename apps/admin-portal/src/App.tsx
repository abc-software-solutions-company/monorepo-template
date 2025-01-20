import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Loading } from '@repo/react-web-ui-shadcn/components/ui/loading';
import { Toaster } from '@repo/react-web-ui-shadcn/components/ui/sonner';

import AllTheProviders from './components/all-the-providers';
import ChartDefaultConfigs from './components/charts/chart-default-configs';
import PrivateRoute from './modules/auth/components/private-route';
import PublicRoute from './modules/auth/components/public-route';

const PageRedirect = lazy(() => import('./pages/redirect'));

const PageNotFound = lazy(() => import('./pages/not-found'));

const PageLogin = lazy(() => import('./pages/login'));

const PageDashboard = lazy(() => import('./pages/dashboard'));

const PageCategoryList = lazy(() => import('./pages/categories'));
const PageCategoryEdit = lazy(() => import('./pages/categories/edit'));
const PageCategoryNew = lazy(() => import('./pages/categories/new'));

const PageFaqsList = lazy(() => import('./pages/faqs'));
const PageFaqEdit = lazy(() => import('./pages/faqs/edit'));
const PageFaqNew = lazy(() => import('./pages/faqs/new'));

const PagePostList = lazy(() => import('./pages/posts'));
const PagePostEdit = lazy(() => import('./pages/posts/edit'));
const PagePostNew = lazy(() => import('./pages/posts/new'));

const PageProductList = lazy(() => import('./pages/products'));
const PageProductEdit = lazy(() => import('./pages/products/edit'));
const PageProductNew = lazy(() => import('./pages/products/new'));

const PageUserList = lazy(() => import('./pages/users'));
const PageUserEdit = lazy(() => import('./pages/users/edit'));
const PageUserNew = lazy(() => import('./pages/users/new'));

const PageFileList = lazy(() => import('./pages/files'));

const PageContacts = lazy(() => import('./pages/contacts'));

const PageSettings = lazy(() => import('./pages/settings'));

const PageProfile = lazy(() => import('./pages/profiles'));

const PageNotifications = lazy(() => import('./pages/notifications'));

const PageAuditLogs = lazy(() => import('./pages/audit-logs'));

const PageMultiStepForm = lazy(() => import('./pages/multi-step-form'));

const PageRuleList = lazy(() => import('./pages/rules'));
const PageRuleEdit = lazy(() => import('./pages/rules/edit'));
const PageRuleNew = lazy(() => import('./pages/rules/new'));

const PageDocumentation = lazy(() => import('./pages/documentation'));

const App = () => (
  <Router>
    <AllTheProviders>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Loading />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<PageRedirect />} />
          <Route path="/:locale" element={<PageRedirect />} />
          <Route element={<PublicRoute />}>
            <Route path="/:locale/login" element={<PageLogin />} />
            <Route path="/:locale/rule" element={<PageRuleList />} />
            <Route path="/:locale/rule/new" element={<PageRuleNew />} />
            <Route path="/:locale/rule/:id/edit" element={<PageRuleEdit />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/:locale/dashboard" element={<PageDashboard />} />
            <Route path="/:locale/files" element={<PageFileList />} />
            <Route path="/:locale/users" element={<PageUserList />} />
            <Route path="/:locale/users/new" element={<PageUserNew />} />
            <Route path="/:locale/users/:id/edit" element={<PageUserEdit />} />
            <Route path="/:locale/profile/:type" element={<PageProfile />} />
            <Route path="/:locale/categories" element={<PageCategoryList />} />
            <Route path="/:locale/categories/new" element={<PageCategoryNew />} />
            <Route path="/:locale/categories/:id/edit" element={<PageCategoryEdit />} />
            <Route path="/:locale/posts" element={<PagePostList />} />
            <Route path="/:locale/posts/new" element={<PagePostNew />} />
            <Route path="/:locale/posts/:id/edit" element={<PagePostEdit />} />
            <Route path="/:locale/products" element={<PageProductList />} />
            <Route path="/:locale/products/new" element={<PageProductNew />} />
            <Route path="/:locale/products/:id/edit" element={<PageProductEdit />} />
            <Route path="/:locale/audit-logs" element={<PageAuditLogs />} />
            <Route path="/:locale/contacts" element={<PageContacts />} />
            <Route path="/:locale/faqs" element={<PageFaqsList />} />
            <Route path="/:locale/faqs/new" element={<PageFaqNew />} />
            <Route path="/:locale/faqs/:id/edit" element={<PageFaqEdit />} />
            <Route path="/:locale/settings/:type" element={<PageSettings />} />
            <Route path="/:locale/notifications/:type" element={<PageNotifications />} />
            <Route path="/:locale/documentation/:type" element={<PageDocumentation />} />
            <Route path="/:locale/multi-step-form" element={<PageMultiStepForm />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
      <ChartDefaultConfigs />
      <div className="transform-gpu"></div>
    </AllTheProviders>
  </Router>
);

export default App;
