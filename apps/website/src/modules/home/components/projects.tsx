import React, { FC } from 'react';
import classNames from 'classnames';
import { CheckIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/react-web-ui-shadcn/components/ui/card';

import { ComponentBaseProps } from '@/interfaces/component.interface';

interface IProjectItem {
  title: string;
  description: string;
  features: string[];
}

const projectList: IProjectItem[] = [
  {
    title: 'Admin Portal',
    description: 'A content management system built on Shadcn UI.',
    features: [
      'Build with <strong class="text-primary">Vite</strong>',
      'Support TypeScript',
      'Internationalization',
      'Authentication',
      'Post Management',
      'User Management',
      'File Management',
      'Audit Logs',
      'Push Notifications',
      'Settings',
      'Unit testing',
      'End To End testing',
    ],
  },
  {
    title: 'API',
    description: 'Well-structured RESTful API with comprehensive documentation.',
    features: [
      'Build with <strong class="text-primary">Nest</strong>',
      'Support TypeScript',
      'Authentication',
      'Post Management',
      'User Management',
      'File Management',
      'Audit Logs',
      'Push Notifications',
      'Settings',
      'Unit testing',
      'End To End testing',
      'Full documentation',
    ],
  },
  {
    title: 'Mobile App',
    description: 'A cross-platform mobile application that can run on both iOS and Android.',
    features: [
      'Build with <strong class="text-primary">React Native</strong>',
      'Support TypeScript',
      'Authentication',
      'Push Notifications',
      'Settings',
    ],
  },
];

const Projects: FC<ComponentBaseProps> = ({ className }) => {
  return (
    <section id="projects" className={classNames('relative overflow-hidden py-14 sm:py-16', className)}>
      {/* <div className="glow-effect left-40 top-24 z-0 h-80 w-60"></div> */}
      <div className="container">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          <span className="bg-gradient-to-b from-primary/60 to-primary bg-clip-text text-transparent">Projects</span>
        </h2>
        <h3 className="pb-8 pt-4 text-center text-xl text-muted-foreground">
          Fully featured with the latest technologies, clean and tidy source code.
        </h3>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projectList.map((project: IProjectItem) => (
            <Card key={project.title} className="border-primary bg-primary/5 p-4">
              <CardHeader>
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <CardDescription className="text-base">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-4 space-y-3">
                  {project.features.map((feature: string) => (
                    <div key={feature} className="flex items-center">
                      <CheckIcon size={18} className="text-primary" />
                      <p className="ml-2" dangerouslySetInnerHTML={{ __html: feature }}></p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
