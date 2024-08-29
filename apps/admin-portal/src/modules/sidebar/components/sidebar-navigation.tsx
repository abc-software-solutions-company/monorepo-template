import { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  BellIcon,
  BookOpenTextIcon,
  BookUserIcon,
  CircleHelpIcon,
  FileCode2Icon,
  FileTextIcon,
  FoldersIcon,
  LayoutGridIcon,
  ListTreeIcon,
  MessageSquareTextIcon,
  NotebookTabsIcon,
  PackageIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~react-web-ui-shadcn/components/ui/collapsible';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '~react-web-ui-shadcn/components/ui/hover-card';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import { SUB_MENU_ALIGN_OFFSET, SUB_MENU_SIDE_OFFSET } from '../constants/sidebar.constant';

import SidebarMenuIndicator from './sidebar-menu-indicator';
import SidebarMenuItem from './sidebar-menu-item';
import CategoriesSubMenu from './sub-menu-categories';
import DocumentationSubMenu from './sub-menu-documentation';
import NotificationsSubMenu from './sub-menu-notifications';
import PostsSubMenu from './sub-menu-posts';
import ProductsSubMenu from './sub-menu-products';
import SubMenuProfile from './sub-menu-profile';
import SettingsSubMenu from './sub-menu-settings';
import UsersSubMenu from './sub-menu-users';

type SidebarNavigationProps = ComponentBaseProps & {
  isExpand: boolean;
};

const SidebarNavigation: FC<SidebarNavigationProps> = ({ className, isExpand }) => {
  const t = useTranslations();
  const locale = useLocale();
  const { pathname } = useLocation();

  const [isOpenSubMenu, setIsOpenSubMenu] = useState({
    dashboard: false,
    categories: false,
    contents: false,
    posts: false,
    products: false,
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
      categories: pathname.includes(`/${locale}/categories`),
      contents: pathname.includes(`/${locale}/contents`),
      posts: pathname.includes(`/${locale}/posts`),
      products: pathname.includes(`/${locale}/products`),
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
  }, [pathname]);

  useEffect(() => {}, [isExpand]);

  return (
    <div className={classNames('nap-sidebar-nav scrollbar relative h-full overflow-y-auto', className)}>
      <div className="nap-sidebar-expanded relative overflow-x-hidden">
        {/*************************************************************
          DASHBOARD
          **************************************************************/}
        <div className="relative my-0.5 px-3">
          <Collapsible open={isOpenSubMenu.dashboard} onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, dashboard: value }))}>
            <SidebarMenuItem url={`/${locale}/dashboard`} isExpand={isExpand} options={{ icon: LayoutGridIcon }}>
              {t('sidebar_menu_dashboard')}
            </SidebarMenuItem>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/dashboard`} isExpand={isExpand} options={{ icon: LayoutGridIcon }} />
              </div>
            </HoverCardTrigger>
          </HoverCard>
        </div>
        {/*************************************************************
          CATEGORIES
          **************************************************************/}
        <div className="relative my-0.5 px-3">
          <Collapsible
            open={isOpenSubMenu.categories && isExpand}
            onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, categories: value }))}
          >
            <SidebarMenuItem url={`/${locale}/categories`} isExpand={isExpand} options={{ icon: ListTreeIcon }}>
              {t('sidebar_menu_categories')}
            </SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <div>
                <SidebarMenuIndicator isExpand={isExpand} isActive={pathname.includes(`/${locale}/categories`)} isOpen={isOpenSubMenu.categories} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent
              className={classNames(
                'mt-1 overflow-hidden rounded [&[data-state=closed]]:animate-collapsible-up [&[data-state=open]]:animate-collapsible-down'
              )}
            >
              <CategoriesSubMenu type="list" />
            </CollapsibleContent>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/categories`} isExpand={isExpand} options={{ icon: ListTreeIcon }} />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-52 p-1" sideOffset={SUB_MENU_SIDE_OFFSET} alignOffset={SUB_MENU_ALIGN_OFFSET} side="right" align="start">
              <CategoriesSubMenu type="dropdown" />
            </HoverCardContent>
          </HoverCard>
        </div>
        {/*************************************************************
          CONTENTS
          **************************************************************/}
        <div className="relative my-0.5 px-3">
          <Collapsible open={isOpenSubMenu.contents} onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, contents: value }))}>
            <SidebarMenuItem url={`/${locale}/contents`} isExpand={isExpand} options={{ icon: FileTextIcon }}>
              {t('sidebar_menu_contents')}
            </SidebarMenuItem>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/contents`} isExpand={isExpand} options={{ icon: FileTextIcon }} />
              </div>
            </HoverCardTrigger>
          </HoverCard>
        </div>
        {/*************************************************************
          POSTS
          **************************************************************/}
        <div className="relative my-0.5 px-3">
          <Collapsible open={isOpenSubMenu.posts && isExpand} onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, posts: value }))}>
            <SidebarMenuItem url={`/${locale}/posts`} isExpand={isExpand} options={{ icon: BookOpenTextIcon }}>
              {t('sidebar_menu_posts')}
            </SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <div>
                <SidebarMenuIndicator isExpand={isExpand} isActive={pathname.includes(`/${locale}/posts`)} isOpen={isOpenSubMenu.posts} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent
              className={classNames(
                'mt-1 overflow-hidden rounded [&[data-state=closed]]:animate-collapsible-up [&[data-state=open]]:animate-collapsible-down'
              )}
            >
              <PostsSubMenu type="list" />
            </CollapsibleContent>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/posts`} isExpand={isExpand} options={{ icon: BookOpenTextIcon }} />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-52 p-1" sideOffset={SUB_MENU_SIDE_OFFSET} alignOffset={SUB_MENU_ALIGN_OFFSET} side="right" align="start">
              <PostsSubMenu type="dropdown" />
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
            <SidebarMenuItem url={`/${locale}/products`} isExpand={isExpand} options={{ icon: PackageIcon }}>
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
              <ProductsSubMenu type="list" />
            </CollapsibleContent>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/products`} isExpand={isExpand} options={{ icon: PackageIcon }} />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-52 p-1" sideOffset={SUB_MENU_SIDE_OFFSET} alignOffset={SUB_MENU_ALIGN_OFFSET} side="right" align="start">
              <ProductsSubMenu type="dropdown" />
            </HoverCardContent>
          </HoverCard>
        </div>
        {/*************************************************************
          USERS
          **************************************************************/}
        <div className="relative my-0.5 px-3">
          <Collapsible open={isOpenSubMenu.users && isExpand} onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, users: value }))}>
            <SidebarMenuItem url={`/${locale}/users`} isExpand={isExpand} options={{ icon: UsersIcon }}>
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
              <UsersSubMenu type="list" />
            </CollapsibleContent>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/users`} isExpand={isExpand} options={{ icon: UsersIcon }} />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-52 p-1" sideOffset={SUB_MENU_SIDE_OFFSET} alignOffset={SUB_MENU_ALIGN_OFFSET} side="right" align="start">
              <UsersSubMenu type="dropdown" />
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
            <SidebarMenuItem url={`/${locale}/notifications/push`} isExpand={isExpand} options={{ icon: BellIcon }}>
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
              <NotificationsSubMenu type="list" />
            </CollapsibleContent>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/notifications/push`} isExpand={isExpand} options={{ icon: BellIcon }} />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-52 p-1" sideOffset={SUB_MENU_SIDE_OFFSET} alignOffset={SUB_MENU_ALIGN_OFFSET} side="right" align="start">
              <NotificationsSubMenu type="dropdown" />
            </HoverCardContent>
          </HoverCard>
        </div>
        {/*************************************************************
          FILES
          **************************************************************/}
        <div className="relative my-0.5 px-3">
          <Collapsible open={isOpenSubMenu.files && isExpand} onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, files: value }))}>
            <SidebarMenuItem url={`/${locale}/files`} isExpand={isExpand} options={{ icon: FoldersIcon }}>
              {t('sidebar_menu_files')}
            </SidebarMenuItem>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/files`} isExpand={isExpand} options={{ icon: FoldersIcon }} />
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
            <SidebarMenuItem url={`/${locale}/audit-logs`} isExpand={isExpand} options={{ icon: NotebookTabsIcon }}>
              {t('sidebar_menu_audit_logs')}
            </SidebarMenuItem>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/audit-logs`} isExpand={isExpand} options={{ icon: NotebookTabsIcon }} />
              </div>
            </HoverCardTrigger>
          </HoverCard>
        </div>
        {/*************************************************************
          CONTACTS
          **************************************************************/}
        <div className="relative my-0.5 px-3">
          <Collapsible open={isOpenSubMenu.contacts} onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, contacts: value }))}>
            <SidebarMenuItem url={`/${locale}/contacts`} isExpand={isExpand} options={{ icon: MessageSquareTextIcon }}>
              {t('sidebar_menu_contacts')}
            </SidebarMenuItem>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/contacts`} isExpand={isExpand} options={{ icon: MessageSquareTextIcon }} />
              </div>
            </HoverCardTrigger>
          </HoverCard>
        </div>
        {/*************************************************************
          FAQS
          **************************************************************/}
        <div className="relative my-0.5 px-3">
          <Collapsible open={isOpenSubMenu.faqs} onOpenChange={value => setIsOpenSubMenu(prevState => ({ ...prevState, faqs: value }))}>
            <SidebarMenuItem url={`/${locale}/faqs`} isExpand={isExpand} options={{ icon: CircleHelpIcon }}>
              {t('sidebar_menu_faqs')}
            </SidebarMenuItem>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/faqs`} isExpand={isExpand} options={{ icon: CircleHelpIcon }} />
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
            <SidebarMenuItem url={`/${locale}/settings/account`} isExpand={isExpand} options={{ icon: SettingsIcon }}>
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
              <SettingsSubMenu type="list" />
            </CollapsibleContent>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/settings/account`} isExpand={isExpand} options={{ icon: SettingsIcon }} />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-52 p-1" sideOffset={SUB_MENU_SIDE_OFFSET} alignOffset={SUB_MENU_ALIGN_OFFSET} side="right" align="start">
              <SettingsSubMenu type="dropdown" />
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
            <SidebarMenuItem url={`/${locale}/profile/overview`} isExpand={isExpand} options={{ icon: BookUserIcon }}>
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
              <SubMenuProfile type="list" />
            </CollapsibleContent>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/profile/overview`} isExpand={isExpand} options={{ icon: BookUserIcon }} />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-52 p-1" sideOffset={SUB_MENU_SIDE_OFFSET} alignOffset={SUB_MENU_ALIGN_OFFSET} side="right" align="start">
              <SubMenuProfile type="dropdown" />
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
            <SidebarMenuItem url={`/${locale}/documentation/getting-started`} isExpand={isExpand} options={{ icon: FileCode2Icon }}>
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
              <DocumentationSubMenu type="list" />
            </CollapsibleContent>
          </Collapsible>
          <HoverCard openDelay={250} closeDelay={250}>
            <HoverCardTrigger asChild className={classNames('absolute top-0 opacity-0', isExpand && 'invisible')}>
              <div>
                <SidebarMenuItem url={`/${locale}/documentation/getting-started`} isExpand={isExpand} options={{ icon: FileCode2Icon }} />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-52 p-1" sideOffset={SUB_MENU_SIDE_OFFSET} alignOffset={SUB_MENU_ALIGN_OFFSET} side="right" align="start">
              <DocumentationSubMenu type="dropdown" />
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </div>
  );
};

export default SidebarNavigation;
