import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import { Colors, ds } from '@repo/react-native-design-system';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@repo/react-native-ui-core/components/accordion';
import Button from '@repo/react-native-ui-core/components/button';
import Checkbox from '@repo/react-native-ui-core/components/checkbox';
import Divider from '@repo/react-native-ui-core/components/divider';
import Heading from '@repo/react-native-ui-core/components/heading';
import Icon from '@repo/react-native-ui-core/components/icon';
import Input from '@repo/react-native-ui-core/components/input';
import Loading from '@repo/react-native-ui-core/components/loading';
import Pagination from '@repo/react-native-ui-core/components/pagination';
import ProgressBar from '@repo/react-native-ui-core/components/progressbar';
import { RadioGroup, RadioGroupItem } from '@repo/react-native-ui-core/components/radio-group';
import Select from '@repo/react-native-ui-core/components/select';
import StatusBar from '@repo/react-native-ui-core/components/statusbar';
import Switcher from '@repo/react-native-ui-core/components/swicher';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/react-native-ui-core/components/tabs';
import Text from '@repo/react-native-ui-core/components/text';
import View from '@repo/react-native-ui-core/components/view';

import SafeViewArea from '@/components/safe-view-area';

import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { AuthenticatedStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';

import log from '@/utils/logger.util';

function UIScreen({ navigation, route }: AuthenticatedStackProps<'UI'>) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <SafeViewArea spacingBottom={true}>
      <StatusBar />
      <NavigationHeader title={t(getHeaderTitle(route.name))} leftFunc={() => navigation.goBack()} leftComponent={<Icon name="ChevronLeft" />} />
      <Divider />
      <ScrollView style={[ds.px10]}>
        <Tabs defaultValue="tab-other-components">
          <TabsList>
            <TabsTrigger value="tab-typography" text="Typo" />
            <TabsTrigger value="tab-button" text="Button" />
            <TabsTrigger value="tab-input" text="Input" />
            <TabsTrigger value="tab-other-components" text="Other Components" />
          </TabsList>
          <TabsContent value="tab-typography">
            <Heading text="Heading 1" />
            <Heading as={'h2'}>Heading 2</Heading>
            <Heading as={'h3'}>Heading 3</Heading>
            <Heading as={'h4'}>Heading 4</Heading>
            <Heading as={'h5'}>Heading 5</Heading>
            <Heading as={'h6'}>Heading 6</Heading>
            <Text>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt dignissimos atque error ratione tempora iusto vel et accusamus!
              Perspiciatis quae alias quod nobis iste aliquid dolorem fugit culpa illo maiores repellat doloribus, rerum quaerat libero, veritatis
              natus.
            </Text>
            <Text style={[ds.mt10, ds.textJustify]}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt dignissimos atque error ratione tempora iusto vel et accusamus!
              Perspiciatis quae alias quod nobis iste aliquid dolorem fugit culpa illo maiores repellat doloribus, rerum quaerat libero, veritatis
              natus.
            </Text>
          </TabsContent>
          <TabsContent value="tab-button">
            <View style={[ds.column, ds.gap10]}>
              <Heading as="h3">Normal</Heading>
              <View style={[ds.row, ds.gap10, ds.itemsCenter]}>
                <Button>Button</Button>
                <Button variant="outlined">Button</Button>
                <Button variant="danger">Button</Button>
              </View>
              <Heading as="h3">Disabled</Heading>
              <View style={[ds.row, ds.gap10, ds.itemsCenter]}>
                <Button disabled>Button</Button>
                <Button disabled variant="outlined">
                  Button
                </Button>
                <Button disabled variant="danger">
                  Button
                </Button>
              </View>
              <Heading as="h3">Sizes</Heading>
              <View style={[ds.row, ds.gap10, ds.itemsCenter]}>
                <Button size="sm">Button</Button>
                <Button size="md">Button</Button>
                <Button size="lg">Button</Button>
              </View>
              <Heading as="h3">Loading</Heading>
              <View style={[ds.column, ds.gap10, ds.itemsCenter]}>
                <Button
                  size="sm"
                  style={ds.minW160}
                  submittingText="Saving..."
                  submittedText="Saved"
                  onPress={async () => {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                  }}
                >
                  Save
                </Button>
                <Button
                  size="md"
                  style={ds.minW160}
                  submittingText="Saving..."
                  submittedText="Saved"
                  onPress={async () => {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                  }}
                >
                  Save
                </Button>
                <Button
                  size="lg"
                  style={ds.minW160}
                  submittingText="Saving..."
                  submittedText="Saved"
                  onPress={async () => {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                  }}
                >
                  Save
                </Button>
              </View>
            </View>
          </TabsContent>
          <TabsContent value="tab-input">
            <View style={[ds.column, ds.gap10]}>
              <Input />
              <Input />
              <Select
                showSearch={true}
                items={[
                  { id: 'usa', label: 'USA' },
                  { id: 'china', label: 'China' },
                  { id: 'japan', label: 'Japan' },
                  { id: 'korea', label: 'Korea' },
                  { id: 'australia', label: 'Australia' },
                  { id: 'indonesia', label: 'Indonesia' },
                  { id: 'canada', label: 'Canada' },
                  { id: 'france', label: 'France' },
                  { id: 'germany', label: 'Germany' },
                  { id: 'spain', label: 'Spain' },
                  { id: 'italy', label: 'Italy' },
                  { id: 'netherlands', label: 'Netherlands' },
                  { id: 'belgium', label: 'Belgium' },
                  { id: 'denmark', label: 'Denmark' },
                  { id: 'finland', label: 'Finland' },
                  { id: 'sweden', label: 'Sweden' },
                  { id: 'norway', label: 'Norway' },
                  { id: 'ireland', label: 'Ireland' },
                  { id: 'portugal', label: 'Portugal' },
                  { id: 'poland', label: 'Poland' },
                  { id: 'hungary', label: 'Hungary' },
                  { id: 'romania', label: 'Romania' },
                  { id: 'bulgaria', label: 'Bulgaria' },
                  { id: 'greece', label: 'Greece' },
                  { id: 'vietnam', label: 'Vietnam' },
                ]}
                value={'usa'}
                onValueChange={item => log.debug('Selected item:', item)}
              />
              <RadioGroup defaultValue="option1" direction="vertical" onValueChange={value => log.debug('Selected value:', value)}>
                <RadioGroupItem value="option1" label="Option 1" />
                <RadioGroupItem disabled value="option2" label="Option 2" />
                <RadioGroupItem value="option3" label="Option 3" />
              </RadioGroup>
              <Checkbox label="Checkbox 1" checked={false} onValueChange={isChecked => log.debug('Checkbox is checked:', isChecked)} />
              <Checkbox disabled label="Checkbox 2" checked={false} onValueChange={isChecked => log.debug('Checkbox is checked:', isChecked)} />
              <Switcher checked={false} onValueChange={isChecked => log.debug('Checkbox is checked:', isChecked)} />
              <Switcher disabled checked={false} onValueChange={isChecked => log.debug('Checkbox is checked:', isChecked)} />
            </View>
          </TabsContent>
          <TabsContent value="tab-other-components">
            <Accordion type="single" collapsible={true} style={[ds.column, ds.gap6]}>
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>Yes. It comes with default styles that matches the other components' aesthetic.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is it animated?</AccordionTrigger>
                <AccordionContent>Yes. It's animated by default, but you can disable it if you prefer.</AccordionContent>
              </AccordionItem>
            </Accordion>
            <Text>{`Current Page: ${currentPage}`}</Text>
            <Heading as="h5" text="Full" />
            <Pagination totalItems={100} currentPage={currentPage} onChange={page => setCurrentPage(page)} />
            <Heading as="h5" text="Minimal" />
            <Pagination type="minimal" totalItems={100} currentPage={currentPage} onChange={page => setCurrentPage(page)} />
            <View style={[ds.column, ds.gap10]}>
              <ProgressBar />
              <ProgressBar value={10} barColor={Colors.blue[500]} trackColor={Colors.gray[50]} />
              <ProgressBar value={30} barColor={Colors.cyan[500]} height={12} />
              <ProgressBar value={50} barColor={Colors.pink[500]} height={16} showText={true} text="50/100" />
            </View>
            <Divider />
            <Heading as="h4" text="Loading" />
            <Loading size={64} thickness={6} />
            <Heading as="h4" text="Image" />
          </TabsContent>
        </Tabs>
      </ScrollView>
    </SafeViewArea>
  );
}

export default UIScreen;
