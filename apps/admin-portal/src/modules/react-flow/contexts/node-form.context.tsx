import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { RuleFormValues, RuleSetFormValues } from '../interfaces/rule.interface';

type FormValues = RuleSetFormValues | RuleFormValues;

interface IRuleContextType {
  registerForm: (nodeId: string, form: UseFormReturn<FormValues>) => void;
  unregisterForm: (nodeId: string) => void;
  getForm: (nodeId: string) => UseFormReturn<FormValues> | undefined;
  getAllForms: () => {
    [nodeId: string]: UseFormReturn<FormValues>;
  };
}

const RuleContext = createContext<IRuleContextType | undefined>(undefined);

export const RuleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const formRefsRef = useRef<{
    [nodeId: string]: UseFormReturn<FormValues>;
  }>({});

  const registerForm = useCallback((nodeId: string, form: UseFormReturn<FormValues>) => {
    formRefsRef.current[nodeId] = form;
  }, []);

  const unregisterForm = useCallback((nodeId: string) => {
    delete formRefsRef.current[nodeId];
  }, []);

  const getForm = useCallback((nodeId: string) => {
    return formRefsRef.current[nodeId];
  }, []);

  const getAllForms = useCallback(() => {
    return formRefsRef.current;
  }, []);

  const value: IRuleContextType = {
    registerForm,
    unregisterForm,
    getForm,
    getAllForms,
  };

  return <RuleContext.Provider value={value}>{children}</RuleContext.Provider>;
};

export const useRuleForm = () => {
  const context = useContext(RuleContext);

  if (context === undefined) {
    throw new Error('useRule must be used within a RuleProvider');
  }

  return context;
};

export const useNodeForm = <T extends FormValues>(nodeId: string, form: UseFormReturn<T>) => {
  const { registerForm, unregisterForm } = useRuleForm();

  useEffect(() => {
    registerForm(nodeId, form as unknown as UseFormReturn<FormValues>);

    return () => {
      unregisterForm(nodeId);
    };
  }, [nodeId, form, registerForm, unregisterForm]);

  return form;
};

export const useRuleValidation = () => {
  const { getAllForms } = useRuleForm();

  const validateAllForms = useCallback(async () => {
    const forms = getAllForms();

    try {
      const validationResults = await Promise.all(
        Object.entries(forms).map(async ([nodeId, form]) => {
          await form.handleSubmit(data => {
            return data;
          })();

          const isValid = await form.trigger();

          return { nodeId, isValid, errors: form.formState.errors };
        })
      );

      const invalidForms = validationResults.filter(result => !result.isValid);

      if (invalidForms.length > 0) {
        return { isValid: false, errors: invalidForms };
      }

      return { isValid: true, errors: [] };
    } catch (error) {
      return { isValid: false, errors: [error] };
    }
  }, [getAllForms]);

  return { validateAllForms };
};
