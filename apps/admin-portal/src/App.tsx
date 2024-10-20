import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from '~react-web-ui-shadcn/components/ui/sonner';

import AllTheProviders from './components/all-the-providers';
import ChartDefaultConfigs from './components/charts/chart-default-configs';
import PrivateRoute from './modules/auth/components/private-route';
import PublicRoute from './modules/auth/components/public-route';
import PageAuditLogs from './pages/audit-logs';
import PageCategoryList from './pages/categories';
import PageCategoryEdit from './pages/categories/edit';
import PageCategoryNew from './pages/categories/new';
import PageContacts from './pages/contacts';
import PageContentList from './pages/contents';
import PageContentEdit from './pages/contents/edit';
import PageContentNew from './pages/contents/new';
import PageDashboard from './pages/dashboard';
import PageDocumentation from './pages/documentation';
import PageFaqsList from './pages/faqs';
import PageFaqEdit from './pages/faqs/edit';
import PageFaqNew from './pages/faqs/new';
import PageFileList from './pages/files';
import PageLogin from './pages/login';
import PageMultiStepForm from './pages/multi-step-form';
import NotFound from './pages/not-found';
import PageNotifications from './pages/notifications';
import PagePostList from './pages/posts';
import PagePostEdit from './pages/posts/edit';
import PagePostNew from './pages/posts/new';
import PageProductList from './pages/products';
import PageProductEdit from './pages/products/edit';
import PageProductNew from './pages/products/new';
import PageProfile from './pages/profiles';
import PageRedirect from './pages/redirect';
import PageSettings from './pages/settings';
import PageUserList from './pages/users';
import PageUserEdit from './pages/users/edit';
import PageUserNew from './pages/users/new';

const App = () => (
  <Router>
    <AllTheProviders>
      <Routes>
        <Route path="/" element={<PageRedirect />} />
        <Route path="/:locale" element={<PageRedirect />} />
        <Route element={<PublicRoute />}>
          <Route path="/:locale/login" element={<PageLogin />} />
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
          <Route path="/:locale/contents" element={<PageContentList />} />
          <Route path="/:locale/contents/new" element={<PageContentNew />} />
          <Route path="/:locale/contents/:id/edit" element={<PageContentEdit />} />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <ChartDefaultConfigs />
      <div className="transform-gpu"></div>
    </AllTheProviders>
  </Router>
);

export default App;
