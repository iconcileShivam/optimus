import * as React from 'react';
import { FormikValues } from 'formik';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { IFieldProps } from '../index';
import { get, isEqual } from 'lodash';
import { getFieldError } from '../Utils';
import MUIReadOnly from './MUIReadOnly';

export interface IProps extends IFieldProps {
    fieldProps?: TextFieldProps
}

export const MUITextField: React.FC<IProps> = React.memo((props) => {
    const { fieldProps = {} as TextFieldProps, formikProps = {} as FormikValues, isReadOnly = false } = props;
    const fieldError = getFieldError((fieldProps.name || ''), formikProps);
    const updatedProps = {
        ...fieldProps,
        error: !!fieldError,
        helperText: fieldError || fieldProps.helperText || '',
        onChange: formikProps.handleChange,
        onBlur: formikProps.handleBlur,
        value: get(formikProps, `values.${fieldProps.name}`) ?? ''
    };
    if (isReadOnly) {
        return (<MUIReadOnly label={updatedProps.label} value={updatedProps.value} />);
    }
    return (
        <TextField {...updatedProps} />
    )
}, (p, n) => {

    p.fieldProps!.id = '1'
    n.fieldProps!.id = '1'

    const pFieldName = p.fieldProps?.name || ''
    const nFieldName = n.fieldProps?.name || ''

    // ========== Checking for getFieldError

    // Field Value
    if (!isEqual(get(p.formikProps, `values.${pFieldName}`), get(n.formikProps, `values.${nFieldName}`))) {
        return false
    }

    // Field Error
    if (!isEqual(get(p.formikProps, `errors.${pFieldName}`), get(n.formikProps, `errors.${nFieldName}`))) {
        return false
    }

    // get(formikProps, `touched.${fieldName}`)
    if (!isEqual(get(p.formikProps, `touched.${pFieldName}`), get(n.formikProps, `touched.${nFieldName}`))) {
        return false
    }

    // formikProps.submitCount
    if (!isEqual(p.formikProps?.submitCount, n.formikProps?.submitCount)) {
        return false
    }

    // Readonly Prop
    if (!isEqual(p.isReadOnly, n.isReadOnly)) {
        return false
    }

    // Field Props
    if (!isEqual(p.fieldProps, n.fieldProps)) {
        return false
    }

    return true
})