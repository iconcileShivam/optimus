import * as React from 'react';
import { IFieldProps } from '../index';
import { FormikValues } from 'formik';
import { Switch, SwitchProps, FormControlLabel } from '@mui/material';
import { get } from 'lodash';


export interface IMUISwitchProps extends SwitchProps {
    label?: string
}

export interface IProps extends IFieldProps {
    fieldProps?: IMUISwitchProps
}

export const MUISwitch: React.FC<IProps> = (props) => {
    const { formikProps = {} as FormikValues, fieldProps = {} as IMUISwitchProps, isReadOnly = false } = props;
    const { label, ...switchProps } = fieldProps;
    const value = get(formikProps, `values.${fieldProps.name}`);

    const handleOnChange = () => {
        formikProps.setFieldValue(fieldProps.name, !value);
    }
    console.log('Switch props', { ...{ ...switchProps, disabled: (switchProps.disabled || isReadOnly) } });
    return (
        <FormControlLabel
            control={
                <Switch
                    checked={!!value}
                    onChange={handleOnChange}
                    onBlur={formikProps.handleBlur}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                    value={value}
                    {...{ ...switchProps, disabled: (switchProps.disabled || isReadOnly) }}
                />
            }
            label={label || ''}
        />
    )
}