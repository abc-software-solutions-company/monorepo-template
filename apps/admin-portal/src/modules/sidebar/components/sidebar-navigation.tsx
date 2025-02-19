import { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  BellIcon,
  BookOpenTextIcon,
  BookUserIcon,
  CircleHelpIcon,
  FileCode2Icon,
  FoldersIcon,
  LayoutGridIcon,
  ListTreeIcon,
  MessageSquareTextIcon,
  NotebookTabsIcon,
  PackageIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@repo/react-web-ui-shadcn/components/ui/collapsible';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@repo/react-web-ui-shadcn/components/ui/hover-card';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import { SUB_MENU_ALIGN_OFFSET, SUB_MENU_SIDE_OFFSET } from '../constants/sidebar.constant';

import { CATEGORY_TYPE } from '@/modules/categories/constants/categories.constant';
import { POST_TYPE } from '@/modules/posts/constants/posts.constant';
import { PRODUCT_TYPE } from '@/modules/products/constants/products.constant';

import SidebarMenuIndicator from './sidebar-menu-indicator';
import SidebarMenuItem from './sidebar-menu-item';
import SubMenuDocumentation from './sub-menu-documentation';
import SubMenuNotifications from './sub-menu-notifications';
import SubMenuPages from './sub-menu-pages';
import SubMenuPostCategories from './sub-menu-post-categories';
import SubMenuPosts from './sub-menu-posts';
import SubMenuProductCategories from './sub-menu-product-categories';
import SubMenuProducts from './sub-menu-products';
import SubMenuProfile from './sub-menu-profile';
import SubMenuSettings from './sub-menu-settings';
import SubMenuUsers from './sub-menu-users';

type SidebarNavigationProps = ComponentBaseProps & {
  isExpand: boolean;
  onNavigate?: () => void;
};

const SidebarNavigation: FC<SidebarNavigationProps> = ({ className, isExpand, onNavigate }) => {
  const t = useTranslations();
  const locale = useLocale();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const [isOpenSubMenu, setIsOpenSubMenu] = useState({
    dashboard: false,
    contents: false,
    posts: false,
    post_categories: false,
    pages: false,
    products: false,
    product_categories: false,
    users: false,
    notifications: false,
    files: false,
    audit_logs: false,
    contacts: false,
    faqs: false,
    settings: false,
    profile: false,
    documentation: false,
  });

  useEffect(() => {
    setIsOpenSubMenu(prevState => ({
      ...prevState,
      dashboard: pathname.includes(`/${locale}/dashboard`),
      contents: pathname.includes(`/${locale}/contents`),
      post_categories: pathname.includes(`/${locale}/categories`) && searchParams.get('type') === CATEGORY_TYPE.NEWS,
      posts: pathname.includes(`/${locale}/posts`) && searchParams.get('type') === POST_TYPE.NEWS,
      pages: pathname.includes(`/${locale}/posts`) && searchParams.get('type') === POST_TYPE.PAGE,
      product_categories: pathname.includes(`/${locale}/categories`) && searchParams.get('type') === CATEGORY_TYPE.PRODUCT,
      products: pathname.includes(`/${locale}/products`) && searchParams.get('type') === PRODUCT_TYPE.DEFAULT,
      users: pathname.includes(`/${locale}/users`),
      notifications: pathname.includes(`/${locale}/notifications`),
      files: pathname.includes(`/${locale}/files`),
      audit_logs: pathname.includes(`/${locale}/audit-logs`),
      contacts: pathname.includes(`/${locale}/contacts`),
      faqs: pathname.includes(`/${locale}/faqs`),
      settings: pathname.includes(`/${locale}/settings`),
      profile: pathname.includes(`/${locale}/profile`),
      documentation: pathname.includes(`/${locale}/documentation`),
    }));
  }, [locale, pathname, searchParams]);

  const handleItemClick = () => {
    onNavigate?.();
  };

  return (
    <div className={classNames('nap-sidebar-nav scrollbar relative h-full overflow-y-auto', className)}>
      <div className="nap-sidebar-expanded relative overflow-x-hidden">
        {/*************************************************************
          DASHBOARD
          **************************************************************/}
        <div className="relative my-0.5 px-3">
          <Collapsible open={isOpenSubMenu.dashboard} onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, dashboard: value }))}>
            <SidebarMenuItem url={`/${locale}/dashboard`} isExpand={isExpand} options={{ icon: LayoutGridIcon, onClick: handleItemClick }}>
              {t('sidebar_menu_dashboard')}
            </SidebarMenuItem>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/dashboard`} isExpand={isExpand} options={{ icon: LayoutGridIcon, onClick: handleItemClick }} />
              </div>
            </HoverCardTrigger>
          </HoverCard>
        </div>
        {/*************************************************************
          POST CATEGORIES
          **************************************************************/}
        <div className="relative my-0.5 px-3">
          <Collapsible
            open={isOpenSubMenu.post_categories && isExpand}
            onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, post_categories: value }))}
          >
            <SidebarMenuItem
              url={`/${locale}/categories`}
              queryParams={{ type: CATEGORY_TYPE.NEWS }}
              isExpand={isExpand}
              options={{ icon: ListTreeIcon, onClick: handleItemClick }}
            >
              {t('sidebar_menu_post_categories')}
            </SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <div>
                <SidebarMenuIndicator
                  isExpand={isExpand}
                  isActive={pathname.includes(`/${locale}/categories`)}
                  isOpen={isOpenSubMenu.post_categories}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent
              className={classNames(
                'mt-1 overflow-hidden rounded [&[data-state=closed]]:animate-collapsible-up [&[data-state=open]]:animate-collapsible-down'
              )}
            >
              <SubMenuPostCategories type="list" onNavigate={handleItemClick} />
            </CollapsibleContent>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem
                  url={`/${locale}/categories`}
                  queryParams={{ type: CATEGORY_TYPE.NEWS }}
                  isExpand={isExpand}
                  options={{ icon: ListTreeIcon, onClick: handleItemClick }}
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-52 p-1" sideOffset={SUB_MENU_SIDE_OFFSET} alignOffset={SUB_MENU_ALIGN_OFFSET} side="right" align="start">
              <SubMenuPostCategories type="dropdown" onNavigate={handleItemClick} />
            </HoverCardContent>
          </HoverCard>
        </div>
        {/*************************************************************
          POSTS
          **************************************************************/}
        <div className="relative my-0.5 px-3">
          <Collapsible open={isOpenSubMenu.posts && isExpand} onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, posts: value }))}>
            <SidebarMenuItem
              url={`/${locale}/posts`}
              queryParams={{ type: POST_TYPE.NEWS }}
              isExpand={isExpand}
              options={{ icon: BookOpenTextIcon, onClick: handleItemClick }}
            >
              {t('sidebar_menu_posts')}
            </SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <div>
                <SidebarMenuIndicator isExpand={isExpand} isActive={isOpenSubMenu.posts} isOpen={isOpenSubMenu.posts} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent
              className={classNames(
                'mt-1 overflow-hidden rounded [&[data-state=closed]]:animate-collapsible-up [&[data-state=open]]:animate-collapsible-down'
              )}
            >
              <SubMenuPosts type="list" onNavigate={handleItemClick} />
            </CollapsibleContent>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem
                  url={`/${locale}/posts`}
                  queryParams={{ type: POST_TYPE.NEWS }}
                  isExpand={isExpand}
                  options={{ icon: BookOpenTextIcon, onClick: handleItemClick }}
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-52 p-1" sideOffset={SUB_MENU_SIDE_OFFSET} alignOffset={SUB_MENU_ALIGN_OFFSET} side="right" align="start">
              <SubMenuPosts type="dropdown" onNavigate={handleItemClick} />
            </HoverCardContent>
          </HoverCard>
        </div>
        {/*************************************************************
          POSTS (PAGES)
          **************************************************************/}
        <div className="relative my-0.5 px-3">
          <Collapsible open={isOpenSubMenu.pages && isExpand} onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, pages: value }))}>
            <SidebarMenuItem
              url={`/${locale}/posts`}
              queryParams={{ type: POST_TYPE.PAGE }}
              isExpand={isExpand}
              options={{ icon: BookOpenTextIcon, onClick: handleItemClick }}
            >
              {t('sidebar_menu_pages')}
            </SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <div>
                <SidebarMenuIndicator isExpand={isExpand} isActive={isOpenSubMenu.pages} isOpen={isOpenSubMenu.pages} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent
              className={classNames(
                'mt-1 overflow-hidden rounded [&[data-state=closed]]:animate-collapsible-up [&[data-state=open]]:animate-collapsible-down'
              )}
            >
              <SubMenuPages type="list" onNavigate={handleItemClick} />
            </CollapsibleContent>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem
                  url={`/${locale}/posts`}
                  queryParams={{ type: POST_TYPE.PAGE }}
                  isExpand={isExpand}
                  options={{ icon: BookOpenTextIcon, onClick: handleItemClick }}
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-52 p-1" sideOffset={SUB_MENU_SIDE_OFFSET} alignOffset={SUB_MENU_ALIGN_OFFSET} side="right" align="start">
              <SubMenuPages type="dropdown" onNavigate={handleItemClick} />
            </HoverCardContent>
          </HoverCard>
        </div>
        {/*************************************************************
          PRODUCT CATEGORIES
          **************************************************************/}
        <div className="relative my-0.5 px-3">
          <Collapsible
            open={isOpenSubMenu.product_categories && isExpand}
            onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, product_categories: value }))}
          >
            <SidebarMenuItem
              url={`/${locale}/categories`}
              queryParams={{ type: CATEGORY_TYPE.PRODUCT }}
              isExpand={isExpand}
              options={{ icon: ListTreeIcon, onClick: handleItemClick }}
            >
              {t('sidebar_menu_product_categories')}
            </SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <div>
                <SidebarMenuIndicator
                  isExpand={isExpand}
                  isActive={pathname.includes(`/${locale}/categories`)}
                  isOpen={isOpenSubMenu.product_categories}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent
              className={classNames(
                'mt-1 overflow-hidden rounded [&[data-state=closed]]:animate-collapsible-up [&[data-state=open]]:animate-collapsible-down'
              )}
            >
              <SubMenuProductCategories type="list" onNavigate={handleItemClick} />
            </CollapsibleContent>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem
                  url={`/${locale}/categories`}
                  queryParams={{ type: CATEGORY_TYPE.PRODUCT }}
                  isExpand={isExpand}
                  options={{ icon: ListTreeIcon, onClick: handleItemClick }}
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-52 p-1" sideOffset={SUB_MENU_SIDE_OFFSET} alignOffset={SUB_MENU_ALIGN_OFFSET} side="right" align="start">
              <SubMenuProductCategories type="dropdown" onNavigate={handleItemClick} />
            </HoverCardContent>
          </HoverCard>
        </div>
        {/*************************************************************
          PRODUCTS
          **************************************************************/}
        <div className="relative my-0.5 px-3">
          <Collapsible
            open={isOpenSubMenu.products && isExpand}
            onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, products: value }))}
          >
            <SidebarMenuItem
              url={`/${locale}/products`}
              queryParams={{ type: PRODUCT_TYPE.DEFAULT }}
              isExpand={isExpand}
              options={{ icon: PackageIcon, onClick: handleItemClick }}
            >
              {t('sidebar_menu_products')}
            </SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <div>
                <SidebarMenuIndicator isExpand={isExpand} isActive={pathname.includes(`/${locale}/products`)} isOpen={isOpenSubMenu.products} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent
              className={classNames(
                'mt-1 overflow-hidden rounded [&[data-state=closed]]:animate-collapsible-up [&[data-state=open]]:animate-collapsible-down'
              )}
            >
              <SubMenuProducts type="list" onNavigate={handleItemClick} />
            </CollapsibleContent>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem
                  url={`/${locale}/products`}
                  queryParams={{ type: PRODUCT_TYPE.DEFAULT }}
                  isExpand={isExpand}
                  options={{ icon: PackageIcon, onClick: handleItemClick }}
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-52 p-1" sideOffset={SUB_MENU_SIDE_OFFSET} alignOffset={SUB_MENU_ALIGN_OFFSET} side="right" align="start">
              <SubMenuProducts type="dropdown" onNavigate={handleItemClick} />
            </HoverCardContent>
          </HoverCard>
        </div>
        {/*************************************************************
          USERS
          **************************************************************/}
        <div className="relative my-0.5 px-3">
          <Collapsible open={isOpenSubMenu.users && isExpand} onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, users: value }))}>
            <SidebarMenuItem url={`/${locale}/users`} isExpand={isExpand} options={{ icon: UsersIcon, onClick: handleItemClick }}>
              {t('sidebar_menu_users')}
            </SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <div>
                <SidebarMenuIndicator isExpand={isExpand} isActive={pathname.includes(`/${locale}/users`)} isOpen={isOpenSubMenu.users} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent
              className={classNames(
                'mt-1 overflow-hidden rounded [&[data-state=closed]]:animate-collapsible-up [&[data-state=open]]:animate-collapsible-down'
              )}
            >
              <SubMenuUsers type="list" onNavigate={handleItemClick} />
            </CollapsibleContent>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/users`} isExpand={isExpand} options={{ icon: UsersIcon, onClick: handleItemClick }} />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-52 p-1" sideOffset={SUB_MENU_SIDE_OFFSET} alignOffset={SUB_MENU_ALIGN_OFFSET} side="right" align="start">
              <SubMenuUsers type="dropdown" onNavigate={handleItemClick} />
            </HoverCardContent>
          </HoverCard>
        </div>
        {/*************************************************************
          NOTIFICATIONS
          **************************************************************/}
        <div className="relative my-0.5 px-3">
          <Collapsible
            open={isOpenSubMenu.notifications && isExpand}
            onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, notifications: value }))}
          >
            <SidebarMenuItem url={`/${locale}/notifications/push`} isExpand={isExpand} options={{ icon: BellIcon, onClick: handleItemClick }}>
              {t('sidebar_menu_notifications')}
            </SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <div>
                <SidebarMenuIndicator
                  isExpand={isExpand}
                  isActive={pathname.includes(`/${locale}/notifications/push`)}
                  isOpen={isOpenSubMenu.notifications}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent
              className={classNames(
                'mt-1 overflow-hidden rounded [&[data-state=closed]]:animate-collapsible-up [&[data-state=open]]:animate-collapsible-down'
              )}
            >
              <SubMenuNotifications type="list" onNavigate={handleItemClick} />
            </CollapsibleContent>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/notifications/push`} isExpand={isExpand} options={{ icon: BellIcon, onClick: handleItemClick }} />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-52 p-1" sideOffset={SUB_MENU_SIDE_OFFSET} alignOffset={SUB_MENU_ALIGN_OFFSET} side="right" align="start">
              <SubMenuNotifications type="dropdown" onNavigate={handleItemClick} />
            </HoverCardContent>
          </HoverCard>
        </div>
        {/*************************************************************
          FILES
          **************************************************************/}
        <div className="relative my-0.5 px-3">
          <Collapsible open={isOpenSubMenu.files && isExpand} onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, files: value }))}>
            <SidebarMenuItem url={`/${locale}/files`} isExpand={isExpand} options={{ icon: FoldersIcon, onClick: handleItemClick }}>
              {t('sidebar_menu_files')}
            </SidebarMenuItem>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/files`} isExpand={isExpand} options={{ icon: FoldersIcon, onClick: handleItemClick }} />
              </div>
            </HoverCardTrigger>
          </HoverCard>
        </div>
        {/*************************************************************
          AUDIT LOGS
          **************************************************************/}
        <div className="relative my-0.5 px-3">
          <Collapsible
            open={isOpenSubMenu.audit_logs && isExpand}
            onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, audit_logs: value }))}
          >
            <SidebarMenuItem url={`/${locale}/audit-logs`} isExpand={isExpand} options={{ icon: NotebookTabsIcon, onClick: handleItemClick }}>
              {t('sidebar_menu_audit_logs')}
            </SidebarMenuItem>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/audit-logs`} isExpand={isExpand} options={{ icon: NotebookTabsIcon, onClick: handleItemClick }} />
              </div>
            </HoverCardTrigger>
          </HoverCard>
        </div>
        {/*************************************************************
          CONTACTS
          **************************************************************/}
        <div className="relative my-0.5 px-3">
          <Collapsible open={isOpenSubMenu.contacts} onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, contacts: value }))}>
            <SidebarMenuItem url={`/${locale}/contacts`} isExpand={isExpand} options={{ icon: MessageSquareTextIcon, onClick: handleItemClick }}>
              {t('sidebar_menu_contacts')}
            </SidebarMenuItem>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem
                  url={`/${locale}/contacts`}
                  isExpand={isExpand}
                  options={{ icon: MessageSquareTextIcon, onClick: handleItemClick }}
                />
              </div>
            </HoverCardTrigger>
          </HoverCard>
        </div>
        {/*************************************************************
          FAQS
          **************************************************************/}
        <div className="relative my-0.5 px-3">
          <Collapsible open={isOpenSubMenu.faqs} onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, faqs: value }))}>
            <SidebarMenuItem url={`/${locale}/faqs`} isExpand={isExpand} options={{ icon: CircleHelpIcon, onClick: handleItemClick }}>
              {t('sidebar_menu_faqs')}
            </SidebarMenuItem>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/faqs`} isExpand={isExpand} options={{ icon: CircleHelpIcon, onClick: handleItemClick }} />
              </div>
            </HoverCardTrigger>
          </HoverCard>
        </div>
        {/*************************************************************
          SETTINGS
          **************************************************************/}
        <div className="relative my-0.5 px-3">
          <Collapsible
            open={isOpenSubMenu.settings && isExpand}
            onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, settings: value }))}
          >
            <SidebarMenuItem url={`/${locale}/settings/account`} isExpand={isExpand} options={{ icon: SettingsIcon, onClick: handleItemClick }}>
              {t('sidebar_menu_settings')}
            </SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <div>
                <SidebarMenuIndicator isExpand={isExpand} isActive={pathname.includes(`/${locale}/settings`)} isOpen={isOpenSubMenu.settings} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent
              className={classNames(
                'mt-1 overflow-hidden rounded [&[data-state=closed]]:animate-collapsible-up [&[data-state=open]]:animate-collapsible-down'
              )}
            >
              <SubMenuSettings type="list" onNavigate={handleItemClick} />
            </CollapsibleContent>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/settings/account`} isExpand={isExpand} options={{ icon: SettingsIcon, onClick: handleItemClick }} />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-52 p-1" sideOffset={SUB_MENU_SIDE_OFFSET} alignOffset={SUB_MENU_ALIGN_OFFSET} side="right" align="start">
              <SubMenuSettings type="dropdown" onNavigate={handleItemClick} />
            </HoverCardContent>
          </HoverCard>
        </div>
        {/*************************************************************
          PROFILE
          **************************************************************/}
        <div className="relative my-0.5 hidden px-3">
          <Collapsible
            open={isOpenSubMenu.profile && isExpand}
            onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, profile: value }))}
          >
            <SidebarMenuItem url={`/${locale}/profile/overview`} isExpand={isExpand} options={{ icon: BookUserIcon, onClick: handleItemClick }}>
              {t('sidebar_menu_profile')}
            </SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <div>
                <SidebarMenuIndicator isExpand={isExpand} isActive={pathname.includes(`/${locale}/profile`)} isOpen={isOpenSubMenu.profile} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent
              className={classNames(
                'mt-1 overflow-hidden rounded [&[data-state=closed]]:animate-collapsible-up [&[data-state=open]]:animate-collapsible-down'
              )}
            >
              <SubMenuProfile type="list" onNavigate={handleItemClick} />
            </CollapsibleContent>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/profile/overview`} isExpand={isExpand} options={{ icon: BookUserIcon, onClick: handleItemClick }} />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-52 p-1" sideOffset={SUB_MENU_SIDE_OFFSET} alignOffset={SUB_MENU_ALIGN_OFFSET} side="right" align="start">
              <SubMenuProfile type="dropdown" onNavigate={handleItemClick} />
            </HoverCardContent>
          </HoverCard>
        </div>
        {/*************************************************************
          DOCUMENTATION
          **************************************************************/}
        <div className="relative my-0.5 hidden px-3">
          <Collapsible
            open={isOpenSubMenu.documentation && isExpand}
            onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, documentation: value }))}
          >
            <SidebarMenuItem
              url={`/${locale}/documentation/getting-started`}
              isExpand={isExpand}
              options={{ icon: FileCode2Icon, onClick: handleItemClick }}
            >
              Documentation
            </SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <div>
                <SidebarMenuIndicator
                  isExpand={isExpand}
                  isActive={pathname.includes(`/${locale}/documentation`)}
                  isOpen={isOpenSubMenu.documentation}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent
              className={classNames(
                'mt-1 overflow-hidden rounded [&[data-state=closed]]:animate-collapsible-up [&[data-state=open]]:animate-collapsible-down'
              )}
            >
              <SubMenuDocumentation type="list" onNavigate={handleItemClick} />
            </CollapsibleContent>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem
                  url={`/${locale}/documentation/getting-started`}
                  isExpand={isExpand}
                  options={{ icon: FileCode2Icon, onClick: handleItemClick }}
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-52 p-1" sideOffset={SUB_MENU_SIDE_OFFSET} alignOffset={SUB_MENU_ALIGN_OFFSET} side="right" align="start">
              <SubMenuDocumentation type="dropdown" onNavigate={handleItemClick} />
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </div>
  );
};

export default SidebarNavigation;
